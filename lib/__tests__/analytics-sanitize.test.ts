/**
 * What GA4 is allowed to receive.
 *
 * Two properties are load-bearing:
 *
 *   1. The order-confirmation access token (`?t=`) must never reach GA4. It is
 *      a signed JWT valid for 7-30 days that grants access to a customer's
 *      order, and GA4's page_view carries the full URL in `page_location`.
 *   2. Only the canonical production hostname may report, so the publicly
 *      reachable Railway domain and preview deployments cannot corrupt the
 *      production property.
 *
 * Both fail closed. Pure unit tests: no network, no GA4, no request.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  sanitizeAnalyticsUrl,
  hasSensitiveQueryParams,
  isCanonicalAnalyticsHost,
  normalizeAnalyticsHost,
  SENSITIVE_QUERY_PARAMS,
  PRESERVED_QUERY_PARAMS,
  GA_CANONICAL_HOST,
  sanitizeAnalyticsPath,
  resolveAnalyticsReferrer,
  REDACTED_SEGMENT,
} from "../analytics/sanitizeUrl";

const ORDER_URL = "https://aminobased.com/order-confirmation/1234";
/** Shape of a real order access token: a signed HS256 JWT. */
const JWT = "eyJhbGciOiJIUzI1NiJ9.eyJvcmRlcklkIjoiMTIzNCJ9.c2lnbmF0dXJlX2hlcmU";

// ---------------------------------------------------------------------------
// The live case: ?t= must never be transmitted
// ---------------------------------------------------------------------------

test("the order access token is removed from the analytics URL", () => {
  const sanitized = sanitizeAnalyticsUrl(`${ORDER_URL}?t=${JWT}`);
  assert.equal(sanitized, ORDER_URL);
  assert.ok(!sanitized!.includes(JWT), "no fragment of the token may survive");
  assert.ok(!sanitized!.includes("t="), "the parameter itself must be gone");
});

test("removing the only parameter leaves no dangling question mark", () => {
  assert.equal(sanitizeAnalyticsUrl(`${ORDER_URL}?t=${JWT}`), ORDER_URL);
  assert.ok(!sanitizeAnalyticsUrl(`${ORDER_URL}?t=${JWT}`)!.endsWith("?"));
});

test("the token is removed whatever the parameter case", () => {
  for (const name of ["t", "T"]) {
    const out = sanitizeAnalyticsUrl(`${ORDER_URL}?${name}=${JWT}`);
    assert.ok(!out!.includes(JWT), `?${name}= must be stripped`);
  }
});

test("the path and order id are preserved, so reporting still identifies the page", () => {
  const out = sanitizeAnalyticsUrl(`${ORDER_URL}?t=${JWT}`);
  assert.ok(out!.includes("/order-confirmation/1234"));
  assert.ok(out!.startsWith("https://aminobased.com/"));
});

test("a repeated sensitive parameter is fully removed", () => {
  const out = sanitizeAnalyticsUrl(`${ORDER_URL}?t=${JWT}&t=second`);
  assert.equal(out, ORDER_URL);
  assert.ok(!out!.includes("second"));
});

// ---------------------------------------------------------------------------
// Non-sensitive parameters are preserved
// ---------------------------------------------------------------------------

test("the catalogue search term survives — search reporting depends on it", () => {
  assert.equal(
    sanitizeAnalyticsUrl("https://aminobased.com/shop?q=semaglutide"),
    "https://aminobased.com/shop?q=semaglutide",
  );
});

test("campaign attribution parameters survive", () => {
  const url =
    "https://aminobased.com/?utm_source=newsletter&utm_medium=email&utm_campaign=launch&gclid=abc123";
  assert.equal(sanitizeAnalyticsUrl(url), url);
});

test("every documented preserved parameter is kept", () => {
  for (const name of PRESERVED_QUERY_PARAMS) {
    const url = `https://aminobased.com/shop?${name}=value`;
    assert.equal(sanitizeAnalyticsUrl(url), url, `${name} must be preserved`);
  }
});

test("a URL with nothing sensitive is returned unchanged", () => {
  for (const url of [
    "https://aminobased.com/",
    "https://aminobased.com/shop",
    "https://aminobased.com/product/glp-1trz",
    "https://aminobased.com/shop?page=2&sort=price",
  ]) {
    assert.equal(sanitizeAnalyticsUrl(url), url);
  }
});

test("only the sensitive parameter is dropped from a mixed query", () => {
  const out = sanitizeAnalyticsUrl(
    `https://aminobased.com/order-confirmation/9?utm_source=email&t=${JWT}&q=kept`,
  );
  assert.ok(!out!.includes(JWT), "token gone");
  assert.ok(out!.includes("utm_source=email"), "campaign kept");
  assert.ok(out!.includes("q=kept"), "search term kept");
});

test("the hash is preserved", () => {
  assert.equal(
    sanitizeAnalyticsUrl("https://aminobased.com/faq?t=x#shipping"),
    "https://aminobased.com/faq#shipping",
  );
});

// ---------------------------------------------------------------------------
// Every denylisted parameter, and malformed input
// ---------------------------------------------------------------------------

test("no denylisted parameter is ever transmitted", () => {
  for (const name of SENSITIVE_QUERY_PARAMS) {
    const out = sanitizeAnalyticsUrl(`https://aminobased.com/x?${name}=SECRETVALUE`);
    assert.ok(out !== null, `${name} case must still produce a URL`);
    assert.ok(!out!.includes("SECRETVALUE"), `${name} must be stripped`);
    assert.ok(!out!.includes(`${name}=`), `${name} parameter must be gone`);
  }
});

test("the denylist and the preserve list do not overlap", () => {
  const deny = new Set(SENSITIVE_QUERY_PARAMS.map((p) => p.toLowerCase()));
  for (const keep of PRESERVED_QUERY_PARAMS) {
    assert.equal(deny.has(keep.toLowerCase()), false, `${keep} is in both lists`);
  }
});

test("an unparseable or empty URL yields null rather than a raw passthrough", () => {
  for (const bad of [null, undefined, "", "   ", "/order-confirmation/1?t=x", "not a url"]) {
    assert.equal(
      sanitizeAnalyticsUrl(bad as string | null | undefined),
      null,
      `${JSON.stringify(bad)} must be null, never echoed back`,
    );
  }
});

test("hasSensitiveQueryParams detects the token and ignores clean URLs", () => {
  assert.equal(hasSensitiveQueryParams(`${ORDER_URL}?t=${JWT}`), true);
  assert.equal(hasSensitiveQueryParams("https://aminobased.com/shop?q=bpc"), false);
  assert.equal(hasSensitiveQueryParams("https://aminobased.com/"), false);
  assert.equal(hasSensitiveQueryParams("not a url"), false);
});

// ---------------------------------------------------------------------------
// Hostname restriction
// ---------------------------------------------------------------------------

test("the canonical production hostname is allowed", () => {
  assert.equal(GA_CANONICAL_HOST, "aminobased.com");
  assert.equal(isCanonicalAnalyticsHost("aminobased.com"), true);
  assert.equal(isCanonicalAnalyticsHost("AMINOBASED.COM"), true);
  assert.equal(isCanonicalAnalyticsHost("aminobased.com:443"), true);
  assert.equal(isCanonicalAnalyticsHost("aminobased.com."), true);
});

test("the Railway hostname is rejected", () => {
  assert.equal(isCanonicalAnalyticsHost("amino-based-production.up.railway.app"), false);
  assert.equal(isCanonicalAnalyticsHost("amino-based-production.up.railway.app:443"), false);
  assert.equal(isCanonicalAnalyticsHost("AMINO-BASED-PRODUCTION.UP.RAILWAY.APP"), false);
});

test("preview, local and lookalike hostnames are rejected", () => {
  for (const host of [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "[::1]",
    "www.aminobased.com",
    "staging.aminobased.com",
    "aminobased.com.evil.test",
    "notaminobased.com",
    "aminobased.co",
    "",
    null,
    undefined,
  ]) {
    assert.equal(
      isCanonicalAnalyticsHost(host as string | null | undefined),
      false,
      `${JSON.stringify(host)} must be rejected`,
    );
  }
});

test("host normalisation strips port, case and trailing dot", () => {
  assert.equal(normalizeAnalyticsHost("AminoBased.com:8080"), "aminobased.com");
  assert.equal(normalizeAnalyticsHost("[::1]:3000"), "[::1]");
  assert.equal(normalizeAnalyticsHost("  aminobased.com.  "), "aminobased.com");
  for (const bad of [null, undefined, "", "  ", ":"]) {
    assert.equal(normalizeAnalyticsHost(bad as string | null | undefined), null);
  }
});

// ---------------------------------------------------------------------------
// Inactive without a Measurement ID, and no order logic touched
// ---------------------------------------------------------------------------

test("GA4 stays inactive while no Measurement ID is configured", () => {
  // The component is only rendered when the env var is truthy
  // (components/Analytics.tsx), and the var is read as a plain string.
  const configured = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  assert.ok(
    configured === undefined || configured === "",
    "this environment must have no Measurement ID, so GA4 cannot load",
  );
});

test("Analytics.tsx renders GA4 only behind the env gate", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "Analytics.tsx"),
    "utf8",
  );
  assert.match(src, /GA_MEASUREMENT_ID && <GoogleAnalytics measurementId=\{GA_MEASUREMENT_ID\} \/>/);
  // The old unconditional <Script src="...gtag/js"> must be gone: it loaded
  // gtag.js from the HTML on every host, which no runtime guard could prevent.
  assert.ok(
    !src.includes("googletagmanager.com/gtag/js"),
    "gtag.js must no longer be hardcoded into server-rendered HTML",
  );
});

test("the sanitiser performs no token validation and keeps order access untouched", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "analytics", "sanitizeUrl.ts"),
    "utf8",
  );
  // It must not IMPORT, verify or sign order tokens. Naming the token module in
  // a doc comment is fine and intended — the assertion is about code, so strip
  // comments before checking.
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
  for (const forbidden of [
    "orderAccessToken",
    "jsonwebtoken",
    "jwt.verify",
    "jwt.sign",
    ".verify(",
    ".sign(",
    "import",
  ]) {
    assert.ok(!code.includes(forbidden), `code must not contain ${forbidden}`);
  }
  // Sanitising is non-destructive: it returns a new string and never mutates
  // or re-writes browser history.
  assert.ok(!src.includes("history.replaceState"), "must not rewrite the address bar");
  assert.ok(!src.includes("pushState"), "must not rewrite the address bar");
});

// ---------------------------------------------------------------------------
// Fix A — password-reset token in the URL PATH
//
// lib/email/templates/forgotPassword.ts builds /reset-password/<token>, so the
// credential is a path segment and query stripping alone never touched it. A
// reset token grants account takeover, which makes it the highest-value secret
// that could reach GA4.
// ---------------------------------------------------------------------------

const RESET = "RESET_TOKEN_DUMMY_abc123";

test("the reset token is redacted out of the path", () => {
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET}`);
  assert.equal(out, `https://aminobased.com/reset-password/${REDACTED_SEGMENT}`);
  assert.ok(!out!.includes(RESET), "no fragment of the token may survive");
});

test("the route structure is preserved, so the page is still identifiable", () => {
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET}`);
  assert.ok(out!.includes("/reset-password/"), "the route itself must remain legible");
});

test("a trailing slash is handled and preserved", () => {
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET}/`);
  assert.equal(out, `https://aminobased.com/reset-password/${REDACTED_SEGMENT}/`);
  assert.ok(!out!.includes(RESET));
});

test("a percent-encoded token is redacted without needing to be decoded", () => {
  const encoded = encodeURIComponent("tok/en+with=chars");
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${encoded}`);
  assert.ok(out!.includes(REDACTED_SEGMENT), "must redact");
  assert.ok(!out!.includes("with%3Dchars"), "encoded value must not survive");
});

test("redaction is case-insensitive on the route", () => {
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/Reset-Password/${RESET}`);
  assert.ok(!out!.includes(RESET), "a differently-cased route must still redact");
});

test("the reset token is redacted in a referrer too, not only in page_location", () => {
  const out = resolveAnalyticsReferrer(`https://aminobased.com/reset-password/${RESET}`);
  assert.ok(out !== null);
  assert.ok(!out!.includes(RESET), "a reset URL as referrer must not leak");
  assert.ok(out!.includes(REDACTED_SEGMENT));
});

test("unrelated routes are NOT redacted — reporting must stay useful", () => {
  for (const url of [
    "https://aminobased.com/product/glp-1trz",
    "https://aminobased.com/blog/some-post",
    "https://aminobased.com/account/orders",
    "https://aminobased.com/order-confirmation/1234",
    "https://aminobased.com/shop",
  ]) {
    assert.equal(sanitizeAnalyticsUrl(url), url, `${url} must pass through untouched`);
  }
});

test("sanitizeAnalyticsPath only rewrites the reset route", () => {
  assert.equal(sanitizeAnalyticsPath("/reset-password/abc"), `/reset-password/${REDACTED_SEGMENT}`);
  assert.equal(sanitizeAnalyticsPath("/reset-password"), "/reset-password", "bare route has no token");
  assert.equal(sanitizeAnalyticsPath("/product/bpc-157"), "/product/bpc-157");
  assert.equal(sanitizeAnalyticsPath("/"), "/");
});

// ---------------------------------------------------------------------------
// Fix B — order token reaching GA4 through page_referrer
// ---------------------------------------------------------------------------

test("a same-origin order referrer is sanitised", () => {
  const out = resolveAnalyticsReferrer(`${ORDER_URL}?t=${JWT}`);
  assert.equal(out, ORDER_URL);
  assert.ok(!out!.includes(JWT), "the order token must not survive as a referrer");
});

test("an empty referrer yields null, meaning the key is omitted", () => {
  for (const empty of ["", "   ", null, undefined]) {
    assert.equal(resolveAnalyticsReferrer(empty as string | null | undefined), null);
  }
});

test("a present-but-unparseable referrer yields an empty string, never the raw value", () => {
  // The important case: omitting the key here would let gtag substitute the raw
  // document.referrer, which is exactly the leak being closed.
  for (const bad of ["not a url", "/relative/path"]) {
    const out = resolveAnalyticsReferrer(bad);
    assert.equal(out, "", `${bad} must become an explicit empty string`);
    assert.notEqual(out, null, "must NOT be omitted — gtag would fall back to the raw value");
  }
});

test("a clean cross-origin referrer is preserved", () => {
  const google = "https://www.google.com/search?q=peptides";
  assert.equal(resolveAnalyticsReferrer(google), google);
});

test("a cross-origin referrer carrying a sensitive param is still stripped", () => {
  const out = resolveAnalyticsReferrer(`https://partner.example/landing?token=${JWT}&utm_source=x`);
  assert.ok(!out!.includes(JWT));
  assert.ok(out!.includes("utm_source=x"), "legitimate params survive");
});

test("GoogleAnalytics passes the sanitised referrer to gtag, not just computes it", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "analytics", "GoogleAnalytics.tsx"),
    "utf8",
  );
  assert.match(src, /resolveAnalyticsReferrer\(document\.referrer\)/, "must sanitise the real referrer");
  assert.match(src, /page_referrer: referrer/, "must build the param");
  assert.match(src, /pushGtag\("set", sharedParams\)/, "set must receive merged params");
  assert.match(src, /pushGtag\("config", measurementId, sharedParams\)/, "config must receive merged params");
  assert.ok(
    !/pushGtag\("config", measurementId, locationParams\)/.test(src),
    "config must not receive location-only params",
  );
});

// ---------------------------------------------------------------------------
// Fix C — Stripe redirect parameters
// ---------------------------------------------------------------------------

const STRIPE_SECRET = "pi_3ABCdef_secret_DUMMYvalue123";

test("every Stripe redirect parameter is stripped", () => {
  for (const name of [
    "payment_intent_client_secret",
    "setup_intent_client_secret",
    "client_secret",
    "payment_intent",
    "setup_intent",
    "redirect_status",
  ]) {
    const out = sanitizeAnalyticsUrl(`https://aminobased.com/checkout?${name}=${STRIPE_SECRET}`);
    assert.ok(out !== null);
    assert.ok(!out!.includes(STRIPE_SECRET), `${name} value must be stripped`);
    assert.ok(!out!.includes(`${name}=`), `${name} key must be gone`);
  }
});

test("a realistic Stripe return_url is fully cleaned", () => {
  const out = sanitizeAnalyticsUrl(
    `https://aminobased.com/order-confirmation/1234?t=${JWT}` +
      `&payment_intent=pi_3ABC&payment_intent_client_secret=${STRIPE_SECRET}&redirect_status=succeeded`,
  );
  assert.equal(out, "https://aminobased.com/order-confirmation/1234");
  assert.ok(!out!.includes(JWT), "order token gone");
  assert.ok(!out!.includes(STRIPE_SECRET), "client secret gone");
  assert.ok(!out!.includes("pi_3ABC"), "payment intent id gone");
});

test("Stripe parameter matching is case-insensitive", () => {
  for (const name of ["Payment_Intent_Client_Secret", "PAYMENT_INTENT", "Setup_Intent"]) {
    const out = sanitizeAnalyticsUrl(`https://aminobased.com/x?${name}=${STRIPE_SECRET}`);
    assert.ok(!out!.includes(STRIPE_SECRET), `${name} must be stripped`);
  }
});

test("a percent-encoded Stripe parameter name is stripped", () => {
  const out = sanitizeAnalyticsUrl(
    `https://aminobased.com/x?%70ayment_intent_client_secret=${STRIPE_SECRET}`,
  );
  assert.ok(!out!.includes(STRIPE_SECRET), "encoded name must still match");
});

test("a Stripe secret in a referrer is stripped too", () => {
  const out = resolveAnalyticsReferrer(
    `https://aminobased.com/checkout?payment_intent_client_secret=${STRIPE_SECRET}`,
  );
  assert.ok(!out!.includes(STRIPE_SECRET));
});

// ---------------------------------------------------------------------------
// Regression protection
// ---------------------------------------------------------------------------

test("no dummy credential used in this suite appears in any sanitised output", () => {
  const secrets = [JWT, RESET, STRIPE_SECRET];
  const urls = [
    `https://aminobased.com/order-confirmation/1?t=${JWT}`,
    `https://aminobased.com/reset-password/${RESET}`,
    `https://aminobased.com/checkout?payment_intent_client_secret=${STRIPE_SECRET}`,
    `https://aminobased.com/x?token=${JWT}&q=keep&utm_source=news`,
  ];
  for (const url of urls) {
    const viaLocation = sanitizeAnalyticsUrl(url) ?? "";
    const viaReferrer = resolveAnalyticsReferrer(url) ?? "";
    for (const s of secrets) {
      assert.ok(!viaLocation.includes(s), `page_location leaked from ${url}`);
      assert.ok(!viaReferrer.includes(s), `page_referrer leaked from ${url}`);
    }
  }
});

test("normal commerce URLs and campaign parameters are untouched", () => {
  const keep = [
    "https://aminobased.com/product/glp-1trz",
    "https://aminobased.com/shop?q=semaglutide",
    "https://aminobased.com/?utm_source=newsletter&utm_medium=email&gclid=abc",
    "https://aminobased.com/shop?page=2&sort=price&category=glp",
  ];
  for (const url of keep) {
    assert.equal(sanitizeAnalyticsUrl(url), url, `${url} must be unchanged`);
    assert.equal(resolveAnalyticsReferrer(url), url, `${url} must be unchanged as referrer`);
  }
});

test("host restriction is unaffected by the new sanitisation", () => {
  assert.equal(isCanonicalAnalyticsHost(GA_CANONICAL_HOST), true);
  assert.equal(isCanonicalAnalyticsHost("amino-based-production.up.railway.app"), false);
  assert.equal(isCanonicalAnalyticsHost("localhost"), false);
});

test("duplicate-initialisation protection is still present", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "analytics", "GoogleAnalytics.tsx"),
    "utf8",
  );
  assert.match(src, /__aminoGaInitialised/, "the init guard must remain");
  assert.match(src, /isCanonicalAnalyticsHost\(window\.location\.hostname\)/, "host gate must remain");
});

// ---------------------------------------------------------------------------
// Non-canonical reset paths
//
// The first pattern anchored on "$" after an optional trailing slash, so an
// extra segment fell through unredacted:
//
//   /reset-password/<token>/extra  ->  leaked the token in page_location
//
// The app's route is a single dynamic segment, so such a URL 404s — but a 404
// still renders inside the root layout, which loads analytics, so the token
// reached GA4 anyway. Verified reachable: that path returns 404 and the GA id
// is present in the 404 HTML.
// ---------------------------------------------------------------------------

const RESET_NC = "SECRET123_NONCANONICAL";

test("an extra path segment after the token is redacted", () => {
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET_NC}/extra`);
  assert.equal(out, `https://aminobased.com/reset-password/${REDACTED_SEGMENT}`);
  assert.ok(!out!.includes(RESET_NC), "the token must not survive");
});

test("several extra path segments are redacted", () => {
  const out = sanitizeAnalyticsUrl(
    `https://aminobased.com/reset-password/${RESET_NC}/extra/segment`,
  );
  assert.equal(out, `https://aminobased.com/reset-password/${REDACTED_SEGMENT}`);
  assert.ok(!out!.includes(RESET_NC));
  assert.ok(!out!.includes("extra"), "trailing segments are dropped, not preserved");
});

test("extra segments with a trailing slash are redacted", () => {
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET_NC}/extra/`);
  assert.ok(!out!.includes(RESET_NC));
  assert.ok(out!.includes(REDACTED_SEGMENT));
});

test("repeated slashes before the token are redacted", () => {
  // Normalised away by a 308 before any page renders, so not reachable in
  // practice — matched anyway so the guarantee does not depend on the server.
  for (const p of [`//${RESET_NC}`, `///${RESET_NC}`, `//${RESET_NC}/x`]) {
    const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password${p}`);
    assert.ok(!out!.includes(RESET_NC), `/reset-password${p} must be redacted`);
  }
});

test("a non-canonical reset path keeps its query handling", () => {
  const out = sanitizeAnalyticsUrl(
    `https://aminobased.com/reset-password/${RESET_NC}/extra?a=1&utm_source=mail`,
  );
  assert.ok(!out!.includes(RESET_NC));
  assert.ok(out!.includes("a=1"), "ordinary query params survive");
  assert.ok(out!.includes("utm_source=mail"), "campaign params survive");
});

test("a non-canonical reset path is redacted in a referrer too", () => {
  const out = resolveAnalyticsReferrer(
    `https://aminobased.com/reset-password/${RESET_NC}/extra`,
  );
  assert.ok(out !== null);
  assert.ok(!out!.includes(RESET_NC), "page_referrer must not leak it either");
  assert.ok(out!.includes(REDACTED_SEGMENT));
});

test("uppercase non-canonical reset paths are redacted", () => {
  for (const route of ["/RESET-PASSWORD", "/Reset-Password"]) {
    const out = sanitizeAnalyticsUrl(`https://aminobased.com${route}/${RESET_NC}/extra`);
    assert.ok(!out!.includes(RESET_NC), `${route} must redact`);
  }
});

test("an encoded token with extra segments is redacted", () => {
  const encoded = encodeURIComponent("a/b+c=d");
  const out = sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${encoded}/extra`);
  assert.equal(out, `https://aminobased.com/reset-password/${REDACTED_SEGMENT}`);
});

test("the canonical shapes still behave exactly as before", () => {
  // Guards against the new pattern swallowing the trailing slash the canonical
  // rule deliberately preserves.
  assert.equal(
    sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET_NC}`),
    `https://aminobased.com/reset-password/${REDACTED_SEGMENT}`,
  );
  assert.equal(
    sanitizeAnalyticsUrl(`https://aminobased.com/reset-password/${RESET_NC}/`),
    `https://aminobased.com/reset-password/${REDACTED_SEGMENT}/`,
  );
});

test("a reset route with no token is left alone", () => {
  // Nothing to hide, so redacting would only destroy reporting detail.
  assert.equal(sanitizeAnalyticsPath("/reset-password"), "/reset-password");
  assert.equal(sanitizeAnalyticsPath("/reset-password/"), "/reset-password/");
  assert.equal(sanitizeAnalyticsPath("/reset-password//"), "/reset-password//");
});

test("lookalike routes are still not redacted", () => {
  for (const url of [
    "https://aminobased.com/reset-passwordish/x",
    "https://aminobased.com/account/reset-password/x",
    "https://aminobased.com/product/reset-password",
  ]) {
    assert.equal(sanitizeAnalyticsUrl(url), url, `${url} must pass through untouched`);
  }
});

test("no reset token shape reaches page_location or page_referrer", () => {
  const paths = [
    `/reset-password/${RESET_NC}`,
    `/reset-password/${RESET_NC}/`,
    `/reset-password/${RESET_NC}/extra`,
    `/reset-password/${RESET_NC}/extra/segment`,
    `/reset-password//${RESET_NC}`,
    `/reset-password/${RESET_NC}?a=1`,
    `/reset-password/${RESET_NC}#frag`,
  ];
  for (const p of paths) {
    const url = `https://aminobased.com${p}`;
    assert.ok(!(sanitizeAnalyticsUrl(url) ?? "").includes(RESET_NC), `page_location leaked: ${p}`);
    assert.ok(!(resolveAnalyticsReferrer(url) ?? "").includes(RESET_NC), `page_referrer leaked: ${p}`);
  }
});
