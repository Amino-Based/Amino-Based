"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollTextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  highlightWords?: string[];
  highlightColor?: string;
  start?: string;
  end?: string;
}

/**
 * Kinetic Word-by-Word Scroll Reveal
 * Recreates the signature luxury biotech text highlight effect from the reference video:
 * As the user scrolls through the section, words transition smoothly from a muted gray
 * (opacity ~0.25) to a crisp dark black (opacity 1.0) with subtle word-level illumination.
 */
export default function ScrollTextReveal({
  text,
  className = "",
  wordClassName = "",
  highlightWords = [],
  highlightColor = "#7C3AED",
  start = "top 80%",
  end = "top 35%",
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wordSpans = gsap.utils.toArray<HTMLSpanElement>(".reveal-word", container);
        if (wordSpans.length === 0) return;

        // Set initial muted state
        gsap.set(wordSpans, { opacity: 0.22, color: "#9CA3AF" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start,
            end,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.to(wordSpans, {
          opacity: 1,
          color: (index, target) => {
            return target.dataset.highlight === "true" ? highlightColor : "#0F0F11";
          },
          stagger: 0.08,
          ease: "none",
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(wordSpans, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <p ref={containerRef} className={`select-none leading-relaxed ${className}`}>
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord || word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span
            key={idx}
            data-highlight={isHighlight ? "true" : "false"}
            className={`reveal-word inline-block mr-[0.28em] will-change-[opacity,color] ${wordClassName}`}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}
