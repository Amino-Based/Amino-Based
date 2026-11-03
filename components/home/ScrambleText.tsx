"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Resolves a label out of randomised characters the first time it scrolls into view, the way
 * the reference does with its statistic captions.
 *
 * GSAP's ScrambleText is a paid Club plugin, so this is the same idea hand-rolled: a cursor
 * walks left to right, and every character past it is replaced with a random glyph each frame
 * until the cursor reaches it.
 *
 * The real text is what renders on the server and what assistive technology reads, so the
 * effect can never hide the content — it runs once, only in the browser, and only when motion
 * is allowed.
 */
export default function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;

    const DURATION_MS = Math.min(900, 90 * text.length);

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const settled = Math.ceil(progress * text.length);

      if (el) {
        el.textContent = text
          .split("")
          .map((char, i) =>
            char === " " || i < settled
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("");
      }

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        if (el) el.textContent = text;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      if (el) el.textContent = text;
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
