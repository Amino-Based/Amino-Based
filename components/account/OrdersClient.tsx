"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Filter } from "lucide-react";

export interface OrderListItem {
  id: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-amber-50 text-amber-600",
  fulfilled: "bg-blue-50 text-blue-600",
  shipped: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  refunded: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-inter text-3xl md:text-5xl uppercase font-bold tracking-wider text-gray-900">
            Orders
          </h1>
          <p className="font-inter text-gray-500 mt-3 max-w-lg text-sm">
            Track and review every order you&apos;ve placed with us.
          </p>
        </div>

        {statuses.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-black/10 rounded-full px-4 py-2 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="font-inter bg-transparent text-xs font-bold uppercase tracking-widest text-gray-900 focus:outline-none"
            >
              <option value="all">All</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-3 hover:bg-gray-50/60 -mx-4 px-4 rounded-2xl transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
                  <div className="flex flex-col">
                    <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {order.date}
                    </span>
                    <span className="font-inter text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      #{order.id}
                    </span>
                  </div>
                  <span
                    className={`font-inter w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="font-inter text-lg font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="font-inter text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-black/5 rounded-2xl shadow-sm">
          <Package className="w-10 h-10 text-gray-300 mb-5" strokeWidth={1} />
          <h2 className="font-inter text-xl uppercase tracking-wider text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="font-inter text-gray-500 max-w-sm mb-8 text-sm">
            Once you place an order it will appear here for easy tracking.
          </p>
          <Link
            href="/shop"
            className="font-inter px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
