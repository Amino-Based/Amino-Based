import { escapeHtml } from "./escapeHtml";
import { SITE_URL } from "@/lib/siteUrl";

const BRAND_NAME = "Amino Based";
const ACCENT = "#4f46e5"; // indigo-600, matches the site's accent color
// No fallback address: an unset SUPPORT_EMAIL previously routed new-user alerts, password-reset
// warnings and Stripe dispute notices to another company inbox. sendTrackedEmail skips delivery
// when there is no recipient rather than sending them anywhere unintended.
const ADMIN_EMAIL = process.env.SUPPORT_EMAIL ?? "";
// Email clients (Gmail/Outlook) don't render SVG, so the header uses a PNG export of the site logo.
const LOGO_URL = `${SITE_URL}/email/logo.png`;
// Only name a support address when one is actually configured — never hardcode a fallback.
const SUPPORT_CONTACT_SUFFIX = ADMIN_EMAIL
  ? ` or contact <a href="mailto:${escapeHtml(ADMIN_EMAIL)}" style="color:#8A8A8A;">${escapeHtml(ADMIN_EMAIL)}</a>.`
  : ".";

export type EmailButton = { label: string; href: string };

// ---------------------------------------------------------------------------
// Building blocks shared by every template, so all emails read as one system.
// ---------------------------------------------------------------------------

export const emailHeading = (text: string, color = "#0A0A0A") =>
  `<h2 style="margin:0 0 16px 0;font-size:24px;color:${color};font-weight:800;letter-spacing:-0.5px;">${text}</h2>`;

export const emailParagraph = (html: string, opts: { muted?: boolean; mb?: number } = {}) =>
  `<p style="margin:0 0 ${opts.mb ?? 16}px 0;font-size:${opts.muted ? 14 : 16}px;color:${opts.muted ? "#8A8A8A" : "#4A4A4A"};line-height:1.6;">${html}</p>`;

export const emailLabel = (text: string) =>
  `<p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#8A8A8A;font-weight:bold;">${text}</p>`;

/** Cream rounded card used for info blocks (details, toolkits, summaries). */
export const emailCard = (innerHtml: string, mb = 32) =>
  `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdfbf7;border-radius:12px;border:1px solid #e2ddd3;margin-bottom:${mb}px;">
    <tr><td style="padding:24px;">${innerHtml}</td></tr>
  </table>`;

/** Left-accented callout, for notes and explanations. */
export const emailCallout = (innerHtml: string, color = ACCENT) =>
  `<div style="background-color:#fdfbf7;border-left:4px solid ${color};padding:20px;border-radius:0 8px 8px 0;margin-bottom:24px;">${innerHtml}</div>`;

/** Dashed copy-me box for coupon codes, referral links, etc. */
export const emailCodeBox = (text: string, big = false) =>
  `<div style="background-color:#ffffff;padding:${big ? 24 : 12}px 16px;border-radius:8px;border:1px dashed ${ACCENT};font-family:monospace;font-size:${big ? 28 : 16}px;font-weight:bold;letter-spacing:${big ? 2 : 0}px;color:${ACCENT};word-break:break-all;text-align:center;">${text}</div>`;

/**
 * Full-width-on-mobile button. Background lives on the <td> and the anchor is display:block, so
 * its padding is absorbed inside the cell — an inline-block anchor with width:100% overflows by
 * its padding in mail clients (no border-box) and runs off the right edge on phones.
 */
export const emailButton = (
  { label, href }: EmailButton,
  opts: { variant?: "solid" | "outline"; color?: string } = {}
) => {
  const color = opts.color ?? ACCENT;
  const outline = opts.variant === "outline";
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:280px;">
        <tr>
          <td align="center" ${outline ? `style="border:2px solid ${color};border-radius:8px;"` : `bgcolor="${color}" style="background-color:${color};border-radius:8px;"`}>
            <a href="${escapeHtml(href)}" style="display:block;padding:${outline ? 14 : 16}px 20px;color:${outline ? color : "#ffffff"};text-decoration:none;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;font-size:14px;text-align:center;">${escapeHtml(label)}</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>`;
};

/** Label/value rows (admin notifications, details). Values must already be escaped. */
export const emailRows = (rows: Array<[string, string]>) =>
  rows
    .map(
      ([label, value]) => `${emailLabel(escapeHtml(label))}
      <p style="margin:0 0 16px 0;font-size:16px;color:#0A0A0A;font-weight:500;word-break:break-word;">${value}</p>`
    )
    .join("");

/**
 * Wraps email body HTML in the site's shared branded chrome: black logo header, optional hero
 * image, content, signature footer and the research-use disclaimer. Every generator in
 * lib/email/templates builds on this.
 */
export function emailLayout(opts: {
  title: string;
  bodyHtml: string;
  button?: EmailButton;
  heroImage?: string | null;
}): string {
  const { title, bodyHtml, button, heroImage } = opts;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#fdfbf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fdfbf7;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e2ddd3;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background-color:#000000;padding:32px 40px;text-align:center;">
                <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
                  <img src="${LOGO_URL}" alt="${escapeHtml(BRAND_NAME)}" height="64" style="height:64px;width:auto;max-width:100%;display:block;margin:0 auto;" />
                </a>
              </td>
            </tr>
            ${
              heroImage
                ? `<tr>
              <td style="padding:0;background-color:#000000;">
                <img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title)}" width="600" style="width:100%;height:auto;display:block;border-bottom:4px solid ${ACCENT};" />
              </td>
            </tr>`
                : ""
            }

            <!-- Content -->
            <tr>
              <td style="padding:40px 30px;color:#4A4A4A;font-size:16px;line-height:1.6;">
                ${bodyHtml}
                ${button ? `<div style="margin-top:28px;">${emailButton(button)}</div>` : ""}
              </td>
            </tr>

            <!-- Signature & Footer -->
            <tr>
              <td style="background-color:#fdfbf7;padding:32px 40px;text-align:center;border-top:1px solid #E8E2D5;">
                <p style="margin:0 0 8px 0;color:${ACCENT};font-weight:bold;font-size:16px;">
                  <a href="${SITE_URL}" target="_blank" style="color:${ACCENT};text-decoration:none;">${escapeHtml(BRAND_NAME)}</a>
                </p>
                <p style="margin:0 0 16px 0;color:#8A8A8A;font-size:13px;">Research-grade peptides. Dedicated to purity.</p>
                <p style="margin:0 0 16px 0;color:#8A8A8A;font-size:12px;">Need help? Reply to this email${SUPPORT_CONTACT_SUFFIX}</p>
                <p style="margin:0 0 16px 0;color:#A0A0A0;font-size:11px;line-height:1.6;text-align:left;">
                  <strong>Research Use Only:</strong> Products sold by ${escapeHtml(BRAND_NAME)} are intended
                  strictly for laboratory and in-vitro research use by qualified professionals. They are not
                  drugs, dietary supplements, or cosmetics, and are not intended for human or animal
                  consumption, diagnostic, or therapeutic use of any kind.
                </p>
                <p style="margin:0;color:#A0A0A0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">&copy; ${new Date().getFullYear()} <a href="${SITE_URL}" target="_blank" style="color:inherit;text-decoration:none;">${escapeHtml(BRAND_NAME)}</a>. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export { SITE_URL, BRAND_NAME, ACCENT, ADMIN_EMAIL };
