"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getReviewEligibility } from "@/lib/reviews/eligibility";

export async function submitReview(input: {
  familyProductIds: Array<number | string>;
  rating: number;
  comment: string;
  path: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getPayloadUser();
  if (!user) return { ok: false, error: "Please sign in to leave a review." };

  const rating = Math.round(Number(input.rating));
  if (!(rating >= 1 && rating <= 5)) return { ok: false, error: "Please choose a rating from 1 to 5." };
  const comment = String(input.comment ?? "").trim().slice(0, 1000);

  const payload = await getPayload({ config });
  const eligibility = await getReviewEligibility(payload, user.id, input.familyProductIds);
  if (eligibility.status === "not_purchased") {
    return { ok: false, error: "You can review this product once you've purchased it." };
  }
  if (eligibility.status === "already_reviewed") {
    return { ok: false, error: "You've already reviewed this product." };
  }
  if (eligibility.status !== "ok") return { ok: false, error: "Please sign in to leave a review." };

  try {
    // The Reviews hook re-checks the purchase and forces status to "pending" for moderation.
    await payload.create({
      collection: "reviews",
      data: { product: eligibility.productId, user: user.id, rating, comment },
      overrideAccess: true,
    });
  } catch (err) {
    console.error("Failed to submit review:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Could not submit your review." };
  }

  try {
    revalidatePath(input.path);
  } catch {
    // best-effort
  }
  return { ok: true };
}
