"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, Loader2, Lock, Tag, Truck, X, ShieldCheck, Check } from "lucide-react";

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
import { safeProductImageUrl } from "@/lib/products/productImage";
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
  { value: "zelle", label: "Zelle", description: "Direct payment with instant confirmation" },
  { value: "venmo", label: "Venmo", description: "Quick mobile transfer to laboratory dispatch" },
  { value: "cashapp", label: "Cash App", description: "Secure $Cashtag transfer" },
];

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
  }, [shippingCountry, subtotal]);

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

  // Stripe Payment Step
  if (step === "payment" && paymentMethod === "stripe" && pendingOrderInput) {
    if (!stripePromise) {
      return (
        <div className="min-h-screen bg-[#F8F8F9] text-neutral-900 flex items-center justify-center px-4 pt-24">
          <div className="bg-white border border-neutral-200 p-8 max-w-md text-center shadow-xs">
            <p className="text-sm text-neutral-600">
              Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
            </p>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8F8F9] text-neutral-900">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 pt-28 pb-16 max-w-4xl mx-auto">
          <button
            onClick={() => setStep("details")}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Checkout Details
          </button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 mb-8">
            PAYMENT
          </h1>

          <div className="bg-white border border-neutral-200 p-6 sm:p-10 shadow-xs">
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
        <Footer />
      </div>
    );
  }

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8F8F9] text-neutral-900 antialiased">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 md:pt-36 pb-20 max-w-7xl mx-auto">
        {/* EDITORIAL HEADER — Matches Reference Layout */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-neutral-900">
            CHECKOUT
          </h1>
        </div>

        <form
          onSubmit={onContinueToPayment}
          className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-10 lg:gap-14 items-start"
        >
          {/* ========================================================================= */}
          {/* LEFT COLUMN: INFORMATION, DELIVERY & PAYMENT                              */}
          {/* ========================================================================= */}
          <div className="flex flex-col gap-10 sm:gap-12">
            {/* 1. INFORMATION SECTION */}
            <section>
              <div className="flex items-baseline justify-between border-b border-neutral-200 pb-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                  Information
                </h2>
                {!session && (
                  <Link
                    href="/login?callbackUrl=/checkout"
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Already have an account? <span className="underline font-medium text-neutral-900">Log in</span>
                  </Link>
                )}
              </div>

              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("guestEmail")}
                    />
                    {errors.guestEmail && (
                      <p className="text-xs text-red-600 mt-1">{errors.guestEmail.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Country / Region"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("shippingAddress.country")}
                    />
                    {errors.shippingAddress?.country && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.country.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("shippingAddress.city")}
                    />
                    {errors.shippingAddress?.city && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.city.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Address line 1"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("shippingAddress.line1")}
                    />
                    {errors.shippingAddress?.line1 && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.line1.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit (optional)"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("shippingAddress.line2")}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="State / Province"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("shippingAddress.state")}
                    />
                    {errors.shippingAddress?.state && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.state.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Zip / Postal code"
                      className="w-full bg-transparent border-b border-neutral-300 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                      {...register("shippingAddress.postalCode")}
                    />
                    {errors.shippingAddress?.postalCode && (
                      <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.postalCode.message}</p>
                    )}
                  </div>
                </div>

                {/* Billing address checkbox */}
                <div className="mt-5 pt-3">
                  <label className="inline-flex items-center gap-2.5 text-xs text-neutral-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 accent-neutral-900"
                      {...register("billingSameAsShipping")}
                    />
                    <span>Billing address same as shipping</span>
                  </label>
                </div>

                {/* Billing Address Details if unchecked */}
                {!billingSameAsShipping && (
                  <div className="mt-6 p-5 border border-neutral-200 bg-white">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                      Billing Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Billing address"
                          className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          {...register("billingAddress.line1")}
                        />
                        {errors.billingAddress?.line1 && (
                          <p className="text-xs text-red-600 mt-1">{errors.billingAddress.line1.message}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Apartment, suite (optional)"
                          className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          {...register("billingAddress.line2")}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          {...register("billingAddress.city")}
                        />
                        {errors.billingAddress?.city && (
                          <p className="text-xs text-red-600 mt-1">{errors.billingAddress.city.message}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="State"
                          className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          {...register("billingAddress.state")}
                        />
                        {errors.billingAddress?.state && (
                          <p className="text-xs text-red-600 mt-1">{errors.billingAddress.state.message}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="ZIP / Postal code"
                          className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          {...register("billingAddress.postalCode")}
                        />
                        {errors.billingAddress?.postalCode && (
                          <p className="text-xs text-red-600 mt-1">{errors.billingAddress.postalCode.message}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Country"
                          className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                          {...register("billingAddress.country")}
                        />
                        {errors.billingAddress?.country && (
                          <p className="text-xs text-red-600 mt-1">{errors.billingAddress.country.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 2. DELIVERY SECTION — Clean Linoge Minimalist Radio Rows */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                Delivery
              </h2>

              {isLoadingShipping ? (
                <div className="flex items-center gap-2 py-4 text-xs text-neutral-500">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-700" />
                  Calculating courier options…
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 border-b border-neutral-200">
                  {shippingMethods.map((method) => {
                    const isFree = appliedCoupon?.freeShipping && !method.isInternational;
                    const displayPrice = isFree ? 0 : method.price;
                    const isSelected = selectedMethodName === method.method;
                    return (
                      <label
                        key={method.method}
                        className="flex items-center justify-between py-3.5 cursor-pointer group select-none"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethodOption"
                            className="w-4 h-4 accent-neutral-900 cursor-pointer"
                            checked={isSelected}
                            onChange={() => setSelectedMethodName(method.method)}
                          />
                          <div>
                            <span className={`text-sm tracking-tight ${isSelected ? "font-bold text-neutral-900" : "font-normal text-neutral-800"}`}>
                              {method.method}
                            </span>
                            {method.estimatedDays && (
                              <p className="text-[11px] text-neutral-400">
                                Delivery within {method.estimatedDays} business day{method.estimatedDays === 1 ? "" : "s"}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-neutral-900">
                          {displayPrice === 0 ? "Free" : `$${displayPrice.toFixed(2)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 3. OPTIONAL ADD-ONS (IF CONFIGURED) */}
            {optionalFees.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                  Laboratory Add-ons
                </h2>
                <div className="divide-y divide-neutral-200 border-b border-neutral-200">
                  {optionalFees.map((fee) => (
                    <label key={fee.id} className="flex items-center justify-between py-3 cursor-pointer group select-none">
                      <span className="flex items-center gap-3 text-sm text-neutral-800">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-neutral-900 cursor-pointer"
                          checked={selectedFeeIds.includes(fee.id)}
                          onChange={() => toggleOptionalFee(fee.id)}
                        />
                        {fee.name}
                      </span>
                      <span className="text-xs font-semibold text-neutral-900">
                        {fee.type === "percentage" ? `${fee.amount}%` : `$${fee.amount.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* 4. PAYMENT SECTION — Minimalist Radio Rows with Badges */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                Payment
              </h2>

              <div className="divide-y divide-neutral-200 border-b border-neutral-200 mb-6">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm.value;
                  return (
                    <label
                      key={pm.value}
                      className="flex items-center justify-between py-4 cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethodSelection"
                          className="w-4 h-4 accent-neutral-900 cursor-pointer"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(pm.value)}
                        />
                        <div>
                          <p className={`text-sm ${isSelected ? "font-bold text-neutral-900" : "font-normal text-neutral-800"}`}>
                            {pm.label}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {pm.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                        {pm.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Research agreement checkbox */}
              <div className="mb-6">
                <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    required
                    className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-neutral-900 accent-neutral-900"
                  />
                  <span>
                    I confirm that all items are ordered strictly for laboratory in-vitro research use only (RUO) and agree to data processing policies.
                  </span>
                </label>
              </div>

              {submitError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 mb-6">
                  {submitError}
                </div>
              )}

              {/* PAY AND PLACE ORDER BUTTON — Full Width Clean Black (Matches Linoge reference) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4.5 bg-[#121214] hover:bg-black disabled:opacity-50 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-md active:scale-98 cursor-pointer"
              >
                {isSubmitting
                  ? "PROCESSING ORDER…"
                  : paymentMethod === "stripe"
                  ? "CONTINUE TO PAYMENT"
                  : "PAY AND PLACE ORDER"}
              </button>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SHOPPING BAG (3) & ORDER SUMMARY                             */}
          {/* ========================================================================= */}
          <div className="lg:sticky lg:top-28">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 pb-3 border-b border-neutral-200 mb-4">
              Shopping Bag ({itemCount})
            </h2>

            {/* Item List with Dividers & Portrait Thumbnails */}
            <div className="divide-y divide-neutral-200 border-b border-neutral-200 max-h-[380px] overflow-y-auto pr-1">
              {items.map((line) => (
                <div key={line.lineId} className="py-4 flex gap-4 items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-18 sm:w-16 sm:h-20 shrink-0 bg-white border border-neutral-200 overflow-hidden flex items-center justify-center relative">
                      {line.product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={safeProductImageUrl(line.product.imageUrl)}
                          alt={line.product.name}
                          className="max-h-full max-w-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[9px] text-neutral-400 font-mono">VIAL</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold uppercase text-neutral-900 truncate">
                        {line.product.name}
                      </p>
                      <div className="text-[11px] text-neutral-500 space-y-0.5 mt-0.5">
                        {line.variantTitle && <p>Size: {line.variantTitle}</p>}
                        <p>Quantity: {line.quantity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-neutral-900">
                      ${(line.priceSnapshot * line.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promocode Input Row */}
            <div className="py-4 border-b border-neutral-200">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-neutral-100 px-3 py-2 text-xs">
                  <span className="text-neutral-800 font-medium">
                    Code <strong className="font-bold">{appliedCoupon.code}</strong> applied (-${appliedCoupon.discount.toFixed(2)})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-neutral-500 hover:text-neutral-900 ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promocode"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-transparent border border-neutral-300 px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isVerifyingCoupon}
                    className="px-5 py-2 bg-neutral-200 hover:bg-neutral-300 disabled:opacity-50 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    {isVerifyingCoupon ? "…" : "APPLY"}
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Cost Breakdown */}
            <div className="py-4 space-y-2.5 text-xs text-neutral-600 border-b border-neutral-200">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-neutral-900 font-medium">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}

              {feeTotal > 0 && (
                <div className="flex justify-between">
                  <span>Processing / Fees</span>
                  <span className="text-neutral-900 font-medium">${feeTotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total Row */}
            <div className="pt-4 flex items-baseline justify-between text-neutral-900">
              <span className="text-sm font-semibold uppercase tracking-wider">Total:</span>
              <span className="text-2xl sm:text-3xl font-light tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Trust Assurance Bar */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-neutral-600" /> Encrypted Checkout
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-neutral-600" /> RUO Verified
              </span>
              <span>•</span>
              <span>Cold-Chain Transit</span>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
