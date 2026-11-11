import { getPayload } from "payload";
import config from "@payload-config";
import { Inbox } from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { AffiliateConversion } from "@/lib/types/affiliate";
import { formatDate, formatUsd } from "@/lib/types/affiliate";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  pending: "text-amber-800 bg-amber-500/10 border-amber-400/30",
  approved: "text-emerald-800 bg-emerald-500/10 border-emerald-400/30",
  paid: "text-[#031B4E] bg-cyan-500/10 border-cyan-400/30 font-bold",
  reversed: "text-rose-800 bg-rose-500/10 border-rose-400/30",
  voided: "text-slate-500 bg-slate-100 border-slate-200",
};

export default async function AffiliateConversionsPage() {
  const user = await getPayloadUser();
  const affiliate = user ? await getAffiliateForUser(user.id) : null;

  let conversions: AffiliateConversion[] = [];
  if (affiliate) {
    try {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "affiliate-conversions",
        where: { affiliate: { equals: affiliate.id } },
        sort: "-createdAt",
        limit: 100,
        overrideAccess: true,
      });
      conversions = (result.docs ?? []) as unknown as AffiliateConversion[];
    } catch (err) {
      console.error("Failed to load affiliate conversions:", err);
      conversions = [];
    }
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs">
      <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-6">
        Analytical Conversions
      </h2>

      {conversions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-12 h-12 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/10 flex items-center justify-center text-[#031B4E] mb-3">
            <Inbox className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-[#071739] mb-1">No Conversions Logged Yet</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
            Once a referral completes an order using your dedicated link or custom coupon code, the verified record will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-[#F8FAFC]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Order Subtotal</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {conversions.map((conversion) => (
                <tr key={conversion.id} className="border-b border-[#F1F5F9] text-slate-700 hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="py-3.5 px-4 text-xs font-medium">{formatDate(conversion.createdAt)}</td>
                  <td className="py-3.5 px-4 text-xs font-mono">{formatUsd(conversion.orderSubtotal)}</td>
                  <td className="py-3.5 px-4 text-xs font-mono font-bold text-[#071739]">{formatUsd(conversion.commissionAmount)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                        statusStyles[conversion.status ?? "pending"] ?? statusStyles.pending
                      }`}
                    >
                      {conversion.status ?? "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
