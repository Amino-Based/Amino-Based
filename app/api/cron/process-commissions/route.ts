import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { sql } from "@payloadcms/db-postgres/drizzle";

export const dynamic = "force-dynamic";

/**
 * Daily job (see vercel.json): approves affiliate commissions whose hold period has ended, as long
 * as the referred order is still paid. Moves the amount from the affiliate's pending to approved
 * total. Vercel Cron calls this with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const db = (payload.db as any).drizzle;

  const due = await payload.find({
    collection: "affiliate-conversions",
    where: { status: { equals: "pending" }, pendingUntil: { less_than_equal: new Date().toISOString() } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });

  let approved = 0;
  for (const conv of due.docs as any[]) {
    const orderId = typeof conv.order === "object" ? conv.order?.id : conv.order;
    const order: any = await payload
      .findByID({ collection: "orders", id: orderId, depth: 0, overrideAccess: true })
      .catch(() => null);
    // Only approve commissions on orders that are paid and not since cancelled/refunded.
    if (!order || order.paymentStatus !== "captured" || order.status === "cancelled" || order.status === "refunded") continue;

    const amount = Number(conv.commissionAmount) || 0;
    const claim = await db.execute(sql`
      UPDATE affiliate_conversions SET status = 'approved', approved_at = now()
      WHERE id = ${conv.id} AND status = 'pending'
      RETURNING id`);
    if ((claim.rows?.length ?? 0) === 0) continue;

    const affiliateId = typeof conv.affiliate === "object" ? conv.affiliate?.id : conv.affiliate;
    await db.execute(sql`
      UPDATE affiliates SET
        total_commission_pending = GREATEST(COALESCE(total_commission_pending, 0) - ${amount}, 0),
        total_commission_approved = COALESCE(total_commission_approved, 0) + ${amount}
      WHERE id = ${affiliateId}`);
    approved++;
  }

  return NextResponse.json({ checked: due.docs.length, approved });
}
