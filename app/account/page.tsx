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
  ShoppingBag,
  ArrowRight,
  Sparkles,
  FileText,
  Calculator,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import { safeProductImageUrl } from "@/lib/products/productImage";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  paid: "bg-amber-50 text-amber-700 border border-amber-200",
  fulfilled: "bg-sky-50 text-sky-700 border border-sky-200",
  shipped: "bg-sky-50 text-sky-700 border border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  refunded: "bg-rose-50 text-rose-700 border border-rose-200",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
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
  const height = 180;
  const padding = { top: 20, right: 12, bottom: 26, left: 12 };
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
  const hasData = months.some((m) => m.value > 0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
      <defs>
        <linearGradient id="spendingFillObsidian" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141416" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#141416" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.33, 0.66, 1].map((t) => (
        <line
          key={t}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + chartH * (1 - t)}
          y2={padding.top + chartH * (1 - t)}
          stroke="#EAEBEF"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
      ))}

      {hasData && (
        <>
          <path d={areaPath} fill="url(#spendingFillObsidian)" />
          <path d={linePath} fill="none" stroke="#141416" strokeWidth="2" strokeLinecap="round" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === peakIndex ? 4.5 : 2.5}
              fill="#fff"
              stroke="#141416"
              strokeWidth={i === peakIndex ? 2 : 1.5}
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
          className="fill-neutral-400 font-sans text-[10px]"
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

  const getImageUrl = (product: any): string | null =>
    product ? safeProductImageUrl(product?.images?.[0]?.image?.url) : null;

  const STAT_CARDS = [
    { label: "Orders Placed", value: String(ordersPlaced), icon: ShoppingBag, color: "text-neutral-900 bg-neutral-100" },
    { label: "Saved Wishlist", value: String(wishlistCount), suffix: "items", icon: Heart, color: "text-rose-600 bg-rose-50" },
    { label: "Saved Addresses", value: String(addresses.length), suffix: "locations", icon: MapPin, color: "text-sky-600 bg-sky-50" },
    { label: "Reward Points", value: Number(hbPoints).toFixed(0), suffix: "pts", icon: Award, color: "text-amber-600 bg-amber-50" },
    { label: "Member Since", value: memberSince, icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ========================================================= */}
      {/* Header Banner: Research Portal Welcome                    */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            <Sparkles className="w-3 h-3 text-cyan-600" />
            Research Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 font-sans">
            Welcome back, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl leading-relaxed">
            Manage your research peptide orders, lot-specific COA documentation, and delivery destinations.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-xs active:scale-95 shrink-0 w-fit"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 5 Clean Metrics Cards                                     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-neutral-200/70 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-w-0"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-neutral-400 truncate">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight font-sans">
                    {card.value}
                  </span>
                  {card.suffix && <span className="text-[10px] text-neutral-400">{card.suffix}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* Order Ledger & Research Spend Overview                    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders Ledger (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/70 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-950 tracking-tight">
                Order Activity
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Recent verified peptide synthesis orders
              </p>
            </div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-black transition-colors"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="flex flex-col divide-y divide-neutral-100">
              {orders.map((order) => {
                const firstItem = order.items?.[0];
                const product = typeof firstItem?.product === "object" ? firstItem.product : null;
                const imageUrl = getImageUrl(product);
                const itemTitle = firstItem?.title || product?.name || (order.orderNumber ? `Order #${order.orderNumber}` : "Research Order");
                return (
                  <Link
                    href={`/account/orders/${order.orderNumber || order.id}`}
                    key={order.id}
                    className="flex items-center gap-3.5 sm:gap-4 py-3.5 group hover:bg-neutral-50/80 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 shrink-0 overflow-hidden relative flex items-center justify-center border border-neutral-200/60">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt={itemTitle} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={17} className="text-neutral-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold text-neutral-900 truncate group-hover:text-black transition-colors">
                        Order #{order.orderNumber || order.id}
                      </span>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "Recent"}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${
                        STATUS_STYLES[order.status] || "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-neutral-950 shrink-0 w-16 text-right">
                      ${Number(order.total || 0).toFixed(2)}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-neutral-50/60 rounded-xl border border-dashed border-neutral-200">
              <Package size={28} className="text-neutral-300 mb-3" />
              <p className="text-sm font-semibold text-neutral-900">No research orders yet</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-[220px]">
                When you order HPLC-tested peptides, your batch details will appear here.
              </p>
              <Link
                href="/shop"
                className="mt-4 px-5 py-2 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Start An Order
              </Link>
            </div>
          )}
        </div>

        {/* Annual Spending Analytics (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/70 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-950 tracking-tight">
                Annual Expenditure
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {currentYear} calendar year totals
              </p>
            </div>
            <span className="text-xs font-bold text-neutral-900 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1">
              {currentYear}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Cumulative Spend
            </span>
            <div className="text-3xl font-extrabold text-neutral-950 mt-0.5 font-sans">
              ${totalSpent.toFixed(2)}
            </div>
          </div>

          <div className="pt-2">
            <SpendingChart months={spendingMonths} />
          </div>

          <p className="text-xs text-neutral-400 pt-3 border-t border-neutral-100">
            Total laboratory investment for {currentYear}: <strong className="text-neutral-900 font-semibold">${totalSpent.toFixed(2)}</strong>.
          </p>
        </div>

      </div>

      {/* ========================================================= */}
      {/* Primary Shipping Address & Portal Shortcuts               */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Address Card (Span 6) */}
        <div className="md:col-span-6 bg-white border border-neutral-200/70 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-950 tracking-tight">
              Primary Lab Address
            </h2>
            <Link
              href="/account/addresses"
              className="text-xs font-semibold text-neutral-900 hover:text-black underline underline-offset-2 transition-colors"
            >
              Manage
            </Link>
          </div>

          {defaultAddressDoc ? (
            <div className="flex items-start gap-4 py-1">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-700">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <span className="text-neutral-950 font-bold mb-0.5">
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
                {defaultAddressDoc.phone && <span className="mt-1 text-neutral-400">{defaultAddressDoc.phone}</span>}
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-start gap-3">
              <p className="text-xs sm:text-sm text-neutral-500">No laboratory address registered yet.</p>
              <Link
                href="/account/addresses"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 text-neutral-900 text-xs font-semibold hover:border-black transition-colors"
              >
                Add Shipping Address
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Discreet, temperature-controlled laboratory shipping</span>
          </div>
        </div>

        {/* Quick Tools & Documentation Shortcuts (Span 6) */}
        <div className="md:col-span-6 bg-white border border-neutral-200/70 rounded-2xl p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-950 tracking-tight">
              Research Quick Access
            </h2>
            <span className="text-[11px] text-neutral-400 font-medium">Tools &amp; COA</span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <Link
              href="/peptide-calculator"
              className="p-3.5 rounded-xl border border-neutral-200/70 hover:border-neutral-950 bg-neutral-50/50 hover:bg-neutral-50 transition-all flex flex-col justify-between group"
            >
              <Calculator size={18} className="text-neutral-700 group-hover:text-black mb-2" />
              <div>
                <span className="text-xs font-bold text-neutral-950 block">Reconstitution</span>
                <span className="text-[10px] text-neutral-400">Calculate volume &amp; dose</span>
              </div>
            </Link>

            <Link
              href="/certificates"
              className="p-3.5 rounded-xl border border-neutral-200/70 hover:border-neutral-950 bg-neutral-50/50 hover:bg-neutral-50 transition-all flex flex-col justify-between group"
            >
              <FileText size={18} className="text-neutral-700 group-hover:text-black mb-2" />
              <div>
                <span className="text-xs font-bold text-neutral-950 block">Verify COA</span>
                <span className="text-[10px] text-neutral-400">HPLC &amp; MS reports</span>
              </div>
            </Link>
          </div>

          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Need researcher assistance?</span>
            <Link
              href="/contact-us"
              className="font-semibold text-neutral-900 hover:text-black underline underline-offset-2 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
