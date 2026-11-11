/**
 * Product creation importer — for catalogue entries that do not yet exist.
 *
 * Why this is its own script.
 *
 * `scripts/import-generated-products.ts` cannot create a product. Its create
 * branch is unreachable: at line ~318 it assigns `data.images` for any product
 * with no existing imagery (which every create is), and the very next guard,
 * `assertNoImageOrMediaFields`, refuses `images` in every mode. That guard is
 * deliberate and pinned by tests, so it is NOT relaxed. The consequence is that
 * creation needs a separate path.
 *
 * A create is inherently multi-field: a product cannot exist without a name, a
 * slug and a price. So unlike the field-scoped importers, this script writes a
 * fixed, closed set of fields — and `assertCreatePayload` refuses anything
 * outside it, so the set can never widen by accident.
 *
 * Sources, each already verified by its own test suite:
 *   - name            lib/masterCatalogData.ts via resolveCanonicalProductName
 *   - 12 content fields  the generated JSON via buildContentPayload
 *   - price/variants  the supplied CSV via buildPricePlan
 *   - images          the image directory via resolveProductImages
 *
 * Safety properties:
 *   - A slug that already exists is SKIPPED. This script only ever creates.
 *   - Products are created as DRAFT and not visible unless --create-status
 *     active is passed explicitly.
 *   - BLOCKED products are refused, and approval is required, exactly as in
 *     the content importer.
 *   - Media already uploaded is reused by stem, so a rerun uploads nothing.
 *
 * Gates (all required):
 *   --execute
 *   --i-understand-this-writes-to-the-database
 *   CREATE_PRODUCTS_ALLOW_WRITES=true
 *   --acknowledge-remote-read      (to read a non-local database at all)
 *   --allow-production-target      (to write to a production host)
 *   --only <slug,slug>             (required; there is no "all" shortcut)
 *
 * Default is a dry run that prints the plan and writes nothing.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

import fs from 'fs'

import { loadProducts } from './product-import/content.js'
import { loadApprovals, isPublishable, type Approvals } from './product-import/approvals.js'
import { buildContentPayload } from './product-import/plan.js'
import { resolveCanonicalProductName } from './product-import/catalog.js'
import { loadRenameManifest, resolveProductImages, mediaLookupStem } from './product-import/images.js'
import { buildPricePlan } from './import-prices-variants.js'
import { CONTENT_FIELD_KEYS } from './product-import/types.js'

/** The closed set of fields a create may write. Nothing else is permitted. */
export const CREATE_WRITABLE_FIELDS = [
  ...CONTENT_FIELD_KEYS,
  'name',
  'slug',
  'status',
  'isVisible',
  'images',
  'price',
  'salePrice',
  'hasVariants',
  'variants',
  'stock',
] as const

/** Never written, even on a create. */
export const CREATE_FORBIDDEN_FIELDS = [
  'sku', 'bulkBundles', 'categories', 'coaFile', 'coaBatchNumber', 'coaPurity',
  'coaAnalyzedDate', 'isBestSeller', 'averageRating', 'reviewCount', 'weight',
  'dimensions',
] as const

export class CreatePayloadViolation extends Error {}

/** Hard guard. Reads no flag, by the same contract the other guards hold. */
export function assertCreatePayload(data: Record<string, unknown>, slug: string): void {
  const allowed = new Set<string>(CREATE_WRITABLE_FIELDS as readonly string[])
  const extra = Object.keys(data).filter((k) => !allowed.has(k))
  if (extra.length > 0) {
    throw new CreatePayloadViolation(
      `REFUSED [${slug}]: create payload contains unpermitted field(s): ${extra.join(', ')}.`,
    )
  }
  for (const required of ['name', 'slug', 'price', 'status']) {
    if (data[required] === undefined || data[required] === null || data[required] === '') {
      throw new CreatePayloadViolation(`REFUSED [${slug}]: create payload is missing ${required}.`)
    }
  }
  if (data.slug !== slug) {
    throw new CreatePayloadViolation(`REFUSED [${slug}]: payload slug "${String(data.slug)}" does not match.`)
  }
  if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price <= 0) {
    throw new CreatePayloadViolation(`REFUSED [${slug}]: price must be a positive number.`)
  }
  if (data.salePrice !== null) {
    throw new CreatePayloadViolation(`REFUSED [${slug}]: salePrice must be null on create.`)
  }
  if (!Array.isArray(data.images)) {
    throw new CreatePayloadViolation(`REFUSED [${slug}]: images must be an array.`)
  }
  for (const row of data.images as unknown[]) {
    const keys = Object.keys((row ?? {}) as Record<string, unknown>)
    if (keys.length !== 1 || keys[0] !== 'image') {
      throw new CreatePayloadViolation(`REFUSED [${slug}]: each image row must be exactly { image: <id> }.`)
    }
  }
}

export interface CreatePlanEntry {
  slug: string
  name: string | null
  price: number
  hasVariants: boolean
  variants: { sku: string; price: number; salePrice: null; stock: number; options: { key: string; value: string }[] }[]
  files: { variant: string; resolved: string; absolutePath: string; detectedFormat: string | null }[]
  eligible: boolean
  skipReasons: string[]
}

/** Builds the creation plan. Pure: no database, no network, no uploads. */
export function buildCreatePlan(
  opts: {
    only?: string[]
    existingSlugs?: Set<string>
    /** Override the allowlist. Tests use it; the CLI never passes it. */
    approvals?: Approvals
  } = {},
): CreatePlanEntry[] {
  const only = new Set(opts.only ?? [])
  const existing = opts.existingSlugs ?? new Set<string>()
  const { products } = loadProducts()
  const approvals = opts.approvals ?? loadApprovals()
  const manifest = loadRenameManifest()
  const resolved = resolveProductImages(products, manifest)

  const imagesBySlug = new Map<string, typeof resolved>()
  for (const r of resolved) {
    const list = imagesBySlug.get(r.slug) ?? []
    list.push(r)
    imagesBySlug.set(r.slug, list)
  }

  const out: CreatePlanEntry[] = []
  for (const p of products) {
    if (only.size > 0 && !only.has(p.slug)) continue
    const skipReasons: string[] = []

    if (existing.has(p.slug)) skipReasons.push('ALREADY_EXISTS')

    const publishable = isPublishable(p, approvals)
    if (!publishable.ok) skipReasons.push(publishable.reason as string)

    const canonical = resolveCanonicalProductName(p.slug)
    if (canonical.name === null) skipReasons.push(`NO_CANONICAL_NAME: ${canonical.reason}`)

    const files = (imagesBySlug.get(p.slug) ?? []).filter((r) => r.existsOnDisk && r.readable)
    if (files.length === 0) skipReasons.push('no usable image on disk')

    const [pricePlan] = buildPricePlan({ only: [p.slug] })
    if (!pricePlan) skipReasons.push('no price plan')
    else if (pricePlan.issues.length > 0) skipReasons.push(...pricePlan.issues)
    else if (!(pricePlan.price > 0)) skipReasons.push('no positive price in the supplied list')

    out.push({
      slug: p.slug,
      name: canonical.name,
      price: pricePlan?.price ?? 0,
      hasVariants: pricePlan?.hasVariants ?? false,
      variants: pricePlan?.variants ?? [],
      files: files.map((f) => ({
        variant: f.variant,
        resolved: f.resolved,
        absolutePath: f.absolutePath,
        detectedFormat: f.detectedFormat,
      })),
      eligible: skipReasons.length === 0,
      skipReasons,
    })
  }
  return out
}

/** The exact object sent to payload.create. */
export function buildCreatePayload(
  entry: CreatePlanEntry,
  mediaIds: Array<string | number>,
  status: 'draft' | 'active',
): Record<string, unknown> {
  const product = loadProducts().products.find((p) => p.slug === entry.slug)
  if (!product) throw new CreatePayloadViolation(`REFUSED [${entry.slug}]: no generated content.`)
  const data: Record<string, unknown> = {
    ...buildContentPayload(product),
    name: entry.name,
    slug: entry.slug,
    status,
    isVisible: status === 'active',
    images: mediaIds.map((id) => ({ image: id })),
    price: entry.price,
    salePrice: null,
    hasVariants: entry.hasVariants,
    variants: entry.variants,
    stock: 0,
  }
  assertCreatePayload(data, entry.slug)
  return data
}

function mimeFor(detected: string | null): string {
  if (detected === 'png') return 'image/png'
  if (detected === 'webp') return 'image/webp'
  return 'image/jpeg'
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
    createStatus: (val('--create-status') === 'active' ? 'active' : 'draft') as 'draft' | 'active',
    only: (val('--only') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const envGate = process.env.CREATE_PRODUCTS_ALLOW_WRITES === 'true'
  const unmet: string[] = []
  if (!opts.execute) unmet.push('--execute')
  if (!opts.understands) unmet.push('--i-understand-this-writes-to-the-database')
  if (!envGate) unmet.push('CREATE_PRODUCTS_ALLOW_WRITES=true')
  const writing = unmet.length === 0

  const line = (s = '') => console.log(s)
  const h = (t: string) => {
    line()
    line('-'.repeat(78))
    line(t)
    line('-'.repeat(78))
  }

  line('-'.repeat(78))
  line('Amino Based - product creation importer')
  line('-'.repeat(78))
  line('  mode                 ' + (writing ? 'EXECUTE (writes enabled)' : 'DRY RUN (no writes, no uploads)'))
  line('  create status        ' + opts.createStatus + (opts.createStatus === 'draft' ? ' (not publicly visible)' : ' (VISIBLE ON THE SITE)'))
  if (!writing) {
    line('  Dry run because these write gates are not satisfied:')
    for (const u of unmet) line('    - ' + u)
  }

  if (opts.only.length === 0) {
    console.error('\nREFUSED: --only <slug,...> is required. There is no "create everything" mode.')
    process.exit(2)
  }
  line('  restricted to        ' + opts.only.length + ' slug(s)')

  const uri = process.env.DATABASE_URI ?? ''
  const host = (uri.match(/@([^:/?]+)/) ?? [])[1] ?? '(unknown)'
  const isLocal = /^(localhost|127\.0\.0\.1|::1)$/.test(host)
  if (!isLocal && !opts.ackRead) {
    console.error(`\nREFUSED: database host "${host}" is not local. Pass --acknowledge-remote-read to read it.`)
    process.exit(2)
  }
  if (!isLocal && writing && !opts.allowProd) {
    console.error(`\nREFUSED: refusing to WRITE to non-local host "${host}" without --allow-production-target.`)
    process.exit(2)
  }
  line('  database host        ' + host + (isLocal ? ' (local)' : ' (remote — acknowledged)'))

  const { getPayload } = await import('payload')
  const { default: cfg } = await import('../payload.config')
  const payload = await getPayload({ config: cfg })

  const res = await payload.find({ collection: 'products', limit: 500, depth: 0, pagination: false })
  const existingSlugs = new Set((res.docs as any[]).map((d) => d.slug))

  const mediaRes = await payload.find({ collection: 'media', limit: 1000, depth: 0, pagination: false })
  const mediaIdByStem = new Map<string, string | number>()
  for (const m of mediaRes.docs as any[]) {
    if (m?.filename) mediaIdByStem.set(mediaLookupStem(m.filename), m.id)
  }

  const plans = buildCreatePlan({ only: opts.only, existingSlugs })

  h('Plan')
  let actionable = 0
  let toUpload = 0
  for (const p of plans) {
    if (!p.eligible) {
      line(`  ${p.slug.padEnd(28)} SKIPPED: ${p.skipReasons.join('; ')}`)
      continue
    }
    actionable += 1
    const pending = p.files.filter((f) => !mediaIdByStem.has(mediaLookupStem(f.resolved))).length
    toUpload += pending
    line(`  ${p.slug.padEnd(28)} "${p.name}"  $${p.price}  variants=${p.variants.length}  images=${p.files.length} (${pending} to upload)`)
  }

  h('Summary')
  line('  products considered  ' + plans.length)
  line('  would create         ' + actionable)
  line('  media uploads needed ' + toUpload)

  if (!writing) {
    h('Dry run complete')
    line('  0 database writes, 0 media uploads, 0 files changed.')
    process.exit(0)
  }

  h('EXECUTE')
  let created = 0
  let uploaded = 0
  let reused = 0
  const failures: { slug: string; error: string }[] = []

  for (const p of plans) {
    if (!p.eligible) continue
    try {
      const mediaIds: Array<string | number> = []
      for (const f of p.files) {
        const stem = mediaLookupStem(f.resolved)
        const known = mediaIdByStem.get(stem)
        if (known !== undefined) {
          mediaIds.push(known)
          reused += 1
          continue
        }
        const buf = fs.readFileSync(f.absolutePath)
        const doc = await payload.create({
          collection: 'media',
          data: { alt: `${p.name} - ${f.variant}` },
          file: { data: buf, mimetype: mimeFor(f.detectedFormat), name: f.resolved, size: buf.length },
        })
        mediaIdByStem.set(stem, doc.id)
        mediaIds.push(doc.id)
        uploaded += 1
      }

      const data = buildCreatePayload(p, mediaIds, opts.createStatus)
      assertCreatePayload(data, p.slug)
      await payload.create({ collection: 'products', data: data as never })
      created += 1
      line(`  created  ${p.slug.padEnd(28)} "${p.name}" $${p.price} (${opts.createStatus})`)
    } catch (e) {
      failures.push({ slug: p.slug, error: (e as Error).message })
      console.error('  FAILED   ' + p.slug + ': ' + (e as Error).message)
    }
  }

  h('Result')
  line('  created ' + created + '   uploaded ' + uploaded + '   reused ' + reused + '   failures ' + failures.length)
  for (const f of failures) line('    ' + f.slug + ': ' + f.error)
  if (failures.length > 0) {
    line('\n  Partial failure. Each product is created independently and an existing')
    line('  slug is skipped, so a rerun with the same --only is safe.')
  }
  process.exit(failures.length > 0 ? 1 : 0)
}

// Match the script itself, not a test module whose name merely contains it
// (`create-products.test.ts` would otherwise execute main() on import).
if (process.argv[1] && /[\\/]create-products\.ts$/.test(process.argv[1])) {
  await main()
}
