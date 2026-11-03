import { getPayload } from "payload";
import config from "@payload-config";

// Optional operational copy of every outbound email. Deliberately BCC, never CC: a CC address is
// visible to the customer on their own receipt. Unset means no copy is sent at all. Never point
// this at an address belonging to another business.
const ADMIN_BCC_EMAIL = process.env.ADMIN_BCC_EMAIL;

export type TrackedEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  /**
   * Optional plain-text alternative. Optional on purpose: every existing caller omits it and
   * keeps working unchanged. When absent the Resend adapter transmits `text: ""`, which is an
   * empty MIME body part and a recognised spam signal — so supply one for any new template.
   */
  text?: string;
  from?: string;
  replyTo?: string;
  bcc?: string | string[];
  attachments?: Array<{ filename: string; content: Buffer | string }>;
};

/**
 * Every outbound transactional email should go through here rather than calling
 * payload.sendEmail() directly — it guarantees a row in the `email-logs` collection for every
 * attempt so support/admin can audit what actually went out.
 *
 * Three outcomes are recorded. A delivered send logs status "sent". A provider or network failure
 * logs "failed" with the error. An attempt with no usable recipient also logs "failed", with
 * `skipped: true` and a reason in the body — the collection's status field only allows
 * sent/failed (see collections/EmailLogs.ts), so a skip is recorded as a non-delivery with an
 * explicit reason rather than by inventing a third enum value that the database would reject.
 */
export async function sendTrackedEmail(args: TrackedEmailArgs): Promise<{ success: boolean }> {
  const payload = await getPayload({ config });

  // Drop blank/undefined entries: ADMIN_EMAIL is env-only with no fallback, so an unconfigured
  // SUPPORT_EMAIL arrives here as an empty recipient.
  const recipients = (Array.isArray(args.to) ? args.to : [args.to]).filter(
    (address): address is string => typeof address === "string" && address.trim().length > 0
  );
  const to = recipients.join(", ");

  if (recipients.length === 0) {
    // Must still leave evidence. Security-sensitive notices (Stripe disputes, password-reset
    // alerts) route to ADMIN_EMAIL, and silently dropping them would erase the only record
    // that the event happened at all.
    const reason =
      "No usable recipient. SUPPORT_EMAIL is probably unset, so ADMIN_EMAIL resolved to an empty string.";
    console.warn(`sendTrackedEmail: skipping "${args.subject}" — ${reason}`);
    await payload
      .create({
        collection: "email-logs",
        data: {
          to: "(none configured)",
          subject: args.subject,
          body: { html: args.html, skipped: true, reason },
          sentAt: new Date().toISOString(),
          status: "failed",
        },
        overrideAccess: true,
      })
      .catch((err) => console.error("Failed to write email-logs entry:", err));
    return { success: false };
  }

  // Never auto-BCC an email carrying attachments. The only such flow is the military-discount
  // review (app/military-discount/actions.ts), whose attachment is a government ID photo; the
  // reviewing admin is already the primary recipient, so an extra blind copy would spread that
  // document to a second inbox with no approved policy for holding it. A caller-supplied bcc is
  // an explicit decision and is still honoured.
  const hasAttachments = !!args.attachments && args.attachments.length > 0;
  const callerBcc = (Array.isArray(args.bcc) ? args.bcc : args.bcc ? [args.bcc] : []).filter(Boolean);
  const mergedBcc =
    ADMIN_BCC_EMAIL && !hasAttachments ? [...callerBcc, ADMIN_BCC_EMAIL] : callerBcc;

  try {
    // Connection-level failures (e.g. ECONNRESET during TLS to api.resend.com) happen before the
    // request reaches Resend, so retrying is safe and won't double-send.
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; ; attempt++) {
      try {
        await payload.sendEmail({
          to: recipients,
          from: args.from,
          replyTo: args.replyTo,
          bcc: mergedBcc.length > 0 ? mergedBcc : undefined,
          subject: args.subject,
          html: args.html,
          text: args.text,
          attachments: args.attachments,
        });
        break;
      } catch (err) {
        const isNetworkError = err instanceof TypeError && /fetch failed/i.test(err.message);
        if (!isNetworkError || attempt >= MAX_ATTEMPTS) throw err;
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }

    await payload
      .create({
        collection: "email-logs",
        data: {
          to,
          subject: args.subject,
          body: { html: args.html },
          sentAt: new Date().toISOString(),
          status: "sent",
        },
        overrideAccess: true,
      })
      .catch((err) => console.error("Failed to write email-logs entry:", err));

    return { success: true };
  } catch (err) {
    console.error(`Failed to send email "${args.subject}" to ${to}:`, err);

    await payload
      .create({
        collection: "email-logs",
        data: {
          to,
          subject: args.subject,
          body: { html: args.html, error: err instanceof Error ? err.message : String(err) },
          sentAt: new Date().toISOString(),
          status: "failed",
        },
        overrideAccess: true,
      })
      .catch((logErr) => console.error("Failed to write email-logs entry:", logErr));

    return { success: false };
  }
}
