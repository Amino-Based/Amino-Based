import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import {
  Package,
  MapPin,
  Heart,
  Calendar,
  Coins,
  ShoppingBag,
  DollarSign,
  Edit2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { safeProductImageUrl } from "@/lib/products/productImage";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-amber-50 text-amber-600",
  fulfilled: "bg-blue-50 text-blue-600",
  shipped: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  refunded: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function SpendingChart({ months }: { months: { label: string; value: number }[] }) {
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 12, bottom: 28, left: 12 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const max = Math.max(...months.map((m) => m.value), 1);
  const points = months.map((m, i) => ({
    x: padding.left + (i / (months.length - 1)) * chartW,
    y: padding.top + chartH - (m.value / max) * chartH,
  }));

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const peakIndex = months.reduce((best, m, i) => (m.value > months[best].value ? i : best), 0);
  const peak = points[peakIndex];
  const hasData = months.some((m) => m.value > 0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id="spendingFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + chartH * (1 - t)}
          y2={padding.top + chartH * (1 - t)}
          stroke="#f0f0f2"
          strokeWidth="1"
        />
      ))}

      {hasData && (
        <>
          <path d={areaPath} fill="url(#spendingFill)" />
          <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === peakIndex ? 5 : 3}
              fill="#fff"
              stroke="#4f46e5"
              strokeWidth={i === peakIndex ? 2.5 : 1.5}
            />
          ))}
        </>
      )}

      {months.map((m, i) => (
        <text
          key={m.label}
          x={padding.left + (i / (months.length - 1)) * chartW}
          y={height - 6}
          textAnchor="middle"
          className="fill-gray-400"
          fontSize="10"
        >
          {m.label}
        </text>
      ))}
    </svg>
  );
}

export default async function AccountOverviewPage() {
  const user = await getPayloadUser();
  if (!user) redirect("/login");

  const payload = await getPayload({ config });

  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1).toISOString();

  const [ordersResult, wishlistsResult, addressesResult, yearOrdersResult] = await Promise.all([
    payload.find({
      collection: "orders",
      where: { owner: { equals: user.id } },
      sort: "-createdAt",
      limit: 4,
      depth: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "wishlists",
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "addresses",
      where: { user: { equals: user.id } },
      sort: "-updatedAt",
      overrideAccess: true,
    }),
    payload.find({
      collection: "orders",
      where: { owner: { equals: user.id }, createdAt: { greater_than_equal: yearStart } },
      depth: 0,
      limit: 0,
      overrideAccess: true,
    }),
  ]);

  const orders = ordersResult.docs as any[];
  const ordersPlaced = ordersResult.totalDocs;
  const wishlistCount = (wishlistsResult.docs[0] as any)?.items?.length || 0;
  const addresses = addressesResult.docs as any[];
  const defaultAddressDoc = addresses.find((a) => a.isDefaultShipping) || addresses[0] || null;
  const hbPoints = user.hbPoints || 0;
  const userName = user.firstName || user.email.split("@")[0];
  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear().toString() : String(currentYear);

  const monthlyTotals = Array(12).fill(0);
  for (const order of yearOrdersResult.docs as any[]) {
    if (!order.createdAt) continue;
    const month = new Date(order.createdAt).getMonth();
    monthlyTotals[month] += order.total || 0;
  }
  const totalSpent = (yearOrdersResult.docs as any[]).reduce((sum, o) => sum + (o.total || 0), 0);
  const spendingMonths = MONTH_LABELS.map((label, i) => ({ label, value: monthlyTotals[i] }));

  // TEMPORARY: local media storage isn't reachable on Vercel yet (R2 not connected), so
  // serve the shared placeholder instead of the stored URL.
  // Was "/product-card-image.png" for every product — a Prime Time Bio Labs vial. Order line
// snapshots are historical records and are not rewritten, so resolve defensively at render.
const getImageUrl = (product: any): string | null =>
  product ? safeProductImageUrl(product?.images?.[0]?.image?.url) : null;

  const STAT_CARDS = [
    { label: "PB Points", value: Number(hbPoints).toFixed(2), suffix: "pts", icon: Coins, bg: "bg-blue-50", fg: "text-blue-500" },
    { label: "Orders Placed", value: String(ordersPlaced), icon: ShoppingBag, bg: "bg-emerald-50", fg: "text-emerald-500" },
    { label: "Wishlist Items", value: String(wishlistCount), icon: Heart, bg: "bg-purple-50", fg: "text-purple-500" },
    { label: "Member Since", value: memberSince, icon: Calendar, bg: "bg-orange-50", fg: "text-orange-500" },
    { label: "Points Value", value: `$${Number(hbPoints).toFixed(2)}`, icon: DollarSign, bg: "bg-cyan-50", fg: "text-cyan-600" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="font-inter text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Welcome back
        </p>
        <h1 className="font-inter text-3xl md:text-5xl uppercase font-bold tracking-wider text-gray-900">
          {userName}
        </h1>
        <p className="font-inter text-gray-500 mt-3 max-w-xl text-sm">
          Manage your orders, addresses, and account preferences from your research portal dashboard.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-black/5 rounded-2xl p-3.5 sm:p-5 flex items-center gap-2.5 sm:gap-3 shadow-sm min-w-0"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
                <Icon size={18} className={card.fg} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-inter text-[10px] sm:text-[11px] font-medium text-gray-400 truncate">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-inter text-lg sm:text-xl font-bold text-gray-900">{card.value}</span>
                  {card.suffix && <span className="font-inter text-[10px] text-gray-400">{card.suffix}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ledger + Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Ledger */}
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-inter text-base font-bold text-gray-900">Order Ledger</h3>
            <Link
              href="/account/orders"
              className="font-inter text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="flex flex-col divide-y divide-gray-50">
              {orders.map((order) => {
                const firstItem = order.items?.[0];
                const product = typeof firstItem?.product === "object" ? firstItem.product : null;
                const imageUrl = getImageUrl(product);
                const itemTitle = firstItem?.title || product?.name || (order.orderNumber ? `Order #${order.orderNumber}` : "Ordered product");
                return (
                  <Link
                    href={`/account/orders/${order.orderNumber || order.id}`}
                    key={order.id}
                    className="flex items-center gap-3 sm:gap-4 py-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gray-50 shrink-0 overflow-hidden relative flex items-center justify-center">
                      {imageUrl ? (
                        <img src={imageUrl} alt={itemTitle} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={16} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-inter text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        Order #{order.orderNumber || order.id}
                      </span>
                      <span className="font-inter text-xs text-gray-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "Unknown date"}
                      </span>
                    </div>
                    <span
                      className={`font-inter hidden sm:inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 ${
                        STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-inter text-sm font-bold text-gray-900 shrink-0 w-14 sm:w-16 text-right">
                      ${Number(order.total || 0).toFixed(2)}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-2xl">
              <Package size={24} className="text-gray-300 mb-4" />
              <p className="font-inter text-sm font-medium text-gray-900">No orders yet</p>
              <p className="font-inter text-xs text-gray-500 mt-2 max-w-[200px]">
                When you place an order, it will show up here.
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <p className="font-inter text-xs text-gray-400 pt-2 border-t border-gray-50">
              You&apos;ve placed <span className="font-semibold text-gray-900">{ordersPlaced}</span> orders so far.
            </p>
          )}
        </div>

        {/* Annual Spending */}
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-inter text-base font-bold text-gray-900">Annual Spending</h3>
            <span className="font-inter text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
              {currentYear}
            </span>
          </div>

          <div>
            <span className="font-inter text-[11px] font-medium text-gray-400 uppercase tracking-wide">Total Spent</span>
            <div className="font-inter text-3xl font-bold text-gray-900 mt-1">${totalSpent.toFixed(2)}</div>
          </div>

          <SpendingChart months={spendingMonths} />

          <p className="font-inter text-xs text-gray-400 pt-2 border-t border-gray-50">
            You&apos;ve spent <span className="font-semibold text-gray-900">${totalSpent.toFixed(2)}</span> so far this year.
          </p>
        </div>
      </div>

      {/* Primary Address */}
      <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-inter text-base font-bold text-gray-900">Primary Address</h3>
          <Link
            href="/account/addresses"
            className="font-inter text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5"
          >
            <Edit2 size={12} /> Edit
          </Link>
        </div>

        {defaultAddressDoc ? (
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-indigo-600" />
            </div>
            <div className="font-inter flex flex-col text-sm text-gray-600 leading-relaxed">
              <span className="text-gray-900 font-semibold mb-0.5">
                {defaultAddressDoc.firstName} {defaultAddressDoc.lastName}
              </span>
              <span>
                {defaultAddressDoc.line1}
                {defaultAddressDoc.line2 ? `, ${defaultAddressDoc.line2}` : ""}
              </span>
              <span>
                {defaultAddressDoc.city}, {defaultAddressDoc.state} {defaultAddressDoc.postalCode}
              </span>
              <span>{defaultAddressDoc.country}</span>
              {defaultAddressDoc.phone && <span className="mt-1">{defaultAddressDoc.phone}</span>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <p className="font-inter text-sm text-gray-500">You haven&apos;t added an address yet.</p>
            <Link
              href="/account/addresses"
              className="font-inter border border-gray-200 text-gray-900 px-6 py-2 rounded-full text-xs font-medium uppercase tracking-widest hover:border-gray-900 transition-colors"
            >
              Add Address
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
