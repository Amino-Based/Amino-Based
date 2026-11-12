import { siteUrl } from "@/lib/siteUrl";

/**
 * Single source of truth for "may this be indexed?".
 *
 * There are two independent dimensions, and conflating them is what left the
 * live site serving `Disallow: /`:
 *
 *   1. ENVIRONMENT — is this deployment allowed to be indexed at all?
 *      Controlled by `SITE_INDEXABLE`, and it fails CLOSED: anything other than
 *      the exact string "true" means no. Previously this also accepted
 *      `VERCEL_ENV === "production"`, which is never set on Railway, so the
 *      production host silently fell through to the staging branch.
 *
 *   2. HOST — did this particular request arrive on the canonical domain?
 *      Railway publishes every service on `*.up.railway.app` in addition to any
 *      custom domain, and that hostname is publicly reachable. Without a host
 *      check, enabling indexing would expose it as a duplicate of the apex.
 *
 * `robots.txt` and `sitemap.xml` are per-request and check BOTH dimensions.
 * Page metadata checks only the environment — see SITE_INDEXING_ENABLED.
 */

/**
 * Environment master switch. Fails closed.
 *
 * Read at module scope, so for prerendered output it is fixed at BUILD time.
 * On Railway the variable must therefore be present for the build, not merely
 * for the running container: changing it requires a redeploy, not a restart.
 */
export const SITE_INDEXING_ENABLED = process.env.SITE_INDEXABLE === "true";

/**
 * Normalises a Host header for comparison: case-folded, port removed, trailing
 * dot removed (`aminobased.com.` is a legal, equivalent FQDN).
 *
 * Returns null for anything missing or syntactically unusable, so callers get a
 * value that can never accidentally equal the canonical host.
 */
export function normalizeHost(rawHost: string | null | undefined): string | null {
  if (typeof rawHost !== "string") return null;
  // A forwarded header may carry a comma-separated list; the first entry is the
  // originating host.
  const first = rawHost.split(",")[0]?.trim();
  if (!first) return null;
  // Strip the port. Guard IPv6 literals, where colons are part of the address.
  const withoutPort = first.startsWith("[")
    ? first.slice(0, first.indexOf("]") + 1)
    : first.split(":")[0];
  const normalized = withoutPort.trim().toLowerCase().replace(/\.$/, "");
  return normalized.length > 0 ? normalized : null;
}

/** The one hostname that may be indexed, derived from NEXT_PUBLIC_SITE_URL. */
export const CANONICAL_HOST: string | null = (() => {
  try {
    return normalizeHost(new URL(siteUrl).host);
  } catch {
    return null;
  }
})();

/**
 * Whether a request's host is the canonical one.
 *
 * Exact match only, and `www` is deliberately NOT accepted: it is redirected to
 * the apex with a 301 in next.config.mjs, so a crawler follows to the apex
 * before robots.txt is ever produced for it. Should that redirect fail, `www`
 * falls to the blocked branch, which is the safe direction.
 *
 * A spoofed Host header can only change the response the spoofer receives. It
 * cannot alter what the real domain serves, and because the check is an
 * allowlist of exactly one value it can never widen indexing.
 */
export function isCanonicalHost(rawHost: string | null | undefined): boolean {
  if (CANONICAL_HOST === null) return false;
  const host = normalizeHost(rawHost);
  return host !== null && host === CANONICAL_HOST;
}

/**
 * The full gate for per-request routes: the environment must permit indexing
 * AND the request must have arrived on the canonical host.
 */
export function isIndexableRequest(rawHost: string | null | undefined): boolean {
  return SITE_INDEXING_ENABLED && isCanonicalHost(rawHost);
}

/**
 * Picks the authoritative host for a request.
 *
 * Behind Railway's edge, `x-forwarded-host` carries the hostname the client
 * actually asked for, so it is preferred when present; `host` is the direct
 * value otherwise. Only ever compared against a one-item allowlist, so an
 * untrusted value cannot grant indexing to anything.
 */
export function resolveRequestHost(headerList: {
  get(name: string): string | null;
}): string | null {
  return headerList.get("x-forwarded-host") ?? headerList.get("host");
}

/**
 * Metadata for routes that must never be indexed regardless of environment:
 * account, checkout and order confirmation. These are private or
 * single-use pages, and a robots.txt Disallow only asks a crawler not to fetch
 * — it does not keep an externally linked URL out of the index.
 */
export const NOINDEX_METADATA = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
} as const;
