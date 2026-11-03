"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/lib/cart/store";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping/constants";
import { safeProductImageUrl } from "@/lib/products/productImage";

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartSubtotal();
  const pathname = usePathname();

  // A drawer/modal overlay should never survive a route change — otherwise clicking any
  // nav link while the cart is open leaves it covering the newly-navigated-to page.
  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[100] bg-[#FAFAFA] border-l border-black/10 shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 bg-white">
          <h2 className="text-sm font-inter font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Your Cart
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-10 h-10 text-gray-300 mb-4" strokeWidth={1} />
              <p className="text-gray-500 text-sm font-medium">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-all"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((line) => (
                <div
                  key={line.lineId}
                  className="flex gap-4 border border-black/5 bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                    {line.product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={safeProductImageUrl(line.product.imageUrl)}
                        alt={line.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase text-gray-900 truncate">
                          {line.product.name}
                        </p>
                        {line.variantTitle && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md border border-black/10 text-[10px] font-inter font-medium text-gray-600">
                            {line.variantTitle}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.lineId)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-black/10 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        ${(line.priceSnapshot * line.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black/10 px-6 py-6 space-y-4 bg-white">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs font-medium text-gray-500 text-center">
                Add <span className="text-indigo-600 font-bold">${remainingForFreeShipping.toFixed(2)}</span> more
                for free shipping!
              </p>
            ) : (
              <p className="text-xs font-semibold text-green-600 text-center">
                You&apos;ve unlocked free shipping!
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-semibold uppercase tracking-widest text-xs">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center w-full px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
