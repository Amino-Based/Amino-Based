import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { SITE_URL } from "@/lib/siteUrl";
import { isIndexableRequest, resolveRequestHost } from "@/lib/indexability";

/**
 * Indexing is opt-IN on two axes, both of which must pass:
 *
 *   1. `SITE_INDEXABLE=true` in the environment (see lib/indexability.ts).
 *   2. The request arrived on the canonical host.
 *
 * The host check exists because Railway publishes this service on
 * `*.up.railway.app` as well as the custom domain, and that hostname is
 * publicly reachable. Gating on the environment alone would have made it a
 * crawlable duplicate of the apex the moment indexing was enabled.
 *
 * Calling `headers()` is a Request-time API, so per the Next 16 docs this route
 * opts out of caching and is evaluated per request. That is required here, not
 * incidental: a cached robots.txt would be computed once and then served to
 * every hostname alike, which is exactly the bug this replaces.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers();
  const indexable = isIndexableRequest(resolveRequestHost(headerList));

  if (!indexable) {
    // Non-canonical host (including the Railway domain), staging, preview or
    // local: refuse everything and advertise no sitemap.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/pb-console", "/api/", "/account", "/checkout", "/order-confirmation"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
