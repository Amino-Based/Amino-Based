"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  FileText,
  Handshake,
  Heart,
  HelpCircle,
  Mail,
  Menu,
  Newspaper,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CartTriggerButton from "@/components/cart/CartTriggerButton";
import SearchOverlay from "@/components/nav/SearchOverlay";
import AnnouncementBar from "@/components/nav/AnnouncementBar";
import { formatUsd } from "@/lib/types/shop";
import { useWishlistStore } from "@/lib/wishlist/store";
import { safeProductImageUrl } from "@/lib/products/productImage";

const NAV_LINKS = [
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Peptide Calculator",
    href: "/peptide-calculator",
  },
  { label: "Research", href: "/blog" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

export const NAV_LINK_UNDERLINE_CLASS =
  "relative hover:text-[#0F0F11] transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-[#0F0F11] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left";

// The mobile drawer surfaces every site route, not just the handful of desktop nav links —
// there's room for a full list there, so nothing should require digging through the footer.
const MOBILE_LINKS = [
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Blog / Research", href: "/blog", icon: Newspaper },
  { label: "About Us", href: "/about-us", icon: User },
  { label: "Affiliates", href: "/affiliates", icon: Handshake },
  { label: "Peptide Calculator", href: "/peptide-calculator", icon: Calculator },
  { label: "Certificates of Analysis", href: "/certificates", icon: FileText },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Contact", href: "/contact-us", icon: Mail },
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
  // Share the signed-in customer's wishlist with every heart button on the page.
  const setWishlistKeys = useWishlistStore((s) => s.setKeys);
  const wishlistSignature = wishlistProductIds.join(",");
  useEffect(() => {
    setWishlistKeys(wishlistSignature ? wishlistSignature.split(",") : []);
  }, [wishlistSignature, setWishlistKeys]);

  const pathname = usePathname();
  const isHome = !pathname || pathname === "/" || pathname === "";
  const { data: session, status } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setIsShopOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const heroHeight = window.innerHeight;

          const scrolled = currentScrollY > 50;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));

          if (isHome) {
            if (currentScrollY > heroHeight) {
              const visible = currentScrollY <= lastScrollY.current;
              setIsVisible((prev) => (prev !== visible ? visible : prev));
            } else {
              setIsVisible((prev) => (!prev ? true : prev));
            }
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const handleShopEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsShopOpen(true);
  };

  const handleShopLeave = () => {
    closeTimer.current = setTimeout(() => setIsShopOpen(false), 150);
  };

  // Non-home pages have no dark hero image behind them, so the nav always renders
  // in its compact/opaque "scrolled" style there instead of the large transparent one.
  const compact = isScrolled || !isHome;
  const announcementActive = isHome && showAnnouncement;

  // Auth pages render their own full-screen split layout with no site chrome.
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
  }

  return (
    <>
      {announcementActive && (
        <AnnouncementBar onDismiss={() => setShowAnnouncement(false)} />
      )}

      <div
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out flex justify-center
        ${announcementActive ? "top-9" : "top-0"}
        ${isVisible ? "translate-y-0" : "-translate-y-[150%]"}
        ${compact ? "py-4" : "py-0"}`}
      >
        <nav
          ref={navRef}
          onMouseLeave={handleShopLeave}
          className={`relative flex items-center justify-between transition-all duration-500 ${
            compact
              ? "w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] bg-white border border-[#E6E6EA] rounded-full px-6 py-2 shadow-[0_2px_14px_rgba(20,33,31,0.07)]"
              : "w-full px-4 py-4 md:py-5 md:px-8 lg:px-12 border-b border-[#E6E6EA]/60 bg-white/85 backdrop-blur-md md:bg-transparent md:backdrop-blur-none"
          }`}
        >
          <Link href="/" className="flex items-center" aria-label="Amino Based — home">
            {/*
              Intrinsic size is 1388x555; width/height carry that ratio so the row does not
              reflow once the file arrives. Height drives the rendered size, width is auto.
              Priority: this is above the fold on every page.
            */}
            <Image
              src="/amino-based-logo.webp"
              alt="Amino Based"
              width={1024}
              height={409}
              priority
              className={`w-auto transition-all duration-500 ${
                compact ? "h-7 md:h-8" : "h-9 md:h-11"
              }`}
            />
          </Link>

          {/*
            Centre capsule. The reference floats its links inside one frosted pill with round
            dot separators rather than spacing them along the bar.

            Its pill is translucent white over a dark photo; this hero is light, so the same
            glass is kept but the type is dark — white-on-glass would be unreadable here.

            Laid out in normal flow, not absolutely centred: centring it on the viewport put
            it underneath the action group at 1024 and 1280 (a 148px overlap at the narrower
            of the two), because the logo and the actions are not the same width.
          */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/70 bg-white/55 backdrop-blur-md px-2 py-1.5 shadow-[0_1px_10px_rgba(20,33,31,0.06)] text-sm font-medium text-[#4B4B55]">
            <div
              className="relative"
              onMouseEnter={handleShopEnter}
              onMouseLeave={handleShopLeave}
            >
              <Link
                href="/shop"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 xl:px-4 py-1.5 hover:bg-white/80 hover:text-[#0F0F11] transition-colors"
              >
                Categories
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-300 ${
                    isShopOpen ? "rotate-180" : ""
                  }`}
                />
              </Link>
            </div>
            {NAV_LINKS.map((link) => (
              <React.Fragment key={link.href}>
                <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#B4B4BE] shrink-0" />
                <Link
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-3 xl:px-4 py-1.5 hover:bg-white/80 hover:text-[#0F0F11] transition-colors"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {isAffiliate && (
              <Link
                href="/affiliates/dashboard"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#0F0F11] hover:text-[#2A2A2E] transition-colors"
              >
                <Handshake className="w-4 h-4" />
                Affiliate Dashboard
              </Link>
            )}
            {status === "authenticated" ? (
              <Link
                href="/account"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#6B6B73] hover:text-[#0F0F11] transition-colors"
              >
                <User className="w-4 h-4" />
                {session.user?.firstName || "Account"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden xl:block text-sm font-medium text-[#6B6B73] relative hover:text-[#0F0F11] transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-[#0F0F11] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                Login
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden xl:block text-[#6B6B73] hover:text-[#0F0F11] transition-colors"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/account/wishlist"
              className="relative hidden md:block text-[#6B6B73] hover:text-[#0F0F11] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#7C3AED] text-[10px] font-bold text-white leading-none">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <CartTriggerButton />

            {/*
              Shop Now is one capsule with the accent disc tucked flush into its right end,
              exactly as the reference draws it — the disc is part of the pill, not a button
              beside it, so the pill carries no right padding and the disc is the same height.
              The accent is the cyan from the wordmark rather than the page's lavender.
            */}
            <div className="hidden md:block">
              <Link
                href="/shop"
                className="group flex items-center gap-3 rounded-full border border-white/70 bg-white/60 backdrop-blur-md py-1 pl-5 pr-1 shadow-[0_1px_10px_rgba(20,33,31,0.06)] hover:bg-white/90 transition-colors"
              >
                <span className="whitespace-nowrap text-sm font-medium text-[#0F0F11]">Shop Now</span>
                <span className="w-9 h-9 rounded-full bg-[#19B5E8] group-hover:bg-[#0E9FD0] flex items-center justify-center transition-colors">
                  <ShoppingCart className="w-[18px] h-[18px] text-white" />
                </span>
              </Link>
            </div>

            {/* Menu is a circular glass button in the reference, not a bare icon. */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-10 h-10 rounded-full border border-white/70 bg-white/60 backdrop-blur-md flex items-center justify-center text-[#19B5E8] hover:bg-white/90 transition-colors shadow-[0_1px_10px_rgba(20,33,31,0.06)]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mega Menu */}
          {isShopOpen && (
            <div
              onMouseEnter={handleShopEnter}
              onMouseLeave={handleShopLeave}
              className="hidden lg:block absolute left-0 right-0 top-full mt-3 z-40"
            >
              <div className="bg-white border border-[#E6E6EA] rounded-2xl shadow-[0_12px_32px_rgba(20,33,31,0.10)] p-5">
                {categories.length === 0 ? (
                  <p className="text-sm text-[#8A8A90] text-center py-4">
                    Categories coming soon.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-[#F7F7F9] border border-[#E6E6EA] rounded-xl p-4"
                      >
                        <Link
                          href={`/shop?category=${category.slug}`}
                          className="block text-xs font-inter uppercase tracking-wide text-white hover:text-indigo-300 transition-colors mb-4"
                        >
                          {category.name}
                        </Link>
                        <div className="flex flex-col gap-4">
                          {category.products.length === 0 ? (
                            <span className="text-xs text-[#8A8A90]">No products yet</span>
                          ) : (
                            category.products.map((product, idx) => (
                              <Link
                                key={`${category.id}-${product.slug}-${idx}`}
                                href={`/product/${product.slug}`}
                                className="flex items-center gap-3 group"
                              >
                                <div className="w-14 h-14 shrink-0 rounded-lg bg-white border border-[#E6E6EA] flex items-center justify-center overflow-hidden p-1">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={safeProductImageUrl(product.image)}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-[#6B6B73] group-hover:text-[#0F0F11] transition-colors truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-[#8A8A90]">{formatUsd(product.price)}</p>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-[#E6E6EA] text-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#6B6B73] hover:text-[#0F0F11] transition-colors"
                  >
                    View All Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile drawer backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#0F0F11]/40 backdrop-blur-sm transition-opacity duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile drawer panel — slides in from the right */}
      <aside
        data-lenis-prevent="true"
        className={`fixed top-0 right-0 h-full w-full max-w-[460px] sm:max-w-[500px] z-50 bg-[#F4F5F7] border-l border-[#E6E6EA] shadow-2xl flex flex-col transition-transform duration-400 ease-out overscroll-contain ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Site menu"
      >
        {/* Top Header with Eyebrow, Title and Close Button */}
        <div className="px-6 sm:px-8 pt-7 pb-4 shrink-0 flex items-start justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#0096c8] block mb-1 font-mono">
              MENU
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">
              Menu
            </h2>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 text-[#0F0F11] flex items-center justify-center border border-black/[0.06] shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* 2-Column Grid of Rounded Navigation Cards & CTA in one unified scroll container */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-2 touch-pan-y [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {[
              { label: "Shop", href: "/shop" },
              { label: "Blog /\nResearch", href: "/blog" },
              { label: "About Us", href: "/about-us" },
              {
                label: "Affiliates",
                href: isAffiliate ? "/affiliates/dashboard" : "/affiliates",
              },
              { label: "Peptide\nCalculator", href: "/peptide-calculator" },
              { label: "Certificates of\nAnalysis", href: "/certificates" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact-us" },
              {
                label: "Wishlist",
                href: "/account/wishlist",
                badge: wishlistCount > 0 ? (wishlistCount > 99 ? "99+" : String(wishlistCount)) : undefined,
              },
              {
                label: status === "authenticated" ? "Account" : "Login",
                href: status === "authenticated" ? "/account" : "/login",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                onClick={() => setMobileOpen(false)}
                className="group bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[96px] sm:min-h-[106px] border border-black/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#0096c8]/30 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#0096c8] transition-colors leading-snug whitespace-pre-line">
                    {card.label}
                  </span>
                  {card.badge && (
                    <span className="min-w-[18px] h-4.5 px-1.5 flex items-center justify-center rounded-full bg-[#0096c8] text-[10px] font-bold text-white">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="flex justify-end mt-2">
                  <ArrowRight className="w-4 h-4 text-[#0096c8] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* User Sign-out Helper if logged in */}
          {status === "authenticated" && (
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Bottom Midnight Navy CTA Button matching reference image layout */}
          <div className="pt-5 pb-8">
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 px-6 text-sm sm:text-base font-bold text-white bg-[#0a1e3c] hover:bg-[#07152b] rounded-full transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
