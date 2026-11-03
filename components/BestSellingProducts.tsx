"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ShopMockProduct } from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";

const DEFAULT_FEATURED_PRODUCTS = [
  {
    id: "glp-1trz",
    name: "GLP-1TRZ",
    priceRange: "$59.99 – $159.99",
    priceTag: "$59.99",
    image: "/assets/shelf_vial_glp1trz.png",
    slug: "glp-1trz",
  },
  {
    id: "glp-3rta",
    name: "GLP-3RTA",
    priceRange: "$79.99 – $249.99",
    priceTag: "$79.99",
    image: "/assets/shelf_vial_glp3rta.png",
    slug: "glp-3rta",
  },
  {
    id: "tb-500",
    name: "TB-500",
    priceRange: "$49.99 – $74.99",
    priceTag: "$49.99",
    image: "/assets/shelf_vial_tb500.png",
    slug: "tb-500",
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    priceRange: "$59.99 – $69.99",
    priceTag: "$59.99",
    image: "/assets/shelf_vial_bpc157.png",
    slug: "bpc-157",
  },
];

interface BestSellingProductsProps {
  products?: ShopMockProduct[];
}

export default function BestSellingProducts({ products }: BestSellingProductsProps) {
  const displayItems =
    products && products.length >= 4
      ? products.slice(0, 4).map((p, idx) => ({
          id: p.id,
          name: p.name,
          priceRange: `$${p.price.toFixed(2)}`,
          priceTag: `$${p.price.toFixed(2)}`,
          // Was: fall back to DEFAULT_FEATURED_PRODUCTS[idx].image — i.e. borrow whatever vial
          // photograph sat at the same index, labelling one product with another's image.
          image: resolveProductImageUrl({ name: p.name, slug: p.slug, dbImageUrl: p.image }),
          slug: p.slug,
        }))
      : DEFAULT_FEATURED_PRODUCTS;

  return (
    <section id="featured-products" className="w-full bg-white py-14 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7]/60">
      <div className="max-w-[1240px] mx-auto w-full">
        
        {/* Header Section matching reference image */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
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

        {/* 4 Cards Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayItems.map((item) => (
            <Link
              href={`/product/${item.slug}`}
              key={item.id}
              className="group relative bg-white rounded-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_34px_rgba(3,27,78,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Shelf Vial Display */}
              <div className="relative w-full aspect-[360/425] bg-[#F1F3F5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
          ))}
        </div>

      </div>
    </section>
  );
}
