"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex flex-col items-center justify-center text-center px-6 pt-36 pb-24">
      <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-4">Something went wrong</p>
      <h1 className="text-3xl md:text-5xl font-inter uppercase font-bold tracking-wider text-gray-900 mb-4">
        We hit a snag
      </h1>
      <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed mb-4">
        This page couldn't load. Please try again — if it keeps happening, contact{" "}
        <a href="mailto:support@aminobased.com" className="underline">
          support@aminobased.com
        </a>
        .
      </p>
      {error?.message && (
        <div className="max-w-xl w-full mx-auto my-4 p-4 bg-red-50 text-red-900 rounded-xl text-xs font-mono text-left overflow-x-auto border border-red-200 shadow-xs">
          <p className="font-bold text-red-800 mb-1">Error details:</p>
          <p className="break-all whitespace-pre-wrap">{error.message}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="h-12 px-8 rounded-full border border-black/15 hover:bg-gray-100 text-gray-900 text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center transition-colors"
        >
          Back to home
        </Link>
      </div>
      {error.digest && <p className="mt-8 text-[11px] text-gray-400">Reference: {error.digest}</p>}
    </div>
  );
}
