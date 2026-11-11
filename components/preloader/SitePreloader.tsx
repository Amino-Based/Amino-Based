"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NUM_COLUMNS = 12;

export default function SitePreloader() {
  const [phase, setPhase] = useState<"initial" | "logo_expand" | "logo_drop" | "curtain_reveal" | "done">("initial");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);

    // Skip preloader only if already seen in this session (in production)
    // In development or if URL has ?preloader, always play so it can be previewed/tested
    try {
      const isDev = process.env.NODE_ENV === "development";
      const forcePlay = typeof window !== "undefined" && window.location.search.includes("preloader");
      const seen = typeof window !== "undefined" && window.sessionStorage?.getItem("amino_preloader_seen") === "true";
      
      if (!isDev && !forcePlay && seen) {
        setPhase("done");
        return;
      }
    } catch {
      // In case sessionStorage throws in strict private browsing, do not crash
    }

    // Lock body scroll while preloader is active
    document.body.style.overflow = "hidden";

    // Timeline sequence matching reference video (total ~3.2s)
    const t1 = setTimeout(() => {
      setPhase("logo_expand"); // Wordmark slides out from behind the logo emblem
    }, 600);

    const t2 = setTimeout(() => {
      setPhase("logo_drop"); // Logo & text drop downward into bottom mask
    }, 1800);

    const t3 = setTimeout(() => {
      setPhase("curtain_reveal"); // Background splits into vertical blinds/columns peeling away
    }, 2300);

    const t4 = setTimeout(() => {
      setPhase("done"); // Complete unmount
      document.body.style.overflow = "";
      try {
        window.sessionStorage?.setItem("amino_preloader_seen", "true");
      } catch {}
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, []);

  const handleSkip = () => {
    setPhase("done");
    document.body.style.overflow = "";
    try {
      window.sessionStorage?.setItem("amino_preloader_seen", "true");
    } catch {}
  };

  if (!mounted || phase === "done") return null;

  return (
    <div
      id="site-preloader"
      onClick={handleSkip}
      className={`fixed inset-0 h-[100dvh] w-screen z-[99999] select-none overflow-hidden cursor-default ${
        phase === "curtain_reveal" ? "pointer-events-none" : "pointer-events-auto"
      } touch-none`}
      aria-label="Amino Based Loading"
    >
      {/* ========================================================= */}
      {/* STAGE 1 & 2: MOLECULAR EMBLEM + SLIDE-OUT WORDMARK LOCKUP */}
      {/* ========================================================= */}
      <AnimatePresence>
        {phase !== "curtain_reveal" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4">
            {/* Mask Container for vertical drop out */}
            <div className="overflow-hidden py-6 px-4">
              <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={
                  phase === "logo_drop"
                    ? { y: 90, opacity: 0 }
                    : { y: 0, opacity: 1 }
                }
                transition={{
                  duration: 0.45,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4"
              >
                {/* 1. Pure, Clean Amino Based Molecular Emblem (Zero Background Artifacts) */}
                <div className="relative shrink-0 flex items-center justify-center">
                  {/* Emblem Outer Pop-in Container */}
                  <motion.div
                    initial={{ scale: 0.25, rotate: -16, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      mass: 0.7,
                    }}
                    className="relative shrink-0 flex items-center justify-center"
                  >
                    {/* Continuous Playful Floating / Recoil on Expand */}
                    <motion.div
                      animate={
                        phase === "initial"
                          ? {
                              y: [0, -7, 2, -5, 0],
                              rotate: [0, 3.5, -2.5, 2, 0],
                              scale: [1, 1.05, 0.98, 1.03, 1],
                            }
                          : phase === "logo_expand"
                          ? {
                              // Playful physical recoil pushing the wordmark outward
                              x: [0, -10, 2, 0],
                              y: [0, -3, 0],
                              rotate: [0, -4, 1, 0],
                              scale: [1, 1.08, 0.98, 1],
                            }
                          : {}
                      }
                      transition={
                        phase === "initial"
                          ? {
                              duration: 2.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                          : {
                              duration: 0.65,
                              ease: [0.16, 1, 0.3, 1],
                            }
                      }
                      className="relative flex items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/amino_molecular_emblem_clean.png"
                        alt="Amino Based Emblem"
                        className="h-14 sm:h-18 md:h-22 lg:h-24 w-auto aspect-[689/466] object-contain select-none pointer-events-none"
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* 2. Exact Brand Divider + Wordmark Slide-Out Mask */}
                <div className="overflow-hidden flex items-center">
                  <motion.div
                    initial={{ x: -80, opacity: 0, width: 0 }}
                    animate={
                      phase === "logo_expand" || phase === "logo_drop"
                        ? { x: 0, opacity: 1, width: "auto" }
                        : { x: -80, opacity: 0, width: 0 }
                    }
                    transition={{
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="whitespace-nowrap shrink-0 flex items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/amino_molecular_text_clean.png"
                      alt="Amino Based"
                      className="h-14 sm:h-18 md:h-22 lg:h-24 w-auto aspect-[825/466] object-contain select-none pointer-events-none"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* STAGE 3: VERTICAL COLUMN SLATS SHUTTER REVEAL (12 SLATS)  */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-10 flex w-full h-full pointer-events-none">
        {Array.from({ length: NUM_COLUMNS }).map((_, i) => {
          const isEven = i % 2 === 0;
          // Stagger delays across the 12 columns (from center outward or left to right)
          // Reference video shows slight wave/stagger
          const staggerDelay = i * 0.025;

          return (
            <motion.div
              key={i}
              initial={{ y: "0%" }}
              animate={
                phase === "curtain_reveal"
                  ? { y: isEven ? "-100%" : "100%" }
                  : { y: "0%" }
              }
              transition={{
                duration: 0.85,
                delay: staggerDelay,
                ease: [0.76, 0, 0.24, 1], // Smooth exponential ease
              }}
              style={{
                width: `calc(100% / ${NUM_COLUMNS})`,
              }}
              className="h-full bg-[#CEE2FB] shrink-0 border-r border-[#CEE2FB]/20"
            />
          );
        })}
      </div>

      {/* Subtle Skip Button (bottom right, optimized touch target for mobile) */}
      <button
        onClick={handleSkip}
        type="button"
        className="absolute bottom-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 active:bg-black/15 text-[11px] font-medium uppercase tracking-widest text-black/60 hover:text-black/90 transition-all pointer-events-auto touch-manipulation select-none"
      >
        Skip
      </button>
    </div>
  );
}
