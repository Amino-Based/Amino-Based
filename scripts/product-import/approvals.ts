import fs from 'fs'
import { APPROVALS_FILE } from './config.js'
import type { GeneratedProduct } from './types.js'

/**
 * Explicit publication approval.
 *
 * Structural validity is not approval. A product is publishable only when a
 * human has reviewed its factual and compliance content and added its slug to
 * approvals.json. An empty allowlist — the shipped default — publishes nothing.
 */

export interface ApprovalsFile {
  approvedSlugs?: string[]
  reviewLog?: Record<string, { reviewer?: string; date?: string; note?: string }>
  blockedOverrides?: Record<string, BlockedOverride>
}

/**
 * A deliberate, recorded decision to publish a product the generator BLOCKED.
 *
 * Listing a blocked slug in `approvedSlugs` is still never enough — ordinary
 * approval cannot reach a blocked product, by design. Lifting the refusal takes
 * this separate record, which must name a reviewer, carry an ISO date, and
 * state the specific unresolved question being accepted. The minimum length on
 * `acknowledgement` exists so the field cannot be satisfied with "ok".
 */
export interface BlockedOverride {
  reviewer: string
  date: string
  /** The unresolved identity/potency question, acknowledged in full. */
  acknowledgement: string
}

/** An acknowledgement shorter than this is treated as absent. */
export const MIN_ACKNOWLEDGEMENT_LENGTH = 120

export function isValidBlockedOverride(o: BlockedOverride | undefined): boolean {
  if (!o) return false
  if (typeof o.reviewer !== 'string' || o.reviewer.trim().length === 0) return false
  if (typeof o.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.date)) return false
  if (typeof o.acknowledgement !== 'string') return false
  return o.acknowledgement.trim().length >= MIN_ACKNOWLEDGEMENT_LENGTH
}

/**
 * Slugs the generator marked BLOCKED. Refused even if someone adds them to the
 * allowlist, because each has an unresolved identity or potency question
 * recorded in its `_meta.status_reason`.
 */
export const BLOCKED_SLUGS = new Set([
  '5-amino-1mq',
  'bpc-157-tb-500-blend',
  'glow',
  'hcg',
  'igf-1-lr3',
  'klow',
  'lipo-c',
  'tb-500',
])

export interface Approvals {
  approved: Set<string>
  reviewLog: Record<string, { reviewer?: string; date?: string; note?: string }>
  fileExists: boolean
  /** Listed by an operator but refused because the generator blocked it. */
  blockedButListed: string[]
  /** Valid, recorded decisions to publish a BLOCKED product anyway. */
  blockedOverrides: Map<string, BlockedOverride>
}

export function loadApprovals(file: string = APPROVALS_FILE): Approvals {
  if (!fs.existsSync(file)) {
    return {
      approved: new Set(),
      reviewLog: {},
      fileExists: false,
      blockedButListed: [],
      blockedOverrides: new Map(),
    }
  }
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as ApprovalsFile
  const listed = (parsed.approvedSlugs ?? []).map((s) => s.trim()).filter(Boolean)
  const blockedButListed = listed.filter((s) => BLOCKED_SLUGS.has(s))
  // Only a well-formed override counts. A malformed one is dropped rather than
  // honoured, so a truncated or placeholder record fails closed.
  const blockedOverrides = new Map<string, BlockedOverride>()
  for (const [slug, o] of Object.entries(parsed.blockedOverrides ?? {})) {
    if (BLOCKED_SLUGS.has(slug) && isValidBlockedOverride(o)) blockedOverrides.set(slug, o)
  }

  return {
    approved: new Set(listed.filter((s) => !BLOCKED_SLUGS.has(s))),
    reviewLog: parsed.reviewLog ?? {},
    fileExists: true,
    blockedButListed,
    blockedOverrides,
  }
}

/**
 * Eligibility from status + allowlist alone. Image and database checks are
 * applied separately by the planner.
 */
export function isPublishable(product: GeneratedProduct, approvals: Approvals): { ok: boolean; reason?: string } {
  if (product.status === 'BLOCKED' || BLOCKED_SLUGS.has(product.slug)) {
    // The allowlist can never reach a blocked product. Only an explicit,
    // well-formed override record lifts the refusal, and it is per product.
    if (!isValidBlockedOverride(approvals.blockedOverrides.get(product.slug))) {
      return { ok: false, reason: 'BLOCKED' }
    }
    return { ok: true }
  }
  if (!approvals.approved.has(product.slug)) {
    return { ok: false, reason: 'NOT_APPROVED' }
  }
  return { ok: true }
}
