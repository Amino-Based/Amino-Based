/**
 * Order status rules, enforced in the Orders `beforeChange` hook.
 *
 * Three fields describe an order — `status` (overall lifecycle), `paymentStatus` (money) and
 * `fulfillmentStatus` (shipping). `status` and `paymentStatus` used to drift apart (e.g. "Paid" with
 * an Unpaid payment), so they're now kept in sync automatically: setting either one to its
 * paid/refunded value updates the other. `cancelled` and `refunded` are terminal.
 */
export const ORDER_STATUSES = ["pending", "paid", "fulfilled", "shipped", "completed", "refunded", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "fulfilled", "shipped", "completed", "refunded", "cancelled"],
  paid: ["pending", "fulfilled", "shipped", "completed", "refunded", "cancelled"],
  fulfilled: ["shipped", "completed", "refunded"],
  shipped: ["completed", "refunded"],
  completed: ["refunded"],
  refunded: [],
  cancelled: [],
};

const PAYMENT_TRANSITIONS: Record<string, string[]> = {
  unpaid: ["authorized", "captured", "refunded"],
  authorized: ["unpaid", "captured", "refunded"],
  captured: ["refunded"],
  refunded: [],
};

export function assertValidTransition(
  kind: "status" | "paymentStatus",
  from: string | undefined,
  to: string | undefined
): void {
  if (!from || !to || from === to) return;
  const allowed = kind === "status" ? STATUS_TRANSITIONS[from as OrderStatus] : PAYMENT_TRANSITIONS[from];
  if (allowed && !allowed.includes(to)) {
    const label = kind === "status" ? "Status" : "Payment Status";
    throw new Error(
      `Invalid ${label} change: "${from}" → "${to}". ${from === "refunded" || from === "cancelled" ? `"${from}" is final and can't be changed.` : `Allowed: ${allowed.join(", ") || "none"}.`}`
    );
  }
}

/**
 * Keeps `status` and `paymentStatus` consistent after an admin (or webhook) changes one of them.
 * Only the field that did NOT change is adjusted. Returns the adjusted data.
 */
export function syncStatusFields<T extends { status?: string; paymentStatus?: string }>(
  data: T,
  previous: { status?: string; paymentStatus?: string } | undefined
): T {
  const out = { ...data };
  // API updates may send only the changed field, so fall back to the stored value for the other.
  const status = out.status ?? previous?.status;
  const payment = out.paymentStatus ?? previous?.paymentStatus;
  const statusChanged = !!previous && out.status !== undefined && out.status !== previous.status;
  const paymentChanged = !!previous && out.paymentStatus !== undefined && out.paymentStatus !== previous.paymentStatus;

  if (statusChanged && !paymentChanged) {
    if (status === "paid" && payment === "unpaid") out.paymentStatus = "captured";
    if (status === "refunded" && (payment === "captured" || payment === "authorized")) out.paymentStatus = "refunded";
  } else if (paymentChanged && !statusChanged) {
    if (payment === "captured" && status === "pending") out.status = "paid";
    if (payment === "refunded" && status !== "refunded" && status !== "cancelled") out.status = "refunded";
  }
  return out;
}
