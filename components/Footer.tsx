"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface FooterProps {
  giantText?: string;
  brandTitle?: string;
  scrollReveal?: boolean;
}

export default function Footer({
  giantText = "Amino Based",
  brandTitle = "Amino Based",
  scrollReveal = false,
}: FooterProps = {}) {
  const brand = brandTitle || "Amino Based";
  const wordmark = giantText || brand;

  const containerRef = useRef<HTMLDivElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const mainFooterRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      if (!scrollReveal || !containerRef.current) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const isMobile = window.innerWidth < 640;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: isMobile ? "top 95%" : "top 85%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      if (ctaCardRef.current) {
        tl.fromTo(
          ctaCardRef.current,
          { y: 25, opacity: 0.8 },
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.8 },
          0
        );
      }

      if (mainFooterRef.current) {
        tl.fromTo(
          mainFooterRef.current,
          { y: 35, opacity: 0.85 },
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.9 },
          0.05
        );
      }

      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { y: 25, opacity: 0.5 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 1 },
          0.1
        );
      }
    },
    { scope: containerRef, dependencies: [scrollReveal] }
  );

  // Responsive SVG viewBox and font size: clipped in exact ratio requested (crossbar visible, 0px bottom gap)
  const isShortWord = wordmark.trim().length <= 6;
  const viewBoxWidth = isShortWord ? 1000 : 1360;
  const fontSize = isShortWord ? 220 : 170;
  const viewBoxHeight = isShortWord ? 135 : 104;
  const baselineY = isShortWord ? 186 : 144;
  const textX = viewBoxWidth / 2;

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#FAFAFC] px-3 sm:px-6 md:px-8 pt-8 sm:pt-14 pb-6 sm:pb-8 md:pb-10 text-neutral-900 overflow-hidden"
    >
      <div className="w-full max-w-[1360px] mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* ========================================================= */}
        {/* TOP CTA CARD — Dark spotlight card matching reference     */}
        {/* ========================================================= */}
        <section
          ref={ctaCardRef}
          aria-label="Call to Action"
          className="relative w-full overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px] bg-[#0A0A0C] border border-white/10 px-6 py-16 sm:py-20 md:py-24 text-center text-white shadow-xl flex flex-col items-center justify-center will-change-transform"
        >
          {/* Top ambient spotlight bloom */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[750px] md:w-[950px] h-[250px] sm:h-[350px] md:h-[450px] pointer-events-none select-none opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(10, 10, 12, 0) 80%)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 leading-tight">
              Turn your research into clarity
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-normal leading-relaxed max-w-lg mb-8 sm:mb-9">
              Amino Based delivers verified HPLC &amp; Mass Spectrometry analytical testing on every peptide batch, synthesized strictly for laboratory inquiry.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-semibold tracking-tight hover:bg-neutral-100 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MAIN FOOTER SHELL — Light gray shell with floating card   */}
        {/* ========================================================= */}
        <footer
          ref={mainFooterRef}
          id="footer"
          className="relative w-full rounded-[28px] sm:rounded-[38px] md:rounded-[44px] bg-[#F4F5F7] border border-neutral-200/60 px-3 sm:px-6 md:px-8 pt-3 sm:pt-6 md:pt-8 pb-0 sm:pb-0 md:pb-0 !pb-0 overflow-hidden flex flex-col justify-between will-change-transform"
        >
          {/* Floating Elevated White Card */}
          <div className="relative z-10 w-full bg-white rounded-[22px] sm:rounded-[28px] md:rounded-[32px] border border-neutral-200/70 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 sm:p-10 md:p-12">
            
            {/* Top Grid: Brand & Categorized Navigation Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Brand Logo & Statement (Span 4 on Desktop) */}
              <div className="lg:col-span-4 flex flex-col justify-start space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center group w-fit transition-transform hover:scale-[1.02] active:scale-[0.98] duration-200"
                  aria-label="Amino Based — Home"
                >
                  <Image
                    src="/assets/amino_molecular_full_clean.webp"
                    alt={brand}
                    width={160}
                    height={48}
                    className="h-8 sm:h-9 md:h-10 w-auto object-contain"
                  />
                </Link>

                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm">
                  Setting the gold standard in peptide synthesis with verified HPLC/MS testing for uncompromised research results.
                </p>

                {/* Social media links */}
                <div className="pt-2 flex items-center gap-2.5">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Reddit */}
                  <a
                    href="https://reddit.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Reddit"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Navigation Columns (Span 8 on Desktop, 4 Columns) */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                
                {/* Column 1: MENU */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-950 mb-3.5 sm:mb-4">
                    Menu
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    <li>
                      <Link href="/" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link href="/about-us" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/affiliates" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Affiliates
                      </Link>
                    </li>
                    <li>
                      <Link href="/account" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Account
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: RESOURCES */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-950 mb-3.5 sm:mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    <li>
                      <Link href="/peptide-calculator" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Peptide Calculator
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/certificates" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Certificates of Analysis
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: CONTACT */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-950 mb-3.5 sm:mb-4">
                    Contact
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    <li>
                      <Link href="/contact-us" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/military-discount" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Military Discount
                      </Link>
                    </li>
                    <li className="pt-1">
                      <a
                        href="mailto:support@aminobased.com"
                        className="text-neutral-500 hover:text-neutral-950 transition-colors break-all"
                      >
                        support@aminobased.com
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 4: LEGAL */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-950 mb-3.5 sm:mb-4">
                    Legal
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    <li>
                      <Link href="/terms-and-conditions" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/refund-policy" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/shipping-policy" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Shipping Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/medical-disclaimer" className="text-neutral-500 hover:text-neutral-950 transition-colors">
                        Medical Disclaimer
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Hairline Divider */}
            <div className="w-full h-px bg-neutral-200/70 my-7 sm:my-9" />

            {/* Regulatory Disclaimer */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 text-[11px] leading-relaxed text-neutral-400 mb-6">
              <p className="max-w-4xl text-neutral-500">
                <strong className="text-neutral-700 font-semibold">DISCLAIMER:</strong> The content on this website has not been evaluated or approved by the U.S. Food and Drug Administration (FDA). Products sold by Amino Based are offered for research and laboratory purposes only and are not intended to diagnose, treat, cure, or prevent any disease. Amino Based is not a compounding pharmacy and does not operate as a chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act. Products are not for human or veterinary use, and are not intended for ingestion, injection, or any form of administration. Purity levels may vary by product and lot; certain items may test below 99% purity.
              </p>
              <button
                type="button"
                onClick={scrollToTop}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950 hover:bg-black text-white text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>

            {/* Bottom Row: Copyright, Legal Links & Belk Digital Credit */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 pt-1 border-t border-neutral-100">
              <div>
                Amino Based - {new Date().getFullYear()} &copy; All rights reserved
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-xs">
                <Link href="/terms-and-conditions" className="hover:text-neutral-950 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy-policy" className="hover:text-neutral-950 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/refund-policy" className="hover:text-neutral-950 transition-colors">
                  Refund Policy
                </Link>
                <span className="text-neutral-400">
                  Designed &amp; Developed by{" "}
                  <a
                    href="https://www.belkdigital.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 hover:text-black font-semibold underline underline-offset-2 transition-colors"
                  >
                    Belk Digital
                  </a>
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* MASSIVE WATERMARK — Clipped at crossbar ratio flush to card */}
          {/* ========================================================= */}
          <div
            ref={watermarkRef}
            className="w-full flex justify-center items-end pt-4 sm:pt-6 pb-0 mb-0 select-none pointer-events-none leading-none will-change-transform"
          >
            <div className="w-full max-w-[94%] flex justify-center items-end leading-none mb-0 pb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="w-full h-auto block mb-0 pb-0"
              >
                <text
                  x={textX}
                  y={baselineY}
                  textAnchor="middle"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                  fontWeight="800"
                  fontSize={fontSize}
                  letterSpacing="-0.04em"
                  fill="#E2E5EA"
                >
                  {wordmark}
                </text>
              </svg>
            </div>
          </div>

        </footer>

      </div>
    </div>
  );
}
