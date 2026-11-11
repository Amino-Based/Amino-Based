"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { submitPayoutRequest, type PayoutFormState } from "@/app/affiliates/dashboard/payouts/actions";

const initialState: PayoutFormState = { success: false };

export default function PayoutRequestForm({ minimumThreshold }: { minimumThreshold: number }) {
  const [state, formAction, isPending] = useActionState(submitPayoutRequest, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Payout request submitted. Our accounts department will process it within the next disbursement window.</span>
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Withdrawal Amount (USD) &mdash; Minimum ${minimumThreshold.toFixed(2)}
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min={minimumThreshold}
          required
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="payoutMethod" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Disbursement Method
        </label>
        <select
          id="payoutMethod"
          name="payoutMethod"
          required
          defaultValue="paypal"
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
        >
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">ACH Direct Deposit / Bank Transfer</option>
          <option value="crypto">Cryptocurrency (USDC / USDT)</option>
        </select>
      </div>

      <div>
        <label htmlFor="payoutDetails" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Account / Wallet Coordinates
        </label>
        <input
          id="payoutDetails"
          name="payoutDetails"
          type="text"
          required
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
          placeholder="PayPal email, bank account / routing, or wallet address"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Accounting Reference Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all resize-none"
          placeholder="e.g. November 2026 partner cycle settlement"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#031B4E] hover:bg-[#071739] disabled:opacity-60 disabled:cursor-not-allowed rounded-full shadow-xs transition-all cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Request...</span>
          </>
        ) : (
          <>
            <span>Submit Withdrawal Request</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
