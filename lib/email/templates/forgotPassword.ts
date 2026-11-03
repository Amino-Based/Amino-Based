import { emailLayout, emailHeading, emailParagraph, emailButton, SITE_URL, ACCENT } from "../layout";
import { escapeHtml } from "../escapeHtml";

export function generateForgotPasswordEmail(token: string): { subject: string; html: string } {
  const subject = "Reset Your Password - Amino Based";
  const resetUrl = `${SITE_URL}/reset-password/${token}`;
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Password Reset Request")}
      ${emailParagraph("We received a request to reset the password for your account at Amino Based. If you made this request, click the button below to securely set a new password.", { mb: 32 })}
      ${emailButton({ label: "Reset Password", href: resetUrl })}
      <p style="margin:24px 0 12px 0;font-size:14px;color:#4A4A4A;line-height:1.6;">If the button above does not work, copy and paste the following link into your browser:</p>
      <p style="margin:0 0 32px 0;font-size:14px;color:${ACCENT};line-height:1.6;word-break:break-all;"><a href="${escapeHtml(resetUrl)}" style="color:${ACCENT};">${escapeHtml(resetUrl)}</a></p>
      ${emailParagraph("This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email and your account will remain secure.", { muted: true, mb: 0 })}
    `,
  });
  return { subject, html };
}
