"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, Lock } from "lucide-react";

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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center px-4 py-10 bg-[#020202]/95 backdrop-blur-xl"
        >
          {/* Ambient glow accents to match the site's dark/indigo language */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl p-8 md:p-10 text-center"
          >
            <AnimatePresence mode="wait">
              {!isDenied ? (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-indigo-400" />
                  </div>

                  <p className="text-xs font-bold tracking-[0.3em] uppercase text-indigo-400 mb-3">
                    Restricted Access
                  </p>
                  <h2 className="text-2xl md:text-4xl font-inter font-bold uppercase tracking-wider text-white mb-6 leading-tight">
                    Age <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Verification</span>
                  </h2>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                    This site contains information about research chemicals intended strictly for
                    licensed laboratory and research use. By entering, you confirm that you are at
                    least 21 years of age and that any products purchased will not be used for
                    human or animal consumption.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                    >
                      I Am 21 or Older
                    </button>
                    <button
                      onClick={handleDeny}
                      className="flex-1 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      I Am Under 21
                    </button>
                  </div>

                  <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-500">
                    By entering this site you agree to our{" "}
                    <a
                      href="/terms-and-conditions"
                      className="text-gray-400 hover:text-indigo-400 underline underline-offset-4 transition-colors"
                    >
                      Terms &amp; Conditions
                    </a>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="denied"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-red-400" />
                  </div>

                  <h2 className="text-2xl md:text-4xl font-inter font-bold uppercase tracking-wider text-red-400 mb-6 leading-tight">
                    Access Denied
                  </h2>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                    We&apos;re sorry, but you must be at least 21 years of age to access this
                    website. Please check back once you meet the age requirement.
                  </p>

                  <button
                    onClick={handleGoBack}
                    className="text-sm uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors border-b border-white/20 hover:border-white/60 pb-1"
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
