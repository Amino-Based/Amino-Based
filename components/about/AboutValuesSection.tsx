"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FlaskConical, Microscope, ShieldCheck, Users, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <FlaskConical className="w-8 h-8 text-indigo-500" />,
    topRightText: "SOLID-PHASE\nSYNTHESIS",
    titleMain: "SPPS",
    titleMainColor: "text-indigo-600 text-4xl mb-1",
    titleSub: "REPRODUCIBLE BY DESIGN",
    description:
      "We build every batch by solid-phase peptide synthesis, using controlled coupling cycles and documented run parameters — the same sequence produced twelve months apart runs the same route and reaches the same specification.",
    badges: ["CONSISTENT", "REPRODUCIBLE", "DOCUMENTED"],
  },
  {
    icon: <Microscope className="w-8 h-8 text-indigo-500" />,
    topRightText: "HPLC & MS\nANALYSIS",
    titleMain: "THIRD-PARTY",
    titleMainColor: "text-gray-900 text-2xl mb-1",
    titleSub: "TESTED BY SOMEONE ELSE",
    description:
      "Release testing goes to an independent analytical laboratory, not our own bench. HPLC quantifies purity, mass spectrometry confirms identity, and both results reach you on the Certificate of Analysis with the chromatogram attached.",
    badges: ["HPLC TESTED", "MS VERIFIED", "THIRD-PARTY"],
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
    topRightText: "CERTIFICATE\nOF ANALYSIS",
    titleMain: "COA",
    titleMainColor: "text-gray-900 text-2xl mb-1",
    titleSub: "DOCUMENTED, AND RETRIEVABLE LATER",
    description:
      "Every batch ships with its own COA carrying the purity figure, the chromatogram, the batch number, the testing laboratory and the analysis date. We archive each one, so you can pull the same document again years afterwards.",
    badges: ["COA PER BATCH", "ARCHIVED", "TRACEABLE"],
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    topRightText: "LAB\nPARTNERSHIPS",
    titleMain: "DIRECT",
    titleMainColor: "text-gray-900 text-2xl mb-1",
    titleSub: "BUILT AROUND YOUR SPECIFICATION",
    description:
      "We work directly with laboratories and research institutions on sequence, purity threshold, quantity and modifications. Custom synthesis requests come back as a real quotation with a projected timeline, not a form response.",
    badges: ["CUSTOM SPECS", "DIRECT SUPPORT", "COLLABORATIVE"],
  },
];

export default function AboutValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".value-card",
        { y: 100, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".value-bg",
        { scale: 1.1 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
          scale: 1,
          ease: "none",
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8 lg:px-12 overflow-hidden flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-white">
        <img
          src="/quality and standards bg.png"
          alt="Quality Background"
          className="value-bg w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
        <h2 className="value-card text-3xl md:text-4xl font-inter font-bold text-gray-900 tracking-wider uppercase text-center mb-16">
          What Sets Us Apart
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="value-card bg-white/95 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/40 flex flex-col h-full justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50/50 rounded-xl">{feature.icon}</div>
                <div className="text-right">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase whitespace-pre-line leading-tight block">
                    {feature.topRightText}
                  </span>
                </div>
              </div>

              <div className="mb-4 mt-auto">
                <h3 className={`font-inter font-bold tracking-tight ${feature.titleMainColor}`}>{feature.titleMain}</h3>
                <h4 className="font-inter text-lg font-semibold text-gray-800 tracking-wide leading-tight">
                  {feature.titleSub}
                </h4>
                <div className="w-10 h-0.5 bg-indigo-500/30 mt-4 rounded-full" />
              </div>

              <p className="font-inter text-gray-500 text-sm leading-relaxed mb-6">{feature.description}</p>

              <div className="flex flex-wrap gap-1 mt-auto">
                {feature.badges.map((badge, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-1 bg-gray-50 px-1.5 py-1 rounded-md border border-gray-100">
                    <CheckCircle2 className="w-[10px] h-[10px] text-indigo-400" />
                    <span className="text-[8px] font-bold text-gray-500 tracking-wider uppercase">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
