import type { Payload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateAdminAffiliateConversionEmail } from "@/lib/email/templates/affiliate";
import { ADMIN_EMAIL } from "@/lib/email/layout";

/**
 * Simplified affiliate attribution: if the coupon applied at checkout is a given
 * affiliate's own referral coupon, record a conversion and notify the admin.
 *
 * This intentionally does not implement click/cookie-based attribution (no
 * AffiliateClicks tracking exists yet) — coupon-code attribution alone covers the
 * common case where a customer used the affiliate's code, which is enough to
 * drive the "New Affiliate Sale!" notification email requested here.
 */
export async function trackAffiliateConversion(args: {
  payload: Payload;
  orderId: string | number;
  orderSubtotal: number;
  orderDiscount: number;
  couponCode?: string | null;
  customerEmail?: string | null;
  customerUserId?: string | number | null;
}): Promise<void> {
  const { payload, orderId, orderSubtotal, orderDiscount, couponCode } = args;
  if (!couponCode) return;

  const affiliateResult = await payload.find({
    collection: "affiliates",
    where: { couponCode: { equals: couponCode }, status: { equals: "approved" } },
    limit: 1,
    overrideAccess: true,
  });
  const affiliate = affiliateResult.docs?.[0];
  if (!affiliate) return;

  const selfReferral =
    !!args.customerUserId && String(affiliate.user) === String(args.customerUserId);

  // Idempotent: never record a second conversion for the same order.
  const existing = await payload.find({
    collection: "affiliate-conversions",
    where: { order: { equals: orderId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) return;

  const eligibleSubtotal = Math.max(0, orderSubtotal - orderDiscount);
  const rate = typeof affiliate.commissionRate === "number" ? affiliate.commissionRate : 10;
  const commissionAmount = selfReferral ? 0 : Math.round(eligibleSubtotal * (rate / 100) * 100) / 100;

  // Commissions stay "pending" for a hold period (protects against refunds), then the daily
  // cron (app/api/cron/process-commissions) approves them.
  const settings: any = await payload.findGlobal({ slug: "affiliate-settings" }).catch(() => null);
  const holdDays = Number(settings?.defaultPendingPeriodDays) > 0 ? Number(settings.defaultPendingPeriodDays) : 14;
  const pendingUntil = new Date(Date.now() + holdDays * 24 * 60 * 60 * 1000).toISOString();

  await payload.create({
    collection: "affiliate-conversions",
    data: {
      affiliate: affiliate.id,
      order: orderId,
      customer: args.customerUserId || undefined,
      customerEmail: args.customerEmail || undefined,
      attributionSource: "coupon_code",
      couponCodeUsed: couponCode,
      orderSubtotal,
      orderDiscount,
      eligibleSubtotal,
      commissionRate: rate,
      commissionAmount,
      status: selfReferral ? "voided" : "pending",
      pendingUntil,
      selfReferralDetected: selfReferral,
    } as any,
    overrideAccess: true,
  });

  // Atomic increments — read-then-write here would lose updates when two sales land together.
  await (payload.db as any).drizzle
    .execute(sql`
      UPDATE affiliates SET
        total_conversions = COALESCE(total_conversions, 0) + 1,
        total_revenue = COALESCE(total_revenue, 0) + ${selfReferral ? 0 : eligibleSubtotal},
        total_commission_pending = COALESCE(total_commission_pending, 0) + ${commissionAmount}
      WHERE id = ${affiliate.id}`)
    .catch((err: unknown) => console.error("Failed to update affiliate stats:", err));

  const orderDoc = await payload.findByID({ collection: "orders", id: orderId, overrideAccess: true }).catch(() => null);
  const adminNotice = generateAdminAffiliateConversionEmail({
    affiliateName: affiliate.displayName || `Affiliate #${affiliate.id}`,
    orderNumber: String(orderDoc?.orderNumber || orderId),
    commissionAmount,
    voided: selfReferral,
  });
  await sendTrackedEmail({ to: ADMIN_EMAIL, subject: adminNotice.subject, html: adminNotice.html });
}
