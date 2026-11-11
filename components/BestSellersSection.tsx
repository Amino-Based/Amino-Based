"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ShopProductCard from "@/components/shop/ShopProductCard";
import type { ShopMockProduct } from "@/lib/shopCardProduct";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = "/placeholder-product.svg";

const FALLBACK_PRODUCTS: ShopMockProduct[] = [
  {
    id: "1",
    name: "GLP-3RTA",
    slug: "glp-3rta",
    description:
      "Triple GIP/GLP-1/glucagon receptor agonist studied for its effects on metabolic pathways and body composition.",
    dosageOptions: ["10mg", "30mg"],
    purity: "≥99% Purity",
    type: "Research Grade Peptide",
    price: 64.99,
    image: "/assets/shelf_vial_glp3rta.png",
    featured: true,
    category: "GLP-1 & Metabolic",
    hasVariants: false,
    variants: [],
  },
  {
    id: "2",
    name: "GLP-1TRZ",
    slug: "glp-1trz",
    description:
      "Dual GIP and GLP-1 receptor agonist researched for synergistic effects on glucose homeostasis.",
    dosageOptions: ["10mg", "30mg"],
    purity: "≥99% Purity",
    type: "Research Grade Peptide",
    price: 61.99,
    image: "/assets/shelf_vial_glp1trz.png",
    featured: false,
    category: "GLP-1 & Metabolic",
    hasVariants: false,
    variants: [],
  },
  {
    id: "3",
    name: "Semaglutide",
    slug: "semaglutide",
    description: "GLP-1 receptor agonist widely studied for glycemic control and weight management research.",
    dosageOptions: ["2MG", "5MG", "10MG"],
    purity: "≥99% Purity",
    type: "Research Grade Peptide",
    price: 99.99,
    image: "/assets/shelf_vial_semaglutide.webp",
    featured: false,
    category: "GLP-1 & Metabolic",
    hasVariants: false,
    variants: [],
  },
  {
    id: "4",
    name: "BPC-157",
    slug: "bpc-157",
    description:
      "Synthetic peptide derived from a protective stomach protein, studied for tissue repair and gut healing.",
    dosageOptions: ["5MG", "10MG"],
    purity: "≥99% Purity",
    type: "Research Peptide",
    price: 79.99,
    image: "/assets/shelf_vial_bpc157.png",
    featured: false,
    category: "Recovery Peptides",
    hasVariants: false,
    variants: [],
  },
  {
    id: "5",
    name: "MOTS-c",
    slug: "mots-c",
    description: "Mitochondrial-derived peptide studied for its role in cellular energy metabolism.",
    dosageOptions: ["10mg", "20mg"],
    purity: "≥99% Purity",
    type: "Longevity Peptide",
    price: 59.99,
    image: FALLBACK_IMAGE,
    featured: false,
    category: "Longevity Research",
    hasVariants: false,
    variants: [],
  },
  {
    id: "6",
    name: "Tesamorelin",
    slug: "tesamorelin",
    description: "GHRH analogue studied for its effects on the somatotropic axis and body composition.",
    dosageOptions: ["10mg", "20mg"],
    purity: "≥99% Purity",
    type: "Growth Hormone Secretagogue",
    price: 64.99,
    image: FALLBACK_IMAGE,
    featured: false,
    category: "Growth Hormone Secretagogue",
    hasVariants: false,
    variants: [],
  },
];

/** Ensures there are always enough cards to make the desktop slider worth sliding —
 * pads with real catalog products (never fake ones) rather than hiding/duplicating
 * whatever real best-sellers were passed in. */
const MIN_SLIDER_ITEMS = 6;

function withSliderPadding(items: ShopMockProduct[]): ShopMockProduct[] {
  if (items.length >= MIN_SLIDER_ITEMS) return items;
  const seenSlugs = new Set(items.map((p) => p.slug));
  const padding = FALLBACK_PRODUCTS.filter((p) => !seenSlugs.has(p.slug));
  return [...items, ...padding].slice(0, Math.max(MIN_SLIDER_ITEMS, items.length));
}

interface BestSellersSectionProps {
  products?: ShopMockProduct[];
}

export default function BestSellersSection({ products }: BestSellersSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const baseItems = products && products.length > 0 ? products : FALLBACK_PRODUCTS;
  const items = withSliderPadding(baseItems);

  const scrollSlider = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? 300;
    el.scrollBy({ left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24, behavior: "smooth" });
  };

  useGSAP(
    () => {
      gsap.fromTo(
        ".product-card",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".bs-title",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 px-4 md:px-8 lg:px-12 bg-[#FAFAFA] text-gray-900 overflow-hidden">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="bs-title">
            <h2 className="text-3xl md:text-5xl font-inter uppercase font-bold tracking-wider mb-4">
              Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-400">Sellers</span>
            </h2>
            <p className="font-inter text-gray-500 max-w-lg text-sm md:text-base">
              Explore our most sought-after research peptides, engineered for maximum purity and exceptional scientific results.
            </p>
          </div>
          <Link href="/shop" className="bs-title mt-6 md:mt-0 flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors group">
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile & tablet: static grid, no slider */}
        <div className="grid grid-cols-2 lg:hidden gap-3 sm:gap-6 w-full">
          {items.map((product, i) => (
            <ShopProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Desktop: horizontal slider */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollSlider("left")}
            aria-label="Scroll to previous products"
            className="shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors z-10"
          >
            <ChevronLeft className="w-12 h-12" strokeWidth={1} />
          </button>

          <div
            ref={sliderRef}
            data-testid="bestsellers-slider"
            className="no-scrollbar flex gap-6 w-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            {items.map((product, i) => (
              <div key={product.id} className="w-[calc(25%-18px)] shrink-0 snap-start">
                <ShopProductCard product={product} index={i} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollSlider("right")}
            aria-label="Scroll to next products"
            className="shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors z-10"
          >
            <ChevronRight className="w-12 h-12" strokeWidth={1} />
          </button>
        </div>
      </div>
    </section>
  );
}
