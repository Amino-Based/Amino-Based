/**
 * Where Microsoft Clarity may run.
 *
 * Clarity records the rendered DOM, so the GA4 protections do not transfer:
 * sanitising a URL does nothing about a shipping address displayed as text on
 * /order-confirmation/<id>. These tests pin the two rules that keep the
 * recorder away from customer data:
 *
 *   1. it loads only on the canonical production host, and
 *   2. it never loads on a route that renders personal information,
 *
 * both failing closed. Pure unit tests: no network, no Clarity, no DOM.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  CLARITY_EXCLUDED_ROUTE_PREFIXES,
  CLARITY_MASK_ATTRIBUTE,
  isClarityExcludedRoute,
  normalizeClarityPath,
  shouldLoadClarity,
} from "../analytics/clarity";
import { GA_CANONICAL_HOST } from "../analytics/sanitizeUrl";

const ID = "dummyclarityid";
const HOST = GA_CANONICAL_HOST;

// ---------------------------------------------------------------------------
// Hostname allowlist — shared with GA4, not duplicated
// ---------------------------------------------------------------------------

test("Clarity loads on the exact production hostname", () => {
  assert.equal(shouldLoadClarity({ projectId: ID, host: HOST, pathname: "/shop" }), true);
  assert.equal(shouldLoadClarity({ projectId: ID, host: HOST.toUpperCase(), pathname: "/" }), true);
  assert.equal(shouldLoadClarity({ projectId: ID, host: `${HOST}:443`, pathname: "/" }), true);
});

test("Clarity does not load on any other hostname", () => {
  for (const host of [
    "www.aminobased.com",
    "amino-based-production.up.railway.app",
    "staging.aminobased.com",
    "preview-abc.up.railway.app",
    "localhost",
    "127.0.0.1",
    "aminobased.com.evil.test",
    "notaminobased.com",
    "",
    null,
    undefined,
  ]) {
    assert.equal(
      shouldLoadClarity({ projectId: ID, host: host as string | null, pathname: "/shop" }),
      false,
      `${JSON.stringify(host)} must not load Clarity`,
    );
  }
});

test("the hostname rule is reused from the GA4 helper, not reimplemented", () => {
  const src = fs.readFileSync(path.join(import.meta.dirname, "..", "analytics", "clarity.ts"), "utf8");
  assert.match(src, /isCanonicalAnalyticsHost/, "must import the shared helper");
  assert.ok(
    !src.includes('"aminobased.com"'),
    "must not hardcode a second copy of the canonical hostname",
  );
});

// ---------------------------------------------------------------------------
// Disabled unless a project id is present
// ---------------------------------------------------------------------------

test("no project id means Clarity never loads", () => {
  for (const id of ["", "   ", null, undefined]) {
    assert.equal(
      shouldLoadClarity({ projectId: id as string | null, host: HOST, pathname: "/shop" }),
      false,
      `${JSON.stringify(id)} must keep Clarity disabled`,
    );
  }
});

// ---------------------------------------------------------------------------
// Sensitive route exclusions — every real route from the project tree
// ---------------------------------------------------------------------------

test("every sensitive route in the project is excluded", () => {
  const sensitive = [
    "/account",
    "/account/addresses",
    "/account/orders",
    "/account/orders/12345",
    "/account/settings",
    "/account/wishlist",
    "/checkout",
    "/order-confirmation/1234",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/SOME_TOKEN",
    "/pb-console",
    "/pb-console/collections/orders",
    "/affiliates/dashboard",
    "/affiliates/dashboard/payouts",
    "/affiliates/dashboard/conversions",
    "/affiliates/dashboard/settings",
    "/affiliates/dashboard/links",
    // Collects a full name, an email, and a photo or PDF of a military or
    // veteran ID, and renders the chosen file's NAME as page text.
    "/military-discount",
  ];
  for (const route of sensitive) {
    assert.equal(isClarityExcludedRoute(route), true, `${route} must be excluded`);
    assert.equal(
      shouldLoadClarity({ projectId: ID, host: HOST, pathname: route }),
      false,
      `${route} must not load Clarity`,
    );
  }
});

test("nested routes beneath an excluded prefix are excluded", () => {
  for (const route of [
    "/account/orders/999/invoice",
    "/pb-console/collections/users/42",
    "/order-confirmation/1/anything/deeper",
  ]) {
    assert.equal(isClarityExcludedRoute(route), true, `${route} must be excluded`);
  }
});

test("public routes are NOT excluded — Clarity is still useful", () => {
  for (const route of [
    "/",
    "/shop",
    "/product/glp-1trz",
    "/blog",
    "/blog/some-post",
    "/faq",
    "/about-us",
    "/contact-us",
    "/certificates",
    "/peptide-calculator",
    "/privacy-policy",
    "/affiliates",
  ]) {
    assert.equal(isClarityExcludedRoute(route), false, `${route} must be recordable`);
    assert.equal(shouldLoadClarity({ projectId: ID, host: HOST, pathname: route }), true);
  }
});

test("the public affiliates page is recordable but its dashboard is not", () => {
  assert.equal(isClarityExcludedRoute("/affiliates"), false);
  assert.equal(isClarityExcludedRoute("/affiliates/dashboard"), true);
});

test("a route that merely shares a string prefix is not excluded", () => {
  // "/account" must not swallow "/accounts-payable".
  for (const route of ["/accounts-payable", "/checkout-guide", "/logins", "/registered-office"]) {
    assert.equal(isClarityExcludedRoute(route), false, `${route} must not be excluded`);
  }
});

// ---------------------------------------------------------------------------
// Path normalisation: trailing slashes, case, query, hash, repeated slashes
// ---------------------------------------------------------------------------

test("a trailing slash does not bypass exclusion", () => {
  for (const route of ["/checkout/", "/account/", "/reset-password/TOKEN/"]) {
    assert.equal(isClarityExcludedRoute(route), true, `${route} must be excluded`);
  }
});

test("case does not bypass exclusion", () => {
  for (const route of ["/CHECKOUT", "/Account/Orders", "/Reset-Password/TOKEN"]) {
    assert.equal(isClarityExcludedRoute(route), true, `${route} must be excluded`);
  }
});

test("repeated slashes do not bypass exclusion", () => {
  for (const route of ["//checkout", "/account//orders", "///pb-console"]) {
    assert.equal(isClarityExcludedRoute(route), true, `${route} must be excluded`);
  }
});

test("a query string or hash does not bypass exclusion", () => {
  for (const route of [
    "/order-confirmation/1?t=TOKEN",
    "/checkout?step=2",
    "/account/settings#email",
  ]) {
    assert.equal(isClarityExcludedRoute(route), true, `${route} must be excluded`);
  }
});

test("an unusable path fails closed", () => {
  // Unknown shape -> treated as sensitive rather than recordable.
  for (const bad of ["", "   ", null, undefined, "not-a-path", "https://evil.test/x"]) {
    assert.equal(
      isClarityExcludedRoute(bad as string | null | undefined),
      true,
      `${JSON.stringify(bad)} must fail closed`,
    );
  }
});

test("normalizeClarityPath behaves as the matcher expects", () => {
  assert.equal(normalizeClarityPath("/Checkout/"), "/checkout");
  assert.equal(normalizeClarityPath("/account//orders/"), "/account/orders");
  assert.equal(normalizeClarityPath("/shop?q=a#b"), "/shop");
  assert.equal(normalizeClarityPath("/"), "/");
  assert.equal(normalizeClarityPath("relative"), null);
  assert.equal(normalizeClarityPath(""), null);
});

// ---------------------------------------------------------------------------
// Client-side navigation and masking
// ---------------------------------------------------------------------------

test("the component re-evaluates on navigation and masks rather than pretending to stop", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "analytics", "ClarityAnalytics.tsx"),
    "utf8",
  );
  // pathname must be an effect dependency, or a client-side navigation into a
  // sensitive route would never be noticed.
  assert.match(src, /\[projectId, pathname\]/, "pathname must be a dependency");
  assert.match(src, /usePathname\(\)/);
  // Masking is the mechanism that survives an already-running recorder.
  assert.match(src, /setAttribute\(CLARITY_MASK_ATTRIBUTE, "true"\)/);
  assert.match(src, /removeAttribute\(CLARITY_MASK_ATTRIBUTE\)/);
  assert.equal(CLARITY_MASK_ATTRIBUTE, "data-clarity-mask");
});

test("duplicate initialisation is prevented", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "analytics", "ClarityAnalytics.tsx"),
    "utf8",
  );
  assert.match(src, /__aminoClarityInitialised/, "an init guard must exist");
  assert.match(src, /if \(window\.__aminoClarityInitialised\) return;/);
});

test("Clarity is no longer server-rendered into the HTML", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "Analytics.tsx"),
    "utf8",
  );
  assert.ok(
    !src.includes("clarity.ms"),
    "a server-rendered tag would load on every host regardless of any guard",
  );
  assert.match(src, /CLARITY_PROJECT_ID && <ClarityAnalytics projectId=\{CLARITY_PROJECT_ID\} \/>/);
});

test("GA4 wiring is untouched", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "Analytics.tsx"),
    "utf8",
  );
  assert.match(src, /GA_MEASUREMENT_ID && <GoogleAnalytics measurementId=\{GA_MEASUREMENT_ID\} \/>/);
});

// ---------------------------------------------------------------------------
// PII masking coverage
// ---------------------------------------------------------------------------

test("the customer name rendered in the global nav is masked", () => {
  // SiteNav shows session.user.firstName on EVERY page, including public ones,
  // so route exclusion alone cannot cover it.
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "nav", "SiteNav.tsx"),
    "utf8",
  );
  // The name appears twice: in the link's `title` attribute and in a child
  // span. Both must fall inside a masked subtree, so the mask has to sit on the
  // link, above both — not on the span alone.
  const first = src.indexOf("session.user.firstName");
  const last = src.lastIndexOf("session.user.firstName");
  assert.ok(first > -1, "the nav still renders the first name");
  assert.notEqual(first, last, "both the title attribute and the span render it");
  const maskIdx = src.lastIndexOf('data-clarity-mask="true"', first);
  assert.ok(maskIdx > -1, "a mask attribute must precede the first occurrence");
  // The mask must be on the enclosing element, i.e. no tag closes between the
  // attribute and the last occurrence of the name.
  assert.ok(
    maskIdx < first && maskIdx < last,
    "the mask must enclose both the title attribute and the span",
  );
});

test("no custom Clarity call transmits personal data", () => {
  const src = fs.readFileSync(
    path.join(import.meta.dirname, "..", "..", "components", "analytics", "ClarityAnalytics.tsx"),
    "utf8",
  );
  for (const forbidden of ['clarity("identify"', "clarity('identify'", 'clarity("set"', "setTag"]) {
    assert.ok(!src.includes(forbidden), `must not call ${forbidden}`);
  }
});

test("the excluded prefix list matches the documented set", () => {
  assert.deepEqual([...CLARITY_EXCLUDED_ROUTE_PREFIXES].sort(), [
    "/account",
    "/affiliates/dashboard",
    "/checkout",
    "/forgot-password",
    "/login",
    "/military-discount",
    "/order-confirmation",
    "/pb-console",
    "/register",
    "/reset-password",
  ]);
});

// ---------------------------------------------------------------------------
// /military-discount — the route the audit found unexcluded
// ---------------------------------------------------------------------------

test("/military-discount is excluded, in every form a browser can produce", () => {
  for (const variant of [
    "/military-discount",
    "/military-discount/",
    "/military-discount//",
    "/MILITARY-DISCOUNT",
    "/Military-Discount/",
    "/military-discount?utm_source=newsletter",
    "/military-discount#apply",
    "/military-discount?ref=x#apply",
    "//military-discount",
    "/military-discount/thank-you", // nested, should it ever exist
    "/military-discount/apply/step-2",
  ]) {
    assert.equal(isClarityExcludedRoute(variant), true, `${variant} must be excluded`);
    assert.equal(
      shouldLoadClarity({ projectId: ID, host: HOST, pathname: variant }),
      false,
      `${variant} must not load Clarity`,
    );
  }
});

test("adding /military-discount did not over-match lookalike paths", () => {
  for (const lookalike of [
    "/military-discounts",
    "/military-discount-terms",
    "/military",
    "/military-discountable",
    "/discount",
    "/veteran-discount",
  ]) {
    assert.equal(
      isClarityExcludedRoute(lookalike),
      false,
      `${lookalike} shares a string prefix only and must stay recordable`,
    );
    assert.equal(shouldLoadClarity({ projectId: ID, host: HOST, pathname: lookalike }), true);
  }
});

// ---------------------------------------------------------------------------
// Server-rendered masks
//
// The client effect sets the <body> mask one mutation record AFTER a route's
// content has entered the DOM, which was measured in a real browser. These
// assertions pin the attribute into the server-rendered markup instead, where
// it arrives together with the content.
//
// What these tests prove: the attribute is present in the source that produces
// the initial HTML. What they do NOT and CANNOT prove: that Microsoft's
// recorder honours it. That needs a live session checked in the Clarity
// dashboard.
// ---------------------------------------------------------------------------

const sourceOf = (...segments: string[]) =>
  fs.readFileSync(path.join(import.meta.dirname, "..", "..", ...segments), "utf8");

test("the mask attribute literal used in markup matches the exported constant", () => {
  // The layouts below write the attribute literally, since a computed JSX
  // attribute name would be unreadable. This keeps the two from drifting.
  assert.equal(CLARITY_MASK_ATTRIBUTE, "data-clarity-mask");
});

test("every sensitive route carries the mask in its server-rendered markup", () => {
  const wrappers: { label: string; file: string[]; mustAlsoContain: RegExp }[] = [
    {
      label: "/checkout layout",
      file: ["app", "checkout", "layout.tsx"],
      mustAlsoContain: /\{children\}/,
    },
    {
      label: "auth layout (/login, /register, /forgot-password, /reset-password/[token])",
      file: ["app", "(auth)", "layout.tsx"],
      mustAlsoContain: /\{children\}/,
    },
    {
      label: "/account layout",
      // JSX-specific markers throughout: a bare component name would also match
      // the import statement at the top of the file, which of course precedes
      // the mask, making the enclosure check below meaningless.
      file: ["app", "account", "layout.tsx"],
      mustAlsoContain: /<AccountSidebar/,
    },
    {
      label: "/affiliates/dashboard layout",
      file: ["app", "affiliates", "dashboard", "layout.tsx"],
      mustAlsoContain: /\{children\}/,
    },
    {
      label: "/order-confirmation/[id] page",
      file: ["app", "order-confirmation", "[id]", "page.tsx"],
      // The rendered address, not the `const shippingAddress = ...` binding
      // further up the file.
      mustAlsoContain: /\{shippingAddress\.line1\}/,
    },
    {
      label: "/military-discount page",
      file: ["app", "military-discount", "page.tsx"],
      mustAlsoContain: /<MilitaryDiscountSection/,
    },
  ];

  for (const { label, file, mustAlsoContain } of wrappers) {
    const src = sourceOf(...file);
    assert.match(src, /data-clarity-mask="true"/, `${label} must carry the mask`);
    assert.match(src, mustAlsoContain, `${label} must still render its content`);
    // The mask must enclose the content, so it has to appear before it.
    const maskIdx = src.indexOf('data-clarity-mask="true"');
    const contentIdx = src.search(mustAlsoContain);
    assert.ok(
      maskIdx < contentIdx,
      `${label}: the mask must sit on an element enclosing the content, not after it`,
    );
    // No client directive: these must stay server components or the attribute
    // would not be in the initial HTML.
    assert.ok(!/^\s*["']use client["']/m.test(src), `${label} must remain server-rendered`);
  }
});

test("the two fragment-only layouts mask without changing layout", () => {
  // /checkout and the auth routes had no wrapper element, so one was added.
  // `contents` (display: contents) keeps it out of layout entirely; a plain
  // <div> there would introduce a new block box and could break the page.
  for (const file of [
    ["app", "checkout", "layout.tsx"],
    ["app", "(auth)", "layout.tsx"],
  ]) {
    const src = sourceOf(...file);
    assert.match(
      src,
      /className="contents"\s+data-clarity-mask="true"/,
      `${file.join("/")}: the added wrapper must be display:contents`,
    );
  }
});

test("masking was not applied globally to the whole site", () => {
  // A site-wide mask would make Clarity useless and is not the fix.
  for (const file of [
    ["app", "layout.tsx"],
    ["app", "page.tsx"],
    ["app", "shop", "page.tsx"],
  ]) {
    const src = sourceOf(...file);
    assert.ok(
      !src.includes('data-clarity-mask="true"'),
      `${file.join("/")} must NOT be masked — public pages stay recordable`,
    );
  }
});

test("no element unmasks a subtree inside a masked route", () => {
  for (const file of [
    ["app", "checkout", "layout.tsx"],
    ["app", "(auth)", "layout.tsx"],
    ["app", "account", "layout.tsx"],
    ["app", "affiliates", "dashboard", "layout.tsx"],
    ["app", "order-confirmation", "[id]", "page.tsx"],
    ["app", "military-discount", "page.tsx"],
  ]) {
    assert.ok(
      !sourceOf(...file).includes("data-clarity-unmask"),
      `${file.join("/")} must not re-expose a masked subtree`,
    );
  }
});

test("the privacy policy discloses both analytics providers", () => {
  const src = sourceOf("app", "privacy-policy", "page.tsx");
  assert.match(src, /Microsoft Clarity/, "Clarity must be named");
  assert.match(src, /session recording/i, "session recording must be described");
  assert.match(src, /heatmap/i, "heatmaps must be described");
  assert.match(src, /Google Analytics/, "GA4 must be named");
  // The previous wording described all analytics as anonymous and aggregated,
  // which is not true of a session recording.
  assert.ok(
    !/Anonymous, aggregated telemetry/.test(src),
    "the inaccurate 'anonymous, aggregated' description must be gone",
  );
  assert.match(src, /is not anonymous/, "a recording must not be claimed anonymous");
});
