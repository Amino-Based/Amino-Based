"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";

type ActionResult = { success: true } | { success: false; error: string };

export async function removeWishlistItem(
  variantSku: string
): Promise<ActionResult> {
  try {
    const user = await getPayloadUser();
    if (!user) return { success: false, error: "You must be signed in." };

    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "wishlists",
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    });

    const wishlist = docs[0] as any;
    if (!wishlist) return { success: true };

    const items = Array.isArray(wishlist.items) ? wishlist.items : [];
    const nextItems = items.filter((item: any) => item.variantSku !== variantSku);

    await payload.update({
      collection: "wishlists",
      id: wishlist.id,
      data: { items: nextItems },
      overrideAccess: true,
    });

    revalidatePath("/account/wishlist");
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong. Please try again.",
    };
  }
}
