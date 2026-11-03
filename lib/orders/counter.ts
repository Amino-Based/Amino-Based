import type { Payload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";

/**
 * Next order number, allocated with a single atomic upsert so concurrent checkouts can never
 * receive the same number (the old read-then-update could, and fell back to 7001 on any error).
 * The order number is 7000 + counter (counter 13 → order #7013).
 */
export async function getNextOrderNumber(payload: Payload): Promise<string> {
  const db = (payload.db as any).drizzle;
  const result = await db.execute(sql`
    INSERT INTO order_counters (id, counter, created_at, updated_at)
    VALUES (1, 1, now(), now())
    ON CONFLICT (id) DO UPDATE
      SET counter = order_counters.counter + 1, updated_at = now()
    RETURNING counter
  `);
  const counter = Number(result.rows?.[0]?.counter);
  if (!Number.isFinite(counter)) throw new Error("Could not allocate an order number.");
  return String(7000 + counter);
}
