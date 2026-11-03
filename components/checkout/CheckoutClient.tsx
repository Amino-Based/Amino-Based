"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, Loader2, Lock, Tag, Truck, X } from "lucide-react";

import { useCartStore, useCartSubtotal } from "@/lib/cart/store";
import { DEFAULT_COUNTRY } from "@/lib/shipping/constants";
import {
  createPayloadOrder,
  getActiveProcessingFees,
  getShippingMethods,
  verifyCoupon,
  type CreateOrderInput,
  type PaymentMethodOption,
  type ProcessingFeeOption,
  type ShippingMethodOption,
} from "@/app/checkout/actions";
import StripeCheckoutForm from "@/components/checkout/StripeCheckoutForm";
import Footer from "@/components/Footer";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const addressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "ZIP / postal code is required"),
  country: z.string().min(1, "Country is required"),
});

// Unlike addressSchema.partial(), this doesn't re-run the min(1) checks on omitted
// fields — those default to "" (not undefined) when "same as shipping" is checked,
// and .partial() only skips validation for undefined, not for a present empty string.
// Actual required-ness when billing differs from shipping is enforced in superRefine below.
const billingAddressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

const checkoutSchema = z
  .object({
    guestEmail: z.email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(7, "Enter a valid phone number"),
    shippingAddress: addressSchema,
    billingSameAsShipping: z.boolean(),
    billingAddress: billingAddressSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.billingSameAsShipping) {
      const fields: Array<keyof typeof data.billingAddress> = [
        "line1",
        "city",
        "state",
        "postalCode",
        "country",
      ];
      for (const field of fields) {
        if (!data.billingAddress?.[field]) {
          ctx.addIssue({
            code: "custom",
            message: "This field is required",
            path: ["billingAddress", field],
          });
        }
      }
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const PAYMENT_METHODS: Array<{ value: PaymentMethodOption; label: string; description: string }> = [
  { value: "zelle", label: "Zelle", description: "Order held pending payment confirmation" },
  { value: "venmo", label: "Venmo", description: "Order held pending payment confirmation" },
  { value: "cashapp", label: "Cash App", description: "Order held pending payment confirmation" },
  // Credit/Debit Card (Stripe), American Express, and CircoFlows are hidden for now —
  // re-add entries here once those payment methods are ready to go live.
];

const inputClass =
  "font-inter w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const labelClass = "text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block";
const errorClass = "text-xs text-red-500 mt-1";
const cardClass = "bg-white border border-black/5 rounded-2xl p-6 shadow-sm";

export default function CheckoutClient({ onOrderPlaced }: { onOrderPlaced?: () => void }) {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartSubtotal();

  const [step, setStep] = useState<"details" | "payment">("details");
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodOption[]>([]);
  const [selectedMethodName, setSelectedMethodName] = useState<string | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(true);

  const [fees, setFees] = useState<ProcessingFeeOption[]>([]);
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    freeShipping: boolean;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>("zelle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guestEmail: session?.user?.email || "",
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      phone: "",
      shippingAddress: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: DEFAULT_COUNTRY,
      },
      billingSameAsShipping: true,
      billingAddress: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: DEFAULT_COUNTRY,
      },
    },
  });

  const billingSameAsShipping = watch("billingSameAsShipping");
  const shippingCountry = watch("shippingAddress.country") || DEFAULT_COUNTRY;

  // Fetch shipping methods whenever destination country or subtotal changes.
  useEffect(() => {
    let cancelled = false;
    setIsLoadingShipping(true);
    getShippingMethods(shippingCountry, subtotal)
      .then((methods) => {
        if (cancelled) return;
        setShippingMethods(methods);
        setSelectedMethodName((current) => {
          if (current && methods.some((m) => m.method === current)) return current;
          return methods[0]?.method ?? null;
        });
      })
      .catch(() => {
        if (!cancelled) setShippingMethods([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingShipping(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingCountry, subtotal]);

  // Fetch processing fees once on mount.
  useEffect(() => {
    getActiveProcessingFees()
      .then(setFees)
      .catch(() => setFees([]));
  }, []);

  const selectedShippingMethod = useMemo(
    () => shippingMethods.find((m) => m.method === selectedMethodName) ?? shippingMethods[0] ?? null,
    [shippingMethods, selectedMethodName]
  );

  const discount = appliedCoupon?.discount ?? 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const shippingCost = appliedCoupon?.freeShipping ? 0 : selectedShippingMethod?.price ?? 0;

  const mandatoryFees = fees.filter((f) => !f.isOptional);
  const optionalFees = fees.filter((f) => f.isOptional);

  function feeAmount(fee: ProcessingFeeOption): number {
    return fee.type === "percentage" ? (subtotalAfterDiscount * fee.amount) / 100 : fee.amount;
  }

  const mandatoryFeeTotal = mandatoryFees.reduce((sum, f) => sum + feeAmount(f), 0);
  const optionalFeeTotal = optionalFees
    .filter((f) => selectedFeeIds.includes(f.id))
    .reduce((sum, f) => sum + feeAmount(f), 0);
  const feeTotal = mandatoryFeeTotal + optionalFeeTotal;

  const total = Math.max(0, subtotalAfterDiscount + shippingCost + feeTotal);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponError(null);
    try {
      const result = await verifyCoupon(couponInput, subtotal);
      if (result.valid) {
        setAppliedCoupon({ code: result.code, discount: result.discount, freeShipping: result.freeShipping });
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(result.message);
      }
    } catch {
      setCouponError("Could not verify coupon. Please try again.");
    } finally {
      setIsVerifyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  function toggleOptionalFee(id: string) {
    setSelectedFeeIds((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  }

  function buildOrderInput(formData: CheckoutFormValues): Omit<CreateOrderInput, "paymentMethod"> {
    const shippingAddress = formData.shippingAddress;
    const billingAddress = formData.billingSameAsShipping
      ? formData.shippingAddress
      : {
          line1: formData.billingAddress?.line1 || "",
          line2: formData.billingAddress?.line2 || "",
          city: formData.billingAddress?.city || "",
          state: formData.billingAddress?.state || "",
          postalCode: formData.billingAddress?.postalCode || "",
          country: formData.billingAddress?.country || DEFAULT_COUNTRY,
        };

    return {
      items: useCartStore.getState().items.map((line) => ({
        productId: line.productId,
        variantSku: line.variantSku,
        variantTitle: line.variantTitle,
        quantity: line.quantity,
        priceSnapshot: line.priceSnapshot,
        productSnapshot: line.product,
      })),
      shippingAddress,
      billingAddress,
      shippingMethod: {
        method: selectedShippingMethod?.method || "Standard Shipping",
        price: shippingCost,
      },
      couponCode: appliedCoupon?.code || null,
      selectedFeeIds,
      guestEmail: formData.guestEmail,
      userId: session?.user?.id ?? null,
      customerFirstName: formData.firstName,
      customerLastName: formData.lastName,
      customerPhone: formData.phone,
    };
  }

  const onPlaceManualOrder = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const orderInput = buildOrderInput(formData);
      const result = await createPayloadOrder({ ...orderInput, paymentMethod });
      if (!result.ok) {
        // Refused before anything was created or reserved, so the customer can safely adjust and retry.
        setSubmitError(result.message);
        setIsSubmitting(false);
        return;
      }
      onOrderPlaced?.();
      useCartStore.getState().clear();
      router.push(`/order-confirmation/${result.orderId}?t=${result.accessToken}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      setSubmitError("Something went wrong while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  });

  const [pendingOrderInput, setPendingOrderInput] = useState<Omit<CreateOrderInput, "paymentMethod"> | null>(
    null
  );

  const onContinueToPayment = handleSubmit((formData) => {
    setSubmitError(null);
    if (paymentMethod !== "stripe") {
      void onPlaceManualOrder();
      return;
    }
    setPendingOrderInput(buildOrderInput(formData));
    setStep("payment");
  });

  if (step === "payment" && paymentMethod === "stripe" && pendingOrderInput) {
    if (!stripePromise) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex items-center justify-center px-4 pt-24">
          <div className={cardClass + " max-w-md text-center"}>
            <p className="text-sm text-gray-500">
              Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
            </p>
          </div>

          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
        <div className="px-4 pt-28 pb-10 md:px-8 md:pt-36 lg:px-12">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <button
              onClick={() => setStep("details")}
              className="w-fit flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors bg-black/5 border border-black/10 px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <h1 className="text-2xl md:text-3xl font-inter uppercase font-bold tracking-wider">
              Payment
            </h1>

            <div className={cardClass}>
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: Math.max(50, Math.round(total * 100)),
                  currency: "usd",
                  appearance: { theme: "stripe" },
                }}
              >
                <StripeCheckoutForm amount={total} orderInput={pendingOrderInput} onOrderPlaced={onOrderPlaced} />
              </Elements>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
      <div className="px-4 pt-28 pb-10 md:px-8 md:pt-36 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <h1 className="text-2xl md:text-4xl font-inter uppercase font-bold tracking-wider">
          Secure Checkout
        </h1>

        <form
          onSubmit={onContinueToPayment}
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start"
        >
          <div className="flex flex-col gap-6">
            {/* Contact + shipping address */}
            <section className={cardClass}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4">
                Contact &amp; Shipping
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} type="email" placeholder="you@example.com" {...register("guestEmail")} />
                  {errors.guestEmail && <p className={errorClass}>{errors.guestEmail.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>First Name</label>
                  <input className={inputClass} {...register("firstName")} />
                  {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input className={inputClass} {...register("lastName")} />
                  {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} type="tel" placeholder="+1 555 555 5555" {...register("phone")} />
                  {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input className={inputClass} {...register("shippingAddress.country")} />
                  {errors.shippingAddress?.country && (
                    <p className={errorClass}>{errors.shippingAddress.country.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 1</label>
                  <input className={inputClass} {...register("shippingAddress.line1")} />
                  {errors.shippingAddress?.line1 && (
                    <p className={errorClass}>{errors.shippingAddress.line1.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 2 (optional)</label>
                  <input className={inputClass} {...register("shippingAddress.line2")} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input className={inputClass} {...register("shippingAddress.city")} />
                  {errors.shippingAddress?.city && (
                    <p className={errorClass}>{errors.shippingAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input className={inputClass} {...register("shippingAddress.state")} />
                  {errors.shippingAddress?.state && (
                    <p className={errorClass}>{errors.shippingAddress.state.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>ZIP / Postal Code</label>
                  <input className={inputClass} {...register("shippingAddress.postalCode")} />
                  {errors.shippingAddress?.postalCode && (
                    <p className={errorClass}>{errors.shippingAddress.postalCode.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Billing address */}
            <section className={cardClass}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4">
                Billing Address
              </h2>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-4 cursor-pointer">
                <input type="checkbox" className="accent-indigo-500" {...register("billingSameAsShipping")} />
                Same as shipping address
              </label>
              {!billingSameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Address Line 1</label>
                    <input className={inputClass} {...register("billingAddress.line1")} />
                    {errors.billingAddress?.line1 && (
                      <p className={errorClass}>{errors.billingAddress.line1.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Address Line 2 (optional)</label>
                    <input className={inputClass} {...register("billingAddress.line2")} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input className={inputClass} {...register("billingAddress.city")} />
                    {errors.billingAddress?.city && (
                      <p className={errorClass}>{errors.billingAddress.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input className={inputClass} {...register("billingAddress.state")} />
                    {errors.billingAddress?.state && (
                      <p className={errorClass}>{errors.billingAddress.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>ZIP / Postal Code</label>
                    <input className={inputClass} {...register("billingAddress.postalCode")} />
                    {errors.billingAddress?.postalCode && (
                      <p className={errorClass}>{errors.billingAddress.postalCode.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input className={inputClass} {...register("billingAddress.country")} />
                    {errors.billingAddress?.country && (
                      <p className={errorClass}>{errors.billingAddress.country.message}</p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Shipping method */}
            <section className={cardClass}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Method
              </h2>
              {isLoadingShipping ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading shipping options…
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {shippingMethods.map((method) => {
                    const isFree = appliedCoupon?.freeShipping && !method.isInternational;
                    const displayPrice = isFree ? 0 : method.price;
                    return (
                      <label
                        key={method.method}
                        className={`flex items-center justify-between gap-4 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                          selectedMethodName === method.method
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-black/10 hover:border-black/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            className="accent-indigo-500"
                            checked={selectedMethodName === method.method}
                            onChange={() => setSelectedMethodName(method.method)}
                          />
                          <div>
                            <p className="text-sm text-gray-900">{method.method}</p>
                            {method.estimatedDays && (
                              <p className="text-xs text-gray-500">
                                Est. {method.estimatedDays} day{method.estimatedDays === 1 ? "" : "s"}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-light text-gray-900">
                          {displayPrice === 0 ? "Free" : `$${displayPrice.toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Coupon */}
            <section className={cardClass}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Coupon Code
              </h2>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <span className="text-sm text-emerald-700">
                    {appliedCoupon.code} applied — ${appliedCoupon.discount.toFixed(2)} off
                  </span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-emerald-700 hover:text-emerald-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    className={inputClass}
                    placeholder="Enter code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isVerifyingCoupon}
                    className="px-5 py-3 rounded-lg bg-gray-900 hover:bg-gray-700 border border-black/10 text-sm font-medium text-white whitespace-nowrap transition-colors disabled:opacity-50"
                  >
                    {isVerifyingCoupon ? "Checking…" : "Apply"}
                  </button>
                </div>
              )}
              {couponError && <p className={errorClass}>{couponError}</p>}
            </section>

            {/* Optional processing fees */}
            {optionalFees.length > 0 && (
              <section className={cardClass}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4">
                  Optional Add-ons
                </h2>
                <div className="flex flex-col gap-3">
                  {optionalFees.map((fee) => (
                    <label key={fee.id} className="flex items-center justify-between gap-4 cursor-pointer">
                      <span className="flex items-center gap-3 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          className="accent-indigo-500"
                          checked={selectedFeeIds.includes(fee.id)}
                          onChange={() => toggleOptionalFee(fee.id)}
                        />
                        {fee.name}
                      </span>
                      <span className="text-sm text-gray-900">
                        {fee.type === "percentage" ? `${fee.amount}%` : `$${fee.amount.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Payment method */}
            <section className={cardClass}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-5 border-b border-black/10 pb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Payment Method
              </h2>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center justify-between gap-4 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                      paymentMethod === pm.value
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        className="accent-indigo-500"
                        checked={paymentMethod === pm.value}
                        onChange={() => setPaymentMethod(pm.value)}
                      />
                      <div>
                        <p className="text-sm text-gray-900">{pm.label}</p>
                        <p className="text-xs text-gray-500">{pm.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

            </section>

            {submitError && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {submitError}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className={cardClass + " lg:sticky lg:top-8 flex flex-col gap-4"}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-black/10 pb-4">
              Order Summary
            </h2>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
              {items.map((line) => (
                <div key={line.lineId} className="flex justify-between gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-900 uppercase font-semibold">{line.product.name}</span>
                    {line.variantTitle && <span className="text-xs text-gray-500">{line.variantTitle}</span>}
                    <span className="text-xs text-gray-500">Qty {line.quantity}</span>
                  </div>
                  <span className="text-white shrink-0">${(line.priceSnapshot * line.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-black/10 pt-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {feeTotal > 0 && (
                <div className="flex justify-between text-gray-400">
                  <span>Fees</span>
                  <span>${feeTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-black/10 text-gray-900 font-medium">
                <span className="text-sm">Total</span>
                <span className="text-2xl font-light">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest transition-all mt-2"
            >
              {isSubmitting
                ? "Placing Order…"
                : paymentMethod === "stripe"
                ? "Continue to Payment"
                : "Place Order"}
            </button>
          </div>
        </form>
      </div>
      </div>

      <Footer />
    </div>
  );
}
