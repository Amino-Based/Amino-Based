import {
  emailLayout,
  emailHeading,
  emailParagraph,
  emailCard,
  emailCallout,
  emailCodeBox,
  emailRows,
  emailButton,
  SITE_URL,
} from "../layout";
import { escapeHtml } from "../escapeHtml";

export function generateMilitaryAdminEmail(args: {
  fullName: string;
  email: string;
  branch: string;
  approveUrl: string;
  rejectUrl: string;
}): { subject: string; html: string } {
  const subject = `[Military Discount] Verification Request: ${args.fullName}`;
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Applicant Details")}
      ${emailParagraph("A new military/first-responder discount verification request has been received. Please review the attached ID photo — it is not stored anywhere else. The links below are valid for 7 days.", { mb: 24 })}
      ${emailCard(
        emailRows([
          ["Name", escapeHtml(args.fullName)],
          ["Email", escapeHtml(args.email)],
          ["Service Branch", `<span style="text-transform:capitalize;">${escapeHtml(args.branch)}</span>`],
        ])
      )}
      ${emailButton({ label: "Approve Request", href: args.approveUrl }, { color: "#10b981" })}
      ${emailButton({ label: "Deny Request", href: args.rejectUrl }, { variant: "outline", color: "#ef4444" })}
    `,
  });
  return { subject, html };
}

export function generateMilitaryApprovedEmail(couponCode: string): { subject: string; html: string } {
  const subject = "Military Discount Verified - Here is your code!";
  const html = emailLayout({
    title: subject,
    heroImage: `${SITE_URL}/email/military-hero.jpg`,
    bodyHtml: `
      ${emailHeading("Thank you for your service!")}
      ${emailParagraph("Your military ID has been successfully verified by our team. We deeply appreciate your service.")}
      ${emailParagraph("As a token of our gratitude, here is your unique 30% off discount code:", { mb: 24 })}
      ${emailCodeBox(escapeHtml(couponCode), true)}
      <p style="margin:16px 0 32px 0;font-size:13px;color:#8A8A8A;font-style:italic;text-align:center;">Note: This coupon is locked to your email address and cannot be shared.</p>
      ${emailButton({ label: "Shop Now", href: `${SITE_URL}/shop` })}
    `,
  });
  return { subject, html };
}

export function generateMilitaryRejectedEmail(): { subject: string; html: string } {
  const subject = "Update on your Military Discount Request";
  const html = emailLayout({
    title: subject,
    bodyHtml: `
      ${emailHeading("Verification Update")}
      ${emailParagraph("We recently received your request for our military discount program.")}
      ${emailParagraph("Unfortunately, we were unable to clearly verify the ID document you provided, and your request could not be approved at this time.", { mb: 24 })}
      ${emailCallout(`<p style="margin:0;font-size:15px;color:#2A2A2A;line-height:1.6;">If you believe this was an error, please try submitting a clearer photo of your ID on our website, or reply directly to this email to speak with our support team.</p>`)}
      <p style="margin:0;font-size:16px;color:#4A4A4A;line-height:1.6;font-weight:600;">Best regards,<br />The Amino Based Team</p>
    `,
  });
  return { subject, html };
}
