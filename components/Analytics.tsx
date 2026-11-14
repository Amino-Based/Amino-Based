import ClarityAnalytics from "@/components/analytics/ClarityAnalytics";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Google Analytics 4 + Microsoft Clarity, each loaded only when its env var is
 * set. Both gates below are unchanged: with the corresponding variable unset,
 * nothing for that tool is rendered at all.
 *
 * Each tool lives in its own client component because they need different
 * protections. GA4 transmits a URL, so ./analytics/GoogleAnalytics sanitises
 * page_location and page_referrer. Clarity records the rendered DOM, where
 * sanitising a URL protects nothing, so ./analytics/ClarityAnalytics keeps the
 * recorder away from pages that display customer data and masks the DOM when a
 * client-side navigation reaches one. Both require the canonical production
 * hostname.
 *
 * Both IDs are NEXT_PUBLIC_, so they are inlined at BUILD time. Setting either
 * one on the host requires a rebuild, not a restart.
 */
export default function Analytics() {
  return (
    <>
      {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}

      {CLARITY_PROJECT_ID && <ClarityAnalytics projectId={CLARITY_PROJECT_ID} />}
    </>
  );
}
