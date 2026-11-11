"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function InteractiveBrandChamber() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subtle 3D perspective tilt across the whole section
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const shiftX = useSpring(useTransform(mouseX, [0, 1], [-18, 18]), { stiffness: 160, damping: 26 });
  const shiftY = useSpring(useTransform(mouseY, [0, 1], [-12, 12]), { stiffness: 160, damping: 26 });
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 160, damping: 26 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), { stiffness: 160, damping: 26 });

  // Ensure video autoplays reliably
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback
        });
      }
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    mouseX.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    mouseY.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!e.touches[0]) return;
    const t = e.touches[0];
    handlePointerMove({
      clientX: t.clientX,
      clientY: t.clientY,
    } as any);
  };

  return (
    <section
      ref={sectionRef}
      id="sec-brand-chamber"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePointerLeave}
      className="relative w-full min-h-[640px] sm:min-h-[720px] md:min-h-[820px] lg:min-h-[920px] bg-[#E1E0E8] border-y border-[#D4D3DC] overflow-hidden select-none flex flex-col justify-between py-10 sm:py-14 md:py-18 px-6 sm:px-12 md:px-16 lg:px-24"
      aria-label="Amino Based 3D Spiral Orb Animation Section"
    >
      {/* =================================================================== */}
      {/* FULL-SECTION AMBIENT 3D ANIMATION VIDEO (NO CARD, SEAMLESS IN SECTION) */}
      {/* =================================================================== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden [perspective:1400px]">
        <motion.div
          style={{
            x: shiftX,
            y: shiftY,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full max-w-[1280px] max-h-[960px] flex items-center justify-center will-change-transform"
        >
          <video
            ref={videoRef}
            src="/assets/amino_based_animation.mp4"
            poster="/assets/amino_brand_poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </motion.div>
      </div>

      {/* TOP ROW: Clean Laboratory Status Badge */}
      <div className="relative z-20 flex items-center justify-between max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/75 border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-[#0F0F11] uppercase">
            CENTRAL PEPTIDE LABORATORY
          </span>
        </div>

        <span className="hidden sm:inline-block text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-500/90 font-medium">
          ISO / IEC 17025 ACCREDITED • 3D HELICAL ORB
        </span>
      </div>

      {/* BOTTOM ROW: Clean & Clear Action Link */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full pt-6 border-t border-black/10 pointer-events-auto">
        <span className="text-[11px] sm:text-xs font-mono text-neutral-600 font-medium tracking-wider">
          USP GRADE • HPLC CONFIRMED PURITY ≥99%
        </span>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-[0.16em] uppercase text-[#0F0F11] hover:text-blue-700 transition-colors group px-4 py-2 rounded-full bg-white/60 hover:bg-white/90 border border-black/5 shadow-sm backdrop-blur-sm"
        >
          <span>Explore Peptide Catalog</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
