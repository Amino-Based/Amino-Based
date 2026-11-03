import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import SettingsForm from "@/components/affiliates/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AffiliateSettingsPage() {
  const user = await getPayloadUser();
  const affiliate = user ? await getAffiliateForUser(user.id) : null;

  if (!affiliate) return null;

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md max-w-2xl">
      <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Profile & Payout Settings</h2>
      <SettingsForm affiliate={affiliate} />
    </div>
  );
}
