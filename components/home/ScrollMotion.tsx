"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COL_LEFT = '[class*="col-span-7"]';
const COL_RIGHT = '[class*="col-span-5"]';
const BLUR_LAYER = '[class*="blur-["]';
const GRID = '[class*="grid-cols"]';
const LOOSE_COPY = ":scope > div > div > span, :scope > div > div > p, :scope > div > p";

/**
 * The scroll-driven motion layer for the homepage.
 *
 * The markup already carries the reference layout; what it lacked was motion tied to scroll
 * position. Rather than thread class hooks through 1300 lines of JSX, this walks the rendered
 * sections and attaches ScrollTriggers by structure: cards are the children of a grid,
 * headings are h2s, and anything a card already owns is skipped so nothing animates twice.
 *
 * Everything sits behind prefers-reduced-motion. The tweens only ever animate *from* a
 * transformed state, so if one never runs the content is still visible rather than stranded
 * at opacity 0.
 */
export default function ScrollMotion({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sections = gsap.utils.toArray<HTMLElement>("section", root);

        /* ------------------------------------------------------------------ *
         * Hero — plays on load, not on scroll: it is already in view.
         * ------------------------------------------------------------------ */
        const hero = sections[0];
        if (hero) {
          const column = hero.querySelector<HTMLElement>(COL_LEFT);
          if (column) {
            gsap.from(Array.from(column.children), {
              y: 32,
              opacity: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: "power3.out",
              delay: 0.1,
            });
          }
        }

        /* ------------------------------------------------------------------ *
         * Everything else, section by section.
         * ------------------------------------------------------------------ */
        const claimed = new WeakSet<Element>();
        const claim = (el: Element) => {
          claimed.add(el);
          el.querySelectorAll("*").forEach((child) => claimed.add(child));
        };

        /*
          Subtrees that run their own scroll timeline opt out here. Without this the generic
          pass below also fades them in, and the two systems write opacity on the same nodes
          from different triggers — the orbit built itself early and out of order because of
          exactly that. One owner per element.
        */
        root.querySelectorAll("[data-motion-owner]").forEach(claim);

        /* ------------------------------------------------------------------ *
         * Columns that travel at their own rate, so neighbours converge as the
         * section passes. data-parallax carries the starting offset in percent;
         * the element ends at its negative, crossing zero mid-section.
         * ------------------------------------------------------------------ */
        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax);
          if (!Number.isFinite(amount) || amount === 0) return;

          const section = el.closest("section") ?? el;

          // Fade and drift are separate properties, so the two triggers never fight.
          gsap.set(el, { willChange: "transform" });
          gsap.from(el, {
            scrollTrigger: { trigger: section, start: "top 85%" },
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
          });

          gsap.fromTo(
            el,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );

          claim(el);
        });

        sections.forEach((section, index) => {
          if (index === 0) return; // hero handled above
          if (section.id === "sec11") return; // contact section handled by dedicated GSAP ScrollTrigger timeline
          if (section.hasAttribute("data-motion-owner") || section.closest("[data-motion-owner]")) return;

          // --- Cards: the children of any grid, risen in sequence. ---
          section.querySelectorAll<HTMLElement>(GRID).forEach((grid) => {
            const cards = Array.from(grid.children).filter(
              (c): c is HTMLElement => c instanceof HTMLElement && !claimed.has(c)
            );
            if (cards.length === 0) return;

            gsap.from(cards, {
              scrollTrigger: { trigger: grid, start: "top 82%" },
              y: 56,
              opacity: 0,
              scale: 0.975,
              duration: 1,
              stagger: 0.12,
              ease: "power3.out",
            });

            cards.forEach((card, i) => {
              // Oversized numerals read as rising out of the card's lower edge.
              const numeral = Array.from(card.querySelectorAll<HTMLElement>("span")).find((s) =>
                /^0[1-9]$/.test(s.textContent?.trim() ?? "")
              );
              if (numeral) {
                gsap.from(numeral, {
                  scrollTrigger: { trigger: grid, start: "top 76%" },
                  yPercent: 108,
                  opacity: 0,
                  duration: 1.2,
                  delay: 0.18,
                  ease: "power4.out",
                });
              }

              // The diagonal arrow slides in along its own axis.
              const arrow = card.querySelector<HTMLElement>("svg");
              if (arrow) {
                gsap.from(arrow, {
                  scrollTrigger: { trigger: grid, start: "top 76%" },
                  x: -16,
                  y: 16,
                  opacity: 0,
                  duration: 0.85,
                  delay: 0.2 + i * 0.1,
                  ease: "power3.out",
                });
              }

              claim(card);
            });
          });

          // --- Headings, then the loose copy around them. ---
          Array.from(section.querySelectorAll<HTMLElement>("h2"))
            .filter((h) => !claimed.has(h))
            .forEach((heading) => {
              gsap.from(heading, {
                scrollTrigger: { trigger: heading, start: "top 88%" },
                y: 46,
                opacity: 0,
                duration: 1.05,
                ease: "power3.out",
              });
              claim(heading);
            });

          const copy = Array.from(section.querySelectorAll<HTMLElement>(LOOSE_COPY)).filter(
            (el) => !claimed.has(el)
          );
          if (copy.length) {
            gsap.from(copy, {
              scrollTrigger: { trigger: section, start: "top 80%" },
              y: 24,
              opacity: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: "power3.out",
            });
            copy.forEach(claim);
          }
        });

        // Triggers measured before fonts and images settle sit at the wrong offsets.
        const refresh = () => ScrollTrigger.refresh();
        const timer = window.setTimeout(refresh, 400);
        window.addEventListener("load", refresh);

        return () => {
          window.clearTimeout(timer);
          window.removeEventListener("load", refresh);
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return null;
}
