"use client";

import { useEffect, useState } from "react";

type OrderRow = {
  id: number | string;
  orderNumber?: string;
  total?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
};

const userIdFromUrl = () => window.location.pathname.match(/\/collections\/users\/([^/?#]+)/)?.[1] ?? null;

/** Shown on a user's page: their recent orders and lifetime spend, so support needn't filter the Orders list. */
export default function UserOrderHistory() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    const id = userIdFromUrl();
    if (!id) return;
    fetch(`/api/orders?where[owner][equals]=${encodeURIComponent(id)}&sort=-createdAt&limit=50&depth=0`, {
      credentials: "same-origin",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (!res) return;
        setOrders(res.docs ?? []);
        setTotalDocs(res.totalDocs ?? 0);
      })
      .catch(() => setOrders([]));
  }, []);

  if (orders === null) return null;

  const spent = orders
    .filter((o) => o.paymentStatus === "captured")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <div style={{ margin: "24px 0" }}>
      <h4 style={{ margin: "0 0 4px" }}>Order history</h4>
      <p style={{ margin: "0 0 12px", fontSize: 13, opacity: 0.7 }}>
        {totalDocs} order{totalDocs === 1 ? "" : "s"} · ${spent.toFixed(2)} paid
      </p>
      {orders.length === 0 ? (
        <p style={{ fontSize: 13, opacity: 0.7 }}>No orders yet.</p>
      ) : (
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.7 }}>
              <th style={{ padding: "4px 8px 4px 0" }}>Order</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid var(--theme-elevation-100, #2a2a2a)" }}>
                <td style={{ padding: "6px 8px 6px 0" }}>
                  <a href={`/pb-console/collections/orders/${o.id}`}>#{o.orderNumber || o.id}</a>
                </td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}</td>
                <td>${Number(o.total || 0).toFixed(2)}</td>
                <td>{o.status}</td>
                <td>{o.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
