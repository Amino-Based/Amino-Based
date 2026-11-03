"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { submitAffiliateApplication, type ApplyFormState } from "@/app/affiliates/actions";

const initialState: ApplyFormState = { success: false };

export default function ApplyForm() {
  const [state, formAction, isPending] = useActionState(submitAffiliateApplication, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        <h3 className="text-xl font-inter uppercase tracking-wider text-white">Application Submitted</h3>
        <p className="text-gray-400 max-w-md">
          Thank you for applying. Our team will review your application and follow up by email once a decision has been made.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Display Name *
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
          placeholder="How should we refer to you or your brand?"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Website / Social Profile URL
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
          placeholder="https://"
        />
      </div>

      <div>
        <label htmlFor="estimatedMonthlyReach" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Estimated Monthly Reach
        </label>
        <select
          id="estimatedMonthlyReach"
          name="estimatedMonthlyReach"
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
          defaultValue=""
        >
          <option value="" disabled className="bg-[#0a0a0a]">Select a range</option>
          <option value="<1k" className="bg-[#0a0a0a]">Under 1,000</option>
          <option value="1k-10k" className="bg-[#0a0a0a]">1,000 &ndash; 10,000</option>
          <option value="10k-100k" className="bg-[#0a0a0a]">10,000 &ndash; 100,000</option>
          <option value="100k+" className="bg-[#0a0a0a]">100,000+</option>
        </select>
      </div>

      <div>
        <label htmlFor="promotionMethods" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          How will you promote us? *
        </label>
        <textarea
          id="promotionMethods"
          name="promotionMethods"
          required
          rows={3}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-none"
          placeholder="e.g. YouTube reviews, research newsletter, Instagram content..."
        />
      </div>

      <div>
        <label htmlFor="niche" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Your Niche / Audience
        </label>
        <textarea
          id="niche"
          name="niche"
          rows={2}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-none"
          placeholder="Who is your audience?"
        />
      </div>

      <div>
        <label htmlFor="whyJoin" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Why do you want to join?
        </label>
        <textarea
          id="whyJoin"
          name="whyJoin"
          rows={2}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-none"
          placeholder="Tell us a bit about your motivation."
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
        <input
          type="checkbox"
          name="agreedToTerms"
          required
          className="mt-1 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-indigo-500 focus:ring-indigo-500/50"
        />
        <span>
          I agree to the affiliate program terms and confirm the information provided is accurate. *
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-2 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
