"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ContactFaqItem {
  question: string;
  answer: string;
}

const DEFAULT_CONTACT_FAQS: ContactFaqItem[] = [
  {
    question: "What is the typical turnaround time for laboratory inquiries?",
    answer:
      "All inquiries submitted via our contact portal or sent to support@aminobased.com receive a direct, detailed response from our technical team within 24 hours during standard laboratory operating hours (Monday through Friday, 8:00 AM – 6:00 PM EST).",
  },
  {
    question: "How do I request institutional quotes or volume purchase terms?",
    answer:
      "Select 'Institutional & Bulk Quote' in the contact form or email orders@aminobased.com with the compound names, desired vial quantities or milligrams, and target procurement timeline. Volume quotes and institutional invoicing terms are processed within one business day.",
  },
  {
    question: "Do you support custom peptide synthesis for proprietary sequences?",
    answer:
      "Yes. We support custom solid-phase peptide synthesis (SPPS) for research institutions, academic labs, and biotechnology partners. Submit your desired amino acid sequence, target scale (mg to grams), and purity threshold (≥95% to ≥99%) for a detailed feasibility review.",
  },
  {
    question: "How can I verify the Certificate of Analysis for a vial in my laboratory?",
    answer:
      "Every shipment is keyed to a unique batch number printed on the vial label. You can enter your batch number on our online Lot Verification portal (/certificates) to instantly inspect the matching reverse-phase HPLC chromatogram and mass spectrometry report, or request a digital copy from our team.",
  },
  {
    question: "Why does Amino Based provide written support rather than telephone support?",
    answer:
      "Managing inquiries in writing ensures absolute precision when referencing chemical formulations, batch lot codes, molecular sequences, and laboratory shipping addresses. Written records protect both researchers and our facility against transcription errors.",
  },
  {
    question: "Can your support team provide dosage or in-vivo administration guidance?",
    answer:
      "No. In strict compliance with regulatory standards, all peptide compounds synthesized by Amino Based are exclusively for in-vitro laboratory research, cell culture investigations, and analytical assay calibration. We cannot provide instructions for human, veterinary, or clinical use.",
  },
];

export default function ContactFaqAccordion({
  faqs = DEFAULT_CONTACT_FAQS,
}: {
  faqs?: ContactFaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-white border-t border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Pill Badge, Large Heading & 'Still have questions?' Callout Card (Matching Homepage) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Category Pill Badge with active glowing dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] shadow-2xs mb-5">
                <span className="w-2 h-2 rounded-full bg-[#894EF2] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider text-[#894EF2] uppercase">
                  Support Knowledge Base
                </span>
              </div>

              {/* Main Display Heading matching homepage */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-[#0F0F11] leading-[1.08] mb-10 lg:mb-14">
                Frequently asked <br />
                questions
              </h2>
            </div>

            {/* Callout Card matching exact homepage reference design (sampled #F3F2F8) */}
            <div className="bg-[#F3F2F8] border border-[#E4E4E7]/70 rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-2xs mt-auto">
              <h3 className="text-xl sm:text-2xl font-medium text-[#0F0F11] mb-2.5 tracking-tight">
                Still have a questions?
              </h3>
              <p className="text-xs sm:text-[13px] text-[#71717A] leading-relaxed mb-6 max-w-xs">
                Can&apos;t find the answer to your question? Send us an inquiry and our scientific support team will get back to you as soon as possible!
              </p>
              <a
                href="mailto:support@aminobased.com"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#894EF2] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(137,78,242,0.35)] hover:shadow-[0_6px_20px_rgba(137,78,242,0.45)] transition-all hover:scale-105 active:scale-95"
              >
                Send email
              </a>
            </div>
          </div>

          {/* Right Column: Stacked Accordion Cards (sampled #F6F7FB matching homepage) */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
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
    </section>
  );
}
