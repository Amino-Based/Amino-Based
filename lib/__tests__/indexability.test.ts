/**
 * Indexability is the gate that decides whether a host may be crawled.
 *
 * It replaced an expression that read `VERCEL_ENV === "production"`, which is
 * never set on Railway, so the live site silently served `Disallow: /`. These
 * tests pin the two properties that matter:
 *
 *   1. it fails CLOSED — anything other than an explicit opt-in means no;
 *   2. only the exact canonical host is ever allowed, so the publicly
 *      reachable `*.up.railway.app` domain can never become indexable.
 *
 * Pure unit tests: no database, no network, no request.
 *
 * NEXT_PUBLIC_SITE_URL is `http://localhost:3000` in this environment, so
 * CANONICAL_HOST resolves to `localhost` here. The assertions below are written
 * against CANONICAL_HOST rather than a hardcoded domain, so they hold in CI and
 * in production alike.
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeHost,
  isCanonicalHost,
  isIndexableRequest,
  resolveRequestHost,
  CANONICAL_HOST,
  SITE_INDEXING_ENABLED,
  NOINDEX_METADATA,
} from "../indexability";

/** Minimal stand-in for the Headers object `headers()` returns. */
function headerList(entries: Record<string, string>) {
  const lower = new Map(Object.entries(entries).map(([k, v]) => [k.toLowerCase(), v]));
  return { get: (name: string) => lower.get(name.toLowerCase()) ?? null };
}

// ---------------------------------------------------------------------------
// Host normalisation
// ---------------------------------------------------------------------------

test("a port is stripped, so host:443 matches host", () => {
  assert.equal(normalizeHost("aminobased.com:443"), "aminobased.com");
  assert.equal(normalizeHost("localhost:3000"), "localhost");
});

test("case is folded, since Host is case-insensitive", () => {
  assert.equal(normalizeHost("AminoBased.COM"), "aminobased.com");
  assert.equal(normalizeHost("WWW.AMINOBASED.COM"), "www.aminobased.com");
});

test("a trailing dot is stripped, since it is an equivalent FQDN", () => {
  assert.equal(normalizeHost("aminobased.com."), "aminobased.com");
});

test("a comma-separated forwarded list takes the first entry", () => {
  assert.equal(normalizeHost("aminobased.com, proxy.internal"), "aminobased.com");
});

test("an IPv6 literal keeps its address and drops the port", () => {
  assert.equal(normalizeHost("[::1]:3000"), "[::1]");
  assert.equal(normalizeHost("[::1]"), "[::1]");
});

test("missing or unusable values normalise to null, never to a matchable string", () => {
  for (const bad of [null, undefined, "", "   ", ":", ","]) {
    assert.equal(normalizeHost(bad as string | null | undefined), null, `${JSON.stringify(bad)} must be null`);
  }
  assert.equal(normalizeHost(123 as unknown as string), null, "a non-string must be null");
});

// ---------------------------------------------------------------------------
// Canonical host matching
// ---------------------------------------------------------------------------

test("the canonical host is derived from NEXT_PUBLIC_SITE_URL", () => {
  assert.ok(CANONICAL_HOST, "a canonical host must resolve");
  assert.equal(CANONICAL_HOST, normalizeHost(CANONICAL_HOST));
  assert.ok(!CANONICAL_HOST!.includes(":"), "the canonical host must carry no port");
});

test("the canonical host matches itself, including with a port or odd case", () => {
  assert.equal(isCanonicalHost(CANONICAL_HOST), true);
  assert.equal(isCanonicalHost(`${CANONICAL_HOST}:443`), true);
  assert.equal(isCanonicalHost(CANONICAL_HOST!.toUpperCase()), true);
  assert.equal(isCanonicalHost(`${CANONICAL_HOST}.`), true);
});

test("the Railway hostname is never canonical", () => {
  assert.equal(isCanonicalHost("amino-based-production.up.railway.app"), false);
  assert.equal(isCanonicalHost("amino-based-production.up.railway.app:443"), false);
  assert.equal(isCanonicalHost("AMINO-BASED-PRODUCTION.UP.RAILWAY.APP"), false);
});

test("www is not canonical — it is redirected to the apex instead", () => {
  assert.equal(isCanonicalHost("www.aminobased.com"), false);
  assert.equal(isCanonicalHost(`www.${CANONICAL_HOST}`), false);
});

test("a missing or lookalike host is never canonical", () => {
  for (const host of [null, undefined, "", "aminobased.com.evil.test", "notaminobased.com", "evil.test"]) {
    assert.equal(isCanonicalHost(host as string | null | undefined), false, `${host} must not match`);
  }
});

// ---------------------------------------------------------------------------
// Fail-closed behaviour
// ---------------------------------------------------------------------------

test("the environment switch is off unless SITE_INDEXABLE is exactly 'true'", () => {
  // Unset in this environment, which is the safe default.
  assert.equal(SITE_INDEXING_ENABLED, process.env.SITE_INDEXABLE === "true");
  assert.equal(SITE_INDEXING_ENABLED, false, "indexing must be off by default");
});

test("with the switch off, no host is indexable — not even the canonical one", () => {
  assert.equal(isIndexableRequest(CANONICAL_HOST), false);
  assert.equal(isIndexableRequest("amino-based-production.up.railway.app"), false);
  assert.equal(isIndexableRequest(null), false);
});

test("the switch alone cannot open a non-canonical host", async () => {
  // Re-import with the switch forced on, proving the host check is independent
  // of the environment flag rather than short-circuited by it.
  const previous = process.env.SITE_INDEXABLE;
  process.env.SITE_INDEXABLE = "true";
  try {
    const fresh = await import(`../indexability?enabled=${Date.now()}`);
    assert.equal(fresh.SITE_INDEXING_ENABLED, true, "the switch must read as on");
    assert.equal(fresh.isIndexableRequest(fresh.CANONICAL_HOST), true, "canonical host indexable");
    assert.equal(
      fresh.isIndexableRequest("amino-based-production.up.railway.app"),
      false,
      "the Railway host must stay blocked even with indexing enabled",
    );
    assert.equal(fresh.isIndexableRequest("www.aminobased.com"), false, "www must stay blocked");
    assert.equal(fresh.isIndexableRequest(null), false, "a missing host must stay blocked");
  } finally {
    if (previous === undefined) delete process.env.SITE_INDEXABLE;
    else process.env.SITE_INDEXABLE = previous;
  }
});

test("a truthy-but-wrong switch value does not enable indexing", async () => {
  const previous = process.env.SITE_INDEXABLE;
  for (const value of ["TRUE", "1", "yes", "true ", ""]) {
    process.env.SITE_INDEXABLE = value;
    const fresh = await import(`../indexability?v=${encodeURIComponent(value)}-${Date.now()}`);
    assert.equal(fresh.SITE_INDEXING_ENABLED, false, `"${value}" must not enable indexing`);
  }
  if (previous === undefined) delete process.env.SITE_INDEXABLE;
  else process.env.SITE_INDEXABLE = previous;
});

// ---------------------------------------------------------------------------
// Request host resolution
// ---------------------------------------------------------------------------

test("x-forwarded-host wins over host when both are present", () => {
  const h = headerList({ host: "internal:8080", "x-forwarded-host": "aminobased.com" });
  assert.equal(resolveRequestHost(h), "aminobased.com");
});

test("host is used when there is no forwarded header", () => {
  assert.equal(resolveRequestHost(headerList({ host: "aminobased.com" })), "aminobased.com");
});

test("no host headers at all resolves to null, which is never canonical", () => {
  const resolved = resolveRequestHost(headerList({}));
  assert.equal(resolved, null);
  assert.equal(isCanonicalHost(resolved), false);
});

test("header lookup is case-insensitive, as HTTP requires", () => {
  assert.equal(resolveRequestHost(headerList({ "X-Forwarded-Host": "aminobased.com" })), "aminobased.com");
});

// ---------------------------------------------------------------------------
// Private-route metadata
// ---------------------------------------------------------------------------

test("the shared noindex metadata refuses indexing and following", () => {
  assert.equal(NOINDEX_METADATA.robots.index, false);
  assert.equal(NOINDEX_METADATA.robots.follow, false);
  assert.equal(NOINDEX_METADATA.robots.googleBot.index, false);
  assert.equal(NOINDEX_METADATA.robots.googleBot.follow, false);
});
