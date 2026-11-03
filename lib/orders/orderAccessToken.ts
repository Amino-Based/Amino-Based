import jwt, { type SignOptions } from "jsonwebtoken";

export type OrderAccessPayload = { orderId: string };

const SECRET = process.env.PAYLOAD_SECRET || "";

/**
 * Audience claim. PAYLOAD_SECRET is shared with lib/email/militaryActionToken.ts, so without a
 * distinct `aud` the two token types are interchangeable at the signature layer: a military
 * action token would verify here and vice versa. Both happened to fail closed afterwards on a
 * missing field, but that was accidental rather than structural — this makes it explicit.
 */
const AUDIENCE = "order-access";

/** jwt.sign with a string secret defaults to HS256, so verification pins that one algorithm. */
const ALGORITHM = "HS256" as const;

/** Receipt links sent by email need to keep working for a while; a post-checkout redirect does not. */
export const ORDER_TOKEN_TTL_REDIRECT: SignOptions["expiresIn"] = "7d";
export const ORDER_TOKEN_TTL_EMAIL: SignOptions["expiresIn"] = "30d";

/**
 * Capability token proving the bearer may view one specific order.
 *
 * Order ids are sequential Postgres serials, so /order-confirmation/<id> on its own was
 * enumerable: anyone could walk 1,2,3... and read every customer's name, shipping address and
 * order contents. Guests have no session to check, so the receipt link carries this token.
 *
 * KNOWN LIMITATION — the token travels in a URL query string, so it is recorded in server and
 * proxy access logs and in browser history, and there is no revocation list. Referrer-Policy
 * (next.config.mjs) is strict-origin-when-cross-origin, which stops it leaking cross-origin via
 * Referer. Migration path, in increasing order of effort:
 *   1. (done) Split the TTLs so the redirect token expires well before the email token.
 *   2. Set a short-lived httpOnly cookie at order creation and accept either cookie or token,
 *      keeping ?t= only for the email link.
 *   3. Store a single-use nonce per order and mark it consumed on first view.
 * Steps 2 and 3 change the checkout and receipt flows, so they were deliberately not attempted
 * in a batch that cannot be runtime-tested.
 */
export function signOrderAccessToken(
  orderId: string | number,
  expiresIn: SignOptions["expiresIn"] = ORDER_TOKEN_TTL_REDIRECT
): string {
  return jwt.sign({ orderId: String(orderId) }, SECRET, {
    algorithm: ALGORITHM,
    audience: AUDIENCE,
    expiresIn,
  });
}

/**
 * Returns the payload only when the signature, algorithm, audience and expiry all check out and
 * the decoded body actually has the expected shape. Anything else — malformed, wrong audience,
 * wrong algorithm, expired, or a valid token of some other type — yields null.
 */
export function verifyOrderAccessToken(token: string): OrderAccessPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET, {
      algorithms: [ALGORITHM],
      audience: AUDIENCE,
    });
    // jwt.verify can return a bare string for a non-JSON payload, so never trust a cast here.
    if (typeof decoded !== "object" || decoded === null) return null;
    const orderId = (decoded as Record<string, unknown>).orderId;
    if (typeof orderId !== "string" || orderId.length === 0) return null;
    return { orderId };
  } catch {
    return null;
  }
}

/** True only when `token` is a valid, unexpired order-access token issued for exactly this order. */
export function tokenGrantsOrderAccess(
  token: string | undefined | null,
  orderId: string | number
): boolean {
  if (!token) return false;
  const payload = verifyOrderAccessToken(token);
  return !!payload && payload.orderId === String(orderId);
}
