import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getPayload } from "payload";
import config from "@payload-config";
import { verifyMilitaryActionToken } from "@/lib/email/militaryActionToken";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateMilitaryApprovedEmail, generateMilitaryRejectedEmail } from "@/lib/email/templates/militaryDiscount";

export const dynamic = "force-dynamic";

function resultPage(title: string, message: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8" /><title>${title}</title></head>
     <body style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:64px 16px;text-align:center;">
       <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;border:1px solid #ececec;">
         <h1 style="margin:0 0 12px 0;font-size:20px;color:#0a0a0a;">${title}</h1>
         <p style="margin:0;color:#4a4a4a;font-size:14px;">${message}</p>
       </div>
     </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}

function generateCouponCode(): string {
  // crypto.randomBytes rather than Math.random() — this code is also only usable by the
  // requester's own locked email (see lockedEmails below), but it shouldn't be guessable
  // as a second line of defense.
  const random = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `MIL-${random}`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return resultPage("Invalid Link", "This action link is missing a token.");

  const payload_ = verifyMilitaryActionToken(token);
  if (!payload_) return resultPage("Link Expired", "This action link is invalid or has expired.");

  const payload = await getPayload({ config });
  const doc = await payload
    .findByID({ collection: "military-discount-requests", id: payload_.requestId, overrideAccess: true })
    .catch(() => null);

  if (!doc) return resultPage("Not Found", "This military discount request no longer exists.");
  if (doc.status !== "pending") {
    return resultPage(
      "Already Reviewed",
      `This request was already marked as ${doc.status}. No action was taken.`
    );
  }

  if (payload_.action === "approve") {
    const couponCode = generateCouponCode();
    await payload.create({
      collection: "coupons",
      data: {
        code: couponCode,
        type: "percentage",
        value: 30,
        isActive: true,
        usageLimit: 1,
        lockedEmails: [{ email: doc.email }],
        applicableProductTypes: "all",
        appliesTo: "all",
      } as any,
      overrideAccess: true,
    });

    await payload.update({
      collection: "military-discount-requests",
      id: doc.id,
      data: { status: "approved", couponCode, reviewedAt: new Date().toISOString() },
      overrideAccess: true,
    });

    const approvedEmail = generateMilitaryApprovedEmail(couponCode);
    const sent = await sendTrackedEmail({ to: doc.email, subject: approvedEmail.subject, html: approvedEmail.html });

    if (!sent.success) {
      return resultPage(
        "Approved, but email failed",
        `Coupon ${couponCode} was created for ${doc.email}, but the email could not be sent. Please send it manually.`
      );
    }
    return resultPage("Request Approved", `A 30% discount code was generated and emailed to ${doc.email}.`);
  }

  await payload.update({
    collection: "military-discount-requests",
    id: doc.id,
    data: { status: "rejected", reviewedAt: new Date().toISOString() },
    overrideAccess: true,
  });

  const rejectedEmail = generateMilitaryRejectedEmail();
  await sendTrackedEmail({ to: doc.email, subject: rejectedEmail.subject, html: rejectedEmail.html });

  return resultPage("Request Rejected", `${doc.email} has been notified.`);
}
