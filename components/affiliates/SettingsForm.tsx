"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings updated.</span>
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={affiliate.displayName ?? ""}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Website URL
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          defaultValue={affiliate.websiteUrl ?? ""}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
        />
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Social Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.key}>
              <label htmlFor={`social_${platform.key}`} className="block text-xs text-gray-500 mb-1.5">
                {platform.label}
              </label>
              <input
                id={`social_${platform.key}`}
                name={`social_${platform.key}`}
                type="url"
                defaultValue={socialByPlatform.get(platform.key) ?? ""}
                placeholder="https://"
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="payoutCurrency" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Payout Currency
        </label>
        <select
          id="payoutCurrency"
          name="payoutCurrency"
          defaultValue={affiliate.payoutCurrency ?? "USD"}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
        >
          {["USD", "BTC", "ETH", "USDT_ERC20", "USDT_TRC20", "STORE_CREDIT"].map((currency) => (
            <option key={currency} value={currency} className="bg-[#0a0a0a]">
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Primary Payout Method</h3>
        <select
          id="payoutMethodType"
          name="payoutMethodType"
          defaultValue={primaryMethod?.type ?? ""}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
        >
          <option value="" className="bg-[#0a0a0a]">Not set</option>
          <option value="paypal" className="bg-[#0a0a0a]">PayPal</option>
          <option value="wise" className="bg-[#0a0a0a]">Wise</option>
          <option value="bank_wire" className="bg-[#0a0a0a]">Bank Wire</option>
          <option value="crypto_btc" className="bg-[#0a0a0a]">Crypto &mdash; BTC</option>
          <option value="crypto_eth" className="bg-[#0a0a0a]">Crypto &mdash; ETH</option>
          <option value="crypto_usdt_erc20" className="bg-[#0a0a0a]">Crypto &mdash; USDT (ERC20)</option>
          <option value="crypto_usdt_trc20" className="bg-[#0a0a0a]">Crypto &mdash; USDT (TRC20)</option>
          <option value="store_credit" className="bg-[#0a0a0a]">Store Credit</option>
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paypalEmail" className="block text-xs text-gray-500 mb-1.5">
              PayPal Email (if applicable)
            </label>
            <input
              id="paypalEmail"
              name="paypalEmail"
              type="email"
              defaultValue={primaryMethod?.paypalEmail ?? ""}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="walletAddress" className="block text-xs text-gray-500 mb-1.5">
              Wallet Address (if crypto)
            </label>
            <input
              id="walletAddress"
              name="walletAddress"
              type="text"
              defaultValue={primaryMethod?.walletAddress ?? ""}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-2 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving
          </>
        ) : (
          "Save Settings"
        )}
      </button>
    </form>
  );
}
