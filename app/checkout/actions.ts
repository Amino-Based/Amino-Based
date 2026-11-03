"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import Stripe from "stripe";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_COUNTRY } from "@/lib/shipping/constants";
import { getNextOrderNumber } from "@/lib/orders/counter";
import { findProductByAnyId } from "@/lib/orders/findProduct";
import { reserveStock, releaseStock, type StockLine } from "@/lib/orders/inventory";
import { reserveCouponUsage, releaseCouponUsage } from "@/lib/orders/coupons";
import { getEffectivePrice } from "@/lib/types/shop";
import { signOrderAccessToken } from "@/lib/orders/orderAccessToken";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ShippingMethodOption = {
  method: string;
  price: number;
  estimatedDays?: number | null;
  isInternational?: boolean | null;
};

export type ProcessingFeeOption = {
  id: string;
  name: string;
  amount: number;
  type: "fixed_amount" | "percentage";
  isOptional: boolean;
};

export type CouponVerification =
  | { valid: true; code: string; discount: number; freeShipping: boolean; type: string }
  | { valid: false; message: string };

export type AddressInput = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutItemInput = {
  productId: string | number;
  variantSku?: string;
  variantTitle?: string;
  quantity: number;
  priceSnapshot: number;
  productSnapshot?: unknown;
};

export type PaymentMethodOption =
  | "stripe"
  | "zelle"
  | "venmo"
  | "cashapp"
  | "amex"
  | "circoflows"
  | "stripe_link";

export type CreateOrderInput = {
  items: CheckoutItemInput[];
  shippingAddress: AddressInput;
  billingAddress: AddressInput;
  shippingMethod: { method: string; price: number };
  couponCode?: string | null;
  selectedFeeIds?: string[];
  paymentMethod: PaymentMethodOption;
  guestEmail?: string | null;
  userId?: string | number | null;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
};

// ---------------------------------------------------------------------------
// Shipping
// ---------------------------------------------------------------------------

const FALLBACK_DOMESTIC_METHODS: ShippingMethodOption[] = [
  { method: "Standard Shipping", price: 25, estimatedDays: 5, isInternational: false },
  { method: "Express Shipping", price: 50, estimatedDays: 2, isInternational: false },
];

const FALLBACK_INTERNATIONAL_METHOD: ShippingMethodOption = {
  method: "International Shipping",
  price: 50,
  estimatedDays: 14,
  isInternational: true,
};

export async function getShippingMethods(
  country: string,
  subtotal: number
): Promise<ShippingMethodOption[]> {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "shippingzones",
    limit: 1,
    overrideAccess: true,
  });

  const zone = docs[0] as any;
  const rawMethods: any[] = Array.isArray(zone?.methods) && zone.methods.length > 0 ? zone.methods : [];

  const allMethods = rawMethods.length > 0
    ? rawMethods.map((m) => ({
        method: String(m.method),
        price: Number(m.price) || 0,
        estimatedDays: m.estimatedDays ?? null,
        isInternational: !!m.isInternational,
        minOrderAmount: typeof m.minOrderAmount === "number" ? m.minOrderAmount : null,
      }))
    : [
        ...FALLBACK_DOMESTIC_METHODS.map((m) => ({ ...m, minOrderAmount: null })),
        { ...FALLBACK_INTERNATIONAL_METHOD, minOrderAmount: null },
      ];

  // International: a single method entirely replaces the domestic set and ignores
  // minOrderAmount / free-shipping-threshold rules.
  if (country && country !== DEFAULT_COUNTRY) {
    const intl = allMethods.find((m) => m.isInternational);
    const resolved = intl ?? FALLBACK_INTERNATIONAL_METHOD;
    return [
      {
        method: resolved.method,
        price: resolved.price,
        estimatedDays: resolved.estimatedDays,
        isInternational: true,
      },
    ];
  }

  const domestic = allMethods.filter((m) => !m.isInternational);
  const visible = domestic.filter((m) => !m.minOrderAmount || subtotal >= m.minOrderAmount);
  const pool = visible.length > 0 ? visible : domestic;

  if (pool.length === 0) {
    return [FALLBACK_DOMESTIC_METHODS[0]];
  }

  // Waive the price of the cheapest ("standard") domestic method once the free
  // shipping subtotal threshold has been met.
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    const cheapest = pool.reduce((a, b) => (b.price < a.price ? b : a), pool[0]);
    return pool.map((m) => ({
      method: m.method,
      price: m.method === cheapest.method ? 0 : m.price,
      estimatedDays: m.estimatedDays,
      isInternational: m.isInternational,
    }));
  }

  return pool.map((m) => ({
    method: m.method,
    price: m.price,
    estimatedDays: m.estimatedDays,
    isInternational: m.isInternational,
  }));
}

// ---------------------------------------------------------------------------
// Processing fees
// ---------------------------------------------------------------------------

export async function getActiveProcessingFees(): Promise<ProcessingFeeOption[]> {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "processing-fees",
    where: { isActive: { equals: true } },
    limit: 100,
    overrideAccess: true,
  });

  return (docs as any[]).map((fee) => ({
    id: String(fee.id),
    name: String(fee.name),
    amount: Number(fee.amount) || 0,
    type: fee.type === "percentage" ? "percentage" : "fixed_amount",
    isOptional: !!fee.isOptional,
  }));
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export async function verifyCoupon(code: string, subtotal: number): Promise<CouponVerification> {
  const normalized = (code || "").trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: "Please enter a coupon code." };
  }

  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "coupons",
    where: { code: { equals: normalized } },
    limit: 1,
    overrideAccess: true,
  });

  const coupon = docs[0] as any;
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." };
  }
  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is no longer active." };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, message: "This coupon has expired." };
  }
  if (typeof coupon.minSpend === "number" && coupon.minSpend > 0 && subtotal < coupon.minSpend) {
    return {
      valid: false,
      message: `This coupon requires a minimum order of $${coupon.minSpend.toFixed(2)}.`,
    };
  }
  if (
    typeof coupon.usageLimit === "number" &&
    coupon.usageLimit > 0 &&
    (Number(coupon.usageCount) || 0) >= coupon.usageLimit
  ) {
    return { valid: false, message: "This coupon has reached its usage limit." };
  }

  const freeShipping = !!coupon.freeShipping || coupon.type === "free_shipping";
  let discount = 0;

  switch (coupon.type) {
    case "percentage":
      discount = (subtotal * (Number(coupon.value) || 0)) / 100;
      break;
    case "fixed_amount":
      discount = Number(coupon.value) || 0;
      break;
    case "store_credit":
      discount = Number(coupon.remainingBalance ?? coupon.storeCreditAmount) || 0;
      break;
    default:
      discount = 0;
  }

  discount = Math.max(0, Math.min(discount, subtotal));

  return { valid: true, code: normalized, discount, freeShipping, type: String(coupon.type) };
}

// ---------------------------------------------------------------------------
// Order creation
// ---------------------------------------------------------------------------

/**
 * Either the created order, or an explicit, user-actionable refusal. A refusal is returned rather
 * than thrown so checkout can show a specific message instead of a generic failure. Every refusal
 * is produced before any stock or coupon is reserved, so no order exists and nothing needs undoing.
 */
export type CreateOrderResult =
  | { ok: true; orderId: string; orderNumber: string; total: number; accessToken: string }
  | {
      ok: false;
      reason: "shipping_options_changed";
      message: string;
      availableMethods: ShippingMethodOption[];
    };
// ---------------------------------------------------------------------------

export async function createPayloadOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    return await createPayloadOrderImpl(input);
  } catch (err) {
    // Next masks server-action errors in production; log the real cause so it shows in Vercel logs.
    console.error("createPayloadOrder failed:", {
      paymentMethod: input.paymentMethod,
      itemCount: input.items?.length,
      productIds: input.items?.map((i) => i.productId),
      message: err instanceof Error ? err.message : String(err),
      data: (err as any)?.data,
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }
}

async function createPayloadOrderImpl(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const payload = await getPayload({ config });

  // Never trust item prices from the client — the cart is plain localStorage state and
  // trivially editable. Re-fetch each product (and matching variant, if any) from the
  // database and price every line item from that, ignoring `item.priceSnapshot` entirely.
  const verifiedItems = await Promise.all(
    input.items.map(async (item) => {
      const product = await findProductByAnyId(payload, item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} no longer exists.`);
      }

      let unitPrice = getEffectivePrice(product.price as number, product.salePrice as number | undefined);
      if (product.hasVariants && item.variantSku) {
        const variant = (product.variants as any[] | undefined)?.find((v) => v.sku === item.variantSku);
        if (!variant) {
          throw new Error(`Variant ${item.variantSku} not found on product ${product.name}.`);
        }
        unitPrice = getEffectivePrice(variant.price, variant.salePrice);
      }

      return { ...item, priceSnapshot: unitPrice, productId: product.id };
    })
  );

  const subtotal = verifiedItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );

  let discountTotal = 0;
  let freeShipping = false;
  // Only a coupon that actually verified is recorded/counted; an invalid code is silently ignored.
  let appliedCouponCode: string | null = null;

  if (input.couponCode) {
    const verification = await verifyCoupon(input.couponCode, subtotal);
    if (verification.valid) {
      discountTotal = verification.discount;
      freeShipping = verification.freeShipping;
      appliedCouponCode = verification.code;
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountTotal);
  // Never trust the client's shipping price. It arrives in the same editable payload as the item
  // prices, which are already re-derived from the database above; shipping was the one money field
  // still taken on trust, so "Express Shipping" at price 0 was accepted as-is. Re-resolve the
  // quoted method by name against the authoritative list for this destination and price it there.
  const requestedShippingMethod = String(input.shippingMethod?.method ?? "");
  const availableShippingMethods = await getShippingMethods(
    input.shippingAddress?.country || DEFAULT_COUNTRY,
    subtotal
  );
  const resolvedShippingMethod = availableShippingMethods.find(
    (m) => m.method === requestedShippingMethod
  );
  if (!resolvedShippingMethod) {
    // The quoted method is gone — typically a CMS price or zone change between page load and submit
    // moved the order across a free-shipping or minimum-order threshold. Refuse explicitly instead of
    // throwing, and never substitute a different or dearer method without the customer agreeing.
    return {
      ok: false,
      reason: "shipping_options_changed",
      message:
        "Shipping options for your address have changed since you started checkout. Please review the shipping choices and place your order again.",
      availableMethods: availableShippingMethods,
    };
  }
  // Pulled out as plain values: the narrowing above does not reach into the nested insertOrder closure.
  const shippingMethodName: string = resolvedShippingMethod.method;
  const shippingTotal = freeShipping ? 0 : Math.max(0, Number(resolvedShippingMethod.price) || 0);

  const activeFees = await getActiveProcessingFees();
  const appliedFees: Array<{
    feeId: string;
    feeName: string;
    amount: number;
    feeType: "fixed_amount" | "percentage";
    percentage: number | null;
  }> = [];
  let feeTotal = 0;

  for (const fee of activeFees) {
    const shouldApply = !fee.isOptional || (input.selectedFeeIds ?? []).includes(fee.id);
    if (!shouldApply) continue;
    const amount = fee.type === "percentage" ? subtotalAfterDiscount * (fee.amount / 100) : fee.amount;
    feeTotal += amount;
    appliedFees.push({
      feeId: fee.id,
      feeName: fee.name,
      amount,
      feeType: fee.type,
      percentage: fee.type === "percentage" ? fee.amount : null,
    });
  }

  const taxTotal = 0;
  const total = Math.max(0, subtotalAfterDiscount + shippingTotal + feeTotal + taxTotal);

  // Hold the stock and the coupon use *before* creating the order. Both are atomic, so concurrent
  // checkouts can't oversell or exceed a coupon's usage limit; they're rolled back if anything
  // below fails, and released again if the order is later cancelled or refunded.
  const stockLines: StockLine[] = verifiedItems.map((item) => ({
    productId: item.productId as number | string,
    variantSku: item.variantSku ?? null,
    quantity: Number(item.quantity) || 1,
  }));
  await reserveStock(
    payload,
    stockLines,
    Object.fromEntries(verifiedItems.map((i) => [String(i.productId), (i.productSnapshot as any)?.name || ""]))
  );

  let couponReserved = false;
  if (appliedCouponCode) {
    couponReserved = await reserveCouponUsage(payload, appliedCouponCode, discountTotal);
    if (!couponReserved) {
      await releaseStock(payload, stockLines).catch(() => {});
      throw new Error("This coupon has reached its usage limit.");
    }
  }

  try {
    return await insertOrder();
  } catch (err) {
    await releaseStock(payload, stockLines).catch((e) => console.error("Failed to release stock:", e));
    if (couponReserved && appliedCouponCode) {
      await releaseCouponUsage(payload, appliedCouponCode, discountTotal).catch(() => {});
    }
    throw err;
  }

  async function insertOrder(): Promise<CreateOrderResult> {
  const orderNumber = await getNextOrderNumber(payload);

  const orderItems = verifiedItems.map((item) => ({
    product: item.productId,
    variantTitle: item.variantTitle,
    variant: item.variantSku,
    price: item.priceSnapshot,
    quantity: item.quantity,
    productSnapshot: item.productSnapshot ?? null,
  }));

  const isGuest = !input.userId;

  const order: any = await payload.create({
    collection: "orders",
    data: {
      orderNumber,
      owner: isGuest ? undefined : input.userId,
      guestEmail: isGuest ? input.guestEmail || undefined : undefined,
      customerFirstName: input.customerFirstName,
      customerLastName: input.customerLastName,
      customerPhone: input.customerPhone,
      items: orderItems,
      shippingAddress: input.shippingAddress,
      billingAddress: input.billingAddress,
      status: "pending",
      paymentStatus: "unpaid",
      fulfillmentStatus: "unfulfilled",
      subtotal,
      discountTotal,
      shippingTotal,
      taxTotal,
      feeTotal,
      total,
      appliedFees,
      shippingMethod: shippingMethodName,
      paymentMethod: input.paymentMethod,
      couponCode: appliedCouponCode || undefined,
      orderSource: "web",
      isFinalized: false,
    } as any,
    overrideAccess: true,
  });

  // Capability token for the receipt page: order ids are sequential, so the confirmation route
  // cannot authorise on the id alone (guests have no session to check).
  return {
    ok: true,
    orderId: String(order.id),
    orderNumber,
    total,
    accessToken: signOrderAccessToken(order.id),
  };
  }
}

// ---------------------------------------------------------------------------
// Stripe
// ---------------------------------------------------------------------------

function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "");
}

export async function createPaymentIntent(
  _amountCents: number,
  orderId: string
): Promise<{ clientSecret: string | null }> {
  // The amount is never taken from the caller — it's a client-computed value and would let
  // someone charge themselves 50 cents for any order by editing it before this call. Always
  // charge the order's own server-computed `total` from the database instead.
  const payload = await getPayload({ config });
  const order = await payload
    .findByID({
      collection: "orders",
      id: isNaN(Number(orderId)) ? orderId : Number(orderId),
      overrideAccess: true,
    })
    .catch(() => null);
  if (!order) {
    throw new Error(`Order ${orderId} not found.`);
  }
  const amountCents = Math.round(Number(order.total) * 100);

  const stripe = getStripeClient();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.max(50, amountCents),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  return { clientSecret: paymentIntent.client_secret };
}

export async function syncPaymentStatus(
  paymentIntentId: string,
  orderId: string
): Promise<{ success: boolean; status?: string }> {
  const stripe = getStripeClient();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    return { success: false, status: paymentIntent.status };
  }

  // This is a public server action, so never trust the caller's pairing of intent and order:
  // the payment must have been created for this exact order and must cover its full total.
  // (Otherwise someone could pay for a cheap order and mark an expensive one as paid.)
  if (String(paymentIntent.metadata?.orderId ?? "") !== String(orderId)) {
    console.error(`syncPaymentStatus: intent ${paymentIntentId} does not belong to order ${orderId}`);
    return { success: false, status: "order_mismatch" };
  }

  const payload = await getPayload({ config });
  const id = (isNaN(Number(orderId)) ? orderId : Number(orderId)) as any;
  const order: any = await payload.findByID({ collection: "orders", id, overrideAccess: true }).catch(() => null);
  if (!order) return { success: false, status: "order_not_found" };

  const expectedCents = Math.max(50, Math.round(Number(order.total) * 100));
  if ((paymentIntent.amount_received ?? 0) < expectedCents) {
    console.error(`syncPaymentStatus: intent ${paymentIntentId} received less than order ${orderId} total`);
    return { success: false, status: "amount_mismatch" };
  }

  if (order.paymentStatus !== "captured") {
    // Order lifecycle hooks (Orders afterChange) finalize the order once it is marked captured.
    await payload.update({
      collection: "orders",
      id,
      data: { paymentStatus: "captured", status: "paid" } as any,
      overrideAccess: true,
    });
  }
  return { success: true, status: paymentIntent.status };
}
