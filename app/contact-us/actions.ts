"use server";

import { getPayload } from "payload";
import { headers } from "next/headers";
import config from "@payload-config";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateContactFormEmail } from "@/lib/email/templates/contactForm";
import { ADMIN_EMAIL } from "@/lib/email/layout";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

// ---------------------------------------------------------------------------
// Server-side validation
//
// Both callers — the homepage ContactSection and the /contact-us ContactForm —
// mark fields `required` and use type="email", but that is browser-side only
// and a direct POST skips all of it. Every rule is therefore re-checked here.
// ---------------------------------------------------------------------------
const MAX_NAME = 200;
const MAX_EMAIL = 254; // RFC 5321 maximum reverse-path length
const MAX_SUBJECT = 300;
const MAX_ORDER_NUMBER = 64;
const MAX_MESSAGE = 5000;
// Deliberately permissive: a shape check, not an RFC 5322 parser. Rejecting an
// unusual-but-valid address would lose a real enquiry, which is worse than
// accepting a syntactically odd one.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------------------------------------------------------------------------
// Abuse controls
//
// This action is reachable from two public forms with no session and no
// captcha, and every accepted submission sends mail. Two independent layers,
// because neither is sufficient alone:
//
//   1. Per-IP, in-memory. Catches one source hammering the form with varying
//      addresses, which layer 2 cannot see. Resets on instance restart and is
//      not shared between instances, so it is a speed bump, not a guarantee.
//   2. Per-email, enforced against the database. Survives restarts and is
//      shared across instances, but the address is attacker-supplied.
//
// Layer 2 queries the existing `contact-messages.createdAt` field, so there is
// no schema change. It mirrors the DB-backed rule already proven in
// app/military-discount/actions.ts.
// ---------------------------------------------------------------------------
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX_IN_WINDOW = 5;
const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_MAX_IN_WINDOW = 3;
const IP_MAP_SOFT_CAP = 5000;

const ipHits = new Map<string, number[]>();

function ipRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);

  if (recent.length >= IP_MAX_IN_WINDOW) {
    ipHits.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipHits.set(ip, recent);

  // Keep the map bounded so a long-lived instance cannot grow it without limit.
  if (ipHits.size > IP_MAP_SOFT_CAP) {
    for (const [key, times] of ipHits) {
      if (times.every((t) => now - t >= IP_WINDOW_MS)) ipHits.delete(key);
    }
  }

  return false;
}

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  // Left-most entry is the original client; everything after it is a proxy.
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

const TOO_MANY =
  "You have sent several messages recently. Please wait a few minutes before sending another.";

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!email) {
    return { success: false, error: "Please provide your email address." };
  }
  if (!message) {
    return { success: false, error: "Please enter a message." };
  }
  if (email.length > MAX_EMAIL || !EMAIL_SHAPE.test(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }
  if (message.length > MAX_MESSAGE) {
    return {
      success: false,
      error: `Please shorten your message to ${MAX_MESSAGE} characters or fewer.`,
    };
  }
  if (
    name.length > MAX_NAME ||
    subject.length > MAX_SUBJECT ||
    orderNumber.length > MAX_ORDER_NUMBER
  ) {
    return { success: false, error: "One of the fields is too long. Please shorten it." };
  }

  // Checked after validation so a flood of malformed requests cannot consume a
  // legitimate visitor's quota on a shared IP.
  if (ipRateLimited(await getClientIp())) {
    return { success: false, error: TOO_MANY };
  }

  const formattedSubject = subject
    ? orderNumber
      ? `${subject} (Order #${orderNumber})`
      : subject
    : orderNumber
    ? `Order #${orderNumber}`
    : undefined;

  const formattedMessage = orderNumber
    ? `Order Number: ${orderNumber}\n\n${message}`
    : message;

  try {
    const payload = await getPayload({ config });

    // Per-email throttle. Matches the address exactly as stored; a sender
    // varying capitalisation is not caught here, but is caught by the per-IP
    // layer above.
    const emailWindowStart = new Date(Date.now() - EMAIL_WINDOW_MS).toISOString();
    const recentFromEmail = await payload.find({
      collection: "contact-messages",
      where: {
        and: [{ email: { equals: email } }, { createdAt: { greater_than: emailWindowStart } }],
      },
      limit: 1,
      overrideAccess: true,
    });
    if (recentFromEmail.totalDocs >= EMAIL_MAX_IN_WINDOW) {
      return { success: false, error: TOO_MANY };
    }

    await payload.create({
      collection: "contact-messages",
      data: {
        name: name || undefined,
        email,
        subject: formattedSubject,
        message: formattedMessage,
      },
      overrideAccess: true,
    });

    const adminNotice = generateContactFormEmail({
      name,
      email,
      subject: formattedSubject,
      message: formattedMessage,
    });

    // Awaited, not fire-and-forget. A `void`ed promise can be killed when the
    // serverless function is frozen right after the response, dropping the send
    // *and* its email-logs row.
    // sendTrackedEmail never throws: it resolves { success: false } and logs the
    // failure itself.
    const sent = await sendTrackedEmail({
      to: ADMIN_EMAIL,
      subject: adminNotice.subject,
      html: adminNotice.html,
      text: adminNotice.text,
      replyTo: email,
    });

    if (!sent.success) {
      // The submission itself is safe — it is already stored in contact-messages
      // above, so the visitor is not asked to resend. Record the notification
      // failure for support to pick up.
      // Deliberately does not log the message body: it is customer content and
      // is already persisted in the collection.
      console.error(
        `Contact form stored but notification email failed (subject: ${adminNotice.subject})`
      );
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to submit contact message:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
