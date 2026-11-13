import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { CheckCircle2, Clock, Package } from "lucide-react";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import { getManualPaymentInfo } from "@/lib/payments/manualPayments";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { tokenGrantsOrderAccess } from "@/lib/orders/orderAccessToken";
import { NOINDEX_METADATA } from "@/lib/indexability";

export const dynamic = "force-dynamic";

// A single-use page tied to one order, reachable with an access token. It must
// never be indexed: robots.txt Disallow stops crawling, this also keeps a
// shared or externally linked confirmation URL out of the index.
export const metadata: Metadata = NOINDEX_METADATA;

const MANUAL_PAYMENT_METHODS = new Set(["zelle", "venmo", "cashapp", "amex", "circoflows", "stripe_link"]);

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t: accessToken } = await searchParams;

  const payload = await getPayload({ config });

  let order: any = null;
  try {
    const numericId = Number(id);
    order = await payload.findByID({
      collection: "orders",
      id: Number.isNaN(numericId) ? id : numericId,
      depth: 1,
      overrideAccess: true,
    });
  } catch {
    return notFound();
  }

  if (!order) return notFound();

  // Order ids are sequential Postgres serials, so this route must never serve an order on its id
  // alone — that exposed every customer's name, shipping address and order contents to anyone
  // counting upwards. Guests have no session, so their receipt link carries a signed,
  // order-scoped token instead.
  if (!tokenGrantsOrderAccess(accessToken, order.id)) {
    const user = await getPayloadUser();
    const ownerId =
      typeof order.owner === "object" && order.owner !== null ? order.owner.id : order.owner;
    const isOwner =
      !!user &&
      (String(ownerId) === String(user.id) ||
        // guestEmail is stored as typed at checkout while Users.beforeChange lowercases email,
        // so compare case-insensitively. Normalised here only — account behaviour is untouched.
        (!!order.guestEmail &&
          !!user.email &&
          String(order.guestEmail).toLowerCase() === String(user.email).toLowerCase()));
    // Admin only, matching collections/Orders.ts read access. Nothing in the codebase documents
    // staff being entitled to read orders, so this does not widen that policy. See the report.
    const isAdmin = user?.role === "admin";
    if (!isOwner && !isAdmin) return notFound();
  }

  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const shippingAddress = order.shippingAddress;
  const isPendingManualPayment =
    MANUAL_PAYMENT_METHODS.has(order.paymentMethod) && order.paymentStatus === "unpaid";

  const paymentInfo = isPendingManualPayment ? getManualPaymentInfo(order.paymentMethod) : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
      <div className="px-4 pt-28 pb-12 md:px-8 md:pt-36 lg:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Wayfinding Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Orders", href: "/account/orders" },
            { label: `Confirmation #${order.orderNumber || order.id}` },
          ]}
          className="self-start"
        />

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl md:text-4xl font-inter uppercase font-bold tracking-wider text-gray-900">
            Order Confirmed
          </h1>
          <p className="text-sm text-gray-500">
            Order{" "}
            <span className="text-gray-900 font-medium">#{order.orderNumber || order.id}</span> has
            been received.
          </p>
        </div>

        {isPendingManualPayment && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-amber-800 uppercase tracking-widest">
                Payment Pending Confirmation
              </h2>
              <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                {order.paymentMethod === "zelle" &&
                  "We've reserved your order. Please complete your Zelle payment for the total amount below and our team will confirm receipt shortly."}
                {order.paymentMethod === "venmo" &&
                  "We've reserved your order. Please complete your Venmo payment for the total amount below and our team will confirm receipt shortly."}
                {order.paymentMethod === "cashapp" &&
                  "We've reserved your order. Please complete your Cash App payment for the total amount below and our team will confirm receipt shortly."}
                {order.paymentMethod === "amex" &&
                  "We've reserved your order. Our team will reach out with instructions to complete your American Express payment."}
                {order.paymentMethod === "circoflows" &&
                  "Your order has been created and is awaiting confirmation from CircoFlows. We'll update your order status once payment clears."}
                {order.paymentMethod === "stripe_link" &&
                  "A secure payment link has been generated for this order. Please check your email to complete payment."}
              </p>
              {paymentInfo && (
                <div className="mt-4 flex flex-col items-start gap-2">
                  {paymentInfo.qrPath && (
                    <div className="rounded-lg bg-white p-3">
                      {/* Unoptimised: the QR must reach the scanner exactly as generated. Any
                          re-encoding or resampling risks corrupting the modules. */}
                      <Image
                        src={paymentInfo.qrPath}
                        alt={`${paymentInfo.label} payment QR code for Amino Based`}
                        width={200}
                        height={200}
                        unoptimized
                        className="block h-[200px] w-[200px]"
                      />
                      <p className="mt-2 text-[11px] text-amber-700">
                        Scan with your banking app to open {paymentInfo.label}
                      </p>
                    </div>
                  )}
                  {paymentInfo.recipient ? (
                    <p className="text-xs text-amber-800">
                      Send to: <strong>{paymentInfo.recipient}</strong>
                    </p>
                  ) : (
                    <p className="text-xs text-amber-800">
                      {paymentInfo.qrPath
                        ? `If the QR code above will not scan, contact us and we will send your ${paymentInfo.label} payment details.`
                        : `Please contact us before sending payment and we will confirm the ${paymentInfo.label} details for your order.`}
                    </p>
                  )}
                  <p className="text-xs text-amber-700">
                    Send <strong>${Number(order.total || 0).toFixed(2)}</strong> and include order{" "}
                    <strong>#{order.orderNumber || order.id}</strong> in the payment note.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Items
          </h2>
          <div className="flex flex-col gap-5">
            {items.length > 0 ? (
              items.map((item, idx) => {
                const product =
                  typeof item.product === "object" && item.product !== null ? item.product : null;
                const title = product?.name || item.variantTitle || "Product";
                const price = Number(item.price || 0);
                const quantity = Number(item.quantity || 1);
                return (
                  <div key={item.id || idx} className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{title}</span>
                      {item.variantTitle && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                          {item.variantTitle}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 mt-1">Qty {quantity}</span>
                    </div>
                    <span className="text-sm font-light text-gray-900 shrink-0">
                      ${(price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No items recorded.</p>
            )}
          </div>
        </div>

        {shippingAddress?.line1 && (
          <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-black/10 pb-4">
              Shipping Address
            </h2>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>{shippingAddress.line1}</span>
              {shippingAddress.line2 && <span>{shippingAddress.line2}</span>}
              <span>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              </span>
              <span>{shippingAddress.country}</span>
            </div>
          </div>
        )}

        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6 flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-black/10 pb-4 mb-1">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${Number(order.subtotal || 0).toFixed(2)}</span>
          </div>
          {!!order.discountTotal && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount</span>
              <span>-${Number(order.discountTotal).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span>{order.shippingTotal ? `$${Number(order.shippingTotal).toFixed(2)}` : "Free"}</span>
          </div>
          {!!order.feeTotal && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Fees</span>
              <span>${Number(order.feeTotal).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 mt-1 border-t border-black/10 text-gray-900 font-medium">
            <span className="text-sm">Total</span>
            <span className="text-2xl font-light">${Number(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/shop"
          className="w-fit mx-auto px-8 py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
      </div>

      <Footer />
    </div>
  );
}
