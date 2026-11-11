import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import SettingsForm from "@/components/affiliates/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AffiliateSettingsPage() {
  const user = await getPayloadUser();
  const affiliate = user ? await getAffiliateForUser(user.id) : null;

  if (!affiliate) return null;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-6 sm:p-8 shadow-2xs max-w-2xl">
      <h2 className="text-xs font-bold tracking-wider text-[#071739] uppercase mb-6">
        Partner Profile &amp; Disbursement Preferences
      </h2>
      <SettingsForm affiliate={affiliate} />
    </div>
  );
}
