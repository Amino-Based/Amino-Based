/**
 * Tests for the price & variant importer (`scripts/import-prices-variants.ts`).
 *
 * That script is the ONLY path permitted to write `price`, `salePrice`,
 * `hasVariants` and `variants`. The content importer refuses those fields
 * outright, so nothing else covers this code. These tests are pure: they read
 * the supplied CSV, the generated JSON and lib/masterCatalogData.ts from disk
 * and never open a database connection, upload media or write anything.
 *
 * Every price and SKU asserted here was read back from the two sources of
 * truth, not assumed:
 *   - prices  -> the supplied CSV named by config.SUPPLIED_PRICE_CSV
 *   - SKUs    -> lib/masterCatalogData.ts
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'

import {
  buildPricePlan,
  buildPricePayload,
  assertPriceOnlyPayload,
  PricePayloadViolation,
  PRICE_WRITABLE_FIELDS,
  PRICE_FORBIDDEN_FIELDS,
} from '../../import-prices-variants.js'
import { loadSuppliedPrices, resolveIdentity, slugifyProductName } from '../catalog.js'
import { loadProducts } from '../content.js'
import { MASTER_PRODUCTS } from '../../../lib/masterCatalogData.js'

/**
 * Verified shape of the supplied list. 79 priced rows over 50 products; 22 of
 * those products carry more than one variant and 28 carry exactly one, so
 * 51 variant rows + 28 single-variant products reconciles back to 79.
 */
const CSV_ROWS = 79
const CSV_PRODUCTS = 50
const MULTI_VARIANT_PRODUCTS = 22
const SINGLE_VARIANT_PRODUCTS = 28
const VARIANT_ROWS = 51

/** Read back from the CSV and from masterCatalogData, not assumed. */
const GLP_1TRZ_EXPECTED = [
  { sku: 'TIRZEP-10MG', variant: '10mg', csv: 65.99, catalog: 59.99 },
  { sku: 'TIRZEP-20MG', variant: '20mg', csv: 87.99, catalog: 79.99 },
  { sku: 'TIRZEP-30MG', variant: '30mg', csv: 115.49, catalog: 104.99 },
  { sku: 'TIRZEP-60MG', variant: '60mg', csv: 175.99, catalog: 159.99 },
]

function planFor(slug: string) {
  const plans = buildPricePlan({ only: [slug] })
  assert.equal(plans.length, 1, `expected exactly one plan for ${slug}`)
  return plans[0]
}

function productFor(slug: string) {
  const product = loadProducts().products.find((p) => p.slug === slug)
  assert.ok(product, `${slug} content must load`)
  return product!
}

// ---------------------------------------------------------------------------
// The supplied price list
// ---------------------------------------------------------------------------

test('the supplied CSV holds 79 priced rows across 50 products', () => {
  const rows = loadSuppliedPrices()
  assert.equal(rows.length, CSV_ROWS)
  assert.equal(new Set(rows.map((r) => r.product)).size, CSV_PRODUCTS)
  assert.equal(
    rows.filter((r) => !Number.isFinite(r.priceUsd)).length,
    0,
    'every supplied row must carry a finite price',
  )
  assert.equal(
    rows.filter((r) => r.priceUsd <= 0).length,
    0,
    'no supplied price may be zero or negative',
  )
})

test('a missing price list is tolerated rather than fabricated', () => {
  const rows = loadSuppliedPrices(path.join(os.tmpdir(), 'no-such-price-file-12345.csv'))
  assert.deepEqual(rows, [], 'an absent CSV yields no rows, never invented ones')
})

test('rows with a missing or non-numeric price are dropped, not defaulted to 0', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'price-csv-'))
  const file = path.join(dir, 'prices.csv')
  fs.writeFileSync(
    file,
    [
      'product,variant,price_usd',
      'GLP-1TRZ,10mg,65.99',
      'GLP-1TRZ,20mg,',
      'GLP-1TRZ,30mg,not-a-price',
      'GLP-1TRZ,60mg',
    ].join('\n'),
    'utf8',
  )
  try {
    const rows = loadSuppliedPrices(file)
    assert.equal(rows.length, 1, 'only the one well-formed row survives')
    assert.deepEqual(rows[0], { product: 'GLP-1TRZ', variant: '10mg', priceUsd: 65.99 })
    assert.equal(
      rows.some((r) => r.priceUsd === 0),
      false,
      'a missing price must never become 0',
    )
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

// ---------------------------------------------------------------------------
// Price provenance: the CSV, and only the CSV
// ---------------------------------------------------------------------------

test('every planned price is a verbatim CSV value for that product and variant', () => {
  const csv = new Map<string, number>()
  for (const r of loadSuppliedPrices()) {
    csv.set(`${slugifyProductName(r.product)}|${r.variant.toLowerCase()}`, r.priceUsd)
  }

  let checked = 0
  for (const plan of buildPricePlan()) {
    for (const v of plan.variants) {
      const key = `${plan.slug}|${v.options[0].value.toLowerCase()}`
      assert.ok(csv.has(key), `no CSV row backs planned variant ${key}`)
      assert.equal(csv.get(key), v.price, `price drift on ${v.sku}`)
      checked += 1
    }
  }
  assert.equal(checked, VARIANT_ROWS, 'all planned variant rows must be CSV-backed')
})

test('no price is taken from masterCatalogData and no uplift is recomputed', () => {
  const plan = planFor('glp-1trz')
  const bySku = new Map(plan.variants.map((v) => [v.sku, v.price]))
  for (const e of GLP_1TRZ_EXPECTED) {
    assert.equal(bySku.get(e.sku), e.csv, `${e.sku} must carry the CSV price`)
    assert.notEqual(bySku.get(e.sku), e.catalog, `${e.sku} must not carry the catalogue price`)
  }
  // The supplied list is a +10% uplift of the catalogue, but the importer reads
  // the supplied value rather than multiplying, so the figure is the exact
  // 65.99 and not a recomputed 59.99 * 1.1 = 65.989.
  assert.equal(bySku.get('TIRZEP-10MG'), 65.99)
  assert.notEqual(bySku.get('TIRZEP-10MG'), 59.99 * 1.1)
})

test('planned SKUs come from masterCatalogData, matched by strength', () => {
  const catalog = MASTER_PRODUCTS.find((p) => p.slug === 'glp-1trz')
  assert.ok(catalog, 'glp-1trz must exist in masterCatalogData')
  const plan = planFor('glp-1trz')
  assert.deepEqual(
    plan.variants.map((v) => [v.options[0].value, v.sku]),
    GLP_1TRZ_EXPECTED.map((e) => [e.variant, e.sku]),
  )
  for (const v of plan.variants) {
    assert.ok(
      catalog!.variants.some((cv) => cv.sku === v.sku && cv.strength === v.options[0].value),
      `${v.sku} must map to the same strength in masterCatalogData`,
    )
  }
})

test('a second coined-name product resolves to its own distinct SKU family', () => {
  // GLP-1TRZ and GLP-3RTA are distinct products; a mapping slip between them
  // would put one product's prices on the other's SKUs.
  const trz = planFor('glp-1trz')
  const rta = planFor('glp-3rta')
  assert.ok(trz.variants.every((v) => v.sku.startsWith('TIRZEP-')))
  assert.ok(rta.variants.every((v) => v.sku.startsWith('RETATR-')))
  assert.equal(
    trz.variants.filter((v) => rta.variants.some((r) => r.sku === v.sku)).length,
    0,
    'the two products must share no SKU',
  )
  assert.equal(rta.price, 87.99, 'GLP-3RTA base price is its lowest CSV price')
  assert.notEqual(trz.price, rta.price)
})

// ---------------------------------------------------------------------------
// Variant shaping
// ---------------------------------------------------------------------------

test('base price is the lowest variant price so the card reads "from"', () => {
  for (const plan of buildPricePlan()) {
    if (plan.variants.length === 0) continue
    assert.equal(
      plan.price,
      Math.min(...plan.variants.map((v) => v.price)),
      `${plan.slug} base price must be the lowest variant price`,
    )
  }
  assert.equal(planFor('glp-1trz').price, 65.99)
})

test('a multi-variant product sets hasVariants and carries its rows', () => {
  const plan = planFor('glp-1trz')
  assert.equal(plan.hasVariants, true)
  assert.equal(plan.variants.length, 4)
})

test('a single-variant product stays on the simple path', () => {
  const plan = planFor('dihexa')
  assert.equal(plan.hasVariants, false, 'one price is not a variant product')
  assert.deepEqual(plan.variants, [], 'its price belongs on the product, not in a variant row')
  assert.equal(plan.price, 72.59, 'the single CSV price becomes the base price')
})

test('the whole catalogue reconciles to the 79 supplied rows', () => {
  const plans = buildPricePlan()
  assert.equal(plans.length, CSV_PRODUCTS)
  const multi = plans.filter((p) => p.hasVariants)
  const singles = plans.filter((p) => !p.hasVariants)
  assert.equal(multi.length, MULTI_VARIANT_PRODUCTS)
  assert.equal(singles.length, SINGLE_VARIANT_PRODUCTS)
  const variantRows = plans.reduce((n, p) => n + p.variants.length, 0)
  assert.equal(variantRows, VARIANT_ROWS)
  assert.equal(variantRows + singles.length, CSV_ROWS, 'every supplied row is accounted for')
})

test('all 50 products plan cleanly, with no unresolved issue', () => {
  const broken = buildPricePlan().filter((p) => p.issues.length > 0)
  assert.deepEqual(
    broken.map((p) => `${p.slug}: ${p.issues.join('; ')}`),
    [],
  )
})

test('salePrice is always null, so this importer never puts a product on sale', () => {
  for (const plan of buildPricePlan()) {
    for (const v of plan.variants) assert.equal(v.salePrice, null)
    assert.equal(buildPricePayload(plan).salePrice, null)
  }
})

// ---------------------------------------------------------------------------
// Duplicate SKUs
// ---------------------------------------------------------------------------

test('no product plans the same SKU twice', () => {
  for (const plan of buildPricePlan()) {
    const skus = plan.variants.map((v) => v.sku)
    assert.equal(new Set(skus).size, skus.length, `duplicate SKU within ${plan.slug}`)
    assert.equal(
      plan.issues.filter((i) => i.includes('duplicate')).length,
      0,
      `${plan.slug} reported a duplicate SKU`,
    )
  }
})

test('no SKU is shared between two products', () => {
  const owner = new Map<string, string>()
  for (const plan of buildPricePlan()) {
    for (const v of plan.variants) {
      const prev = owner.get(v.sku)
      assert.equal(prev, undefined, `SKU ${v.sku} claimed by both ${prev} and ${plan.slug}`)
      owner.set(v.sku, plan.slug)
    }
  }
  assert.equal(owner.size, VARIANT_ROWS)
})

test('a blank SKU is never emitted', () => {
  for (const plan of buildPricePlan()) {
    for (const v of plan.variants) {
      assert.equal(typeof v.sku, 'string')
      assert.ok(v.sku.trim().length > 0, `${plan.slug} emitted an empty SKU`)
    }
  }
})

// ---------------------------------------------------------------------------
// Mapping failures are reported, never guessed
// ---------------------------------------------------------------------------

test('a variant with no supplied price resolves to null, not to a fallback', () => {
  // Supply a price for 10mg only; the other three have no row.
  const id = resolveIdentity(productFor('glp-1trz'), [
    { product: 'GLP-1TRZ', variant: '10mg', priceUsd: 65.99 },
  ])
  const byVariant = new Map(id.variants.map((v) => [v.variant, v]))
  assert.equal(byVariant.get('10mg')!.csvPrice, 65.99)
  for (const v of ['20mg', '30mg', '60mg']) {
    assert.equal(byVariant.get(v)!.csvPrice, null, `${v} must report no price rather than guess one`)
  }
})

test('an empty price list leaves every price unresolved and says so', () => {
  const id = resolveIdentity(productFor('glp-1trz'), [])
  assert.ok(id.variants.every((v) => v.csvPrice === null))
  assert.ok(
    id.notes.some((n) => n.includes('not readable') || n.includes('unverified')),
    'the unreadable-CSV condition must be reported',
  )
})

test('a price that disagrees with masterCatalogData is reported, not resolved', () => {
  const id = resolveIdentity(productFor('glp-1trz'), [
    { product: 'GLP-1TRZ', variant: '10mg', priceUsd: 999.99 },
  ])
  assert.equal(id.priceDisagreement, true)
  const tenMg = id.variants.find((v) => v.variant === '10mg')!
  assert.ok(tenMg.disagreements.length > 0, 'the conflict must be recorded')
  assert.equal(tenMg.csvPrice, 999.99, 'the supplied value is reported as supplied')
  assert.equal(tenMg.catalogPrice, 59.99, 'alongside the catalogue value')
  assert.equal(id.uniformTenPercentUplift, false, 'a wild value is not the documented uplift')
})

test('the real supplied list is recognised as the documented +10% uplift', () => {
  const id = resolveIdentity(productFor('glp-1trz'), loadSuppliedPrices())
  assert.equal(id.uniformTenPercentUplift, true)
  assert.equal(id.missingSku.length, 0, 'every variant must resolve to a verified SKU')
})

test('a product name that matches no row is reported rather than mis-mapped', () => {
  const id = resolveIdentity(productFor('glp-1trz'), [
    { product: 'Some Other Product', variant: '10mg', priceUsd: 65.99 },
  ])
  assert.ok(
    id.notes.some((n) => n.includes('no row in the supplied price CSV matched')),
    'a non-matching product name must be reported',
  )
  assert.ok(
    id.variants.every((v) => v.csvPrice === null),
    'and must not borrow another product price',
  )
})

// ---------------------------------------------------------------------------
// Stock safety
// ---------------------------------------------------------------------------

test('existing stock is carried over, never reset to zero', () => {
  const stock = new Map<string, number>([
    ['TIRZEP-10MG', 23],
    ['TIRZEP-20MG', 7],
    ['TIRZEP-30MG', 5],
  ])
  const withStock = new Map(
    buildPricePlan({ only: ['glp-1trz'], existingStockBySku: stock })[0].variants.map((v) => [
      v.sku,
      v.stock,
    ]),
  )
  assert.equal(withStock.get('TIRZEP-10MG'), 23)
  assert.equal(withStock.get('TIRZEP-20MG'), 7)
  assert.equal(withStock.get('TIRZEP-30MG'), 5)
  assert.equal(withStock.get('TIRZEP-60MG'), 0, 'a variant with no existing row starts at 0')
})

test('stock is never invented for a SKU the database does not have', () => {
  const plan = buildPricePlan({ only: ['glp-1trz'], existingStockBySku: new Map() })[0]
  assert.ok(
    plan.variants.every((v) => v.stock === 0),
    'absent stock means 0, not a guess',
  )
})

// ---------------------------------------------------------------------------
// Payload guards: the production-write protections
// ---------------------------------------------------------------------------

test('the payload carries exactly the four writable fields', () => {
  const data = buildPricePayload(planFor('glp-1trz'))
  assert.deepEqual(Object.keys(data).sort(), [...PRICE_WRITABLE_FIELDS].sort())
  assert.deepEqual([...PRICE_WRITABLE_FIELDS], ['price', 'salePrice', 'hasVariants', 'variants'])
})

test('every protected field is refused by the guard', () => {
  for (const field of PRICE_FORBIDDEN_FIELDS) {
    assert.throws(
      () => assertPriceOnlyPayload({ price: 1, [field]: 'x' }, 'glp-1trz'),
      PricePayloadViolation,
      `${field} must be refused`,
    )
  }
})

test('content, image and inventory fields specifically cannot ride along', () => {
  const fields = [
    'description',
    'faqs',
    'images',
    'sku',
    'stock',
    'coaPurity',
    'status',
    'isVisible',
    'categories',
  ]
  for (const field of fields) {
    assert.throws(
      () => assertPriceOnlyPayload({ price: 1, [field]: 'x' }, 'glp-1trz'),
      PricePayloadViolation,
      `${field} must be refused`,
    )
  }
})

test('an unknown field is refused even though it is on no list', () => {
  assert.throws(
    () => assertPriceOnlyPayload({ price: 1, somethingNew: true }, 'glp-1trz'),
    PricePayloadViolation,
  )
})

test('a clean price payload passes', () => {
  assert.doesNotThrow(() =>
    assertPriceOnlyPayload(
      { price: 10, salePrice: null, hasVariants: false, variants: [] },
      'glp-1trz',
    ),
  )
})

test('buildPricePayload runs the guard itself, for every product', () => {
  for (const plan of buildPricePlan()) {
    assert.doesNotThrow(() => buildPricePayload(plan), `${plan.slug} payload must pass the guard`)
  }
})

// ---------------------------------------------------------------------------
// Retry safety
// ---------------------------------------------------------------------------

test('planning is pure and repeatable, so a retry plans the same thing', () => {
  const a = JSON.stringify(buildPricePlan({ only: ['glp-1trz', 'bpc-157', 'dihexa'] }))
  const b = JSON.stringify(buildPricePlan({ only: ['glp-1trz', 'bpc-157', 'dihexa'] }))
  assert.equal(a, b)
})

test('the payload is idempotent, so a rerun after partial failure is safe', () => {
  const first = buildPricePayload(planFor('glp-1trz'))
  const second = buildPricePayload(planFor('glp-1trz'))
  assert.deepEqual(first, second)
})

test('a retry carrying back the stock it just wrote is still stable', () => {
  const stock = new Map<string, number>([
    ['TIRZEP-10MG', 23],
    ['TIRZEP-20MG', 7],
  ])
  const run1 = buildPricePlan({ only: ['glp-1trz'], existingStockBySku: stock })[0]
  // Simulate re-reading the database after the first write.
  const after = new Map(run1.variants.map((v) => [v.sku, v.stock]))
  const run2 = buildPricePlan({ only: ['glp-1trz'], existingStockBySku: after })[0]
  assert.deepEqual(buildPricePayload(run1), buildPricePayload(run2))
  assert.deepEqual(
    run2.variants.map((v) => v.stock),
    [23, 7, 0, 0],
  )
})

test('--only restricts the plan and never widens it', () => {
  assert.equal(buildPricePlan({ only: ['glp-1trz'] }).length, 1)
  assert.equal(buildPricePlan({ only: ['glp-1trz', 'glp-3rta'] }).length, 2)
  assert.equal(buildPricePlan({ only: ['no-such-slug'] }).length, 0, 'an unknown slug plans nothing')
})

test('planning opens no database connection and reads no credentials', () => {
  // buildPricePlan resolves entirely from the filesystem; if it touched payload
  // or the network this call would need a valid DATABASE_URI.
  const before = process.env.DATABASE_URI
  try {
    delete process.env.DATABASE_URI
    assert.equal(buildPricePlan({ only: ['glp-1trz'] })[0].variants.length, 4)
  } finally {
    if (before !== undefined) process.env.DATABASE_URI = before
  }
})
