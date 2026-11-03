/**
 * Local shop-domain types mirroring the field shapes defined in
 * collections/Products.ts and collections/Categories.ts.
 *
 * payload-types.ts is currently a placeholder (no live database is
 * connected yet, so `pnpm payload generate:types` hasn't produced real
 * types for these collections). These types let shop pages/components
 * type-check against the known collection shapes now; once real generated
 * types exist, call sites can be switched over to them.
 */

export interface ShopMedia {
  id: string | number;
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
}

export interface ShopDocument {
  id: string | number;
  url?: string | null;
  filename?: string | null;
  title?: string | null;
}

export interface ShopCategory {
  id: string | number;
  name: string;
  description?: string | null;
  slug?: string | null;
  parent?: (string | number) | ShopCategory | null;
  isVisible?: boolean | null;
  sortOrder?: number | null;
}

export interface ShopProductImage {
  id?: string | number | null;
  image: (string | number) | ShopMedia;
}

export interface ShopVariantOption {
  key?: string | null;
  value?: string | null;
}

export interface ShopVariant {
  id?: string | number | null;
  sku: string;
  isKit?: boolean | null;
  images?: ShopProductImage[] | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  options?: ShopVariantOption[] | null;
}

export interface ShopBulkBundleVariantOverride {
  variantSku: string;
  price: number;
  salePrice?: number | null;
}

export interface ShopBulkBundle {
  id?: string | number | null;
  name: string;
  quantity: number;
  discountPercentage?: number | null;
  price?: number | null;
  salePrice?: number | null;
  image?: (string | number) | ShopMedia | null;
  variantOverrides?: ShopBulkBundleVariantOverride[] | null;
}

export interface ShopFaq {
  id?: string | number | null;
  question: string;
  answer: string;
}

export interface ShopProduct {
  id: string | number;
  name: string;
  description?: string | null;
  images?: ShopProductImage[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  slug?: string | null;
  sku?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  weight?: number | null;
  dimensions?: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
  } | null;
  categories?: ((string | number) | ShopCategory)[] | null;
  hasVariants?: boolean | null;
  variants?: ShopVariant[] | null;
  bulkBundles?: ShopBulkBundle[] | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  productDetailsTitle?: string | null;
  productDetailsDescription?: string | null;
  researchFocusTitle?: string | null;
  researchFocusDescription?: string | null;
  qualityPurityTitle?: string | null;
  qualityPurityDescription?: string | null;
  complianceNoticeTitle?: string | null;
  complianceNoticeDescription?: string | null;
  coaFile?: (string | number) | ShopDocument | null;
  coaBatchNumber?: string | null;
  coaPurity?: number | null;
  coaAnalyzedDate?: string | null;
  faqs?: ShopFaq[] | null;
  status?: "draft" | "active" | "archived" | null;
  isVisible?: boolean | null;
  isBestSeller?: boolean | null;
}

import { resolveProductImageUrl } from "@/lib/products/productImage";

/** Resolves an images[].image relationship field (may be an id or a populated Media doc) to a URL. */
export function resolveMediaUrl(
  media: (string | number) | ShopMedia | null | undefined
): string | undefined {
  if (!media) return undefined;
  if (typeof media === "object") return media.url ?? undefined;
  return undefined;
}

/**
 * Primary image for a product.
 *
 * Delegates to lib/products/productImage.ts, which rejects inherited Prime Time Bio Labs
 * photography, prefers a stored CMS image when one exists, and otherwise falls back to a
 * verified Amino Based asset or the neutral placeholder. Pass `dosage` when the caller knows
 * which variant is on screen — the local fallbacks are dosage-specific.
 */
export function getProductPrimaryImageUrl(product: ShopProduct, dosage?: string | null): string {
  return resolveProductImageUrl({
    name: product.name,
    slug: product.slug,
    dosage,
    dbImageUrl: resolveMediaUrl(product.images?.[0]?.image),
  });
}

export function getEffectivePrice(price: number, salePrice?: number | null): number {
  return typeof salePrice === "number" && salePrice > 0 ? salePrice : price;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
