"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { updateAffiliateSettings, type SettingsFormState } from "@/app/affiliates/dashboard/settings/actions";
import type { Affiliate } from "@/lib/types/affiliate";

const initialState: SettingsFormState = { success: false };

const socialPlatforms = [
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "Twitter / X" },
  { key: "reddit", label: "Reddit" },
] as const;

export default function SettingsForm({ affiliate }: { affiliate: Affiliate }) {
  const [state, formAction, isPending] = useActionState(updateAffiliateSettings, initialState);

  const socialByPlatform = new Map((affiliate.socialLinks ?? []).map((link) => [link.platform, link.url ?? ""]));
  const primaryMethod = affiliate.payoutMethods?.find((m) => m.isPrimary) ?? affiliate.payoutMethods?.[0];

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{state.error}</span>
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Display Name / Brand
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={affiliate.displayName ?? ""}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Primary Website / Blog URL
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          defaultValue={affiliate.websiteUrl ?? ""}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#071739] mb-2.5">Social Media Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {socialPlatforms.map((platform) => (
            <div key={platform.key}>
              <label htmlFor={`social_${platform.key}`} className="block text-[11px] font-medium text-slate-500 mb-1">
                {platform.label}
              </label>
              <input
                id={`social_${platform.key}`}
                name={`social_${platform.key}`}
                type="url"
                defaultValue={socialByPlatform.get(platform.key) ?? ""}
                placeholder="https://"
                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="payoutCurrency" className="block text-xs font-semibold uppercase tracking-wider text-[#071739] mb-1.5">
          Settlement Currency
        </label>
        <select
          id="payoutCurrency"
          name="payoutCurrency"
          defaultValue={affiliate.payoutCurrency ?? "USD"}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
        >
          {["USD", "BTC", "ETH", "USDT_ERC20", "USDT_TRC20", "STORE_CREDIT"].map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3.5 pt-2 border-t border-[#F1F5F9]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#071739]">Primary Disbursement Route</h3>
        <select
          id="payoutMethodType"
          name="payoutMethodType"
          defaultValue={primaryMethod?.type ?? ""}
          className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#071739] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
        >
          <option value="">Not selected</option>
          <option value="paypal">PayPal</option>
          <option value="wise">Wise</option>
          <option value="bank_wire">ACH / Bank Wire</option>
          <option value="crypto_btc">Crypto &mdash; BTC</option>
          <option value="crypto_eth">Crypto &mdash; ETH</option>
          <option value="crypto_usdt_erc20">Crypto &mdash; USDT (ERC20)</option>
          <option value="crypto_usdt_trc20">Crypto &mdash; USDT (TRC20)</option>
          <option value="store_credit">Store Credit</option>
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="paypalEmail" className="block text-[11px] font-medium text-slate-500 mb-1">
              PayPal Email (if applicable)
            </label>
            <input
              id="paypalEmail"
              name="paypalEmail"
              type="email"
              defaultValue={primaryMethod?.paypalEmail ?? ""}
              className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
            />
          </div>
          <div>
            <label htmlFor="walletAddress" className="block text-[11px] font-medium text-slate-500 mb-1">
              Wallet Address (if cryptocurrency)
            </label>
            <input
              id="walletAddress"
              name="walletAddress"
              type="text"
              defaultValue={primaryMethod?.walletAddress ?? ""}
              className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#071739] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#031B4E] hover:bg-[#071739] disabled:opacity-60 disabled:cursor-not-allowed rounded-full shadow-xs transition-all cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving Preferences...</span>
          </>
        ) : (
          <>
            <span>Save Preferences</span>
            <Save className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
