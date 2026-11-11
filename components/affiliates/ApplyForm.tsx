"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitAffiliateApplication, type ApplyFormState } from "@/app/affiliates/actions";

const initialState: ApplyFormState = { success: false };

export default function ApplyForm() {
  const [state, formAction, isPending] = useActionState(submitAffiliateApplication, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif text-[#071739] font-normal">
          Application Submitted Successfully
        </h3>
        <p className="text-sm text-slate-600 max-w-md leading-relaxed">
          Thank you for applying to the Amino Based Partner Network. Our scientific partnership team will review your application against our content standards and follow up by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Display Name / Brand *
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
          placeholder="e.g. Dr. Jane Smith or PeptideReviewHub"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Primary Website / Channel URL
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
          placeholder="https://"
        />
      </div>

      <div>
        <label htmlFor="estimatedMonthlyReach" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Estimated Monthly Audience
        </label>
        <select
          id="estimatedMonthlyReach"
          name="estimatedMonthlyReach"
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
          defaultValue=""
        >
          <option value="" disabled>Select approximate range</option>
          <option value="<1k">Under 1,000</option>
          <option value="1k-10k">1,000 – 10,000</option>
          <option value="10k-100k">10,000 – 100,000</option>
          <option value="100k+">100,000+</option>
        </select>
      </div>

      <div>
        <label htmlFor="promotionMethods" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Primary Promotion Channels *
        </label>
        <textarea
          id="promotionMethods"
          name="promotionMethods"
          required
          rows={2}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all resize-none"
          placeholder="e.g. Science newsletter, laboratory blog, biochemical podcast..."
        />
      </div>

      <div>
        <label htmlFor="niche" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Audience Focus &amp; Scientific Niche
        </label>
        <textarea
          id="niche"
          name="niche"
          rows={2}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all resize-none"
          placeholder="e.g. Cellular longevity, biochemical assays, academic research..."
        />
      </div>

      <div>
        <label htmlFor="whyJoin" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Why Partner With Amino Based?
        </label>
        <textarea
          id="whyJoin"
          name="whyJoin"
          rows={2}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all resize-none"
          placeholder="Share your goals and why you recommend verified peptide synthesis."
        />
      </div>

      <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
        <input
          type="checkbox"
          name="agreedToTerms"
          required
          className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#031B4E] focus:ring-[#031B4E]"
        />
        <span>
          I confirm that all promotional content will adhere to Research Use Only (RUO) compliance standards and FTC disclosure guidelines. *
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#031B4E] hover:bg-[#071739] disabled:opacity-60 disabled:cursor-not-allowed rounded-full shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Application...</span>
          </>
        ) : (
          <>
            <span>Submit Partner Application</span>
            <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
