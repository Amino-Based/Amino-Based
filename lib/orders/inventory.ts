import type { Payload } from "payload";
import { sql } from "@payloadcms/db-postgres/drizzle";

export type StockLine = {
  productId: number | string;
  /** Variant SKU, only meaningful when the product itself has variants. */
  variantSku?: string | null;
  quantity: number;
};

const dbOf = (payload: Payload) => (payload.db as any).drizzle;

/** True when this line's stock lives on a row of products_variants instead of the product. */
async function usesVariantStock(payload: Payload, line: StockLine): Promise<boolean> {
  if (!line.variantSku) return false;
  const product: any = await payload
    .findByID({ collection: "products", id: line.productId as any, depth: 0, overrideAccess: true })
    .catch(() => null);
  return !!product?.hasVariants && (product.variants ?? []).some((v: any) => v.sku === line.variantSku);
}

/** Atomically takes `quantity` units; returns false (without changing anything) if there isn't enough. */
async function takeStock(payload: Payload, line: StockLine): Promise<boolean> {
  const db = dbOf(payload);
  const result = (await usesVariantStock(payload, line))
    ? await db.execute(sql`
        UPDATE products_variants SET stock = stock - ${line.quantity}
        WHERE _parent_id = ${line.productId} AND sku = ${line.variantSku} AND stock >= ${line.quantity}
        RETURNING id`)
    : await db.execute(sql`
        UPDATE products SET stock = stock - ${line.quantity}
        WHERE id = ${line.productId} AND stock >= ${line.quantity}
        RETURNING id`);
  return (result.rows?.length ?? 0) > 0;
}

export async function releaseStock(payload: Payload, lines: StockLine[]): Promise<void> {
  const db = dbOf(payload);
  for (const line of lines) {
    if (await usesVariantStock(payload, line)) {
      await db.execute(sql`
        UPDATE products_variants SET stock = stock + ${line.quantity}
        WHERE _parent_id = ${line.productId} AND sku = ${line.variantSku}`);
    } else {
      await db.execute(sql`UPDATE products SET stock = stock + ${line.quantity} WHERE id = ${line.productId}`);
    }
  }
}

/**
 * Reserves stock for every line, all-or-nothing: if any line is short, the lines already taken
 * are put back and an error naming the product is thrown.
 */
export async function reserveStock(payload: Payload, lines: StockLine[], names: Record<string, string> = {}): Promise<void> {
  const taken: StockLine[] = [];
  for (const line of lines) {
    const ok = await takeStock(payload, line);
    if (!ok) {
      await releaseStock(payload, taken).catch((err) => console.error("Failed to roll back stock reservation:", err));
      const label = names[String(line.productId)] || `Product ${line.productId}`;
      throw new Error(`Sorry, "${label}" doesn't have enough stock for the quantity requested.`);
    }
    taken.push(line);
  }
}

/** Builds stock lines from a saved order's items (used when releasing on cancel/refund). */
export function stockLinesFromOrder(order: any): StockLine[] {
  return (order.items ?? [])
    .map((item: any) => ({
      productId: typeof item.product === "object" && item.product ? item.product.id : item.product,
      variantSku: item.variant ?? null,
      quantity: Number(item.quantity) || 0,
    }))
    .filter((l: StockLine) => l.productId != null && l.quantity > 0);
}
