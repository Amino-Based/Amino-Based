import React from "react";
import type { Metadata } from "next";

import { NOINDEX_METADATA } from "@/lib/indexability";

/**
 * Carries `noindex, nofollow` for /checkout, and the server-rendered Clarity
 * mask.
 *
 * `app/checkout/page.tsx` is a client component, and a client component cannot
 * export `metadata`, so the directive has to live in a server layout.
 *
 * Checkout is also Disallow'd in robots.txt, but that only asks a crawler not
 * to fetch the URL — it does not keep an externally linked one out of the index.
 *
 * `data-clarity-mask` is in the INITIAL HTML rather than applied by an effect.
 * ClarityAnalytics also sets it on <body> on navigation, but that happens one
 * mutation record after the page's content has entered the DOM — and on a
 * signed-in checkout the very first render already contains the customer's
 * email and name, prefilled from the session. Having the attribute arrive with
 * the markup removes that ordering question entirely.
 *
 * `display: contents` (Tailwind `contents`) keeps this wrapper out of layout:
 * its children lay out exactly as they did when this was a bare fragment.
 */
export const metadata: Metadata = NOINDEX_METADATA;

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="contents" data-clarity-mask="true">
      {children}
    </div>
  );
}
