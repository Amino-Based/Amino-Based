/**
 * Publishing is the one write with an immediate public effect, so it is isolated
 * in its own script and gated on publishability. These tests pin that:
 *   - only `status` and `isVisible` are ever written, and they cannot disagree;
 *   - going live requires the product to be publishable;
 *   - taking a product down is always allowed.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  assertStatusOnlyPayload,
  buildStatusPayload,
  canSetStatus,
  StatusPayloadViolation,
  STATUS_WRITABLE_FIELDS,
  VALID_STATUSES,
} from '../../set-product-status.js'
import { BLOCKED_SLUGS, type Approvals } from '../approvals.js'

const noOverrides: Approvals = {
  approved: new Set<string>(['dihexa']),
  reviewLog: {},
  fileExists: true,
  blockedButListed: [],
  blockedOverrides: new Map(),
}

test('the payload carries exactly status and isVisible', () => {
  assert.deepEqual(Object.keys(buildStatusPayload('active', 'dihexa')).sort(), [...STATUS_WRITABLE_FIELDS].sort())
})

test('active implies visible, every other status implies hidden', () => {
  assert.deepEqual(buildStatusPayload('active', 'x'), { status: 'active', isVisible: true })
  assert.deepEqual(buildStatusPayload('draft', 'x'), { status: 'draft', isVisible: false })
  assert.deepEqual(buildStatusPayload('archived', 'x'), { status: 'archived', isVisible: false })
})

test('a payload whose visibility contradicts its status is refused', () => {
  assert.throws(() => assertStatusOnlyPayload({ status: 'draft', isVisible: true }, 'x'), StatusPayloadViolation)
  assert.throws(() => assertStatusOnlyPayload({ status: 'active', isVisible: false }, 'x'), StatusPayloadViolation)
})

test('any other field is refused', () => {
  for (const f of ['price', 'images', 'description', 'variants', 'stock', 'coaPurity', 'name']) {
    assert.throws(
      () => assertStatusOnlyPayload({ status: 'active', isVisible: true, [f]: 'x' }, 'x'),
      StatusPayloadViolation,
      `${f} must be refused`,
    )
  }
})

test('an invalid status is refused', () => {
  for (const s of ['published', 'live', '', 'ACTIVE']) {
    assert.throws(() => assertStatusOnlyPayload({ status: s, isVisible: false }, 'x'), StatusPayloadViolation)
  }
  assert.deepEqual(VALID_STATUSES, ['draft', 'active', 'archived'])
})

test('a non-boolean isVisible is refused', () => {
  assert.throws(() => assertStatusOnlyPayload({ status: 'active', isVisible: 'yes' }, 'x'), StatusPayloadViolation)
})

test('going live requires the product to be publishable', () => {
  assert.deepEqual(canSetStatus('dihexa', 'active', noOverrides), { ok: true })
  // On the allowlist fixture above, nothing else is approved.
  assert.deepEqual(canSetStatus('mots-c', 'active', noOverrides), { ok: false, reason: 'NOT_APPROVED' })
})

test('a blocked product cannot go live without a recorded override', () => {
  for (const slug of BLOCKED_SLUGS) {
    const r = canSetStatus(slug, 'active', noOverrides)
    assert.equal(r.ok, false, `${slug} must not be publishable`)
    assert.equal(r.reason, 'BLOCKED')
  }
})

test('taking a product down is always allowed, even when blocked', () => {
  for (const status of ['draft', 'archived'] as const) {
    assert.deepEqual(canSetStatus('tb-500', status, noOverrides), { ok: true })
    assert.deepEqual(canSetStatus('mots-c', status, noOverrides), { ok: true })
  }
})

test('a slug with no generated content cannot go live', () => {
  assert.deepEqual(canSetStatus('no-such-product', 'active', noOverrides), {
    ok: false,
    reason: 'NO_GENERATED_CONTENT',
  })
})

test('the guard reads no command-line flag', () => {
  assert.equal(assertStatusOnlyPayload.length, 2, 'guard takes (data, slug) only')
})
