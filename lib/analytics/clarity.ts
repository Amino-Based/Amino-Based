import { isCanonicalAnalyticsHost } from "@/lib/analytics/sanitizeUrl";

/**
 * Where Microsoft Clarity may run, and where its recording must be masked.
 *
 * Clarity is a session recorder, so its risk profile is different from GA4's.
 * GA4 transmits a URL, and sanitising that URL is sufficient. Clarity records
 * the rendered DOM, so sanitising a URL protects nothing: on
 * /order-confirmation/<id> it would capture the shipping address as displayed
 * text regardless of what the address bar says.
 *
 * The hostname rule is shared with GA4 rather than duplicated — see
 * isCanonicalAnalyticsHost in ./sanitizeUrl.
 *
 * IMPORTANT — what route exclusion can and cannot do.
 *
 * Declining to inject the script is reliable: no script, no recording. That
 * covers a visitor who lands directly on a sensitive page.
 *
 * Unmounting the script after Clarity has loaded is NOT reliable. clarity.js
 * installs global observers and keeps recording; removing the <script> element
 * or unmounting the React component that added it does not end the session. A
 * client-side navigation from /shop into /checkout therefore cannot be stopped
 * by rendering logic alone.
 *
 * The mechanism that does work across navigation is DOM masking: Clarity reads
 * `data-clarity-mask` when it serialises the DOM, so marking a subtree keeps
 * its text out of the recording continuously, including content rendered after
 * the attribute was applied. That is why the component applies the attribute to
 * <body> on an excluded route instead of pretending it can stop the recorder.
 */

/**
 * Route prefixes Clarity must never record, matched on path segments.
 *
 * Taken from the actual route tree, not assumed:
 *   /account, /account/addresses, /account/orders, /account/orders/[id],
 *   /account/settings, /account/wishlist   — name, email, addresses, orders
 *   /checkout                              — full billing and shipping entry
 *   /order-confirmation/[id]               — renders shippingAddress as text
 *   /login, /register, /forgot-password    — credential entry
 *   /reset-password/[token]                — credential entry, token in path
 *   /pb-console/[[...segments]]            — Payload admin, all customer data
 *   /affiliates/dashboard/*                — payouts, conversions, earnings
 *   /military-discount                     — full name, email, and a photo or
 *                                            PDF of a military/veteran ID. The
 *                                            chosen file's NAME is rendered as
 *                                            page text, which input masking
 *                                            would not have covered.
 *
 * /affiliates (the public landing page) is deliberately NOT excluded; only the
 * authenticated dashboard beneath it is. /contact-us and /blog likewise stay
 * recordable despite carrying form fields — their protection is Clarity's own
 * input masking, which is a dashboard setting outside this repository.
 */
export const CLARITY_EXCLUDED_ROUTE_PREFIXES: readonly string[] = [
  "/account",
  "/checkout",
  "/order-confirmation",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/pb-console",
  "/affiliates/dashboard",
  "/military-discount",
];

/** The attribute Clarity honours to keep a subtree's text out of recordings. */
export const CLARITY_MASK_ATTRIBUTE = "data-clarity-mask";

/**
 * Normalises a pathname for comparison: lower-cased, query and hash removed,
 * trailing slash dropped (except for the root). Returns null for anything
 * unusable, which can never match a prefix.
 */
export function normalizeClarityPath(rawPath: string | null | undefined): string | null {
  if (typeof rawPath !== "string") return null;
  let path = rawPath.trim();
  if (path.length === 0) return null;
  // A full URL may be passed in; keep only the path portion.
  const hash = path.indexOf("#");
  if (hash !== -1) path = path.slice(0, hash);
  const query = path.indexOf("?");
  if (query !== -1) path = path.slice(0, query);
  if (!path.startsWith("/")) return null;
  path = path.toLowerCase();
  // Collapse repeated slashes so //checkout cannot slip past the prefix test.
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path.length > 0 ? path : "/";
}

/**
 * Whether Clarity must not record this route.
 *
 * Matching is segment-aware: "/account" covers "/account" and
 * "/account/orders/12" but not "/accounts-payable", which merely shares a
 * string prefix.
 */
export function isClarityExcludedRoute(rawPath: string | null | undefined): boolean {
  const path = normalizeClarityPath(rawPath);
  if (path === null) return true; // unparseable -> treat as sensitive, fail closed
  return CLARITY_EXCLUDED_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/**
 * Whether Clarity may be INJECTED for this request.
 *
 * All three must hold: a project id is configured, the request is on the
 * canonical production host, and the entry route is not sensitive. Fails
 * closed on anything missing.
 */
export function shouldLoadClarity(opts: {
  projectId: string | null | undefined;
  host: string | null | undefined;
  pathname: string | null | undefined;
}): boolean {
  if (typeof opts.projectId !== "string" || opts.projectId.trim().length === 0) return false;
  if (!isCanonicalAnalyticsHost(opts.host)) return false;
  if (isClarityExcludedRoute(opts.pathname)) return false;
  return true;
}
