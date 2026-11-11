"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DEFAULT_FAQS } from "@/lib/defaultFaqs";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  id?: string;
  badgeText?: string;
  title?: React.ReactNode;
  subtitle?: string;
  faqs?: FAQItem[];
  showCallout?: boolean;
  calloutTitle?: string;
  calloutText?: string;
  calloutButtonText?: string;
  calloutButtonLink?: string;
  className?: string;
}

export default function FAQSection({
  id = "faq-section",
  badgeText = "Amino Based Research FAQ",
  title,
  subtitle,
  faqs = DEFAULT_FAQS,
  showCallout = true,
  calloutTitle = "Still have a questions?",
  calloutText = "Can't find the answer to your question? Send us an inquiry and our scientific support team will get back to you as soon as possible!",
  calloutButtonText = "Send email",
  calloutButtonLink = "/contact-us",
  className = "",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const listWindowRef = useRef<HTMLDivElement>(null);
  const listInnerRef = useRef<HTMLDivElement>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const listWindow = listWindowRef.current;
      const listInner = listInnerRef.current;
      if (!section || !listWindow || !listInner) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const getScrollDistance = () => {
          return Math.max(0, listInner.scrollHeight - listWindow.clientHeight);
        };

        const initialScroll = getScrollDistance();
        if (initialScroll <= 0) return;

        const tween = gsap.to(listInner, {
          y: () => -getScrollDistance(),
          ease: "none",
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top+=80",
          end: () => `+=${getScrollDistance() + 160}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
          animation: tween,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        });

        return () => {
          trigger.kill();
          tween.kill();
          gsap.set(listInner, { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [faqs] }
  );

  // Recalculate ScrollTrigger measurements dynamically when an accordion opens or closes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 320);
    return () => clearTimeout(timer);
  }, [openIndex]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative z-20 py-20 sm:py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7] ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Pill Badge, Large Heading & Callout Card */}
          <div className="lg:col-span-5 lg:self-start flex flex-col justify-between space-y-6">
            <div>
              {/* Category Pill Badge with active glowing dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] shadow-2xs mb-5">
                <span className="w-2 h-2 rounded-full bg-[#894EF2] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider text-[#894EF2] uppercase">
                  {badgeText}
                </span>
              </div>

              {/* Main Display Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-[#0F0F11] leading-[1.08] mb-6">
                {title ?? (
                  <>
                    Frequently asked <br />
                    questions
                  </>
                )}
              </h2>

              {subtitle && (
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed max-w-md mb-6 sm:mb-8">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Callout Card */}
            {showCallout && (
              <div className="bg-[#F3F2F8] border border-[#E4E4E7]/70 rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-2xs mt-auto">
                <h3 className="text-xl sm:text-2xl font-medium text-[#0F0F11] mb-2.5 tracking-tight">
                  {calloutTitle}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#71717A] leading-relaxed mb-6 max-w-xs">
                  {calloutText}
                </p>
                <Link
                  href={calloutButtonLink}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#894EF2] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(137,78,242,0.35)] hover:shadow-[0_6px_20px_rgba(137,78,242,0.45)] transition-all hover:scale-105 active:scale-95"
                >
                  {calloutButtonText}
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Scroll-Pinned Stacked Accordion Cards */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-2 px-1 text-xs text-[#71717A]">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#894EF2] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#894EF2]" />
                {faqs.length} Reference Inquiries
              </span>
              <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline-flex items-center gap-1">
                <span>Scroll to browse inquiries</span>
                <span className="text-[#894EF2] font-bold">({Math.round(scrollProgress * 100)}%)</span>
              </span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="h-0.5 w-full bg-slate-100 rounded-full mb-4 overflow-hidden hidden lg:block">
              <div
                className="h-full bg-[#894EF2] transition-[width] duration-150 ease-out rounded-full"
                style={{ width: `${Math.max(6, Math.min(100, Math.round(scrollProgress * 100)))}%` }}
              />
            </div>

            {/* FAQ Window */}
            <div
              ref={listWindowRef}
              className="relative overflow-visible lg:overflow-hidden lg:h-[540px] xl:h-[600px] 2xl:h-[640px] lg:max-h-[calc(100vh-180px)] pr-0 lg:pr-1.5"
            >
              <div
                ref={listInnerRef}
                className="flex flex-col gap-3.5 py-1 pb-6 will-change-transform"
              >
                {faqs.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl transition-colors duration-200 border ${
                        isOpen
                          ? "bg-white border-purple-200/90 shadow-sm"
                          : "bg-[#F6F7FB] hover:bg-white border-[#E4E4E7]/70 shadow-2xs"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(idx)}
                        aria-expanded={isOpen}
                        className="w-full text-left py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <span className="text-sm sm:text-base font-medium text-[#0F0F11] leading-snug">
                          {item.question}
                        </span>

                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                            isOpen
                              ? "bg-[#894EF2] text-white rotate-180"
                              : "bg-white border border-[#E4E4E7]/80 text-[#894EF2] hover:bg-purple-50"
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className={isOpen ? "overflow-visible min-h-0" : "overflow-hidden min-h-0"}>
                          <div className="px-5 sm:px-6 pb-6 pt-3 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-gray-100/80">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
