"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useWishlistToggle } from "@/components/wishlist/useWishlistToggle";
import { useCartStore } from "@/lib/cart/store";
import {
  getProductDisplayDetails,
  type ShopMockProduct,
} from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";

export type { ShopMockProduct };

interface ShopProductCardProps {
  product: ShopMockProduct;
  variant?: "dark" | "light";
  index?: number;
}

export default function ShopProductCard({
  product,
  index = 0,
}: ShopProductCardProps) {
  const [selectedDosage] = useState(
    product.dosageOptions && product.dosageOptions.length > 0
      ? product.dosageOptions[0]
      : "Standard"
  );
  const [addedJustNow, setAddedJustNow] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const displayDetails = getProductDisplayDetails(product, selectedDosage);
  const displayPrice = displayDetails.price;
  const displayImage = resolveProductImageUrl({
    name: product.name,
    slug: product.slug,
    dosage: selectedDosage,
    dbImageUrl: displayDetails.image || product.image,
  });

  const priceText = `$${displayPrice.toFixed(2)}`;
  const subtitle =
    product.description ||
    (product.category ? `${product.category} formula` : "High-purity research analog");

  const {
    isWishlisted,
    isPending: wishlistPending,
    toggle: toggleWishlist,
  } = useWishlistToggle({
    id: displayDetails.sku || product.id,
    aliases: [displayDetails.sku || product.id, product.id, product.slug],
    variantSku: displayDetails.variantSku,
    price: displayPrice,
  });

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: displayDetails.sku,
        name: product.name,
        imageUrl: displayImage,
        slug: product.slug,
      },
      displayDetails.variantSku,
      1,
      displayPrice,
      selectedDosage
    );
    setAddedJustNow(true);
    setTimeout(() => setAddedJustNow(false), 1600);
  };

  return (
    <div className={`w-full float-card-${index % 4}`}>
      <div className="group relative bg-white rounded-[26px] sm:rounded-[28px] p-3 sm:p-3.5 pb-3.5 sm:pb-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_34px_rgba(3,27,78,0.08)] border border-neutral-100/80 flex flex-col justify-between overflow-hidden active:scale-[0.98] hover:-translate-y-1 transition-all duration-300 w-full">
        {/* Full card clickable link (stretched over entire card) */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${product.name}`}
        />

        {/* Top-Left Quality / Status Badge */}
        {product.featured ? (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-800 bg-black/5 backdrop-blur-md px-2 py-0.5 rounded-full border border-black/5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            BEST SELLER
          </span>
        ) : product.purity ? (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 inline-flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-700 bg-black/5 backdrop-blur-md px-2 py-0.5 rounded-full border border-black/5 pointer-events-none">
            {product.purity}
          </span>
        ) : null}

        {/* Product Image sitting cleanly on the white card without inner colored borders */}
        <div className="relative w-full aspect-[1/1.12] sm:aspect-[1/1.15] flex items-center justify-center overflow-hidden rounded-[20px] pointer-events-none">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index < 4}
            className="object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content body matching reference card typography */}
        <div className="pt-2.5 sm:pt-3 flex flex-col justify-between flex-1 pointer-events-none">
          <div>
            <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 tracking-tight leading-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="text-[10px] sm:text-[11px] font-normal text-neutral-400 mt-1 line-clamp-1 leading-snug">
              {subtitle}
            </p>
          </div>

          {/* Bottom row: Price on left, Action buttons on right */}
          <div className="mt-3 flex items-center justify-between gap-1">
            <span className="text-[13px] sm:text-[14px] font-bold text-neutral-900 tracking-tight font-sans">
              {priceText}
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Desktop subtle Quick Add button */}
              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Quick add ${product.name} to cart`}
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-wide transition-all shadow-2xs active:scale-95 cursor-pointer relative z-10 ${
                  addedJustNow
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-100 hover:bg-black text-neutral-800 hover:text-white"
                }`}
              >
                {addedJustNow ? (
                  <>
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add</span>
                  </>
                )}
              </button>

              {/* Circular black button with white heart (exact reference match) */}
              <button
                type="button"
                disabled={wishlistPending}
                onClick={handleWishlistClick}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="relative z-10 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform touch-manipulation cursor-pointer shrink-0"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    isWishlisted ? "fill-red-500 text-red-500" : "fill-white text-white"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
