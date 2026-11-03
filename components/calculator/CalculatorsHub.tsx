"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Scale, ArrowRightLeft } from "lucide-react";
import { PeptideReconstitution } from "@/components/calculator/PeptideReconstitution";
import { BmiBmrCalculator } from "@/components/calculator/BmiBmrCalculator";
import { UnitConverter } from "@/components/calculator/UnitConverter";
import { CreatinineClearance } from "@/components/calculator/CreatinineClearance";
import { FadeUp } from "@/components/calculator/FadeUp";

type CalculatorTab = "reconstitution" | "bmi" | "unit" | "creatinine";

const TABS: { id: CalculatorTab; label: string; icon: React.ReactNode }[] = [
  { id: "reconstitution", label: "Reconstitution", icon: <FlaskConical className="w-4 h-4" /> },
  { id: "bmi", label: "BMI & BMR", icon: <Scale className="w-4 h-4" /> },
  { id: "unit", label: "Unit Converter", icon: <ArrowRightLeft className="w-4 h-4" /> },
  { id: "creatinine", label: "Creatinine Clearance", icon: <FlaskConical className="w-4 h-4" /> },
];

export function CalculatorsHub() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("reconstitution");

  return (
    <div className="w-full flex flex-col items-center pt-20 lg:pt-32 pb-16 lg:pb-24 relative z-10 px-4 sm:px-6">
      <FadeUp className="w-full max-w-5xl mx-auto mb-10 lg:mb-16 flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white/90 backdrop-blur-3xl rounded-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative transition-all duration-700 hover:shadow-xl hover:border-black/10 z-20">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-inter relative flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 ${
                  isActive ? "text-white shadow-sm" : "text-gray-400 hover:text-gray-900 hover:bg-black/5 hover:scale-105"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gray-900 rounded-xl -z-10 shadow-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className={`relative z-10 shrink-0 flex items-center justify-center transition-all duration-500 ${isActive ? "scale-110 text-white" : ""}`}>
                  {tab.icon}
                </div>

                <span className={`relative z-10 hidden md:inline-block transition-transform duration-500 ${isActive ? "translate-x-1" : ""}`}>
                  {tab.label}
                </span>

                {isActive && <div className="md:hidden w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}

                <AnimatePresence>
                  {isActive && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-none">
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl whitespace-nowrap flex items-center justify-center relative"
                      >
                        {tab.label}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </FadeUp>

      <div className="w-full max-w-[1400px] mx-auto min-h-[600px] relative">
        <AnimatePresence mode="wait">
          {activeTab === "reconstitution" && (
            <motion.div key="reconstitution" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <PeptideReconstitution />
            </motion.div>
          )}
          {activeTab === "bmi" && (
            <motion.div key="bmi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <BmiBmrCalculator />
            </motion.div>
          )}
          {activeTab === "unit" && (
            <motion.div key="unit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <UnitConverter />
            </motion.div>
          )}
          {activeTab === "creatinine" && (
            <motion.div key="creatinine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <CreatinineClearance />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
