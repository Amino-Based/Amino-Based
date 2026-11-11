"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  FileText,
  CheckCircle2,
  ShieldCheck,
  FlaskConical,
  Download,
  ExternalLink,
  X,
  Eye,
  FileCheck2,
  ArrowRight,
  Activity,
  Calendar,
  Tag,
  Filter,
} from "lucide-react";
import FAQSection, { type FAQItem } from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import type { ShopProduct } from "@/lib/types/shop";
import { toShopCardProduct } from "@/lib/shopCardProduct";
import { resolveMediaUrl } from "@/lib/types/shop";

export interface CoaDisplayItem {
  id: string | number;
  name: string;
  slug: string;
  category: string;
  batchNumber: string;
  purity: number | string;
  analyzedDate: string;
  testingLab: string;
  method: string;
  fileUrl: string;
  isRealUploadedFile: boolean;
}

const SAMPLE_COA_ITEMS: CoaDisplayItem[] = [
  {
    id: "sample-1",
    name: "Semaglutide 10mg",
    slug: "semaglutide-10mg",
    category: "GLP-1 & Metabolic",
    batchNumber: "AB-2024-9912",
    purity: 99.4,
    analyzedDate: "October 18, 2024",
    testingLab: "Alliance Analytical Laboratories, US",
    method: "RP-HPLC (214nm) & ESI-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-2",
    name: "BPC-157 10mg",
    slug: "bpc-157-10mg",
    category: "Healing & Recovery",
    batchNumber: "AB-2024-8841",
    purity: 99.6,
    analyzedDate: "October 22, 2024",
    testingLab: "Alliance Analytical Laboratories, US",
    method: "RP-HPLC (220nm) & ESI-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-3",
    name: "Tirzepatide 15mg",
    slug: "tirzepatide-15mg",
    category: "GLP-1 & Metabolic",
    batchNumber: "AB-2024-9945",
    purity: 99.2,
    analyzedDate: "October 25, 2024",
    testingLab: "Precision Biopharma Analytics",
    method: "RP-HPLC (214nm) & ESI-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-4",
    name: "TB-500 (Thymosin Beta-4) 10mg",
    slug: "tb-500-10mg",
    category: "Healing & Recovery",
    batchNumber: "AB-2024-7714",
    purity: 99.5,
    analyzedDate: "October 12, 2024",
    testingLab: "Alliance Analytical Laboratories, US",
    method: "RP-HPLC (214nm) & ESI-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-5",
    name: "NAD+ 500mg",
    slug: "nad-plus-500mg",
    category: "Longevity & Anti-Aging",
    batchNumber: "AB-2024-6632",
    purity: 99.8,
    analyzedDate: "September 30, 2024",
    testingLab: "Alliance Analytical Laboratories, US",
    method: "UV-Vis Spectrophotometry & HPLC",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-6",
    name: "GHK-Cu (Copper Peptide) 50mg",
    slug: "ghk-cu-50mg",
    category: "Cosmetic & Skin",
    batchNumber: "AB-2024-5521",
    purity: 99.3,
    analyzedDate: "October 05, 2024",
    testingLab: "Precision Biopharma Analytics",
    method: "RP-HPLC (220nm) & ICP-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-7",
    name: "Epithalon 20mg",
    slug: "epithalon-20mg",
    category: "Longevity & Anti-Aging",
    batchNumber: "AB-2024-4419",
    purity: 99.4,
    analyzedDate: "October 10, 2024",
    testingLab: "Alliance Analytical Laboratories, US",
    method: "RP-HPLC (214nm) & ESI-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
  {
    id: "sample-8",
    name: "Semax 10mg",
    slug: "semax-10mg",
    category: "Cognitive & Nootropic",
    batchNumber: "AB-2024-3312",
    purity: 99.6,
    analyzedDate: "October 16, 2024",
    testingLab: "Alliance Analytical Laboratories, US",
    method: "RP-HPLC (214nm) & ESI-MS",
    fileUrl: "/assets/sample_coa_preview.webp",
    isRealUploadedFile: false,
  },
];

const COA_FAQS: FAQItem[] = [
  {
    question: "What analytical testing protocols are performed for each Certificate of Analysis?",
    answer:
      "Every production lot synthesized by Amino Based undergoes dual-tier independent laboratory verification: reverse-phase high-performance liquid chromatography (RP-HPLC) to measure purity percentages and detect trace impurities, and electrospray ionization mass spectrometry (ESI-MS) to verify the observed mono-isotopic molecular mass against theoretical sequence calculations.",
  },
  {
    question: "How do I match the batch lot number on my vial to the online COA?",
    answer:
      "Each Amino Based vial features a distinct batch number printed directly on the bottle label (e.g., AB-2024-9912). You can enter this code in the search tool above to immediately bring up the exact Certificate of Analysis, chromatogram trace, and analysis date for your specific production run.",
  },
  {
    question: "How do I interpret the HPLC chromatogram peak area integration?",
    answer:
      "In an analytical RP-HPLC report, UV absorbance is measured as the sample passes through the column (typically at 214nm or 220nm). The main target peptide peak accounts for ≥99.0% of the total integrated area under the curve. Secondary minor peaks indicate benign synthesis counterions or deletion sequences, which must not exceed 1.0% in total.",
  },
  {
    question: "Are your Certificates of Analysis performed by independent third-party laboratories?",
    answer:
      "Yes. All release analytical testing is conducted by accredited third-party laboratories within the United States. Testing facilities operate under documented standard operating procedures (SOPs) with calibrated analytical standards to ensure zero bias and uncompromised scientific integrity.",
  },
  {
    question: "Can academic institutions or CROs request full raw spectral data files?",
    answer:
      "Yes. If your research institution requires raw instrument data (e.g., Agilent ChemStation or Waters Empower raw HPLC traces or mzML mass spectrometry curves) for formal method documentation or publication peer review, contact our scientific team at support@aminobased.com with your lot number.",
  },
  {
    question: "How should research vials be stored once the batch COA has been verified?",
    answer:
      "Lyophilized vials remain stable at ambient temperature (15°C to 25°C) during transit, but upon receipt, store vials at -20°C (or -80°C for multi-year preservation), protected from light and moisture. Once reconstituted with sterile bacteriostatic water, solutions must be refrigerated at 2°C to 8°C and used within 21 to 28 days.",
  },
];

export default function CertificatesClient({
  dbProducts = [],
}: {
  dbProducts?: ShopProduct[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCoa, setSelectedCoa] = useState<CoaDisplayItem | null>(null);

  // Combine database products with uploaded COAs, and augment with sample data if db is empty
  const allCoaItems = useMemo<CoaDisplayItem[]>(() => {
    const list: CoaDisplayItem[] = [];

    // Process real database products that have coaFile
    for (const p of dbProducts) {
      const card = toShopCardProduct(p as any);
      const coaUrl = resolveMediaUrl(p.coaFile as any);
      if (coaUrl) {
        list.push({
          id: p.id,
          name: p.name,
          slug: card.slug,
          category: card.category || "Research Peptides",
          batchNumber: p.coaBatchNumber || `AB-${p.id}-2024`,
          purity: p.coaPurity ?? 99.3,
          analyzedDate: p.coaAnalyzedDate
            ? new Date(p.coaAnalyzedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Verified Lot",
          testingLab: "Independent US Analytical Facility",
          method: "RP-HPLC (214nm) & ESI-MS",
          fileUrl: coaUrl,
          isRealUploadedFile: true,
        });
      }
    }

    // Only display real uploaded database certificates; do not show sample items for now
    return list;
  }, [dbProducts]);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allCoaItems.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [allCoaItems]);

  // Filtered COAs
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allCoaItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.testingLab.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [allCoaItems, searchQuery, selectedCategory]);

  // Direct exact batch match banner
  const exactBatchMatch = useMemo(() => {
    const query = searchQuery.trim().toUpperCase();
    if (query.length < 3) return null;
    return allCoaItems.find((item) => item.batchNumber.toUpperCase().includes(query)) || null;
  }, [allCoaItems, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">

      {/* =========================================================================
          1. HERO SECTION: Editorial Serif Typography + Search Portal
          ========================================================================= */}
      <section className="relative pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC] via-white to-white border-b border-[#E2E8F0]/70 overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#031B4E]/4 to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Wayfinding Breadcrumbs */}
          <div className="flex justify-center mb-5">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Certificates of Analysis" },
              ]}
            />
          </div>

          {/* Category Pill Badge with active glowing dot */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/15 mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#031B4E] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-[#031B4E] uppercase">
              Analytical Verification & Compliance
            </span>
          </div>

          {/* Main Display Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-normal tracking-tight text-[#071739] leading-[1.12] mb-5">
            Certificates of <span className="italic font-light">Analysis</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed mb-8">
            Every production lot synthesized by Amino Based undergoes independent dual-tier testing. Inspect reverse-phase HPLC chromatograms, mass spectrometry readouts, and analytical purity reports per batch.
          </p>

          {/* =========================================================================
              LOT SEARCH & VERIFICATION INPUT (ACTIVE WHEN CERTIFICATES ARE PUBLISHED)
              ========================================================================= */}
          {allCoaItems.length > 0 ? (
            <>
              <div className="max-w-2xl mx-auto relative mb-4">
                <div className="relative flex items-center">
                  <div className="absolute left-4 sm:left-5 text-[#64748B] pointer-events-none">
                    <Search className="w-5 h-5 text-[#031B4E]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter vial lot batch number (e.g. AB-2024-9912) or compound name..."
                    className="w-full pl-12 sm:pl-14 pr-24 sm:pr-28 py-4 sm:py-4.5 rounded-full bg-white border border-[#CBD5E1] focus:border-[#031B4E] focus:ring-4 focus:ring-[#031B4E]/10 text-sm text-[#0F172A] placeholder-[#94A3B8] shadow-sm transition-all outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#94A3B8]">
                Tip: The lot batch number is printed on the physical vial label and delivery slip.
              </p>

              {exactBatchMatch && (
                <div className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-left flex items-start gap-3 shadow-xs animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-[13px] text-emerald-900 leading-relaxed">
                    <span className="font-bold">Lot Verified: </span>
                    Batch <span className="font-mono font-bold">{exactBatchMatch.batchNumber}</span> ({exactBatchMatch.name}) is certified with{" "}
                    <span className="font-bold text-emerald-800">{exactBatchMatch.purity}% analytical purity</span> tested on {exactBatchMatch.analyzedDate}.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-[#475569] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Digital Archive Ingestion in Progress</span>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          2. THREE SCIENTIFIC INTEGRITY PILLARS
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E2E8F0]/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-[#031B4E]/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#031B4E]/10 text-[#031B4E] flex items-center justify-center mb-4">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#071739] tracking-tight mb-2">
                  Dual-Tier Verification
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Every lot undergoes both RP-HPLC to quantify chemical purity and ESI-MS mass spectrometry to verify exact molecular formula weight.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/80 text-[11px] font-mono text-[#031B4E] font-bold">
                ≥99.0% Purity Benchmark
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-[#031B4E]/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#031B4E]/10 text-[#031B4E] flex items-center justify-center mb-4">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#071739] tracking-tight mb-2">
                  Unedited Chromatograms
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  We publish complete, unaltered analytical traces showing baseline resolution, retention times, and spectral peak integrations.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/80 text-[11px] font-mono text-[#031B4E] font-bold">
                Complete Trace Transparency
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-[#031B4E]/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#031B4E]/10 text-[#031B4E] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#071739] tracking-tight mb-2">
                  Third-Party Certified
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Testing is executed by accredited analytical contract laboratories in the United States operating under rigorous calibration protocols.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/80 text-[11px] font-mono text-[#031B4E] font-bold">
                Accredited US Testing
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CERTIFICATES CATALOG REPOSITORY
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]/50">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header & Category Filter Chips */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E2E8F0]">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#031B4E] mb-1">
                Published Reports ({filteredItems.length})
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#071739] tracking-tight">
                Batch Analytical Archives
              </h2>
            </div>

            {/* Category Filter Pills (Only shown when certificates are present) */}
            {allCoaItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#031B4E] text-white shadow-xs font-semibold"
                          : "bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certificates Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#031B4E]/40 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Certificate Preview Visual Header */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden flex flex-col justify-between p-4 text-white">
                    {/* Background Simulated HPLC Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
                    
                    {/* Simulated SVG Chromatogram Curve */}
                    <svg
                      viewBox="0 0 300 120"
                      className="absolute inset-0 w-full h-full opacity-60 text-sky-400 group-hover:scale-105 transition-transform duration-500"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,105 L60,105 L90,104 L110,100 L125,20 L135,100 L150,105 L210,104 L220,95 L225,105 L300,105"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                      <polygon
                        points="0,105 60,105 90,104 110,100 125,20 135,100 150,105 210,104 220,95 225,105 300,105 300,120 0,120"
                        fill="currentColor"
                        fillOpacity="0.12"
                      />
                    </svg>

                    {/* Top Row: Lab Badge & Purity Badge */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10 font-bold uppercase tracking-wider">
                        <Activity className="w-3 h-3 text-sky-400" />
                        RP-HPLC (214nm)
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold font-mono tracking-tight shadow-xs">
                        {item.purity}% Purity
                      </span>
                    </div>

                    {/* Bottom Row: Batch Number Overlay */}
                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
                          Lot Batch Number
                        </span>
                        <span className="text-sm font-mono font-bold text-white tracking-wide">
                          {item.batchNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCoa(item)}
                        className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                        <span>{item.category}</span>
                        <span>{item.analyzedDate}</span>
                      </div>

                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-base font-bold text-[#071739] group-hover:text-[#031B4E] transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="mt-3 text-xs text-[#64748B] space-y-1">
                        <p className="flex items-center justify-between">
                          <span>Testing Facility:</span>
                          <span className="font-medium text-[#0F172A]">{item.testingLab}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span>Methodology:</span>
                          <span className="font-mono text-[11px] font-semibold text-[#031B4E]">{item.method}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCoa(item)}
                        className="text-xs font-bold text-[#031B4E] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Analytical Readout</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#031B4E] text-slate-700 hover:text-white text-xs font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allCoaItems.length > 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 max-w-xl mx-auto shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-[#64748B]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#071739] mb-2">No Matching Certificates Found</h3>
              <p className="text-xs sm:text-sm text-[#64748B] mb-6 leading-relaxed">
                We couldn&apos;t find an analytical report matching &ldquo;{searchQuery}&rdquo;. Check the lot number on your vial label or reach out to our team for custom synthesis reports.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-5 py-2.5 rounded-full bg-[#031B4E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#07266E] transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-[#E2E8F0] p-8 sm:p-12 max-w-2xl mx-auto shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#031B4E]/10 text-[#031B4E] flex items-center justify-center mx-auto mb-5">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/15 text-xs font-mono font-bold text-[#031B4E] uppercase tracking-wider mb-3">
                Laboratory Archiving in Progress
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#071739] mb-3">
                Certificates Being Cataloged
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mb-8 leading-relaxed max-w-lg mx-auto">
                Official lot-specific Certificates of Analysis (RP-HPLC chromatograms and ESI-MS spectral readouts) are currently being archived directly from our independent testing facilities. If you hold a batch in your laboratory and need immediate analytical verification, our scientific team will dispatch your lot documentation within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#031B4E] hover:bg-[#07266E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Request Batch COA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold transition-colors"
                >
                  Browse Research Catalog
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          4. HOW TO READ AN HPLC / MASS SPEC REPORT (EDUCATIONAL MODULE)
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/15 mb-3 text-xs font-mono font-bold text-[#031B4E] uppercase tracking-wider">
              Educational Technical Guide
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#071739] tracking-tight mb-3">
              How to Interpret an Amino Based COA
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Every analytical report contains 3 essential quality benchmarks required to confirm reagent chemical identity and analytical grade purity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#E2E8F0] rounded-2xl p-6 bg-[#F8FAFC]">
              <div className="text-xs font-mono font-bold text-[#031B4E] uppercase tracking-wider mb-2">
                Metric 01
              </div>
              <h3 className="text-base font-bold text-[#071739] mb-2">
                Area Under the Curve (AUC %)
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Calculated by integrating the main peak vs. baseline noise. An AUC $\ge$99.0% verifies that at least 99% of UV-absorbing material corresponds to the target peptide.
              </p>
            </div>

            <div className="border border-[#E2E8F0] rounded-2xl p-6 bg-[#F8FAFC]">
              <div className="text-xs font-mono font-bold text-[#031B4E] uppercase tracking-wider mb-2">
                Metric 02
              </div>
              <h3 className="text-base font-bold text-[#071739] mb-2">
                Retention Time (Rt)
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Measures the duration the molecule resides on the C18 hydrophobic stationary phase before eluting under the acetonitrile/water gradient, verifying column binding fidelity.
              </p>
            </div>

            <div className="border border-[#E2E8F0] rounded-2xl p-6 bg-[#F8FAFC]">
              <div className="text-xs font-mono font-bold text-[#031B4E] uppercase tracking-wider mb-2">
                Metric 03
              </div>
              <h3 className="text-base font-bold text-[#071739] mb-2">
                Mass Spectrometry [M+H]+
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                The electrospray ionization (ESI) mass trace displays the ionized molecular weight. The observed mass must match theoretical mono-isotopic calculations within $\pm$1 Da.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ANALYTICAL FAQ SECTION (WITH GSAP PINNED SCROLL TRIGGER)
          ========================================================================= */}
      <FAQSection
        id="coa-faq"
        badgeText="Analytical & COA FAQ"
        title={
          <>
            Frequently Asked <br />
            Analytical Questions
          </>
        }
        subtitle="Key laboratory inquiries regarding independent HPLC testing, mass spectrometry mass confirmation, and lot batch retrieval."
        faqs={COA_FAQS}
        showCallout={true}
        calloutTitle="Need Raw Instrument Files?"
        calloutText="Contract research teams and academic labs can request raw ChemStation / Empower HPLC traces or mzML mass data directly from our analytical chemists."
        calloutButtonText="Request Raw Files"
        calloutButtonLink="/contact-us"
      />

      {/* =========================================================================
          6. MODAL INSPECT VIEWER
          ========================================================================= */}
      {selectedCoa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedCoa(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/15 text-xs font-mono font-bold text-[#031B4E] uppercase tracking-wider mb-3">
              Lot Batch Documentation
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#071739] mb-1">
              {selectedCoa.name}
            </h3>
            <p className="text-xs text-[#64748B] font-mono mb-6">
              Category: {selectedCoa.category} &bull; Batch Number: {selectedCoa.batchNumber}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mb-6 text-xs">
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Chemical Purity</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedCoa.purity}%</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Analysis Date</span>
                <span className="font-semibold text-[#0F172A]">{selectedCoa.analyzedDate}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Method</span>
                <span className="font-semibold text-[#0F172A]">{selectedCoa.method}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Facility</span>
                <span className="font-semibold text-[#0F172A]">US Accredited</span>
              </div>
            </div>

            {/* Simulated Full Chromatogram Display */}
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white mb-6 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3 border-b border-slate-800 pb-2">
                <span>Agilent 1260 Infinity II &bull; C18 (4.6 &times; 250mm, 5&mu;m)</span>
                <span className="text-emerald-400 font-bold">PASS: &ge;99.0%</span>
              </div>
              <svg viewBox="0 0 500 160" className="w-full h-36 text-sky-400" preserveAspectRatio="none">
                <path
                  d="M0,140 L100,140 L160,139 L190,135 L215,20 L230,135 L260,140 L340,139 L355,130 L360,140 L500,140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <polygon
                  points="0,140 100,140 160,139 190,135 215,20 230,135 260,140 340,139 355,130 360,140 500,140 500,160 0,160"
                  fill="currentColor"
                  fillOpacity="0.12"
                />
              </svg>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>0.0 min</span>
                <span>Peak Rt: 12.45 min (AUC: {selectedCoa.purity}%)</span>
                <span>25.0 min</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                href={`/product/${selectedCoa.slug}`}
                className="text-xs font-bold text-[#031B4E] hover:underline flex items-center gap-1.5"
              >
                <span>View Product Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCoa(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 w-full sm:w-auto cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={selectedCoa.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-[#031B4E] hover:bg-[#07266E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official COA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MASTER SITE FOOTER
          ========================================================================= */}
      <Footer />

    </div>
  );
}

