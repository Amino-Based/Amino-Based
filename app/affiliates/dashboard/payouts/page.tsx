import { getPayload } from "payload";
import config from "@payload-config";
import { Inbox } from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { AffiliateSettings, PayoutRequest } from "@/lib/types/affiliate";
import { formatDate, formatUsd } from "@/lib/types/affiliate";
import PayoutRequestForm from "@/components/affiliates/PayoutRequestForm";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  pending: "text-amber-800 bg-amber-500/10 border-amber-400/30",
  approved: "text-emerald-800 bg-emerald-500/10 border-emerald-400/30",
  paid: "text-[#031B4E] bg-cyan-500/10 border-cyan-400/30 font-bold",
  rejected: "text-rose-800 bg-rose-500/10 border-rose-400/30",
};

export default async function AffiliatePayoutsPage() {
  const user = await getPayloadUser();
  const affiliate = user ? await getAffiliateForUser(user.id) : null;

  let payoutRequests: PayoutRequest[] = [];
  let minimumThreshold = affiliate?.minimumPayoutThreshold ?? 50;

  if (affiliate) {
    try {
      const payload = await getPayload({ config });
      const [result, settings] = await Promise.all([
        payload.find({
          collection: "payout-requests",
          where: { affiliate: { equals: affiliate.id } },
          sort: "-createdAt",
          limit: 100,
          overrideAccess: true,
        }),
        typeof affiliate.minimumPayoutThreshold !== "number"
          ? (payload.findGlobal({ slug: "affiliate-settings" }).catch(() => null) as Promise<AffiliateSettings | null>)
          : Promise.resolve(null),
      ]);
      payoutRequests = (result.docs ?? []) as unknown as PayoutRequest[];
      if (settings?.defaultMinimumPayoutThreshold) {
        minimumThreshold = settings.defaultMinimumPayoutThreshold;
      }
    } catch (err) {
      console.error("Failed to load payout requests:", err);
      payoutRequests = [];
    }
  }

  return (
    <div className="space-y-6">
      {/* Available balance card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-1">
          Approved Available Balance
        </h2>
        <p className="text-3xl font-serif text-[#031B4E] font-normal mb-1">
          {formatUsd(affiliate?.totalCommissionApproved)}
        </p>
        <p className="text-xs text-slate-500">
          Verified commission balance cleared for automatic or requested disbursement.
        </p>
      </div>

      {/* Request payout */}
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-6">
          Submit Payout Request
        </h2>
        <PayoutRequestForm minimumThreshold={minimumThreshold} />
      </div>

      {/* Payout history */}
      <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs">
        <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-6">
          Disbursement Records
        </h2>
        {payoutRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/10 flex items-center justify-center text-[#031B4E] mb-3">
              <Inbox className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-bold text-[#071739] mb-1">No Disbursements Recorded</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
              Your historical withdrawal records and settlement statements will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-[#F8FAFC]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutRequests.map((req) => (
                  <tr key={req.id} className="border-b border-[#F1F5F9] text-slate-700 hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-medium">{formatDate(req.createdAt)}</td>
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-[#071739]">{formatUsd(req.amount)}</td>
                    <td className="py-3.5 px-4 text-xs capitalize">{req.payoutMethod}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                          statusStyles[req.status ?? "pending"] ?? statusStyles.pending
                        }`}
                      >
                        {req.status ?? "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
