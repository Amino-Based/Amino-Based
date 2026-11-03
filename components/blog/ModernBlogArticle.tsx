"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Mail,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/lib/types/blog";
import { formatBlogDate, resolveBlogMediaUrl } from "@/lib/types/blog";
import Footer from "@/components/Footer";

interface ModernBlogArticleProps {
  post: BlogPost;
  allPosts: BlogPost[];
  slug: string;
}

export default function ModernBlogArticle({ post, allPosts, slug }: ModernBlogArticleProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // TOC items: every H2 in structuredSections + limitations + conclusion + ruo + faqs + references
  const tocItems = React.useMemo(() => {
    const list: { id: string; label: string }[] = [];

    // Body question H2s
    (post.structuredSections ?? []).forEach((sec) => {
      list.push({ id: sec.id, label: sec.heading });
    });

    if (post.limitations && post.limitations.length > 0) {
      list.push({ id: "section-limitations", label: "Research Scope & Limitations" });
    }

    if (post.conclusion) {
      list.push({ id: "section-conclusion", label: "Conclusion & Research Bottom Line" });
    }

    list.push({ id: "section-ruo", label: "Research Use Only (RUO) Compliance" });

    if (post.faqs && post.faqs.length > 0) {
      list.push({ id: "section-faqs", label: "Frequently Asked Questions" });
    }

    if (post.references && post.references.length > 0) {
      list.push({ id: "section-references", label: "Primary Scientific References" });
    }

    return list;
  }, [post]);

  // Scrollspy tracking
  useEffect(() => {
    const handleScroll = () => {
      const items = tocItems.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSectionId(item.id);
            return;
          }
        }
      }

      if (tocItems[0]) {
        setActiveSectionId(tocItems[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Resolve related posts: 3 posts in the same category (or closest fallback), never linking to missing post
  const relatedPosts = React.useMemo(() => {
    const matching = allPosts.filter(
      (p) => (p.slug ?? p.id) !== slug && p.category?.toLowerCase() === post.category?.toLowerCase()
    );
    const fallbacks = allPosts.filter(
      (p) => (p.slug ?? p.id) !== slug && !matching.some((m) => m.id === p.id)
    );
    return [...matching, ...fallbacks].slice(0, 3);
  }, [allPosts, post.category, slug]);

  const imageUrl = resolveBlogMediaUrl(post.featuredImage) || "/blog-1.jpg";

  return (
    <div className="min-h-screen bg-white text-[#0F0F11]">
      
      {/* =========================================================================
          1. BACK LINK, H1, AND META STRIP (Exact Spec Order)
          ========================================================================= */}
      <header className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E4E4E7]/70">
        
        {/* Faint oversized hexagon mark behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] sm:w-[540px] h-[460px] sm:h-[540px] pointer-events-none opacity-[0.035] hidden sm:block">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#071739] fill-none" strokeWidth="0.8">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
            <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="2,2" />
          </svg>
        </div>

        <div className="relative max-w-7xl lg:max-w-[1380px] mx-auto">
          
          {/* Back link to blog listing */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0096c8] hover:text-[#0284c7] font-bold transition-colors group mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Research Archive</span>
          </Link>

          {/* H1 Article Title (with serif-italic accent) */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#071739] tracking-tight leading-[1.14] mb-6 max-w-5xl">
            {post.title}
          </h1>

          {/* Meta Strip: Category, Publication Date, Last-Updated, Read Time, Team Byline */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-[#52525B] pt-2 border-t border-[#E4E4E7]/70">
            
            {/* Node-dot category label */}
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#0096c8] bg-[#0096c8]/10 border border-[#0096c8]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0096c8]" />
                <span>{post.category}</span>
              </span>
            )}

            {/* Publication Date */}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 bg-[#F4F4F5] px-3 py-1 rounded-full border border-[#E4E4E7]">
                <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
                <span>Published: {formatBlogDate(post.publishedAt)}</span>
              </span>
            )}

            {/* Last-Updated Date */}
            {post.updatedAt && (
              <span className="flex items-center gap-1.5 bg-[#F4F4F5] px-3 py-1 rounded-full border border-[#E4E4E7]">
                <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                <span>Updated: {formatBlogDate(post.updatedAt)}</span>
              </span>
            )}

            {/* Read Time */}
            {post.readTime && (
              <span className="flex items-center gap-1.5 bg-[#F4F4F5] px-3 py-1 rounded-full border border-[#E4E4E7]">
                <BookOpen className="w-3.5 h-3.5 text-[#71717A]" />
                <span>{post.readTime}</span>
              </span>
            )}

            {/* Team Byline (Exact rule: Never invent a named author) */}
            <span className="text-xs text-[#071739] font-sans font-semibold">
              By Amino Based Research Team &bull;{" "}
              <span className="text-[#52525B] font-normal">reviewed by in-house research chemists</span>
            </span>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. HERO IMAGE WITH DESCRIPTIVE ALT TEXT
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-[#FAFAFC] border-b border-[#E4E4E7]">
        <div className="max-w-7xl lg:max-w-[1380px] mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E4E4E7] bg-white shadow-xs">
            <div className="aspect-[21/9] sm:aspect-[24/9] w-full relative">
              <img
                src={imageUrl}
                alt={post.featuredImage && typeof post.featuredImage === "object" && post.featuredImage.alt ? post.featuredImage.alt : `${post.title} laboratory research figure`}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-3 sm:p-4 text-xs font-mono text-[#52525B] bg-white border-t border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-[#071739]">
                Laboratory Analytical Figure: HPLC Verification and Receptor Interaction Assay
              </span>
              <span className="text-[#0096c8] font-bold">
                Amino Based Laboratory Quality Standard (RUO)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. KEY TAKEAWAYS BOX (5-6 bullets, each a standalone citable fact with molecule bullets)
          ========================================================================= */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
          <div className="max-w-7xl lg:max-w-[1380px] mx-auto">
            <div className="rounded-2xl sm:rounded-3xl bg-[#FAFAFC] border border-[#E4E4E7] p-6 sm:p-8 lg:p-10 shadow-2xs">
              
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0096c8] mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Key Laboratory Findings</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight mb-6 pb-4 border-b border-[#E4E4E7]">
                Key Takeaways
              </h2>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 list-none p-0">
                {post.keyTakeaways.map((item, idx) => (
                  <li
                    key={item.id ?? idx}
                    className="p-5 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs flex items-start gap-3.5 text-sm sm:text-base text-[#334155] leading-relaxed"
                  >
                    {/* Hexagon-molecule bullet motif */}
                    <span className="w-5 h-5 shrink-0 mt-0.5 text-[#0096c8]" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="2">
                        <polygon points="12,2 20,6.5 20,15.5 12,20 4,15.5 4,6.5" />
                        <circle cx="12" cy="11" r="2" fill="#0096c8" />
                      </svg>
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          4. STICKY "IN THIS ARTICLE" TOC WITH SCROLLSPY + 5-9 BODY SECTIONS
          ========================================================================= */}
      <section className="w-full !pl-0 pr-4 sm:pr-6 lg:pr-10 xl:pr-16 py-10 sm:py-14 bg-[#FAFAFC] border-t border-[#E4E4E7]">
        <div className="w-full flex flex-col md:flex-row items-start gap-8 lg:gap-10 xl:gap-14">
          
          {/* 4. STICKY "IN THIS ARTICLE" TABLE OF CONTENTS (Docked 100% Flush to Left Screen Edge) */}
          <aside className="w-full md:w-[280px] lg:w-[310px] xl:w-[340px] shrink-0 md:sticky md:top-24 space-y-6 !pl-0 !ml-0">
            <div className="rounded-none rounded-r-2xl bg-white border-y border-r border-l-0 border-[#E4E4E7] p-5 sm:p-6 pl-5 sm:pl-7 pr-5 sm:pr-6 shadow-sm">
              
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#071739] mb-4 pb-3 border-b border-[#E4E4E7]">
                <Layers className="w-4 h-4 text-[#0096c8]" />
                <span>In This Article</span>
              </div>

              <nav className="space-y-1.5" aria-label="Table of contents">
                {tocItems.map((item, idx) => {
                  const isActive = activeSectionId === item.id;
                  const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer leading-snug ${
                        isActive
                          ? "bg-[#F0F9FF] text-[#0096c8] font-bold border border-[#BAE6FD]"
                          : "text-[#52525B] hover:text-[#071739] hover:bg-[#F4F4F5] border border-transparent font-medium"
                      }`}
                    >
                      <span className="font-mono text-xs opacity-70 shrink-0 mt-0.5">
                        {numStr}.
                      </span>
                      <span className="line-clamp-2">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

            </div>
          </aside>

          {/* MAIN BODY STREAM (Expanded into Remaining Screen Width) */}
          <div className="flex-1 min-w-0 max-w-5xl xl:max-w-6xl space-y-12">
            
            {/* =========================================================================
                5. SHORT ANSWER (2-3 sentences direct answer) THEN INTRO AND SCOPE
                ========================================================================= */}
            <section className="rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0096c8]">
                <span className="w-2 h-2 rounded-full bg-[#0096c8]" />
                <span>Short Answer // Direct Synthesis</span>
              </div>

              <p className="text-base sm:text-lg text-[#071739] font-medium leading-relaxed">
                {post.shortAnswer || post.excerpt}
              </p>

              {post.introScope && (
                <div className="pt-4 border-t border-[#F1F5F9] text-sm sm:text-base text-[#52525B] leading-relaxed font-normal">
                  <strong className="text-[#071739] font-semibold block mb-1">
                    Introduction &amp; Research Scope:
                  </strong>
                  <p>{post.introScope}</p>
                </div>
              )}
            </section>

            {/* =========================================================================
                6. BODY SECTIONS: Question-form H2s, H3s, Evidence Table, Captioned Visual
                ========================================================================= */}
            {(post.structuredSections ?? []).map((sec) => (
              <article key={sec.id} id={sec.id} className="scroll-mt-28 space-y-6">
                
                {/* Question-form H2 */}
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight leading-snug pb-3 border-b border-[#E4E4E7]">
                  {sec.heading}
                </h2>

                {sec.content && (
                  <p className="text-base sm:text-lg text-[#334155] leading-relaxed font-normal">
                    {sec.content}
                  </p>
                )}

                {/* H3 Subsections */}
                {(sec.subsections ?? []).map((sub, sIdx) => (
                  <div key={sIdx} className="space-y-2 pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#071739] tracking-tight">
                      {sub.heading}
                    </h3>
                    <p className="text-base sm:text-lg text-[#334155] leading-relaxed font-normal">
                      {sub.content}
                    </p>
                  </div>
                ))}

                {/* Evidence or Comparison Table */}
                {sec.table && (
                  <div className="my-6 rounded-2xl overflow-hidden border border-[#E4E4E7] bg-white shadow-2xs">
                    {sec.table.caption && (
                      <div className="p-3.5 bg-[#F8FAFC] border-b border-[#E4E4E7] text-xs font-mono font-bold uppercase tracking-wider text-[#071739]">
                        Table: {sec.table.caption}
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#F1F5F9] text-[#071739] font-semibold border-b border-[#E4E4E7]">
                          <tr>
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3 sm:p-4 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E4E7] text-[#334155]">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#F8FAFC]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3 sm:p-4">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Captioned in-body visual with descriptive alt text */}
                {sec.image && (
                  <figure className="my-6 rounded-2xl overflow-hidden border border-[#E4E4E7] bg-white shadow-2xs">
                    <img
                      src={sec.image.url}
                      alt={sec.image.alt}
                      className="w-full h-[260px] sm:h-[340px] object-cover"
                    />
                    {sec.image.caption && (
                      <figcaption className="p-3.5 text-xs text-center text-[#52525B] font-mono bg-[#FAFAFC] border-t border-[#E4E4E7]">
                        {sec.image.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

              </article>
            ))}

            {/* =========================================================================
                7. LIMITATIONS SECTION: What the guide does not cover / evidence does not support
                ========================================================================= */}
            {post.limitations && post.limitations.length > 0 && (
              <section id="section-limitations" className="scroll-mt-28 space-y-4 rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight pb-3 border-b border-[#E4E4E7]">
                  Research Scope &amp; Limitations
                </h2>
                <p className="text-xs sm:text-sm text-[#52525B] font-normal leading-relaxed">
                  To ensure scientific precision and compliance with laboratory testing parameters, the scope of this technical monograph is bound by the following boundaries:
                </p>
                <ul className="space-y-2.5 list-disc list-inside text-sm sm:text-base text-[#334155] leading-relaxed">
                  {post.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* =========================================================================
                8. HEADED CONCLUSION / BOTTOM LINE + LINK TO NEXT LOGICAL READ
                ========================================================================= */}
            {post.conclusion && (
              <section id="section-conclusion" className="scroll-mt-28 space-y-4 rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight pb-3 border-b border-[#E4E4E7]">
                  Conclusion &amp; Research Bottom Line
                </h2>
                <p className="text-base sm:text-lg text-[#334155] leading-relaxed font-normal">
                  {post.conclusion}
                </p>

                {post.nextRead && (
                  <div className="pt-4 border-t border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0096c8]">
                      Next in the Series:
                    </span>
                    <Link
                      href={`/blog/${post.nextRead.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#071739] hover:text-[#0096c8] transition-colors group"
                    >
                      <span>{post.nextRead.title}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* =========================================================================
                9. HEADED RESEARCH USE ONLY BLOCK IN BODY (BEFORE FAQ)
                ========================================================================= */}
            <section id="section-ruo" className="scroll-mt-28 space-y-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#92400E] tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span>Research Use Only (RUO) Compliance Notice</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#78350F] leading-relaxed font-normal">
                {post.ruoStatement ||
                  "All peptide compounds, molecular pathways, and chemical structures discussed in this article are presented exclusively for in vitro laboratory research and academic study. Amino Based does not provide dosing, reconstitution protocols, therapeutic guidance, or human administration information under any circumstances."}
              </p>
            </section>

            {/* =========================================================================
                10. FAQ ACCORDION (10-12 Questions, Direct-Answer Opening)
                ========================================================================= */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="section-faqs" className="scroll-mt-28 space-y-6">
                <div className="border-b border-[#E4E4E7] pb-3">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs sm:text-sm text-[#52525B] mt-1 font-normal">
                    Direct-answer responses to common biochemical and analytical inquiries.
                  </p>
                </div>

                <div className="space-y-3">
                  {post.faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={faq.id ?? index}
                        className={`rounded-2xl transition-all border ${
                          isOpen
                            ? "bg-white border-[#0096c8]/50 shadow-xs"
                            : "bg-white border-[#E4E4E7] hover:border-[#0096c8]/30"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm sm:text-base font-semibold text-[#071739] leading-snug">
                            {faq.question}
                          </span>
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isOpen
                                ? "bg-[#0096c8] text-white"
                                : "bg-[#F4F4F5] text-[#52525B]"
                            }`}
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#F1F5F9]">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* =========================================================================
                11. NUMBERED REFERENCES LIST (Primary Sources Only)
                ========================================================================= */}
            {post.references && post.references.length > 0 && (
              <section id="section-references" className="scroll-mt-28 space-y-4 pt-4 border-t border-[#E4E4E7]">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight">
                  Primary Scientific References
                </h2>

                <ol className="space-y-3 list-none p-0">
                  {post.references.map((ref, idx) => (
                    <li
                      key={ref.id ?? idx}
                      className="p-4 rounded-xl bg-white border border-[#E4E4E7] text-xs sm:text-sm text-[#334155] flex items-start justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-[#0096c8] font-bold shrink-0 mt-0.5">
                          [{idx + 1}]
                        </span>
                        <span className="leading-relaxed">{ref.citationText}</span>
                      </div>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-[#0096c8] hover:text-[#0284c7] shrink-0 p-1 rounded hover:bg-[#F0F9FF] transition-colors"
                        title="View primary publication"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* =========================================================================
                12. TEAM AUTHOR BOX (Team Name, Reviewer Line, Contact, Last-Updated Date)
                ========================================================================= */}
            <section className="rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#071739] flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#0096c8]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#071739]">
                    Amino Based Research Team
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52525B]">
                    Reviewed by in-house research chemists &bull; Analytical Quality Assurance
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#71717A] pt-2">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#0096c8]" />
                      <a href="mailto:research@aminobased.com" className="hover:underline text-[#071739]">
                        research@aminobased.com
                      </a>
                    </span>
                    {post.updatedAt && (
                      <span>Last Updated: {formatBlogDate(post.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================================
                13. RELATED POSTS: 3 Cards that Return to the Listing Filtered by Category
                ========================================================================= */}
            {relatedPosts.length > 0 && (
              <section className="space-y-6 pt-4 border-t border-[#E4E4E7]">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight">
                    Related Research Monographs
                  </h2>
                  {post.category && (
                    <Link
                      href={`/blog?category=${encodeURIComponent(post.category)}`}
                      className="text-xs font-mono text-[#0096c8] hover:underline font-semibold"
                    >
                      View all in {post.category} &rarr;
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug ?? rel.id}`}
                      className="group flex flex-col p-4 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs hover:border-[#0096c8]/40 hover:shadow-xs transition-all"
                    >
                      <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img
                          src={resolveBlogMediaUrl(rel.featuredImage) || "/blog-1.jpg"}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#0096c8] font-bold uppercase mb-1">
                        {rel.category}
                      </span>
                      <h3 className="font-serif text-base font-normal text-[#071739] group-hover:text-[#0096c8] transition-colors line-clamp-2 mb-2 leading-snug">
                        {rel.title}
                      </h3>
                      <span className="text-xs font-semibold text-[#071739] group-hover:text-[#0096c8] transition-colors mt-auto flex items-center gap-1">
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* =========================================================================
                14. ONE CLOSING CTA (Do not add a second newsletter block inside the article)
                ========================================================================= */}
            <section className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-8 sm:p-10 text-center space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#071739] tracking-tight">
                Inquire About Analytical Compound Standards
              </h2>
              <p className="text-xs sm:text-sm text-[#52525B] max-w-xl mx-auto leading-relaxed font-normal">
                All Amino Based peptides undergo rigorous HPLC and mass spectrometry testing to ensure verified &ge;99% purity. Browse our laboratory catalog or request lot-specific analytical certificates.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-2.5 rounded-full bg-[#071739] hover:bg-[#031B4E] text-white text-xs font-semibold transition-colors"
                >
                  Explore Research Catalog
                </Link>
                <Link
                  href="/certificates"
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#071739] text-xs font-semibold transition-colors"
                >
                  Verify Lot COA Reports
                </Link>
              </div>
            </section>

          </div>

        </div>
      </section>

      {/* MASTER SITE FOOTER */}
      <Footer />

    </div>
  );
}