import React from "react";
import type { Metadata } from "next";

import { NOINDEX_METADATA } from "@/lib/indexability";

/**
 * Carries `noindex, nofollow` for the authentication routes (/login,
 * /register, /forgot-password), and the server-rendered Clarity mask.
 *
 * All three pages are client components and so cannot export `metadata`
 * themselves.
 *
 * Unlike /account and /checkout these paths are not in the robots.txt Disallow
 * list, so without this they would be indexable on the canonical host once
 * indexing is enabled. Sign-in pages carry no search value and invite
 * credential-phishing lookalikes in results.
 *
 * `data-clarity-mask` is in the INITIAL HTML so credential fields are never
 * outside a masked subtree, rather than relying on an effect that runs after
 * the form has already been inserted. `/reset-password/[token]` nests beneath
 * this layout and inherits it.
 *
 * `display: contents` (Tailwind `contents`) keeps this wrapper out of layout:
 * its children lay out exactly as they did when this was a bare fragment.
 */
export const metadata: Metadata = NOINDEX_METADATA;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="contents" data-clarity-mask="true">
      {children}
    </div>
  );
}
