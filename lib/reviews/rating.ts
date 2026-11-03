import type { Payload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";

/**
 * Recomputes a product's averageRating / reviewCount from its *approved* reviews. Done as one SQL
 * statement (not payload.update) so it can run inside a review hook without re-triggering product
 * hooks or racing with another review landing at the same time.
 */
export async function recomputeProductRating(payload: Payload, product: unknown): Promise<void> {
  const productId = product && typeof product === "object" ? (product as { id: number }).id : product;
  if (productId == null) return;
  try {
    await (payload.db as any).drizzle.execute(sql`
      UPDATE products SET
        average_rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
                                   WHERE product_id = ${productId} AND status = 'approved'), 0),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ${productId} AND status = 'approved')
      WHERE id = ${productId}`);
  } catch (err) {
    console.error(`Failed to recompute rating for product ${productId}:`, err);
  }
}
