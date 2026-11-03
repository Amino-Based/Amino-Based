"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useCartStore } from "@/lib/cart/store";
import {
  createPayloadOrder,
  createPaymentIntent,
  syncPaymentStatus,
  type CreateOrderInput,
} from "@/app/checkout/actions";

type StripeCheckoutFormProps = {
  amount: number;
  orderInput: Omit<CreateOrderInput, "paymentMethod">;
  onOrderPlaced?: () => void;
};

export default function StripeCheckoutForm({ amount, orderInput, onOrderPlaced }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Please check your payment details and try again.");
        setIsProcessing(false);
        return;
      }

      const result = await createPayloadOrder({
        ...orderInput,
        paymentMethod: "stripe",
      });
      if (!result.ok) {
        setError(result.message);
        setIsProcessing(false);
        return;
      }
      const { orderId, accessToken } = result;

      const { clientSecret } = await createPaymentIntent(Math.round(amount * 100), orderId);

      if (!clientSecret) {
        setError("Could not initialize payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${orderId}?t=${accessToken}`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Your payment could not be processed.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await syncPaymentStatus(paymentIntent.id, orderId);
      }

      onOrderPlaced?.();
      useCartStore.getState().clear();
      router.push(`/order-confirmation/${orderId}?t=${accessToken}`);
    } catch (err) {
      console.error("Stripe checkout failed:", err);
      setError("Something went wrong while processing your payment. Please try again.");
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement options={{ layout: "tabs" }} />

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest transition-all"
      >
        {isProcessing ? "Processing…" : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
