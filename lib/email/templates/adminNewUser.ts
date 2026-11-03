import { emailLayout, emailHeading, emailCard, emailRows } from "../layout";
import { escapeHtml } from "../escapeHtml";

export function generateAdminNewUserEmail(args: {
  firstName?: string;
  lastName?: string;
  email: string;
  authProvider?: string;
}): { subject: string; html: string } {
  const name = [args.firstName, args.lastName].filter(Boolean).join(" ") || "(no name provided)";
  const subject = `New User Registration: ${name}`;
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("New account created")}
      ${emailCard(
        emailRows([
          ["Name", escapeHtml(name)],
          ["Email", escapeHtml(args.email)],
          ["Sign-up method", escapeHtml(args.authProvider || "credentials")],
        ])
      , 0)}
    `,
  });
  return { subject, html };
}
