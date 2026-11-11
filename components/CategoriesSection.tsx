"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  ShieldCheck,
  Activity,
} from "lucide-react";

export interface CategoryCardData {
  id: string | number;
  name: string;
  slug: string;
  image: string;
}

export interface ResearchCategoryItem {
  number: string;
  title: string;
  subtitle: string;
  pathway: string;
  slug: string;
  image: string;
  compounds: string[];
  purity: string;
  accentColor: string;
}

export const RESEARCH_CATEGORIES: ResearchCategoryItem[] = [
  {
    number: "01",
    title: "GLP-1 &\nMetabolic",
    subtitle: "Incretin Receptor Agonists & Glucose Regulation",
    pathway: "GLP-1 / GIP Dual Agonists",
    slug: "glp-1-metabolic-research-compounds",
    image: "/assets/categories/creative_01_glp1.webp",
    compounds: ["Semaglutide", "Tirzepatide", "Retatrutide"],
    purity: "≥99.4%",
    accentColor: "#0284c7", // Sky blue
  },
  {
    number: "02",
    title: "Healing &\nRecovery",
    subtitle: "Tissue Regeneration & Angiogenesis Pathways",
    pathway: "Fibroblast & Collagen Repair",
    slug: "healing-recovery-research-compounds",
    image: "/assets/categories/creative_02_healing.webp",
    compounds: ["BPC-157", "TB-500", "KPV Peptide"],
    purity: "≥99.6%",
    accentColor: "#059669", // Emerald
  },
  {
    number: "03",
    title: "Longevity &\nAnti-Aging",
    subtitle: "Telomere Protection & Cellular Senescence",
    pathway: "FOXO3 & Telomerase Activation",
    slug: "longevity-anti-aging-research-compounds",
    image: "/assets/categories/creative_03_longevity.webp",
    compounds: ["MOTS-c", "Epithalon", "NAD+"],
    purity: "≥99.2%",
    accentColor: "#7c3aed", // Violet
  },
  {
    number: "04",
    title: "Cognitive &\nNootropic",
    subtitle: "Neuroprotection & Synaptic Plasticity",
    pathway: "BDNF & Central Neurotransmission",
    slug: "cognitive-nootropic-research-compounds",
    image: "/assets/categories/creative_04_cognitive.webp",
    compounds: ["Semax", "Selank", "Noopept"],
    purity: "≥99.5%",
    accentColor: "#2563eb", // Royal blue
  },
  {
    number: "05",
    title: "Growth\nHormone\nSecretagogue",
    subtitle: "Pituitary Stimulation & Endogenous GH Pulsing",
    pathway: "GHRH & Ghrelin Receptor Axis",
    slug: "growth-hormone-secretagogue-research-compounds",
    image: "/assets/categories/creative_05_growth.webp",
    compounds: ["Ipamorelin", "CJC-1295", "Sermorelin"],
    purity: "≥99.3%",
    accentColor: "#d97706", // Amber
  },
  {
    number: "06",
    title: "Sexual &\nHormonal",
    subtitle: "Neuroendocrine Modulation & Receptor Pathways",
    pathway: "Melanocortin MC3R/MC4R Axis",
    slug: "sexual-hormonal-research-compounds",
    image: "/assets/categories/creative_06_hormonal.webp",
    compounds: ["PT-141", "Kisspeptin-10", "Oxytocin"],
    purity: "≥99.1%",
    accentColor: "#e11d48", // Rose
  },
  {
    number: "07",
    title: "Cosmetic &\nSkin",
    subtitle: "Extracellular Matrix & Dermal Remodeling",
    pathway: "Dermal Matrixyl & Copper Tripeptide",
    slug: "cosmetic-skin-research-compounds",
    image: "/assets/categories/creative_07_cosmetic.webp",
    compounds: ["GHK-Cu", "Matrixyl 3000", "Snap-8"],
    purity: "≥99.7%",
    accentColor: "#db2777", // Pink
  },
  {
    number: "08",
    title: "Nasal\nSprays",
    subtitle: "Rapid Transnasal Delivery Peptides",
    pathway: "Mucosal & Blood-Brain Permeation",
    slug: "nasal-sprays",
    image: "/assets/categories/creative_08_nasal.webp",
    compounds: ["Semaglutide Spray", "Semax Spray", "Selank Spray"],
    purity: "≥99.3%",
    accentColor: "#0d9488", // Teal
  },
];

interface CategoriesSectionProps {
  categories?: CategoryCardData[];
}

export default function CategoriesSection({ categories: _unused }: CategoriesSectionProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"deck" | "grid">("deck");

  const carouselRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCardHover = (idx: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveIdx(idx);
    }, 40);
  };

  const handleCardSelect = (idx: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setActiveIdx(idx);
    if (carouselRef.current) {
      const cardEl = carouselRef.current.children[idx] as HTMLElement;
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardEl = container.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 12 : 300;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx >= 0 && newIdx < RESEARCH_CATEGORIES.length && newIdx !== activeIdx) {
      setActiveIdx(newIdx);
    }
  };

  const handlePrevCard = () => {
    const prev = Math.max(0, activeIdx - 1);
    handleCardSelect(prev);
  };

  const handleNextCard = () => {
    const next = Math.min(RESEARCH_CATEGORIES.length - 1, activeIdx + 1);
    handleCardSelect(next);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full overflow-x-clip">
      {/* Editorial Header with Research Tag and View Switcher */}
      <div className="advantages-title flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4E4E7] shadow-2xs mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#18181B]">
              RESEARCH CLASSIFICATIONS
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">|</span>
            <span className="text-[10px] font-medium text-neutral-500">8 Curated Pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-[#09090B] uppercase font-sans leading-tight">
            SELECT BY CATEGORY
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#71717A] max-w-xl leading-relaxed font-sans">
            Ultra-pure synthetic peptide sequences categorized by biological receptor pathway, analytical purity profile, and laboratory research application.
          </p>
        </div>

        {/* View Switcher Controls (Convenient for Both Mobile & Desktop) */}
        <div className="inline-flex items-center p-1 rounded-xl bg-white/90 border border-[#E4E4E7] shadow-2xs backdrop-blur-xs self-start md:self-end">
          <button
            type="button"
            onClick={() => setViewMode("deck")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              viewMode === "deck"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
            aria-label="Interactive Deck View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Deck</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              viewMode === "grid"
                ? "bg-black text-white shadow-xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-3 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {RESEARCH_CATEGORIES.map((cat, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={cat.number}
              type="button"
              onClick={() => handleCardSelect(idx)}
              onTouchStart={() => handleCardSelect(idx)}
              onMouseEnter={() => handleCardHover(idx)}
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer touch-manipulation ${
                isActive
                  ? "bg-neutral-900 text-white shadow-md scale-102 ring-2 ring-neutral-900/10"
                  : "bg-white/80 text-neutral-600 border border-neutral-200/90 hover:bg-white hover:text-neutral-950 hover:border-neutral-400"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full transition-transform duration-300"
                style={{
                  backgroundColor: cat.accentColor,
                  boxShadow: isActive ? `0 0 8px ${cat.accentColor}` : "none",
                }}
              />
              <span className="font-mono text-[10px] opacity-75">{cat.number}</span>
              <span>{cat.title.replace(/\n/g, " ")}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP DECK: HORIZONTAL CATERPILLAR OVERLAPPING CAPSULES             */}
      {/* ===================================================================== */}
      {viewMode === "deck" && (
        <div className="hidden lg:flex -space-x-3.5 xl:-space-x-4 h-[475px] w-full items-stretch select-none py-2 relative overflow-visible">
          {RESEARCH_CATEGORIES.map((cat, idx) => {
            const isExpanded = activeIdx === idx;
            const segmentZIndex = isExpanded ? 30 : idx < activeIdx ? 10 + idx : 25 - idx;

            return (
              <div
                key={cat.number}
                onClick={() => handleCardSelect(idx)}
                onTouchStart={() => handleCardSelect(idx)}
                onMouseEnter={() => handleCardHover(idx)}
                onFocus={() => handleCardSelect(idx)}
                tabIndex={0}
                style={{
                  zIndex: segmentZIndex,
                  flexGrow: isExpanded ? 3.8 : 1,
                  flexShrink: 1,
                  flexBasis: "0%",
                  boxShadow: isExpanded
                    ? `0 25px 55px -12px rgba(0,0,0,0.45), 0 0 40px ${cat.accentColor}25, inset 0 0 0 1px rgba(255,255,255,0.35)`
                    : undefined,
                }}
                className={`advantage-card relative rounded-[34px] xl:rounded-[38px] overflow-hidden transition-[flex-grow,transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group flex flex-col justify-between border will-change-[flex-grow,transform] ${
                  isExpanded
                    ? "border-black/20 scale-[1.01]"
                    : "shadow-[0_10px_24px_rgba(0,0,0,0.18)] bg-[#0B0D13] border-black/10 hover:border-black/25"
                }`}
              >
                {/* Background Image: Upright Real Amino Based Vial */}
                <Image
                  src={cat.image}
                  alt={cat.title.replace(/\n/g, " ")}
                  fill
                  sizes={isExpanded ? "(max-width: 1280px) 500px, 600px" : "140px"}
                  className={`object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform pointer-events-none ${
                    isExpanded
                      ? "scale-100 opacity-100"
                      : "scale-110 opacity-85 group-hover:opacity-95 group-hover:scale-105"
                  }`}
                  priority={idx < 4}
                />

                {/* Dark Gradient Overlay for Contrast */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none ${
                    isExpanded
                      ? "bg-gradient-to-t from-black/95 via-black/50 to-black/20 opacity-90"
                      : "bg-gradient-to-b from-black/85 via-black/40 to-black/85 opacity-85 group-hover:opacity-70"
                  }`}
                />

                {/* EXPANDED CONTENT LAYER */}
                <div
                  className={`absolute inset-0 z-10 flex flex-col justify-between p-6 xl:p-7 text-white transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isExpanded
                      ? "opacity-100 pointer-events-auto translate-y-0 scale-100 delay-100"
                      : "opacity-0 pointer-events-none translate-y-2 scale-[0.98] delay-0"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 min-w-[280px]">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-white text-black font-black font-mono text-xs flex items-center justify-center shadow-md">
                        {cat.number}
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[10px] font-semibold uppercase tracking-wider text-white">
                        <Activity className="w-3 h-3 text-[#38BDF8]" />
                        <span>{cat.pathway}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-[10px] font-mono font-bold text-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{cat.purity} Purity</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 min-w-[280px]">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mb-1 drop-shadow-md">
                      {cat.title.replace(/\n/g, " ")}
                    </h3>
                    <p className="text-xs text-neutral-300 line-clamp-1 mb-3.5 max-w-md font-sans">
                      {cat.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {cat.compounds.map((compound) => (
                        <span
                          key={compound}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white/95 transition-colors hover:bg-white/25"
                        >
                          {compound}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className="group/btn inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-95"
                    >
                      <span className="text-xs font-bold tracking-wide uppercase">
                        Explore {cat.title.replace(/\n/g, " ")}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* COLLAPSED SEGMENT LAYER */}
                <div
                  className={`absolute inset-0 z-10 flex flex-col justify-between items-center py-6 px-1 text-white transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isExpanded
                      ? "opacity-0 pointer-events-none -translate-y-2 scale-95 delay-0"
                      : "opacity-100 pointer-events-auto translate-y-0 scale-100 delay-75"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-mono text-xs font-bold flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-sm">
                    {cat.number}
                  </div>

                  <div className="[writing-mode:vertical-rl] flex items-center justify-center tracking-[0.22em] text-[11px] font-bold uppercase text-neutral-200 group-hover:text-white transition-colors duration-300 select-none py-2 my-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {cat.title.replace(/\n/g, " ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MOBILE SNAP CAROUSEL */}
      {viewMode === "deck" && (
        <div className="lg:hidden w-full">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar -mx-4 px-4 pb-3 pt-1 scroll-smooth touch-pan-x"
          >
            {RESEARCH_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.number}
                className="w-[84vw] max-w-[335px] shrink-0 snap-center rounded-[26px] overflow-hidden bg-white border border-neutral-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[16/11] bg-neutral-900 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title.replace(/\n/g, " ")}
                    fill
                    sizes="335px"
                    className="object-cover object-center"
                    priority={idx < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-white/95 text-black font-mono font-bold text-[11px] flex items-center justify-center shadow-xs">
                      {cat.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-semibold text-white uppercase tracking-wider">
                      {cat.pathway.split("&")[0]}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-[9px] font-mono font-bold text-emerald-300">
                      {cat.purity}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 z-10 flex items-end justify-between">
                    <span className="text-[9.5px] text-neutral-300 font-mono tracking-wider uppercase">
                      RESEARCH CLASSIFICATION
                    </span>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: cat.accentColor,
                        boxShadow: `0 0 6px ${cat.accentColor}`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1">
                      {cat.title.replace(/\n/g, " ")}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-1 mb-3">
                      {cat.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {cat.compounds.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200/80 text-[10px] font-medium text-neutral-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="inline-flex items-center justify-between w-full pt-2.5 border-t border-neutral-100 text-xs font-bold text-neutral-900 hover:text-black group active:scale-[0.98] transition-transform touch-manipulation"
                  >
                    <span>Explore {cat.title.replace(/\n/g, " ")}</span>
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5">
              {RESEARCH_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.number}
                  type="button"
                  onClick={() => handleCardSelect(i)}
                  aria-label={`Go to category ${cat.number}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIdx === i ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-neutral-500 mr-1.5">
                {activeIdx + 1} / {RESEARCH_CATEGORIES.length}
              </span>
              <button
                type="button"
                onClick={handlePrevCard}
                disabled={activeIdx === 0}
                aria-label="Previous Category"
                className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs active:scale-90 transition-transform touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextCard}
                disabled={activeIdx === RESEARCH_CATEGORIES.length - 1}
                aria-label="Next Category"
                className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs active:scale-90 transition-transform touch-manipulation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GRID VIEW: RESPONSIVE BENTO GRID (2-Col on Mobile, 4-Col on Desktop)  */}
      {/* ===================================================================== */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {RESEARCH_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.number}
              href={`/shop?category=${cat.slug}`}
              className="advantage-card group relative flex flex-col rounded-[20px] sm:rounded-2xl overflow-hidden bg-white border border-neutral-200/90 hover:border-black/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer"
            >
              {/* Media Container with 3D Artwork */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-neutral-900 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title.replace(/\n/g, " ")}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                  priority={idx < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Top Corner Badges */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5 sm:gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/95 text-black font-mono font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-xs">
                    {cat.number}
                  </span>
                  <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-semibold text-white uppercase tracking-wider">
                    {cat.pathway.split("&")[0]}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-[8.5px] sm:text-[9px] font-mono font-bold text-emerald-300">
                    {cat.purity}
                  </span>
                </div>

                {/* Bottom Image Overlay Label */}
                <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3 z-10 flex items-end justify-between">
                  <span className="text-[8.5px] sm:text-[10px] text-neutral-300 font-mono tracking-wider uppercase">
                    CLASSIFICATION
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: cat.accentColor,
                      boxShadow: `0 0 6px ${cat.accentColor}`,
                    }}
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 bg-white">
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-neutral-900 tracking-tight group-hover:text-black transition-colors mb-1 line-clamp-1">
                    {cat.title.replace(/\n/g, " ")}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500 line-clamp-1 mb-2 sm:mb-3">
                    {cat.subtitle}
                  </p>

                  {/* Compound Micro-Tags */}
                  <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                    {cat.compounds.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="px-1.5 sm:px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200/80 text-[9px] sm:text-[10px] font-medium text-neutral-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer with Link */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-neutral-800 group-hover:text-black">
                  <span>Explore</span>
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Global CTA Button */}
      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-4 pl-6 pr-2 py-2 sm:pl-7 sm:pr-2.5 sm:py-2.5 rounded-full bg-black text-white hover:bg-neutral-900 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-102 active:scale-95 cursor-pointer touch-manipulation"
        >
          <span className="text-xs sm:text-[13px] font-bold tracking-wide uppercase font-sans">
            Explore Complete Research Catalog
          </span>
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-300 shadow-xs">
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </span>
        </Link>
      </div>
    </div>
  );
}
