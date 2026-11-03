import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/siteUrl";

// Indexing is opt-IN, and production is the only thing that opts in. Vercel sets VERCEL_ENV
// itself ("production" only for the production deployment), so the live .com keeps exactly the
// indexing behaviour it has today, while local dev and every preview/staging deployment are
// held back. SITE_INDEXABLE=true is the escape hatch for a non-Vercel production host —
// without it, a self-hosted launch would be silently noindexed.
const isIndexable =
  process.env.VERCEL_ENV === "production" || process.env.SITE_INDEXABLE === "true";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    // Staging / preview / local: refuse everything, and advertise no sitemap.
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
