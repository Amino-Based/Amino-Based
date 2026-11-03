"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { AffiliateSettings } from "@/lib/types/affiliate";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateAdminPayoutRequestEmail } from "@/lib/email/templates/affiliate";
import { ADMIN_EMAIL } from "@/lib/email/layout";

export type PayoutFormState = {
  success: boolean;
  error?: string;
};

export async function submitPayoutRequest(
  _prevState: PayoutFormState,
  formData: FormData
): Promise<PayoutFormState> {
  const user = await getPayloadUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const affiliate = await getAffiliateForUser(user.id);
  if (!affiliate || affiliate.status !== "approved") {
    return { success: false, error: "Your affiliate account is not approved." };
  }

  const amount = Number(formData.get("amount"));
  const payoutMethod = String(formData.get("payoutMethod") ?? "");
  const payoutDetails = String(formData.get("payoutDetails") ?? "").trim();

  if (!amount || amount <= 0) {
    return { success: false, error: "Please enter a valid payout amount." };
  }
  if (!["zelle", "cashapp", "applepay"].includes(payoutMethod)) {
    return { success: false, error: "Please select a payout method." };
  }
  if (!payoutDetails) {
    return { success: false, error: "Please provide your payout details (phone/CashTag/Apple ID)." };
  }

  try {
    const payload = await getPayload({ config });

    let minimumThreshold = affiliate.minimumPayoutThreshold;
    if (typeof minimumThreshold !== "number") {
      const settings = (await payload
        .findGlobal({ slug: "affiliate-settings" })
        .catch(() => null)) as AffiliateSettings | null;
      minimumThreshold = settings?.defaultMinimumPayoutThreshold ?? 50;
    }

    if (amount < minimumThreshold) {
      return {
        success: false,
        error: `Minimum payout amount is $${minimumThreshold.toFixed(2)}.`,
      };
    }

    const availableBalance = affiliate.totalCommissionApproved ?? 0;
    if (amount > availableBalance) {
      return {
        success: false,
        error: `Requested amount exceeds your approved commission balance of $${availableBalance.toFixed(2)}.`,
      };
    }

    await payload.create({
      collection: "payout-requests",
      data: {
        affiliate: Number(affiliate.id),
        amount,
        payoutMethod: payoutMethod as "zelle" | "cashapp" | "applepay",
        payoutDetails,
        status: "pending",
      },
      overrideAccess: true,
    });

    const adminNotice = generateAdminPayoutRequestEmail({
      affiliateName: affiliate.displayName || `Affiliate #${affiliate.id}`,
      amount,
      payoutMethod,
      payoutDetails,
    });
    void sendTrackedEmail({ to: ADMIN_EMAIL, subject: adminNotice.subject, html: adminNotice.html });

    revalidatePath("/affiliates/dashboard/payouts");
    return { success: true };
  } catch (err) {
    console.error("Failed to submit payout request:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
