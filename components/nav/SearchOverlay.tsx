"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { formatUsd } from "@/lib/types/shop";

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  category?: string | null;
};

const POPULAR_COMPOUNDS = [
  "BPC-157",
  "GLP-1TRZ",
  "GLP-3RTA",
  "TB-500",
  "NAD+",
  "Epitalon",
  "Sermorelin",
  "CJC-1295",
];

const QUICK_CATEGORIES = [
  { name: "GLP-1 Incretin Analogs", slug: "glp-1" },
  { name: "Tissue & Recovery", slug: "recovery" },
  { name: "Longevity & Cellular", slug: "longevity" },
  { name: "Growth Hormone Secretagogues", slug: "growth-hormone" },
];

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open, reset on close
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 md:pt-24 px-3 sm:px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search research peptide catalog"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-neutral-200 shadow-[0_24px_70px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col max-h-[82vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* Search Header Input Bar                                   */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-neutral-200 bg-neutral-50/90">
          <Search className="w-5 h-5 text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research peptides, formulations, or CAS#..."
            className="flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-400 text-sm sm:text-base font-medium outline-none"
            aria-label="Search peptides"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-neutral-400 hover:text-black p-1 rounded-full hover:bg-neutral-200/60 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-neutral-500 bg-white border border-neutral-200 rounded shadow-2xs font-mono">
            ESC
          </kbd>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center transition-colors shrink-0 ml-1"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* Main Content Area                                         */}
        {/* ========================================================= */}
        <div className="overflow-y-auto p-4 sm:p-5 flex-1 min-h-[260px] no-scrollbar">
          {/* 1. Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Loader2 className="w-6 h-6 text-black animate-spin" />
              <p className="text-sm font-semibold text-neutral-900">
                Querying verified peptide archive...
              </p>
              <span className="text-xs text-neutral-500">
                Filtering analytical purity grades &amp; lot records
              </span>
            </div>
          ) : query.trim() && hasSearched && results.length === 0 ? (
            /* 2. Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 mb-3">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                No Matching Research Peptides
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mt-1 mb-6 leading-relaxed">
                No chemical formulations matched &ldquo;{query}&rdquo;. Check the spelling or
                browse by primary receptor pathway.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Clear Search
                </button>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-black text-white hover:bg-neutral-800 transition-colors"
                >
                  Browse Full Catalog
                </Link>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* 3. Search Results Grid */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {results.length} Verified {results.length === 1 ? "Compound" : "Compounds"} Found
                </span>
                <Link
                  href={`/shop?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-neutral-900 hover:text-black flex items-center gap-1 group"
                >
                  <span>View in catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black/30 shadow-2xs hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Vial Thumbnail */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-gradient-to-b from-neutral-50 to-neutral-100 border border-neutral-200 flex items-center justify-center p-1 relative overflow-hidden">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-400">
                          <FlaskConical className="w-5 h-5 text-neutral-400" />
                          <span className="text-[7.5px] font-bold tracking-widest uppercase mt-0.5">
                            RUO
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-black bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-full">
                          ≥99% HPLC
                        </span>
                        {product.category && (
                          <span className="text-[9px] font-medium uppercase tracking-wider text-neutral-500 truncate">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black truncate transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs font-semibold text-neutral-900 mt-0.5">
                        {formatUsd(product.price)}
                      </p>
                    </div>

                    {/* Hover Arrow Pill */}
                    <div className="w-7 h-7 rounded-full bg-neutral-50 border border-neutral-200 group-hover:bg-black group-hover:border-black group-hover:text-white text-neutral-400 flex items-center justify-center shrink-0 transition-all duration-200">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* 4. Initial State: Quick Search Recommendations */
            <div className="space-y-5 py-2">
              {/* Popular Formulations */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Popular Research Formulations
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {POPULAR_COMPOUNDS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-50 hover:bg-black text-neutral-800 hover:text-white border border-neutral-200 hover:border-black transition-all cursor-pointer shadow-2xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Research Categories */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 px-1">
                  <Layers className="w-3.5 h-3.5 text-neutral-900" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Explore By Research Pathway
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                      onClick={onClose}
                      className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition-all"
                    >
                      <span className="text-xs font-semibold text-neutral-900 group-hover:text-black truncate">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct Catalog Action */}
              <div className="pt-2">
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-black hover:bg-neutral-900 text-white transition-colors shadow-sm group"
                >
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                    <span className="text-xs font-bold tracking-tight text-white">
                      Browse Complete Master Peptide Catalog
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-300 group-hover:text-white flex items-center gap-1 transition-colors">
                    All 98 Lots <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* Bottom Compliance & Verification Bar                     */}
        {/* ========================================================= */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1.5 font-semibold text-neutral-800 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
            Research Use Only (RUO) • COA Verified On Every Lot
          </span>
          <span className="hidden sm:inline text-neutral-400 font-mono text-[9.5px]">
            ESC to close • Enter to select
          </span>
        </div>
      </div>
    </div>
  );
}
