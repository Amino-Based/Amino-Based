"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { FadeUp } from "@/components/calculator/FadeUp";
import { DynamicInput, DynamicSelect } from "@/components/calculator/DynamicFields";

type System = "imperial" | "metric";
type Gender = "male" | "female";

export function CreatinineClearance() {
  const [system, setSystem] = useState<System>("imperial");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("50");
  const [lbs, setLbs] = useState("170");
  const [kg, setKg] = useState("77");
  const [creatinine, setCreatinine] = useState("1.2");

  const handleSystemChange = (newSystem: System) => {
    if (newSystem === system) return;

    if (newSystem === "metric") {
      const wKg = (parseFloat(lbs) || 0) / 2.20462;
      setKg(wKg.toFixed(1));
    } else {
      const wKg = parseFloat(kg) || 0;
      const wLbs = wKg * 2.20462;
      setLbs(Math.round(wLbs).toString());
    }

    setSystem(newSystem);
  };

  let weightKg = 0;
  if (system === "imperial") {
    weightKg = (parseFloat(lbs) || 0) / 2.20462;
  } else {
    weightKg = parseFloat(kg) || 0;
  }

  const parsedAge = parseInt(age) || 0;
  const parsedCreatinine = parseFloat(creatinine) || 0;

  let crcl = 0;
  let category = "—";
  let categoryColor = "text-gray-400";

  if (parsedAge > 0 && weightKg > 0 && parsedCreatinine > 0) {
    crcl = ((140 - parsedAge) * weightKg) / (72 * parsedCreatinine);
    if (gender === "female") crcl *= 0.85;

    if (crcl > 90) {
      category = "Normal or High";
      categoryColor = "text-green-500";
    } else if (crcl >= 60) {
      category = "Mildly Decreased";
      categoryColor = "text-yellow-500";
    } else if (crcl >= 45) {
      category = "Mild to Moderate Decrease";
      categoryColor = "text-orange-400";
    } else if (crcl >= 30) {
      category = "Moderate to Severe Decrease";
      categoryColor = "text-orange-500";
    } else if (crcl >= 15) {
      category = "Severely Decreased";
      categoryColor = "text-red-400";
    } else {
      category = "Kidney Failure";
      categoryColor = "text-red-600";
    }
  }

  const isValid = crcl > 0;
  const maxCrCl = 150;
  const pointerPercentage = isValid ? Math.max(0, Math.min(100, (crcl / maxCrCl) * 100)) : 0;

  return (
    <section className="w-full rounded-3xl bg-white p-4 sm:p-6 md:p-12 lg:p-16 border border-black/5 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-20">
      {/* Left: Conversational Form */}
      <div className="flex-1 flex flex-col justify-center">
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Creatinine Clearance Configurator
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-[#FAFAFA] p-1 rounded-xl border border-black/5">
                {(["imperial", "metric"] as System[]).map((sys) => (
                  <button
                    type="button"
                    key={sys}
                    onClick={() => handleSystemChange(sys)}
                    className={`font-inter px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      system === sys ? "bg-white shadow-sm text-gray-900 border border-black/10" : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAge("50");
                  setLbs("170");
                  setKg("77");
                  setCreatinine("1.2");
                }}
                className="w-8 h-8 rounded-full border border-black/10 hover:bg-black/5 flex items-center justify-center text-gray-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="font-inter text-2xl sm:text-3xl md:text-[2.5rem] font-light text-gray-900 tracking-tight leading-[1.7]">
            I am a <DynamicInput value={age} onChange={setAge} /> year old
            <DynamicSelect
              value={gender}
              onChange={(v) => setGender(v as Gender)}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
            />{" "}
            weighing
            {system === "imperial" ? (
              <>
                {" "}
                <DynamicInput value={lbs} onChange={setLbs} minWidth={3} /> lbs.{" "}
              </>
            ) : (
              <>
                {" "}
                <DynamicInput value={kg} onChange={setKg} minWidth={3} /> kg.{" "}
              </>
            )}
            My serum creatinine level is <DynamicInput value={creatinine} onChange={setCreatinine} minWidth={3} /> mg/dL.
          </div>
        </FadeUp>
      </div>

      {/* Right: Result */}
      <div className="w-full lg:w-[450px] shrink-0">
        <FadeUp delay={0.2} className="h-full">
          <div className="bg-[#FAFAFA] rounded-2xl border border-black/5 p-8 md:p-10 flex flex-col items-center justify-center text-center h-full shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] min-h-[400px] relative">
            <h3 className="font-inter absolute top-8 font-bold uppercase tracking-[0.2em] text-gray-400 text-xs">
              Estimated CrCl
            </h3>

            <div className="relative w-full flex flex-col items-center mt-6">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={isValid ? crcl.toFixed(1) : "empty"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-inter text-5xl md:text-6xl text-indigo-600 tracking-tighter leading-none mb-2"
                >
                  {isValid ? crcl.toFixed(1) : "—"}
                </motion.div>
              </AnimatePresence>
              <div className="font-inter text-sm font-bold uppercase tracking-widest text-gray-400 mb-10">mL/min</div>
            </div>

            <div className="w-full max-w-[280px] mt-4 mb-10">
              <div className="w-full relative h-2 rounded-full flex overflow-visible">
                <div className="h-full w-[10%] bg-red-600 rounded-l-full" />
                <div className="h-full w-[10%] bg-red-400" />
                <div className="h-full w-[10%] bg-orange-500" />
                <div className="h-full w-[10%] bg-orange-400" />
                <div className="h-full w-[20%] bg-yellow-500" />
                <div className="h-full w-[40%] bg-green-500 rounded-r-full" />

                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-black rounded-full shadow-md z-10"
                  style={{ left: `calc(${pointerPercentage}% - 8px)` }}
                  initial={{ left: 0, opacity: 0 }}
                  animate={{ left: `calc(${pointerPercentage}% - 8px)`, opacity: isValid ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
              </div>
              <div className="font-inter w-full flex justify-between mt-2 text-[8px] font-bold text-gray-300 uppercase">
                <span>0</span>
                <span>150+</span>
              </div>
            </div>

            <div className="w-full text-center mt-auto border-t border-black/5 pt-6">
              <div className="font-inter text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">
                Kidney Function Category
              </div>
              <div className={`font-inter text-lg font-bold ${isValid ? categoryColor : "text-gray-300"}`}>{category}</div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
