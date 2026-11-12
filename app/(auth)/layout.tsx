import React from "react";
import type { Metadata } from "next";

import { NOINDEX_METADATA } from "@/lib/indexability";

/**
 * Exists solely to carry `noindex, nofollow` for the authentication routes
 * (/login, /register, /forgot-password).
 *
 * All three pages are client components and so cannot export `metadata`
 * themselves. This renders its children unchanged and adds no markup or
 * nesting of its own.
 *
 * Unlike /account and /checkout these paths are not in the robots.txt Disallow
 * list, so without this they would be indexable on the canonical host once
 * indexing is enabled. Sign-in pages carry no search value and invite
 * credential-phishing lookalikes in results.
 */
export const metadata: Metadata = NOINDEX_METADATA;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
