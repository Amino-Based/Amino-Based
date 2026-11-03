import { emailLayout, emailHeading, emailParagraph, emailCallout, ADMIN_EMAIL } from "../layout";
import { escapeHtml } from "../escapeHtml";

const SECURITY_NOTE = emailCallout(
  `<p style="margin:0;font-size:15px;color:#2A2A2A;line-height:1.6;">If you didn't make this change, please reply to this email immediately${ADMIN_EMAIL ? ` or contact <a href="mailto:${escapeHtml(ADMIN_EMAIL)}" style="color:#2A2A2A;">${escapeHtml(ADMIN_EMAIL)}</a>` : ""}.</p>`
);

export function generatePasswordChangedEmail(): { subject: string; html: string } {
  const subject = "Your password has been changed";
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Password changed")}
      ${emailParagraph("The password on your Amino Based account was just changed. If this was you, no further action is needed.", { mb: 24 })}
      ${SECURITY_NOTE}
    `,
  });
  return { subject, html };
}

export function generateAdminPasswordChangedEmail(email: string): { subject: string; html: string } {
  const subject = "Security Alert: User Password Changed";
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Password changed")}
      ${emailParagraph(`The account <strong>${escapeHtml(email)}</strong> just changed its password via account settings.`, { mb: 0 })}
    `,
  });
  return { subject, html };
}

export function generateAdminPasswordResetEmail(email: string): { subject: string; html: string } {
  const subject = "Security Alert: User Password Reset";
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Password reset")}
      ${emailParagraph(`The account <strong>${escapeHtml(email)}</strong> just reset its password via the forgot-password flow.`, { mb: 0 })}
    `,
  });
  return { subject, html };
}

export function generateGoogleLinkedEmail(): { subject: string; html: string } {
  const subject = "A new sign-in method was added to your account";
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Google sign-in linked")}
      ${emailParagraph("Your Google account was just linked to your Amino Based account, so you can now sign in with either your password or Google.", { mb: 24 })}
      ${SECURITY_NOTE}
    `,
  });
  return { subject, html };
}
