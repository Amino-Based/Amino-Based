"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  Calculator,
  ChevronRight,
  FileText,
  Handshake,
  Heart,
  HelpCircle,
  Mail,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartTriggerButton from "@/components/cart/CartTriggerButton";
import SearchOverlay from "@/components/nav/SearchOverlay";
import AnnouncementBar from "@/components/nav/AnnouncementBar";
import { useWishlistStore } from "@/lib/wishlist/store";

const NAV_LINKS = [
  { label: "Research", href: "/blog" },
  { label: "Calculator", href: "/peptide-calculator" },
  { label: "Certificates", href: "/certificates" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about-us" },
];

const DEFAULT_CATEGORIES = [
  { name: "GLP-1 Weight Management", slug: "glp-1" },
  { name: "Tissue & Recovery Peptides", slug: "recovery" },
  { name: "Longevity & Cellular Analogs", slug: "longevity" },
  { name: "Growth Hormone Secretagogues", slug: "growth-hormone" },
];

export interface NavCategoryProduct {
  name: string;
  slug: string;
  image: string | null;
  price: number;
}

export interface NavCategory {
  id: string;
  name: string;
  slug: string;
  products: NavCategoryProduct[];
}

interface SiteNavProps {
  categories?: NavCategory[];
  wishlistCount?: number;
  wishlistProductIds?: string[];
  isAffiliate?: boolean;
}

export default function SiteNav({
  categories = [],
  wishlistCount = 0,
  wishlistProductIds = [],
  isAffiliate = false,
}: SiteNavProps) {
  const setWishlistKeys = useWishlistStore((s) => s.setKeys);
  const wishlistSignature = wishlistProductIds.join(",");
  useEffect(() => {
    setWishlistKeys(wishlistSignature ? wishlistSignature.split(",") : []);
  }, [wishlistSignature, setWishlistKeys]);

  const pathname = usePathname();
  const isHome = !pathname || pathname === "/" || pathname === "";
  const { data: session, status } = useSession();

  const [islandMenuOpen, setIslandMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track live scroll progress for the Menu pill badge across desktop & mobile
  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      // 1. Multi-source scroll offset covering iOS Safari, Chrome Mobile, Android, desktop
      const scrollTop =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      // 2. Multi-source total scrollable height (guarantees non-zero on mobile with overflow-x: hidden)
      const totalHeight = Math.max(
        document.body.scrollHeight || 0,
        document.documentElement.scrollHeight || 0,
        document.body.offsetHeight || 0,
        document.documentElement.offsetHeight || 0,
        document.body.clientHeight || 0,
        document.documentElement.clientHeight || 0
      );

      const viewportHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight ||
        0;

      const scrollableHeight = totalHeight - viewportHeight;

      if (scrollableHeight > 0) {
        const rawPercent = (scrollTop / scrollableHeight) * 100;
        const clampedPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));
        setScrollProgress(clampedPercent);
      } else {
        setScrollProgress(0);
      }
    };

    const handleScrollProgress = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Attach listeners to window, document, touchmove, and resize for immediate response
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    document.addEventListener("scroll", handleScrollProgress, { passive: true });
    window.addEventListener("touchmove", handleScrollProgress, { passive: true });
    window.addEventListener("resize", handleScrollProgress, { passive: true });

    // Initial calculation + delayed recalculations as images/fonts load
    calculateProgress();
    const t1 = setTimeout(calculateProgress, 200);
    const t2 = setTimeout(calculateProgress, 800);

    // Also connect to Lenis if available on desktop
    let lenisUnsub: (() => void) | null = null;
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.on("scroll", handleScrollProgress);
      lenisUnsub = () => window.__lenis?.off("scroll", handleScrollProgress);
    }

    return () => {
      window.removeEventListener("scroll", handleScrollProgress);
      document.removeEventListener("scroll", handleScrollProgress);
      window.removeEventListener("touchmove", handleScrollProgress);
      window.removeEventListener("resize", handleScrollProgress);
      clearTimeout(t1);
      clearTimeout(t2);
      if (lenisUnsub) lenisUnsub();
    };
  }, []);

  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const islandMenuOpenRef = useRef(false);

  useEffect(() => {
    islandMenuOpenRef.current = islandMenuOpen;
    if (islandMenuOpen) {
      setIsVisible(true);
    }
  }, [islandMenuOpen]);

  useEffect(() => {
    setIslandMenuOpen(false);
    setScrollProgress(0);
  }, [pathname]);

  // Global keyboard shortcut to open search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Escape key closes search & island menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIslandMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hide nav on deliberate downward scroll, re-reveal on upward scroll (Desktop only)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      // Keep navbar permanently visible on mobile devices to prevent dropped taps or jitter
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsVisible(true);
        return;
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          // Never hide or mutate nav visibility while island menu is open
          if (islandMenuOpenRef.current) {
            setIsVisible(true);
            ticking = false;
            return;
          }
          const currentScrollY = window.scrollY;
          // Always keep nav visible near the top of the page
          if (currentScrollY <= 80) {
            setIsVisible(true);
          } else {
            const delta = currentScrollY - lastScrollY.current;
            // Higher threshold (> 25px) prevents micro-touches & jitter on mobile from hiding the nav
            if (Math.abs(delta) > 25) {
              setIsVisible(delta < 0);
            }
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const announcementActive = isHome && showAnnouncement;

  // Auth pages render their own layout
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  const renderedCategories =
    categories.length > 0
      ? categories.slice(0, 6)
      : DEFAULT_CATEGORIES.map((c, i) => ({
          id: String(i),
          name: c.name,
          slug: c.slug,
          products: [],
        }));

  return (
    <>
      {/* Schema.org SiteNavigationElement for Google Sitelinks & AEO Discovery */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "SiteNavigationElement",
                position: 1,
                name: "Shop Peptides",
                description: "High-purity research peptides verified by third-party HPLC testing.",
                url: "https://aminobased.com/shop",
              },
              {
                "@type": "SiteNavigationElement",
                position: 2,
                name: "Research Library",
                description: "Peer-reviewed insights, reconstitution guides, and analytical studies.",
                url: "https://aminobased.com/blog",
              },
              {
                "@type": "SiteNavigationElement",
                position: 3,
                name: "Peptide Reconstitution Calculator",
                description: "Interactive dosage and bacteriostatic water reconstitution calculator.",
                url: "https://aminobased.com/peptide-calculator",
              },
              {
                "@type": "SiteNavigationElement",
                position: 4,
                name: "Certificates of Analysis (COA)",
                description: "Batch-specific HPLC and mass spectrometry lab testing certificates.",
                url: "https://aminobased.com/certificates",
              },
              {
                "@type": "SiteNavigationElement",
                position: 5,
                name: "Frequently Asked Questions",
                description: "Answers to common research peptide synthesis, order, and shipping questions.",
                url: "https://aminobased.com/faq",
              },
              {
                "@type": "SiteNavigationElement",
                position: 6,
                name: "About Amino Based",
                description: "American research peptide supplier committed to verified analytical purity.",
                url: "https://aminobased.com/about-us",
              },
            ],
          }),
        }}
      />

      {announcementActive && (
        <AnnouncementBar onDismiss={() => setShowAnnouncement(false)} />
      )}

      {/* Dimmed backdrop when dropdown is open */}
      <AnimatePresence>
        {islandMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIslandMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Outer Floating Pill Bar + Attached Dropdown */}
      <header
        className={`fixed top-0 inset-x-0 z-[90] pointer-events-none flex flex-col items-center px-3 transition-transform duration-300 ${
          announcementActive ? "pt-11 sm:pt-12" : "pt-3 sm:pt-5"
        } ${isVisible ? "translate-y-0 opacity-100" : "md:-translate-y-24 md:opacity-0 translate-y-0 opacity-100"}`}
      >
        <nav
          ref={navRef}
          aria-label="Primary"
          className="relative inline-flex items-center justify-between gap-2.5 sm:gap-5 md:gap-7 bg-[#141416]/95 backdrop-blur-md border border-white/10 rounded-full p-1.5 sm:p-2 pl-2 sm:pl-2.5 pr-2 sm:pr-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] touch-manipulation pointer-events-auto"
        >
          {/* ========================================================= */}
          {/* LEFT: Circular White Icon Badge (Amino Based Logo Emblem) */}
          {/* ========================================================= */}
          <Link
            href="/"
            aria-label="Amino Based — Home"
            onClick={() => setIslandMenuOpen(false)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95 group overflow-hidden p-1.5 touch-manipulation cursor-pointer pointer-events-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Amino Based"
              className="w-full h-full object-contain pointer-events-none"
            />
          </Link>

          {/* ========================================================= */}
          {/* CENTER: Dynamic Menu Capsule & Desktop Quick Links         */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* The Interactive Menu Capsule Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIslandMenuOpen((prev) => !prev);
              }}
              aria-expanded={islandMenuOpen}
              aria-label="Toggle navigation menu"
              className="group relative inline-flex items-center gap-2 sm:gap-2.5 bg-black hover:bg-[#18181b] active:bg-[#242428] text-white rounded-full p-1.5 pl-3 sm:pl-3.5 pr-2 min-h-[38px] transition-all duration-200 border border-white/15 shadow-sm cursor-pointer pointer-events-auto focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95 touch-manipulation select-none"
            >
              {/* Animated Hamburger / Close icon */}
              <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-none">
                <div className="w-3.5 h-2.5 flex flex-col justify-between py-[1px]">
                  <span
                    className={`w-full h-[1.5px] bg-white rounded-full transition-transform duration-200 ${
                      islandMenuOpen ? "rotate-45 translate-y-[3.5px]" : "group-hover:translate-x-0.5"
                    }`}
                  />
                  <span
                    className={`w-full h-[1.5px] bg-white rounded-full transition-transform duration-200 ${
                      islandMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : "group-hover:-translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium tracking-tight text-white/95">
                  Menu
                </span>
              </div>

              {/* Scroll percentage badge */}
              <div className="bg-[#212124] text-[10px] sm:text-[11px] font-mono font-medium text-white/90 px-2 sm:px-2.5 py-0.5 rounded-full border border-white/10 shrink-0 pointer-events-none">
                {scrollProgress}%
              </div>
            </button>

            {/* Desktop Direct Links */}
            <ul
              role="list"
              className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-sm font-medium"
            >
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`transition-colors whitespace-nowrap py-1 ${
                        active ? "text-white font-semibold" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Search, Wishlist, Cart, Account, and Shop CTA Pill */}
          {/* ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIslandMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 active:scale-95 touch-manipulation cursor-pointer pointer-events-auto"
              aria-label="Open search"
              title="Search catalog (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Icon (Desktop) */}
            {wishlistCount > 0 && (
              <Link
                href="/account/wishlist"
                onClick={() => setIslandMenuOpen(false)}
                className="relative hidden md:flex w-9 h-9 items-center justify-center text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 active:scale-95 cursor-pointer pointer-events-auto"
                aria-label="Wishlist"
                title="View wishlist"
              >
                <Heart className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-cyan-400 text-[9px] font-bold text-black leading-none">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              </Link>
            )}

            {/* Cart Trigger */}
            <CartTriggerButton className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 active:scale-95 cursor-pointer pointer-events-auto" />

            {/* Account / User Icon (Visible for desktop) */}
            <Link
              href={status === "authenticated" ? "/account" : "/login"}
              onClick={() => setIslandMenuOpen(false)}
              className="hidden md:flex items-center gap-1.5 text-white/70 hover:text-white p-1.5 transition-colors rounded-full hover:bg-white/10 cursor-pointer pointer-events-auto"
              aria-label={status === "authenticated" ? "Account dashboard" : "Sign in / Register"}
              title={
                status === "authenticated"
                  ? session?.user?.firstName
                    ? `Account (${session.user.firstName})`
                    : "Account Dashboard"
                  : "Sign In / Register"
              }
            >
              <User className="w-4 h-4" />
              {status === "authenticated" && session?.user?.firstName && (
                <span className="hidden xl:inline text-xs font-medium max-w-[70px] truncate text-white/90">
                  {session.user.firstName}
                </span>
              )}
            </Link>

            {/* High-Converting Primary CTA: "Shop Now" */}
            <Link
              href="/shop"
              onClick={() => setIslandMenuOpen(false)}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 hover:bg-neutral-100 hover:shadow-sm active:scale-95 transition-all whitespace-nowrap shrink-0 group cursor-pointer pointer-events-auto"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>

        {/* ========================================================= */}
        {/* DROPDOWN MENU PANEL: Attached Directly Below Navbar Pill   */}
        {/* ========================================================= */}
        <AnimatePresence>
          {islandMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto mt-2 w-full max-w-[390px] max-h-[calc(100dvh-110px)] overflow-y-auto overscroll-contain bg-[#141416]/98 backdrop-blur-2xl text-white rounded-[28px] p-4 sm:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.65)] border border-white/15 touch-manipulation z-50 [scrollbar-width:thin]"
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIslandMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              {/* Section 1: Catalog & Core Tools */}
              <div className="mt-3">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5 px-1">
                  Catalog &amp; Tools
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/shop"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors">
                      Shop Full Catalog
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      HPLC Verified
                    </span>
                  </Link>

                  <Link
                    href="/peptide-calculator"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      Peptide Calculator
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/certificates"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      Certificates of Analysis
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      Research Library
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/about-us"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      About Amino Based
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Subtle Divider */}
              <div className="h-px bg-white/10 my-3" />

              {/* Section 2: Support & Programs */}
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5 px-1">
                  Support &amp; Programs
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/military-discount"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-semibold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                      Military Discount
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      30% Off
                    </span>
                  </Link>

                  <Link
                    href="/faq"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      Frequently Asked Questions
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/contact-us"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      Contact Us
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/affiliates"
                    onClick={() => setIslandMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <span className="font-medium text-sm sm:text-base text-white/90 group-hover:text-white transition-colors">
                      Affiliate Program
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Subtle Divider */}
              <div className="h-px bg-white/10 my-3" />

              {/* Section 3: Legal & Policies */}
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5 px-1">
                  Policies &amp; Legal
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-1">
                  <Link
                    href="/shipping-policy"
                    onClick={() => setIslandMenuOpen(false)}
                    className="text-xs text-white/60 hover:text-white py-1 transition-colors truncate"
                  >
                    Shipping Policy
                  </Link>
                  <Link
                    href="/refund-policy"
                    onClick={() => setIslandMenuOpen(false)}
                    className="text-xs text-white/60 hover:text-white py-1 transition-colors truncate"
                  >
                    Refund Policy
                  </Link>
                  <Link
                    href="/medical-disclaimer"
                    onClick={() => setIslandMenuOpen(false)}
                    className="text-xs text-white/60 hover:text-white py-1 transition-colors truncate"
                  >
                    Medical Disclaimer
                  </Link>
                  <Link
                    href="/privacy-policy"
                    onClick={() => setIslandMenuOpen(false)}
                    className="text-xs text-white/60 hover:text-white py-1 transition-colors truncate"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    onClick={() => setIslandMenuOpen(false)}
                    className="text-xs text-white/60 hover:text-white py-1 transition-colors truncate"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>

              {/* Section 4: Account & Primary CTA */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                <Link
                  href={status === "authenticated" ? "/account" : "/login"}
                  onClick={() => setIslandMenuOpen(false)}
                  className="text-xs font-semibold text-white/80 hover:text-white underline-offset-4 hover:underline"
                >
                  {status === "authenticated" ? "My Account" : "Sign In / Register"}
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIslandMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
