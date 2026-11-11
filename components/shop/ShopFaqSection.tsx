"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export interface ShopFaqItem {
  question: string;
  answer: string;
}

const DEFAULT_SHOP_FAQS: ShopFaqItem[] = [
  {
    question: "What purity and analytical standards do your catalog peptides meet?",
    answer:
      "Every peptide in our research catalog is synthesized via high-fidelity solid-phase peptide synthesis (SPPS) and purified to exceed ≥99% analytical grade. Each production lot undergoes dual-tier verification: reverse-phase high-performance liquid chromatography (RP-HPLC) to assess chemical purity and electrospray ionization mass spectrometry (ESI-MS) to confirm precise molecular mass.",
  },
  {
    question: "How are catalog vials packaged and shipped to preserve biological integrity?",
    answer:
      "Peptides arrive lyophilized (freeze-dried) into stable cake or powder within sterile borosilicate glass vials sealed under an inert nitrogen/argon vacuum with tamper-evident flip-off aluminum crimp seals. Orders are packed in light-shielded, insulated containers with desiccant and temperature-control elements where required to prevent degradation during transit.",
  },
  {
    question: "How should research vials be stored upon receipt in the laboratory?",
    answer:
      "Lyophilized vials remain stable at ambient temperature (15°C – 25°C) during transit, but for prolonged stability they should be transferred immediately upon receipt to a -20°C freezer (or -80°C for multi-year preservation), protected from light and moisture. Once reconstituted with sterile bacteriostatic water or reagent-grade solvent, solutions should be kept at 2°C – 8°C and used within 21 to 28 days.",
  },
  {
    question: "How do I retrieve the Certificate of Analysis (COA) for a specific vial?",
    answer:
      "Every Amino-Based vial features a unique lot batch number printed on the bottle label. You can enter this batch number in our online Certificate of Analysis portal (/certificates) to instantly inspect the matching HPLC chromatogram, mass spectrometry readouts, and batch release data. A printed copy is also enclosed in your parcel.",
  },
  {
    question: "Are catalog compounds cleared for in-vivo or human administration?",
    answer:
      "No. All compounds listed in our catalog are sold exclusively for in-vitro laboratory research, cellular pathway assays, receptor binding models, and analytical calibration (Research Use Only • RUO). They are not intended for medical, diagnostic, veterinary, or direct human consumption under any circumstances.",
  },
  {
    question: "What are the shipping timeframes and order fulfillment policies?",
    answer:
      "Orders placed before 2:00 PM EST Monday through Friday are processed and dispatched the same business day. We ship via expedited tracked couriers with typical delivery in 1 to 3 business days within the continental United States. Real-time tracking and delivery confirmation are sent directly to your email upon fulfillment.",
  },
  {
    question: "Can academic institutions or biotechnology facilities place custom or bulk orders?",
    answer:
      "Yes. We support custom milligram-to-gram synthesis, tailored vial aliquot sizes, and institutional purchase orders. Please contact our scientific support team via our contact portal or email orders@aminobased.com with your target sequence and volume requirements to receive an official formal quote within 24 hours.",
  },
  {
    question: "How do I interpret the HPLC purity percentage and mass spectrometry peak?",
    answer:
      "Each COA displays an analytical reverse-phase HPLC chromatogram where the primary peak area integrates to ≥99% of total absorption at 214nm/220nm. The mass spectrometer trace confirms that the observed molecular weight corresponds exactly to the theoretical mono-isotopic or average molecular mass.",
  },
  {
    question: "What payment and procurement methods do you support for laboratory orders?",
    answer:
      "We accept all major corporate credit cards, institutional procurement cards (P-Cards), ACH/wire transfers, and approved institutional purchase orders (NET 30 terms for verified universities, medical centers, and CROs).",
  },
  {
    question: "What is your replacement policy if a shipment is compromised in transit?",
    answer:
      "Every parcel is protected under our Guaranteed Cold-Chain & Arrival Policy. If your package is damaged, delayed by carrier exception, or compromised in transit, notify our scientific support desk within 48 hours for immediate same-day priority dispatch of replacement vials at zero additional expense.",
  },
];

export default function ShopFaqSection({
  faqs = DEFAULT_SHOP_FAQS,
  className = "",
}: {
  faqs?: ShopFaqItem[];
  className?: string;
}) {
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

  // Recalculate ScrollTrigger measurements when an accordion opens or closes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 320);
    return () => clearTimeout(timer);
  }, [openIndex]);

  return (
    <section
      ref={sectionRef}
      id="shop-faq"
      className={`relative z-20 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#F8FAFC] to-white border-t border-[#E4E4E7]/70 ${className}`}
    >
      <div className="max-w-7xl lg:max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Heading and Contact Support Card */}
          <div className="lg:col-span-5 lg:self-start flex flex-col space-y-6">
            <div>
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/15 mb-4 sm:mb-5">
                <span className="w-2 h-2 rounded-full bg-[#031B4E] animate-pulse" />
                <span className="text-[11px] font-bold tracking-wider text-[#031B4E] uppercase">
                  Catalog & Ordering FAQ
                </span>
              </div>

              {/* Main Display Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-normal tracking-tight text-[#071739] leading-[1.12] mb-4">
                Frequently Asked <br className="hidden sm:inline" />
                Questions
              </h2>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mb-6 sm:mb-8">
                Key laboratory information regarding compound purity, cold-chain handling, vial reconstitution guidelines, and compliance standards for all research compounds.
              </p>
            </div>

            {/* Scientific Support & Bulk Orders Card */}
            <div className="bg-[#F1F5F9]/80 border border-[#CBD5E1]/70 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-full bg-[#031B4E]/10 flex items-center justify-center text-[#031B4E]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#071739] tracking-tight">
                  Need Custom Synthesis or Bulk Quote?
                </h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed mb-5 max-w-xs">
                Our synthesis chemists and laboratory procurement team provide custom aliquot batches, specialized peptide blends, and institutional invoicing.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#031B4E] hover:bg-[#07266E] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <span>Contact Lab Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Scroll-Pinned FAQ Accordion List */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-2 px-1 text-xs text-[#64748B]">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#031B4E] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#031B4E]" />
                {faqs.length} Reference Inquiries
              </span>
              <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline-flex items-center gap-1">
                <span>Scroll to browse inquiries</span>
                <span className="text-[#031B4E] font-bold">({Math.round(scrollProgress * 100)}%)</span>
              </span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="h-0.5 w-full bg-slate-100 rounded-full mb-4 overflow-hidden hidden lg:block">
              <div
                className="h-full bg-[#031B4E] transition-[width] duration-150 ease-out rounded-full"
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
                      className={`rounded-xl sm:rounded-2xl transition-colors duration-200 border ${
                        isOpen
                          ? "bg-white border-[#031B4E]/40 shadow-sm"
                          : "bg-white/90 hover:bg-white border-[#E2E8F0] shadow-2xs"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(idx)}
                        aria-expanded={isOpen}
                        className="w-full text-left py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <span
                          className={`text-sm sm:text-base font-semibold tracking-tight transition-colors pr-2 leading-snug ${
                            isOpen ? "text-[#031B4E]" : "text-[#0F172A]"
                          }`}
                        >
                          {item.question}
                        </span>

                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                            isOpen
                              ? "bg-[#031B4E] text-white rotate-180"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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
                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 text-xs sm:text-[13px] text-[#475569] leading-relaxed border-t border-slate-100/90">
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

