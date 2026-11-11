import { loadApprovals, isPublishable, type Approvals } from './approvals.js'
import {
  resolveIdentity,
  loadSuppliedPrices,
  resolveCanonicalProductName,
  type IdentityResolution,
  type SuppliedPriceRow,
} from './catalog.js'
import { auditImages, loadRenameManifest, resolveProductImages, type ImageAudit } from './images.js'
import { loadProducts, slugsWithIssues, type ContentLoadResult } from './content.js'
import { CONTENT_FIELD_KEYS, type GeneratedProduct, type ProductPlan, type ResolvedImage, type SkipReason } from './types.js'

/**
 * Builds the import plan. Pure computation over the filesystem — no Payload
 * import, no database connection, no uploads. The CLI decides what, if
 * anything, to do with the plan.
 */

export interface DatabaseView {
  /** slug -> existing product id. Empty when no database was consulted. */
  productIdBySlug: Map<string, string | number>
  /** Existing product-level image relationship counts, by slug. */
  existingImageCountBySlug: Map<string, number>
  /** media filename stem -> media id, for idempotent upload detection. */
  mediaIdByStem: Map<string, string | number>
  consulted: boolean
}

export const EMPTY_DATABASE_VIEW: DatabaseView = {
  productIdBySlug: new Map(),
  existingImageCountBySlug: new Map(),
  mediaIdByStem: new Map(),
  consulted: false,
}

/**
 * Fields the importer writes. Deliberately excludes price, salePrice, sku,
 * stock, variants, bulkBundles, categories, status, isVisible, isBestSeller,
 * averageRating, reviewCount and every coa* field — those are either manually
 * maintained, price-audit governed, or claims about a real assay.
 */
export const WRITABLE_FIELDS = CONTENT_FIELD_KEYS

/**
 * Fields that write, replace or reference media. These are the ones a
 * content-only run must never touch, and `assertNoImageOrMediaFields` refuses
 * any payload containing one regardless of mode or command-line flags.
 */
export const MEDIA_AND_IMAGE_FIELDS = [
  'images',
  'variants',
  'bulkBundles',
  'coaFile',
  'media',
  'image',
  'thumbnail',
  'gallery',
  'galleryImages',
] as const

export class ImageFieldViolation extends Error {}
export class ContentOnlyViolation extends Error {}

/**
 * Hard guard. Throws if a write payload carries any media or image field.
 *
 * This runs on every write path in every mode. It is deliberately independent
 * of `--with-images`, so the absence of a command-line flag is never the only
 * thing standing between the importer and a media write.
 */
export function assertNoImageOrMediaFields(data: Record<string, unknown>, slug: string): void {
  const offending = Object.keys(data).filter((k) =>
    (MEDIA_AND_IMAGE_FIELDS as readonly string[]).includes(k),
  )
  if (offending.length > 0) {
    throw new ImageFieldViolation(
      `REFUSED [${slug}]: write payload contains media/image field(s): ${offending.join(', ')}. ` +
        `This importer never writes product imagery.`,
    )
  }
}

/**
 * Hard guard for content-only mode. Throws unless every key in the payload is
 * one of the twelve authorised content fields — so an extra field cannot be
 * introduced by a future edit without this failing loudly.
 */
export function assertContentOnlyPayload(data: Record<string, unknown>, slug: string): void {
  assertNoImageOrMediaFields(data, slug)
  const allowed = new Set<string>(CONTENT_FIELD_KEYS as readonly string[])
  const extra = Object.keys(data).filter((k) => !allowed.has(k))
  if (extra.length > 0) {
    throw new ContentOnlyViolation(
      `REFUSED [${slug}]: content-only run, but payload contains non-content field(s): ${extra.join(', ')}. ` +
        `Permitted: ${[...allowed].join(', ')}.`,
    )
  }
}

/** Never written by this importer, under any flag. */
export const PROTECTED_FIELDS = [
  'price',
  'salePrice',
  'sku',
  'stock',
  'variants',
  'bulkBundles',
  'categories',
  'averageRating',
  'reviewCount',
  'coaFile',
  'coaBatchNumber',
  'coaPurity',
  'coaAnalyzedDate',
] as const

export interface PlanResult {
  content: ContentLoadResult
  imageAudit: ImageAudit
  resolvedImages: ResolvedImage[]
  identities: Map<string, IdentityResolution>
  approvals: Approvals
  plans: ProductPlan[]
  supplied: SuppliedPriceRow[]
}

export function buildPlan(
  opts: { only?: string[]; db?: DatabaseView; approvals?: Approvals } = {},
): PlanResult {
  const db = opts.db ?? EMPTY_DATABASE_VIEW
  const content = loadProducts()
  const manifest = loadRenameManifest()
  const resolvedImages = resolveProductImages(content.products, manifest)
  const imageAudit = auditImages(resolvedImages)
  // The allowlist is read from disk unless a caller supplies one. The override
  // exists so a test can pin approval behaviour against a fixed allowlist
  // rather than against whatever approvals.json happens to contain today; it
  // never changes what the CLI does, which always passes nothing here.
  const approvals = opts.approvals ?? loadApprovals()
  const supplied = loadSuppliedPrices()
  const badContent = slugsWithIssues(content.issues)

  const identities = new Map<string, IdentityResolution>()
  const plans: ProductPlan[] = []

  const only = new Set(opts.only ?? [])

  for (const p of content.products) {
    if (only.size > 0 && !only.has(p.slug)) continue

    const identity = resolveIdentity(p, supplied)
    identities.set(p.slug, identity)

    const imgs = resolvedImages.filter((r) => r.slug === p.slug)
    const skipReasons: SkipReason[] = []
    const notes: string[] = []

    const publishable = isPublishable(p, approvals)
    if (!publishable.ok) skipReasons.push(publishable.reason as SkipReason)

    if (badContent.has(p.slug)) skipReasons.push('CONTENT_INVALID')
    if (!identity.canonical) skipReasons.push('NOT_CANONICAL')

    const imageProblem =
      imgs.length === 0 ||
      imgs.some((i) => !i.existsOnDisk || !i.readable || !i.resolved.toLowerCase().startsWith('amino-'))
    if (imageProblem) skipReasons.push('IMAGE_UNRESOLVED')

    // A price disagreement does NOT block a content-only write: this importer
    // never writes price, salePrice, sku, stock or variants, so the disagreement
    // cannot reach the database. It is recorded for the operator and only
    // becomes blocking on the create path, where Products.price is required.
    const wouldCreate = db.consulted && !db.productIdBySlug.has(p.slug)
    if (identity.priceDisagreement && wouldCreate) {
      skipReasons.push('PRICE_DISAGREEMENT')
      notes.push('price must be adjudicated before a product can be CREATED (Products.price is required)')
    }

    // Creating a product requires a verified name. The generated JSON has none,
    // and seoTitle must never stand in for one, so an unresolvable canonical
    // name refuses the create rather than synthesising a label.
    const canonicalName = resolveCanonicalProductName(p.slug)
    if (wouldCreate && canonicalName.name === null) {
      skipReasons.push('NO_CANONICAL_NAME')
      notes.push('cannot CREATE: ' + canonicalName.reason)
    } else if (wouldCreate) {
      notes.push('create would use ' + canonicalName.reason)
    }

    for (const i of imgs) {
      if (i.correctedByManifest) {
        notes.push(`image target corrected via manifest: ${i.declared} -> ${i.resolved}`)
      }
    }
    if (identity.missingSku.length > 0) {
      notes.push(`no verified SKU for variant(s): ${identity.missingSku.join(', ')} — variants not written`)
    }
    for (const v of identity.variants) {
      for (const d of v.disagreements) notes.push(`price disagreement [${v.variant}]: ${d}`)
    }
    for (const n of identity.notes) notes.push(n)

    const exists = db.productIdBySlug.has(p.slug)
    let action: ProductPlan['action']
    if (skipReasons.length > 0) {
      action = 'skip'
    } else if (exists) {
      action = 'update'
    } else if (db.consulted) {
      action = 'create'
    } else {
      // Without a database view the importer cannot tell create from update and
      // must not guess.
      action = 'skip'
      skipReasons.push('NOT_IN_DATABASE')
      notes.push('no database consulted — create/update undetermined')
    }

    const existingImages = db.existingImageCountBySlug.get(p.slug) ?? 0
    if (existingImages > 0) {
      notes.push(`product already has ${existingImages} image relationship(s) — left untouched`)
    }

    plans.push({
      slug: p.slug,
      action,
      skipReasons,
      notes,
      images: imgs,
      fieldsToWrite: action === 'skip' ? [] : [...WRITABLE_FIELDS],
    })
  }

  return { content, imageAudit, resolvedImages, identities, approvals, plans, supplied }
}

/**
 * The data object sent to payload.update / payload.create. Only the twelve
 * authorised content fields, copied verbatim — no truncation, rewriting or
 * regeneration of any description or FAQ.
 */
export function buildContentPayload(product: GeneratedProduct): Record<string, unknown> {
  const f = product.fields
  return {
    description: f.description,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    productDetailsTitle: f.productDetailsTitle,
    productDetailsDescription: f.productDetailsDescription,
    researchFocusTitle: f.researchFocusTitle,
    researchFocusDescription: f.researchFocusDescription,
    qualityPurityTitle: f.qualityPurityTitle,
    qualityPurityDescription: f.qualityPurityDescription,
    complianceNoticeTitle: f.complianceNoticeTitle,
    complianceNoticeDescription: f.complianceNoticeDescription,
    faqs: f.faqs.map((q) => ({ question: q.question, answer: q.answer })),
  }
}

/**
 * `contentOnly` must mirror the run's mode. In content-only mode the write path
 * iterates an empty image array, so the implied upload count is zero — reporting
 * the reference count there would contradict what the run would actually do.
 */
export function summarise(plans: ProductPlan[], contentOnly = false) {
  const by = (a: ProductPlan['action']) => plans.filter((p) => p.action === a).length
  const reasonTally = new Map<SkipReason, number>()
  for (const p of plans) {
    for (const r of p.skipReasons) reasonTally.set(r, (reasonTally.get(r) ?? 0) + 1)
  }
  const referenced = plans.filter((p) => p.action !== 'skip').reduce((n, p) => n + p.images.length, 0)
  return {
    total: plans.length,
    updates: by('update'),
    creates: by('create'),
    skips: by('skip'),
    reasonTally,
    /** What the run would actually upload. Always 0 in content-only mode. */
    imageUploads: contentOnly ? 0 : referenced,
    /** Images these products reference, regardless of mode. Informational. */
    imagesReferenced: referenced,
  }
}
