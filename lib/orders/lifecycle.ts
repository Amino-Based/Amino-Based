import type { Payload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";
import { releaseStock, stockLinesFromOrder } from "./inventory";
import { releaseCouponUsage } from "./coupons";
import { trackAffiliateConversion } from "@/lib/affiliate/trackConversion";

const dbOf = (payload: Payload) => (payload.db as any).drizzle;

const idOf = (v: any) => (v && typeof v === "object" ? v.id : v);

/**
 * Runs once when an order's payment is confirmed, whichever path confirmed it (Stripe webhook,
 * client-side sync, or an admin marking it paid). The claim is a single atomic UPDATE, so two
 * paths racing — or an admin re-saving the order — can never run the side effects twice.
 * Side effects: affiliate attribution (conversions only count once an order is actually paid).
 */
export async function finalizeOrder(payload: Payload, order: any): Promise<boolean> {
  const claim = await dbOf(payload).execute(sql`
    UPDATE orders SET is_finalized = true
    WHERE id = ${order.id} AND (is_finalized IS NOT TRUE)
    RETURNING id`);
  if ((claim.rows?.length ?? 0) === 0) return false;

  await trackAffiliateConversion({
    payload,
    orderId: order.id,
    orderSubtotal: Number(order.subtotal) || 0,
    orderDiscount: Number(order.discountTotal) || 0,
    couponCode: order.couponCode,
    customerEmail: order.guestEmail,
    customerUserId: idOf(order.owner),
  }).catch((err) => console.error("Affiliate conversion tracking failed:", err));

  return true;
}

/** Undoes what an order consumed when it is cancelled or refunded: stock, coupon use, commissions. */
export async function reverseOrder(payload: Payload, order: any, reason: "order_cancelled" | "order_refunded"): Promise<void> {
  const db = dbOf(payload);

  await releaseStock(payload, stockLinesFromOrder(order)).catch((err) =>
    console.error(`Failed to release stock for order ${order.id}:`, err)
  );

  if (order.couponCode) {
    await releaseCouponUsage(payload, String(order.couponCode), Number(order.discountTotal) || 0).catch((err) =>
      console.error(`Failed to release coupon for order ${order.id}:`, err)
    );
  }

  // Reverse any commission earned on this order and take it back out of the affiliate's totals.
  const conversions = await payload
    .find({
      collection: "affiliate-conversions",
      where: { order: { equals: order.id }, status: { in: ["pending", "approved"] } },
      limit: 20,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => null);

  for (const conv of conversions?.docs ?? []) {
    const amount = Number(conv.commissionAmount) || 0;
    const eligible = Number(conv.eligibleSubtotal) || 0;
    const wasPending = conv.status === "pending";
    await db
      .execute(sql`
        UPDATE affiliate_conversions
        SET status = 'reversed', reversed_at = now(), reversed_reason = ${reason}
        WHERE id = ${conv.id} AND status IN ('pending', 'approved')`)
      .catch((err: unknown) => console.error("Failed to reverse conversion:", err));
    await db
      .execute(
        wasPending
          ? sql`UPDATE affiliates SET
                total_commission_pending = GREATEST(COALESCE(total_commission_pending, 0) - ${amount}, 0),
                total_revenue = GREATEST(COALESCE(total_revenue, 0) - ${eligible}, 0)
                WHERE id = ${idOf(conv.affiliate)}`
          : sql`UPDATE affiliates SET
                total_commission_approved = GREATEST(COALESCE(total_commission_approved, 0) - ${amount}, 0),
                total_revenue = GREATEST(COALESCE(total_revenue, 0) - ${eligible}, 0)
                WHERE id = ${idOf(conv.affiliate)}`
      )
      .catch((err: unknown) => console.error("Failed to adjust affiliate totals:", err));
  }
}

/** Orders `afterChange` entry point: reacts to payment confirmation and to cancel/refund. */
export async function handleOrderLifecycle(args: {
  doc: any;
  previousDoc?: any;
  operation: "create" | "update";
  payload: Payload;
}): Promise<void> {
  const { doc, previousDoc, operation, payload } = args;
  if (operation !== "update" || !previousDoc) return;

  if (previousDoc.paymentStatus !== "captured" && doc.paymentStatus === "captured") {
    await finalizeOrder(payload, doc);
  }

  const wasReversed = previousDoc.status === "cancelled" || previousDoc.status === "refunded";
  if (!wasReversed && (doc.status === "cancelled" || doc.status === "refunded")) {
    await reverseOrder(payload, doc, doc.status === "refunded" ? "order_refunded" : "order_cancelled");
  }
}
