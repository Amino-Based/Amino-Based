import {
  getEffectivePrice,
  getProductPrimaryImageUrl,
  type ShopProduct,
} from "@/lib/types/shop";
import { MASTER_PRODUCTS, type MasterCatalogProduct } from "@/lib/masterCatalogData";
import { PRODUCT_IMAGE_PLACEHOLDER, resolveProductImageUrl } from "@/lib/products/productImage";

export interface ShopMockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  dosageOptions: string[];
  /** Exactly as recorded on a certificate, or null when no certificate figure exists. */
  purity: string | null;
  type: string;
  price: number;
  image: string;
  featured: boolean;
  category: string;
}

/** Shared with every other image path so there is exactly one placeholder constant. */
const FALLBACK_IMAGE = PRODUCT_IMAGE_PLACEHOLDER;

const CATEGORY_TYPE_LABEL: Record<string, string> = {
  "GLP-1 & Metabolic": "Research Grade Peptide",
  "Recovery Peptides": "Research Peptide",
  "Growth Hormone Secretagogue": "Growth Hormone Secretagogue",
  "Nasal Sprays": "Nasal Spray",
  "Longevity Research": "Longevity Peptide",
  "Cognitive & Nootropic": "Cognitive Peptide",
  "Endocrine Research": "Hormonal Peptide",
  "Cosmetic & Skin": "Cosmetic Peptide",
};

export interface MultiVariantProductConfig {
  name: string;
  slug: string;
  dosageOptions: string[];
  defaultDosage: string;
  category: string;
  isBestSeller?: boolean;
  dbKeywords: string[];
  variants: Record<
    string,
    {
      price: number;
      image: string;
      sku: string;
    }
  >;
}

// Build multi-variant config map from user master catalog
const MASTER_CONFIG_MAP: Record<string, MultiVariantProductConfig> = {};
for (const p of MASTER_PRODUCTS) {
  const variantsMap: Record<string, { price: number; image: string; sku: string }> = {};
  for (const v of p.variants) {
    variantsMap[v.strength] = {
      price: v.price,
      image: p.image,
      sku: v.sku,
    };
  }

  const cfg: MultiVariantProductConfig = {
    name: p.name,
    slug: p.slug,
    dosageOptions: p.dosageOptions,
    defaultDosage: p.dosageOptions[0] || "Standard",
    category: p.category,
    isBestSeller: p.featured,
    dbKeywords: [p.name, p.slug],
    variants: variantsMap,
  };

  MASTER_CONFIG_MAP[p.slug] = cfg;
  MASTER_CONFIG_MAP[p.slug.toLowerCase().replace(/[^a-z0-9]/g, "")] = cfg;
  MASTER_CONFIG_MAP[p.name.toLowerCase().replace(/[^a-z0-9]/g, "")] = cfg;
}

export const MULTI_VARIANT_PRODUCTS = MASTER_CONFIG_MAP;

export function getMultiVariantConfig(nameOrSlug?: string | null): MultiVariantProductConfig | null {
  if (!nameOrSlug) return null;
  const raw = nameOrSlug.toLowerCase().trim();
  const norm = raw.replace(/[^a-z0-9]/g, "");
  return MASTER_CONFIG_MAP[raw] || MASTER_CONFIG_MAP[norm] || null;
}

export function getProductDisplayDetails(
  product: { id?: string; name: string; slug?: string; price: number; image: string },
  selectedDosage: string
) {
  // The static master catalog must never price a product. It used to supply price, image and
  // SKU here, which meant a file on disk could silently contradict the database the checkout
  // prices from. Everything below is derived from the product the caller passed in, which
  // originates in Payload.
  // The image IS dosage-dependent: the Amino Based vial photographs carry a printed dosage,
  // so the 10 mg photo must not stand in for a 5 mg variant. Re-resolve rather than trusting
  // whatever image the caller already held.
  const image = resolveProductImageUrl({
    name: product.name,
    slug: product.slug,
    dosage: selectedDosage,
    dbImageUrl: product.image,
  });
  return {
    price: product.price,
    image,
    sku: product.id || product.slug || "standard",
    galleryImages: [image],
  };
}

/** Extracts dosage like "10mg", "1mg", "500mg", "5mg" from product name and returns clean name and dosage */
export function extractDosageFromName(rawName: string): { cleanName: string; dosage: string | null } {
  if (!rawName) return { cleanName: rawName, dosage: null };
  const dosageMatch = rawName.match(/\b(\d+(?:\.\d+)?)\s*(mg|mcg|iu|g|ml)\b/i);
  if (dosageMatch) {
    const dosage = `${dosageMatch[1]}${dosageMatch[2].toLowerCase()}`;
    const cleanName = rawName
      .replace(new RegExp(`\\b${dosageMatch[1]}\\s*${dosageMatch[2]}\\b`, "i"), "")
      .replace(/\s+/g, " ")
      .trim();
    return { cleanName: cleanName || rawName, dosage };
  }
  return { cleanName: rawName, dosage: null };
}

/** Cleans dosage suffixes from a slug or derives clean slug from product name (e.g. "bpc-157-10-mg" -> "bpc-157") */
export function toCleanSlug(rawSlug?: string | null, fallbackName?: string | null): string {
  const base = (rawSlug || fallbackName || "")
    .toLowerCase()
    .trim()
    .replace(/-?\b\d+(\.\d+)?(-?)(mg|mcg|iu|g|ml)\b/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "product";
}

/** Flattens a full Payload product doc into the simple shape the shop grid/card components render. */
export function toShopCardProduct(product: ShopProduct): ShopMockProduct {
  const parsed = extractDosageFromName(product.name || "");

  const categoryNames = (product.categories ?? [])
    .map((c) => (typeof c === "object" ? c.name : null))
    .filter((name): name is string => Boolean(name));

  const categoryName = categoryNames[0] ?? "Uncategorized";

  const dosageOptions =
    product.hasVariants && product.variants?.length
      ? Array.from(
          new Set(
            product.variants.flatMap((v) =>
              (v.options ?? []).map((o) => o.value).filter((v): v is string => Boolean(v))
            )
          )
        )
      : (parsed.dosage ? [parsed.dosage] : ["Standard"]);

  // Database-authoritative. The static master catalog previously overrode name, slug, price,
  // image, category and featured status whenever its config map matched — a file on disk
  // silently contradicting the row the checkout prices from. Only Payload values are used now.
  const name = parsed.cleanName || product.name;
  const slug = toCleanSlug(product.slug, parsed.cleanName);
  const image = getProductPrimaryImageUrl(product) || FALLBACK_IMAGE;
  const price = getEffectivePrice(product.price, product.salePrice);
  const featured = !!product.isBestSeller;

  return {
    id: String(product.id),
    name,
    slug,
    description: product.description ?? "",
    dosageOptions: dosageOptions.length > 0 ? dosageOptions : ["Standard"],
    // Only a real certificate figure, stated exactly as recorded. The "+" suffix turned a
    // measured value into a minimum guarantee, and the old hardcoded fallback asserted a
    // purity level for products that have no certificate at all. No value means no claim.
    purity: typeof product.coaPurity === "number" ? `${product.coaPurity}% Purity` : null,
    type: CATEGORY_TYPE_LABEL[categoryName] ?? categoryName,
    price,
    image,
    featured,
    category: categoryName,
  };
}

/** Flattens and deduplicates product docs into shop cards (merging variants into single cards). */
export function toShopCardProducts(products: ShopProduct[]): ShopMockProduct[] {
  const seenSlugs = new Set<string>();
  const results: ShopMockProduct[] = [];

  for (const p of products) {
    const card = toShopCardProduct(p);
    if (!seenSlugs.has(card.slug)) {
      seenSlugs.add(card.slug);
      results.push(card);
    }
  }

  return results;
}
