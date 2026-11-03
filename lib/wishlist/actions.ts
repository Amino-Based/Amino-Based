"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { findProductByAnyId, productAliasKeys } from "@/lib/orders/findProduct";

export async function toggleWishlistItem(
  productId: string | number,
  variantSku: string,
  priceSnapshot: number,
  currentPath?: string
): Promise<{ added: boolean; keys: string[] } | { error: string }> {
  const user = await getPayloadUser();
  if (!user) {
    return { error: "login_required" };
  }

  const payload = await getPayload({ config });

  // The storefront id may be a SKU/slug (multi-dosage cards), so resolve the real product first.
  const product: any = await findProductByAnyId(payload, productId);
  if (!product) {
    return { error: "product_not_found" };
  }
  const productIdNum = Number(product.id);
  const keys = productAliasKeys(product);

  const existingResult = await payload.find({
    collection: "wishlists",
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const existingDoc = existingResult.docs?.[0];
  let added: boolean;

  const newItem = {
    product: productIdNum,
    variantSku,
    quantity: 1,
    addedAt: new Date().toISOString(),
    priceSnapshot,
  };

  if (!existingDoc) {
    await payload.create({
      collection: "wishlists",
      data: { user: user.id, items: [newItem] },
      overrideAccess: true,
    });
    added = true;
  } else {
    const items = existingDoc.items ?? [];
    // A product counts as wishlisted regardless of dosage, so the heart is a simple on/off.
    const isWishlisted = items.some((item) => {
      const itemProductId = typeof item.product === "object" ? item.product?.id : item.product;
      return String(itemProductId) === String(productIdNum);
    });

    const newItems = isWishlisted
      ? items.filter((item) => {
          const itemProductId = typeof item.product === "object" ? item.product?.id : item.product;
          return String(itemProductId) !== String(productIdNum);
        })
      : [...items, newItem];
    added = !isWishlisted;

    await payload.update({
      collection: "wishlists",
      id: existingDoc.id,
      data: { items: newItems },
      overrideAccess: true,
    });
  }

  if (currentPath) {
    try {
      revalidatePath(currentPath);
    } catch {
      // best-effort; not critical if it fails
    }
  }

  return { added, keys };
}
