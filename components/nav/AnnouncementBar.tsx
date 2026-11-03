"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "Free shipping on orders over $300",
  "New research peptides added weekly",
  "Certificate of Analysis available for every batch",
  "For research use only — not for human consumption",
];

export default function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-9 flex items-center justify-center bg-[#0a0a0a] border-b border-white/5 text-center text-xs md:text-sm text-gray-300 px-10">
      <span key={index}>{MESSAGES[index]}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
