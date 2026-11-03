"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_FAQS } from "@/lib/defaultFaqs";

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
  faqs = DEFAULT_FAQS,
  showCallout = true,
  calloutTitle = "Still have a questions?",
  calloutText = "Can't find the answer to your question? Send us an inquiry and our scientific support team will get back to you as soon as possible!",
  calloutButtonText = "Send email",
  calloutButtonLink = "/contact-us",
  className = "",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      className={`py-20 sm:py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7] ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Pill Badge, Large Heading & 'Still have questions?' Callout Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 sm:lg:top-32 lg:self-start flex flex-col justify-between space-y-6">
            <div>
              {/* Category Pill Badge with active glowing dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] shadow-2xs mb-5">
                <span className="w-2 h-2 rounded-full bg-[#894EF2] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider text-[#894EF2] uppercase">
                  {badgeText}
                </span>
              </div>

              {/* Main Display Heading matching homepage */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-[#0F0F11] leading-[1.08] mb-10 lg:mb-14">
                {title ?? (
                  <>
                    Frequently asked <br />
                    questions
                  </>
                )}
              </h2>
            </div>

            {/* Callout Card matching exact homepage reference design (sampled #F3F2F8) */}
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

          {/* Right Column: Scrollable Stacked Accordion Cards */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-3 px-1 text-xs text-[#71717A]">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#894EF2] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#894EF2]" />
                {faqs.length} Reference Inquiries
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                Scroll to view all questions ↓
              </span>
            </div>

            <div className="flex flex-col gap-3.5 pb-4 max-h-[560px] lg:max-h-[620px] overflow-y-auto pr-1 sm:pr-2.5 scroll-smooth [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
              {faqs.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen
                        ? "bg-white border-purple-200/90 shadow-sm"
                        : "bg-[#F6F7FB] border-[#E4E4E7]/70 hover:bg-white hover:border-purple-200/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-medium text-[#0F0F11] leading-snug">
                        {item.question}
                      </span>
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7]/80 shadow-2xs flex items-center justify-center shrink-0 text-[#894EF2] transition-colors">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 stroke-[2.4]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-gray-100/80">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
