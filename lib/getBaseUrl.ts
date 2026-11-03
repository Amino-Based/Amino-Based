import { headers } from "next/headers";

/**
 * Best-effort absolute site origin, for building shareable links server-side.
 *
 * Tries the configured site URL first, then the incoming request's own host. Behind a proxy
 * (Vercel) the original host and scheme arrive as x-forwarded-* headers, so those are checked
 * before the raw Host header. Only when none of these yields an origin does it throw — at that
 * point there is genuinely no correct absolute URL to return, and emitting a wrong or relative
 * one would produce broken referral links rather than an obvious failure.
 */
export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    if (host) {
      const forwardedProto = headersList.get("x-forwarded-proto");
      const protocol = forwardedProto || (process.env.NODE_ENV === "development" ? "http" : "https");
      return `${protocol}://${host}`.replace(/\/+$/, "");
    }
  } catch {
    // headers() unavailable (e.g. outside a request context)
  }
  throw new Error(
    "Cannot determine the site origin: NEXT_PUBLIC_SITE_URL is unset and no request host was available."
  );
}
