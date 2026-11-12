"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
  Lock,
} from "lucide-react";
import { useCartStore, useCartSubtotal, useCartItemCount } from "@/lib/cart/store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping/constants";
import { safeProductImageUrl } from "@/lib/products/productImage";

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartSubtotal();
  const itemCount = useCartItemCount();
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgressPct = Math.min(100, Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <>
      {/* Dark frosted backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Shell with 10% Blurry Background Image */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg z-[100] bg-black text-white border-l border-white/15 flex flex-col overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen
            ? "translate-x-0 shadow-[0_25px_80px_rgba(0,0,0,0.9)] pointer-events-auto visible"
            : "translate-x-full shadow-none pointer-events-none invisible"
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* Background Image Layer — ~10% Soft Blur Focus */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/assets/amino-creative-white-box-vials-branded-box-4k.png"
            alt="Amino Branded Box & Vials Background"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 520px"
            className="object-cover object-center scale-105 blur-[2.5px]"
          />
          {/* Subtle edge vignetting to protect text legibility without obscuring the artwork */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/75 pointer-events-none" />
        </div>

        {/* Frosted Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4.5 border-b border-white/15 bg-black/55 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-cyan-300 shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-white leading-tight drop-shadow-sm">
                Your Research Cart
              </h2>
              <span className="text-[11px] font-medium text-white/70">
                {itemCount} {itemCount === 1 ? "compound" : "compounds"} selected
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 border border-white/10 hover:border-white/25 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        {items.length > 0 && (
          <div className="relative z-10 px-6 py-3 bg-black/45 backdrop-blur-md border-b border-white/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <span className="text-white/90 text-[11px] font-medium drop-shadow-xs">
                  Add <strong className="text-cyan-300 font-bold">${remainingForFreeShipping.toFixed(2)}</strong> for Free Expedited Shipping
                </span>
              ) : (
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1 drop-shadow-xs">
                  <Check className="w-3.5 h-3.5" /> Free Expedited Shipping Unlocked
                </span>
              )}
              <span className="text-[10px] font-mono font-bold text-white/80">
                {Math.round(shippingProgressPct)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-200 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                style={{ width: `${shippingProgressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="relative z-10 flex-1 overflow-y-auto px-5 sm:px-6 py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-black/55 border border-white/20 flex items-center justify-center text-cyan-300 mb-4 backdrop-blur-md shadow-xl">
                <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl font-normal text-white mb-1.5 drop-shadow-sm">
                Your Cart is Empty
              </h3>
              <p className="text-white/80 text-xs sm:text-sm font-normal max-w-xs mb-6 leading-relaxed drop-shadow-xs">
                Explore our laboratory catalogue of HPLC-verified peptide formulations and analytical research supplies.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#071739] bg-white hover:bg-neutral-100 transition-all shadow-lg active:scale-95"
              >
                Browse Catalogue
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {items.map((line) => (
                <div
                  key={line.lineId}
                  className="flex gap-3.5 bg-black/45 hover:bg-black/55 backdrop-blur-md border border-white/20 hover:border-white/35 rounded-[20px] p-3.5 sm:p-4 shadow-xl transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[14px] bg-black/50 border border-white/15 flex items-center justify-center overflow-hidden relative">
                    {line.product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={safeProductImageUrl(line.product.imageUrl)}
                        alt={line.product.name}
                        className="w-full h-full max-h-full max-w-full object-contain p-1"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-white/50" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${line.product.slug}`}
                          onClick={closeCart}
                          className="font-serif text-sm sm:text-base font-normal text-white hover:text-cyan-300 leading-snug line-clamp-1 transition-colors drop-shadow-xs"
                        >
                          {line.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(line.lineId)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/15 transition-colors shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {line.variantTitle && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                            {line.variantTitle}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Pill Quantity Selector */}
                      <div className="inline-flex items-center border border-white/25 rounded-full overflow-hidden bg-black/55 backdrop-blur-md shadow-inner h-7 px-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-white">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="font-serif text-base sm:text-lg font-light text-white drop-shadow-xs">
                        ${(line.priceSnapshot * line.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frosted Footer */}
        {items.length > 0 && (
          <div className="relative z-10 border-t border-white/15 px-6 py-5 space-y-4 bg-black/65 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Estimated Subtotal
              </span>
              <span className="font-serif text-2xl font-light text-white drop-shadow-xs">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-[11px] text-white/60 text-center">
              Taxes &amp; cold-chain shipping calculated at checkout.
            </p>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full h-13 rounded-full bg-white hover:bg-neutral-100 text-[#071739] font-bold text-sm uppercase tracking-wider transition-all shadow-[0_8px_24px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.35)] flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust Mini-Notice */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-white/60 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-300" /> 256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-300" /> RUO Verified
              </span>
              <span>•</span>
              <span>Same-Day US Dispatch</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
