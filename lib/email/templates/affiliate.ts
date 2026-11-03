import {
  emailLayout,
  emailHeading,
  emailParagraph,
  emailCard,
  emailCodeBox,
  emailRows,
  SITE_URL,
  ACCENT,
} from "../layout";
import { escapeHtml } from "../escapeHtml";

export function generateAffiliateWelcomeEmail(args: {
  displayName: string;
  referralSlug: string;
  couponCode: string;
}): { subject: string; html: string } {
  const subject = "Welcome to the Partner Program!";
  const referralLink = `${SITE_URL}/?ref=${encodeURIComponent(args.referralSlug)}`;
  const html = emailLayout({
    title: subject,
    heroImage: `${SITE_URL}/email/welcome-hero-amino.jpg`,
    bodyHtml: `
      ${emailHeading(`Hi ${escapeHtml(args.displayName)},`)}
      ${emailParagraph("Your application has been approved! We're thrilled to have you join Amino Based as an official partner. You now have a personal referral link and coupon code your audience can use for a discount, while you earn commission on every sale.", { mb: 24 })}
      ${emailCard(`
        <h3 style="margin:0 0 20px 0;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:${ACCENT};font-weight:700;">Your Partner Toolkit</h3>
        <p style="margin:0 0 8px 0;font-size:14px;font-weight:bold;color:#0A0A0A;">Your Unique Referral Link</p>
        <div style="margin-bottom:24px;">${emailCodeBox(escapeHtml(referralLink))}</div>
        <p style="margin:0 0 8px 0;font-size:14px;font-weight:bold;color:#0A0A0A;">Your Custom Discount Code</p>
        ${emailCodeBox(escapeHtml(args.couponCode))}
      `)}
      ${emailParagraph("Share your link or your code with your audience. Track clicks, conversions, and payouts anytime from your affiliate dashboard.")}
    `,
    button: { label: "View Your Dashboard", href: `${SITE_URL}/affiliates/dashboard` },
  });
  return { subject, html };
}

export function generateAdminAffiliateApplicationEmail(displayName: string): { subject: string; html: string } {
  const subject = `New Affiliate Registered: ${displayName}`;
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("New Affiliate Registered")}
      ${emailParagraph(`<strong>${escapeHtml(displayName)}</strong>'s affiliate application was just approved and their profile and coupon were auto-created.`, { mb: 0 })}
    `,
  });
  return { subject, html };
}

export function generateAdminAffiliateConversionEmail(args: {
  affiliateName: string;
  orderNumber: string;
  commissionAmount: number;
  voided?: boolean;
}): { subject: string; html: string } {
  const subject = `New Affiliate Sale! ${args.affiliateName} made a conversion`;
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("New Affiliate Sale")}
      ${emailParagraph(`<strong>${escapeHtml(args.affiliateName)}</strong> just referred order <strong>#${escapeHtml(args.orderNumber)}</strong>.`, { mb: 24 })}
      ${emailCard(
        emailRows([
          [
            "Commission",
            args.voided ? "$0.00 (voided — self-referral)" : `$${args.commissionAmount.toFixed(2)}`,
          ],
        ]).replace(/margin:0 0 16px 0/, "margin:0")
      , 0)}
    `,
  });
  return { subject, html };
}

export function generateAdminPayoutRequestEmail(args: {
  affiliateName: string;
  amount: number;
  payoutMethod: string;
  payoutDetails: string;
}): { subject: string; html: string } {
  const subject = `[Payout Request] $${args.amount.toFixed(2)} from ${args.affiliateName}`;
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Payout Request")}
      ${emailCard(
        emailRows([
          ["Affiliate", escapeHtml(args.affiliateName)],
          ["Amount", `$${args.amount.toFixed(2)}`],
          ["Method", escapeHtml(args.payoutMethod)],
          ["Details", escapeHtml(args.payoutDetails)],
        ])
      , 0)}
    `,
  });
  return { subject, html };
}
