"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart/store";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  // Zustand's `persist` middleware only attaches `.persist` once it detects a real
  // `window`/localStorage, which isn't available during Next's server render pass — so this
  // must never be read synchronously during the initial render, only after mount.
  const [hasHydrated, setHasHydrated] = useState(false);
  // Placing an order clears the cart, which would otherwise satisfy the
  // "cart is empty" redirect below at the same moment CheckoutClient is
  // navigating to the confirmation page — this flag lets that navigation win
  // instead of getting clobbered by a redirect back to /shop.
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    setHasHydrated(useCartStore.persist?.hasHydrated() ?? true);
    const unsub = useCartStore.persist?.onFinishHydration(() => setHasHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (hasHydrated && items.length === 0 && !orderPlaced) {
      router.replace("/shop");
    }
  }, [hasHydrated, items.length, orderPlaced, router]);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  return <CheckoutClient onOrderPlaced={() => setOrderPlaced(true)} />;
}
