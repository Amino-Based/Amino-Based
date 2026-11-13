"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  isCanonicalAnalyticsHost,
  resolveAnalyticsReferrer,
  sanitizeAnalyticsUrl,
} from "@/lib/analytics/sanitizeUrl";

/**
 * Loads GA4, but only on the canonical production hostname and only with a URL
 * that carries no sensitive query parameters.
 *
 * Why this is a client component rather than the previous server-rendered
 * `<Script>` pair:
 *
 *   - The hostname gate has to be evaluated per visitor. Doing it on the server
 *     would need `headers()`, and this renders inside the ROOT layout, so that
 *     would opt every page into dynamic rendering and lose static generation
 *     site-wide. `window.location.hostname` costs nothing.
 *   - A server-rendered `<Script src>` tag is in the HTML unconditionally, so
 *     gtag.js would download on the Railway hostname regardless of any guard.
 *     Injecting it from here means the request is never made off-domain.
 *   - It keeps one tested implementation of the sanitiser (imported, not
 *     duplicated into an inline script string).
 *
 * Clarity is untouched and still loads from components/Analytics.tsx.
 *
 * Renders no markup.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    /** Set once gtag.js has been requested, so a remount cannot re-initialise. */
    __aminoGaInitialised?: boolean;
  }
}

/** Mirrors Google's own stub: `function gtag(){dataLayer.push(arguments);}`. */
function pushGtag(...args: unknown[]): void {
  if (!window.dataLayer) window.dataLayer = [];
  // gtag.js reads an arguments object, so hand it exactly that rather than an
  // array — the two are not interchangeable for every command.
  const push = function (this: unknown) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...a: unknown[]) => void;
  push(...args);
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  // usePathname (not useSearchParams) is the route-change trigger on purpose:
  // useSearchParams would require a Suspense boundary and opt this subtree into
  // client-side rendering. The full URL is read from window.location instead,
  // so query parameters are still reported — just not used as the dependency.
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) return;
    if (typeof window === "undefined") return;

    // Hostname gate. Fails closed: Railway, previews, localhost and any other
    // host get no script and no request.
    if (!isCanonicalAnalyticsHost(window.location.hostname)) return;

    const pageLocation = sanitizeAnalyticsUrl(window.location.href);
    // An unparseable URL yields null; omit page_location rather than risk
    // forwarding a raw string that might still contain a token.
    const locationParams = pageLocation ? { page_location: pageLocation } : {};

    // page_referrer must be supplied explicitly. gtag.js derives it from
    // document.referrer when the caller does not, and a same-origin referrer
    // keeps the full URL — so navigating away from /order-confirmation?t=... or
    // /reset-password/<token> would otherwise send that credential to GA4 in the
    // `dr` parameter. Referrer-Policy does not help: this value is read in JS and
    // sent as a payload field, not as a Referer header.
    //
    // resolveAnalyticsReferrer returns null only when the referrer is genuinely
    // empty, which is the one case where omitting the key is safe.
    const referrer = resolveAnalyticsReferrer(document.referrer);
    const referrerParams = referrer === null ? {} : { page_referrer: referrer };

    const sharedParams = { ...locationParams, ...referrerParams };

    if (!window.__aminoGaInitialised) {
      window.__aminoGaInitialised = true;

      pushGtag("js", new Date());
      // `set` before `config` so the sanitised value is the default for the
      // initial page_view AND for anything GA4 sends later of its own accord
      // (for example an Enhanced-measurement page_view on a history change).
      // Without this, such an event would recompute page_location from the real
      // URL and reintroduce the token.
      pushGtag("set", sharedParams);
      pushGtag("config", measurementId, sharedParams);

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
      return;
    }

    // Subsequent client-side navigation: refresh the default so later events
    // report the current page rather than a stale one. No page_view is sent
    // here, so this cannot duplicate GA4's own counting.
    pushGtag("set", sharedParams);
  }, [measurementId, pathname]);

  return null;
}
