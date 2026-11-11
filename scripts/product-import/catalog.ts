import fs from 'fs'
import { SUPPLIED_PRICE_CSV } from './config.js'
import { MASTER_PRODUCTS } from '../../lib/masterCatalogData.js'
import { CANONICAL_PRODUCT_SLUGS } from '../../lib/productSlugs.js'
import type { GeneratedProduct } from './types.js'

/**
 * Identity, SKU and price reconciliation.
 *
 * Roles, which must not be conflated:
 *   - the generated JSON is the source of CONTENT only;
 *   - the supplied CSV (product,variant,price_usd) is the supplied PRICE list;
 *   - lib/masterCatalogData.ts is the only in-repo source of verified SKUs.
 *
 * The importer never invents a price, SKU, variant or specification. Where the
 * CSV and masterCatalogData disagree on a price, that disagreement is REPORTED
 * and the product is withheld — it is not silently resolved in either
 * direction.
 */

export interface SuppliedPriceRow {
  product: string
  variant: string
  priceUsd: number
}

export function loadSuppliedPrices(file: string = SUPPLIED_PRICE_CSV): SuppliedPriceRow[] {
  if (!fs.existsSync(file)) return []
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.trim().length > 0)
  const rows: SuppliedPriceRow[] = []
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line)
    if (cells.length < 3) continue
    // A blank cell must not become a price. `Number('')` is 0 and passes
    // `Number.isFinite`, so without this check a missing price_usd would be
    // imported as $0.00 rather than reported as missing.
    if (cells[2].trim().length === 0) continue
    const price = Number(cells[2])
    if (!Number.isFinite(price) || price <= 0) continue
    rows.push({ product: cells[0], variant: cells[1], priceUsd: price })
  }
  return rows
}

/** Minimal CSV splitter: handles double-quoted cells, which is all this file uses. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else {
        inQ = !inQ
      }
    } else if (ch === ',' && !inQ) {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur.trim())
  return out
}

export interface VariantResolution {
  variant: string
  /** Price as supplied in the product JSON's `_meta.variants_from_csv`. */
  jsonPrice: number | null
  /** Price from the supplied CSV, matched by slug + variant label. */
  csvPrice: number | null
  /** SKU from lib/masterCatalogData.ts, matched by slug + strength. */
  sku: string | null
  /** Price recorded alongside that SKU in masterCatalogData. */
  catalogPrice: number | null
  disagreements: string[]
}

export interface IdentityResolution {
  slug: string
  canonical: boolean
  /** Matching entry in masterCatalogData, if any. */
  catalogName: string | null
  variants: VariantResolution[]
  /** Any disagreement at all across the three sources. */
  priceDisagreement: boolean
  /**
   * True when every disagreement for this product is the supplied CSV sitting a
   * uniform +10% above masterCatalogData. The supplied file is named
   * `all-products-plus10-...`, so that relationship is the documented intent of
   * the price list rather than a conflict needing adjudication. Still reported.
   */
  uniformTenPercentUplift: boolean
  /** A variant whose SKU could not be established from verified data. */
  missingSku: string[]
  notes: string[]
}

/** Tolerance for the +10% relationship, allowing for per-variant rounding. */
const UPLIFT_TOLERANCE = 0.02

function normaliseVariantLabel(v: string): string {
  return v.toLowerCase().replace(/\s+/g, '').replace(/\+/g, '')
}

export function resolveIdentity(product: GeneratedProduct, supplied: SuppliedPriceRow[]): IdentityResolution {
  const catalog = MASTER_PRODUCTS.find((p) => p.slug === product.slug) ?? null
  const notes: string[] = []
  const missingSku: string[] = []
  const variants: VariantResolution[] = []

  const csvForSlug = supplied.filter((r) => slugifyProductName(r.product) === product.slug)
  if (supplied.length === 0) {
    notes.push('supplied price CSV not readable at the configured path — prices unverified')
  } else if (csvForSlug.length === 0) {
    notes.push('no row in the supplied price CSV matched this slug')
  }

  for (const v of product.variants) {
    const key = normaliseVariantLabel(v.variant)
    const jsonPrice = Number(v.price_usd)
    const csvRow = csvForSlug.find((r) => normaliseVariantLabel(r.variant) === key) ?? null
    const catVariant = catalog?.variants.find((cv) => normaliseVariantLabel(cv.strength) === key) ?? null
    const disagreements: string[] = []

    if (csvRow && Number.isFinite(jsonPrice) && Math.abs(csvRow.priceUsd - jsonPrice) > 0.0001) {
      disagreements.push(`JSON ${jsonPrice} vs supplied CSV ${csvRow.priceUsd}`)
    }
    if (catVariant && csvRow && Math.abs(catVariant.price - csvRow.priceUsd) > 0.0001) {
      disagreements.push(`masterCatalogData ${catVariant.price} vs supplied CSV ${csvRow.priceUsd}`)
    }
    if (!catVariant) missingSku.push(v.variant)

    variants.push({
      variant: v.variant,
      jsonPrice: Number.isFinite(jsonPrice) ? jsonPrice : null,
      csvPrice: csvRow ? csvRow.priceUsd : null,
      sku: catVariant ? catVariant.sku : null,
      catalogPrice: catVariant ? catVariant.price : null,
      disagreements,
    })
  }

  // Classify the disagreement: a uniform +10% uplift of the catalogue is the
  // documented shape of the supplied list, not an unexplained conflict.
  const comparable = variants.filter((v) => v.catalogPrice !== null && v.csvPrice !== null)
  const uniformTenPercentUplift =
    comparable.length > 0 &&
    comparable.every(
      (v) => Math.abs((v.csvPrice as number) - (v.catalogPrice as number) * 1.1) <= UPLIFT_TOLERANCE,
    )
  if (uniformTenPercentUplift) {
    notes.push('supplied CSV is a uniform +10% uplift of masterCatalogData across all comparable variants')
  }

  return {
    slug: product.slug,
    canonical: CANONICAL_PRODUCT_SLUGS.has(product.slug),
    catalogName: catalog ? catalog.name : null,
    variants,
    priceDisagreement: variants.some((v) => v.disagreements.length > 0),
    uniformTenPercentUplift,
    missingSku,
    notes,
  }
}

export type CanonicalNameFailure = 'NOT_FOUND' | 'AMBIGUOUS' | 'EMPTY'

export interface CanonicalNameResult {
  name: string | null
  failure: CanonicalNameFailure | null
  reason: string
}

/**
 * The verified product name for a slug, taken from lib/masterCatalogData.ts.
 *
 * This is the only source of a product name: the generated JSON has no name
 * field, and `seoTitle` is an SEO string (pipe-delimited, up to 60 chars) that
 * must never be used as `Products.name` — it is the admin title, the shop card
 * label and an input to image identity matching.
 *
 * Returns null rather than synthesising anything. A slug matching zero entries,
 * more than one entry, or an entry with a blank name refuses creation.
 */
export function resolveCanonicalProductName(slug: string): CanonicalNameResult {
  const matches = MASTER_PRODUCTS.filter((p) => p.slug === slug)
  if (matches.length === 0) {
    return { name: null, failure: 'NOT_FOUND', reason: `no entry in masterCatalogData for slug "${slug}"` }
  }
  if (matches.length > 1) {
    return {
      name: null,
      failure: 'AMBIGUOUS',
      reason: `${matches.length} entries in masterCatalogData share slug "${slug}" — name is ambiguous`,
    }
  }
  const name = typeof matches[0].name === 'string' ? matches[0].name.trim() : ''
  if (name.length === 0) {
    return { name: null, failure: 'EMPTY', reason: `masterCatalogData entry for "${slug}" has a blank name` }
  }
  return { name, failure: null, reason: `canonical name from masterCatalogData: "${name}"` }
}

/** Mirrors the slugging the catalogue uses, for matching CSV product names. */
export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
