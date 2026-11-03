"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore, useCartItemCount } from "@/lib/cart/store";

export default function CartTriggerButton({ className }: { className?: string }) {
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartItemCount();

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative text-gray-300 hover:text-white transition-colors ${className ?? ""}`}
      aria-label="Open cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
