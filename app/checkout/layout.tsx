import React from "react";
import type { Metadata } from "next";

import { NOINDEX_METADATA } from "@/lib/indexability";

/**
 * Exists solely to carry `noindex, nofollow` for /checkout.
 *
 * `app/checkout/page.tsx` is a client component, and a client component cannot
 * export `metadata`, so the directive has to live in a server layout. This
 * renders its children unchanged and adds no markup or nesting of its own.
 *
 * Checkout is also Disallow'd in robots.txt, but that only asks a crawler not
 * to fetch the URL — it does not keep an externally linked one out of the index.
 */
export const metadata: Metadata = NOINDEX_METADATA;

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
