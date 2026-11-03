"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPageAnimator({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Simple fade-up reveal for standalone elements (headings, paragraphs, images).
      gsap.utils.toArray<HTMLElement>(".about-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          }
        );
      });

      // Staggered reveal for groups of cards/list items inside a `.about-stagger` container.
      gsap.utils.toArray<HTMLElement>(".about-stagger").forEach((container) => {
        const items = container.querySelectorAll(".about-stagger-item");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: container, start: "top 80%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      });
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{children}</div>;
}
