"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { PayoutCurrency, PayoutMethodType } from "@/lib/types/affiliate";

export type SettingsFormState = {
  success: boolean;
  error?: string;
};

const socialPlatforms = ["instagram", "youtube", "tiktok", "twitter", "reddit"] as const;
const payoutMethodTypes: PayoutMethodType[] = [
  "paypal",
  "wise",
  "bank_wire",
  "crypto_btc",
  "crypto_eth",
  "crypto_usdt_erc20",
  "crypto_usdt_trc20",
  "store_credit",
];

export async function updateAffiliateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const user = await getPayloadUser();
  if (!user) return { success: false, error: "You must be logged in." };

  const affiliate = await getAffiliateForUser(user.id);
  if (!affiliate) return { success: false, error: "Affiliate account not found." };

  const displayName = String(formData.get("displayName") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const payoutCurrency = String(formData.get("payoutCurrency") ?? "USD") as PayoutCurrency;

  const socialLinks = socialPlatforms
    .map((platform) => ({
      platform,
      url: String(formData.get(`social_${platform}`) ?? "").trim(),
    }))
    .filter((entry) => entry.url);

  const primaryMethodType = String(formData.get("payoutMethodType") ?? "") as PayoutMethodType | "";
  const payoutMethods = primaryMethodType
    ? [
        {
          type: primaryMethodType,
          isPrimary: true,
          paypalEmail: String(formData.get("paypalEmail") ?? "").trim() || undefined,
          walletAddress: String(formData.get("walletAddress") ?? "").trim() || undefined,
          walletNetwork: String(formData.get("walletNetwork") ?? "").trim() || undefined,
        },
      ]
    : [];

  if (primaryMethodType && !payoutMethodTypes.includes(primaryMethodType)) {
    return { success: false, error: "Invalid payout method type." };
  }

  try {
    const payload = await getPayload({ config });
    await payload.update({
      collection: "affiliates",
      id: affiliate.id,
      data: {
        displayName: displayName || undefined,
        websiteUrl: websiteUrl || undefined,
        socialLinks,
        payoutCurrency,
        payoutMethods,
      },
      overrideAccess: true,
    });

    revalidatePath("/affiliates/dashboard/settings");
    return { success: true };
  } catch (err) {
    console.error("Failed to update affiliate settings:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
