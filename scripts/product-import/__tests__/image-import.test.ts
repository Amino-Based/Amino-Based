/**
 * Tests for the product image importer (`scripts/import-product-images.ts`).
 *
 * This script exists because the content importer's `assertNoImageOrMediaFields`
 * guard refuses `images` on every write path in every mode, by design, and the
 * suite in ./product-import.test.ts pins that design structurally. Rather than
 * weaken that guard, image attachment lives here behind its own gates.
 *
 * These tests are pure: they read the generated JSON, the rename manifest and
 * the image directory from disk, and never open a database connection, upload
 * media or write anything.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'

import {
  buildImagePlan,
  buildImagePayload,
  assertImagesOnlyPayload,
  ImagePayloadViolation,
  IMAGE_WRITABLE_FIELDS,
  IMAGE_FORBIDDEN_FIELDS,
} from '../../import-product-images.js'
import { BLOCKED_SLUGS, loadApprovals } from '../approvals.js'

/** The seven slugs approved in approvals.json at the time of writing. */
const APPROVED = ['semax', 'ghk-cu', 'epitalon', 'nad', 'bpc-157', 'glp-1trz', 'glp-3rta']

// ---------------------------------------------------------------------------
// Payload guard
// ---------------------------------------------------------------------------

test('the payload carries exactly one field, images', () => {
  const data = buildImagePayload([1, 2], 'glp-1trz')
  assert.deepEqual(Object.keys(data), ['images'])
  assert.deepEqual([...IMAGE_WRITABLE_FIELDS], ['images'])
})

test('each image row is exactly { image: id }', () => {
  const data = buildImagePayload([7, 9], 'glp-1trz')
  assert.deepEqual(data.images, [{ image: 7 }, { image: 9 }])
})

test('every forbidden field is refused, including price and content fields', () => {
  for (const field of IMAGE_FORBIDDEN_FIELDS) {
    assert.throws(
      () => assertImagesOnlyPayload({ images: [], [field]: 'x' }, 'glp-1trz'),
      ImagePayloadViolation,
      `${field} must be refused`,
    )
  }
})

test('price and variant fields specifically cannot ride along', () => {
  // The price importer owns these; this script must never touch them.
  for (const field of ['price', 'salePrice', 'hasVariants', 'variants', 'stock', 'sku']) {
    assert.throws(
      () => assertImagesOnlyPayload({ images: [], [field]: 1 }, 'glp-1trz'),
      ImagePayloadViolation,
      `${field} must be refused`,
    )
  }
})

test('content fields cannot ride along', () => {
  for (const field of ['description', 'faqs', 'seoTitle', 'coaFile', 'status', 'isVisible']) {
    assert.throws(
      () => assertImagesOnlyPayload({ images: [], [field]: 'x' }, 'glp-1trz'),
      ImagePayloadViolation,
      `${field} must be refused`,
    )
  }
})

test('an unknown field is refused even though it is on no list', () => {
  assert.throws(
    () => assertImagesOnlyPayload({ images: [], somethingNew: true }, 'glp-1trz'),
    ImagePayloadViolation,
  )
})

test('a malformed image row is refused', () => {
  assert.throws(
    () => assertImagesOnlyPayload({ images: [{ image: 1, caption: 'x' }] }, 'glp-1trz'),
    ImagePayloadViolation,
    'an extra key on an image row must be refused',
  )
  assert.throws(
    () => assertImagesOnlyPayload({ images: [{ media: 1 }] }, 'glp-1trz'),
    ImagePayloadViolation,
    'the relationship key must be named image',
  )
  assert.throws(
    () => assertImagesOnlyPayload({ images: 'not-an-array' as unknown as [] }, 'glp-1trz'),
    ImagePayloadViolation,
  )
})

test('an empty image list is structurally valid', () => {
  assert.doesNotThrow(() => assertImagesOnlyPayload({ images: [] }, 'glp-1trz'))
})

test('the guard reads no command-line flag, matching the content importer contract', () => {
  assert.equal(assertImagesOnlyPayload.length, 2, 'guard takes (data, slug) only')
  const src = fs.readFileSync(
    path.join(import.meta.dirname, '..', '..', 'import-product-images.ts'),
    'utf8',
  )
  const start = src.indexOf('export function assertImagesOnlyPayload')
  const end = src.indexOf('export interface ImagePlanEntry')
  const region = src.slice(start, end)
  assert.ok(
    !/withImages|contentOnly|argv|process\.argv/.test(region),
    'the guard must not read flags',
  )
})

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

test('the approved products each resolve to at least one readable image', () => {
  for (const slug of APPROVED) {
    const [plan] = buildImagePlan({ only: [slug] })
    assert.ok(plan, `${slug} must plan`)
    assert.ok(plan.files.length > 0, `${slug} must have a usable image on disk`)
    assert.deepEqual(plan.skipReasons, [], `${slug} must be eligible`)
    assert.equal(plan.eligible, true)
  }
})

test('every planned file exists on disk and is readable', () => {
  for (const plan of buildImagePlan({ only: APPROVED })) {
    for (const f of plan.files) {
      assert.ok(fs.existsSync(f.absolutePath), `${f.resolved} must exist at ${f.absolutePath}`)
      assert.ok(fs.statSync(f.absolutePath).size > 0, `${f.resolved} must not be empty`)
    }
  }
})

test('planned filenames carry the amino- prefix', () => {
  for (const plan of buildImagePlan({ only: APPROVED })) {
    for (const f of plan.files) {
      assert.match(f.resolved, /^amino-/, `${f.resolved} must use the amino- prefix`)
    }
  }
})

test('no file is attached to two different products', () => {
  const owner = new Map<string, string>()
  for (const plan of buildImagePlan()) {
    for (const f of plan.files) {
      const prev = owner.get(f.resolved)
      assert.equal(prev, undefined, `${f.resolved} claimed by both ${prev} and ${plan.slug}`)
      owner.set(f.resolved, plan.slug)
    }
  }
})

test('no product plans the same file twice', () => {
  for (const plan of buildImagePlan()) {
    const names = plan.files.map((f) => f.resolved)
    assert.equal(new Set(names).size, names.length, `duplicate file within ${plan.slug}`)
  }
})

test('a product that already has imagery is skipped, never overwritten', () => {
  const existing = new Map<string, number>([['glp-1trz', 4]])
  const [plan] = buildImagePlan({ only: ['glp-1trz'], existingImageCountBySlug: existing })
  assert.equal(plan.eligible, false)
  assert.ok(
    plan.skipReasons.some((r) => r.includes('already has 4 image relationship')),
    'the reason must name the existing count',
  )
})

test('a product with no existing imagery is eligible', () => {
  const [plan] = buildImagePlan({
    only: ['glp-1trz'],
    existingImageCountBySlug: new Map([['glp-1trz', 0]]),
  })
  assert.equal(plan.eligible, true)
  assert.deepEqual(plan.skipReasons, [])
})

test('BLOCKED products are refused when no override is recorded', () => {
  // Pinned against an allowlist with no overrides, so this holds regardless of
  // what approvals.json currently authorises.
  const noOverrides = { approved: new Set<string>(), reviewLog: {}, fileExists: true, blockedButListed: [], blockedOverrides: new Map() }
  for (const slug of BLOCKED_SLUGS) {
    const [plan] = buildImagePlan({ only: [slug], approvals: noOverrides })
    if (!plan) continue
    assert.equal(plan.eligible, false, `${slug} must not be eligible`)
    assert.ok(plan.skipReasons.includes('BLOCKED'), `${slug} must be refused as BLOCKED`)
  }
})

test('unapproved products are refused', () => {
  const approvals = loadApprovals()
  const plans = buildImagePlan()
  const unapproved = plans.filter(
    (p) => !approvals.approved.has(p.slug) && !BLOCKED_SLUGS.has(p.slug),
  )
  // Once the owner has authorised the whole catalogue this set is empty, which
  // is a valid state: the assertion is that any such product is refused, not
  // that one must exist.
  for (const p of unapproved) {
    assert.equal(p.eligible, false, `${p.slug} must not be eligible`)
    assert.ok(p.skipReasons.includes('NOT_APPROVED'))
  }
})

test('only approved, unblocked products with imagery are eligible', () => {
  const approvals = loadApprovals()
  const eligible = buildImagePlan().filter((p) => p.eligible).map((p) => p.slug)
  for (const slug of eligible) {
    const authorised = approvals.approved.has(slug) || approvals.blockedOverrides.has(slug)
    assert.ok(authorised, slug + ' must be approved or carry an override to be eligible')
  }
  // The seven originally approved products must still be eligible.
  for (const slug of APPROVED) {
    assert.ok(eligible.includes(slug), slug + ' must remain eligible')
  }
  // A blocked product appears only when a complete override authorises it.
  for (const slug of BLOCKED_SLUGS) {
    if (eligible.includes(slug)) {
      assert.ok(approvals.blockedOverrides.has(slug), slug + ' needs a recorded override to appear')
    }
  }
})

test('--only restricts the plan and never widens it', () => {
  assert.equal(buildImagePlan({ only: ['glp-1trz'] }).length, 1)
  assert.equal(buildImagePlan({ only: ['glp-1trz', 'glp-3rta'] }).length, 2)
  assert.equal(buildImagePlan({ only: ['no-such-slug'] }).length, 0)
})

// ---------------------------------------------------------------------------
// Retry safety
// ---------------------------------------------------------------------------

test('planning is pure and repeatable, so a retry plans the same thing', () => {
  const a = JSON.stringify(buildImagePlan({ only: APPROVED }))
  const b = JSON.stringify(buildImagePlan({ only: APPROVED }))
  assert.equal(a, b)
})

test('the payload is idempotent for the same media ids', () => {
  assert.deepEqual(buildImagePayload([1, 2, 3], 'glp-1trz'), buildImagePayload([1, 2, 3], 'glp-1trz'))
})

test('a rerun after a successful attach plans nothing, because imagery now exists', () => {
  // First run attaches; the database then reports a non-zero count, which makes
  // the second run a no-op rather than a duplicate attach.
  const [first] = buildImagePlan({ only: ['glp-1trz'] })
  assert.equal(first.eligible, true)
  const after = new Map([['glp-1trz', first.files.length]])
  const [second] = buildImagePlan({ only: ['glp-1trz'], existingImageCountBySlug: after })
  assert.equal(second.eligible, false, 'a rerun must not re-attach')
})

test('planning opens no database connection and reads no credentials', () => {
  const before = process.env.DATABASE_URI
  try {
    delete process.env.DATABASE_URI
    assert.ok(buildImagePlan({ only: ['glp-1trz'] })[0].files.length > 0)
  } finally {
    if (before !== undefined) process.env.DATABASE_URI = before
  }
})
