import { escapeHtml } from "../escapeHtml";

/**
 * Internal notification sent to the support inbox when a visitor submits the contact form.
 *
 * Deliberately NOT built on `emailLayout`. The shared chrome is customer-facing: it injects a
 * 230 KB logo image, three links to the website, the "Research-grade peptides" tagline and the
 * full Research-Use-Only disclaimer. None of that belongs in a staff notification, and all of it
 * is scored by content filters. Those links are also where the `http://localhost:3000` URLs in
 * the real spam-filed message came from — `emailLayout` builds them from `SITE_URL`, which falls
 * back to localhost whenever NODE_ENV is not "production" (lib/siteUrl.ts).
 *
 * This template therefore contains NO URLs at all — no images, no links, no tracking. There is
 * nothing for the recipient to click, so there is nothing that can point at a development host.
 * Staff reply using the Reply-To header, which the caller sets to the submitter's address.
 *
 * Every other email generator is untouched and still uses `emailLayout`.
 */

const BRAND_NAME = "Amino Based";

/**
 * A mail header is a single line. A newline in attacker-controlled text has no business there,
 * and a very long subject gets truncated by clients anyway. Collapse whitespace and cap length.
 */
function sanitiseSubjectFragment(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 150);
}

const LABEL_STYLE =
  "margin:0 0 2px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#5A5A5A;font-weight:700;";
const VALUE_STYLE = "margin:0 0 16px 0;font-size:15px;color:#1A1A1A;word-break:break-word;";

function field(label: string, value: string): string {
  return `<p style="${LABEL_STYLE}">${escapeHtml(label)}</p>
          <p style="${VALUE_STYLE}">${escapeHtml(value)}</p>`;
}

export function generateContactFormEmail(args: {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}): { subject: string; html: string; text: string } {
  // Subject format preserved exactly as before, with newlines stripped out of the user portion.
  const rawSubject = args.subject ? sanitiseSubjectFragment(args.subject) : "";
  const subject = `[Contact Form] ${rawSubject || "New message"}`;

  const displayName = args.name?.trim() || "Not provided";
  const replyTarget = args.name?.trim() || args.email;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A1A1A;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
      <tr>
        <td align="left" style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
            <tr>
              <td style="padding-bottom:16px;border-bottom:1px solid #DDDDDD;">
                <p style="margin:0;font-size:13px;font-weight:700;color:#1A1A1A;">${escapeHtml(BRAND_NAME)}</p>
                <p style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#1A1A1A;">New contact form submission</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;">
                ${field("Name", displayName)}
                ${field("Email", args.email)}
                ${args.subject ? field("Subject", args.subject) : ""}
                <p style="${LABEL_STYLE}">Message</p>
                <p style="margin:0 0 20px 0;font-size:15px;color:#1A1A1A;line-height:1.6;white-space:pre-wrap;">${escapeHtml(
                  args.message
                )}</p>
                <p style="margin:0;padding-top:16px;border-top:1px solid #DDDDDD;font-size:13px;color:#5A5A5A;line-height:1.6;">
                  Reply to this email to respond to ${escapeHtml(replyTarget)} directly.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  // Plain-text alternative. Previously the adapter transmitted `text: ""` on every send, because
  // nothing in the codebase ever supplied one — an empty body part is a recognised spam signal.
  const text = [
    `${BRAND_NAME} - new contact form submission`,
    "",
    `Name:    ${displayName}`,
    `Email:   ${args.email}`,
    ...(args.subject ? [`Subject: ${args.subject}`] : []),
    "",
    "Message:",
    args.message,
    "",
    `Reply to this email to respond to ${replyTarget} directly.`,
  ].join("\n");

  return { subject, html, text };
}
