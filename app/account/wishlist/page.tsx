import React from "react";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import {
  WishlistClient,
  type WishlistItemData,
} from "@/components/account/WishlistClient";
import { resolveProductImageUrl } from "@/lib/products/productImage";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await getPayloadUser();
  if (!user) redirect("/login");

  const payload = await getPayload({ config });

  const { docs: wishlists } = await payload.find({
    collection: "wishlists",
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  });

  const wishlist = wishlists[0] as any;
  const items: WishlistItemData[] = [];

  if (wishlist && Array.isArray(wishlist.items)) {
    for (const item of wishlist.items) {
      const product =
        typeof item.product === "object" && item.product !== null
          ? item.product
          : null;

      // TEMPORARY: local media storage isn't reachable on Vercel yet (R2 not connected),
      // so serve the shared placeholder instead of the stored URL.
      // Was "/product-card-image.png" — a Prime Time Bio Labs vial shown for every wishlist item.
      const imageUrl = product
        ? resolveProductImageUrl({
            name: (product as any).name,
            slug: (product as any).slug,
            dbImageUrl: (product as any)?.images?.[0]?.image?.url,
          })
        : null;

      items.push({
        variantSku: item.variantSku,
        productId: product ? String(product.id) : null,
        slug: product?.slug || null,
        name: product?.name || "Unknown Product",
        image: imageUrl,
        quantity: Number(item.quantity || 1),
        price: Number(item.priceSnapshot || 0),
      });
    }
  }

  return <WishlistClient items={items} />;
}
