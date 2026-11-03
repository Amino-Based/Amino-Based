import { getPayload } from "payload";
import config from "@payload-config";
import { Inbox } from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { AffiliateConversion } from "@/lib/types/affiliate";
import { formatDate, formatUsd } from "@/lib/types/affiliate";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  pending: "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
  approved: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  paid: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30",
  reversed: "text-red-300 bg-red-500/10 border-red-500/30",
  voided: "text-gray-400 bg-gray-500/10 border-gray-500/30",
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
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
      <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Conversions</h2>

      {conversions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <Inbox className="w-8 h-8 text-gray-500 mb-4" strokeWidth={1.5} />
          <p className="text-gray-400 text-sm max-w-sm">
            No conversions yet. Once someone uses your referral link or coupon code to make a purchase, it will show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Order Subtotal</th>
                <th className="py-3 pr-4">Commission</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {conversions.map((conversion) => (
                <tr key={conversion.id} className="border-b border-white/5 text-gray-300">
                  <td className="py-4 pr-4">{formatDate(conversion.createdAt)}</td>
                  <td className="py-4 pr-4">{formatUsd(conversion.orderSubtotal)}</td>
                  <td className="py-4 pr-4 text-white font-medium">{formatUsd(conversion.commissionAmount)}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs rounded-full border uppercase tracking-wide ${
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
