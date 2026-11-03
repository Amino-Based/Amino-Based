"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
  slug: string;
  image: string;
}

export const RESEARCH_CATEGORIES: ResearchCategoryItem[] = [
  {
    number: "01",
    title: "GLP-1 &\nMetabolic",
    subtitle: "METABOLIC &\nGLP-1",
    slug: "glp-1-metabolic-research-compounds",
    image: "/assets/categories/cylinder_bg_1.webp",
  },
  {
    number: "02",
    title: "Healing &\nRecovery",
    subtitle: "TISSUE\nREGENERATION",
    slug: "healing-recovery-research-compounds",
    image: "/assets/categories/cylinder_bg_2.webp",
  },
  {
    number: "03",
    title: "Longevity &\nAnti-Aging",
    subtitle: "SENESCENCE &\nTELOMERES",
    slug: "longevity-anti-aging-research-compounds",
    image: "/assets/categories/cylinder_bg_3.webp",
  },
  {
    number: "04",
    title: "Cognitive &\nNootropic",
    subtitle: "SYNAPTIC\nPLASTICITY",
    slug: "cognitive-nootropic-research-compounds",
    image: "/assets/categories/cylinder_bg_4.webp",
  },
  {
    number: "05",
    title: "Growth\nHormone\nSecretagogue",
    subtitle: "GHRH &\nSECRETIN",
    slug: "growth-hormone-secretagogue-research-compounds",
    image: "/assets/categories/cylinder_bg_5.webp",
  },
  {
    number: "06",
    title: "Sexual &\nHormonal",
    subtitle: "HORMONE\nPATHWAYS",
    slug: "sexual-hormonal-research-compounds",
    image: "/assets/categories/cylinder_bg_6.webp",
  },
  {
    number: "07",
    title: "Cosmetic &\nSkin",
    subtitle: "FIBROBLAST &\nMATRIX",
    slug: "cosmetic-skin-research-compounds",
    image: "/assets/categories/cylinder_bg_7.webp",
  },
  {
    number: "08",
    title: "Nasal\nSprays",
    subtitle: "SPRAY\nFORMATS",
    slug: "nasal-sprays",
    image: "/assets/categories/cylinder_bg_8.webp",
  },
];

interface CategoriesSectionProps {
  categories?: CategoryCardData[];
}

export default function CategoriesSection({ categories: _unused }: CategoriesSectionProps) {
  return (
    <div className="w-full">
      {/* Header Area matching reference image */}
      <div className="advantages-title flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-[#D4D4D8] shadow-2xs mb-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#18181B]">
              RESEARCH CLASSIFICATIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#09090B] uppercase font-sans">
            SELECT BY CATEGORY
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#71717A] max-w-md leading-relaxed font-sans">
          High-purity peptide sequences categorized by biological receptor pathway and analytical application.
        </p>
      </div>

      {/* The 8 Cylinders: True 3D Capsule Geometry matching reference design */}
      <div className="flex lg:grid lg:grid-cols-8 overflow-x-auto lg:overflow-visible overscroll-x-contain snap-x snap-mandatory no-scrollbar gap-2.5 sm:gap-3 xl:gap-3.5 pb-4 lg:pb-0 items-stretch -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {RESEARCH_CATEGORIES.map((cat, idx) => (
          <Link
            key={cat.number}
            href={`/shop?category=${cat.slug}`}
            className="advantage-card group relative flex flex-col justify-between overflow-hidden rounded-full min-w-[135px] sm:min-w-[145px] lg:min-w-0 flex-1 flex-shrink-0 snap-start min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] text-white shadow-[0_20px_36px_-8px_rgba(0,0,0,0.32),0_8px_16px_-6px_rgba(0,0,0,0.18)] hover:shadow-[0_28px_50px_-6px_rgba(0,0,0,0.48),0_12px_22px_-6px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2.5 bg-[#0C0D11] select-none"
          >
            {/* Composed Backdrop: Frosted Dome + High-Res Product Artwork + Rich Dark Pedestal */}
            <Image
              src={cat.image}
              alt={cat.title.replace(/\n/g, " ")}
              fill
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 150px, 140px"
              className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              priority={idx < 4}
            />

            {/* 3D Cylindrical Curvature Shading: Left specular highlight + right rim shadow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/26 via-transparent via-55% to-black/32 pointer-events-none z-[8]" />

            {/* Fine Inner Rim Reflection */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/18 pointer-events-none z-[9]" />

            {/* Top Semicircular Dome Number Badge (01 through 08) */}
            <div className="relative z-10 mx-auto pt-4 sm:pt-5 lg:pt-6">
              <span className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white text-[#09090B] font-bold text-xs sm:text-[13px] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                {cat.number}
              </span>
            </div>

            {/* Bottom Content Area: Typography, Divider, Subtitle, and Action Indicator */}
            <div className="relative z-10 flex flex-col items-center text-center mt-auto pb-6 sm:pb-7 lg:pb-8 pt-3 w-full px-2">
              {/* Category Title */}
              <h3 className="text-xs sm:text-[13px] lg:text-[13.5px] font-bold text-white leading-tight whitespace-pre-line tracking-tight px-0.5 group-hover:text-purple-200 transition-colors">
                {cat.title}
              </h3>

              {/* Thin White Divider Line */}
              <div className="w-9 sm:w-11 h-[1.5px] bg-white/70 my-2 group-hover:bg-white transition-colors" />

              {/* Uppercase Receptor Pathway Subtitle */}
              <p className="text-[8px] sm:text-[8.5px] lg:text-[9px] font-semibold text-white/85 tracking-[0.14em] uppercase whitespace-pre-line leading-tight mb-3">
                {cat.subtitle}
              </p>

              {/* Terracotta/Copper Dot & White Arrow Indicator */}
              <div className="flex items-center justify-center gap-1.5 text-white/90 group-hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E08A68] shadow-[0_0_6px_#E08A68]" />
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA Button matching reference */}
      <div className="mt-12 sm:mt-16 flex justify-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-5 pl-8 pr-3.5 py-3.5 rounded-full bg-black text-white hover:bg-neutral-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
        >
          <span className="text-sm font-semibold tracking-wide">
            Explore Complete Research Catalog
          </span>
          <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 shadow-md">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
