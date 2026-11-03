"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DynamicInput({
  value,
  onChange,
  minWidth = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  minWidth?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
          onChange(val);
        }
      }}
      className="font-inter bg-transparent border-b-2 border-black/10 hover:border-indigo-500/50 text-indigo-600 focus:outline-none focus:border-indigo-500 px-1 mx-1 text-center font-bold transition-colors inline-block"
      style={{ width: `${Math.max(minWidth, value.length || 1) + 0.5}ch` }}
    />
  );
}

export function DynamicSelect({
  value,
  options,
  onChange,
}: {
  value: string | number;
  options: { label: string; value: string | number }[];
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value == value)?.label;
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block mx-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="font-inter bg-transparent border-b-2 border-black/10 hover:border-indigo-500/50 text-indigo-600 focus:outline-none px-1 mx-1 font-bold transition-colors flex items-center gap-1 inline-flex"
      >
        {selectedLabel}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-black/5 overflow-hidden z-50 min-w-[140px]"
          >
            <div className="flex flex-col p-1">
              {options.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    onChange(String(opt.value));
                    setIsOpen(false);
                  }}
                  className={`font-inter w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    value == opt.value ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-black/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
