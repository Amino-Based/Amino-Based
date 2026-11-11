/**
 * Shared types for the generated-product importer.
 *
 * Nothing in this module imports `payload` or touches the database, so it can be
 * unit-tested without credentials.
 */

/** The twelve content fields the importer is authorised to write. */
export const CONTENT_FIELD_KEYS = [
  'seoTitle',
  'seoDescription',
  'description',
  'productDetailsTitle',
  'productDetailsDescription',
  'researchFocusTitle',
  'researchFocusDescription',
  'qualityPurityTitle',
  'qualityPurityDescription',
  'complianceNoticeTitle',
  'complianceNoticeDescription',
  'faqs',
] as const

export type ContentFieldKey = (typeof CONTENT_FIELD_KEYS)[number]

export interface GeneratedFaq {
  question: string
  answer: string
}

export interface GeneratedPayloadFields {
  seoTitle: string
  seoDescription: string
  description: string
  productDetailsTitle: string
  productDetailsDescription: string
  researchFocusTitle: string
  researchFocusDescription: string
  qualityPurityTitle: string
  qualityPurityDescription: string
  complianceNoticeTitle: string
  complianceNoticeDescription: string
  faqs: GeneratedFaq[]
}

/** `_meta.variants_from_csv[]` — variant label plus the price as supplied. */
export interface GeneratedVariantRef {
  variant: string
  price_usd: string
}

/** `_meta.images[]` — one entry per variant. */
export interface GeneratedImageRef {
  variant: string
  source_file: string
  /**
   * The intended Media filename. NOTE: for `ll-37` this field disagrees with
   * image-rename-manifest.json. The manifest is authoritative — see
   * `resolveImageTarget` in ./images.ts.
   */
  upload_as: string
}

export type GeneratedStatus = 'BLOCKED' | 'NEEDS VERIFICATION' | 'COMPLETE'

export interface GeneratedProduct {
  file: string
  slug: string
  status: GeneratedStatus
  statusReason: string
  payloadCollection: string
  variants: GeneratedVariantRef[]
  images: GeneratedImageRef[]
  fields: GeneratedPayloadFields
  qc: {
    mainContentWords: number
    faqCount: number
    ruoDisclaimerPresent: boolean
    humanDosingPresent: boolean
    treatmentClaimsPresent: boolean
    purityClaimPresent: boolean
  }
}

/** One original -> renamed pair from image-rename-manifest.json. */
export interface RenameEntry {
  original: string
  renamed: string
}

export interface ResolvedImage {
  slug: string
  variant: string
  /** Filename declared in the product JSON (`upload_as`). */
  declared: string
  /** Filename the manifest + disk agree on. This is what gets uploaded. */
  resolved: string
  /** True when `declared !== resolved`, i.e. the JSON field is stale. */
  correctedByManifest: boolean
  absolutePath: string
  existsOnDisk: boolean
  readable: boolean
  byteSize: number
  sha256: string | null
  /** Detected from magic bytes, not from the extension. */
  detectedFormat: string | null
}

export type SkipReason =
  | 'BLOCKED'
  | 'NOT_APPROVED'
  | 'NOT_CANONICAL'
  | 'IMAGE_UNRESOLVED'
  | 'CONTENT_INVALID'
  | 'PRICE_DISAGREEMENT'
  | 'AMBIGUOUS_IDENTITY'
  | 'NOT_IN_DATABASE'
  | 'NO_CANONICAL_NAME'

export type PlannedAction = 'update' | 'create' | 'skip'

export interface ProductPlan {
  slug: string
  action: PlannedAction
  skipReasons: SkipReason[]
  notes: string[]
  images: ResolvedImage[]
  /** Fields the importer would write. Never includes price/sku/stock/COA fields. */
  fieldsToWrite: ContentFieldKey[]
}
