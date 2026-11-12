/**
 * Single source of truth for every customer-facing product image.
 *
 * Background: this project was cloned from another company's site and inherited that company's
 * (Prime Time Bio Labs / "PRIMETIME BIO LABS") product photography — 30 files in total, every one
 * showing a PTBL-branded vial with a "99% Purity" claim. Those images reached customers through
 * the shop grid, product pages, the nav search dropdown, the search API, the wishlist, the account
 * area and order-confirmation emails.
 *
 * Every product image rendered anywhere must therefore go through `resolveProductImageUrl`, which
 * resolves in this order:
 *
 *   1. A stored image from Payload/Media, IF it is not a known PTBL asset.  <-- future uploads
 *   2. An Amino Based asset whose label has been visually verified to match
 *      this exact product identity AND dosage.
 *   3. The neutral placeholder.
 *
 * Step 1 first is what makes future uploads propagate automatically: associate a new image with a
 * product in the CMS and it immediately outranks the local fallback everywhere, with no code change.
 *
 * NOTHING here invents an image. A product without a verified match shows the placeholder, by
 * design — an image of the wrong vial is worse than no image.
 */

/** Neutral, unbranded fallback. Hand-authored SVG, no claims, no brand marks. */
export const PRODUCT_IMAGE_PLACEHOLDER = "/placeholder-product.svg";

// ---------------------------------------------------------------------------------------------
// Blocked: inherited PTBL imagery
// ---------------------------------------------------------------------------------------------

/**
 * Basenames of every confirmed PTBL product image, verified by viewing each file. The files
 * themselves are deleted from `public/`, but the Media collection may still reference uploads
 * made from them (scripts/seed.ts uploaded `public/product-images/*` into Payload), so the stored
 * URL must be rejected at render time as well.
 *
 * Compared case-insensitively against the URL's final path segment.
 */
const BLOCKED_IMAGE_BASENAMES: ReadonlySet<string> = new Set([
  // public/product-images/ — the 25-file PTBL catalogue set
  "ahkcu-50mg.webp",
  "bpc-157-10mg.webp",
  "dsip-10mg.webp",
  "epitalon-10mg.webp",
  "ghkcu-50mg.webp",
  "glow-70mg.webp",
  "igf1-lr3-1mg.webp",
  "klow-80mg.webp",
  "kpv-10mg.webp",
  "metabolicx-10mg.webp",
  "motc-20mg.webp",
  "mots-c-10mg.webp",
  "nad+500mg.webp",
  "pt-141-10mg.webp",
  "retatrutide-30mg.webp",
  "retatrutide 10 mg.webp",
  "semaglutide-10mg.webp",
  "semax-10mg.webp",
  "tb-500-10mg.webp",
  "tesamorelin-20mg.webp",
  "thymosin-5mg.webp",
  "tirzepetide-30mg.webp",
  "tesamorelin-10mg.webp",
  "tirzepatide-10mg.webp",
  "wolverine-20mg.webp",
  // Standalone PTBL product shots that were wired in as hardcoded fallbacks
  "product-retatrutide.png",
  "product-card-image.png",
  "product-image-reta.png",
  // Named "placeholder" but actually a PTBL Retatrutide vial — a trap for future work
  "product-placeholder.webp",
  "product-placeholder-400x400.webp",
]);

/**
 * Normalised PTBL stems, so a re-upload under a cosmetically different filename
 * ("Retatrutide_10mg.webp", "retatrutide 10 mg.WEBP") is still caught.
 */
const BLOCKED_IMAGE_STEMS: ReadonlySet<string> = new Set(
  Array.from(BLOCKED_IMAGE_BASENAMES).map((name) =>
    name.replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9]/gi, "").toLowerCase()
  )
);

/**
 * Escape hatch for genuinely new Amino Based uploads. A filename beginning with `amino-` is
 * always allowed, even if the rest of the name collides with a blocked stem. Use this prefix
 * when uploading Amino Based photography for a product that PTBL also sold
 * (e.g. `amino-retatrutide-10mg.webp`).
 */
const ALWAYS_ALLOWED_PREFIX = "amino-";

/** Path segment that only ever held PTBL files. Nothing legitimate is served from it. */
const BLOCKED_PATH_SEGMENT = "/product-images/";

function basenameOf(url: string): string {
  const withoutQuery = url.split(/[?#]/)[0];
  const segments = withoutQuery.split("/");
  const last = segments[segments.length - 1] ?? "";
  try {
    return decodeURIComponent(last).toLowerCase();
  } catch {
    return last.toLowerCase();
  }
}

/** True when a URL points at inherited PTBL imagery and must never be rendered. */
export function isBlockedProductImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const base = basenameOf(url);
  if (base.startsWith(ALWAYS_ALLOWED_PREFIX)) return false;
  if (BLOCKED_IMAGE_BASENAMES.has(base)) return true;
  const stem = base.replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9]/gi, "");
  if (stem && BLOCKED_IMAGE_STEMS.has(stem)) return true;
  return url.toLowerCase().includes(BLOCKED_PATH_SEGMENT);
}

// ---------------------------------------------------------------------------------------------
// Verified Amino Based assets
// ---------------------------------------------------------------------------------------------

/**
 * Each entry was confirmed by reading the label in the image file itself — product name AND
 * dosage. Do not add an entry without doing the same.
 *
 * Deliberately NOT mapped:
 *   - `shelf_vial_glp2tz.png`  — label reads "GLP-2TZ" with no dosage. The closest catalogue
 *     product is "GLP-1TRZ". Those are different strings and the equivalence is unconfirmed.
 *   - `shelf_vial_glp3rt.png`  — label reads "GLP-3RT" with no dosage. The closest catalogue
 *     product is "GLP-3RTA". Same problem.
 *   Both show the placeholder until someone confirms the identity. See VERIFICATION_PENDING.
 *
 * Spray and blend products are excluded automatically: identity matching is exact, so
 * "BPC-157 Spray" and "BPC-157 / TB-500 Blend" do not match the plain "BPC-157" vial photo.
 */
type VerifiedProductImage = {
  /** Normalised product identity (lowercase, alphanumeric only). */
  readonly identity: string;
  /** Normalised dosage printed on the vial label in the photograph. */
  readonly dosage: string;
  readonly asset: string;
  /** The label text, recorded so the mapping can be re-checked without reopening the file. */
  readonly labelText: string;
};

const VERIFIED_PRODUCT_IMAGES: readonly VerifiedProductImage[] = [
  {
    identity: "bpc157",
    dosage: "10mg",
    asset: "/assets/shelf_vial_bpc157.png",
    labelText: "Amino Based — BPC-157 10 mg",
  },
  {
    identity: "tb500",
    dosage: "10mg",
    asset: "/assets/shelf_vial_tb500.png",
    labelText: "Amino Based — TB-500 10 mg",
  },
  {
    identity: "glp1trz",
    dosage: "10mg",
    asset: "/assets/shelf_vial_glp1trz.png",
    labelText: "Amino Based — GLP-1TRZ 10 mg",
  },
  {
    identity: "glp3rta",
    dosage: "10mg",
    asset: "/assets/shelf_vial_glp3rta.png",
    labelText: "Amino Based — GLP-3RTA 10 mg",
  },
  {
    identity: "semaglutide",
    dosage: "10mg",
    asset: "/assets/shelf_vial_semaglutide.webp",
    labelText: "Amino Based — SEMAGLUTIDE 10 mg",
  },
];

/** Assets held back pending a product-identity decision. Referenced by the audit, not by rendering. */
export const VERIFICATION_PENDING = [] as const;

// ---------------------------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------------------------

/** Lowercase, alphanumeric-only. "BPC-157 Spray" -> "bpc157spray". */
function normaliseIdentity(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** "10 mg" / "10MG" / "10mg" -> "10mg". Returns "" when no dosage is present. */
export function normaliseDosage(value: string | null | undefined): string {
  if (!value) return "";
  const match = value.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|iu|g|ml)\b/i);
  return match ? `${match[1]}${match[2].toLowerCase()}` : "";
}

// ---------------------------------------------------------------------------------------------
// Dosage-aware selection within one product's image set
// ---------------------------------------------------------------------------------------------

/**
 * Every spelling of a dosage that an Amino Based filename is known to use. The catalogue
 * contains three shapes, all verified against the live image set:
 *
 *   amino-glp-1trz-20mg.webp                    -> "20mg"
 *   amino-hcg-5000-iu.webp                      -> "5000iu",  unit split off
 *   amino-tesamorelin-ipamorelin-blend-6-3mg    -> "6.3mg",   decimal point written as "-"
 */
function dosageFilenameTokens(dosage: string | null | undefined): string[] {
  const match = (dosage ?? "").match(/(\d+(?:\.\d+)?)\s*(mg|mcg|iu|g|ml)\b/i);
  if (!match) return [];
  const num = match[1];
  const unit = match[2].toLowerCase();
  const dashedNum = num.replace(".", "-");
  return Array.from(
    new Set([`${num}${unit}`, `${num}-${unit}`, `${dashedNum}${unit}`, `${dashedNum}-${unit}`])
  );
}

/**
 * True when this image's filename carries exactly this dosage.
 *
 * The filename's separators are normalised to "-" and the dosage has to appear as a COMPLETE
 * hyphen-delimited token run. Matching on a bare substring is not safe here: product names in
 * this catalogue end in digits ("amino-bpc-157-5mg"), so flattening the separators away would
 * make the 5 mg image look like "1575mg" and stop matching, while a loose substring test would
 * let a 10 mg variant match "amino-x-210mg" or "amino-x-100mg". Token matching rejects both.
 */
export function imageFilenameMatchesDosage(
  url: string | null | undefined,
  dosage: string | null | undefined
): boolean {
  if (!url) return false;
  const tokens = dosageFilenameTokens(dosage);
  if (tokens.length === 0) return false;
  const base = basenameOf(url).replace(/\.[a-z0-9]+$/i, "");
  const delimited = `-${base.replace(/[^a-z0-9]+/g, "-")}-`;
  return tokens.some((token) => delimited.includes(`-${token}-`));
}

/**
 * The image in `urls` whose filename carries `dosage`, or undefined when none does.
 *
 * Used to pick the right vial photograph for the variant on screen. A product holds one image
 * per dosage on `products.images[]` (the per-variant `variants[].images[]` field exists but is
 * unpopulated), so the dosage printed in the filename is what ties an image to a variant.
 * Returns undefined rather than guessing — the caller falls back to the primary image.
 */
export function pickImageForDosage(
  urls: readonly (string | null | undefined)[],
  dosage: string | null | undefined
): string | undefined {
  const matches = urls.filter((url) => imageFilenameMatchesDosage(url, dosage));
  // Exactly one match is the expected case. More than one means two files claim the same
  // dosage, which is a data problem; take the first rather than silently showing nothing.
  return (matches[0] as string | undefined) ?? undefined;
}

export type ResolveProductImageArgs = {
  /** Product name, e.g. "BPC-157". */
  name?: string | null;
  /** Product slug, used as a second identity candidate. */
  slug?: string | null;
  /** Selected or displayed dosage, e.g. "10mg". */
  dosage?: string | null;
  /** URL stored against the product in Payload/Media, if any. */
  dbImageUrl?: string | null;
};

/**
 * The only function that should decide which image represents a product.
 *
 * Returns a stored CMS image when one exists and is not inherited PTBL imagery; otherwise a
 * verified Amino Based asset when identity and dosage both match; otherwise the placeholder.
 * Never returns a PTBL asset.
 */
export function resolveProductImageUrl(args: ResolveProductImageArgs): string {
  const { name, slug, dosage, dbImageUrl } = args;

  // 1. A stored image wins, so newly uploaded Amino Based photography propagates everywhere
  //    the moment it is associated with the product — no code change required.
  if (dbImageUrl && !isBlockedProductImage(dbImageUrl)) {
    return dbImageUrl;
  }

  // 2. Fall back to a locally held asset, but only when the product identity matches exactly.
  //
  //    Dosage rule: the vial photographs have a dosage printed on the label, so when the caller
  //    knows which variant is on screen and it is NOT the photographed dosage, fall through to the
  //    placeholder rather than show a 10 mg vial for a 5 mg variant. When no dosage is in context
  //    (a marketing tile, a nav thumbnail), the identity match alone is enough — the photograph is
  //    genuinely this product, and hiding the brand's own correct image would be worse.
  const candidates = [normaliseIdentity(name), normaliseIdentity(slug)].filter(Boolean);
  if (candidates.length > 0) {
    const match = VERIFIED_PRODUCT_IMAGES.find((entry) => candidates.includes(entry.identity));
    if (match) {
      const wanted = normaliseDosage(dosage) || normaliseDosage(name);
      if (!wanted || wanted === match.dosage) return match.asset;
    }
  }

  // 3. No verified image for this product (or this dosage). Show nothing rather than something wrong.
  return PRODUCT_IMAGE_PLACEHOLDER;
}

/**
 * Render-time guard for image URLs that were captured before this module existed and cannot be
 * corrected at the source: order line-item snapshots (`orders.items[].productSnapshot`, which are
 * historical records and must not be rewritten) and carts persisted in a visitor's localStorage.
 */
export function safeProductImageUrl(url: string | null | undefined): string {
  if (!url || isBlockedProductImage(url)) return PRODUCT_IMAGE_PLACEHOLDER;
  return url;
}
