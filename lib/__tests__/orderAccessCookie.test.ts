/**
 * Order-access capability: cookie scoping, expiry and the email-link exchange.
 *
 * The signed JWT used to travel as `?t=` on /order-confirmation/<id>, which put
 * it in browser history, access logs, the Referer header and analytics. It now
 * rides in an HttpOnly cookie. These tests pin the properties that make that
 * safe, and the backwards compatibility that keeps existing 30-day email links
 * working.
 *
 * A dummy secret is set before the token module is imported, so nothing here
 * touches the real PAYLOAD_SECRET and no real token is ever produced.
 */
import test from "node:test";
import assert from "node:assert/strict";

process.env.PAYLOAD_SECRET = "dummy-test-secret-not-a-real-key";

const { signOrderAccessToken, verifyOrderAccessToken, ORDER_TOKEN_TTL_EMAIL } = await import(
  "../orders/orderAccessToken"
);
const {
  isValidOrderId,
  orderAccessCookieName,
  orderAccessCookiePath,
  buildOrderAccessCookieOptions,
  remainingLifetimeSeconds,
  checkoutCookieMaxAgeSeconds,
  ORDER_ACCESS_COOKIE_PREFIX,
} = await import("../orders/orderAccessCookie");

const SEVEN_DAYS = 7 * 24 * 60 * 60;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

// ---------------------------------------------------------------------------
// Order id validation — the id reaches a cookie NAME and a cookie PATH
// ---------------------------------------------------------------------------

test("only a plain positive integer is accepted as an order id", () => {
  for (const good of ["1", "42", "999999", 1, 42]) {
    assert.equal(isValidOrderId(good), true, `${good} should be valid`);
  }
});

test("an id that could inject cookie attributes or widen the path is refused", () => {
  for (const bad of [
    "1; Path=/",
    "1 Secure",
    "../../etc",
    "1/..",
    "a1",
    "-1",
    "0",
    "1.5",
    "",
    "   ",
    null,
    undefined,
    {},
    "1\n2",
  ]) {
    assert.equal(isValidOrderId(bad as unknown), false, `${JSON.stringify(bad)} must be refused`);
    assert.equal(orderAccessCookieName(bad as string), null, "no cookie name for a bad id");
    assert.equal(orderAccessCookiePath(bad as string), null, "no cookie path for a bad id");
  }
});

// ---------------------------------------------------------------------------
// Naming and scoping
// ---------------------------------------------------------------------------

test("the cookie name is scoped to one order", () => {
  assert.equal(orderAccessCookieName(41), `${ORDER_ACCESS_COOKIE_PREFIX}41`);
  assert.equal(orderAccessCookieName("42"), `${ORDER_ACCESS_COOKIE_PREFIX}42`);
  assert.notEqual(orderAccessCookieName(41), orderAccessCookieName(42));
});

test("the cookie path is scoped to that order's route", () => {
  assert.equal(orderAccessCookiePath(42), "/order-confirmation/42");
  assert.notEqual(orderAccessCookiePath(41), orderAccessCookiePath(42));
});

// ---------------------------------------------------------------------------
// Cookie attributes
// ---------------------------------------------------------------------------

test("the cookie is HttpOnly, SameSite=Lax and path-scoped", () => {
  const o = buildOrderAccessCookieOptions({ orderId: 42, maxAgeSeconds: 100, isProduction: true })!;
  assert.equal(o.httpOnly, true, "must be out of reach of client-side JavaScript");
  assert.equal(o.sameSite, "lax");
  assert.equal(o.path, "/order-confirmation/42");
  assert.equal(o.maxAge, 100);
});

test("SameSite is lax, not strict, so the Stripe 3DS return still works", () => {
  // Stripe returns from stripe.com as a top-level cross-site GET. `lax` is sent
  // on that; `strict` is not, and the receipt page would break.
  const o = buildOrderAccessCookieOptions({ orderId: 1, maxAgeSeconds: 60 })!;
  assert.equal(o.sameSite, "lax");
  assert.notEqual(o.sameSite as string, "strict");
});

test("Secure is set in production and relaxed in development", () => {
  assert.equal(
    buildOrderAccessCookieOptions({ orderId: 1, maxAgeSeconds: 60, isProduction: true })!.secure,
    true,
  );
  assert.equal(
    buildOrderAccessCookieOptions({ orderId: 1, maxAgeSeconds: 60, isProduction: false })!.secure,
    false,
  );
});

test("a bad id or non-positive lifetime yields no cookie options at all", () => {
  assert.equal(buildOrderAccessCookieOptions({ orderId: "bad", maxAgeSeconds: 60 }), null);
  assert.equal(buildOrderAccessCookieOptions({ orderId: 1, maxAgeSeconds: 0 }), null);
  assert.equal(buildOrderAccessCookieOptions({ orderId: 1, maxAgeSeconds: -5 }), null);
  assert.equal(buildOrderAccessCookieOptions({ orderId: 1, maxAgeSeconds: Number.NaN }), null);
});

// ---------------------------------------------------------------------------
// Expiry: the cookie must never outlive the token inside it
// ---------------------------------------------------------------------------

test("the checkout cookie lasts no longer than the 7-day redirect token", () => {
  assert.equal(checkoutCookieMaxAgeSeconds(), SEVEN_DAYS);
  assert.ok(checkoutCookieMaxAgeSeconds() <= SEVEN_DAYS, "must not exceed the token TTL");
});

test("remaining lifetime is computed from the token's own expiry", () => {
  const now = 1_700_000_000_000; // fixed clock, ms
  const nowSec = now / 1000;
  assert.equal(remainingLifetimeSeconds(nowSec + 3600, now), 3600);
  assert.equal(remainingLifetimeSeconds(nowSec + 1, now), 1);
});

test("an expired token yields zero remaining lifetime, never a negative or fresh one", () => {
  const now = 1_700_000_000_000;
  const nowSec = now / 1000;
  assert.equal(remainingLifetimeSeconds(nowSec - 1, now), 0);
  assert.equal(remainingLifetimeSeconds(nowSec - 86400, now), 0);
});

test("a token with no usable expiry yields null, so no cookie is set", () => {
  for (const bad of [null, undefined, Number.NaN, Number.POSITIVE_INFINITY, "x" as unknown]) {
    assert.equal(remainingLifetimeSeconds(bad as number | null), null);
  }
});

test("exchanging an almost-expired email token does NOT mint a fresh 30 days", () => {
  // The case this guards: a 30-day token that is 29 days old must produce a
  // cookie good for about 1 day, not another 30.
  const now = Date.now();
  const nowSec = Math.floor(now / 1000);
  const oneDayLeft = nowSec + 86400;
  const remaining = remainingLifetimeSeconds(oneDayLeft, now)!;
  assert.ok(remaining <= 86400 + 2, "must track the token, not reset");
  assert.ok(remaining < THIRTY_DAYS, "must not extend to a full email TTL");
});

test("a real signed email token exposes its expiry, and it is respected", () => {
  const token = signOrderAccessToken(77, ORDER_TOKEN_TTL_EMAIL);
  const payload = verifyOrderAccessToken(token)!;
  assert.equal(payload.orderId, "77");
  assert.ok(typeof payload.expiresAtSeconds === "number", "exp must be exposed");
  const remaining = remainingLifetimeSeconds(payload.expiresAtSeconds)!;
  assert.ok(remaining > THIRTY_DAYS - 120, "roughly the full 30 days for a fresh token");
  assert.ok(remaining <= THIRTY_DAYS, "never more than the signed TTL");
});

// ---------------------------------------------------------------------------
// Token validation is unchanged and still fails closed
// ---------------------------------------------------------------------------

test("a token is only valid for the order it was issued for", () => {
  const token = signOrderAccessToken(41);
  assert.equal(verifyOrderAccessToken(token)!.orderId, "41");
  assert.notEqual(verifyOrderAccessToken(token)!.orderId, "42");
});

test("malformed and foreign tokens are rejected", () => {
  for (const bad of ["", "not.a.jwt", "a.b.c", "null"]) {
    assert.equal(verifyOrderAccessToken(bad), null, `${bad} must not verify`);
  }
});

test("an expired token does not verify", () => {
  const expired = signOrderAccessToken(5, "-1s");
  assert.equal(verifyOrderAccessToken(expired), null);
});

// ---------------------------------------------------------------------------
// Call-site wiring: the token must be gone from checkout URLs
// ---------------------------------------------------------------------------

const read = async (p: string) => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  return fs.readFileSync(path.join(import.meta.dirname, "..", "..", p), "utf8");
};

test("neither checkout path puts a token in the URL any more", async () => {
  for (const f of [
    "components/checkout/CheckoutClient.tsx",
    "components/checkout/StripeCheckoutForm.tsx",
  ]) {
    const src = await read(f);
    assert.ok(!src.includes("?t=${"), `${f} must not build a token URL`);
    assert.ok(!src.includes("accessToken"), `${f} must not handle the token at all`);
  }
});

test("the Stripe return_url is clean, preserving the 3DS flow without a token", async () => {
  const src = await read("components/checkout/StripeCheckoutForm.tsx");
  assert.match(src, /return_url: `\$\{window\.location\.origin\}\/order-confirmation\/\$\{orderId\}`/);
});

test("the checkout action sets the cookie and no longer returns the token", async () => {
  const src = await read("app/checkout/actions.ts");
  assert.match(src, /\(await cookies\(\)\)\.set\(cookieName, signOrderAccessToken\(order\.id\), cookieOptions\)/);
  assert.ok(
    !/accessToken: signOrderAccessToken/.test(src),
    "the token must not be returned to the browser",
  );
});

// ---------------------------------------------------------------------------
// The exchange route, exercised for real: the handler is imported and called
// with a NextRequest, so these assert actual responses rather than source text.
// ---------------------------------------------------------------------------

const { NextRequest } = await import("next/server");
const { GET } = await import("../../app/order-confirmation/[id]/access/route");

const callExchange = async (url: string, id: string) =>
  GET(new NextRequest(new URL(url)) as never, { params: Promise.resolve({ id }) });

const setCookieOf = (res: Response) => res.headers.get("set-cookie");

test("a valid token is exchanged for the cookie and lands on the clean URL", async () => {
  const token = signOrderAccessToken(42);
  const res = await callExchange(
    `https://aminobased.com/order-confirmation/42/access?t=${token}`,
    "42",
  );
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "https://aminobased.com/order-confirmation/42");
  assert.ok(!res.headers.get("location")!.includes("t="), "no token in the destination");

  const cookie = setCookieOf(res)!;
  assert.match(cookie, /^order_access_42=/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=lax/i);
  assert.match(cookie, /Path=\/order-confirmation\/42/);
  assert.match(cookie, /Max-Age=\d+/);
});

test("the exchange sets no-store on every response", async () => {
  for (const url of [
    `https://aminobased.com/order-confirmation/42/access?t=${signOrderAccessToken(42)}`,
    "https://aminobased.com/order-confirmation/42/access",
    "https://aminobased.com/order-confirmation/42/access?t=not.a.jwt",
    "https://aminobased.com/order-confirmation/bad/access?t=x",
  ]) {
    const res = await callExchange(url, url.includes("/bad/") ? "bad" : "42");
    assert.match(res.headers.get("cache-control")!, /no-store/);
  }
});

// ---------------------------------------------------------------------------
// Referrer-Policy — asserted against the EFFECTIVE response, not the handler
//
// The route handler also sets `Referrer-Policy: no-referrer` on its own
// response object, but that is not what the client receives: a matching entry
// in next.config.mjs `headers()` is applied afterwards and replaces the same
// key. Asserting the handler's NextResponse therefore passed while the real
// HTTP response carried the site-wide `strict-origin-when-cross-origin` — a
// test that proved nothing. These tests resolve the header the way Next does,
// from the config, so they fail if the override is removed or reordered.
// ---------------------------------------------------------------------------

/** Next's own matching, reduced to the two source shapes this config uses. */
const sourceMatches = (source: string, pathname: string): boolean =>
  new RegExp(
    `^${source.replace(/:[A-Za-z_][A-Za-z0-9_]*\*/g, ".*").replace(/:[A-Za-z_][A-Za-z0-9_]*/g, "[^/]+")}$`,
  ).test(pathname);

/** The value a client actually gets: every matching entry, last one wins. */
const effectiveHeader = async (pathname: string, key: string): Promise<string | undefined> => {
  const config = (await import("../../next.config.mjs")).default as {
    headers: () => Promise<{ source: string; headers: { key: string; value: string }[] }[]>;
  };
  let value: string | undefined;
  for (const entry of await config.headers()) {
    if (!sourceMatches(entry.source, pathname)) continue;
    for (const h of entry.headers) {
      if (h.key.toLowerCase() === key.toLowerCase()) value = h.value;
    }
  }
  return value;
};

test("the exchange route's effective Referrer-Policy is no-referrer", async () => {
  for (const id of ["42", "999999999", "1"]) {
    assert.equal(
      await effectiveHeader(`/order-confirmation/${id}/access`, "Referrer-Policy"),
      "no-referrer",
      "the token-bearing URL must send no referrer at all",
    );
  }
});

test("the override is scoped: every other route keeps the site-wide policy", async () => {
  for (const pathname of [
    "/",
    "/shop",
    "/order-confirmation/42", // the clean receipt URL, one segment up
    "/order-confirmation/42/access/nested",
    "/peptide-calculator",
    "/api/health",
    "/pb-console",
  ]) {
    assert.equal(
      await effectiveHeader(pathname, "Referrer-Policy"),
      "strict-origin-when-cross-origin",
      `${pathname} must be unaffected by the exchange-route override`,
    );
  }
});

test("the override replaces only Referrer-Policy, not the other security headers", async () => {
  const expected: Record<string, string> = {
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(
      await effectiveHeader("/order-confirmation/42/access", key),
      value,
      `${key} must still reach the exchange route`,
    );
  }
});

test("the exchange-route entry stays after the site-wide block, or it would not win", async () => {
  const config = (await import("../../next.config.mjs")).default as {
    headers: () => Promise<{ source: string; headers: { key: string; value: string }[] }[]>;
  };
  const entries = await config.headers();
  const siteWide = entries.findIndex(
    (e) => e.source === "/:path*" && e.headers.some((h) => h.key === "Referrer-Policy"),
  );
  const override = entries.findIndex((e) =>
    e.headers.some((h) => h.key === "Referrer-Policy" && h.value === "no-referrer"),
  );
  assert.ok(siteWide >= 0, "the site-wide Referrer-Policy must still exist");
  assert.ok(override > siteWide, "the exchange-route override must come last");
});

test("the cookie Max-Age tracks the token's remaining life, not a fresh period", async () => {
  const res = await callExchange(
    `https://aminobased.com/order-confirmation/9/access?t=${signOrderAccessToken(9, "120s")}`,
    "9",
  );
  const maxAge = Number(/Max-Age=(\d+)/.exec(setCookieOf(res)!)![1]);
  assert.ok(maxAge <= 120 && maxAge > 100, `expected ~120s, got ${maxAge}`);
});

test("no invalid token ever establishes cookie access", async () => {
  const cases: [string, string, string][] = [
    ["no token at all", "https://aminobased.com/order-confirmation/42/access", "42"],
    ["malformed", "https://aminobased.com/order-confirmation/42/access?t=not.a.jwt", "42"],
    ["empty", "https://aminobased.com/order-confirmation/42/access?t=", "42"],
    [
      "expired",
      `https://aminobased.com/order-confirmation/42/access?t=${signOrderAccessToken(42, "-1s")}`,
      "42",
    ],
    [
      "issued for another order",
      `https://aminobased.com/order-confirmation/42/access?t=${signOrderAccessToken(41)}`,
      "42",
    ],
  ];
  for (const [label, url, id] of cases) {
    const res = await callExchange(url, id);
    assert.equal(res.status, 303, label);
    assert.equal(setCookieOf(res), null, `${label}: must not set a cookie`);
    assert.equal(
      res.headers.get("location"),
      "https://aminobased.com/order-confirmation/42",
      `${label}: lands on the clean URL, unauthorised`,
    );
  }
});

test("an unusable order id goes home and sets nothing", async () => {
  for (const id of ["bad", "0", "-1", "1;Path=/"]) {
    const res = await callExchange(
      `https://aminobased.com/order-confirmation/${encodeURIComponent(id)}/access?t=x`,
      id,
    );
    assert.equal(res.status, 303);
    assert.equal(res.headers.get("location"), "https://aminobased.com/");
    assert.equal(setCookieOf(res), null);
  }
});

test("fb=1 hands the token back once with nc=1, so a cookie-blocked browser keeps access", async () => {
  const token = signOrderAccessToken(42);
  const res = await callExchange(
    `https://aminobased.com/order-confirmation/42/access?t=${token}&fb=1`,
    "42",
  );
  assert.equal(res.status, 303);
  const location = res.headers.get("location")!;
  assert.ok(location.startsWith("https://aminobased.com/order-confirmation/42?"), location);
  assert.ok(location.includes(`t=${encodeURIComponent(token)}`), "token handed back for the probe");
  assert.ok(location.includes("nc=1"), "marker that stops the page looping");
  assert.match(setCookieOf(res)!, /^order_access_42=/, "the cookie is still set on this hop");
});

test("fb=1 is not a bypass: an invalid token still gets no cookie and no fallback", async () => {
  const res = await callExchange(
    "https://aminobased.com/order-confirmation/42/access?t=not.a.jwt&fb=1",
    "42",
  );
  assert.equal(setCookieOf(res), null);
  assert.equal(res.headers.get("location"), "https://aminobased.com/order-confirmation/42");
  assert.ok(!res.headers.get("location")!.includes("nc=1"), "no fallback for an invalid token");
});

test("the exchange cannot be steered to another host", async () => {
  for (const q of [
    "redirect=https://evil.example",
    "next=//evil.example",
    "returnTo=https://evil.example",
    "url=https://evil.example",
    "fb=1&redirect=https://evil.example",
  ]) {
    const res = await callExchange(
      `https://aminobased.com/order-confirmation/42/access?t=${signOrderAccessToken(42)}&${q}`,
      "42",
    );
    const location = new URL(res.headers.get("location")!);
    assert.equal(location.origin, "https://aminobased.com", `steered by ${q}`);
    assert.match(location.pathname, /^\/order-confirmation\/42$/);
  }
});

// ---------------------------------------------------------------------------
// Page authorisation and self-healing (source-level: the page needs Payload and
// a request scope, so its logic is pinned by reading it)
// ---------------------------------------------------------------------------

test("a valid legacy token is redirected through the exchange route", async () => {
  const src = await read("app/order-confirmation/[id]/page.tsx");
  assert.match(
    src,
    /redirect\(`\$\{safePath\}\/access\?t=\$\{encodeURIComponent\(accessToken\)\}&fb=1`\)/,
    "legacy ?t= must hand off to the exchange",
  );
  // Guarded by the verified token, so an invalid one cannot be redirected into
  // an authorised state.
  assert.match(src, /if \(queryGrants && nc !== "1"\)/);
  assert.ok(
    src.indexOf("const queryGrants") < src.indexOf("redirect(`${safePath}/access"),
    "verification must precede the redirect",
  );
});

test("nc=1 stops the self-heal looping for a cookie-blocked browser", async () => {
  const src = await read("app/order-confirmation/[id]/page.tsx");
  assert.match(src, /nc !== "1"/, "the exchange is not retried once it has run");
  // And the token is still honoured on that pass, which is the whole fallback.
  assert.match(src, /const hasCapability = cookieGrants \|\| queryGrants/);
});

test("the redirect destination is built from the order's own id, never from input", async () => {
  const src = await read("app/order-confirmation/[id]/page.tsx");
  assert.match(src, /const safePath = orderAccessCookiePath\(order\.id\)/);
  assert.match(src, /if \(safePath !== null && accessToken\)/, "null id redirects nowhere");
  assert.ok(
    !/redirect\((?:searchParams|accessToken|nc)\b/.test(src),
    "no caller-supplied destination",
  );
});

test("a cookie makes the page drop a redundant URL token", async () => {
  const src = await read("app/order-confirmation/[id]/page.tsx");
  assert.match(src, /if \(cookieGrants\) \{[\s\S]*?redirect\(safePath\)/, "strips ?t= to clean URL");
});

// ---------------------------------------------------------------------------
// Cookie-write isolation in the checkout action
// ---------------------------------------------------------------------------

/** The body of the try block that guards the cookie write. */
const cookieTryBlock = async () => {
  // Normalised: the file is checked out with CRLF line endings on Windows.
  const src = (await read("app/checkout/actions.ts")).replace(/\r\n/g, "\n");
  const start = src.indexOf("  try {\n    if (cookieName && cookieOptions)");
  assert.notEqual(start, -1, "the guarded cookie write must exist");
  const end = src.indexOf("  } catch (err) {", start);
  assert.notEqual(end, -1, "it must have a catch");
  return { src, block: src.slice(start, end), after: src.slice(end) };
};

test("a cookie-write failure does not fail an order that was already created", async () => {
  const { after } = await cookieTryBlock();
  // The catch logs and falls through; it must not rethrow or return a failure.
  const catchBody = after.slice(0, after.indexOf("\n  }"));
  assert.ok(!/\bthrow\b/.test(catchBody), "must not rethrow");
  assert.ok(!/ok: false/.test(catchBody), "must not turn into a checkout failure");
  assert.match(catchBody, /console\.error/, "the failure is still recorded");
  // And the success return is still reached afterwards.
  assert.match(after, /return \{\s*\n?\s*ok: true/, "the order still returns ok");
});

test("the guard wraps only the cookie write, so real order errors still propagate", async () => {
  const { block } = await cookieTryBlock();
  assert.match(block, /\(await cookies\(\)\)\.set\(/, "the cookie write is inside");
  for (const forbidden of [
    "payload.create",
    "reserveStock",
    "releaseStock",
    "reserveCouponUsage",
    "releaseCouponUsage",
    "createPaymentIntent",
    "getEffectivePrice",
  ]) {
    assert.ok(!block.includes(forbidden), `${forbidden} must stay outside the cookie guard`);
  }
  // Exactly one statement is guarded, so the guard cannot grow to cover
  // anything whose failure should fail the order.
  assert.equal((block.match(/;/g) ?? []).length, 1, "only the cookie write may be inside");
});

test("order creation, inventory and coupon work all happen before the guard", async () => {
  const { src } = await cookieTryBlock();
  const guard = src.indexOf("  try {\n    if (cookieName && cookieOptions)");
  for (const earlier of ["reserveStock", "reserveCouponUsage", "payload.create"]) {
    const at = src.indexOf(earlier);
    assert.notEqual(at, -1, `${earlier} should exist`);
    assert.ok(at < guard, `${earlier} must run before the cookie guard`);
  }
});

test("the cookie-failure log records no token or cookie value", async () => {
  const { after } = await cookieTryBlock();
  const catchBody = after.slice(0, after.indexOf("\n  }"));
  for (const leak of ["cookieOptions", "cookieName", "signOrderAccessToken", "token"]) {
    assert.ok(!catchBody.includes(leak), `${leak} must not be logged`);
  }
  assert.match(catchBody, /orderId: String\(order\.id\)/, "order id only");
});

test("the receipt page accepts the cookie AND the legacy query token", async () => {
  const src = await read("app/order-confirmation/[id]/page.tsx");
  assert.match(src, /tokenGrantsOrderAccess\(cookieToken, order\.id\)/, "cookie accepted");
  assert.match(src, /tokenGrantsOrderAccess\(accessToken, order\.id\)/, "legacy ?t= still accepted");
  // Owner / guest-email / admin authorisation must survive untouched.
  assert.match(src, /const isOwner =/);
  assert.match(src, /const isAdmin = user\?\.role === "admin"/);
  assert.match(src, /if \(!isOwner && !isAdmin\) return notFound\(\)/, "unauthorised still 404s");
});

test("new email links point at the exchange route, carrying the 30-day token", async () => {
  const src = await read("lib/email/templates/orderInvoice.ts");
  assert.match(src, /\/order-confirmation\/\$\{order\.id\}\/access\?t=/);
  assert.match(src, /ORDER_TOKEN_TTL_EMAIL/, "email TTL unchanged");
});

test("the exchange route is read-only and never redirects to a supplied URL", async () => {
  const src = await read("app/order-confirmation/[id]/access/route.ts");
  assert.match(src, /export async function GET/, "GET only — no mutating verb");
  for (const verb of ["export async function POST", "export async function PUT", "export async function DELETE"]) {
    assert.ok(!src.includes(verb), `${verb} must not exist on a read-only capability`);
  }
  assert.match(src, /orderAccessCookiePath\(id\)/, "destination derives from the route id");
  assert.ok(
    !/searchParams\.get\(["'](redirect|next|returnTo|url)["']\)/.test(src),
    "must not read a redirect target from the query",
  );
  assert.match(src, /Cache-Control/, "must set no-store");
  assert.match(src, /no-store/);
  assert.match(src, /Referrer-Policy/);
  assert.match(src, /no-referrer/);
  assert.match(src, /verifyOrderAccessToken\(token\)/, "verifies before setting anything");
});

test("no token value is logged anywhere in the new code", async () => {
  for (const f of [
    "app/order-confirmation/[id]/access/route.ts",
    "lib/orders/orderAccessCookie.ts",
    "app/checkout/actions.ts",
  ]) {
    const src = await read(f);
    assert.ok(!/console\.(log|warn|error)\([^)]*token/i.test(src), `${f} must not log a token`);
  }
});
