import type { Payload } from "payload";

export type ReviewEligibility =
  | { status: "ok"; productId: number }
  | { status: "login_required" }
  | { status: "not_purchased" }
  | { status: "already_reviewed" };

/**
 * Can this customer review this product (family)? They need a paid order containing one of the
 * product docs (multi-dosage products are separate docs, e.g. 10mg and 30mg) and no existing
 * review of it. Returns the doc id the review should attach to.
 */
export async function getReviewEligibility(
  payload: Payload,
  userId: number | string | null | undefined,
  familyProductIds: Array<number | string>
): Promise<ReviewEligibility> {
  if (!userId) return { status: "login_required" };

  let purchasedAny = false;
  for (const productId of familyProductIds) {
    const purchase = await payload.find({
      collection: "orders",
      where: {
        and: [
          { owner: { equals: userId } },
          { paymentStatus: { equals: "captured" } },
          { "items.product": { equals: productId } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (purchase.docs.length === 0) continue;
    purchasedAny = true;

    const existing = await payload.find({
      collection: "reviews",
      where: { and: [{ product: { equals: productId } }, { user: { equals: userId } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs.length === 0) return { status: "ok", productId: Number(productId) };
  }
  return purchasedAny ? { status: "already_reviewed" } : { status: "not_purchased" };
}
