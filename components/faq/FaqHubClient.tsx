"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Search,
  ArrowDown,
  HelpCircle,
  ShieldCheck,
  Thermometer,
  Truck,
  Award,
  RotateCcw,
  CreditCard,
  Building2,
  ExternalLink,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FAQ_CATEGORIES,
  type FaqCategory,
  type FaqItem,
  type FaqAsset,
} from "@/lib/faqHubData";

// Helper to parse markdown links [text](url) inside answer paragraphs into React nodes
function renderParagraph(text: string, pIdx: number) {
  if (text.startsWith("<!--") && text.endsWith("-->")) {
    return <span key={pIdx} dangerouslySetInnerHTML={{ __html: text }} />;
  }

  // Parse markdown links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const linkText = match[1];
    const linkUrl = match[2];

    if (linkUrl.startsWith("http")) {
      parts.push(
        <a
          key={`${pIdx}-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#894EF2] hover:text-[#7C3AED] underline underline-offset-4 decoration-purple-300 font-medium inline-flex items-center gap-0.5"
        >
          {linkText}
          <ExternalLink className="w-3 h-3 inline-block ml-0.5 opacity-70" />
        </a>
      );
    } else {
      parts.push(
        <Link
          key={`${pIdx}-${match.index}`}
          href={linkUrl}
          className="text-[#894EF2] hover:text-[#7C3AED] underline underline-offset-4 decoration-purple-300 font-medium"
        >
          {linkText}
        </Link>
      );
    }
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <p key={pIdx} className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
      {parts}
    </p>
  );
}

// Icon helper by category
function getCategoryIcon(id: string) {
  switch (id) {
    case "trust-and-legitimacy":
      return <Building2 className="w-6 h-6 text-[#894EF2] shrink-0" />;
    case "ordering-and-payments":
      return <CreditCard className="w-6 h-6 text-amber-500 shrink-0" />;
    case "shipping-and-delivery":
      return <Truck className="w-6 h-6 text-sky-500 shrink-0" />;
    case "product-quality-and-coas":
      return <Award className="w-6 h-6 text-[#894EF2] shrink-0" />;
    case "storage-and-handling":
      return <Thermometer className="w-6 h-6 text-indigo-500 shrink-0" />;
    case "returns-refunds-and-order-changes":
      return <RotateCcw className="w-6 h-6 text-pink-500 shrink-0" />;
    case "legality-and-research-use":
      return <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />;
    default:
      return <HelpCircle className="w-6 h-6 text-[#894EF2] shrink-0" />;
  }
}

export default function FaqHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  // Open the first question of each major category by default for clean presentation
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "what-is-the-difference-between-a-research-peptide-supplier-and-a-clinical-peptide-provider": true,
    "do-you-offer-bulk-wholesale-or-discount-pricing": true,
    "how-long-does-shipping-take": true,
    "are-your-peptides-third-party-tested": true,
    "how-do-i-store-peptides-freezer-or-fridge-for-lyophilized-peptides": true,
    "do-you-offer-refunds-or-returns": true,
    "what-does-research-use-only-mean": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_CATEGORIES;
    const query = searchQuery.toLowerCase();

    return FAQ_CATEGORIES.map((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.plainAnswer.toLowerCase().includes(query)
      );
      return { ...category, items: matchingItems };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">
      {/* Search & Jump-link navigation */}
      <div className="bg-[#F6F7FB] border border-[#E4E4E7]/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
        <div className="relative">
          <Search className="w-5 h-5 text-[#894EF2] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions by keyword, compound (e.g. BPC-157, TB-500, storage, FDA, shipping)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E4E4E7] rounded-2xl text-[#0F0F11] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#894EF2] focus:ring-2 focus:ring-purple-200/50 text-sm transition-all shadow-2xs"
          />
        </div>

        {/* On this page jump links */}
        <div className="pt-4 border-t border-[#E4E4E7]/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#71717A]">
            <ArrowDown className="w-4 h-4 text-[#894EF2]" />
            <span>On this page</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {[
              { id: "trust-and-legitimacy", label: "Trust & legitimacy" },
              { id: "ordering-and-payments", label: "Ordering & payments" },
              { id: "shipping-and-delivery", label: "Shipping & delivery" },
              { id: "product-quality-and-coas", label: "Product quality & COAs" },
              { id: "storage-and-handling", label: "Storage & handling" },
              { id: "returns-refunds-and-order-changes", label: "Returns, refunds & changes" },
              { id: "legality-and-research-use", label: "Legality & research use" },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E4E4E7] hover:border-[#894EF2]/40 text-[#71717A] hover:text-[#894EF2] transition-all shadow-2xs"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Rendered Categories */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-[#F6F7FB] border border-[#E4E4E7]/70 rounded-3xl p-8">
          <HelpCircle className="w-12 h-12 text-[#894EF2] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F0F11] mb-2">No matching questions found</h3>
          <p className="text-[#71717A] text-sm mb-4">
            Try searching with another keyword or browse the categories below.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-5 py-2.5 bg-[#894EF2] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-full transition-all shadow-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        filteredCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-32 space-y-8"
          >
            {/* Category Header */}
            <div className="border-b border-[#E4E4E7] pb-6">
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#0F0F11] mb-3 flex items-center gap-3">
                {getCategoryIcon(category.id)}
                <span>{category.title}</span>
              </h2>
              <p className="text-[#71717A] text-sm md:text-base leading-relaxed max-w-4xl">
                {category.intro}
              </p>
            </div>

            {/* Reference Asset if present */}
            {category.asset && (
              <div id={category.asset.id} className="scroll-mt-32 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-medium text-[#0F0F11]">
                    {category.asset.title}
                  </h3>
                </div>

                {/* Asset Type 1: Stages */}
                {category.asset.type === "stages" && category.asset.stages && (
                  <div className="bg-[#F6F7FB] border border-[#E4E4E7]/70 rounded-3xl p-6 md:p-8 space-y-4 divide-y divide-[#E4E4E7]/60 shadow-2xs">
                    {category.asset.stages.map((stage, idx) => (
                      <div key={idx} className={idx > 0 ? "pt-4" : ""}>
                        <div className="font-semibold text-[#0F0F11] text-sm md:text-base mb-1">
                          {stage.label}
                        </div>
                        {stage.flag && (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: `<!-- OWNER FACT NEEDED: ${stage.flag} -->`,
                            }}
                          />
                        )}
                        {stage.body ? (
                          <div className="text-[#71717A] text-sm leading-relaxed">
                            {renderParagraph(stage.body, idx)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                {/* Asset Type 2: Rows */}
                {category.asset.type === "rows" && category.asset.rows && (
                  <div className="bg-[#F6F7FB] border border-[#E4E4E7]/70 rounded-3xl p-6 md:p-8 space-y-4 divide-y divide-[#E4E4E7]/60 shadow-2xs">
                    {category.asset.rows.map((row, idx) => (
                      <div key={idx} className={idx > 0 ? "pt-4" : ""}>
                        <div className="font-semibold text-[#0F0F11] text-sm md:text-base mb-1">
                          {row.label}
                        </div>
                        {row.flag && (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: `<!-- OWNER FACT NEEDED: ${row.flag} -->`,
                            }}
                          />
                        )}
                        {row.body ? (
                          <div className="text-[#71717A] text-sm leading-relaxed">
                            {renderParagraph(row.body, idx)}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                {/* Asset Type 3: Timeline */}
                {category.asset.type === "timeline" && category.asset.timelineRows && (
                  <div className="space-y-6">
                    <div className="bg-[#F6F7FB] border border-[#E4E4E7]/70 rounded-3xl p-6 md:p-8 space-y-6 divide-y divide-[#E4E4E7]/60 shadow-2xs">
                      {category.asset.timelineRows.map((row, idx) => (
                        <div key={idx} className={idx > 0 ? "pt-6" : ""}>
                          <div className="font-semibold text-[#894EF2] text-sm mb-3">
                            {row.label}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="md:col-span-1 text-[#71717A] font-medium">
                              <span className="text-[#0F0F11] font-semibold block mb-1">Date:</span>
                              {row.date}
                            </div>
                            <div className="md:col-span-3 space-y-3">
                              <div>
                                <span className="text-[#0F0F11] font-semibold block mb-1">Event:</span>
                                <p className="text-[#71717A] leading-relaxed">{row.event}</p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                                  <span className="text-emerald-700 font-semibold block text-xs uppercase tracking-wider mb-1">
                                    What it changed:
                                  </span>
                                  <p className="text-emerald-900 text-xs leading-relaxed">{row.changed}</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                                  <span className="text-red-700 font-semibold block text-xs uppercase tracking-wider mb-1">
                                    What it did NOT change:
                                  </span>
                                  <p className="text-red-900 text-xs leading-relaxed">{row.notChanged}</p>
                                </div>
                              </div>
                              <div className="text-xs text-[#A1A1AA] pt-1">
                                <span className="text-[#71717A] font-semibold">Primary source: </span>
                                {row.source}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {category.asset.closingLine && (
                      <div className="bg-[#F3F2F8] border border-[#E4E4E7] rounded-2xl p-4 text-xs sm:text-sm text-[#71717A] italic leading-relaxed">
                        {category.asset.closingLine}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Questions Accordion List (Matching Homepage FAQ Cards) */}
            <div className="flex flex-col gap-3.5">
              {category.items.map((item) => {
                const isOpen = !!openItems[item.id];
                return (
                  <div
                    key={item.id}
                    id={item.id}
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen
                        ? "bg-white border-purple-200/90 shadow-sm"
                        : "bg-[#F6F7FB] border-[#E4E4E7]/70 hover:bg-white hover:border-purple-200/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-medium text-[#0F0F11] leading-snug">
                        {item.question}
                      </span>
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7]/80 shadow-2xs flex items-center justify-center shrink-0 text-[#894EF2] transition-colors">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 stroke-[2.4]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-gray-100/80 space-y-3">
                            {item.paragraphs.map((p, pIdx) => renderParagraph(p, pIdx))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      {/* Visible Author Byline */}
      <div className="pt-8 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#894EF2]" />
          <span>Written &amp; Curated by: <strong className="text-[#0F0F11] font-medium">Amino Based Scientific Operations</strong></span>
        </div>
      </div>

      {/* Page Footer Disclaimers */}
      <div className="space-y-6 pt-6 border-t border-[#E4E4E7]">
        <p className="text-[#71717A] italic text-xs sm:text-sm leading-relaxed">
          This page covers a regulatory and operational picture that changes. It is general information, not legal or medical advice. For the current federal position, check FDA.gov and the Federal Register directly.
        </p>
        <div className="p-5 bg-[#F6F7FB] border border-[#E4E4E7]/70 rounded-2xl space-y-2">
          <p className="text-[#0F0F11] font-semibold text-xs sm:text-sm">
            Research Use Only.
          </p>
          <p className="text-[#71717A] text-xs sm:text-sm leading-relaxed">
            Products supplied by Amino Based are intended strictly for laboratory and in-vitro research by qualified professionals. They are not drugs, dietary supplements or cosmetics. They are not intended for human or animal consumption, and they are not for diagnostic, therapeutic or preventive use of any kind. No statement on this site has been evaluated by the Food and Drug Administration.
          </p>
        </div>
      </div>
    </div>
  );
}
