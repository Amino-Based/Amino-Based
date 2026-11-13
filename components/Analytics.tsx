import Script from "next/script";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Google Analytics 4 + Microsoft Clarity, loaded only when their env vars are
 * set. Clarity uses `afterInteractive` so it never blocks first paint.
 *
 * GA4 moved into ./analytics/GoogleAnalytics, which additionally requires the
 * canonical production hostname and strips sensitive query parameters from the
 * reported URL. The env-var gate below is unchanged: with
 * NEXT_PUBLIC_GA_MEASUREMENT_ID unset, nothing GA-related is rendered at all.
 *
 * Both IDs are NEXT_PUBLIC_, so they are inlined at BUILD time. Setting either
 * one on the host requires a rebuild, not a restart.
 */
export default function Analytics() {
  return (
    <>
      {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}

      {CLARITY_PROJECT_ID && (
        <Script id="ms-clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}
    </>
  );
}
