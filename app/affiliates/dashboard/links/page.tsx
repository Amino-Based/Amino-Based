import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import { getBaseUrl } from "@/lib/getBaseUrl";
import CopyLinkButton from "@/components/affiliates/CopyLinkButton";

export const dynamic = "force-dynamic";

export default async function AffiliateLinksPage() {
  const user = await getPayloadUser();
  const affiliate = user ? await getAffiliateForUser(user.id) : null;
  const baseUrl = await getBaseUrl();

  if (!affiliate) return null;

  const referralLink = affiliate.referralSlug ? `${baseUrl}/?ref=${affiliate.referralSlug}` : null;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-2">
          Persistent Referral Link
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mb-4">
          Direct researchers with this tracking link &mdash; visits that convert within{" "}
          <strong className="text-[#071739]">{affiliate.cookieDurationDays ?? 30} days</strong> are fully credited to your account.
        </p>
        {referralLink ? (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <p className="flex-1 font-mono text-xs sm:text-sm text-[#031B4E] break-all bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 select-all">
              {referralLink}
            </p>
            <CopyLinkButton value={referralLink} />
          </div>
        ) : (
          <p className="text-slate-400 text-xs sm:text-sm italic">
            Your referral link is currently being generated. Check back shortly.
          </p>
        )}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-2">
          Custom Audience Coupon Code
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mb-4">
          Your readers can enter this coupon code at checkout
          {affiliate.customerDiscount ? ` to receive a ${affiliate.customerDiscount}% discount` : ""} &mdash; attribution occurs automatically even if cookies are disabled.
        </p>
        {affiliate.couponCode ? (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <p className="flex-1 font-mono text-base sm:text-lg font-bold tracking-wider text-[#071739] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
              {affiliate.couponCode}
            </p>
            <CopyLinkButton value={affiliate.couponCode} />
          </div>
        ) : (
          <p className="text-slate-400 text-xs sm:text-sm italic">
            No coupon code has been assigned to this account yet.
          </p>
        )}
      </div>
    </div>
  );
}
