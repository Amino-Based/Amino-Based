/**
 * What GA4 is allowed to know about a URL, and which hostname may report at all.
 *
 * Two separate problems, both solved here so there is one source of truth:
 *
 * 1. SENSITIVE QUERY PARAMETERS. GA4's page_view carries `page_location`, which
 *    is the full URL including the query string. `/order-confirmation/[id]?t=…`
 *    carries a signed JWT that grants access to a customer's order and stays
 *    valid for 7-30 days (see lib/orders/orderAccessToken.ts). Sending that to
 *    Google would put a live credential in analytics reports and any BigQuery
 *    export. It is stripped before GA4 ever sees the URL — not hidden in the
 *    dashboard afterwards.
 *
 * 2. HOSTNAME. Railway publishes this service on *.up.railway.app alongside the
 *    custom domain, and that hostname is publicly reachable. Without a check,
 *    preview and Railway traffic would report into the production property and
 *    corrupt its data.
 *
 * Nothing here reads, validates or alters a token. The URL in the address bar
 * is untouched, and order access continues to work exactly as before: this
 * module only decides what string is handed to GA4.
 */

/**
 * Query parameters never sent to GA4.
 *
 * `t` is the live case — the order-confirmation access token. The rest are
 * defence in depth: names that conventionally carry credentials or identifiers,
 * so a parameter added later is excluded by default rather than leaking until
 * someone notices. Compared case-insensitively.
 */
export const SENSITIVE_QUERY_PARAMS: readonly string[] = [
  // In active use by this app
  "t", // order-confirmation access JWT
  "token", // api/military/action
  // Defence in depth
  "access_token",
  "id_token",
  "refresh_token",
  "auth",
  "authorization",
  "code",
  "key",
  "api_key",
  "apikey",
  "secret",
  "password",
  "passwd",
  "pwd",
  "session",
  "sessionid",
  "sig",
  "signature",
  "email",
  "e_mail",
  "phone",
  "otp",
  "reset",
  "invite",
  "jwt",
  "bearer",
  // Stripe redirect parameters. components/checkout/StripeCheckoutForm.tsx sets a
  // return_url, and on a redirect-based method (3DS, bank redirect) Stripe appends
  // these to it. `*_client_secret` can be used from the browser to retrieve and
  // confirm the intent, so it is a live credential, not an identifier.
  "payment_intent_client_secret",
  "setup_intent_client_secret",
  "client_secret", // generic form, in case a flow uses it directly
  "payment_intent",
  "setup_intent",
  // Not a credential — it is only "succeeded"/"failed"/"pending". Stripped because
  // it is a redirect artefact that carries no analytics value and would otherwise
  // encode payment state into page URLs in reports.
  "redirect_status",
];

/**
 * Routes whose PATH carries a secret, and the redaction applied before GA4 sees it.
 *
 * Query-parameter stripping is not enough on its own: the password-reset link is
 * `/reset-password/<token>` (lib/email/templates/forgotPassword.ts), so the
 * credential is a path segment. A reset token grants account takeover, which makes
 * this the most sensitive URL on the site.
 *
 * Deliberately narrow. Product, blog, account and order-confirmation paths are NOT
 * redacted: their identifiers are slugs or sequential ids, not secrets, and
 * redacting them would destroy the per-page reporting GA4 exists to provide.
 */
export const REDACTED_SEGMENT = "[REDACTED]";

export const SENSITIVE_PATH_PATTERNS: readonly { pattern: RegExp; replacement: string }[] = [
  {
    // Canonical form: /reset-password/<token> with an optional trailing slash,
    // which is exactly what the email link produces. The token is matched as
    // "everything that is not a slash", so a percent-encoded value is covered
    // without needing to decode it first. The captured slash is preserved so the
    // reported URL still mirrors the one the visitor actually had.
    pattern: /^\/reset-password\/[^/]+(\/?)$/i,
    replacement: `/reset-password/${REDACTED_SEGMENT}$1`,
  },
  {
    // Any other shape under /reset-password/ that still carries content:
    // extra segments (/reset-password/<token>/extra), repeated slashes
    // (/reset-password//<token>), or both. The app's route is a single dynamic
    // segment, so these 404 — but a 404 still renders inside the root layout,
    // which loads analytics, so the token would otherwise reach GA4 in
    // page_location.
    //
    // The repeated-slash case is normalised away by a 308 before a page is ever
    // rendered, so in practice it cannot leak. It is matched here anyway: the
    // sanitiser should not depend on the server's URL normalisation for a
    // security property it can guarantee itself.
    //
    // `.*[^/].*` means "something other than slashes follows the route", so a
    // bare /reset-password/ or /reset-password// is left alone — there is no
    // token in either to hide. Everything after the route is dropped rather
    // than preserved: those segments belong to no real route and could
    // themselves carry data worth not forwarding.
    pattern: /^\/reset-password\/(?:.*[^/].*)$/i,
    replacement: `/reset-password/${REDACTED_SEGMENT}`,
  },
];

/** Applies the path redactions above. Returns the pathname unchanged when none match. */
export function sanitizeAnalyticsPath(pathname: string): string {
  for (const { pattern, replacement } of SENSITIVE_PATH_PATTERNS) {
    if (pattern.test(pathname)) return pathname.replace(pattern, replacement);
  }
  return pathname;
}

/**
 * Parameters deliberately KEPT, documented so they are not removed by mistake.
 *
 * `q` is the catalogue search term and is the point of search reporting.
 * The utm_ and gclid family is how GA4 attributes campaigns — stripping them
 * would silently break acquisition reports. None identifies a person.
 */
export const PRESERVED_QUERY_PARAMS: readonly string[] = [
  "q",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ref",
  "page",
  "sort",
  "category",
];

/** The one hostname permitted to send analytics. */
export const GA_CANONICAL_HOST = "aminobased.com";

/**
 * Normalises a hostname for comparison: case-folded, port removed, trailing dot
 * removed. Returns null for anything unusable, which can never match.
 */
export function normalizeAnalyticsHost(rawHost: string | null | undefined): string | null {
  if (typeof rawHost !== "string") return null;
  const trimmed = rawHost.trim();
  if (trimmed.length === 0) return null;
  // Guard IPv6 literals, where colons belong to the address.
  const withoutPort = trimmed.startsWith("[")
    ? trimmed.slice(0, trimmed.indexOf("]") + 1)
    : trimmed.split(":")[0];
  const normalized = withoutPort.trim().toLowerCase().replace(/\.$/, "");
  return normalized.length > 0 ? normalized : null;
}

/**
 * Whether analytics may run on this hostname. An allowlist of exactly one
 * value, so Railway, previews, localhost and anything else fail closed.
 *
 * `www` is not accepted: next.config.mjs 301s it to the apex, so a real visitor
 * is on the apex by the time any script runs.
 */
export function isCanonicalAnalyticsHost(rawHost: string | null | undefined): boolean {
  return normalizeAnalyticsHost(rawHost) === GA_CANONICAL_HOST;
}

/**
 * The URL GA4 is given, with sensitive parameters removed.
 *
 * Everything else is preserved exactly: protocol, host, port, path, parameter
 * order, repeated parameters and the hash. A URL that cannot be parsed returns
 * null so the caller omits `page_location` rather than forwarding a raw string
 * that may still contain a token.
 */
export function sanitizeAnalyticsUrl(rawUrl: string | null | undefined): string | null {
  if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) return null;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const deny = new Set(SENSITIVE_QUERY_PARAMS.map((p) => p.toLowerCase()));
  let removed = false;
  // Collect first: deleting while iterating URLSearchParams is unsafe.
  // `url.searchParams` has already percent-decoded the names, so an encoded
  // parameter such as `%74=` is compared here as plain `t`.
  for (const name of [...url.searchParams.keys()]) {
    if (deny.has(name.toLowerCase())) {
      url.searchParams.delete(name);
      removed = true;
    }
  }

  // Drop a now-empty "?" so the reported URL matches the clean case exactly.
  if (removed && [...url.searchParams.keys()].length === 0) {
    url.search = "";
  }

  // Path redaction runs after the query work so both halves of the URL are
  // covered by one call, and every caller — page_location and page_referrer
  // alike — gets the same protection without having to remember to ask.
  url.pathname = sanitizeAnalyticsPath(url.pathname);

  return url.toString();
}

/**
 * The `page_referrer` value GA4 should be given for a raw `document.referrer`.
 *
 * Returns `null` to mean "send no page_referrer key at all", and a string to mean
 * "send exactly this".
 *
 * The distinction is the whole point of this helper. gtag.js derives
 * `page_referrer` from `document.referrer` whenever the caller does not supply
 * one, so omitting the key is only safe when the referrer is genuinely empty —
 * then there is nothing for gtag to fall back to. For a referrer that is present
 * but unparseable, omitting the key would hand gtag the raw string, which is the
 * leak this is meant to close. Such a referrer is reported as an empty string
 * instead: an explicit value that overrides the default and discloses nothing.
 */
export function resolveAnalyticsReferrer(rawReferrer: string | null | undefined): string | null {
  if (typeof rawReferrer !== "string") return null;
  const trimmed = rawReferrer.trim();
  if (trimmed.length === 0) return null; // nothing to leak, nothing to override
  // Present but unusable -> "" rather than null, so gtag cannot substitute the raw value.
  return sanitizeAnalyticsUrl(trimmed) ?? "";
}

/** True when the URL carried at least one parameter that must not reach GA4. */
export function hasSensitiveQueryParams(rawUrl: string | null | undefined): boolean {
  if (typeof rawUrl !== "string") return false;
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }
  const deny = new Set(SENSITIVE_QUERY_PARAMS.map((p) => p.toLowerCase()));
  for (const name of url.searchParams.keys()) {
    if (deny.has(name.toLowerCase())) return true;
  }
  return false;
}
