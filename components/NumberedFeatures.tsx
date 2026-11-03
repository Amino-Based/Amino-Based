"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Three feature cards with oversized numerals that slide up out of the card's lower edge,
 * plus a hover lift. Content describes how ordering and documentation work — it makes no
 * claim about what the material does.
 */
const FEATURES = [
  {
    n: "01",
    tag: "Catalogue",
    title: "Stated up front",
    body: "Each listing carries its strength, format and the documentation held for that lot, so you can compare before anything reaches a cart.",
    href: "/shop",
  },
  {
    n: "02",
    tag: "Documentation",
    title: "Travels with the order",
    body: "Where a certificate of analysis exists for a lot, it is linked on the product page and stays attached to what you receive.",
    href: "/certificates",
  },
  {
    n: "03",
    tag: "Dispatch",
    title: "Terms before checkout",
    body: "Destinations, restrictions and timing are stated at checkout. Supplied for laboratory research use only.",
    href: "/shipping-policy",
  },
];

export default function NumberedFeatures() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".nf-card", {
        scrollTrigger: { trigger: scope.current, start: "top 78%" },
        y: 48,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Numerals rise out of the clipped strip at the card's foot.
      gsap.from(".nf-numeral", {
        scrollTrigger: { trigger: scope.current, start: "top 72%" },
        yPercent: 100,
        duration: 1.1,
        stagger: 0.14,
        ease: "power4.out",
      });

      gsap.from(".nf-arrow", {
        scrollTrigger: { trigger: scope.current, start: "top 72%" },
        x: -14,
        y: 14,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-white px-6 py-24 md:px-10 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-12 text-right font-inter text-[34px] font-light leading-none tracking-[-0.02em] text-[#0F0F11] md:mb-16 md:text-[56px]">
          How it works
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.n}
              href={f.href}
              className="nf-card group relative flex min-h-[320px] flex-col overflow-hidden rounded-[24px] bg-[#F4F4F6] p-7 ring-1 ring-transparent transition-all duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_56px_rgba(15,15,17,0.10)] hover:ring-[#E6E6EA] md:min-h-[360px]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-white px-3 py-1.5 font-inter text-[10px] uppercase tracking-[0.1em] text-[#0F0F11] ring-1 ring-[#E6E6EA] transition-colors duration-500 group-hover:bg-[#F3EFFE] group-hover:text-[#6D28D9] group-hover:ring-[#DDD0FB]">
                  {f.tag}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  aria-hidden="true"
                  className="nf-arrow h-9 w-9 text-[#C9B8F9] transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#7C3AED]"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </div>

              <h3 className="mt-7 font-inter text-[19px] font-medium leading-snug tracking-[-0.01em] text-[#0F0F11]">
                {f.title}
              </h3>
              <p className="mt-3 max-w-[32ch] font-inter text-[13px] leading-[1.8] text-[#6B6B73]">
                {f.body}
              </p>

              {/* Numeral sits in a clipped strip so it reads as rising out of the card edge. */}
              <div className="pointer-events-none mt-auto h-[58px] overflow-hidden md:h-[70px]">
                <span className="nf-numeral block font-inter text-[84px] font-light leading-[0.78] tracking-[-0.05em] text-[#DCDCE2] transition-colors duration-500 group-hover:text-[#C9B8F9] md:text-[104px]">
                  {f.n}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
