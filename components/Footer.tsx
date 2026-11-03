"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
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
  giantText = "amino",
  brandTitle = "Amino",
  scrollReveal = false,
}: FooterProps = {}) {
  const wordmark = giantText || "amino";
  const brand = brandTitle || "Amino";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const footerCardRef = useRef<HTMLElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const middleRowRef = useRef<HTMLDivElement>(null);
  const wordmarkWrapperRef = useRef<HTMLDivElement>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

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
      const startY = isMobile ? 45 : 70;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: isMobile ? "top 95%" : "top 85%",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      // 1. Upper navigation grid glides gently into resting position
      if (topSectionRef.current) {
        tl.fromTo(
          topSectionRef.current,
          { y: isMobile ? 20 : 35, opacity: 0.75 },
          { y: 0, opacity: 1, ease: "power2.out", duration: 1 },
          0
        );
      }

      // 2. Oversized wordmark rises with decoupled differential velocity
      if (wordmarkWrapperRef.current) {
        tl.fromTo(
          wordmarkWrapperRef.current,
          { yPercent: startY, opacity: 0.35, scale: 0.97 },
          { yPercent: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 1 },
          0.04
        );
      }

      // 3. Middle copyright & social row softly docks
      if (middleRowRef.current) {
        tl.fromTo(
          middleRowRef.current,
          { y: 15, opacity: 0.6 },
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.9 },
          0.08
        );
      }
    },
    { scope: containerRef, dependencies: [scrollReveal] }
  );

  return (
    <div ref={containerRef} className="w-full bg-[#FAFAFC] px-3 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-4">
      <footer
        ref={footerCardRef}
        id="footer"
        className="w-full max-w-[1360px] mx-auto bg-[#0B0B0B] text-white rounded-[24px] sm:rounded-[32px] md:rounded-[36px] border border-white/10 pt-10 sm:pt-14 md:pt-16 pb-0 px-6 sm:px-10 md:px-14 lg:px-16 overflow-hidden relative select-none flex flex-col justify-between shadow-2xl"
      >
        <div className="w-full flex flex-col justify-between">
          
          {/* ========================================================= */}
          {/* SECTION A — Top Information Area (Brand + 4 Navigation Columns) */}
          {/* ========================================================= */}
          <div ref={topSectionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-12 sm:mb-16 will-change-transform">
            
            {/* Left Column: Brand Logo, Tagline & Newsletter Subscribe (Span 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Amino Based — Home">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black shadow-xs transition-transform group-hover:scale-105">
                    <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                      <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 7L10.5 8.5L12 2Z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white font-sans">
                    Amino Based
                  </span>
                </Link>

                <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm mt-3.5">
                  Setting the gold standard in peptide synthesis with verified HPLC/MS testing for uncompromised results.
                </p>
              </div>

              {/* Newsletter Block */}
              <div className="pt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Amino Based</h3>
                <p className="text-sm sm:text-base text-white/50 font-normal">in your mailbox</p>

                <form onSubmit={handleNewsletterSubmit} className="mt-4 relative flex items-center max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    aria-label="Email address"
                    className="w-full bg-white/10 hover:bg-white/[0.14] focus:bg-white/[0.18] border border-white/15 focus:border-white/30 text-white placeholder-white/40 text-xs sm:text-sm rounded-full pl-5 pr-12 py-3.5 outline-none transition-all"
                    required
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 w-9 h-9 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
                {subscribed && (
                  <p className="text-xs text-emerald-400 mt-2 font-medium">Thank you for subscribing!</p>
                )}
              </div>
            </div>

            {/* Right Columns: Categorized Navigation Grid (Span 7) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 pt-1">
              
              {/* Column 1: MENU */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 sm:mb-5">
                  Menu
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <li>
                    <Link href="/" className="text-white/60 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="text-white/60 hover:text-white transition-colors">
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" className="text-white/60 hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/affiliates" className="text-white/60 hover:text-white transition-colors">
                      Affiliates
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="text-white/60 hover:text-white transition-colors">
                      Account
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: RESOURCES */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 sm:mb-5">
                  Resources
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <li>
                    <Link href="/peptide-calculator" className="text-white/60 hover:text-white transition-colors">
                      Peptide Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-white/60 hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-white/60 hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/certificates" className="text-white/60 hover:text-white transition-colors">
                      Certificates of Analysis
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: CONTACT */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 sm:mb-5">
                  Contact
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <li>
                    <Link href="/contact-us" className="text-white/60 hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li className="pt-1">
                    <a href="mailto:support@aminobased.com" className="text-white/60 hover:text-white transition-colors break-all">
                      support@aminobased.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: LEGAL */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 sm:mb-5">
                  Legal
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <li>
                    <Link href="/terms-and-conditions" className="text-white/60 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-white/60 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund-policy" className="text-white/60 hover:text-white transition-colors">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping-policy" className="text-white/60 hover:text-white transition-colors">
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/medical-disclaimer" className="text-white/60 hover:text-white transition-colors">
                      Medical Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION B — Social Icons, Copyright & Back to Top         */}
          {/* ========================================================= */}
          <div ref={middleRowRef} className="border-t border-white/10 pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-white/50 will-change-transform">
            
            {/* Center Area: Social Icons & Copyright text */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 order-2 md:order-1">
              {/* Circular outlined social icons */}
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
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
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
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
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
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
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </a>
              </div>

              <span>Amino Based - 2026 &copy; All rights reserved</span>
            </div>

            {/* Right: Back to top button */}
            <div className="order-1 md:order-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-medium transition-all group cursor-pointer"
              >
                <span>Back to top</span>
                <span className="w-5 h-5 rounded-full bg-black/60 group-hover:bg-black/90 flex items-center justify-center transition-colors">
                  <svg className="w-3 h-3 text-white transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Regulatory Disclaimer & Credits Bar                       */}
          {/* ========================================================= */}
          <div className="border-t border-white/10 pt-5 pb-6 flex flex-col md:flex-row items-start justify-between gap-4 text-[11px] leading-relaxed text-white/40">
            <p className="max-w-4xl text-white/40">
              <strong className="text-white/60 font-semibold">DISCLAIMER:</strong> The content on this website has not been evaluated or approved by the U.S. Food and Drug Administration (FDA). Products sold by Amino Based are offered for research and laboratory purposes only and are not intended to diagnose, treat, cure, or prevent any disease. Amino Based is not a compounding pharmacy and does not operate as a chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act. Products are not for human or veterinary use, and are not intended for ingestion, injection, or any form of administration. Purity levels may vary by product and lot; certain items may test below 99% purity.
            </p>
            <p className="shrink-0 text-white/30 text-left md:text-right pt-0.5">
              Designed &amp; Developed by{" "}
              <a
                href="https://www.belkdigital.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors underline-offset-2 hover:underline"
              >
                Belk Digital
              </a>
            </p>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SECTION C — Oversized Crisp & Clear Wordmark              */}
        {/* 100% Sharp, crisp typography without blur streaks or haze */}
        {/* ========================================================= */}
        <div
          ref={wordmarkWrapperRef}
          className="w-full flex justify-center items-end mt-2 sm:mt-4 mb-0 pb-0 relative overflow-hidden pointer-events-none select-none will-change-transform"
        >
          <div className="w-full max-w-[88%] sm:max-w-[90%] md:max-w-[92%] flex justify-center items-end leading-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 240"
              className="w-full h-auto block transform translate-y-[6%] sm:translate-y-[8%]"
              preserveAspectRatio="xMidYMax meet"
            >
              <defs>
                {/* Crisp, clean metallic white-to-light-gray gradient */}
                <linearGradient id="aminoClearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="60%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.95" />
                </linearGradient>

                {/* Subtle, sharp drop shadow for clean depth without blur streaks */}
                <filter id="aminoCleanDepth" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
                </filter>
              </defs>

              <g filter="url(#aminoCleanDepth)">
                <text
                  x="500"
                  y="205"
                  textAnchor="middle"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                  fontWeight="900"
                  fontSize="240"
                  letterSpacing="-0.045em"
                  fill="url(#aminoClearGrad)"
                >
                  {wordmark}
                </text>
              </g>
            </svg>
          </div>
        </div>

      </footer>
    </div>
  );
}