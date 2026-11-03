"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { submitPayoutRequest, type PayoutFormState } from "@/app/affiliates/dashboard/payouts/actions";

const initialState: PayoutFormState = { success: false };

export default function PayoutRequestForm({ minimumThreshold }: { minimumThreshold: number }) {
  const [state, formAction, isPending] = useActionState(submitPayoutRequest, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Payout request submitted. Our team will process it shortly.</span>
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Amount (USD) &mdash; min ${minimumThreshold.toFixed(2)}
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min={minimumThreshold}
          required
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="payoutMethod" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Payout Method
        </label>
        <select
          id="payoutMethod"
          name="payoutMethod"
          required
          defaultValue=""
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
        >
          <option value="" disabled className="bg-[#0a0a0a]">Select a method</option>
          <option value="zelle" className="bg-[#0a0a0a]">Zelle</option>
          <option value="cashapp" className="bg-[#0a0a0a]">Cash App</option>
          <option value="applepay" className="bg-[#0a0a0a]">Apple Pay</option>
        </select>
      </div>

      <div>
        <label htmlFor="payoutDetails" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Payout Details
        </label>
        <input
          id="payoutDetails"
          name="payoutDetails"
          type="text"
          required
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
          placeholder="Phone number, CashTag, or Apple Pay ID"
        />
      </div>

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
          "Request Payout"
        )}
      </button>
    </form>
  );
}
