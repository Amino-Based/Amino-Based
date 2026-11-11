/**
 * Tests for the product creation importer (`scripts/create-products.ts`).
 *
 * This script exists because the content importer's create branch is
 * unreachable: it assigns `data.images` for any product without existing
 * imagery — which every create is — and the next guard refuses `images` in
 * every mode. That guard is deliberate and pinned by ./product-import.test.ts,
 * so creation lives here instead of weakening it.
 *
 * Pure: reads the generated JSON, the supplied CSV, the rename manifest and the
 * image directory from disk. Never opens a database connection or uploads.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'

import {
  buildCreatePlan,
  buildCreatePayload,
  assertCreatePayload,
  CreatePayloadViolation,
  CREATE_WRITABLE_FIELDS,
  CREATE_FORBIDDEN_FIELDS,
} from '../../create-products.js'
import { BLOCKED_SLUGS, loadApprovals } from '../approvals.js'
import { CONTENT_FIELD_KEYS } from '../types.js'
import { loadSuppliedPrices, slugifyProductName } from '../catalog.js'
import { MASTER_PRODUCTS } from '../../../lib/masterCatalogData.js'

function planFor(slug: string) {
  const [p] = buildCreatePlan({ only: [slug] })
  assert.ok(p, `${slug} must plan`)
  return p
}

function payloadFor(slug: string, status: 'draft' | 'active' = 'draft') {
  const p = planFor(slug)
  return buildCreatePayload(p, [101, 102], status)
}

// ---------------------------------------------------------------------------
// Payload guard
// ---------------------------------------------------------------------------

test('the writable set is the 12 content fields plus the create-only fields', () => {
  for (const k of CONTENT_FIELD_KEYS) {
    assert.ok(
      (CREATE_WRITABLE_FIELDS as readonly string[]).includes(k),
      `${k} must be writable on create`,
    )
  }
  for (const k of ['name', 'slug', 'status', 'isVisible', 'images', 'price', 'salePrice', 'hasVariants', 'variants', 'stock']) {
    assert.ok((CREATE_WRITABLE_FIELDS as readonly string[]).includes(k), `${k} must be writable`)
  }
})

test('every forbidden field is refused', () => {
  for (const field of CREATE_FORBIDDEN_FIELDS) {
    const data = payloadFor('dihexa')
    data[field] = 'x'
    assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation, `${field} must be refused`)
  }
})

test('COA and rating fields specifically cannot ride along', () => {
  for (const field of ['coaPurity', 'coaFile', 'coaBatchNumber', 'averageRating', 'reviewCount', 'isBestSeller', 'sku', 'categories']) {
    const data = payloadFor('dihexa')
    data[field] = 'x'
    assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation, `${field} must be refused`)
  }
})

test('a payload missing a required field is refused', () => {
  for (const field of ['name', 'slug', 'price', 'status']) {
    const data = payloadFor('dihexa')
    delete data[field]
    assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation, `missing ${field} must be refused`)
  }
})

test('a mismatched slug is refused', () => {
  const data = payloadFor('dihexa')
  data.slug = 'something-else'
  assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation)
})

test('a zero or negative price is refused', () => {
  for (const bad of [0, -1, Number.NaN]) {
    const data = payloadFor('dihexa')
    data.price = bad
    assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation, `price ${bad} must be refused`)
  }
})

test('a non-null salePrice is refused — a create never puts a product on sale', () => {
  const data = payloadFor('dihexa')
  data.salePrice = 9.99
  assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation)
})

test('a malformed image row is refused', () => {
  const data = payloadFor('dihexa')
  data.images = [{ image: 1, caption: 'x' }]
  assert.throws(() => assertCreatePayload(data, 'dihexa'), CreatePayloadViolation)
})

test('the guard reads no command-line flag', () => {
  assert.equal(assertCreatePayload.length, 2, 'guard takes (data, slug) only')
  const src = fs.readFileSync(path.join(import.meta.dirname, '..', '..', 'create-products.ts'), 'utf8')
  const start = src.indexOf('export function assertCreatePayload')
  const end = src.indexOf('export interface CreatePlanEntry')
  assert.ok(!/argv|process\.argv|createStatus ===/.test(src.slice(start, end)), 'the guard must not read flags')
})

// ---------------------------------------------------------------------------
// Payload contents
// ---------------------------------------------------------------------------

test('the name is the canonical catalogue name, never the seoTitle', () => {
  const data = payloadFor('dihexa')
  const catalog = MASTER_PRODUCTS.find((p) => p.slug === 'dihexa')
  assert.equal(data.name, catalog!.name)
  assert.notEqual(data.name, data.seoTitle)
})

test('the price is the supplied CSV price, not the catalogue price', () => {
  const csv = new Map<string, number>()
  for (const r of loadSuppliedPrices()) {
    const k = slugifyProductName(r.product)
    csv.set(k, Math.min(csv.get(k) ?? Number.POSITIVE_INFINITY, r.priceUsd))
  }
  for (const slug of ['dihexa', 'semaglutide', 'mots-c']) {
    const data = payloadFor(slug)
    assert.equal(data.price, csv.get(slug), `${slug} must take the lowest CSV price`)
    const catalog = MASTER_PRODUCTS.find((p) => p.slug === slug)
    assert.notEqual(data.price, catalog!.basePrice, `${slug} must not take the catalogue price`)
  }
})

test('a create is a draft and not visible unless explicitly made active', () => {
  const draft = payloadFor('dihexa', 'draft')
  assert.equal(draft.status, 'draft')
  assert.equal(draft.isVisible, false)
  const active = payloadFor('dihexa', 'active')
  assert.equal(active.status, 'active')
  assert.equal(active.isVisible, true)
})

test('stock starts at zero, never invented', () => {
  assert.equal(payloadFor('dihexa').stock, 0)
  for (const v of payloadFor('semaglutide').variants as { stock: number }[]) {
    assert.equal(v.stock, 0)
  }
})

test('all twelve content fields are present and non-empty', () => {
  const data = payloadFor('semaglutide')
  for (const k of CONTENT_FIELD_KEYS) {
    assert.ok(data[k] !== undefined, `${k} must be present`)
    if (k === 'faqs') assert.equal((data[k] as unknown[]).length, 10)
    else assert.ok(String(data[k]).length > 0, `${k} must be non-empty`)
  }
})

test('variant SKUs on a create come from masterCatalogData', () => {
  const data = payloadFor('semaglutide')
  const catalog = MASTER_PRODUCTS.find((p) => p.slug === 'semaglutide')
  for (const v of data.variants as { sku: string }[]) {
    assert.ok(catalog!.variants.some((cv) => cv.sku === v.sku), `${v.sku} must exist in the catalogue`)
  }
})

// ---------------------------------------------------------------------------
// Planning and eligibility
// ---------------------------------------------------------------------------

test('a slug that already exists is skipped — this script only creates', () => {
  const [p] = buildCreatePlan({ only: ['dihexa'], existingSlugs: new Set(['dihexa']) })
  assert.equal(p.eligible, false)
  assert.ok(p.skipReasons.includes('ALREADY_EXISTS'))
})

test('BLOCKED products are refused when no override is recorded', () => {
  const noOverrides = { approved: new Set<string>(), reviewLog: {}, fileExists: true, blockedButListed: [], blockedOverrides: new Map() }
  for (const slug of BLOCKED_SLUGS) {
    const [p] = buildCreatePlan({ only: [slug], approvals: noOverrides })
    if (!p) continue
    assert.equal(p.eligible, false, `${slug} must not be eligible`)
    assert.ok(p.skipReasons.includes('BLOCKED'), `${slug} must be refused as BLOCKED`)
  }
})

test('an unapproved product is refused', () => {
  const approvals = loadApprovals()
  const unapproved = buildCreatePlan().filter(
    (p) => !approvals.approved.has(p.slug) && !BLOCKED_SLUGS.has(p.slug),
  )
  for (const p of unapproved) {
    assert.equal(p.eligible, false, `${p.slug} must not be eligible`)
    assert.ok(p.skipReasons.includes('NOT_APPROVED'))
  }
})

test('every eligible product has a name, a positive price and at least one image', () => {
  const eligible = buildCreatePlan().filter((p) => p.eligible)
  assert.ok(eligible.length > 0, 'the fixture must contain eligible products')
  for (const p of eligible) {
    assert.ok(p.name && p.name.length > 0, `${p.slug} must have a canonical name`)
    assert.ok(p.price > 0, `${p.slug} must have a positive price`)
    assert.ok(p.files.length > 0, `${p.slug} must have imagery`)
    for (const f of p.files) {
      assert.ok(fs.existsSync(f.absolutePath), `${f.resolved} must exist on disk`)
      assert.match(f.resolved, /^amino-/)
    }
  }
})

test('no image file is claimed by two products', () => {
  const owner = new Map<string, string>()
  for (const p of buildCreatePlan()) {
    for (const f of p.files) {
      assert.equal(owner.get(f.resolved), undefined, `${f.resolved} claimed twice`)
      owner.set(f.resolved, p.slug)
    }
  }
})

test('--only restricts the plan and never widens it', () => {
  assert.equal(buildCreatePlan({ only: ['dihexa'] }).length, 1)
  assert.equal(buildCreatePlan({ only: ['dihexa', 'mots-c'] }).length, 2)
  assert.equal(buildCreatePlan({ only: ['no-such-slug'] }).length, 0)
})

// ---------------------------------------------------------------------------
// Retry safety
// ---------------------------------------------------------------------------

test('planning is pure and repeatable', () => {
  const a = JSON.stringify(buildCreatePlan({ only: ['dihexa', 'mots-c'] }))
  const b = JSON.stringify(buildCreatePlan({ only: ['dihexa', 'mots-c'] }))
  assert.equal(a, b)
})

test('a rerun after a successful create plans nothing for that slug', () => {
  const first = planFor('dihexa')
  assert.equal(first.eligible, true)
  const [second] = buildCreatePlan({ only: ['dihexa'], existingSlugs: new Set(['dihexa']) })
  assert.equal(second.eligible, false, 'a rerun must not create a duplicate')
})

test('the payload is idempotent for the same inputs', () => {
  assert.deepEqual(payloadFor('dihexa'), payloadFor('dihexa'))
})

test('planning opens no database connection', () => {
  const before = process.env.DATABASE_URI
  try {
    delete process.env.DATABASE_URI
    assert.ok(planFor('dihexa').price > 0)
  } finally {
    if (before !== undefined) process.env.DATABASE_URI = before
  }
})
