"use client";

import { useEffect, useState } from "react";

type Item = { label: string; href: string; url: string };

const ITEMS: Item[] = [
  {
    label: "Orders awaiting payment",
    href: "/pb-console/collections/orders?where[and][0][paymentStatus][equals]=unpaid&where[and][1][status][equals]=pending",
    url: "/api/orders?where[and][0][paymentStatus][equals]=unpaid&where[and][1][status][equals]=pending&limit=0",
  },
  {
    label: "Paid, not yet shipped",
    href: "/pb-console/collections/orders?where[and][0][status][equals]=paid&where[and][1][fulfillmentStatus][equals]=unfulfilled",
    url: "/api/orders?where[and][0][status][equals]=paid&where[and][1][fulfillmentStatus][equals]=unfulfilled&limit=0",
  },
  {
    label: "Reviews to approve",
    href: "/pb-console/collections/reviews?where[status][equals]=pending",
    url: "/api/reviews?where[status][equals]=pending&limit=0",
  },
  {
    label: "Payout requests",
    href: "/pb-console/collections/payout-requests?where[status][equals]=pending",
    url: "/api/payout-requests?where[status][equals]=pending&limit=0",
  },
  {
    label: "Military requests",
    href: "/pb-console/collections/military-discount-requests?where[status][equals]=pending",
    url: "/api/military-discount-requests?where[status][equals]=pending&limit=0",
  },
];

/** Compact "needs attention" counters above the admin sidebar links. Hides rows that are at zero. */
export default function NavBadges() {
  const [counts, setCounts] = useState<(number | null)[]>(ITEMS.map(() => null));

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ITEMS.map((item) =>
        fetch(item.url, { credentials: "same-origin" })
          .then((r) => (r.ok ? r.json() : null))
          .then((res) => (res && typeof res.totalDocs === "number" ? res.totalDocs : null))
          .catch(() => null)
      )
    ).then((result) => !cancelled && setCounts(result));
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = ITEMS.map((item, i) => ({ ...item, count: counts[i] })).filter((r) => (r.count ?? 0) > 0);
  if (rows.length === 0) return null;

  return (
    <div
      style={{
        margin: "0 0 16px",
        padding: 12,
        borderRadius: 6,
        border: "1px solid var(--theme-elevation-150, #333)",
        background: "var(--theme-elevation-50, transparent)",
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Needs attention</div>
      {rows.map((r) => (
        <a
          key={r.label}
          href={r.href}
          style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "3px 0", textDecoration: "none" }}
        >
          <span>{r.label}</span>
          <span
            style={{
              minWidth: 22,
              textAlign: "center",
              borderRadius: 999,
              background: "#dc2626",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "1px 7px",
            }}
          >
            {r.count}
          </span>
        </a>
      ))}
    </div>
  );
}
