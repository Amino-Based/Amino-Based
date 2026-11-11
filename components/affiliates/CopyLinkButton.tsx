"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyLinkButton({
  value,
  link,
}: {
  value?: string;
  link?: string;
}) {
  const target = link || value || "";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#031B4E] hover:bg-[#071739] rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-cyan-300" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}
