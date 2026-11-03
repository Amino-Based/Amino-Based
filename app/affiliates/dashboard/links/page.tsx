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
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">Referral Link</h2>
        <p className="text-gray-400 text-sm mb-4">
          Share this link &mdash; anyone who visits and buys within{" "}
          {affiliate.cookieDurationDays ?? 30} days is attributed to you.
        </p>
        {referralLink ? (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <p className="flex-1 font-mono text-sm text-indigo-300 break-all bg-black/40 border border-white/10 rounded-xl px-4 py-3">
              {referralLink}
            </p>
            <CopyLinkButton value={referralLink} />
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">Your referral link is being generated. Check back soon.</p>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">Coupon Code</h2>
        <p className="text-gray-400 text-sm mb-4">
          Your audience can also use this code at checkout
          {affiliate.customerDiscount ? ` for ${affiliate.customerDiscount}% off` : ""} &mdash; it&apos;s
          automatically attributed to you.
        </p>
        {affiliate.couponCode ? (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <p className="flex-1 font-mono text-lg tracking-widest text-white bg-black/40 border border-white/10 rounded-xl px-4 py-3">
              {affiliate.couponCode}
            </p>
            <CopyLinkButton value={affiliate.couponCode} />
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No coupon code has been assigned yet.</p>
        )}
      </div>
    </div>
  );
}
