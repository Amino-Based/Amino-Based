/**
 * The BLOCKED refusal and the only thing that lifts it.
 *
 * Eight products carry an unresolved identity or potency question. The default
 * remains refusal, and ordinary approval can never reach them — putting a
 * blocked slug in `approvedSlugs` is still not enough. The refusal lifts only
 * for a per-product override record naming a reviewer, an ISO date and the
 * specific question being accepted.
 *
 * These tests pin that the mechanism fails CLOSED: anything missing, malformed
 * or perfunctory leaves the product refused.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  loadApprovals,
  isPublishable,
  isValidBlockedOverride,
  BLOCKED_SLUGS,
  MIN_ACKNOWLEDGEMENT_LENGTH,
  type Approvals,
  type BlockedOverride,
} from '../approvals.js'
import { loadProducts } from '../content.js'

const LONG = 'x'.repeat(MIN_ACKNOWLEDGEMENT_LENGTH)
const GOOD: BlockedOverride = { reviewer: 'project owner', date: '2026-11-12', acknowledgement: LONG }

function approvalsWith(overrides: Record<string, BlockedOverride>): Approvals {
  return {
    approved: new Set<string>(),
    reviewLog: {},
    fileExists: true,
    blockedButListed: [],
    blockedOverrides: new Map(Object.entries(overrides)),
  }
}

function blockedProduct(slug = 'tb-500') {
  const p = loadProducts().products.find((x) => x.slug === slug)
  assert.ok(p, `${slug} must exist`)
  return p!
}

// ---------------------------------------------------------------------------
// The refusal holds by default
// ---------------------------------------------------------------------------

test('a blocked product with no override is refused', () => {
  const p = blockedProduct()
  assert.deepEqual(isPublishable(p, approvalsWith({})), { ok: false, reason: 'BLOCKED' })
})

test('the allowlist still cannot reach a blocked product', () => {
  const p = blockedProduct()
  const a: Approvals = {
    approved: new Set(['tb-500']),
    reviewLog: {},
    fileExists: true,
    blockedButListed: ['tb-500'],
    blockedOverrides: new Map(),
  }
  assert.deepEqual(isPublishable(p, a), { ok: false, reason: 'BLOCKED' })
})

test('an override for a different product does not help', () => {
  const p = blockedProduct('tb-500')
  assert.deepEqual(isPublishable(p, approvalsWith({ hcg: GOOD })), { ok: false, reason: 'BLOCKED' })
})

// ---------------------------------------------------------------------------
// The override must be complete; it fails closed
// ---------------------------------------------------------------------------

test('a valid override lifts the refusal', () => {
  assert.equal(isValidBlockedOverride(GOOD), true)
  assert.deepEqual(isPublishable(blockedProduct(), approvalsWith({ 'tb-500': GOOD })), { ok: true })
})

test('a missing reviewer, date or acknowledgement fails closed', () => {
  const variants: BlockedOverride[] = [
    { ...GOOD, reviewer: '' },
    { ...GOOD, reviewer: '   ' },
    { ...GOOD, date: '' },
    { ...GOOD, acknowledgement: '' },
  ]
  for (const v of variants) {
    assert.equal(isValidBlockedOverride(v), false)
    assert.deepEqual(isPublishable(blockedProduct(), approvalsWith({ 'tb-500': v })), {
      ok: false,
      reason: 'BLOCKED',
    })
  }
})

test('a non-ISO date fails closed', () => {
  for (const date of ['12/11/2026', '2026-13', 'yesterday', '26-11-12']) {
    assert.equal(isValidBlockedOverride({ ...GOOD, date }), false, `${date} must be rejected`)
  }
})

test('a perfunctory acknowledgement fails closed', () => {
  for (const ack of ['ok', 'approved', 'fine', 'x'.repeat(MIN_ACKNOWLEDGEMENT_LENGTH - 1)]) {
    assert.equal(isValidBlockedOverride({ ...GOOD, acknowledgement: ack }), false)
  }
  assert.equal(isValidBlockedOverride({ ...GOOD, acknowledgement: 'y'.repeat(MIN_ACKNOWLEDGEMENT_LENGTH) }), true)
})

test('an absent override object fails closed', () => {
  assert.equal(isValidBlockedOverride(undefined), false)
})

// ---------------------------------------------------------------------------
// The live approvals file
// ---------------------------------------------------------------------------

test('an override is only honoured for a genuinely blocked slug', () => {
  const a = loadApprovals()
  for (const slug of a.blockedOverrides.keys()) {
    assert.ok(BLOCKED_SLUGS.has(slug), `${slug} is not blocked and needs no override`)
  }
})

test('every live override is complete and names the unresolved question', () => {
  const a = loadApprovals()
  const products = loadProducts().products
  for (const [slug, o] of a.blockedOverrides) {
    assert.equal(isValidBlockedOverride(o), true, `${slug} override must be valid`)
    const p = products.find((x) => x.slug === slug)
    assert.ok(p, `${slug} must have generated content`)
    // The acknowledgement must quote the generator's own reason, so it cannot
    // be a generic sign-off detached from what is actually unresolved.
    const firstClause = p!.statusReason.replace(/\s+/g, ' ').trim().split('.')[0]
    assert.ok(
      o.acknowledgement.includes(firstClause),
      `${slug} acknowledgement must quote its status reason`,
    )
    assert.ok(/NOT considered resolved/i.test(o.acknowledgement), `${slug} must not claim resolution`)
  }
})

test('the blocked set itself is unchanged — the knowledge is preserved', () => {
  assert.deepEqual(
    [...BLOCKED_SLUGS].sort(),
    ['5-amino-1mq', 'bpc-157-tb-500-blend', 'glow', 'hcg', 'igf-1-lr3', 'klow', 'lipo-c', 'tb-500'],
  )
  const generated = loadProducts()
    .products.filter((p) => p.status === 'BLOCKED')
    .map((p) => p.slug)
    .sort()
  assert.deepEqual(generated, [...BLOCKED_SLUGS].sort(), 'the generator and the list must agree')
})

test('no blocked slug is in approvedSlugs, so the original invariant still holds', () => {
  const a = loadApprovals()
  assert.deepEqual(a.blockedButListed, [])
  for (const slug of BLOCKED_SLUGS) {
    assert.equal(a.approved.has(slug), false, `${slug} must never be in the allowlist`)
  }
})
