import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export function CalculatorHero() {
  return (
    <div className="w-full bg-[#FAFAFA]">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto pt-28 sm:pt-32 md:pt-40 pb-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 rounded uppercase">
              Research Tool
            </div>
            <h1 className="font-inter text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 uppercase tracking-wider leading-[1.05] mb-3 sm:mb-4">
              Peptide Reconstitution Calculator
            </h1>
            <div className="font-inter text-xs md:text-sm text-gray-500 mb-3 sm:mb-4">
              By{" "}
              <Link href="/about-us" className="text-indigo-600 font-semibold hover:underline">
                Amino Based Research Team
              </Link>{" "}
              · Last updated September 2026
            </div>
            <p className="font-inter text-gray-500 text-sm md:text-base font-medium max-w-xl">
              Peptide reconstitution is the process of dissolving a lyophilized peptide powder in a measured volume of diluent to produce a solution of known strength. This peptide reconstitution calculator takes two numbers, the peptide mass in your vial and the diluent volume you add. It returns the working concentration in mg/mL and mcg/mL.
            </p>
          </motion.div>
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[400px] sm:h-[450px] md:h-[550px] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-4 sm:mb-6 shadow-2xl group cursor-pointer bg-black"
        >
          <Image
            src="/assets/calculator/amino-based-calculator-hero.png"
            alt="Amino Based Precision Peptide Reconstitution Reference & Concentration Calculator"
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover object-center group-hover:scale-101 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-28 z-20 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
              <span className="font-inter bg-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 sm:mb-3 inline-block shadow-sm">
                Scope
              </span>
              <p className="font-inter text-white text-xs sm:text-base md:text-lg font-medium tracking-wide mb-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                The scope here is deliberate: this tool does concentration math, nothing else. Vial mass in milligrams plus diluent volume in milliliters gives you mg/mL and mcg/mL. It produces no dose figures, no administration guidance and no protocol advice, by design.
              </p>
            </div>
          </div>

          <div className="absolute bottom-10 right-10 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/30 text-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-gray-900 hidden sm:flex">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-[1.5rem] p-6 sm:p-8 flex items-end justify-between hover:shadow-lg transition-all duration-300 cursor-default border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <div className="flex flex-col">
              <span className="font-inter text-2xl sm:text-3xl font-bold text-gray-900 tracking-tighter leading-tight">Any Vial Size</span>
              <span className="font-inter text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Works With Any Vial Size
              </span>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center mb-1 hover:bg-indigo-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-[1.5rem] p-6 sm:p-8 flex justify-between relative hover:shadow-lg transition-all duration-300 cursor-default border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <div className="flex flex-col justify-end h-full">
              <span className="font-inter text-2xl sm:text-3xl font-bold text-gray-900 tracking-tighter leading-tight">Full Working</span>
              <span className="font-inter text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Shows the full working behind every result, so you can check the arithmetic by hand before you record it.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gray-900 rounded-[1.5rem] p-6 sm:p-8 flex items-end relative hover:bg-black transition-all duration-300 cursor-default shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="flex flex-col">
              <span className="font-inter text-2xl sm:text-3xl font-bold text-white tracking-tighter leading-tight">Research Use Only</span>
              <span className="font-inter text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest mt-1">
                Laboratory Research Use Only
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
