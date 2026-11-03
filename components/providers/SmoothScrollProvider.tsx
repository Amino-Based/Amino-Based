"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCartStore } from "@/lib/cart/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DISABLED_PREFIXES = ["/pb-console", "/admin"];

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const prevPathnameRef = useRef(pathname);

  // Payload admin panel manages its own dynamic scroll containers
  const isDisabledRoute = DISABLED_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  useEffect(() => {
    if (isDisabledRoute) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
      return;
    }

    // Accessibility: if user has prefers-reduced-motion enabled, do NOT initialize Lenis.
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
      return;
    }

    // Instantiates Lenis exactly once
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false, // Mobile/touch: leave touch scrolling native
      autoRaf: false, // We control the requestAnimationFrame loop explicitly
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Ensure GSAP never introduces lag/dampening delay on scroll scrubs
    gsap.ticker.lagSmoothing(0);

    // Synchronize GSAP ScrollTrigger with Lenis scroll
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    // Refresh ScrollTrigger when layout/fonts settle
    const refreshTrigger = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refreshTrigger, 250);
    window.addEventListener("load", refreshTrigger);

    // Dedicated requestAnimationFrame loop with clean unmount handling
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    // Anchor links: route in-page anchor clicks through lenis.scrollTo so they animate smoothly
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname === window.location.pathname && url.hash) {
          const targetEl = document.querySelector(url.hash);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl as HTMLElement, {
              offset: -20,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
            window.history.pushState(null, "", url.hash);
          }
        }
      } catch {
        // Fallback to default browser behavior if URL parsing fails
      }
    };
    document.addEventListener("click", handleAnchorClick, { capture: true });

    // Modals & Overlays: lock/unlock background scroll
    const checkModalLock = () => {
      if (!lenisRef.current) return;
      const isCartOpen = useCartStore.getState().isOpen;
      const isBodyLocked =
        document.body.style.overflow === "hidden" ||
        document.body.classList.contains("overflow-hidden") ||
        document.documentElement.style.overflow === "hidden";

      if (isCartOpen || isBodyLocked) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    };

    // 1. Subscribe to cart store
    const unsubscribeCart = useCartStore.subscribe(() => {
      checkModalLock();
    });

    // 2. Custom events for any component to explicitly trigger stop/start
    const handleLenisStop = () => lenisRef.current?.stop();
    const handleLenisStart = () => lenisRef.current?.start();
    window.addEventListener("lenis:stop", handleLenisStop);
    window.addEventListener("lenis:start", handleLenisStart);

    // 3. MutationObserver to catch body overflow lock changes
    const observer = new MutationObserver(() => {
      checkModalLock();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Listen to reduced-motion preference changes live
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        lenis.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
    };
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("lenis:stop", handleLenisStop);
      window.removeEventListener("lenis:start", handleLenisStart);
      window.removeEventListener("load", refreshTrigger);
      window.clearTimeout(refreshTimer);
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
      unsubscribeCart();
      observer.disconnect();
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, [isDisabledRoute]);

  // Route changes: reset scroll to top and stop any leftover inertia
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (lenisRef.current) {
        // Reset scroll position immediately and cancel all leftover scroll inertia
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

  if (isDisabledRoute) {
    return <>{children}</>;
  }

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
