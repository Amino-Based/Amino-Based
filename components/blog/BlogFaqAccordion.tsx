"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogFaq } from "@/lib/types/blog";

export default function BlogFaqAccordion({ faqs }: { faqs: BlogFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3.5">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id ?? index}
            className={`rounded-2xl transition-all duration-300 border ${
              isOpen
                ? "bg-white border-purple-200/90 shadow-sm"
                : "bg-[#F6F7FB] border-[#E4E4E7]/70 hover:bg-white hover:border-purple-200/50"
            }`}
          >
            <button
              type="button"
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`blog-faq-answer-${index}`}
            >
              <span className="text-sm sm:text-base font-medium text-[#0F0F11] leading-snug">
                {faq.question}
              </span>
              <span className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7]/80 shadow-2xs flex items-center justify-center shrink-0 text-[#894EF2] transition-colors">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 stroke-[2.4]" />
                ) : (
                  <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                )}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`blog-faq-answer-${index}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-gray-100/80">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
