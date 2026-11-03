"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, X, ShoppingBag } from "lucide-react";
import { removeWishlistItem } from "@/app/account/wishlist/actions";

export interface WishlistItemData {
  variantSku: string;
  productId: string | null;
  slug: string | null;
  name: string;
  image: string | null;
  quantity: number;
  price: number;
}

export function WishlistClient({ items }: { items: WishlistItemData[] }) {
  const [displayItems, setDisplayItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  function handleRemove(variantSku: string) {
    const previous = displayItems;
    setDisplayItems((current) =>
      current.filter((item) => item.variantSku !== variantSku)
    );
    startTransition(async () => {
      const result = await removeWishlistItem(variantSku);
      if (!result.success) {
        setDisplayItems(previous);
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-inter text-3xl md:text-5xl uppercase font-bold tracking-wider text-gray-900">
            Wishlist
          </h1>
          <p className="font-inter text-gray-500 mt-3 max-w-lg text-sm">
            {displayItems.length} item{displayItems.length === 1 ? "" : "s"} saved for later.
          </p>
        </div>
      </div>

      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.variantSku}
              className="group relative bg-white border border-black/5 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col shadow-sm"
            >
              <button
                disabled={isPending}
                onClick={() => handleRemove(item.variantSku)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 shadow-sm"
                aria-label="Remove from wishlist"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-40 mb-5 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <Heart className="w-8 h-8 text-gray-300" />
                )}
              </div>

              <div className="flex flex-col flex-1">
                {item.slug ? (
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-inter text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-inter text-base font-semibold text-gray-900">
                    {item.name}
                  </span>
                )}
                <span className="font-inter text-xs text-gray-400 mt-1">
                  Qty {item.quantity}
                </span>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
                  <span className="font-inter text-lg font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.slug && (
                    <Link
                      href={`/product/${item.slug}`}
                      className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-black/5 rounded-2xl shadow-sm">
          <Heart className="w-10 h-10 text-gray-300 mb-5" strokeWidth={1} />
          <h2 className="font-inter text-xl uppercase tracking-wider text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="font-inter text-gray-500 max-w-sm mb-8 text-sm">
            Save products you love and find them here anytime.
          </p>
          <Link
            href="/shop"
            className="font-inter px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
          >
            Start Browsing
          </Link>
        </div>
      )}
    </div>
  );
}
