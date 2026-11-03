"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, FlaskConical } from "lucide-react";
import { FadeUp } from "@/components/calculator/FadeUp";
import { DynamicInput } from "@/components/calculator/DynamicFields";

export function PeptideReconstitution() {
  const [peptideAmount, setPeptideAmount] = useState("5");
  const [waterMl, setWaterMl] = useState("2");

  const vAmt = parseFloat(peptideAmount) || 0;
  const wMl = parseFloat(waterMl) || 0;

  const isValid = vAmt > 0 && wMl > 0;
  let concentrationMgMlStr = "—";
  let concentrationMcgMlStr = "—";

  if (isValid) {
    const mgMl = vAmt / wMl;
    const mcgMl = (vAmt * 1000) / wMl;
    concentrationMgMlStr = `${mgMl.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} mg/mL`;
    concentrationMcgMlStr = `${Math.round(mcgMl).toLocaleString(undefined, { maximumFractionDigits: 0 })} mcg/mL`;
  }

  return (
    <section className="w-full rounded-3xl bg-white p-4 sm:p-6 md:p-12 lg:p-16 border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-20">
      {/* Left: Conversational Form */}
      <div className="flex-1 flex flex-col justify-center">
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Concentration Calculator
            </h2>
            <button
              type="button"
              onClick={() => {
                setPeptideAmount("5");
                setWaterMl("2");
              }}
              aria-label="Reset calculator inputs"
              className="w-8 h-8 rounded-full border border-black/10 hover:bg-black/5 flex items-center justify-center text-gray-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="font-inter text-2xl sm:text-3xl md:text-[2.5rem] font-light text-gray-900 tracking-tight leading-[1.7]">
            I have a <DynamicInput value={peptideAmount} onChange={setPeptideAmount} /> mg vial of research
            peptide. I will reconstitute it with <DynamicInput value={waterMl} onChange={setWaterMl} /> mL of
            bacteriostatic water.
          </div>
        </FadeUp>
      </div>

      {/* Right: Result */}
      <div className="w-full lg:w-[450px] shrink-0 flex flex-col gap-6">
        <FadeUp delay={0.2} className="h-full">
          <div className="bg-[#FAFAFA] rounded-2xl border border-black/5 p-8 md:p-10 flex flex-col items-center justify-between text-center h-full shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] min-h-[360px] relative">
            <div className="w-full text-center pb-6 border-b border-black/5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FlaskConical className="w-4 h-4 text-indigo-600" />
                <span className="font-inter text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                  Resulting Working Concentration
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={concentrationMgMlStr}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-inter text-4xl sm:text-5xl text-indigo-600 font-bold tracking-tight my-4"
                >
                  {concentrationMgMlStr}
                </motion.div>
              </AnimatePresence>
              <div className="font-inter text-sm font-medium text-gray-500">
                Equivalent to <span className="font-semibold text-gray-900">{concentrationMcgMlStr}</span>
              </div>
            </div>

            <div className="w-full my-6 bg-white p-6 rounded-xl border border-black/5 shadow-sm text-left">
              <div className="font-inter text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Dilution Breakdown
              </div>
              <div className="font-mono text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Total Peptide:</span>
                  <span className="font-bold text-gray-900">{vAmt} mg ({vAmt * 1000} mcg)</span>
                </div>
                <div className="flex justify-between">
                  <span>Diluent Volume:</span>
                  <span className="font-bold text-gray-900">{wMl} mL</span>
                </div>
                <div className="flex justify-between border-t border-black/5 pt-1 mt-1 font-semibold text-indigo-600">
                  <span>Formula:</span>
                  <span>{vAmt} mg ÷ {wMl} mL = {isValid ? (vAmt / wMl).toFixed(2) : "0"} mg/mL</span>
                </div>
              </div>
            </div>

            <div className="w-full text-center border-t border-black/5 pt-6 mt-auto">
              <p className="font-inter text-[11px] text-gray-400 leading-relaxed">
                Enter the peptide mass printed on the vial and the volume of diluent you plan to add. The calculator returns the working concentration of the finished solution in mg/mL and mcg/mL. Volume is an input you choose, not a result. This calculator is for research use only.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

