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
  // Mobile browsers collapse/expand the address bar while scrolling, which changes
  // window.innerHeight and fires `resize` — and `resize` is in ScrollTrigger's default
  // autoRefreshEvents. Every such event ran a full ScrollTrigger.refresh() mid-scroll,
  // recalculating every trigger and (because several carry invalidateOnRefresh) re-reading
  // and re-rendering their tweens. That was the visible section jitter on phones.
  // Orientation changes and `load` still refresh; only the mobile resize noise is ignored.
  ScrollTrigger.config({ ignoreMobileResize: true });
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

    // Accessibility & Mobile optimization:
    // 1. If user has prefers-reduced-motion enabled, do NOT initialize Lenis.
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
      return;
    }

    // 2. On touch devices and mobile viewports, keep 100% native hardware inertial scrolling.
    // Lenis is designed for desktop wheel smoothing; running it on mobile can interfere with
    // touch dragging, address bar collapsing, and touch-lock events.
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768 ||
      "ontouchstart" in window;

    if (isTouchDevice) {
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
      autoRaf: false, // GSAP's ticker drives lenis.raf below — see the gsap.ticker.add call
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

    // Lenis must advance on the SAME ticker GSAP renders on. Driving it from a separate
    // requestAnimationFrame loop left the order of "Lenis moves the scroll position" and
    // "GSAP renders the scrubbed tween" undefined from frame to frame, so pinned and
    // scrubbed sections trailed the scroll by a frame and oscillated. One ticker makes the
    // ordering deterministic. gsap.ticker reports seconds; Lenis expects milliseconds.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);

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
        document.body.style.overflowY === "hidden" ||
        document.body.classList.contains("overflow-hidden") ||
        document.documentElement.style.overflowY === "hidden";

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
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        window.__lenis = null;
      }
    };
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    return () => {
      gsap.ticker.remove(tick);
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

  // Route changes: reset scroll to top and stop any leftover inertia.
  //
  // This has to run whether or not Lenis exists. Lenis is deliberately never created on touch
  // devices (see the isTouchDevice bail-out above), so gating the reset on `lenisRef.current`
  // meant mobile never reset at all — a back-navigation restores the previous offset and
  // nothing corrected it afterwards, so the next page opened part-way down. Desktop hid the
  // bug because the Lenis reset was doing the work the guard was skipping on mobile.
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    // A hash in the URL is an explicit request for a position other than the top; leave it to
    // the browser (or the anchor handler above) rather than yanking the page back up.
    if (window.location.hash) return;

    const resetScroll = () => {
      if (lenisRef.current) {
        // Repositions and cancels any inertia left over from the previous route.
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    // Once now, then again on the next frame. The browser's own scroll restoration and late
    // layout growth (fonts, images, streamed content) can both land *after* this effect runs,
    // and on mobile there is no Lenis rAF loop to correct the result afterwards.
    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(rafId);
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
