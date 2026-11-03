/**
 * Local affiliate-domain types mirroring the field shapes defined in
 * collections/Affiliates.ts, collections/AffiliateApplications.ts,
 * collections/AffiliateConversions.ts, collections/PayoutRequests.ts and
 * globals/AffiliateSettings.ts.
 *
 * payload-types.ts is currently a placeholder (no live database is
 * connected yet), so these types let affiliate pages type-check against
 * the known collection shapes now; once real generated types exist, call
 * sites can be switched over to them.
 */

export type SocialPlatform = "instagram" | "youtube" | "tiktok" | "twitter" | "reddit";

export interface AffiliateSocialLink {
  id?: string | number | null;
  platform?: SocialPlatform | null;
  url?: string | null;
}

export type PayoutMethodType =
  | "paypal"
  | "wise"
  | "bank_wire"
  | "crypto_btc"
  | "crypto_eth"
  | "crypto_usdt_erc20"
  | "crypto_usdt_trc20"
  | "store_credit";

export interface AffiliatePayoutMethod {
  id?: string | number | null;
  type?: PayoutMethodType | null;
  isPrimary?: boolean | null;
  paypalEmail?: string | null;
  walletAddress?: string | null;
  walletNetwork?: string | null;
}

export type PayoutCurrency = "USD" | "BTC" | "ETH" | "USDT_ERC20" | "USDT_TRC20" | "STORE_CREDIT";

export interface Affiliate {
  id: string | number;
  user: string | number;
  status?: "pending" | "approved" | "rejected" | "suspended" | null;
  applicationDate?: string | null;
  approvedAt?: string | null;
  displayName?: string | null;
  websiteUrl?: string | null;
  socialLinks?: AffiliateSocialLink[] | null;
  parentAffiliate?: (string | number) | null;

  referralSlug?: string | null;
  couponCode?: string | null;
  cookieDurationDays?: number | null;

  commissionRate?: number | null;
  commissionType?: "percentage" | "fixed_amount" | null;
  customerDiscount?: number | null;
  pendingPeriodDays?: number | null;
  tier?: "standard" | "silver" | "gold" | "vip" | null;

  totalClicks?: number | null;
  uniqueClicks?: number | null;
  totalConversions?: number | null;
  totalRevenue?: number | null;
  totalCommissionEarned?: number | null;
  totalCommissionPending?: number | null;
  totalCommissionApproved?: number | null;
  totalCommissionRequested?: number | null;
  totalCommissionPaid?: number | null;

  minimumPayoutThreshold?: number | null;
  payoutCurrency?: PayoutCurrency | null;
  payoutMethods?: AffiliatePayoutMethod[] | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface AffiliateApplication {
  id?: string | number;
  user: string | number;
  status?: "pending" | "approved" | "rejected" | null;
  displayName: string;
  websiteUrl?: string | null;
  socialLinks?: AffiliateSocialLink[] | null;
  promotionMethods: string;
  estimatedMonthlyReach?: "<1k" | "1k-10k" | "10k-100k" | "100k+" | null;
  niche?: string | null;
  whyJoin?: string | null;
  agreedToTerms: boolean;
}

export interface AffiliateConversion {
  id: string | number;
  affiliate: string | number;
  order: string | number;
  commissionAmount?: number | null;
  orderSubtotal?: number | null;
  commissionRate?: number | null;
  status?: "pending" | "approved" | "paid" | "reversed" | "voided" | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  createdAt?: string;
}

export interface PayoutRequest {
  id?: string | number;
  affiliate: string | number;
  amount: number;
  payoutMethod: "zelle" | "cashapp" | "applepay";
  payoutDetails: string;
  status?: "pending" | "approved" | "paid" | "rejected" | null;
  processedAt?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
}

export interface AffiliateSettings {
  defaultCommissionRate: number;
  defaultCommissionType: "percentage" | "fixed_amount";
  defaultCookieDurationDays: number;
  defaultPendingPeriodDays: number;
  defaultMinimumPayoutThreshold: number;
  defaultCommissionOn: "subtotal_after_coupon" | "subtotal_before_coupon";
}

export function formatUsd(amount: number | null | undefined): string {
  return `$${(amount ?? 0).toFixed(2)}`;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}
