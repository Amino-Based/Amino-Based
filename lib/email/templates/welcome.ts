import { emailLayout, emailHeading, emailParagraph, emailCard, emailButton, SITE_URL, ACCENT } from "../layout";
import { escapeHtml } from "../escapeHtml";

const benefit = (title: string, text: string, last = false) => `
  <tr>
    <td style="padding-bottom:${last ? 0 : 16}px;padding-left:5px;vertical-align:top;width:24px;">
      <div style="background-color:${ACCENT};color:#ffffff;width:18px;height:18px;border-radius:50%;text-align:center;line-height:18px;font-size:11px;font-weight:bold;">&#10003;</div>
    </td>
    <td style="padding-bottom:${last ? 0 : 16}px;vertical-align:top;">
      <span style="font-size:15px;color:#2A2A2A;font-weight:500;">${title}</span>
      <p style="margin:4px 0 0 0;font-size:13px;color:#6A6A6A;">${text}</p>
    </td>
  </tr>`;

export function generateWelcomeEmail(firstName: string): { subject: string; html: string } {
  const subject = "Welcome to Amino Based!";
  const html = emailLayout({
    title: subject,
    heroImage: `${SITE_URL}/email/welcome-hero-amino.jpg`,
    bodyHtml: `
      ${emailHeading(`Welcome to the family${firstName ? `, ${escapeHtml(firstName)}` : ""}!`)}
      ${emailParagraph(
        "Thank you for creating an account with us. We're thrilled to have you join a community committed to high-quality, research-grade peptides backed by third-party testing.",
        { mb: 28 }
      )}
      ${emailCard(`
        <h3 style="margin:0 0 20px 0;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:${ACCENT};font-weight:700;">With your new account, you can:</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${benefit("Speed through checkout", "Save your details for lightning-fast orders.")}
          ${benefit("Track your research", "Easily view order history and shipping status.")}
          ${benefit("Review every batch", "Access third-party Certificates of Analysis for our products.", true)}
        </table>`)}
      <p style="margin:0 0 32px 0;font-size:16px;color:#4A4A4A;line-height:1.6;text-align:center;">Ready to explore our latest batches? Head over to the shop.</p>
      ${emailButton({ label: "Shop Peptides", href: `${SITE_URL}/shop` })}
      ${emailButton({ label: "Visit Site", href: SITE_URL }, { variant: "outline" })}
    `,
  });
  return { subject, html };
}
