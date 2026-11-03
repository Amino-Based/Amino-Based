import { getPayload } from "payload";
import config from "@payload-config";
import type { Affiliate } from "@/lib/types/affiliate";

/**
 * Looks up the Affiliates record linked to a given user id, if any.
 * Returns null if none exists or the query fails (e.g. no database configured yet).
 */
export async function getAffiliateForUser(userId: string | number): Promise<Affiliate | null> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "affiliates",
      where: { user: { equals: userId } },
      limit: 1,
      overrideAccess: true,
    });
    const doc = result.docs?.[0];
    return (doc as unknown as Affiliate) ?? null;
  } catch (err) {
    console.error("Failed to load affiliate record:", err);
    return null;
  }
}
