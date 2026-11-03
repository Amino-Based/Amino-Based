import type { Payload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";

const dbOf = (payload: Payload) => (payload.db as any).drizzle;

/**
 * Counts a coupon use, atomically honouring its usage limit (so two simultaneous checkouts can't
 * both take the last use) and drawing down store-credit balances. Returns false if the coupon
 * reached its limit in the meantime.
 */
export async function reserveCouponUsage(payload: Payload, code: string, discount: number): Promise<boolean> {
  const db = dbOf(payload);
  const result = await db.execute(sql`
    UPDATE coupons
    SET usage_count = COALESCE(usage_count, 0) + 1
    WHERE code = ${code}
      AND (usage_limit IS NULL OR usage_limit = 0 OR COALESCE(usage_count, 0) < usage_limit)
    RETURNING id, type`);
  const row = result.rows?.[0];
  if (!row) return false;

  if (row.type === "store_credit" && discount > 0) {
    await db.execute(sql`
      UPDATE coupons SET remaining_balance = GREATEST(COALESCE(remaining_balance, 0) - ${discount}, 0)
      WHERE id = ${row.id}`);
  }
  return true;
}

/** Gives a coupon use (and any store-credit amount) back, e.g. when its order is cancelled or refunded. */
export async function releaseCouponUsage(payload: Payload, code: string, discount: number): Promise<void> {
  const db = dbOf(payload);
  const result = await db.execute(sql`
    UPDATE coupons SET usage_count = GREATEST(COALESCE(usage_count, 0) - 1, 0)
    WHERE code = ${code}
    RETURNING id, type`);
  const row = result.rows?.[0];
  if (row?.type === "store_credit" && discount > 0) {
    await db.execute(sql`
      UPDATE coupons SET remaining_balance = COALESCE(remaining_balance, 0) + ${discount}
      WHERE id = ${row.id}`);
  }
}
