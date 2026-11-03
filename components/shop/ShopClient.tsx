"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  FlaskConical,
  ShieldCheck,
  FileCheck2,
  Snowflake,
  Truck,
  RotateCcw,
  ArrowRight,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import Footer from "@/components/Footer";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ShopFaqSection from "@/components/shop/ShopFaqSection";
import type { ShopMockProduct } from "@/lib/shopCardProduct";
import { MASTER_CATEGORIES } from "@/lib/masterCatalogData";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const DEFAULT_SHOP_CATEGORIES = MASTER_CATEGORIES;


const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "≥99% HPLC Verified",
    desc: "Analytical reverse-phase purity standard",
  },
  {
    icon: FileCheck2,
    title: "Lot-Specific COA",
    desc: "Matching report included with each vial",
  },
  {
    icon: Snowflake,
    title: "Cold-Chain Lyophilized",
    desc: "Solid lyophilized powder sealed under vacuum",
  },
  {
    icon: Truck,
    title: "US Lab Direct",
    desc: "Same-day temperature-regulated dispatch",
  },
];

function formatCategoryTab(cat: string): string {
  return cat
    .replace(/\s*Research Compounds\s*/i, "")
    .replace(/\s*Secretagogue\s*/i, "")
    .replace(/\s*Supplies\s*/i, "")
    .trim()
    .toUpperCase();
}

function ShopClientInner({
  products,
  categories,
  loadError = false,
}: {
  products: ShopMockProduct[];
  categories: string[];
  /** True only when the Payload query threw. An empty catalog is NOT an error. */
  loadError?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLDivElement>(null);

  // No static fallback. Showing the 98-entry master catalog here advertised products that do
  // not exist in the database and cannot be bought — checkout resolves every line against
  // Payload and throws for anything it cannot find. An empty catalog renders the empty state;
  // a failed query renders the error state below. The two are never conflated.
  // `products` is a required array prop supplied by app/shop/page.tsx; no fallback, and no
  // logical expression that would churn the useMemo dependencies below.
  const activeProducts = products;
  const activeCategoryList =
    categories && categories.length > 0 ? categories : DEFAULT_SHOP_CATEGORIES;

  const slugify = (v: string) =>
    v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam
    ? activeCategoryList.find((c) => {
        const cSlug = slugify(c);
        const pSlug = slugify(categoryParam);
        return cSlug === pSlug || cSlug.startsWith(pSlug) || pSlug.startsWith(cSlug);
      }) ?? null
    : null;

  const sort = (searchParams.get("sort") as SortKey | null) ?? "featured";
  const queryParam = searchParams.get("q") ?? "";
  const [searchText, setSearchText] = useState(queryParam);

  const updateParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setActiveCategory = (category: string | null) =>
    updateParams({ category: category ? slugify(category) : null });

  // Debounce search query
  useEffect(() => {
    if (searchText === queryParam) return;
    const t = setTimeout(() => updateParams({ q: searchText.trim() || null }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // Compute live counts per category for the UI
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of activeCategoryList) {
      const catSlug = slugify(cat);
      counts[cat] = activeProducts.filter(
        (p) => slugify(p.category || "") === catSlug || slugify(p.type || "") === catSlug
      ).length;
    }
    return counts;
  }, [activeProducts, activeCategoryList]);

  const filteredProducts = useMemo(() => {
    let list = activeCategory
      ? activeProducts.filter(
          (p) =>
            slugify(p.category || "") === slugify(activeCategory) ||
            slugify(p.type || "") === slugify(activeCategory)
        )
      : activeProducts;

    const q = queryParam.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        `${p.name} ${p.category} ${p.type} ${p.description}`.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));

    return sorted;
  }, [activeProducts, activeCategory, queryParam, sort]);

  return (
    <main ref={sectionRef} className="min-h-screen bg-white text-[#0F0F11]">
      
      {/* ========================================================================= */}
      {/* 1. SHOP HERO BANNER & CATALOG TITLE (ARCHITECTURAL RESEARCH AESTHETIC)    */}
      {/* ========================================================================= */}
      <section className="pt-24 sm:pt-28 pb-6 sm:pb-8 bg-white">
        <div className="max-w-7xl lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Panoramic Widescreen Hero Banner matching original luxury banner ratio */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] lg:aspect-[32/10] rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-xs border border-[#E4E4E7]/60 group">
            <Image
              src="/assets/shop_catalog_hero.webp"
              alt="Amino Based Authentic Research Peptides & Laboratory Packaging"
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center group-hover:scale-101 transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

            {/* Clean Floating Badges */}
            <div className="absolute top-3.5 inset-x-3.5 sm:top-5 sm:inset-x-5 flex items-center justify-between gap-3 pointer-events-none z-10">
              <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#071739] shadow-2xs border border-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#031B4E] animate-pulse" />
                Amino Based Research Archive • 98 Master Compounds
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-[#031B4E] border border-white/60 shadow-2xs">
                  ≥99% HPLC Verified
                </span>
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-[#071739] border border-white/60 shadow-2xs">
                  Research Use Only (RUO)
                </span>
              </div>
            </div>
          </div>

          {/* Centered Serif Catalog Title */}
          <div className="text-center pt-8 sm:pt-10">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#071739] tracking-tight">
              Catalog
            </h1>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY NAVIGATION ROW (EXACT REFERENCE HORIZONTAL TEXT WITH SUPERSCRIPT) */}
      {/* ========================================================================= */}
      <div className="sticky top-16 sm:top-20 z-20 bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] transition-all">
        <div className="max-w-7xl lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Horizontal Category Text Tabs matching reference */}
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-3.5 min-w-0 flex-1 overscroll-x-contain">
            {/* SHOW ALL */}
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`text-[11px] sm:text-xs uppercase tracking-widest whitespace-nowrap transition-all pb-3.5 -mb-[15px] border-b-2 flex items-baseline gap-1 ${
                activeCategory === null
                  ? "text-[#071739] font-bold border-[#071739]"
                  : "text-[#71717A] hover:text-[#071739] font-medium border-transparent"
              }`}
            >
              <span>SHOW ALL</span>
              <sup className="text-[9px] sm:text-[10px] font-normal opacity-70">
                {activeProducts.length}
              </sup>
            </button>

            {/* Categories with superscript count */}
            {activeCategoryList.map((category) => {
              const isActive = activeCategory === category;
              const count = categoryCounts[category] || 0;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`text-[11px] sm:text-xs uppercase tracking-widest whitespace-nowrap transition-all pb-3.5 -mb-[15px] border-b-2 flex items-baseline gap-1 ${
                    isActive
                      ? "text-[#071739] font-bold border-[#071739]"
                      : "text-[#71717A] hover:text-[#071739] font-medium border-transparent"
                  }`}
                >
                  <span>{formatCategoryTab(category)}</span>
                  <sup className="text-[9px] sm:text-[10px] font-normal opacity-70">
                    {count}
                  </sup>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Minimal Sort ⇅ & Search matching reference layout */}
          <div className="flex items-center gap-3 shrink-0 py-2">
            {/* Search Input */}
            <div className="relative hidden md:block w-44 lg:w-52">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                aria-label="Search peptides"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-full pl-8 pr-3 py-1 text-xs text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] transition-all"
              />
            </div>

            {/* Minimal Sort Trigger matching ⇅ in reference */}
            <div className="flex items-center gap-1.5 border border-[#E2E8F0] hover:border-[#071739]/50 rounded-full px-3 py-1 bg-white transition-colors cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#071739]" />
              <select
                value={sort}
                onChange={(e) =>
                  updateParams({ sort: e.target.value === "featured" ? null : e.target.value })
                }
                aria-label="Sort products"
                className="bg-transparent text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#071739] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRODUCT CATALOG GRID                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Results Counter / Category Status */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E4E4E7]/60">
          <div className="text-sm sm:text-base font-semibold text-[#475569] flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-[#031B4E]" />
            <span>
              Showing <span className="font-bold text-[#071739]">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "Research Peptide" : "Research Peptides"}
              {activeCategory && (
                <span>
                  {" "}
                  in <span className="text-[#031B4E] font-bold">"{activeCategory}"</span>
                </span>
              )}
              {queryParam && (
                <span>
                  {" "}
                  matching <span className="text-[#031B4E] font-bold">"{queryParam}"</span>
                </span>
              )}
            </span>
          </div>

          {(activeCategory || queryParam) && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                router.replace(pathname, { scroll: false });
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#031B4E] hover:text-[#07266E] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to All Catalogs</span>
            </button>
          )}
        </div>

        {/* Database error state — deliberately distinct from "no products match" */}
        {loadError ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-[#FCA5A5] rounded-2xl bg-[#FEF2F2]">
            <div className="w-14 h-14 rounded-full bg-[#B91C1C]/5 border border-[#B91C1C]/15 flex items-center justify-center text-[#B91C1C] mb-4">
              <FlaskConical className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#7F1D1D] mb-1.5">Catalog Temporarily Unavailable</h3>
            <p className="text-xs sm:text-sm text-[#991B1B] max-w-md leading-relaxed mb-6">
              We could not load the product catalog just now. This is a temporary problem on our
              side, not an empty catalog. Please refresh in a moment.
            </p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="px-6 py-2.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAFC]">
            <div className="w-14 h-14 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/15 flex items-center justify-center text-[#031B4E] mb-4">
              <FlaskConical className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#071739] mb-1.5">No Matching Research Peptides</h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md leading-relaxed mb-6">
              {queryParam
                ? `No chemical formulations matched "${queryParam}". Try searching by peptide name (e.g., BPC-157, GLP-3RT) or view all categories.`
                : "No products currently listed in this category."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                router.replace(pathname, { scroll: false });
              }}
              className="px-6 py-2.5 rounded-full bg-[#031B4E] hover:bg-[#07266E] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              View Full Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP VERIFICATION MARQUEE (COA VERIFIED • RESEARCH USE ONLY • HPLC)    */}
      {/* ========================================================================= */}
      <section
        aria-label="Quality and Compliance Standards"
        className="relative w-full py-6 sm:py-8 my-4 sm:my-8 bg-[#F8FAFC] border-y border-[#E4E4E7]/80 overflow-hidden select-none group"
      >
        <div className="animate-marquee flex items-center group-hover:[animation-play-state:paused]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 sm:gap-8 mx-6 text-2xl sm:text-3xl md:text-4xl font-light tracking-wider uppercase text-[#071739] shrink-0"
            >
              <span>COA VERIFIED</span>
              <span className="text-[#031B4E] font-bold">⊕</span>
              <span className="text-gray-300">/</span>
              <span className="text-[#071739] font-normal">RESEARCH USE ONLY</span>
              <span className="text-[#031B4E] font-bold">⊕</span>
              <span className="text-gray-300">/</span>
              <span>HPLC VERIFIED</span>
              <span className="text-[#031B4E] font-bold">⊕</span>
              <span className="text-gray-300">/</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#031B4E] to-blue-600 font-semibold">
                MORE THAN 99%
              </span>
              <span className="text-[#031B4E] font-bold">⊕</span>
              <span className="text-gray-300">/</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ANALYTICAL TRUST PILLARS & COA LOOKUP BANNER                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 space-y-6">
        
        {/* 4 Analytical & Quality Assurance Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-[#F8FAFC] rounded-xl p-4.5 border border-[#E2E8F0] shadow-2xs flex items-center gap-3.5 hover:border-[#071739]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] text-[#071739] flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#071739]">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] text-[#71717A] leading-tight mt-0.5">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* COA Verification Banner */}
        <div className="bg-[#F8FAFC] border border-[#3B5D88]/20 rounded-2xl p-6 sm:p-8 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#031B4E] block mb-1">
              Quality Assurance & Compliance
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#071739] mb-2">
              Have a Vial in Your Laboratory? Verify Its Analysis.
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Every shipment is keyed to a unique batch number printed on the vial label. Use our verification portal to retrieve the exact Certificate of Analysis (HPLC chromatogram and mass spectrometry report) for your lot.
            </p>
          </div>

          <Link
            href="/certificates"
            className="px-6 py-3 rounded-full bg-[#031B4E] hover:bg-[#07266E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center gap-2 group w-full md:w-auto justify-center"
          >
            <span>Verify Lot COA</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Shop Page Details FAQ Section */}
      <ShopFaqSection />

      {/* Unified Footer with halfway-cut blurred lowercase wordmark */}
      <Footer />
    </main>
  );
}

export default function ShopClient({
  products,
  categories,
  loadError = false,
}: {
  products: ShopMockProduct[];
  categories: string[];
  loadError?: boolean;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopClientInner products={products} categories={categories} loadError={loadError} />
    </Suspense>
  );
}
