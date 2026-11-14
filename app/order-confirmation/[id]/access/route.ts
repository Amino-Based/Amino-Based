import { NextResponse, type NextRequest } from "next/server";

import { verifyOrderAccessToken } from "@/lib/orders/orderAccessToken";
import {
  buildOrderAccessCookieOptions,
  orderAccessCookieName,
  orderAccessCookiePath,
  remainingLifetimeSeconds,
} from "@/lib/orders/orderAccessCookie";

export const dynamic = "force-dynamic";

/**
 * Exchanges an emailed order-access token for an HttpOnly cookie, then
 * redirects to the clean receipt URL.
 *
 * A Server Component cannot set a cookie — per the Next docs, `.set` is only
 * available in a Server Function or a Route Handler — so the receipt page
 * itself cannot do this. Hence a Route Handler.
 *
 * Flow:
 *   GET /order-confirmation/<id>/access?t=<jwt>
 *     -> verify the token
 *     -> set the order-scoped cookie with the token's REMAINING lifetime
 *     -> 303 to /order-confirmation/<id>, with no token in the URL
 *
 * The token still appears in this one request, so it is still visible to
 * access logs and to anyone with the email. That is inherent to emailing a
 * link and is NOT eliminated here — what changes is that the token leaves the
 * URL immediately afterwards, so the receipt page itself, browser history from
 * that point on, the Referer header and any analytics only ever see the clean
 * address.
 *
 * Read-only: this grants permission to VIEW one order. The cookie must never
 * be accepted as authorisation for a mutation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("t");

  // Every destination below is built from the route's own id and a fixed
  // prefix, never from anything the caller supplied, so this route cannot be
  // turned into an open redirect.
  const safePath = orderAccessCookiePath(id);
  if (safePath === null) {
    return secured(NextResponse.redirect(new URL("/", request.nextUrl.origin), 303));
  }

  /**
   * The clean receipt URL, with no cookie attached. Every failure path returns
   * this, so an invalid, expired or wrong-order token can never be redirected
   * into an authorised state — it lands on the same address an anonymous
   * visitor would, and the page's own checks then decide.
   */
  const clean = () =>
    secured(NextResponse.redirect(new URL(safePath, request.nextUrl.origin), 303));

  if (!token) return clean();

  // Verified before anything is set. No token value is logged or echoed in any
  // response body.
  const payload = verifyOrderAccessToken(token);
  if (!payload || payload.orderId !== String(id)) return clean();

  const maxAgeSeconds = remainingLifetimeSeconds(payload.expiresAtSeconds);
  if (maxAgeSeconds === null || maxAgeSeconds <= 0) return clean();

  const cookieName = orderAccessCookieName(id);
  const cookieOptions = buildOrderAccessCookieOptions({ orderId: id, maxAgeSeconds });
  if (!cookieName || !cookieOptions) return clean();

  /**
   * `fb=1` is set only by the receipt page when it self-heals a legacy `?t=`
   * link, and it changes where this route lands on success.
   *
   * Without it the browser would have to prove it kept the cookie before the
   * token was discarded, and it cannot do that in a single hop: a browser that
   * blocks cookies would land on the clean URL with no cookie and no token, and
   * 404 — losing access it had before this migration. So for that one case the
   * token is handed back once, with `nc=1` to tell the page the exchange has
   * already run. The page then strips the token if the cookie did arrive, or
   * renders with it if it did not.
   *
   * This is not a weaker path: it is reached only after the token has fully
   * verified, and `fb` selects between two fixed destinations under this
   * order's own route rather than supplying one.
   */
  const wantsCookieFallback = request.nextUrl.searchParams.get("fb") === "1";
  const destinationPath = wantsCookieFallback
    ? `${safePath}?t=${encodeURIComponent(token)}&nc=1`
    : safePath;

  const response = secured(
    NextResponse.redirect(new URL(destinationPath, request.nextUrl.origin), 303),
  );
  response.cookies.set(cookieName, token, cookieOptions);
  return response;
}

/**
 * `no-store` keeps a token-bearing request out of any shared cache.
 *
 * `no-referrer` is set here as a fallback only. The value the client actually
 * receives comes from the `/order-confirmation/:id/access` entry in
 * next.config.mjs `headers()`, which is applied after this handler and
 * replaces the same key — so this line alone is not what makes the header
 * correct, and removing that config entry would silently drop it back to the
 * site-wide `strict-origin-when-cross-origin`. The tests assert the effective
 * value from the config for that reason.
 */
function secured(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
