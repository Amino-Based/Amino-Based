import type { Payload } from "payload";

/**
 * Resolves the id a storefront card/cart/wishlist carries to a product document. That id is a
 * database id for plain products, but a SKU (e.g. "RETA-10MG") for the multi-dosage cards, whose
 * card ids are not database ids — so try id, then SKU, then slug.
 */
export async function findProductByAnyId(payload: Payload, rawId: string | number) {
  const key = String(rawId);
  if (/^\d+$/.test(key)) {
    const byId = await payload
      .findByID({ collection: "products", id: Number(key), overrideAccess: true })
      .catch(() => null);
    if (byId) return byId;
  }
  for (const field of ["sku", "slug"] as const) {
    const { docs } = await payload.find({
      collection: "products",
      where: { [field]: { equals: key } },
      limit: 1,
      overrideAccess: true,
    });
    if (docs[0]) return docs[0];
  }
  return null;
}

/** Every identifier a card might use for this product (database id, SKU, slug). */
export function productAliasKeys(product: { id: number | string; sku?: string | null; slug?: string | null }): string[] {
  return [String(product.id), product.sku, product.slug].filter((k): k is string => !!k);
}
