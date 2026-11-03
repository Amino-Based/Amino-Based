import { emailLayout, emailHeading, emailParagraph, emailCard, emailRows } from "../layout";
import { escapeHtml } from "../escapeHtml";

export function generateStripeDisputeEmail(args: {
  chargeId: string;
  amount: number;
  reason?: string;
}): { subject: string; html: string } {
  const subject = `⚠️ Stripe dispute opened — charge ${args.chargeId}`;
  const rows: Array<[string, string]> = [
    ["Charge", escapeHtml(args.chargeId)],
    ["Amount", `$${args.amount.toFixed(2)}`],
  ];
  if (args.reason) rows.push(["Reason", escapeHtml(args.reason)]);
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("A chargeback/dispute was opened", "#B91C1C")}
      ${emailCard(emailRows(rows), 24)}
      ${emailParagraph("Review and respond to this dispute in the Stripe Dashboard before the deadline.", { mb: 0 })}
    `,
    button: { label: "Open Stripe Dashboard", href: "https://dashboard.stripe.com/disputes" },
  });
  return { subject, html };
}
