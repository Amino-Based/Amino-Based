import { ORDER_TOKEN_TTL_REDIRECT_SECONDS } from "@/lib/orders/orderAccessToken";

/**
 * HttpOnly cookie carrying the order-access capability, so the token no longer
 * has to travel in the URL.
 *
 * Why this exists: the same signed JWT used to arrive as `?t=` on
 * /order-confirmation/<id>. A URL is recorded in browser history, in server and
 * proxy access logs, in the Referer header, and — the case that forced this —
 * by analytics. A session recorder captures the page URL, and masking the DOM
 * does nothing about that. Moving the token into an HttpOnly cookie removes it
 * from all of those at once, and puts it out of reach of client-side
 * JavaScript, which a URL token can never be.
 *
 * Scope and lifetime are deliberately narrow:
 *   - one cookie per order, so a cookie for order 41 cannot open order 42;
 *   - path-scoped to that order's route, so it is not attached to unrelated
 *     requests;
 *   - never outliving the JWT it was issued for.
 *
 * READ-ONLY CAPABILITY. This cookie authorises viewing one order's receipt and
 * nothing else. It must never be accepted as authorisation for a mutation:
 * it is sent automatically by the browser, so treating it as proof of intent
 * would create a CSRF surface the current read-only use does not have.
 */

/** Shared prefix, so every order cookie is recognisable and greppable. */
export const ORDER_ACCESS_COOKIE_PREFIX = "order_access_";

/**
 * Order ids are Postgres serials, so a valid id is digits. The id is
 * interpolated into a cookie NAME and a cookie PATH, both of which have their
 * own grammar, so it is validated rather than trusted: a value containing
 * `;`, `=`, whitespace or `/` could otherwise inject cookie attributes or
 * widen the path. Anything that is not a plain positive integer is refused.
 */
export function isValidOrderId(orderId: unknown): boolean {
  if (typeof orderId === "number") {
    return Number.isInteger(orderId) && orderId > 0 && Number.isSafeInteger(orderId);
  }
  if (typeof orderId !== "string") return false;
  return /^[1-9][0-9]{0,18}$/.test(orderId);
}

/** `order_access_<id>`, or null when the id is not a valid order id. */
export function orderAccessCookieName(orderId: string | number): string | null {
  if (!isValidOrderId(orderId)) return null;
  return `${ORDER_ACCESS_COOKIE_PREFIX}${String(orderId)}`;
}

/**
 * Path scoped to the one route that may read it. The browser then sends it only
 * for that order's confirmation page, not across the whole site.
 */
export function orderAccessCookiePath(orderId: string | number): string | null {
  if (!isValidOrderId(orderId)) return null;
  return `/order-confirmation/${String(orderId)}`;
}

/**
 * Seconds of life left on a verified token, clamped to >= 0.
 *
 * Returns null when the token carried no usable `exp`, which the caller treats
 * as "do not set a cookie" rather than guessing a duration.
 */
export function remainingLifetimeSeconds(
  expiresAtSeconds: number | null | undefined,
  nowMs: number = Date.now(),
): number | null {
  if (typeof expiresAtSeconds !== "number" || !Number.isFinite(expiresAtSeconds)) return null;
  const remaining = Math.floor(expiresAtSeconds - nowMs / 1000);
  return remaining > 0 ? remaining : 0;
}

export type OrderAccessCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
};

/**
 * Cookie attributes for one order.
 *
 * `sameSite: "lax"` is required, not a default. The Stripe redirect flow
 * returns from stripe.com as a top-level cross-site GET, and `lax` is sent on
 * exactly that while `strict` is not — `strict` would silently break the
 * receipt page for every 3DS payment.
 *
 * `secure` follows NODE_ENV so local http development still works; production
 * is https, where the flag is set.
 *
 * `maxAge` is capped by the caller's value and can never exceed it, so a cookie
 * cannot outlive the JWT inside it.
 */
export function buildOrderAccessCookieOptions(opts: {
  orderId: string | number;
  maxAgeSeconds: number;
  isProduction?: boolean;
}): OrderAccessCookieOptions | null {
  const path = orderAccessCookiePath(opts.orderId);
  if (path === null) return null;
  if (!Number.isFinite(opts.maxAgeSeconds) || opts.maxAgeSeconds <= 0) return null;

  const isProduction = opts.isProduction ?? process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path,
    maxAge: Math.floor(opts.maxAgeSeconds),
  };
}

/**
 * Lifetime for the cookie set at checkout.
 *
 * Capped at the redirect token's own TTL: the post-checkout cookie must not
 * grant longer access than the token it replaces.
 */
export function checkoutCookieMaxAgeSeconds(): number {
  return ORDER_TOKEN_TTL_REDIRECT_SECONDS;
}
