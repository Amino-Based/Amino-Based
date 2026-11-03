"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a statistic up to its final value the first time it scrolls into view, the way the
 * reference runs its figures (6 to 15, 10% to 99%) alongside the caption scramble.
 *
 * The final value is what renders on the server and what assistive technology reads, so a
 * browser that never runs the effect still shows the real number rather than a zero.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 1400,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const format = (v: number) =>
      `${prefix}${decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()}${suffix}`;

    // Time-based, not frame-based: a throttled tab starves requestAnimationFrame, and a
    // frame counter would leave the figure stranded partway up.
    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / durationMs);
      // easeOutExpo — fast off the mark, settling onto the final value.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      if (el) el.textContent = format(value * eased);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        if (el) el.textContent = format(value);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          if (el) el.textContent = format(0);
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      if (el) el.textContent = format(value);
    };
  }, [value, durationMs, decimals, prefix, suffix]);

  const initialText = `${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()}${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={initialText}>
      {initialText}
    </span>
  );
}
