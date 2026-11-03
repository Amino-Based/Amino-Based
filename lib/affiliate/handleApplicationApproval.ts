import type { Payload } from "payload";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import {
  generateAffiliateWelcomeEmail,
  generateAdminAffiliateApplicationEmail,
} from "@/lib/email/templates/affiliate";
import { ADMIN_EMAIL } from "@/lib/email/layout";

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "partner"
  );
}

/**
 * Fills the TODO left on AffiliateApplications.ts: when an application is approved,
 * auto-provision the affiliate's profile + a personal coupon, then notify everyone.
 * Wired as an afterChange hook — only acts the first time status flips to "approved".
 */
export async function handleApplicationApproval(args: {
  doc: any;
  previousDoc?: any;
  payload: Payload;
}): Promise<void> {
  const { doc, previousDoc, payload } = args;
  if (doc.status !== "approved" || previousDoc?.status === "approved") return;
  if (doc.linkedAffiliate) return; // already provisioned

  const userId = typeof doc.user === "object" ? doc.user?.id : doc.user;
  if (!userId) return;

  const uniqueSuffix = Math.random().toString(36).slice(2, 6);
  const referralSlug = `${slugify(doc.displayName)}-${uniqueSuffix}`;
  const couponCode = `${slugify(doc.displayName).toUpperCase().replace(/-/g, "").slice(0, 10)}${uniqueSuffix.toUpperCase()}`;

  const coupon = await payload.create({
    collection: "coupons",
    data: {
      code: couponCode,
      type: "percentage",
      value: 10,
      isActive: true,
      applicableProductTypes: "all",
      appliesTo: "all",
    } as any,
    overrideAccess: true,
  });

  const affiliate = await payload.create({
    collection: "affiliates",
    data: {
      user: userId,
      status: "approved",
      applicationDate: doc.createdAt,
      approvedAt: new Date().toISOString(),
      displayName: doc.displayName,
      websiteUrl: doc.websiteUrl,
      socialLinks: doc.socialLinks,
      referralSlug,
      couponCode,
      coupon: coupon.id,
    } as any,
    overrideAccess: true,
  });

  await payload.update({
    collection: "affiliate-applications",
    id: doc.id,
    data: { linkedAffiliate: affiliate.id, reviewedAt: new Date().toISOString() },
    overrideAccess: true,
  });

  const user = await payload.findByID({ collection: "users", id: userId, overrideAccess: true }).catch(() => null);
  if (user?.email) {
    const welcome = generateAffiliateWelcomeEmail({ displayName: doc.displayName, referralSlug, couponCode });
    void sendTrackedEmail({ to: user.email, subject: welcome.subject, html: welcome.html });
  }

  const adminNotice = generateAdminAffiliateApplicationEmail(doc.displayName);
  void sendTrackedEmail({ to: ADMIN_EMAIL, subject: adminNotice.subject, html: adminNotice.html });
}
