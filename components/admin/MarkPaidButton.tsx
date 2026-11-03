"use client";

import { useEffect, useState } from "react";

type OrderState = { status?: string; paymentStatus?: string; paymentMethod?: string; total?: number };

const orderIdFromUrl = () => window.location.pathname.match(/\/collections\/orders\/([^/?#]+)/)?.[1] ?? null;

const box: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-150, #333)",
  borderRadius: 4,
  padding: 12,
  marginBottom: 16,
  background: "var(--theme-elevation-50, transparent)",
};

/**
 * Sidebar button on an order: confirms a manual payment (Zelle / Venmo / Cash App …) in one click.
 * It calls POST /api/orders/:id/mark-paid, which sets Payment Status = Captured and Status = Paid,
 * and the order hooks then email the customer and record the order as finalized.
 */
export default function MarkPaidButton() {
  const [id, setId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = orderIdFromUrl();
    setId(orderId);
    if (!orderId) return;
    fetch(`/api/orders/${orderId}?depth=0`, { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => doc && setOrder(doc))
      .catch(() => {});
  }, []);

  // Not on a saved order yet (e.g. the create screen) — nothing to confirm.
  if (!id || !order) return null;

  if (order.paymentStatus === "captured" || order.paymentStatus === "refunded") {
    return (
      <div style={box}>
        <strong>{order.paymentStatus === "captured" ? "✓ Payment confirmed" : "Payment refunded"}</strong>
      </div>
    );
  }
  if (order.status === "cancelled" || order.status === "refunded") return null;

  async function markPaid() {
    const amount = order?.total != null ? ` ($${Number(order.total).toFixed(2)})` : "";
    if (!window.confirm(`Confirm you received the payment${amount}? The customer will be emailed that their order is confirmed.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${id}/mark-paid`, { method: "POST", credentials: "same-origin" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not mark the order as paid.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div style={box}>
      <button
        type="button"
        onClick={markPaid}
        disabled={busy}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: 0,
          borderRadius: 4,
          background: "#16a34a",
          color: "#fff",
          fontWeight: 700,
          cursor: busy ? "wait" : "pointer",
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? "Confirming…" : "Mark as paid"}
      </button>
      <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.7 }}>
        Click once the {order.paymentMethod || "payment"} has arrived. The customer gets their confirmation email.
      </p>
      {error && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#ef4444" }}>{error}</p>}
    </div>
  );
}
