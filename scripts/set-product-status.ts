/**
 * Product visibility importer — flips `status` and `isVisible`, nothing else.
 *
 * Publishing is the one action with an immediate public effect, so it is kept
 * out of every other script: the content, price, image and create importers all
 * treat `status` and `isVisible` as fields they must never write (the create
 * importer sets them once, at creation, and never again).
 *
 * It writes exactly two fields: `status` and `isVisible`, which are kept
 * consistent — `active` implies visible, `draft` and `archived` imply hidden.
 *
 * Safety properties:
 *   - Activating a product requires it to be publishable: a non-BLOCKED product
 *     on the allowlist, or a BLOCKED one carrying a complete override record.
 *     Deactivating is always permitted, so this can always pull a page down.
 *   - A product already in the requested state is skipped, so reruns are no-ops.
 *
 * Gates (all required):
 *   --execute
 *   --i-understand-this-writes-to-the-database
 *   PRODUCT_STATUS_ALLOW_WRITES=true
 *   --acknowledge-remote-read
 *   --allow-production-target
 *   --only <slug,slug>
 *   --status <draft|active|archived>
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

import { loadProducts } from './product-import/content.js'
import { loadApprovals, isPublishable, type Approvals } from './product-import/approvals.js'

export const STATUS_WRITABLE_FIELDS = ['status', 'isVisible'] as const
export type ProductStatus = 'draft' | 'active' | 'archived'
export const VALID_STATUSES: ProductStatus[] = ['draft', 'active', 'archived']

export class StatusPayloadViolation extends Error {}

/** Hard guard. Reads no flag. */
export function assertStatusOnlyPayload(data: Record<string, unknown>, slug: string): void {
  const allowed = new Set<string>(STATUS_WRITABLE_FIELDS as readonly string[])
  const extra = Object.keys(data).filter((k) => !allowed.has(k))
  if (extra.length > 0) {
    throw new StatusPayloadViolation(
      `REFUSED [${slug}]: status payload contains non-status field(s): ${extra.join(', ')}.`,
    )
  }
  if (!VALID_STATUSES.includes(data.status as ProductStatus)) {
    throw new StatusPayloadViolation(`REFUSED [${slug}]: invalid status "${String(data.status)}".`)
  }
  if (typeof data.isVisible !== 'boolean') {
    throw new StatusPayloadViolation(`REFUSED [${slug}]: isVisible must be a boolean.`)
  }
  if (data.isVisible !== (data.status === 'active')) {
    throw new StatusPayloadViolation(
      `REFUSED [${slug}]: isVisible (${String(data.isVisible)}) contradicts status "${String(data.status)}".`,
    )
  }
}

export function buildStatusPayload(status: ProductStatus, slug: string): Record<string, unknown> {
  const data = { status, isVisible: status === 'active' }
  assertStatusOnlyPayload(data, slug)
  return data
}

/**
 * Whether a slug may be moved to the requested status. Making a product public
 * is gated on publishability; taking it down never is.
 */
export function canSetStatus(
  slug: string,
  status: ProductStatus,
  approvals: Approvals = loadApprovals(),
): { ok: boolean; reason?: string } {
  if (status !== 'active') return { ok: true }
  const product = loadProducts().products.find((p) => p.slug === slug)
  if (!product) return { ok: false, reason: 'NO_GENERATED_CONTENT' }
  const publishable = isPublishable(product, approvals)
  if (!publishable.ok) return { ok: false, reason: publishable.reason }
  return { ok: true }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]) {
  const has = (f: string) => argv.includes(f)
  const val = (f: string) => {
    const i = argv.indexOf(f)
    return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null
  }
  return {
    execute: has('--execute'),
    understands: has('--i-understand-this-writes-to-the-database'),
    ackRead: has('--acknowledge-remote-read'),
    allowProd: has('--allow-production-target'),
    status: val('--status'),
    only: (val('--only') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const envGate = process.env.PRODUCT_STATUS_ALLOW_WRITES === 'true'
  const unmet: string[] = []
  if (!opts.execute) unmet.push('--execute')
  if (!opts.understands) unmet.push('--i-understand-this-writes-to-the-database')
  if (!envGate) unmet.push('PRODUCT_STATUS_ALLOW_WRITES=true')
  const writing = unmet.length === 0

  const line = (s = '') => console.log(s)
  const h = (t: string) => {
    line()
    line('-'.repeat(78))
    line(t)
    line('-'.repeat(78))
  }

  line('-'.repeat(78))
  line('Amino Based - product visibility importer')
  line('-'.repeat(78))
  line('  mode                 ' + (writing ? 'EXECUTE (writes enabled)' : 'DRY RUN (no writes)'))
  line('  writes only          ' + STATUS_WRITABLE_FIELDS.join(', '))
  for (const u of unmet) line('    unmet gate: ' + u)

  if (!opts.status || !VALID_STATUSES.includes(opts.status as ProductStatus)) {
    console.error(`\nREFUSED: --status must be one of ${VALID_STATUSES.join(', ')}.`)
    process.exit(2)
  }
  const status = opts.status as ProductStatus
  if (opts.only.length === 0) {
    console.error('\nREFUSED: --only <slug,...> is required.')
    process.exit(2)
  }
  line('  target status        ' + status + (status === 'active' ? ' (PUBLICLY VISIBLE)' : ' (hidden)'))
  line('  restricted to        ' + opts.only.length + ' slug(s)')

  const uri = process.env.DATABASE_URI ?? ''
  const host = (uri.match(/@([^:/?]+)/) ?? [])[1] ?? '(unknown)'
  const isLocal = /^(localhost|127\.0\.0\.1|::1)$/.test(host)
  if (!isLocal && !opts.ackRead) {
    console.error(`\nREFUSED: host "${host}" is not local. Pass --acknowledge-remote-read.`)
    process.exit(2)
  }
  if (!isLocal && writing && !opts.allowProd) {
    console.error(`\nREFUSED: refusing to WRITE to non-local host "${host}" without --allow-production-target.`)
    process.exit(2)
  }
  line('  database host        ' + host)

  const { getPayload } = await import('payload')
  const { default: cfg } = await import('../payload.config')
  const payload = await getPayload({ config: cfg })

  const res = await payload.find({ collection: 'products', limit: 500, depth: 0, pagination: false })
  const live = new Map<string, any>()
  for (const d of res.docs as any[]) live.set(d.slug, d)
  const approvals = loadApprovals()

  h('Plan')
  const actionable: string[] = []
  for (const slug of opts.only) {
    const doc = live.get(slug)
    if (!doc) {
      line(`  ${slug.padEnd(28)} NOT IN DATABASE — skipped`)
      continue
    }
    if (doc.status === status && doc.isVisible === (status === 'active')) {
      line(`  ${slug.padEnd(28)} already ${status} — skipped`)
      continue
    }
    const allowed = canSetStatus(slug, status, approvals)
    if (!allowed.ok) {
      line(`  ${slug.padEnd(28)} REFUSED: ${allowed.reason}`)
      continue
    }
    actionable.push(slug)
    line(`  ${slug.padEnd(28)} ${doc.status}/${doc.isVisible} -> ${status}/${status === 'active'}`)
  }

  h('Summary')
  line('  would change         ' + actionable.length)

  if (!writing) {
    h('Dry run complete')
    line('  0 database writes.')
    process.exit(0)
  }

  h('EXECUTE')
  let updated = 0
  const failures: { slug: string; error: string }[] = []
  for (const slug of actionable) {
    try {
      const data = buildStatusPayload(status, slug)
      assertStatusOnlyPayload(data, slug)
      await payload.update({ collection: 'products', id: live.get(slug).id, data: data as never })
      updated += 1
      line('  set ' + status + '  ' + slug)
    } catch (e) {
      failures.push({ slug, error: (e as Error).message })
      console.error('  FAILED   ' + slug + ': ' + (e as Error).message)
    }
  }

  h('Result')
  line('  updated ' + updated + '   failures ' + failures.length)
  for (const f of failures) line('    ' + f.slug + ': ' + f.error)
  process.exit(failures.length > 0 ? 1 : 0)
}

if (process.argv[1] && /[\\/]set-product-status\.ts$/.test(process.argv[1])) {
  await main()
}
