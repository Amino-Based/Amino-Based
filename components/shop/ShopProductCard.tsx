"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useWishlistToggle } from "@/components/wishlist/useWishlistToggle";
import { useCartStore } from "@/lib/cart/store";
import {
  getProductDisplayDetails,
  getMultiVariantConfig,
  type ShopMockProduct,
} from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";

export type { ShopMockProduct };

// resolveShelfImage() removed. It bucketed products onto one of five vial photographs by
// keyword, so a product was routinely shown a vial labelled with a different compound — the
// "SEMAGLUTIDE 10 mg" vial stood in for Epitalon, DSIP, NAD+, PT-141 and ~60 others. Image
// selection now lives in lib/products/productImage.ts, which only returns a photograph whose
// printed label matches this product, and otherwise returns the neutral placeholder.

function formatCategoryLine(category?: string): string {
  if (!category) return "RESEARCH PEPTIDE";
  return category
    .replace(/\s*Research Compounds\s*/i, "")
    .replace(/\s*Secretagogue\s*/i, "")
    .replace(/\s*Supplies\s*/i, "")
    .trim()
    .toUpperCase();
}

export default function ShopProductCard({
  product,
}: {
  product: ShopMockProduct;
  variant?: "dark" | "light";
}) {
  const [selectedDosage, setSelectedDosage] = useState(
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

  // Single price display for the default variant
  const singlePriceText = `$${displayPrice.toFixed(2)}`;

  const {
    isWishlisted,
    isPending: wishlistPending,
    toggle: toggleWishlist,
  } = useWishlistToggle({
    id: displayDetails.sku,
    aliases: [displayDetails.sku, product.id, product.slug],
    variantSku: selectedDosage,
    price: displayPrice,
  });

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
      selectedDosage,
      1,
      displayPrice,
      selectedDosage
    );
    setAddedJustNow(true);
    setTimeout(() => setAddedJustNow(false), 1600);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card group relative bg-white rounded-[22px] border border-[#E2E8F0] shadow-2xs hover:shadow-[0_16px_36px_rgba(3,27,78,0.08)] hover:border-[#031B4E]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer block"
    >
      {/* Top Image Showcase: Clean Laboratory Pedestal Viewport */}
      <div className="relative w-full aspect-[360/380] bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/40 overflow-hidden">
        {/* Top-Left Quality / Status Badge */}
        {product.featured ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-widest text-[#071739] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xs border border-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#031B4E] animate-pulse" />
            BEST SELLER
          </span>
        ) : product.purity ? (
          // Shown only when a certificate figure exists. The former hardcoded fallback
          // badged every uncertified product with both a purity level and a testing method.
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#031B4E] bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-2xs border border-white/60">
            {product.purity}
          </span>
        ) : null}

        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={false}
          className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Wishlist Button: Frosted Glass Circle */}
        <button
          type="button"
          disabled={wishlistPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist();
          }}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-white/70 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-2xs transition-all active:scale-90"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>
      </div>

      {/* Bottom Product Content Body: Non-Generic Swiss Laboratory Architecture */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div className="space-y-1.5">
          {/* Line 1: Uppercase Category Eyebrow */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#031B4E]/85 truncate">
              {formatCategoryLine(product.category)}
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8] shrink-0 font-medium tracking-wide">
              RUO
            </span>
          </div>

          {/* Line 2: Product Name & Prominent Single Price Lockup */}
          <div className="flex items-baseline justify-between gap-3 pt-0.5">
            <h3 className="text-base sm:text-[17px] font-bold text-[#071739] group-hover:text-[#031B4E] transition-colors tracking-tight leading-snug line-clamp-1">
              {product.name}
            </h3>
            <span className="text-base sm:text-[17px] font-bold text-[#071739] font-mono tracking-tight shrink-0 tabular-nums">
              {singlePriceText}
            </span>
          </div>

          {/* Line 3: Descriptive Compound Lines (The exact lines requested by the user) */}
          <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 pt-0.5 font-normal">
            {product.description ||
              `Analytical grade ${product.name} synthesized for laboratory in-vitro assays and scientific receptor kinetics.`}
          </p>
        </div>

        {/* Line 4 / Footer Dock: Formulation Spec & Quick Action Button */}
        <div className="pt-3.5 mt-3.5 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
          {/* Dosage / Strength Tag */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-medium text-[#475569]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#031B4E]/70" />
            {selectedDosage || (product.dosageOptions && product.dosageOptions[0]) || "Standard"}
          </span>

          {/* Interactive Quick Add / Order Button with smooth state transition */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Quick add ${product.name} to order`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-2xs active:scale-95 cursor-pointer ${
              addedJustNow
                ? "bg-emerald-600 text-white"
                : "bg-[#031B4E] hover:bg-[#07266E] text-white hover:shadow-xs"
            }`}
          >
            {addedJustNow ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[11px]">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
