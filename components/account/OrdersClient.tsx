"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Filter, ArrowRight } from "lucide-react";

export interface OrderListItem {
  id: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  paid: "bg-amber-50 text-amber-700 border border-amber-200",
  fulfilled: "bg-sky-50 text-sky-700 border border-sky-200",
  shipped: "bg-sky-50 text-sky-700 border border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  refunded: "bg-rose-50 text-rose-700 border border-rose-200",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
};

export function OrdersClient({ orders }: { orders: OrderListItem[] }) {
  const [filter, setFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const statuses = useMemo(() => {
    const set = new Set(orders.map((o) => o.status));
    return Array.from(set);
  }, [orders]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-sans">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-lg leading-relaxed">
            Track and review your laboratory peptide synthesis batches and fulfillment history.
          </p>
        </div>

        {statuses.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === "all"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-black border border-neutral-200"
              }`}
            >
              All ({orders.length})
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer ${
                  filter === status
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-white text-neutral-600 hover:text-black border border-neutral-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="group bg-white border border-neutral-200/80 hover:border-neutral-950/40 rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Package size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-black transition-colors font-sans">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        STATUS_STYLES[order.status] || "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 mt-0.5">
                    {order.date} &bull; {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <span className="text-base font-extrabold text-neutral-950 font-sans">
                  ${order.total.toFixed(2)}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 group-hover:bg-neutral-950 text-neutral-700 group-hover:text-white text-xs font-semibold transition-colors">
                  <span>Details</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-neutral-200/80 p-8">
          <Package size={36} className="text-neutral-300 mb-3" />
          <h2 className="text-base font-bold text-neutral-900">No orders found</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            {filter === "all"
              ? "You haven't placed any research peptide orders yet."
              : `No orders matching status "${filter}".`}
          </p>
          <Link
            href="/shop"
            className="mt-5 px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            Browse Peptide Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
