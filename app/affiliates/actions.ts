"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { revalidatePath } from "next/cache";

export type ApplyFormState = {
  success: boolean;
  error?: string;
};

export async function submitAffiliateApplication(
  _prevState: ApplyFormState,
  formData: FormData
): Promise<ApplyFormState> {
  const user = await getPayloadUser();
  if (!user) {
    return { success: false, error: "You must be logged in to apply." };
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const promotionMethods = String(formData.get("promotionMethods") ?? "").trim();
  const estimatedMonthlyReach = String(formData.get("estimatedMonthlyReach") ?? "");
  const niche = String(formData.get("niche") ?? "").trim();
  const whyJoin = String(formData.get("whyJoin") ?? "").trim();
  const agreedToTerms = formData.get("agreedToTerms") === "on";

  if (!displayName) {
    return { success: false, error: "Please provide a display name." };
  }
  if (!promotionMethods) {
    return { success: false, error: "Please describe how you plan to promote us." };
  }
  if (!agreedToTerms) {
    return { success: false, error: "You must agree to the affiliate program terms." };
  }

  try {
    const payload = await getPayload({ config });

    // Prevent duplicate pending applications.
    const existing = await payload.find({
      collection: "affiliate-applications",
      where: { and: [{ user: { equals: user.id } }, { status: { equals: "pending" } }] },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.docs.length > 0) {
      return { success: false, error: "You already have a pending application." };
    }

    await payload.create({
      collection: "affiliate-applications",
      data: {
        user: user.id,
        displayName,
        websiteUrl: websiteUrl || undefined,
        promotionMethods,
        estimatedMonthlyReach: (estimatedMonthlyReach || undefined) as any,
        niche: niche || undefined,
        whyJoin: whyJoin || undefined,
        agreedToTerms,
        status: "pending",
      },
      overrideAccess: true,
    });

    revalidatePath("/affiliates");
    return { success: true };
  } catch (err) {
    console.error("Failed to submit affiliate application:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
