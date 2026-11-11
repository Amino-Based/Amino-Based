"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HangingSpraysVisualProps {
  imageSrc: string;
  altText: string;
  badge?: string;
  priority?: boolean;
}

/**
 * HangingSpraysVisual
 *
 * Implements a natural, physics-inspired harmonic hanging suspension animation.
 * The sprays are anchored to top-center (transform-origin: 50% 0%), gently swaying
 * like physical bottles suspended on micro-gauge nylon threads in ambient airflow.
 * Does not increase hang distance; maintains the exact vertical composition.
 */
export default function HangingSpraysVisual({
  imageSrc,
  altText,
  badge,
  priority = false,
}: HangingSpraysVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendulumRef = useRef<HTMLDivElement>(null);
  const threadShimmerRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const pendulum = pendulumRef.current;
    if (!pendulum) return;

    // Harmonic Pendulum Sway: pivot anchored at top ceiling (50% -10px)
    // Very gentle angle (-1.2deg to +1.2deg) with realistic sine damping
    const swayTween = gsap.to(pendulum, {
      rotation: 1.15,
      x: 2.5,
      y: -1.2, // micro-lift at the apex of the arc (natural pendulum physics)
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "50% -15px",
    });

    // Subtle 3D Depth Drift (slight rotation on Y axis gives real stereoscopic presence)
    const tiltTween = gsap.to(pendulum, {
      rotateY: 2.2,
      rotateX: 0.8,
      duration: 4.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Delicate specular glint travel along the suspended thread
    const shimmer = threadShimmerRef.current;
    let shimmerTween: gsap.core.Tween | null = null;
    if (shimmer) {
      shimmerTween = gsap.to(shimmer, {
        strokeDashoffset: -200,
        duration: 3.5,
        ease: "none",
        repeat: -1,
      });
    }

    // Subtle interactive breeze on cursor movement over card
    const container = containerRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      gsap.to(pendulum, {
        rotation: relativeX * 2.4,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          // smoothly resume the idle sway
          swayTween.restart(true);
        },
      });
    };

    const handleMouseLeave = () => {
      gsap.to(pendulum, {
        rotation: 0,
        x: 0,
        y: 0,
        duration: 1.8,
        ease: "elastic.out(1, 0.45)",
        onComplete: () => {
          swayTween.restart(true);
        },
      });
    };

    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    return () => {
      swayTween.kill();
      tiltTween.kill();
      if (shimmerTween) shimmerTween.kill();
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[350px] rounded-[22px] overflow-hidden bg-[#0C0F15] flex items-center justify-center border border-black/10 select-none [perspective:1200px]"
    >
      {/* PENDULUM SUSPENSION RIG: Anchored at top center */}
      <div
        ref={pendulumRef}
        style={{
          transformOrigin: "50% -15px",
        }}
        className="relative w-full h-full will-change-transform transform-gpu scale-[1.035]"
      >
        {/* Crisp Image of the Suspended Sprays Lineup */}
        <Image
          src={imageSrc}
          alt={altText}
          fill
          className="object-cover object-center pointer-events-none select-none"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 420px"
        />

        {/* Dynamic Overlay Thread Wires (Enhancing the suspended nylon filaments) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Filament Glow Filter */}
            <linearGradient id="threadGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="50%" stopColor="rgba(186,230,253,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
            </linearGradient>
            <linearGradient id="threadSubtle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>

          {/* Central Thread: Drops to Semaglutide 10mg Nozzle */}
          <line
            x1="50.4%"
            y1="0"
            x2="50.4%"
            y2="36%"
            stroke="url(#threadGlow)"
            strokeWidth="0.8"
            strokeOpacity="0.65"
          />
          {/* Specular Glint Shimmer along Central Thread */}
          <line
            ref={threadShimmerRef}
            x1="50.4%"
            y1="0"
            x2="50.4%"
            y2="36%"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="1.2"
            strokeDasharray="16, 120"
            strokeLinecap="round"
          />

          {/* Left Thread: Supporting KLOW 30mg */}
          <line
            x1="18.5%"
            y1="0"
            x2="18.5%"
            y2="18%"
            stroke="url(#threadSubtle)"
            strokeWidth="0.6"
            strokeOpacity="0.4"
          />

          {/* Right Thread: Supporting GLOW 20mg */}
          <line
            x1="66.8%"
            y1="0"
            x2="66.8%"
            y2="10%"
            stroke="url(#threadSubtle)"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />

          {/* Far Right Thread: Supporting Semax 20mg */}
          <line
            x1="78.2%"
            y1="0"
            x2="78.2%"
            y2="54%"
            stroke="url(#threadSubtle)"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </svg>

        {/* Ambient Top Ceiling Shadow Gradients (Anchors the suspension point) */}
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      </div>

      {/* Laboratory Spec Badge Pill Overlay (Static & Crisp on top of the card) */}
      {badge && (
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/10 shadow-sm flex items-center gap-1.5 z-20 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-900">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

