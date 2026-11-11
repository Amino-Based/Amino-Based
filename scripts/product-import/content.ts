import fs from 'fs'
import path from 'path'
import { CONTENT_DIR, NON_PRODUCT_FILES } from './config.js'
import { CONTENT_FIELD_KEYS, type GeneratedProduct, type GeneratedStatus } from './types.js'

/**
 * Loads and validates the generated product JSON files.
 *
 * This module is strictly read-only over `content-generation/`. It never
 * rewrites, normalises or reformats a source file: a file that fails validation
 * is reported, not repaired.
 */

export interface ContentValidationIssue {
  file: string
  slug: string | null
  problem: string
}

export interface ContentLoadResult {
  products: GeneratedProduct[]
  issues: ContentValidationIssue[]
  filesSeen: number
}

const VALID_STATUSES: GeneratedStatus[] = ['BLOCKED', 'NEEDS VERIFICATION', 'COMPLETE']

/** Payload's own limit for the SEO description field as used across this project. */
export const SEO_DESCRIPTION_MAX = 160

export function listProductFiles(dir: string = CONTENT_DIR): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !NON_PRODUCT_FILES.has(f))
    .sort()
    .map((f) => path.join(dir, f))
}

function nonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export function loadProducts(dir: string = CONTENT_DIR): ContentLoadResult {
  const files = listProductFiles(dir)
  const products: GeneratedProduct[] = []
  const issues: ContentValidationIssue[] = []

  for (const file of files) {
    const base = path.basename(file)
    let raw: any
    try {
      raw = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (err) {
      issues.push({ file: base, slug: null, problem: `unparseable JSON: ${(err as Error).message}` })
      continue
    }

    const meta = raw?._meta
    const pf = raw?.payload_fields
    const slug: string | null = nonEmptyString(meta?.slug) ? meta.slug : null

    if (!meta) {
      issues.push({ file: base, slug, problem: 'missing _meta' })
      continue
    }
    if (!pf) {
      issues.push({ file: base, slug, problem: 'missing payload_fields' })
      continue
    }
    if (!slug) {
      issues.push({ file: base, slug: null, problem: 'missing _meta.slug' })
      continue
    }
    if (slug !== base.replace(/\.json$/, '')) {
      issues.push({ file: base, slug, problem: `_meta.slug "${slug}" does not match filename` })
    }

    const status = meta.status as GeneratedStatus
    if (!VALID_STATUSES.includes(status)) {
      issues.push({ file: base, slug, problem: `unrecognised _meta.status "${String(status)}"` })
    }
    if (meta.payload_collection !== 'products') {
      issues.push({
        file: base,
        slug,
        problem: `_meta.payload_collection is "${String(meta.payload_collection)}", expected "products"`,
      })
    }

    // The twelve authorised content fields must all be present and non-empty.
    for (const key of CONTENT_FIELD_KEYS) {
      const v = pf[key]
      if (key === 'faqs') {
        if (!Array.isArray(v) || v.length === 0) {
          issues.push({ file: base, slug, problem: 'faqs missing or empty' })
          continue
        }
        if (v.length < 10 || v.length > 12) {
          issues.push({ file: base, slug, problem: `faqs length ${v.length} outside 10-12` })
        }
        v.forEach((f: any, i: number) => {
          if (!nonEmptyString(f?.question) || !nonEmptyString(f?.answer)) {
            issues.push({ file: base, slug, problem: `faq[${i}] missing question or answer` })
          }
        })
        continue
      }
      if (!nonEmptyString(v)) {
        issues.push({ file: base, slug, problem: `${key} missing or empty` })
      }
    }

    if (nonEmptyString(pf.seoDescription) && pf.seoDescription.length > SEO_DESCRIPTION_MAX) {
      issues.push({
        file: base,
        slug,
        problem: `seoDescription ${pf.seoDescription.length} chars exceeds ${SEO_DESCRIPTION_MAX}`,
      })
    }

    const qc = meta.qc ?? {}
    // RUO compliance gates. A failure here is a hard content defect, not a warning.
    if (qc.human_dosing_present === true) {
      issues.push({ file: base, slug, problem: 'qc.human_dosing_present is true (RUO violation)' })
    }
    if (qc.treatment_claims_present === true) {
      issues.push({ file: base, slug, problem: 'qc.treatment_claims_present is true (RUO violation)' })
    }
    if (qc.ruo_disclaimer_present !== true) {
      issues.push({ file: base, slug, problem: 'qc.ruo_disclaimer_present is not true' })
    }

    products.push({
      file: base,
      slug,
      status,
      statusReason: typeof meta.status_reason === 'string' ? meta.status_reason : '',
      payloadCollection: String(meta.payload_collection ?? ''),
      variants: Array.isArray(meta.variants_from_csv) ? meta.variants_from_csv : [],
      images: Array.isArray(meta.images) ? meta.images : [],
      fields: {
        seoTitle: pf.seoTitle,
        seoDescription: pf.seoDescription,
        description: pf.description,
        productDetailsTitle: pf.productDetailsTitle,
        productDetailsDescription: pf.productDetailsDescription,
        researchFocusTitle: pf.researchFocusTitle,
        researchFocusDescription: pf.researchFocusDescription,
        qualityPurityTitle: pf.qualityPurityTitle,
        qualityPurityDescription: pf.qualityPurityDescription,
        complianceNoticeTitle: pf.complianceNoticeTitle,
        complianceNoticeDescription: pf.complianceNoticeDescription,
        faqs: Array.isArray(pf.faqs) ? pf.faqs : [],
      },
      qc: {
        mainContentWords: Number(qc.main_content_words ?? 0),
        faqCount: Array.isArray(pf.faqs) ? pf.faqs.length : 0,
        ruoDisclaimerPresent: qc.ruo_disclaimer_present === true,
        humanDosingPresent: qc.human_dosing_present === true,
        treatmentClaimsPresent: qc.treatment_claims_present === true,
        purityClaimPresent: qc.purity_claim_present === true,
      },
    })
  }

  // Duplicate slugs would make identity ambiguous and must block those products.
  const seen = new Map<string, string[]>()
  for (const p of products) {
    seen.set(p.slug, [...(seen.get(p.slug) ?? []), p.file])
  }
  for (const [slug, srcFiles] of seen) {
    if (srcFiles.length > 1) {
      issues.push({ file: srcFiles.join(', '), slug, problem: `duplicate slug across ${srcFiles.length} files` })
    }
  }

  return { products, issues, filesSeen: files.length }
}

/** Slugs whose content failed validation, so they can be excluded from writes. */
export function slugsWithIssues(issues: ContentValidationIssue[]): Set<string> {
  return new Set(issues.map((i) => i.slug).filter((s): s is string => !!s))
}
