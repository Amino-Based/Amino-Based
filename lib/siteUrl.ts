// No fallback domain in production, on purpose. This value is baked into canonicals, og:url, JSON-LD @id, the
// XML sitemap, robots.txt and every transactional email link. A silent default would publish a
// different company's domain under this brand and hand that domain our ranking signals, while the
// build still succeeded — so fail loudly instead, the same way PAYLOAD_SECRET does.
// In development, fall back to http://localhost:3000 to prevent dev server boot crashes if env is delayed.
const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined);

if (!configuredSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL environment variable is required and must not be empty.");
}

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
export const SITE_URL = siteUrl;
