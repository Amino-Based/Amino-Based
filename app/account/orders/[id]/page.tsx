import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { ArrowLeft, Package, MapPin, Truck, Receipt } from "lucide-react";
import { safeProductImageUrl } from "@/lib/products/productImage";

export const dynamic = "force-dynamic";

const STATUS_STEPS = ["pending", "paid", "shipped", "completed"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Placed",
  paid: "Processing",
  shipped: "Shipped",
  completed: "Delivered",
};

const BADGE_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-amber-50 text-amber-600",
  fulfilled: "bg-blue-50 text-blue-600",
  shipped: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  refunded: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getPayloadUser();
  if (!user) redirect(`/login?redirect=/account/orders/${id}`);

  const payload = await getPayload({ config });

  let order: any = null;
  try {
    const { docs } = await payload.find({
      collection: "orders",
      where: { orderNumber: { equals: id } },
      depth: 2,
      overrideAccess: true,
    });

    if (docs.length > 0) {
      order = docs[0];
    } else {
      const numericId = Number(id);
      order = await payload.findByID({
        collection: "orders",
        id: Number.isNaN(numericId) ? id : numericId,
        depth: 2,
        overrideAccess: true,
      });
    }
  } catch {
    return notFound();
  }

  if (!order) return notFound();

  const ownerId =
    typeof order.owner === "object" && order.owner !== null
      ? order.owner.id
      : order.owner;
  if (String(ownerId) !== String(user.id) && order.guestEmail !== user.email) {
    return notFound();
  }

  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const shippingAddress = order.shippingAddress;
  const billingAddress = order.billingAddress;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex flex-col gap-4">
        <Link
          href="/account/orders"
          className="font-inter w-fit flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 border border-black/5 px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-inter text-2xl md:text-4xl uppercase font-bold tracking-wider text-gray-900">
              Order #{order.orderNumber || order.id}
            </h1>
            <p className="font-inter text-sm text-gray-500 mt-2">Placed on {formattedDate}</p>
          </div>
          <span
            className={`font-inter w-fit px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              BADGE_STYLES[order.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex flex-col gap-8 flex-1 w-full">
          {/* Tracking Timeline */}
          {!isCancelled && (
            <div className="bg-white border border-black/5 p-4 sm:p-8 rounded-3xl shadow-sm overflow-hidden">
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-900 mb-8 border-b border-black/5 pb-4">
                Tracking Status
              </h2>
              <div className="relative flex justify-between px-1 sm:px-4">
                <div className="absolute top-3 sm:top-4 left-4 right-4 h-[2px] bg-gray-100 -z-10 rounded-full" />
                <div
                  className="absolute top-3 sm:top-4 left-4 h-[2px] bg-indigo-600 -z-10 transition-all duration-1000 ease-out rounded-full"
                  style={{
                    width: `calc(${(Math.max(currentStepIndex, 0) / (STATUS_STEPS.length - 1)) * 100}% - 2rem)`,
                  }}
                />
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 sm:gap-3 bg-white px-0.5 sm:px-2">
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                          isCompleted ? "bg-indigo-600 text-white" : "bg-white border-2 border-gray-100 text-gray-300"
                        }`}
                      >
                        {isCompleted && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />}
                      </div>
                      <span
                        className={`font-inter text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap ${
                          isCurrent ? "text-gray-900" : isCompleted ? "text-gray-500" : "text-gray-300"
                        }`}
                      >
                        {STATUS_LABELS[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              This order has been cancelled.
            </div>
          )}

          {/* Tracking Link */}
          {order.trackingLink ? (
            <div className="bg-emerald-50 border border-emerald-100 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-inter text-lg font-bold text-emerald-800 tracking-tight">Track Your Package</h2>
                <p className="font-inter text-sm text-emerald-700/80">
                  Your order is on its way. Use the tracking link to monitor your shipment.
                </p>
              </div>
              <a
                href={order.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors shadow-sm whitespace-nowrap"
              >
                Track Package
              </a>
            </div>
          ) : (
            <div className="bg-gray-50/50 border border-dashed border-black/10 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-400 shadow-sm">
                <Package size={16} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-inter text-sm font-bold text-gray-800">Tracking Information Pending</h3>
                <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                  Your tracking link will be available here automatically once your product has been shipped.
                </p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white border border-black/5 p-4 sm:p-8 rounded-3xl shadow-sm">
            <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-black/5 pb-4">
              Items Ordered
            </h2>
            <div className="flex flex-col gap-5">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const product = typeof item.product === "object" && item.product !== null ? item.product : null;
                  const title = product?.name || item.variantTitle || "Product";
                  const price = Number(item.price || 0);
                  const quantity = Number(item.quantity || 1);
                  // TEMPORARY: local media storage isn't reachable on Vercel yet (R2 not
                  // connected), so serve the shared placeholder instead of the stored URL.
                  // Was "/product-card-image.png" — a Prime Time Bio Labs vial shown for every line item.
                  const imageUrl = product
                    ? safeProductImageUrl((product as any)?.images?.[0]?.image?.url)
                    : null;
                  return (
                    <div key={item.id || idx} className="flex items-center gap-3 sm:gap-6">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                        <div className="relative w-full h-full bg-gray-50 border border-black/5 rounded-2xl overflow-hidden flex items-center justify-center">
                          {imageUrl ? (
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                          {quantity}
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-inter text-sm sm:text-lg font-bold text-gray-900 tracking-tight line-clamp-2">
                          {title}
                        </span>
                        {item.variantTitle && (
                          <span className="font-inter text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                            {item.variantTitle}
                          </span>
                        )}
                      </div>

                      <span className="font-inter text-base sm:text-xl font-bold text-gray-900 shrink-0 whitespace-nowrap">
                        ${(price * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="font-inter text-sm text-gray-500">No items recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 w-full lg:w-[340px] shrink-0">
          {shippingAddress?.line1 && (
            <div className="bg-white border border-black/5 p-5 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4 text-gray-900">
                <Truck size={16} />
                <h2 className="font-inter text-xs font-bold uppercase tracking-widest">Shipping Address</h2>
              </div>
              <div className="font-inter flex flex-col gap-1 text-sm text-gray-500 leading-relaxed">
                <span>{shippingAddress.line1}</span>
                {shippingAddress.line2 && <span>{shippingAddress.line2}</span>}
                <span>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </span>
                <span>{shippingAddress.country}</span>
              </div>
            </div>
          )}

          {billingAddress?.line1 && (
            <div className="bg-white border border-black/5 p-5 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4 text-gray-900">
                <MapPin size={16} />
                <h2 className="font-inter text-xs font-bold uppercase tracking-widest">Billing Address</h2>
              </div>
              <div className="font-inter flex flex-col gap-1 text-sm text-gray-500 leading-relaxed">
                <span>{billingAddress.line1}</span>
                {billingAddress.line2 && <span>{billingAddress.line2}</span>}
                <span>
                  {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
                </span>
                <span>{billingAddress.country}</span>
              </div>
            </div>
          )}

          <div className="bg-white border border-black/5 p-5 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-1 text-gray-900">
              <Receipt size={16} />
              <h2 className="font-inter text-xs font-bold uppercase tracking-widest">Order Summary</h2>
            </div>
            <div className="font-inter flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${Number(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {!!order.discountTotal && (
              <div className="font-inter flex justify-between text-sm text-emerald-600">
                <span>Discount</span>
                <span>-${Number(order.discountTotal).toFixed(2)}</span>
              </div>
            )}
            <div className="font-inter flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{order.shippingTotal ? `$${Number(order.shippingTotal).toFixed(2)}` : "Free"}</span>
            </div>
            <div className="font-inter flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>${Number(order.taxTotal || 0).toFixed(2)}</span>
            </div>
            <div className="font-inter flex justify-between items-center pt-3 mt-1 border-t border-black/5 text-gray-900 font-semibold">
              <span className="text-sm">Total</span>
              <span className="text-2xl font-bold">${Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
