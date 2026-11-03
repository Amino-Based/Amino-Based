import { BadgeDollarSign, MousePointerClick, ShoppingBag, TrendingUp } from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { formatUsd } from "@/lib/types/affiliate";

export const dynamic = "force-dynamic";

export default async function AffiliateDashboardOverviewPage() {
  const user = await getPayloadUser();
  const affiliate = user ? await getAffiliateForUser(user.id) : null;
  const baseUrl = await getBaseUrl();

  if (!affiliate) return null; // layout already guarantees this, guard for type-safety

  const referralLink = affiliate.referralSlug ? `${baseUrl}/?ref=${affiliate.referralSlug}` : null;

  const stats = [
    { label: "Total Clicks", value: affiliate.totalClicks ?? 0, icon: MousePointerClick },
    { label: "Conversions", value: affiliate.totalConversions ?? 0, icon: ShoppingBag },
    { label: "Revenue Generated", value: formatUsd(affiliate.totalRevenue), icon: TrendingUp },
    { label: "Commission Earned", value: formatUsd(affiliate.totalCommissionEarned), icon: BadgeDollarSign },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-md"
            >
              <Icon className="w-6 h-6 text-indigo-400 mb-4" />
              <div className="text-2xl font-inter font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Referral link */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">Your Referral Link</h2>
        <p className="font-mono text-sm text-indigo-300 break-all bg-black/40 border border-white/10 rounded-xl px-4 py-3">
          {referralLink ?? "Your referral link is being generated. Check back soon."}
        </p>
        {affiliate.couponCode && (
          <p className="text-sm text-gray-400 mt-4">
            Coupon code: <span className="font-mono text-white">{affiliate.couponCode}</span>
          </p>
        )}
      </div>

      {/* Commission breakdown */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Commission Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-xl font-inter text-white mb-1">{formatUsd(affiliate.totalCommissionPending)}</div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Pending</p>
          </div>
          <div>
            <div className="text-xl font-inter text-white mb-1">{formatUsd(affiliate.totalCommissionApproved)}</div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Approved</p>
          </div>
          <div>
            <div className="text-xl font-inter text-white mb-1">{formatUsd(affiliate.totalCommissionPaid)}</div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Paid Out</p>
          </div>
        </div>
      </div>
    </div>
  );
}
