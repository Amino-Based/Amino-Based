/**
 * Product image importer — SEPARATE from the content and price importers.
 *
 * Why this is its own script.
 *
 * `scripts/import-generated-products.ts` refuses `images` on every write path
 * in every mode: `assertNoImageOrMediaFields` is deliberately independent of
 * `--with-images`, and the test suite pins that design structurally (it asserts
 * the guard's arity and that its source reads no flag). That guard is correct
 * and is NOT relaxed here. The consequence is that the content importer can
 * UPLOAD media but can never attach it to an existing product — attachment
 * happens only on its create path.
 *
 * Attaching imagery to products that already exist is therefore a job no
 * existing script can do. This is that job, isolated behind its own gates, in
 * the same shape as `scripts/import-prices-variants.ts`.
 *
 * It writes exactly one field: `images`. It never touches content, price,
 * salePrice, variants, SKUs, stock, categories, COA fields, status or
 * visibility.
 *
 * Safety properties:
 *   - A product that already has image relationships is SKIPPED, so imagery an
 *     admin curated in the CMS is never replaced.
 *   - Media already in the collection is reused by filename stem, so a rerun
 *     uploads nothing and the script is idempotent per slug.
 *   - BLOCKED products are refused: an unresolved identity question means a
 *     product photograph would imply a claim about vial contents that the
 *     generator explicitly could not support.
 *   - Only approved slugs are eligible, matching the content importer.
 *
 * Gates (all required):
 *   --execute
 *   --i-understand-this-writes-to-the-database
 *   IMAGE_IMPORT_ALLOW_WRITES=true
 *   --acknowledge-remote-read      (to read a non-local database at all)
 *   --allow-production-target      (to write to a production host)
 *   --only <slug,slug>             (required; there is no "all" shortcut)
 *
 * Default is a dry run that prints a before/after report and writes nothing.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

import fs from 'fs'

import { loadProducts } from './product-import/content.js'
import { loadApprovals, isPublishable, type Approvals } from './product-import/approvals.js'
import {
  loadRenameManifest,
  resolveProductImages,
  mediaLookupStem,
} from './product-import/images.js'

/** The single field this script is permitted to write. */
export const IMAGE_WRITABLE_FIELDS = ['images'] as const

/**
 * Never written here. `images` is deliberately absent; everything else that any
 * importer can write is listed so a future edit cannot quietly widen scope.
 */
export const IMAGE_FORBIDDEN_FIELDS = [
  'name', 'slug', 'sku', 'stock', 'price', 'salePrice', 'hasVariants', 'variants',
  'description', 'seoTitle', 'seoDescription', 'productDetailsTitle',
  'productDetailsDescription', 'researchFocusTitle', 'researchFocusDescription',
  'qualityPurityTitle', 'qualityPurityDescription', 'complianceNoticeTitle',
  'complianceNoticeDescription', 'faqs', 'bulkBundles', 'categories', 'coaFile',
  'coaBatchNumber', 'coaPurity', 'coaAnalyzedDate', 'status', 'isVisible',
  'isBestSeller', 'averageRating', 'reviewCount',
] as const

export class ImagePayloadViolation extends Error {}

/**
 * Hard guard. Runs before every write, in every mode, and reads no flag — the
 * same contract the content importer's guard holds itself to.
 */
export function assertImagesOnlyPayload(data: Record<string, unknown>, slug: string): void {
  const allowed = new Set<string>(IMAGE_WRITABLE_FIELDS as readonly string[])
  const extra = Object.keys(data).filter((k) => !allowed.has(k))
  if (extra.length > 0) {
    throw new ImagePayloadViolation(
      `REFUSED [${slug}]: image payload contains non-image field(s): ${extra.join(', ')}. ` +
        `Permitted: ${[...allowed].join(', ')}.`,
    )
  }
  if (!Array.isArray(data.images)) {
    throw new ImagePayloadViolation(`REFUSED [${slug}]: images must be an array.`)
  }
  for (const row of data.images as unknown[]) {
    const keys = Object.keys((row ?? {}) as Record<string, unknown>)
    if (keys.length !== 1 || keys[0] !== 'image') {
      throw new ImagePayloadViolation(
        `REFUSED [${slug}]: each image row must be exactly { image: <id> }, got {${keys.join(', ')}}.`,
      )
    }
  }
}

export interface ImagePlanEntry {
  slug: string
  /** Images resolved from the manifest, in the order they will be attached. */
  files: { variant: string; resolved: string; absolutePath: string; detectedFormat: string | null }[]
  existingImageCount: number
  eligible: boolean
  skipReasons: string[]
}

/**
 * Builds the attachment plan. Pure: no database, no network, no uploads.
 *
 * `existingImageCountBySlug` is supplied by the caller from a database read;
 * with no map every product is treated as having no imagery, which only ever
 * makes the dry run more permissive than the real run, never less.
 */
export function buildImagePlan(
  opts: {
    only?: string[]
    existingImageCountBySlug?: Map<string, number>
    /** Override the allowlist. Tests use it; the CLI never passes it. */
    approvals?: Approvals
  } = {},
): ImagePlanEntry[] {
  const only = new Set(opts.only ?? [])
  const existing = opts.existingImageCountBySlug ?? new Map<string, number>()
  const { products } = loadProducts()
  const approvals = opts.approvals ?? loadApprovals()
  const manifest = loadRenameManifest()
  const resolved = resolveProductImages(products, manifest)

  const bySlug = new Map<string, typeof resolved>()
  for (const r of resolved) {
    const list = bySlug.get(r.slug) ?? []
    list.push(r)
    bySlug.set(r.slug, list)
  }

  const out: ImagePlanEntry[] = []
  for (const p of products) {
    if (only.size > 0 && !only.has(p.slug)) continue
    const skipReasons: string[] = []

    const publishable = isPublishable(p, approvals)
    if (!publishable.ok) skipReasons.push(publishable.reason as string)

    const files = (bySlug.get(p.slug) ?? []).filter((r) => r.existsOnDisk && r.readable)
    const unusable = (bySlug.get(p.slug) ?? []).filter((r) => !r.existsOnDisk || !r.readable)
    for (const u of unusable) skipReasons.push(`image not readable on disk: ${u.resolved}`)
    if (files.length === 0) skipReasons.push('no usable image on disk')

    const existingImageCount = existing.get(p.slug) ?? 0
    if (existingImageCount > 0) {
      skipReasons.push(`already has ${existingImageCount} image relationship(s) — left untouched`)
    }

    out.push({
      slug: p.slug,
      files: files.map((f) => ({
        variant: f.variant,
        resolved: f.resolved,
        absolutePath: f.absolutePath,
        detectedFormat: f.detectedFormat,
      })),
      existingImageCount,
      eligible: skipReasons.length === 0,
      skipReasons,
    })
  }
  return out
}

/** The exact object sent to payload.update. */
export function buildImagePayload(mediaIds: Array<string | number>, slug: string): Record<string, unknown> {
  const data: Record<string, unknown> = { images: mediaIds.map((id) => ({ image: id })) }
  assertImagesOnlyPayload(data, slug)
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
    only: (val('--only') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const envGate = process.env.IMAGE_IMPORT_ALLOW_WRITES === 'true'
  const unmet: string[] = []
  if (!opts.execute) unmet.push('--execute')
  if (!opts.understands) unmet.push('--i-understand-this-writes-to-the-database')
  if (!envGate) unmet.push('IMAGE_IMPORT_ALLOW_WRITES=true')
  const writing = unmet.length === 0

  const line = (s = '') => console.log(s)
  const h = (t: string) => {
    line()
    line('-'.repeat(78))
    line(t)
    line('-'.repeat(78))
  }

  line('-'.repeat(78))
  line('Amino Based - product image importer (attaches media to existing products)')
  line('-'.repeat(78))
  line('  mode                 ' + (writing ? 'EXECUTE (writes enabled)' : 'DRY RUN (no writes, no uploads)'))
  line('  writes only          ' + IMAGE_WRITABLE_FIELDS.join(', '))
  if (!writing) {
    line('  Dry run because these write gates are not satisfied:')
    for (const u of unmet) line('    - ' + u)
    line('  Credentials alone never enable writes.')
  }

  if (opts.only.length === 0) {
    console.error('\nREFUSED: --only <slug,...> is required. There is no "import everything" mode.')
    process.exit(2)
  }
  line('  restricted to        ' + opts.only.join(', '))

  // ---- read gate, separate from the write gates ----
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

  // ---- before snapshot ----
  const res = await payload.find({ collection: 'products', limit: 500, depth: 0, pagination: false })
  const productIdBySlug = new Map<string, string | number>()
  const existingImageCountBySlug = new Map<string, number>()
  for (const d of res.docs as any[]) {
    productIdBySlug.set(d.slug, d.id)
    existingImageCountBySlug.set(d.slug, Array.isArray(d.images) ? d.images.length : 0)
  }

  const mediaRes = await payload.find({ collection: 'media', limit: 1000, depth: 0, pagination: false })
  const mediaIdByStem = new Map<string, string | number>()
  for (const m of mediaRes.docs as any[]) {
    if (m?.filename) mediaIdByStem.set(mediaLookupStem(m.filename), m.id)
  }

  const plans = buildImagePlan({ only: opts.only, existingImageCountBySlug })

  h('Plan')
  let actionable = 0
  for (const p of plans) {
    if (!productIdBySlug.has(p.slug)) {
      line(`  ${p.slug.padEnd(24)} NOT IN DATABASE — skipped`)
      continue
    }
    if (!p.eligible) {
      line(`  ${p.slug.padEnd(24)} SKIPPED: ${p.skipReasons.join('; ')}`)
      continue
    }
    actionable += 1
    const have = p.files.filter((f) => mediaIdByStem.has(mediaLookupStem(f.resolved))).length
    line(`  ${p.slug.padEnd(24)} images ${p.existingImageCount} -> ${p.files.length}   (${have} media already uploaded, ${p.files.length - have} to upload)`)
    for (const f of p.files) {
      const known = mediaIdByStem.has(mediaLookupStem(f.resolved))
      line(`      ${f.resolved.padEnd(40)} [${f.variant}] ${known ? 'reuse' : 'upload'}`)
    }
  }

  h('Summary')
  line('  products considered  ' + plans.length)
  line('  would attach         ' + actionable)

  if (!writing) {
    h('Dry run complete')
    line('  0 database writes, 0 media uploads, 0 files changed.')
    process.exit(0)
  }

  h('EXECUTE')
  let updated = 0
  let uploaded = 0
  let reused = 0
  const failures: { slug: string; error: string }[] = []

  for (const p of plans) {
    const id = productIdBySlug.get(p.slug)
    if (id === undefined || !p.eligible) continue
    try {
      // Media first, so a failed upload cannot leave a half-written product.
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
          data: { alt: `${p.slug} - ${f.variant}` },
          file: { data: buf, mimetype: mimeFor(f.detectedFormat), name: f.resolved, size: buf.length },
        })
        mediaIdByStem.set(stem, doc.id)
        mediaIds.push(doc.id)
        uploaded += 1
      }

      const data = buildImagePayload(mediaIds, p.slug)
      assertImagesOnlyPayload(data, p.slug)
      await payload.update({ collection: 'products', id, data: data as never })
      updated += 1
      line(`  attached ${p.slug.padEnd(24)} ${mediaIds.length} image(s)`)
    } catch (e) {
      failures.push({ slug: p.slug, error: (e as Error).message })
      console.error('  FAILED   ' + p.slug + ': ' + (e as Error).message)
    }
  }

  h('Result')
  line('  updated ' + updated + '   uploaded ' + uploaded + '   reused ' + reused + '   failures ' + failures.length)
  for (const f of failures) line('    ' + f.slug + ': ' + f.error)
  if (failures.length > 0) {
    line('\n  Partial failure. Each product is written independently and this script is')
    line('  idempotent per slug, so a rerun with the same --only is safe.')
  }
  process.exit(failures.length > 0 ? 1 : 0)
}

if (process.argv[1] && process.argv[1].includes('import-product-images')) {
  await main()
}
