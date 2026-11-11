"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ShopMockProduct } from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";
import { useWishlistToggle } from "@/components/wishlist/useWishlistToggle";

interface FeaturedItem {
  id: string;
  name: string;
  priceRange: string;
  priceTag: string;
  image: string;
  slug: string;
  sku: string;
  price: number;
  subtitle: string;
}

const DEFAULT_FEATURED_PRODUCTS: FeaturedItem[] = [
  {
    id: "glp-1trz",
    name: "GLP-1TRZ",
    priceRange: "$59.99 – $159.99",
    priceTag: "$59.99",
    image: "/assets/shelf_vial_glp1trz.png",
    slug: "glp-1trz",
    sku: "glp-1trz",
    price: 59.99,
    subtitle: "Citrus peptide blend",
  },
  {
    id: "glp-3rta",
    name: "GLP-3RTA",
    priceRange: "$79.99 – $249.99",
    priceTag: "$79.99",
    image: "/assets/shelf_vial_glp3rta.png",
    slug: "glp-3rta",
    sku: "glp-3rta",
    price: 79.99,
    subtitle: "Triple receptor matrix",
  },
  {
    id: "tb-500",
    name: "TB-500",
    priceRange: "$49.99 – $74.99",
    priceTag: "$49.99",
    image: "/assets/shelf_vial_tb500.png",
    slug: "tb-500",
    sku: "tb-500",
    price: 49.99,
    subtitle: "Cellular tissue recovery",
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    priceRange: "$59.99 – $69.99",
    priceTag: "$59.99",
    image: "/assets/shelf_vial_bpc157.png",
    slug: "bpc-157",
    sku: "bpc-157",
    price: 59.99,
    subtitle: "Systemic repair sequence",
  },
];

interface BestSellingProductsProps {
  products?: ShopMockProduct[];
}

/**
 * Mobile-Specific Staggered Card (exact reference image aesthetic)
 * - Pure white background card with smooth rounded-[28px] corners
 * - Product bottle centered in top half directly on the card
 * - Left-aligned bold product title
 * - Left-aligned soft gray subtitle/description
 * - Bottom row: bold price on the left, circular black button with white heart on the right
 * - Subtle slow-frequency shake animation with organic staggered delay
 */
function MobileFeaturedCard({
  item,
  index = 0,
}: {
  item: FeaturedItem;
  index?: number;
}) {
  const { isWishlisted, toggle: toggleWishlist } = useWishlistToggle({
    id: item.sku || item.id,
    aliases: [item.sku || item.id, item.id, item.slug],
    variantSku: "standard",
    price: item.price || 59.99,
  });

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  return (
    <div className={`w-full float-card-${index % 4}`}>
      <div className="group relative bg-white rounded-[28px] p-3.5 pb-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-hidden active:scale-[0.98] transition-all w-full">
        {/* Full card clickable link (stretched over entire card) */}
        <Link
          href={`/product/${item.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${item.name}`}
        />

        {/* Product Image sitting cleanly on the white card without inner colored borders */}
        <div className="relative w-full aspect-[1/1.15] flex items-center justify-center overflow-hidden rounded-[20px] pointer-events-none">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="50vw"
            priority
            className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content body matching reference card typography */}
        <div className="pt-3 flex flex-col justify-between flex-1 pointer-events-none">
          <div>
            <h3 className="text-[13px] font-bold text-neutral-900 tracking-tight leading-tight line-clamp-1">
              {item.name}
            </h3>
            <p className="text-[11px] font-normal text-neutral-400 mt-1 line-clamp-1 leading-snug">
              {item.subtitle}
            </p>
          </div>

          {/* Bottom row: Price on left, Circular black button with white heart on right */}
          <div className="mt-3 flex items-center justify-between gap-1">
            <span className="text-[14px] font-bold text-neutral-900 tracking-tight font-sans">
              {item.priceTag}
            </span>

            <button
              type="button"
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="relative z-10 pointer-events-auto w-7 h-7 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform touch-manipulation cursor-pointer shrink-0"
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
  );
}

/**
 * Desktop-Specific Card (Original full desktop layout preserved + slow frequency shake)
 */
function DesktopFeaturedCard({
  item,
  index = 0,
}: {
  item: FeaturedItem;
  index?: number;
}) {
  return (
    <div className={`w-full float-card-${index % 4}`}>
      <Link
        href={`/product/${item.slug}`}
        className="group relative bg-white rounded-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_34px_rgba(3,27,78,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden block w-full"
      >
        {/* Shelf Vial Display */}
        <div className="relative w-full aspect-[360/425] bg-[#F1F3F5] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            priority
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Bottom Info & Price Row */}
        <div className="p-4 sm:p-5 flex items-end justify-between gap-3 bg-white">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#071739] group-hover:text-[#031B4E] transition-colors tracking-tight leading-snug line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs sm:text-[13px] font-semibold text-[#1C427B] mt-1.5">
              {item.priceRange}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs sm:text-[13px] font-semibold text-[#1C427B]">
              {item.priceTag}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function BestSellingProducts({ products }: BestSellingProductsProps) {
  const displayItems: FeaturedItem[] =
    products && products.length >= 4
      ? products.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          priceRange: `$${p.price.toFixed(2)}`,
          priceTag: `$${p.price.toFixed(2)}`,
          image: resolveProductImageUrl({ name: p.name, slug: p.slug, dbImageUrl: p.image }),
          slug: p.slug,
          sku: p.slug,
          price: p.price,
          subtitle: p.category ? `${p.category} formula` : "High-purity research analog",
        }))
      : DEFAULT_FEATURED_PRODUCTS;

  // Staggered arrangement matching the reference image:
  // Left Column:  [Header: Featured / 4 Products] -> [Item 1] -> [Item 3]
  // Right Column: [Item 0 (aligned at top)] -> [Item 2]
  const rightColumnItems = [displayItems[0], displayItems[2]].filter(Boolean);
  const leftColumnCards = [displayItems[1], displayItems[3]].filter(Boolean);

  return (
    <section
      id="featured-products"
      className="w-full bg-[#F1F2F6] sm:bg-white py-8 sm:py-16 lg:py-20 px-3.5 sm:px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7]/60"
    >
      <div className="max-w-[1240px] mx-auto w-full">
        {/* ========================================================= */}
        {/* MOBILE VIEW (< sm): EXACT STAGGERED ASYMMETRIC MASONRY    */}
        {/* Left Col: Header block at top, followed by Card 1 & Card 3*/}
        {/* Right Col: Card 0 at top parallel to Header, then Card 2  */}
        {/* ========================================================= */}
        <div className="sm:hidden flex gap-3 items-start">
          {/* LEFT COLUMN: Header Block + Cards 1 & 3 */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Header Block matching the "Found 10 Results" typography & position */}
            <div className="pt-3 pb-2 px-1.5 flex flex-col justify-start">
              <span className="text-[17px] font-medium text-neutral-800 tracking-tight block">
                Featured
              </span>
              <h2 className="text-[23px] font-bold text-neutral-900 tracking-tight leading-tight mt-0.5">
                4 Products
              </h2>
              <Link
                href="/shop"
                className="mt-3.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors group w-fit"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Left Column Product Cards (Cards 1 and 3) */}
            {leftColumnCards.map((item, i) => (
              <MobileFeaturedCard key={item.id} item={item} index={i * 2 + 1} />
            ))}
          </div>

          {/* RIGHT COLUMN: Card 0 (At very top parallel to Header) + Card 2 */}
          <div className="flex-1 flex flex-col gap-3">
            {rightColumnItems.map((item, i) => (
              <MobileFeaturedCard key={item.id} item={item} index={i * 2} />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP VIEW (sm and up): ORIGINAL SYMMETRIC 4-COL LAYOUT */}
        {/* ========================================================= */}
        <div className="hidden sm:block">
          {/* Header Section */}
          <div className="flex flex-row items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="text-xs sm:text-[13px] font-semibold text-[#0B1A3D] tracking-tight block mb-1">
                Featured Products
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-[38px] font-serif font-normal tracking-tight text-[#071739]">
                Featured Research Products
              </h2>
            </div>

            <Link
              href="/shop"
              className="px-6 py-2.5 rounded-full bg-[#05183E] hover:bg-[#092256] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 flex items-center justify-center group w-fit"
            >
              <span>VIEW ALL PRODUCTS</span>
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {displayItems.map((item, index) => (
              <DesktopFeaturedCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
