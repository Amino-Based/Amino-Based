"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Horizontal text marquee with a tilted card floating over it.
 *
 * The phrases are the site's existing specification claims, reused verbatim — this band
 * introduces no new product claim of its own. Swap PHRASES for your own copy.
 */
const PHRASES = [
  "RESEARCH GRADE",
  "BATCH DOCUMENTED",
  "HPLC + MS VERIFIED",
  "COLD-CHAIN SHIPPED",
];

export default function MarqueeBand() {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // The track holds the phrase list twice, so shifting it exactly -50% lands on an
      // identical frame and the loop is seamless.
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      // Card drifts and counter-rotates very slightly, so it reads as floating over the
      // text rather than pinned to it.
      gsap.to(".marquee-card", {
        y: -14,
        rotate: -5.2,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.from(".marquee-card", {
        scrollTrigger: { trigger: scope.current, start: "top 85%" },
        y: 60,
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        ease: "power3.out",
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      aria-label="What Amino Based supplies"
      className="relative bg-white overflow-hidden py-24 md:py-32"
    >
      {/* Marquee track — decorative, so it is hidden from assistive tech and the
          accessible description lives on the section label above. */}
      <div aria-hidden="true" className="relative select-none">
        <div ref={trackRef} className="flex w-max items-center gap-10 md:gap-16 will-change-transform">
          {[0, 1].map((copy) => (
            <React.Fragment key={copy}>
              {PHRASES.map((phrase) => (
                <React.Fragment key={`${copy}-${phrase}`}>
                  <span className="font-inter text-[44px] md:text-[80px] lg:text-[104px] font-light leading-none tracking-[-0.02em] text-[#C9B8F9] whitespace-nowrap">
                    {phrase}
                  </span>
                  <span className="shrink-0 w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#7C3AED]" />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tilted floating card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Link
          href="/shop"
          className="marquee-card pointer-events-auto block w-[260px] md:w-[320px] rotate-[-7deg] rounded-[26px] bg-white p-3.5 shadow-[0_28px_60px_rgba(15,15,17,0.14)] ring-1 ring-[#E6E6EA] transition-shadow duration-500 hover:shadow-[0_34px_72px_rgba(124,58,237,0.22)]"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#F3EFFE] via-white to-[#EDE7FD]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4B4BE"
                strokeWidth={1}
                aria-hidden="true"
                className="h-10 w-10"
              >
                <path d="M9 3h6" />
                <path d="M10 3v6.5L5.2 18A2 2 0 007 21h10a2 2 0 001.8-3L14 9.5V3" />
              </svg>
              <span className="font-inter text-[10px] uppercase tracking-[0.14em] text-[#A0A0A8]">
                Product image
              </span>
            </div>
            <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 ring-1 ring-[#E6E6EA]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth={1.8} aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 px-1.5 pb-1 pt-4">
            <p className="font-inter text-[15px] leading-tight text-[#0F0F11]">
              Browse the
              <br />
              catalogue
            </p>
            <span className="shrink-0 rounded-full bg-[#F4F4F6] px-3 py-1.5 font-inter text-[10px] uppercase tracking-[0.1em] text-[#0F0F11] ring-1 ring-[#E6E6EA]">
              Shop
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
