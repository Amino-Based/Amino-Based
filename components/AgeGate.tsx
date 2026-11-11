"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function AgeGate() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    const isVerified = document.cookie.includes("age_verified=true");
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  // Lock scroll and pause videos globally while the gate is visible.
  useEffect(() => {
    const videos = document.querySelectorAll("video");
    if (isVisible) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      videos.forEach((v) => v.pause());
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      videos.forEach((v) => v.play().catch(() => {}));
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleConfirm = () => {
    document.cookie = "age_verified=true; max-age=31536000; path=/";
    setIsVisible(false);
  };

  const handleDeny = () => {
    setIsDenied(true);
  };

  const handleGoBack = () => {
    setIsDenied(false);
  };

  if (!hasHydrated) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-[1024px] bg-[#FAF7F2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.6)] border border-neutral-200/60 my-auto"
          >
            <AnimatePresence mode="wait">
              {!isDenied ? (
                <div className="grid grid-cols-1 md:grid-cols-[60.5%_39.5%] min-h-[460px] sm:min-h-[480px]">
                  
                  {/* Left Column: Verification Content */}
                  <div className="p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between text-left">
                    <div>
                      {/* Eyebrow */}
                      <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#0096c8] mb-3">
                        Restricted Access
                      </p>

                      {/* Main Title: AGE VERIFICATION */}
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] leading-[0.95] mb-2.5 font-sans">
                        Age<br />Verification
                      </h2>

                      {/* Teal Accent Underline */}
                      <div className="w-9 h-[3px] bg-[#0096c8] mb-6 rounded-full" />

                      {/* Research Purposes Section */}
                      <h3 className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-[#0A0A0A] mb-2.5">
                        Research Purposes Only
                      </h3>

                      <p className="text-xs sm:text-[13px] text-[#4A4A4A] leading-relaxed mb-4">
                        The products on this website are strictly for in-vitro laboratory research. They are not for human consumption, supplements, or drugs.
                      </p>

                      <p className="text-xs sm:text-[13px] font-bold text-[#0A0A0A] leading-relaxed mb-7 sm:mb-8">
                        By clicking confirm, you confirm you are 21 or older and that you will use these products for laboratory research only.
                      </p>

                      {/* Buttons Row */}
                      <div className="flex items-center gap-3.5">
                        {/* Primary Confirm Button */}
                        <button
                          type="button"
                          onClick={handleConfirm}
                          className="group inline-flex items-center justify-between gap-4 pl-5 sm:pl-6 pr-2 py-2 rounded-full bg-[#121214] hover:bg-black active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          <span>I Am 21 or Older</span>
                          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 group-hover:translate-x-0.5 transition-all">
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </span>
                        </button>

                        {/* Secondary Under 21 Button */}
                        <button
                          type="button"
                          onClick={handleDeny}
                          className="px-4 sm:px-5 py-2.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 active:scale-98 text-[#0A0A0A] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all leading-tight text-center cursor-pointer shadow-2xs"
                        >
                          <div>Under</div>
                          <div>21</div>
                        </button>
                      </div>
                    </div>

                    {/* Footer Legal Terms Link */}
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-neutral-400 mt-6 sm:mt-8 pt-4 border-t border-neutral-200/60">
                      By entering, you agree to our{" "}
                      <Link
                        href="/terms-and-conditions"
                        className="text-neutral-600 hover:text-black underline underline-offset-2 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/terms-and-conditions"
                        className="text-neutral-600 hover:text-black underline underline-offset-2 transition-colors"
                      >
                        Research Use Policy
                      </Link>
                    </p>
                  </div>

                  {/* Right Column: Visual Artwork (Full Size as in reference design) */}
                  <div className="relative aspect-[405/480] md:aspect-auto min-h-[340px] sm:min-h-[400px] md:min-h-[480px] md:h-full bg-[#141C16] overflow-hidden flex flex-col justify-end">
                    <Image
                      src="/assets/agegate/agegate-master-4k.webp"
                      alt="Amino Based Precision Research Peptide — Purity Guaranteed"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover object-center"
                    />

                    {/* Exact Vector Typography matching reference — 100% 4K crisp, unclipped */}
                    <div className="relative z-10 p-6 sm:p-8 lg:p-9 select-none pointer-events-none flex flex-col items-start">
                      <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                        PURITY GUARANTEED
                      </p>
                      <p className="text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-tight text-white leading-none mt-2 sm:mt-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] font-sans">
                        ≥ 99% HPLC
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-[27px] font-normal tracking-tight text-white leading-tight mt-1 sm:mt-1.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] font-sans">
                        Verified
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                /* Denied State */
                <motion.div
                  key="denied"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 sm:p-14 text-center max-w-lg mx-auto"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                    <Lock className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0A0A0A] mb-3 font-sans">
                    Access Denied
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    You must be at least 21 years of age to access this website and purchase laboratory research peptides.
                  </p>

                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-all cursor-pointer shadow-xs"
                  >
                    Go Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
