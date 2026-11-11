"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

interface WhyChooseCard {
  number: string;
  title: string;
  bullets: string[];
  href: string;
  bgClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  bulletColor: string;
  arrowColor: string;
  tiltClass: string;
}

const CARDS: WhyChooseCard[] = [
  {
    number: "01",
    title: "≥99% HPLC Certified Purity",
    bullets: [
      "Dual-method testing conducted by independent ISO/IEC 17025 accredited analytical laboratories.",
      "High-performance liquid chromatography ensures sharp peak separation with zero detectable impurities.",
    ],
    href: "/certificates",
    bgClass: "bg-[#E8E5FA]",
    borderClass: "border-[#DDD8F8]/80",
    badgeBg: "bg-white/70",
    badgeText: "text-[#5B45E0]",
    textColor: "text-[#141416]",
    bulletColor: "text-[#4A4458]",
    arrowColor: "text-[#7C66DC]",
    tiltClass: "lg:-rotate-1 hover:lg:rotate-0",
  },
  {
    number: "02",
    title: "Inert Vacuum Lyophilization",
    bullets: [
      "Synthesized and sealed under inert high-purity nitrogen gas to eliminate oxidation of delicate peptide bonds.",
      "Type-1 borosilicate glass vials safeguard molecular tertiary structure across diverse research conditions.",
    ],
    href: "/about-us",
    bgClass: "bg-[#F3F0EA]",
    borderClass: "border-[#E7E3DB]/80",
    badgeBg: "bg-white/80",
    badgeText: "text-[#6B7280]",
    textColor: "text-[#141416]",
    bulletColor: "text-[#57534E]",
    arrowColor: "text-[#141416]",
    tiltClass: "lg:rotate-1 hover:lg:rotate-0",
  },
  {
    number: "03",
    title: "Batch-Specific Public COAs",
    bullets: [
      "Every product box features scannable batch numbers matching publicly accessible HPLC & MS analytical reports.",
      "Electrospray ionization mass spectrometry verifies exact molecular mass and theoretical peptide sequence.",
    ],
    href: "/certificates",
    bgClass: "bg-[#141416]",
    borderClass: "border-[#27272A]",
    badgeBg: "bg-white",
    badgeText: "text-[#141416]",
    textColor: "text-white",
    bulletColor: "text-[#D4D4D8]",
    arrowColor: "text-white",
    tiltClass: "lg:-rotate-2 hover:lg:rotate-0 shadow-xl",
  },
  {
    number: "04",
    title: "Same-Day Cold-Chain Dispatch",
    bullets: [
      "Domestic synthesis fulfillment: orders placed before 2:00 PM EST dispatch same-day from our US facility.",
      "Shipped in temperature-buffered, crush-resistant discreet packaging with real-time end-to-end tracking.",
    ],
    href: "/shop",
    bgClass: "bg-[#ECEAEF]",
    borderClass: "border-[#DFDCE3]/80",
    badgeBg: "bg-white/80",
    badgeText: "text-[#6B7280]",
    textColor: "text-[#141416]",
    bulletColor: "text-[#52525B]",
    arrowColor: "text-[#141416]",
    tiltClass: "lg:rotate-1 hover:lg:rotate-0",
  },
];

export default function WhyChooseUsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasMoved = useRef(false);
  const rafId = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isTouchDragging = useRef(false);

  // Continuous fluid interpolation matching the reference GIF exactly:
  // Active card: elevated UPPER (-32px), scale 1.0, opacity 1.0, deep shadow
  // Background/peeking cards: lowered DOWN (+20px), scale 0.88, opacity 0.65
  // Total vertical delta = 52px
  const updateCards = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < CARDS.length; i++) {
      const cardEl = cardRefs.current[i];
      if (!cardEl) continue;

      const cardCenter = cardEl.offsetLeft + cardEl.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      const cardWidth = cardEl.offsetWidth || 300;

      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = i;
      }

      // Normalized progress from 0 (far away) to 1 (perfectly centered)
      const rawProgress = Math.max(0, 1 - distance / (cardWidth * 0.95));
      // Sinusoidal easing curve for organic motion
      const progress = Math.sin((rawProgress * Math.PI) / 2);

      // Continuous dynamic values
      const translateY = 14 - progress * 42; // from +14px (lower) to -28px (upper)
      const scale = 0.93 + progress * 0.07;  // from 0.93 to 1.00 (keeps peeking card clearly visible)
      const opacity = 0.82 + progress * 0.18; // from 0.82 to 1.00 (crisp peeking card readability)
      const zIndex = Math.round(progress * 25) + 1;

      cardEl.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      cardEl.style.opacity = opacity.toFixed(3);
      cardEl.style.zIndex = `${zIndex}`;

      const cardInner = cardEl.firstElementChild as HTMLElement;
      if (cardInner) {
        if (progress > 0.5) {
          cardInner.style.boxShadow = `0 ${Math.round(progress * 24)}px ${Math.round(progress * 50)}px rgba(0,0,0,${(progress * 0.14).toFixed(3)})`;
        } else {
          cardInner.style.boxShadow = "0 4px 16px rgba(0,0,0,0.03)";
        }
      }
    }

    if (closestIdx !== activeIndexRef.current) {
      activeIndexRef.current = closestIdx;
      setActiveIndex(closestIdx);
    }
  }, []);

  // Continuous listener on scroll (fires during swipe & momentum glide)
  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updateCards);
  }, [updateCards]);

  useEffect(() => {
    updateCards();
    const handleResize = () => updateCards();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateCards]);

  // Programmatic smooth scroll to focus a specific card
  const scrollToCard = (idx: number) => {
    if (!scrollRef.current) return;
    const cardEl = cardRefs.current[idx];
    if (!cardEl) return;
    cardEl.scrollIntoView({
      behavior: "smooth",
      inline: idx === 0 ? "start" : "center",
      block: "nearest",
    });
    activeIndexRef.current = idx;
    setActiveIndex(idx);
  };

  // Touch drag handlers for smooth mobile gesture tracking & preventing accidental link taps
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    startScrollLeft.current = scrollRef.current.scrollLeft;
    hasMoved.current = false;
    isTouchDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDragging.current || !scrollRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;

    // When horizontal movement exceeds 6px and is greater than vertical drift,
    // mark hasMoved to prevent accidental link navigation and dynamically update scroll position
    if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
      hasMoved.current = true;
      scrollRef.current.scrollLeft = startScrollLeft.current - dx;
      updateCards();
    }
  };

  const handleTouchEnd = () => {
    if (!isTouchDragging.current) return;
    isTouchDragging.current = false;

    // If the user swiped horizontally, snap to the card closest to center
    if (hasMoved.current && scrollRef.current) {
      scrollToCard(activeIndexRef.current);
      setTimeout(() => {
        hasMoved.current = false;
      }, 250);
    }
  };

  // Mouse click-and-drag handlers for desktop browser / responsive testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startScrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    scrollRef.current.scrollLeft = startScrollLeft.current - walk;
    updateCards();
  };

  const handleMouseUpOrLeave = () => {
    if (!isDown.current) return;
    isDown.current = false;
    if (hasMoved.current && scrollRef.current) {
      scrollToCard(activeIndexRef.current);
    }
  };

  const handleCardClick = (e: React.MouseEvent, idx: number) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (activeIndex !== idx) {
      e.preventDefault();
      scrollToCard(idx);
    }
  };

  return (
    <section
      id="sec-why-choose-us"
      className="w-full bg-[#FAF9F6] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-[#E7E5E0] overflow-x-clip"
      aria-label="Why Choose Amino Based"
    >
      <div className="max-w-7xl mx-auto">
        {/* ========================================================= */}
        {/* TOP ROW: Pill Tags on Left + Dark Icon Button on Right    */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-white border border-black/5 text-xs font-semibold text-[#18181B] shadow-xs">
              Quality Assurance
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-black/5 text-xs font-medium text-[#71717A] shadow-xs">
              Analytical Standards
            </span>
          </div>

          <Link
            href="/shop"
            aria-label="Scroll to Catalog"
            className="w-10 h-10 rounded-2xl bg-[#141416] text-white flex items-center justify-center hover:bg-black transition-transform active:scale-95 shadow-sm"
          >
            <ArrowDown className="w-4 h-4" />
          </Link>
        </div>

        {/* ========================================================= */}
        {/* SECTION HEADING & EDITORIAL PARAGRAPH                     */}
        {/* ========================================================= */}
        <div className="max-w-3xl mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-[#141416] leading-[1.12]">
            Why choose Amino Based?
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-[#6B7280] leading-relaxed max-w-2xl font-normal">
            Our commitment to analytical research goes beyond standard peptide supply. Discover the
            verified HPLC purity benchmarks, third-party testing transparency, and clinical synthesis
            precision that set our laboratory apart.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET VIEW: CENTER-PEEKING SWIPABLE CAROUSEL                   */}
        {/* ========================================================================= */}
        <div className="block xl:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex overflow-x-auto snap-x snap-proximity gap-3.5 sm:gap-4 pt-10 pb-10 px-4 sm:px-6 touch-manipulation cursor-grab active:cursor-grabbing no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x proximity",
            }}
          >
            {CARDS.map((card, idx) => {
              const isInitialActive = idx === 0;
              return (
                <div
                  key={card.number}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={(e) => handleCardClick(e, idx)}
                  style={{
                    transform: isInitialActive
                      ? "translate3d(0, -28px, 0) scale(1.0)"
                      : "translate3d(0, 14px, 0) scale(0.93)",
                    opacity: isInitialActive ? 1 : 0.82,
                    zIndex: isInitialActive ? 26 : 1,
                    willChange: "transform, opacity",
                  }}
                  className="shrink-0 snap-start sm:snap-center w-[74vw] sm:w-[320px] max-w-[320px] origin-center select-none"
                >
                  <Link
                    href={card.href}
                    draggable={false}
                    onClick={(e) => handleCardClick(e, idx)}
                    style={{
                      boxShadow: isInitialActive
                        ? "0 24px 50px rgba(0,0,0,0.14)"
                        : "0 4px 16px rgba(0,0,0,0.03)",
                    }}
                    className={`block relative rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[380px] border transition-shadow duration-300 select-none ${
                      card.bgClass
                    } ${card.borderClass}`}
                  >
                    {/* TOP ROW: Number Badge & Top-Right Diagonal Arrow */}
                    <div className="flex items-center justify-between mb-8">
                      <span
                        className={`w-8 h-8 rounded-full ${card.badgeBg} ${card.badgeText} text-xs font-bold flex items-center justify-center shadow-xs`}
                      >
                        {card.number}
                      </span>

                      <div
                        className={`w-8 h-8 flex items-center justify-center ${card.arrowColor}`}
                      >
                        <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                      </div>
                    </div>

                    {/* MIDDLE / BOTTOM CONTENT: Title and Bulleted Specifications */}
                    <div className="flex-1 flex flex-col justify-between">
                      <h3
                        className={`text-xl font-bold tracking-tight leading-snug mb-5 ${card.textColor}`}
                      >
                        {card.title}
                      </h3>

                      <ul className="space-y-3 mt-auto">
                        {card.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className={`text-xs leading-relaxed flex items-start gap-2 ${card.bulletColor}`}
                          >
                            <span className="text-base leading-none select-none shrink-0 mt-0.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* REFERENCE-MATCHING PAGINATION INDICATOR (ROYAL BLUE PILL + DOTS + CHEVRONS) */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous card"
              className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#141416] disabled:opacity-25 disabled:cursor-not-allowed hover:bg-black/5 active:scale-95 transition-all shadow-xs touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {CARDS.map((card, idx) => (
                <button
                  key={card.number}
                  type="button"
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Go to card ${card.number}`}
                  className={`transition-all duration-300 rounded-full h-1.5 touch-manipulation ${
                    activeIndex === idx
                      ? "w-7 bg-[#2563EB]"
                      : "w-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToCard(Math.min(CARDS.length - 1, activeIndex + 1))}
              disabled={activeIndex === CARDS.length - 1}
              aria-label="Next card"
              className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#141416] disabled:opacity-25 disabled:cursor-not-allowed hover:bg-black/5 active:scale-95 transition-all shadow-xs touch-manipulation"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: CLEAN 4-COLUMN DECK GRID (PRESERVED 100% UNTOUCHED)         */}
        {/* ========================================================================= */}
        <div className="hidden xl:grid xl:grid-cols-4 xl:gap-7 items-stretch">
          {CARDS.map((card) => (
            <Link
              key={card.number}
              href={card.href}
              className={`group relative rounded-[28px] sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between min-h-[430px] border shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-300 ease-out select-none cursor-pointer ${card.bgClass} ${card.borderClass} ${card.tiltClass}`}
            >
              {/* TOP ROW: Number Badge & Top-Right Diagonal Arrow */}
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <span
                  className={`w-8 h-8 rounded-full ${card.badgeBg} ${card.badgeText} text-xs font-bold flex items-center justify-center shadow-xs`}
                >
                  {card.number}
                </span>

                <div
                  className={`w-8 h-8 flex items-center justify-center ${card.arrowColor} transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1`}
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.25]" />
                </div>
              </div>

              {/* MIDDLE / BOTTOM CONTENT: Title and Bulleted Specifications */}
              <div className="flex-1 flex flex-col justify-between">
                <h3
                  className={`text-xl sm:text-[22px] font-bold tracking-tight leading-snug mb-5 ${card.textColor}`}
                >
                  {card.title}
                </h3>

                <ul className="space-y-3 mt-auto">
                  {card.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className={`text-xs sm:text-[13px] leading-relaxed flex items-start gap-2 ${card.bulletColor}`}
                    >
                      <span className="text-base leading-none select-none shrink-0 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}