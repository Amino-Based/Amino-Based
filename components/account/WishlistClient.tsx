"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, X, ShoppingBag, ArrowRight } from "lucide-react";
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
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-sans">
            Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-lg leading-relaxed">
            {displayItems.length} research compound{displayItems.length === 1 ? "" : "s"} bookmarked for future synthesis orders.
          </p>
        </div>

        {displayItems.length > 0 && (
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs shrink-0 w-fit"
          >
            <span>Explore Catalog</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayItems.map((item) => (
            <div
              key={item.variantSku}
              className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <button
                disabled={isPending}
                onClick={() => handleRemove(item.variantSku)}
                className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                aria-label="Remove from wishlist"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="relative h-40 mb-4 flex items-center justify-center bg-neutral-50/70 rounded-xl overflow-hidden border border-neutral-100">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105"
                  />
                ) : (
                  <Heart className="w-8 h-8 text-neutral-300" />
                )}
              </div>

              <div className="flex flex-col flex-1 justify-between">
                <div>
                  {item.slug ? (
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-bold text-neutral-950 hover:text-neutral-700 transition-colors line-clamp-1 font-sans"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-neutral-950 line-clamp-1 font-sans">
                      {item.name}
                    </span>
                  )}
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">
                    Saved Quantity: {item.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-neutral-100">
                  <span className="text-base font-extrabold text-neutral-950 font-sans">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.slug && (
                    <Link
                      href={`/product/${item.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      <span>View</span>
                      <ShoppingBag className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-xs">
          <Heart className="w-10 h-10 text-neutral-300 mb-3" strokeWidth={1.5} />
          <h2 className="text-base font-bold text-neutral-900">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-neutral-400 max-w-sm mt-1">
            Bookmark research peptides while browsing our catalog to access them quickly here.
          </p>
          <Link
            href="/shop"
            className="mt-5 px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            Start Browsing Peptides
          </Link>
        </div>
      )}
    </div>
  );
}
