"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calculator,
  Droplets,
  Scale,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ThermometerSnowflake,
  Sun,
  Wind,
  Layers,
  ArrowRight,
  Info,
  HelpCircle,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import FAQSection from "@/components/FAQSection";
import { CALCULATOR_FAQS } from "@/lib/calculatorFaqs";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import SyringePistonVisualizer from "@/components/calculator/SyringePistonVisualizer";


// Presets for chips
const MASS_PRESETS = [2, 3, 5, 10, 15, 30];
const VOLUME_PRESETS = [1, 2, 3];

// 18-row Reference Matrix
const CHART_ROWS = [
  { mass: 2, vol: 1, mgml: "2.00", mcgml: "2,000", perTenth: "200 mcg" },
  { mass: 2, vol: 2, mgml: "1.00", mcgml: "1,000", perTenth: "100 mcg" },
  { mass: 2, vol: 3, mgml: "0.67", mcgml: "667", perTenth: "66.7 mcg" },
  { mass: 3, vol: 1, mgml: "3.00", mcgml: "3,000", perTenth: "300 mcg" },
  { mass: 3, vol: 2, mgml: "1.50", mcgml: "1,500", perTenth: "150 mcg" },
  { mass: 3, vol: 3, mgml: "1.00", mcgml: "1,000", perTenth: "100 mcg" },
  { mass: 5, vol: 1, mgml: "5.00", mcgml: "5,000", perTenth: "500 mcg" },
  { mass: 5, vol: 2, mgml: "2.50", mcgml: "2,500", perTenth: "250 mcg" },
  { mass: 5, vol: 3, mgml: "1.67", mcgml: "1,667", perTenth: "166.7 mcg" },
  { mass: 10, vol: 1, mgml: "10.00", mcgml: "10,000", perTenth: "1,000 mcg" },
  { mass: 10, vol: 2, mgml: "5.00", mcgml: "5,000", perTenth: "500 mcg" },
  { mass: 10, vol: 3, mgml: "3.33", mcgml: "3,333", perTenth: "333.3 mcg" },
  { mass: 15, vol: 1, mgml: "15.00", mcgml: "15,000", perTenth: "1,500 mcg" },
  { mass: 15, vol: 2, mgml: "7.50", mcgml: "7,500", perTenth: "750 mcg" },
  { mass: 15, vol: 3, mgml: "5.00", mcgml: "5,000", perTenth: "500 mcg" },
  { mass: 30, vol: 1, mgml: "30.00", mcgml: "30,000", perTenth: "3,000 mcg" },
  { mass: 30, vol: 2, mgml: "15.00", mcgml: "15,000", perTenth: "1,500 mcg" },
  { mass: 30, vol: 3, mgml: "10.00", mcgml: "10,000", perTenth: "1,000 mcg" },
];

export default function PeptideCalculatorClient() {
  const [mass, setMass] = useState<number>(5);
  const [volume, setVolume] = useState<number>(2);

  // Derived calculations
  const isValid = !isNaN(mass) && !isNaN(volume) && mass > 0 && volume > 0;
  const mgPerMl = isValid ? mass / volume : 0;
  const mcgPerMl = isValid ? mgPerMl * 1000 : 0;

  const handleReset = () => {
    setMass(5);
    setVolume(2);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F0F11] selection:bg-[#F3F2F8] selection:text-[#894EF2]">
      
      {/* =========================================================================
          1. WIDESCREEN HERO BANNER & TITLE (MATCHING SHOP PAGE ARCHITECTURE)
          ========================================================================= */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 bg-white">
        <div className="max-w-7xl lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Wayfinding Breadcrumbs */}
          <div className="mb-6 sm:mb-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Research Tools", href: "/blog" },
                { label: "Reconstitution Calculator" },
              ]}
            />
          </div>

          {/* Centered Serif Title */}
          <div className="text-center pt-2 sm:pt-4">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#071739] tracking-tight">
              Peptide Concentration Calculator
            </h1>
            <p className="mt-2 text-xs sm:text-[13px] font-mono text-[#71717A] tracking-wider uppercase">
              By the Research Team &nbsp;·&nbsp; Analytical Reconstitution Reference
            </p>
          </div>

          {/* Intro description & Safety Notices */}
          <div className="max-w-4xl mx-auto mt-6 sm:mt-8 space-y-6">
            <p className="text-base sm:text-lg text-[#52525B] text-center leading-relaxed">
              Reconstitution means dissolving a lyophilized (freeze-dried) peptide in a measured volume of diluent. This calculator takes the two numbers that decide the result — <strong className="text-[#0F0F11] font-semibold">vial mass in mg</strong> and <strong className="text-[#0F0F11] font-semibold">diluent volume in mL</strong> — and returns the only two numbers that follow from them: <strong className="text-[#0F0F11] font-semibold">concentration in mg/mL</strong> and <strong className="text-[#0F0F11] font-semibold">mcg/mL</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Laboratory RUO Notice */}
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
                  <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#92400E]">
                    Laboratory RUO Only
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-[#78350F] leading-relaxed">
                  For laboratory and in-vitro research by qualified professionals. Not for human or animal consumption, and not for diagnostic or therapeutic use.
                </p>
              </div>

              {/* Scope of Tool */}
              <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#0096c8] shrink-0" />
                  <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#0F0F11]">
                    Scope of This Tool
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-[#71717A] leading-relaxed">
                  Concentration math only. This page produces no dose figures, no administration guidance, and no protocols — by design.
                </p>
              </div>
            </div>
          </div>

          {/* Panoramic Widescreen Hero Banner matching Shop page ratio */}
          <div className="relative w-full aspect-[21/9] rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-xs border border-[#E4E4E7]/60 group mt-10 sm:mt-12">
            <Image
              src="/assets/calculator/amino-based-calculator-hero.png"
              alt="Amino Based Precision Peptide Reconstitution Reference & Concentration Calculator"
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center group-hover:scale-101 transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Clean Floating Badges */}
            <div className="absolute top-3.5 inset-x-3.5 sm:top-5 sm:inset-x-5 flex items-center justify-between gap-3 pointer-events-none z-10">
              <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#071739] shadow-2xs border border-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0096c8] animate-pulse" />
                Amino Based Laboratory Standard • Reconstitution Tool
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-[#031B4E] border border-white/60 shadow-2xs">
                  Bacteriostatic Diluent Math
                </span>
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-[#071739] border border-white/60 shadow-2xs">
                  Research Use Only (RUO)
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          LIVE CONCENTRATION CALCULATOR (INTERACTIVE TOOL)
          ========================================================================= */}
      <section id="calculator" className="py-12 sm:py-16 px-6 md:px-12 lg:px-20 bg-[#FAF9F5]">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-white border-2 border-[#E4E4E7] rounded-3xl p-6 sm:p-10 shadow-sm transition-all">
            
            {/* Header with Title and Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F2F8] border border-[#E4E4E7] mb-2">
                  <Calculator className="w-3.5 h-3.5 text-[#894EF2]" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase">
                    Interactive Reconstitution Calculator
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0F0F11]">
                  Live Concentration Calculator
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full border border-[#E4E4E7] bg-white text-xs font-mono font-medium text-[#52525B] hover:text-[#894EF2] hover:border-[#894EF2] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults (5 mg / 2 mL)
              </button>
            </div>

            {/* Sentence-Style Natural Inputs */}
            <div className="my-8">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0F0F11] leading-relaxed">
                A{" "}
                <label className="inline-block relative">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={mass || ""}
                    onChange={(e) => setMass(parseFloat(e.target.value))}
                    aria-label="Vial mass in milligrams"
                    className="w-24 sm:w-28 text-center font-mono font-bold text-[#894EF2] bg-[#F6F7FB] border border-[#E4E4E7] border-b-2 border-b-[#894EF2] rounded-xl px-2 py-1 mx-1.5 focus:outline-hidden focus:bg-[#F3F2F8] transition-all"
                  />
                  <span className="sr-only">Vial Mass in milligrams</span>
                </label>
                <span className="text-sm sm:text-base font-mono text-[#71717A] font-semibold mr-2">mg</span>
                vial reconstituted with{" "}
                <label className="inline-block relative">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={volume || ""}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Diluent volume in millilitres"
                    className="w-24 sm:w-28 text-center font-mono font-bold text-[#894EF2] bg-[#F6F7FB] border border-[#E4E4E7] border-b-2 border-b-[#894EF2] rounded-xl px-2 py-1 mx-1.5 focus:outline-hidden focus:bg-[#F3F2F8] transition-all"
                  />
                  <span className="sr-only">Diluent Volume in millilitres</span>
                </label>
                <span className="text-sm sm:text-base font-mono text-[#71717A] font-semibold mr-2">mL</span>
                of diluent.
              </p>
            </div>

            {/* Interactive Quick-Pick Chips */}
            <div className="space-y-4 pt-2 pb-6 border-b border-[#E4E4E7]">
              
              {/* Mass Chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-mono font-semibold tracking-wider text-[#71717A] uppercase mr-1">
                  Vial Mass:
                </span>
                {MASS_PRESETS.map((m) => {
                  const active = mass === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMass(m)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-[#894EF2] text-white shadow-xs font-semibold"
                          : "bg-[#F6F7FB] text-[#0F0F11] border border-[#E4E4E7] hover:bg-[#F3F2F8]"
                      }`}
                    >
                      {m} mg
                    </button>
                  );
                })}
              </div>

              {/* Volume Chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-mono font-semibold tracking-wider text-[#71717A] uppercase mr-1">
                  Diluent Volume:
                </span>
                {VOLUME_PRESETS.map((v) => {
                  const active = volume === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVolume(v)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-[#894EF2] text-white shadow-xs font-semibold"
                          : "bg-[#F6F7FB] text-[#0F0F11] border border-[#E4E4E7] hover:bg-[#F3F2F8]"
                      }`}
                    >
                      {v} mL
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-8">
              
              {/* Card 1: mg/mL */}
              <div className="lg:col-span-4 bg-[#F3F2F8] border border-[#894EF2]/20 rounded-2xl p-5 shadow-2xs">
                <p className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase mb-1.5">
                  Concentration (mg/mL)
                </p>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-[#0F0F11] tracking-tight">
                  {isValid ? parseFloat(mgPerMl.toFixed(2)).toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"}
                  <span className="text-sm font-medium text-[#71717A] ml-2">mg/mL</span>
                </div>
                <p className="text-xs text-[#71717A] mt-2">
                  Milligrams of active compound per 1.0 mL of solution.
                </p>
              </div>

              {/* Card 2: mcg/mL */}
              <div className="lg:col-span-4 bg-[#F3F2F8] border border-[#894EF2]/20 rounded-2xl p-5 shadow-2xs">
                <p className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase mb-1.5">
                  Concentration (mcg/mL)
                </p>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-[#0F0F11] tracking-tight">
                  {isValid ? Math.round(mcgPerMl).toLocaleString("en-US") : "—"}
                  <span className="text-sm font-medium text-[#71717A] ml-2">mcg/mL</span>
                </div>
                <p className="text-xs text-[#71717A] mt-2">
                  Micrograms per 1.0 mL (or {isValid ? (mcgPerMl / 100).toFixed(1) : "—"} mcg per 0.01 mL).
                </p>
              </div>

              {/* Card 3: Exact Breakdown */}
              <div className="lg:col-span-4 bg-[#F6F7FB] border border-[#E4E4E7] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-mono font-semibold tracking-wider text-[#52525B] uppercase mb-1.5">
                    Calculation Breakdown
                  </p>
                  {isValid ? (
                    <div className="text-xs sm:text-[13px] text-[#52525B] space-y-1 font-mono">
                      <div>Total Peptide: <strong className="text-[#0F0F11]">{mass} mg</strong> ({Math.round(mass * 1000).toLocaleString()} mcg)</div>
                      <div>Diluent Volume: <strong className="text-[#0F0F11]">{volume} mL</strong></div>
                      <div>Formula: {mass} ÷ {volume} = <strong className="text-[#894EF2]">{mgPerMl.toFixed(2)} mg/mL</strong></div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#DC2626] font-mono font-medium">
                      Enter a vial mass and a diluent volume, both above zero.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Error or Explanation Message */}
            {!isValid && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-mono text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Concentration is undefined at zero or negative numbers — please check both inputs.</span>
              </div>
            )}

            {/* Live Syringe Piston Calibration & Visualizer */}
            <SyringePistonVisualizer
              massMg={mass}
              volumeMl={volume}
              onMassChange={(m) => setMass(m)}
              onVolumeChange={(v) => setVolume(v)}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          TABLE OF CONTENTS JUMP LINKS
          ========================================================================= */}
      <nav aria-label="Peptide calculator sections" className="py-6 px-6 md:px-12 lg:px-20 border-y border-[#E4E4E7] bg-white sticky top-16 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono font-semibold text-[#71717A] uppercase shrink-0 mr-2">
            Jump to:
          </span>
          {[
            { id: "syringe-visualizer", label: "Syringe Piston" },
            { id: "risk", label: "01 Risk" },
            { id: "procedure", label: "02 Procedure" },
            { id: "units", label: "03 Units" },
            { id: "math", label: "04 The Math" },
            { id: "chart", label: "05 Chart" },
            { id: "storage", label: "06 Storage" },
            { id: "mistakes", label: "07 Mistakes" },
            { id: "visual", label: "08 Visual Difference" },
            { id: "degradation", label: "09 Degradation" },
            { id: "glossary", label: "10 Glossary" },
            { id: "faq-section", label: "FAQs" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3.5 py-1.5 rounded-full border border-[#E4E4E7] bg-white text-xs font-mono text-[#52525B] hover:text-[#894EF2] hover:border-[#894EF2] hover:bg-[#F3F2F8] shrink-0 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* =========================================================================
          01 RISK: ONE DECIMAL DECIDES EVERY NUMBER THAT FOLLOWS
          ========================================================================= */}
      <section id="risk" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-white scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              01
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Mathematical Precision & In-Vitro Risk
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            One Decimal Decides Every Number That Follows
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Concentration is not a subjective preference. It is a mathematical constant that dictates every subsequent pipetting, dilution, or measurement in your protocol.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#F3F2F8] border border-[#E4E4E7] flex items-center justify-center text-[#894EF2]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-[#0F0F11]">The 10× Decimal Hazard</h3>
              </div>
              <p className="text-sm text-[#52525B] leading-relaxed">
                A single misplaced decimal shifts concentration tenfold. In laboratory research, preparing 5.0 mg/mL versus 0.5 mg/mL or 50 mg/mL drastically skews cellular assays, receptor binding affinities, and pharmacodynamic observations. Double-check all unit scales before reconstitution.
              </p>
            </div>

            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#F3F2F8] border border-[#E4E4E7] flex items-center justify-center text-[#894EF2]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-[#0F0F11]">The 1,000× Unit Precision Scale</h3>
              </div>
              <p className="text-sm text-[#52525B] leading-relaxed">
                Milligrams (mg) and micrograms (mcg) differ by a factor of 1,000. Confusing 1 mg/mL with 1 mcg/mL represents a 1,000-fold discrepancy. Always verify whether downstream lab protocols quantify active compound in milligrams or micrograms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 PROCEDURE: THREE PHYSICAL STEPS — PREP, TRANSFER, DISSOLVE
          ========================================================================= */}
      <section id="procedure" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-[#FAF9F5] scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              02
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Laboratory Protocol
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Three Physical Steps — Prep, Transfer, Dissolve
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Lyophilized peptides are fragile macromolecules. Follow aseptic technique and protect tertiary peptide structure during dilution.
          </p>

          {/* 3 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Step 1 */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-6 sm:p-7 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#894EF2] text-white flex items-center justify-center font-mono font-semibold text-xs mb-4">
                1
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">
                Preparation &amp; Equilibration
              </h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Allow the lyophilized vial and bacteriostatic water diluent to equilibrate to ambient room temperature (15–20 minutes). Cold vials draw condensation when unsealed, introducing unmeasured moisture. Sanitize both vial septa with 70% isopropanol swabs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-6 sm:p-7 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#894EF2] text-white flex items-center justify-center font-mono font-semibold text-xs mb-4">
                2
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">
                Slow Wall Transfer
              </h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Draw the exact measured volume of diluent into a sterile graduated syringe. Puncture the rubber stopper at an angle and aim the needle tip against the inside glass wall of the vial. Slowly depress the plunger, letting diluent gently cascade down the glass. Never jet liquid directly onto the lyophilized cake.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-6 sm:p-7 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#894EF2] text-white flex items-center justify-center font-mono font-semibold text-xs mb-4">
                3
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">
                Gentle Swirl &amp; Dissolution
              </h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Never shake the vial. Vigorous agitation shears peptide chains and creates hydrophobic foam that denatures tertiary structure. Swirl gently or slowly roll the vial between your palms. Allow 5–15 minutes for complete dissolution until the solution is optically clear.
              </p>
            </div>
          </div>

          {/* Summary Strip */}
          <div className="bg-[#F3F2F8] border border-[#894EF2]/20 rounded-2xl p-6 mb-8">
            <h4 className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider mb-3">
              Essential Rules for Laboratory Handling
            </h4>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-[13px] text-[#0F0F11]">
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#894EF2] font-bold">01.</span>
                Equilibrate before unsealing.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#894EF2] font-bold">02.</span>
                Drip down the glass wall — never jet onto cake.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#894EF2] font-bold">03.</span>
                Swirl or roll — never shake.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#894EF2] font-bold">04.</span>
                Date and label with exact concentration immediately.
              </li>
            </ol>
          </div>

          {/* Side-by-side: More vs Less Diluent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-[#0F0F11] mb-2">
                Choosing More Diluent (e.g. 2–3 mL)
              </h4>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Produces a lower concentration. Greater physical liquid volume makes precise pipetting and aliquot division easier on standard laboratory equipment, minimizing percentage measurement errors.
              </p>
            </div>
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-[#0F0F11] mb-2">
                Choosing Less Diluent (e.g. 1 mL)
              </h4>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Produces a higher concentration. Demands high-precision micro-pipetting equipment, but minimizes total liquid volume required for concentrated in-vitro assay wells.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 UNITS: THE THREE UNITS THAT MATTER
          ========================================================================= */}
      <section id="units" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-white scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              03
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Unit Fundamentals
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            The Three Units That Matter
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Every calculation on this page turns on three units and their exact relationships.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* mg */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Mass Unit
              </span>
              <div className="text-3xl font-mono font-bold text-[#0F0F11] mb-2">mg</div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Milligram</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Unit of mass. Represents the quantity of lyophilized peptide synthesized and vacuum-sealed inside the vial. Standard sizes are 2 mg, 5 mg, 10 mg, 15 mg, and 30 mg.
              </p>
            </div>

            {/* mcg */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Micro-Scale Unit
              </span>
              <div className="text-3xl font-mono font-bold text-[#0F0F11] mb-2">mcg</div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Microgram (µg)</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Unit of mass. Exactly 1/1,000th of a milligram (1 mg = 1,000 mcg). Standard unit used for micro-scale in-vitro quantification and analytical dilutions.
              </p>
            </div>

            {/* mL */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Volume Unit
              </span>
              <div className="text-3xl font-mono font-bold text-[#0F0F11] mb-2">mL</div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Millilitre</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Unit of liquid volume. The quantity of diluent (bacteriostatic water or sterile saline) added to dissolve the peptide cake. 1 mL = 100 units on a standard U-100 syringe.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 text-xs sm:text-[13px] text-[#78350F] flex items-center gap-3">
            <Info className="w-4 h-4 text-[#B45309] shrink-0" />
            <span>
              <strong>Golden Conversion Rule:</strong> 1 mg = 1,000 mcg. To convert milligrams to micrograms, multiply by 1,000. To convert micrograms to milligrams, divide by 1,000.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04 THE MATH: TWO FORMULAS, NOTHING MORE
          ========================================================================= */}
      <section id="math" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-[#FAF9F5] scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              04
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Mathematical Formulas
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Two Formulas, Nothing More
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Reconstitution math requires no specialized software. The equations are deterministic and linear.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Formula 1 */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-3">
                Formula 01 · Milligrams per Millilitre
              </span>
              <div className="bg-[#F3F2F8] border border-[#E4E4E7] rounded-2xl p-4 text-center font-mono font-bold text-lg sm:text-xl text-[#894EF2] mb-4">
                mg/mL = Vial Mass (mg) ÷ Diluent Volume (mL)
              </div>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed mb-3">
                Divide the total mass of peptide powder inside the vial by the volume of diluent added.
              </p>
              <div className="p-3 bg-[#F6F7FB] rounded-xl text-xs font-mono text-[#0F0F11]">
                <strong>Worked Example:</strong> 10 mg vial ÷ 2.0 mL diluent = <strong>5.00 mg/mL</strong>
              </div>
            </div>

            {/* Formula 2 */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-3">
                Formula 02 · Micrograms per Millilitre
              </span>
              <div className="bg-[#F3F2F8] border border-[#E4E4E7] rounded-2xl p-4 text-center font-mono font-bold text-lg sm:text-xl text-[#894EF2] mb-4">
                mcg/mL = Concentration (mg/mL) × 1,000
              </div>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed mb-3">
                Multiply the mg/mL result by 1,000 to express the concentration at the microgram scale.
              </p>
              <div className="p-3 bg-[#F6F7FB] rounded-xl text-xs font-mono text-[#0F0F11]">
                <strong>Worked Example:</strong> 5.00 mg/mL × 1,000 = <strong>5,000 mcg/mL</strong> (50 mcg per 0.01 mL)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05 CHART: RECONSTITUTION REFERENCE LOOKUP TABLE
          ========================================================================= */}
      <section id="chart" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-white scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              05
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Lookup Reference Table
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Reconstitution Reference Chart
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-8">
            Standard concentration values across standard research vial masses (2 mg, 3 mg, 5 mg, 10 mg, 15 mg, 30 mg) and diluent volumes (1 mL, 2 mL, 3 mL).
          </p>

          <div className="border border-[#E4E4E7] rounded-3xl overflow-hidden shadow-2xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="bg-[#F6F7FB] border-b border-[#E4E4E7] text-[#71717A] font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Vial Mass</th>
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Diluent Added</th>
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Concentration (mg/mL)</th>
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Concentration (mcg/mL)</th>
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Per 0.1 mL (10 IU)</th>
                    <th className="py-3.5 px-4 sm:px-6 font-semibold">Formula Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7] font-mono text-[#0F0F11]">
                  {CHART_ROWS.map((row, idx) => {
                    const isEvenGroup = Math.floor(idx / 3) % 2 === 0;
                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-[#F3F2F8]/70 transition-colors ${
                          isEvenGroup ? "bg-white" : "bg-[#FAF9F5]"
                        }`}
                      >
                        <td className="py-3 px-4 sm:px-6 font-bold">{row.mass} mg</td>
                        <td className="py-3 px-4 sm:px-6 text-[#52525B]">{row.vol} mL</td>
                        <td className="py-3 px-4 sm:px-6 font-semibold text-[#894EF2]">{row.mgml} mg/mL</td>
                        <td className="py-3 px-4 sm:px-6 text-[#52525B]">{row.mcgml} mcg/mL</td>
                        <td className="py-3 px-4 sm:px-6 font-medium text-[#0F0F11]">{row.perTenth}</td>
                        <td className="py-3 px-4 sm:px-6 text-[#71717A] text-[11px]">
                          {row.mass} ÷ {row.vol} = {row.mgml}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs font-mono text-[#71717A] mt-3">
            * 0.1 mL corresponds to 10 tick marks on a standard 1 mL (U-100) insulin-type laboratory syringe.
          </p>
        </div>
      </section>

      {/* =========================================================================
          06 STORAGE: COLD, DARK AND DATED
          ========================================================================= */}
      <section id="storage" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-[#FAF9F5] scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              06
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Stability &amp; Preservation
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Cold, Dark and Dated
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            How storage parameters differ between dry lyophilized powder and reconstituted peptide solution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Lyophilized */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Before Reconstitution · Dry Powder
              </span>
              <h3 className="text-xl font-medium text-[#0F0F11] mb-3">
                Lyophilized Cake Storage
              </h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed mb-4">
                Store at <strong>−20°C</strong> (or −80°C for archival preservation). Dessicated, vacuum-sealed peptide powder remains exceptionally stable for months to years. Keep protected from ambient light and unseal only once equilibrated to room temperature.
              </p>
              <div className="space-y-2 text-xs font-mono text-[#0F0F11] pt-3 border-t border-[#E4E4E7]">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Temperature:</span>
                  <span>−20°C or −80°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Shelf Life:</span>
                  <span>12–36 Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Freezer Cycling:</span>
                  <span>Tolerant when dry</span>
                </div>
              </div>
            </div>

            {/* Reconstituted */}
            <div className="bg-white border border-[#E4E4E7] rounded-3xl p-7 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                After Reconstitution · Solution
              </span>
              <h3 className="text-xl font-medium text-[#0F0F11] mb-3">
                Reconstituted Solution Storage
              </h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed mb-4">
                Store at <strong>2°C to 8°C</strong> (refrigerated). With bacteriostatic water (0.9% benzyl alcohol), typical working stability is approximately <strong>28 days</strong>. Do not repeatedly freeze and thaw liquid vials. If long-term solution storage is required, divide into single-use aliquots before freezing.
              </p>
              <div className="space-y-2 text-xs font-mono text-[#0F0F11] pt-3 border-t border-[#E4E4E7]">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Temperature:</span>
                  <span>2°C to 8°C (Refrigerated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Working Reference:</span>
                  <span>~28 Days (BAC Water)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Freeze-Thaw:</span>
                  <span className="text-[#DC2626]">Avoid repeated cycling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 MISTAKES: FIVE MISTAKES THAT RUIN A VIAL
          ========================================================================= */}
      <section id="mistakes" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-white scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              07
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Handling Hazards
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Five Mistakes That Ruin a Vial
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Common laboratory handling errors that degrade or destroy peptide integrity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Mistake 1 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold text-xs mb-3">
                01
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Vigorous Shaking</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Creates shear stress at the air-liquid boundary. Shaking causes hydrophobic unfolding, chain fragmentation, and irreversible fibrillation or aggregation.
              </p>
            </div>

            {/* Mistake 2 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold text-xs mb-3">
                02
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Direct Cake Jetting</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Spraying diluent forcefully onto the lyophilized powder can cause violent localized foaming and denature sensitive sequences. Always drip down the glass wall.
              </p>
            </div>

            {/* Mistake 3 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold text-xs mb-3">
                03
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Topping Up Mid-Protocol</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Adding extra diluent days later changes the baseline concentration and invalidates all prior calculation logs. The concentration is fixed at initial mixing.
              </p>
            </div>

            {/* Mistake 4 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold text-xs mb-3">
                04
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Leaving on the Bench</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Room temperature exposure rapidly accelerates enzymatic hydrolysis and chemical degradation. Return reconstituted vials to 2°C–8°C immediately after sampling.
              </p>
            </div>

            {/* Mistake 5 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs md:col-span-2 lg:col-span-2">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold text-xs mb-3">
                05
              </div>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Skipping the Vial Label</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Failure to write down the exact mix date, diluent volume, and final mg/mL concentration leads to compromised research data. Never rely on memory when identical clear vials share a rack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          08 VISUAL DIFFERENCE: VISUALISING CONCENTRATION DIFFERENCES
          ========================================================================= */}
      <section id="visual" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-[#FAF9F5] scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              08
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Comparative Density
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Visualising Concentration Differences
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            The exact same 5 mg peptide mass dissolved in different diluent volumes yields vastly different concentration densities.
          </p>

          <div className="bg-white border border-[#E4E4E7] rounded-3xl p-7 sm:p-10 shadow-2xs space-y-8">
            
            {/* 1.0 mL */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <div>
                  <strong className="text-[#0F0F11] text-sm">5 mg in 1.0 mL</strong>
                  <span className="text-[#71717A] ml-2">High Concentration</span>
                </div>
                <div className="font-bold text-[#894EF2] text-sm">5.00 mg/mL (5,000 mcg/mL)</div>
              </div>
              <div className="h-7 w-full bg-[#F3F2F8] rounded-xl overflow-hidden p-1 border border-[#E4E4E7]">
                <div className="h-full bg-[#894EF2] rounded-lg transition-all duration-500" style={{ width: "100%" }} />
              </div>
            </div>

            {/* 2.0 mL */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <div>
                  <strong className="text-[#0F0F11] text-sm">5 mg in 2.0 mL</strong>
                  <span className="text-[#71717A] ml-2">Standard Balanced Ratio</span>
                </div>
                <div className="font-bold text-[#894EF2] text-sm">2.50 mg/mL (2,500 mcg/mL)</div>
              </div>
              <div className="h-7 w-full bg-[#F3F2F8] rounded-xl overflow-hidden p-1 border border-[#E4E4E7]">
                <div className="h-full bg-[#894EF2]/70 rounded-lg transition-all duration-500" style={{ width: "50%" }} />
              </div>
            </div>

            {/* 3.0 mL */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <div>
                  <strong className="text-[#0F0F11] text-sm">5 mg in 3.0 mL</strong>
                  <span className="text-[#71717A] ml-2">High Volume / Lower Density</span>
                </div>
                <div className="font-bold text-[#894EF2] text-sm">1.67 mg/mL (1,667 mcg/mL)</div>
              </div>
              <div className="h-7 w-full bg-[#F3F2F8] rounded-xl overflow-hidden p-1 border border-[#E4E4E7]">
                <div className="h-full bg-[#894EF2]/40 rounded-lg transition-all duration-500" style={{ width: "33.3%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          09 DEGRADATION: WHY PEPTIDES DEGRADE
          ========================================================================= */}
      <section id="degradation" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-white scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              09
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Biochemical Integrity
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Why Peptides Degrade
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Understanding the five primary physical and chemical pathways of peptide breakdown.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Mechanism 1 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Mechanism · Thermal Stress
              </span>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Thermal Denaturation</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Heat provides the kinetic energy that accelerates spontaneous hydrolysis of peptide amide bonds. Keep reconstituted solutions chilled at 2°C–8°C at all times.
              </p>
            </div>

            {/* Mechanism 2 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Mechanism · Mechanical Shear
              </span>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Freeze-Thaw Shear</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Ice crystal nucleation mechanically shreds secondary structure and concentrates solutes into eutectic micro-pockets. Avoid repeated freezing and thawing cycles.
              </p>
            </div>

            {/* Mechanism 3 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Mechanism · Photochemical
              </span>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Photodegradation (UV Light)</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Aromatic amino acid residues (Tryptophan, Tyrosine, Phenylalanine) absorb UV light, generating reactive free radicals that cause covalent cross-linking. Store in dark vials.
              </p>
            </div>

            {/* Mechanism 4 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Mechanism · Atmospheric
              </span>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Headspace Oxidation</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Atmospheric oxygen in vial headspace oxidizes Methionine and Cysteine sulfur atoms into sulfoxide and disulfide scrambled species. Minimize vial entries.
              </p>
            </div>

            {/* Mechanism 5 */}
            <div className="bg-[#F6F7FB] border border-[#E4E4E7] rounded-3xl p-6 shadow-2xs md:col-span-2 lg:col-span-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#894EF2] uppercase block mb-2">
                Mechanism · Chemical Instability
              </span>
              <h3 className="text-base font-medium text-[#0F0F11] mb-2">Sequence Fragility &amp; Deamidation</h3>
              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">
                Asparagine (Asn) and Glutamine (Gln) residues undergo spontaneous deamidation into aspartate/isoaspartate isomers, altering net charge and receptor binding conformation over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10 GLOSSARY: DEFINING KEY TERMS
          ========================================================================= */}
      <section id="glossary" className="py-16 sm:py-20 px-6 md:px-12 lg:px-20 border-b border-[#E4E4E7] bg-[#FAF9F5] scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-[#F3F2F8] text-[#894EF2] text-xs font-mono font-semibold">
              10
            </span>
            <span className="text-xs font-mono font-semibold text-[#894EF2] uppercase tracking-wider">
              Scientific Reference
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#0F0F11] tracking-tight mb-4">
            Laboratory Glossary
          </h2>
          <p className="text-base text-[#52525B] max-w-3xl leading-relaxed mb-10">
            Every term the calculator and this reconstitution guide rely on, defined clearly once.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                term: "Reconstitution",
                def: "Dissolving a lyophilized powder in a measured volume of diluent to produce a solution of known concentration.",
              },
              {
                term: "Lyophilized",
                def: "Freeze-dried. Water is removed under vacuum from frozen compound, leaving a dry powder or cake that is far more stable in storage than a solution.",
              },
              {
                term: "Diluent",
                def: "The liquid used to dissolve the powder — most commonly bacteriostatic water. Its volume, against the fixed vial mass, sets the concentration.",
              },
              {
                term: "Concentration",
                def: "The amount of peptide per unit volume of solution, expressed here in mg/mL or mcg/mL. It describes strength, not total quantity.",
              },
              {
                term: "Bacteriostatic Water",
                def: "Sterile water containing 0.9% benzyl alcohol as a preservative, which inhibits bacterial growth and suits repeated entry into the same container.",
              },
              {
                term: "Sterile Water",
                def: "Sterile water with no preservative added. Once opened it has no defence against contamination and is intended for single use.",
              },
              {
                term: "Aliquot",
                def: "A measured portion divided from a larger quantity. Splitting a solution into single-use aliquots means each portion is thawed, opened, and exposed only once.",
              },
              {
                term: "Working Concentration",
                def: "The concentration of the solution actually in use at the bench, as opposed to the mass printed on the original dry vial.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-2xs">
                <h3 className="text-base font-semibold text-[#0F0F11] mb-1.5">{item.term}</h3>
                <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ SECTION (USING HOMEPAGE DESIGN SYSTEM VIA FAQSection COMPONENT)
          ========================================================================= */}
      <FAQSection
        id="faq-section"
        badgeText="Reconstitution & Math FAQ"
        title={
          <>
            Frequently asked <br />
            questions
          </>
        }
        faqs={CALCULATOR_FAQS}
        showCallout={true}
        calloutTitle="Have a scientific question?"
        calloutText="Can't find the exact reconstitution formula or storage guideline for your compound? Send an inquiry to our analytical support team."
        calloutButtonText="Contact Support"
        calloutButtonLink="/contact-us"
      />

      {/* =========================================================================
          RESEARCH USE ONLY DISCLAIMER CARD
          ========================================================================= */}
      <section className="py-12 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#FAF9F5] border border-[#E4E4E7] rounded-3xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#0F0F11]">
                  Laboratory Research Use Only (RUO) Notice
                </h4>
                <p className="text-xs sm:text-[13px] text-[#71717A] leading-relaxed">
                  All products and materials referenced on this page are intended for laboratory and in-vitro research use by qualified professionals only. They are not drugs, dietary supplements, or cosmetics; they are not intended for human or animal consumption, and not for diagnostic, therapeutic, or preventive use. Statements on this page have not been evaluated by the U.S. Food and Drug Administration. This calculator performs concentration calculations only and provides no dosing, administration, or protocol guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

