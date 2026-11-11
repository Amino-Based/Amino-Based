/**
 * Price and variant importer — SEPARATE from the content importer.
 *
 * The content importer (`scripts/import-generated-products.ts`) refuses
 * `price`, `salePrice` and `variants` unconditionally: `variants` sits in
 * MEDIA_AND_IMAGE_FIELDS and `assertNoImageOrMediaFields` throws on it in every
 * mode. Those guards are correct and are NOT relaxed. This script is the
 * separate, explicitly gated path for the one job that importer must never do.
 *
 * It writes exactly four fields: `price`, `salePrice`, `hasVariants`, `variants`.
 * It never touches content, images, media, SKUs on the product, stock on the
 * product, categories, COA fields, status or visibility.
 *
 * Source of truth: the supplied CSV (`price_usd`), matched to catalogue SKUs.
 * Nothing is computed from masterCatalogData prices and no uplift is applied.
 *
 * Gates (all required, same shape as the content importer):
 *   --execute
 *   --i-understand-this-writes-to-the-database
 *   PRICE_IMPORT_ALLOW_WRITES=true
 *   --acknowledge-remote-read      (to read a non-local database at all)
 *   --allow-production-target      (to write to a production host)
 *   --only <slug,slug>             (required; there is no "all" shortcut)
 *
 * Default is a dry run that prints a before/after report and writes nothing.
 */
import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

import { loadProducts } from './product-import/content.js'
import { loadSuppliedPrices, resolveIdentity } from './product-import/catalog.js'

/** Fields this script is permitted to write. Anything else is a bug. */
export const PRICE_WRITABLE_FIELDS = ['price', 'salePrice', 'hasVariants', 'variants'] as const

/** Never written here — the content importer owns some, nobody owns the rest. */
export const PRICE_FORBIDDEN_FIELDS = [
  'name', 'slug', 'sku', 'stock', 'description', 'seoTitle', 'seoDescription',
  'productDetailsTitle', 'productDetailsDescription', 'researchFocusTitle',
  'researchFocusDescription', 'qualityPurityTitle', 'qualityPurityDescription',
  'complianceNoticeTitle', 'complianceNoticeDescription', 'faqs',
  'images', 'bulkBundles', 'categories', 'coaFile', 'coaBatchNumber',
  'coaPurity', 'coaAnalyzedDate', 'status', 'isVisible', 'isBestSeller',
  'averageRating', 'reviewCount',
] as const

export class PricePayloadViolation extends Error {}

/** Hard guard. Runs before every write, in every mode. */
export function assertPriceOnlyPayload(data: Record<string, unknown>, slug: string): void {
  const allowed = new Set<string>(PRICE_WRITABLE_FIELDS as readonly string[])
  const extra = Object.keys(data).filter((k) => !allowed.has(k))
  if (extra.length > 0) {
    throw new PricePayloadViolation(
      `REFUSED [${slug}]: price import payload contains non-price field(s): ${extra.join(', ')}. ` +
        `Permitted: ${[...allowed].join(', ')}.`,
    )
  }
  const forbidden = Object.keys(data).filter((k) =>
    (PRICE_FORBIDDEN_FIELDS as readonly string[]).includes(k),
  )
  if (forbidden.length > 0) {
    throw new PricePayloadViolation(
      `REFUSED [${slug}]: payload contains protected field(s): ${forbidden.join(', ')}.`,
    )
  }
}

export interface VariantPayload {
  sku: string
  price: number
  salePrice: null
  stock: number
  options: { key: string; value: string }[]
}

export interface PricePlan {
  slug: string
  catalogName: string | null
  hasVariants: boolean
  /** Base price: the lowest variant price, so the card shows "from" correctly. */
  price: number
  variants: VariantPayload[]
  issues: string[]
}

/**
 * Builds the price plan from the CSV. Pure: no database, no network.
 *
 * `stock` is carried from the EXISTING variant of the same SKU when one exists,
 * and defaults to 0 for a variant being created, so this script can never
 * silently reset inventory or invent availability.
 */
export function buildPricePlan(
  opts: { only?: string[]; existingStockBySku?: Map<string, number> } = {},
): PricePlan[] {
  const only = new Set(opts.only ?? [])
  const stockBySku = opts.existingStockBySku ?? new Map<string, number>()
  const { products } = loadProducts()
  const supplied = loadSuppliedPrices()
  const plans: PricePlan[] = []

  for (const p of products) {
    if (only.size > 0 && !only.has(p.slug)) continue
    const id = resolveIdentity(p, supplied)
    const issues: string[] = []
    const variants: VariantPayload[] = []

    for (const v of id.variants) {
      if (v.csvPrice == null) {
        issues.push(`no CSV price for variant ${v.variant}`)
        continue
      }
      if (!v.sku) {
        issues.push(`no verified SKU for variant ${v.variant}`)
        continue
      }
      if (variants.some((x) => x.sku === v.sku)) {
        issues.push(`duplicate SKU ${v.sku} — refusing to create a duplicate variant`)
        continue
      }
      variants.push({
        sku: v.sku,
        price: v.csvPrice,
        salePrice: null,
        stock: stockBySku.get(v.sku) ?? 0,
        options: [{ key: 'Strength', value: v.variant }],
      })
    }

    if (variants.length === 0) issues.push('no priceable variant — nothing to write')

    const prices = variants.map((v) => v.price)
    plans.push({
      slug: p.slug,
      catalogName: id.catalogName,
      // A product with a single variant is not a variant product: its one price
      // becomes the base price and `hasVariants` stays false, which keeps the
      // checkout on the simple path.
      hasVariants: variants.length > 1,
      price: prices.length > 0 ? Math.min(...prices) : 0,
      variants: variants.length > 1 ? variants : [],
      issues,
    })
  }
  return plans
}

/** The exact object sent to payload.update. */
export function buildPricePayload(plan: PricePlan): Record<string, unknown> {
  const data: Record<string, unknown> = {
    price: plan.price,
    salePrice: null,
    hasVariants: plan.hasVariants,
    variants: plan.variants,
  }
  assertPriceOnlyPayload(data, plan.slug)
  return data
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
    verbose: has('--verbose'),
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const envGate = process.env.PRICE_IMPORT_ALLOW_WRITES === 'true'
  const unmet: string[] = []
  if (!opts.execute) unmet.push('--execute')
  if (!opts.understands) unmet.push('--i-understand-this-writes-to-the-database')
  if (!envGate) unmet.push('PRICE_IMPORT_ALLOW_WRITES=true')
  const writing = unmet.length === 0

  const line = (s = '') => console.log(s)
  const h = (t: string) => {
    line()
    line('-'.repeat(78))
    line(t)
    line('-'.repeat(78))
  }

  line('-'.repeat(78))
  line('Amino Based - price & variant importer (separate from the content importer)')
  line('-'.repeat(78))
  line('  mode                 ' + (writing ? 'EXECUTE (writes enabled)' : 'DRY RUN (no writes)'))
  line('  writes only          ' + PRICE_WRITABLE_FIELDS.join(', '))
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
  const res = await payload.find({
    collection: 'products', limit: 500, depth: 0, pagination: false,
  })
  const bySlug = new Map<string, any>()
  const stockBySku = new Map<string, number>()
  for (const d of res.docs as any[]) {
    bySlug.set(d.slug, d)
    for (const v of d.variants ?? []) if (v?.sku) stockBySku.set(v.sku, Number(v.stock) || 0)
  }

  const plans = buildPricePlan({ only: opts.only, existingStockBySku: stockBySku })

  h('Plan — before / after')
  let writable = 0
  for (const p of plans) {
    const live = bySlug.get(p.slug)
    if (!live) {
      line(`  ${p.slug.padEnd(28)} NOT IN DATABASE — skipped (create products first)`)
      continue
    }
    if (p.issues.length > 0) {
      line(`  ${p.slug.padEnd(28)} REFUSED: ${p.issues.join('; ')}`)
      continue
    }
    writable++
    line(`  ${p.slug.padEnd(28)} id=${String(live.id).padEnd(4)}`)
    line(`      price        ${String(live.price).padEnd(10)} -> ${p.price}`)
    line(`      salePrice    ${String(live.salePrice).padEnd(10)} -> null`)
    line(`      hasVariants  ${String(live.hasVariants).padEnd(10)} -> ${p.hasVariants}`)
    line(`      variants     ${String((live.variants ?? []).length).padEnd(10)} -> ${p.variants.length}`)
    if (opts.verbose) {
      for (const v of p.variants) {
        line(`         ${v.sku.padEnd(18)} $${String(v.price).padEnd(8)} stock=${v.stock}  [${v.options[0].value}]`)
      }
    }
  }

  h('Summary')
  line('  products considered  ' + plans.length)
  line('  would write          ' + writable)
  line('  variant rows         ' + plans.reduce((n, p) => n + p.variants.length, 0))

  if (!writing) {
    h('Dry run complete')
    line('  0 database writes, 0 media uploads, 0 files changed.')
    process.exit(0)
  }

  h('EXECUTE')
  let updated = 0
  const failures: { slug: string; error: string }[] = []
  for (const p of plans) {
    const live = bySlug.get(p.slug)
    if (!live || p.issues.length > 0) continue
    try {
      const data = buildPricePayload(p)
      assertPriceOnlyPayload(data, p.slug)
      await payload.update({ collection: 'products', id: live.id, data: data as never })
      updated++
      line('  updated  ' + p.slug)
    } catch (e) {
      failures.push({ slug: p.slug, error: (e as Error).message })
      console.error('  FAILED   ' + p.slug + ': ' + (e as Error).message)
    }
  }
  h('Result')
  line('  updated ' + updated + '   failures ' + failures.length)
  for (const f of failures) line('    ' + f.slug + ': ' + f.error)
  if (failures.length > 0) {
    line('\n  Partial failure. Each product is written independently and this script is')
    line('  idempotent per slug, so a rerun with the same --only is safe.')
    process.exitCode = 1
  }
  process.exit(failures.length > 0 ? 1 : 0)
}

if (process.argv[1] && process.argv[1].includes('import-prices-variants')) {
  await main()
}
