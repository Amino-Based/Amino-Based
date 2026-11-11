"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, useCartItemCount } from "@/lib/cart/store";

export default function CartTriggerButton({ className }: { className?: string }) {
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartItemCount();

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative text-white/80 hover:text-white transition-colors ${className ?? ""}`}
      aria-label="Open cart"
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-[#031B4E] shadow-2xs leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
