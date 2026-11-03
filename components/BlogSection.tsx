"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface BlogPostCardData {
  id: string | number;
  tag: string;
  date?: string;
  readTime?: string;
  title: string;
  excerpt?: string;
  image: string;
  slug: string;
  author?: string;
}

const DEFAULT_FEATURED_POST: BlogPostCardData = {
  id: "blog-post-1",
  tag: "Metabolic Research",
  readTime: "8 min read",
  title: "Mechanisms of GLP-1 & GIP Dual Receptor Agonism in Cellular Metabolic Research",
  excerpt:
    "An analytical review of incretin receptor co-agonism, examining how synergistic GLP-1 and GIP signaling pathways modulate cellular glucose kinetics, adipocyte lipid turnover, and hypothalamic satiety centers in vitro and in animal research models.",
  image: "/blog-1.jpg",
  slug: "glp1-gip-dual-agonist-metabolic-mechanisms",
  author: "by Amino Based",
};

const DEFAULT_GRID_POSTS: BlogPostCardData[] = [
  {
    id: "blog-post-2",
    tag: "Growth Research",
    title: "Solid-Phase Peptide Synthesis (SPPS) & Analytical Quality Assurance",
    excerpt:
      "A technical deep dive into Fmoc/tBu solid-phase peptide synthesis methodologies, post-cleavage purification protocols, reverse-phase HPLC verification, and mass spectrometry standards.",
    image: "/blog-2.jpg",
    slug: "spps-peptide-synthesis-quality-assurance",
  },
  {
    id: "blog-post-3",
    tag: "Recovery Protocols",
    title: "BPC-157 & TB-500: Comparative Molecular Pathways in Cellular Tissue Repair Models",
    excerpt:
      "Comparing the molecular signaling dynamics of Body Protection Compound 157 (BPC-157) and Thymosin Beta-4 (TB-500), detailing FAK and actin sequestering cascades.",
    image: "/blog-3.jpg",
    slug: "bpc157-tb500-cellular-repair-pathways",
  },
  {
    id: "blog-post-4",
    tag: "Stability Protocols",
    title: "Peptide Storage, Reconstitution & Stability Protocols: Preserving Structure",
    excerpt:
      "A comprehensive laboratory guide detailing optimal storage temperatures, bacteriostatic water reconstitution techniques, and pH equilibrium parameters required to prevent peptide aggregation.",
    image: "/about-image.jpg",
    slug: "peptide-storage-reconstitution-stability-protocols",
  },
];

interface BlogSectionProps {
  posts?: BlogPostCardData[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const featured =
    posts && posts.length > 0
      ? {
          ...DEFAULT_FEATURED_POST,
          ...posts[0],
          image: posts[0].image && posts[0].image !== "/placeholder-wide.svg" ? posts[0].image : DEFAULT_FEATURED_POST.image,
          author: "by Amino Based",
        }
      : DEFAULT_FEATURED_POST;

  const gridPosts =
    posts && posts.length > 1
      ? posts.slice(1, 4).map((p, idx) => ({
          ...DEFAULT_GRID_POSTS[idx % DEFAULT_GRID_POSTS.length],
          ...p,
          image: p.image && p.image !== "/placeholder-wide.svg" ? p.image : DEFAULT_GRID_POSTS[idx % DEFAULT_GRID_POSTS.length].image,
        }))
      : DEFAULT_GRID_POSTS;

  return (
    <section id="blog-section" className="w-full bg-[#FAFAFC] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-[#E4E4E7]/60">
      <div className="max-w-[1240px] mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          {/* Centered Pill Badge */}
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-white border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-5">
            <span className="text-xs font-semibold text-neutral-800 tracking-wide">
              Blog
            </span>
          </div>

          {/* Heading with Italic Serif Accent */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif font-normal tracking-tight text-neutral-900 leading-[1.15] max-w-2xl mx-auto">
            Practical reads to help <br className="hidden sm:inline" />
            you move <span className="font-serif italic font-normal text-neutral-900">faster.</span>
          </h2>
        </div>

        {/* Featured Post (Top Large Card) */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block w-full bg-white rounded-[28px] sm:rounded-[32px] border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-neutral-300 transition-all duration-300 mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
            
            {/* Left Column: Image with Smooth Desktop Edge Fade */}
            <div className="lg:col-span-5 relative w-full h-[280px] sm:h-[340px] lg:h-full min-h-[300px] lg:min-h-[380px] bg-neutral-100 overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/40 to-transparent hidden lg:block pointer-events-none" />
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-7 p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                {/* Category Pill */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F4F4F5] text-[11px] font-semibold text-neutral-700 tracking-wide mb-4">
                  {featured.tag}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal text-neutral-900 tracking-tight leading-snug mb-3.5 group-hover:text-neutral-700 transition-colors">
                  {featured.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-xl">
                  {featured.excerpt}
                </p>
              </div>

              {/* Bottom Meta Row */}
              <div className="flex items-center justify-between pt-8 sm:pt-10 border-t border-neutral-100 mt-6 sm:mt-8">
                {/* Read time */}
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  <span>{featured.readTime || "5 min read"}</span>
                </div>

                {/* Author Brand */}
                <span className="text-base sm:text-lg font-serif italic text-neutral-900 font-medium">
                  {featured.author || "by Amino Based"}
                </span>
              </div>
            </div>

          </div>
        </Link>

        {/* Bottom 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {gridPosts.map((post) => {
            const isReferenceAsset = post.image.includes("blog_ref_card");

            return (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="group bg-white rounded-[24px] sm:rounded-[28px] border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-neutral-300 transition-all duration-300"
              >
                <div>
                  {/* Card Thumbnail Container */}
                  <div className="relative w-full aspect-[4/3] rounded-[18px] sm:rounded-[20px] overflow-hidden bg-neutral-100 mb-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Floating Category Pill in Top Right (only shown if not already part of asset) */}
                    {!isReferenceAsset && (
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-medium text-neutral-800 shadow-xs border border-black/5">
                          {post.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Text Content */}
                  <div className="px-1.5 pb-2">
                    <h4 className="text-lg sm:text-xl font-serif font-normal text-neutral-900 leading-snug group-hover:text-neutral-700 transition-colors tracking-tight line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
