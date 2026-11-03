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
  pending: "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
  approved: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  paid: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30",
  rejected: "text-red-300 bg-red-500/10 border-red-500/30",
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
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Available Balance</h2>
        <p className="text-3xl font-inter font-bold text-white mb-1">
          {formatUsd(affiliate?.totalCommissionApproved)}
        </p>
        <p className="text-xs text-gray-500">Approved commission available to request as a payout.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Request A Payout</h2>
        <PayoutRequestForm minimumThreshold={minimumThreshold} />
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Payout History</h2>
        {payoutRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Inbox className="w-8 h-8 text-gray-500 mb-4" strokeWidth={1.5} />
            <p className="text-gray-400 text-sm max-w-sm">You haven&apos;t requested any payouts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Method</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutRequests.map((req) => (
                  <tr key={req.id} className="border-b border-white/5 text-gray-300">
                    <td className="py-4 pr-4">{formatDate(req.createdAt)}</td>
                    <td className="py-4 pr-4 text-white font-medium">{formatUsd(req.amount)}</td>
                    <td className="py-4 pr-4 capitalize">{req.payoutMethod}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs rounded-full border uppercase tracking-wide ${
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
