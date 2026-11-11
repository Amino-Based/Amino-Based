"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X, Calendar, Clock, FlaskConical, Check } from "lucide-react";
import type { BlogPost } from "@/lib/types/blog";
import { formatBlogDate, resolveBlogMediaUrl } from "@/lib/types/blog";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import Breadcrumbs from "@/components/nav/Breadcrumbs";

interface BlogListingClientProps {
  initialPosts: BlogPost[];
}

export default function BlogListingClient({ initialPosts }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialPosts]);

  // First post is featured
  const featuredPost = initialPosts[0];
  const gridPool = initialPosts.slice(1);

  // Filter gridPool by category and live search query (featured post is NEVER in the grid)
  const filteredGridPosts = useMemo(() => {
    return gridPool.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [gridPool, selectedCategory, searchQuery]);

  const visiblePosts = filteredGridPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGridPosts.length;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F0F11]">
      
      {/* =========================================================================
          HERO SECTION: Text-first + Hexagon Motif + Wide Lab Photo Overlay
          ========================================================================= */}
      <section className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E4E4E7]/70 overflow-hidden">
        
        {/* Faint oversized hexagon mark behind hero headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] sm:w-[580px] h-[460px] sm:h-[580px] pointer-events-none opacity-[0.035] hidden sm:block">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#071739] fill-none" strokeWidth="0.8">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
            <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="2,2" />
            <circle cx="50" cy="5" r="3" fill="#0096c8" />
            <circle cx="90" cy="25" r="3" fill="#0096c8" />
            <circle cx="90" cy="75" r="3" fill="#0096c8" />
            <circle cx="50" cy="95" r="3" fill="#0096c8" />
            <circle cx="10" cy="75" r="3" fill="#0096c8" />
            <circle cx="10" cy="25" r="3" fill="#0096c8" />
          </svg>
        </div>

        <div className="relative max-w-7xl lg:max-w-[1380px] mx-auto">
          
          {/* Wayfinding Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Research Archive" },
            ]}
            className="mb-4"
          />

          {/* Bond-line kicker */}
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#0096c8] mb-4">
            <svg className="w-4 h-4 stroke-[#0096c8] fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="4" cy="12" r="2" fill="#0096c8" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <circle cx="20" cy="12" r="2" fill="#0096c8" />
            </svg>
            <span>Amino Based Research Archive</span>
          </div>

          {/* Headline with serif-italic accent */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[58px] font-normal text-[#071739] tracking-tight leading-[1.12] mb-4 max-w-4xl">
            Peptide Science &amp; <span className="italic text-[#0096c8]">Research Protocols</span>
          </h1>

          <p className="text-base sm:text-lg text-[#52525B] max-w-2xl leading-relaxed mb-8 sm:mb-10 font-normal">
            Technical monographs on solid-phase peptide synthesis, class-B GPCR receptor kinetics, analytical HPLC standards, and laboratory stability protocols written by in-house research chemists.
          </p>

          {/* One Wide Rounded Lab Photo with frosted "Knowledge Base" overlay */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] lg:aspect-[32/9] rounded-[22px] sm:rounded-3xl overflow-hidden border border-[#E4E4E7] shadow-xs bg-[#F4F4F5] group">
            <Image
              src="/assets/blog_hero_wide.png"
              alt="Laboratory instrumentation and research peptide verification cleanroom"
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-[center_62%] group-hover:scale-101 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

            {/* Frosted "Knowledge Base" overlay pill */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#071739] shadow-xs border border-white/60">
                <span className="w-2 h-2 rounded-full bg-[#0096c8] animate-pulse" />
                <span>Knowledge Base &bull; Peer-Reviewed Standards</span>
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex items-center justify-between text-white text-xs sm:text-sm font-mono">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                RUO Analytical Monographs
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                Strictly Research Use Only
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          FEATURED LATEST ARTICLE CARD (Never repeated in the grid below)
          ========================================================================= */}
      {featuredPost && (
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAFAFC] border-b border-[#E4E4E7]">
          <div className="max-w-7xl lg:max-w-[1380px] mx-auto">
            
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0096c8] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0096c8]" />
              <span>Latest Research Feature</span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug ?? featuredPost.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs hover:shadow-md hover:border-[#0096c8]/40 transition-all duration-300"
            >
              <div className="lg:col-span-6 relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={resolveBlogMediaUrl(featuredPost.featuredImage) || "/blog-1.jpg"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                {/* Node-dot category label */}
                {featuredPost.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#0096c8] bg-[#0096c8]/10 border border-[#0096c8]/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0096c8]" />
                    <span>{featuredPost.category}</span>
                  </span>
                )}

                <div className="flex items-center gap-3 text-xs font-mono text-[#71717A]">
                  {featuredPost.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatBlogDate(featuredPost.publishedAt)}
                    </span>
                  )}
                  {featuredPost.readTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#071739] leading-tight group-hover:text-[#0096c8] transition-colors">
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p className="text-sm sm:text-base text-[#52525B] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#071739] group-hover:text-[#0096c8] transition-colors">
                    <span>Read Full Research Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

          </div>
        </section>
      )}

      {/* =========================================================================
          FILTER PILLS & LIVE SEARCH BAR
          ========================================================================= */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E4E4E7]/70 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl lg:max-w-[1380px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Filter Pills with Node-Dots */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#071739] text-white shadow-2xs"
                      : "bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7] hover:text-[#071739] border border-[#E4E4E7]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-[#0096c8]" : "bg-neutral-400"
                    }`}
                  />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(6);
              }}
              placeholder="Search research monographs..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F4F4F5] hover:bg-white focus:bg-white border border-[#E4E4E7] focus:border-[#0096c8] text-xs sm:text-sm text-[#071739] placeholder-[#71717A] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#071739]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          3-COLUMN GRID OF POST CARDS (Featured article NOT repeated here)
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFC]">
        <div className="max-w-7xl lg:max-w-[1380px] mx-auto">
          
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E4E4E7]">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#071739]">
              Research Monographs ({filteredGridPosts.length})
            </h2>
            {selectedCategory !== "All" && (
              <span className="text-xs font-mono text-[#0096c8]">
                Filtered by: {selectedCategory}
              </span>
            )}
          </div>

          {filteredGridPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-2xl bg-white border border-dashed border-[#E4E4E7]">
              <FlaskConical className="w-10 h-10 text-gray-400 mb-3" strokeWidth={1.5} />
              <h3 className="font-serif text-xl text-[#071739] mb-1">
                No matching monographs found
              </h3>
              <p className="text-xs sm:text-sm text-[#52525B] max-w-sm mb-4">
                No articles match your current search query &quot;{searchQuery}&quot; in {selectedCategory}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-full bg-[#071739] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* 3-Column Flat Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {visiblePosts.map((post) => {
                  const postImageUrl = resolveBlogMediaUrl(post.featuredImage) || "/blog-1.jpg";
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug ?? post.id}`}
                      className="group flex flex-col p-5 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs hover:shadow-md hover:border-[#0096c8]/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {/* Image container */}
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-gray-100">
                        <img
                          src={postImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                        />
                        {post.category && (
                          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider text-[#071739] uppercase shadow-2xs border border-white/60 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0096c8]" />
                            <span>{post.category}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          {/* Date and Read Time in Mono */}
                          <div className="flex items-center gap-3 text-xs font-mono text-[#71717A] mb-2.5">
                            {post.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatBlogDate(post.publishedAt)}
                              </span>
                            )}
                            {post.readTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#071739] leading-snug group-hover:text-[#0096c8] transition-colors mb-2.5">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed line-clamp-3 mb-5 font-normal">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#071739] group-hover:text-[#0096c8] transition-colors mt-auto pt-2 border-t border-[#F1F5F9]">
                          <span>Read Full Article</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Working Load More Button */}
              {hasMore && (
                <div className="text-center mt-12 sm:mt-16">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-xs sm:text-sm font-bold text-[#071739] hover:border-[#0096c8]/50 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Load More Monographs</span>
                    <span className="font-mono text-xs text-[#71717A]">
                      ({filteredGridPosts.length - visibleCount} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* =========================================================================
          EXACTLY ONE NEWSLETTER CTA ON THE PAGE
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E4E4E7]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xs">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0096c8]/10 border border-[#0096c8]/25 text-[#0096c8] font-mono text-xs uppercase tracking-wider font-bold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096c8]" />
            <span>Amino Based Research Dispatch</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#071739] tracking-tight mb-3">
            Receive Peer-Reviewed Peptide Monographs
          </h2>

          <p className="text-sm sm:text-base text-[#52525B] max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Subscribe to our scientific bulletin for in-depth syntheses analyses, HPLC purity benchmarks, and analytical protocols delivered directly to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex items-center relative">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="researcher@institution.edu"
              required
              className="w-full pl-5 pr-28 py-3.5 rounded-full bg-white border border-[#E4E4E7] focus:border-[#0096c8] text-xs sm:text-sm text-[#071739] placeholder-[#94A3B8] outline-none shadow-xs transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-5 py-2 rounded-full bg-[#071739] hover:bg-[#031B4E] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          {newsletterSubscribed && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you. You have been added to the research dispatch.</span>
            </div>
          )}

          <p className="text-[11px] text-[#94A3B8] font-mono mt-4">
            Strictly Research Use Only &bull; No marketing spam &bull; Unsubscribe anytime
          </p>
        </div>
      </section>

      {/* =========================================================================
          BLOG RESEARCH & METHODOLOGY FAQ SECTION
          ========================================================================= */}
      <FAQSection
        id="blog-faq"
        badgeText="Scientific & Literature FAQ"
        title={
          <>
            Research Inquiries & <br />
            Methodology
          </>
        }
        subtitle="Key scientific guidance regarding peptide analytical literature, HPLC chromatogram interpretation, and laboratory compliance standards."
        calloutTitle="Have a Specific Literature Question?"
        calloutText="Can't find the citation or synthesis protocol you need? Send an inquiry directly to our scientific writing and technical review team."
        calloutButtonText="Contact Science Team"
        calloutButtonLink="/contact-us"
      />

      {/* =========================================================================
          RUO FOOTER DISCLAIMER
          ========================================================================= */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#FAFAFC] border-t border-[#E4E4E7]">
        <div className="max-w-7xl lg:max-w-[1380px] mx-auto rounded-2xl bg-white border border-[#E4E4E7] p-5 sm:p-6 text-xs text-[#52525B] leading-relaxed">
          <p>
            <strong className="text-[#071739] font-bold uppercase font-mono mr-1.5">
              Research Use Only (RUO) Notice:
            </strong>
            The educational materials, biochemical pathways, and analytical monographs published in the Amino Based Knowledge Base are prepared solely for qualified scientific researchers and academic institutions. Products referenced are designated strictly for in vitro laboratory research and are not approved for human or veterinary diagnostic or therapeutic applications.
          </p>
        </div>
      </section>

      {/* MASTER SITE FOOTER */}
      <Footer />

    </div>
  );
}