"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/calculator/FadeUp";
import { DynamicInput, DynamicSelect } from "@/components/calculator/DynamicFields";

type Unit = "mg" | "mcg" | "mL" | "IU";

export function UnitConverter() {
  const [val, setVal] = useState("5");
  const [fromUnit, setFromUnit] = useState<Unit>("mg");
  const [toUnit, setToUnit] = useState<Unit>("mcg");

  const handleFromChange = (newFrom: string) => {
    const unit = newFrom as Unit;
    setFromUnit(unit);
    if (unit === "mg" && toUnit !== "mcg" && toUnit !== "mg") setToUnit("mcg");
    if (unit === "mcg" && toUnit !== "mg" && toUnit !== "mcg") setToUnit("mg");
    if (unit === "mL" && toUnit !== "IU" && toUnit !== "mL") setToUnit("IU");
    if (unit === "IU" && toUnit !== "mL" && toUnit !== "IU") setToUnit("mL");
  };

  const getToOptions = () => {
    if (fromUnit === "mg" || fromUnit === "mcg") {
      return [
        { label: "mg", value: "mg" },
        { label: "mcg", value: "mcg" },
      ];
    }
    return [
      { label: "mL", value: "mL" },
      { label: "IU", value: "IU" },
    ];
  };

  const numericVal = parseFloat(val) || 0;
  let result = 0;
  let formattedResult = "—";

  if (numericVal > 0) {
    if (fromUnit === "mg" && toUnit === "mcg") result = numericVal * 1000;
    else if (fromUnit === "mcg" && toUnit === "mg") result = numericVal / 1000;
    else if (fromUnit === "mL" && toUnit === "IU") result = numericVal * 100;
    else if (fromUnit === "IU" && toUnit === "mL") result = numericVal / 100;
    else result = numericVal;

    formattedResult = result.toLocaleString(undefined, { maximumFractionDigits: 3 });
  }

  return (
    <section className="w-full rounded-3xl bg-white p-4 sm:p-6 md:p-12 lg:p-16 border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-20">
      {/* Left: Conversational Form */}
      <div className="flex-1 flex flex-col justify-center">
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Universal Converter</h2>
            <button
              type="button"
              onClick={() => {
                setVal("5");
                setFromUnit("mg");
                setToUnit("mcg");
              }}
              className="w-8 h-8 rounded-full border border-black/10 hover:bg-black/5 flex items-center justify-center text-gray-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="font-inter text-2xl sm:text-3xl md:text-[2.5rem] font-light text-gray-900 tracking-tight leading-[1.7] relative z-10">
            I want to convert <DynamicInput value={val} onChange={setVal} />
            <DynamicSelect
              value={fromUnit}
              onChange={handleFromChange}
              options={[
                { label: "mg", value: "mg" },
                { label: "mcg", value: "mcg" },
                { label: "mL", value: "mL" },
                { label: "IU", value: "IU" },
              ]}
            />{" "}
            into
            <DynamicSelect value={toUnit} onChange={(v) => setToUnit(v as Unit)} options={getToOptions()} />.
          </div>
        </FadeUp>
      </div>

      {/* Right: Result */}
      <div className="w-full lg:w-[450px] shrink-0">
        <FadeUp delay={0.2} className="h-full">
          <div className="bg-[#FAFAFA] rounded-2xl border border-black/5 p-8 md:p-12 flex flex-col items-center justify-center text-center h-full shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] min-h-[400px] relative">
            <h3 className="font-inter absolute top-8 font-bold uppercase tracking-[0.2em] text-gray-400 text-xs">
              Converted Result
            </h3>

            <div className="flex items-center gap-6 text-gray-300 my-10">
              <div className="font-inter text-2xl">{fromUnit}</div>
              <div className="w-20 h-px bg-black/10 relative flex items-center justify-center">
                <motion.div
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute"
                >
                  <ArrowRight className="w-5 h-5 text-indigo-600" />
                </motion.div>
              </div>
              <div className="font-inter text-2xl text-indigo-600">{toUnit}</div>
            </div>

            <div className="relative w-full flex flex-col items-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={formattedResult + toUnit}
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="font-inter text-5xl md:text-6xl text-indigo-600 tracking-tighter leading-none drop-shadow-sm mb-4"
                >
                  {formattedResult}
                </motion.div>
              </AnimatePresence>
              <div className="font-inter text-sm font-bold uppercase tracking-widest text-gray-400">{toUnit}</div>
            </div>

            {fromUnit === "mL" && toUnit === "IU" && (
              <div className="font-inter absolute bottom-8 text-xs font-bold uppercase tracking-widest text-gray-300">
                Assumes U-100 Syringe
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
