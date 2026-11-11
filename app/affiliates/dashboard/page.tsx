import { BadgeDollarSign, MousePointerClick, ShoppingBag, TrendingUp, Copy } from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { formatUsd } from "@/lib/types/affiliate";
import CopyLinkButton from "@/components/affiliates/CopyLinkButton";

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
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 shadow-2xs hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-[#031B4E] mb-3.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif text-[#071739] font-normal mb-0.5">{stat.value}</div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Referral link */}
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-7 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-3 flex items-center gap-2">
          <span>Your Dedicated Referral Link</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <p className="flex-1 font-mono text-xs sm:text-sm text-[#031B4E] break-all bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 select-all">
            {referralLink ?? "Your referral link is being generated. Check back soon."}
          </p>
          {referralLink && <CopyLinkButton link={referralLink} />}
        </div>
        {affiliate.couponCode && (
          <p className="text-xs text-slate-600 mt-4 flex items-center gap-2">
            <span>Direct Audience Coupon Code:</span>
            <span className="font-mono font-bold text-[#071739] bg-cyan-500/10 border border-cyan-400/30 px-2.5 py-0.5 rounded-full text-xs">
              {affiliate.couponCode}
            </span>
          </p>
        )}
      </div>

      {/* Commission breakdown */}
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-7 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-5">
          Commission Status Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <div className="text-xl font-serif text-[#071739] mb-1">
              {formatUsd(affiliate.totalCommissionPending)}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Review</p>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <div className="text-xl font-serif text-[#031B4E] mb-1 font-semibold">
              {formatUsd(affiliate.totalCommissionApproved)}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">Approved for Payout</p>
          </div>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <div className="text-xl font-serif text-slate-700 mb-1">
              {formatUsd(affiliate.totalCommissionPaid)}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Disbursed to Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
