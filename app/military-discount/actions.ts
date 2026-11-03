"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateMilitaryAdminEmail } from "@/lib/email/templates/militaryDiscount";
import { ADMIN_EMAIL, SITE_URL } from "@/lib/email/layout";
import { signMilitaryActionToken } from "@/lib/email/militaryActionToken";

export interface MilitaryDiscountFormState {
  success: boolean;
  error?: string;
}

// Server Action bodies are capped at 4mb (next.config.mjs) and Vercel rejects request bodies over
// ~4.5 MB, so anything bigger can't arrive anyway. The form shrinks photos before upload.
const MAX_PHOTO_BYTES = 3.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function submitMilitaryDiscountRequest(
  _prevState: MilitaryDiscountFormState,
  formData: FormData
): Promise<MilitaryDiscountFormState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const branch = String(formData.get("branch") || "").trim();
  const idPhoto = formData.get("idPhoto") as File | null;

  if (!fullName || !email || !branch) {
    return { success: false, error: "Please fill in all required fields." };
  }
  if (!idPhoto || idPhoto.size === 0) {
    return { success: false, error: "Please upload a photo of your military ID." };
  }
  if (idPhoto.size > MAX_PHOTO_BYTES) {
    return { success: false, error: "Your ID photo is too large (max 3.5MB)." };
  }
  if (idPhoto.type && !ALLOWED_TYPES.includes(idPhoto.type)) {
    return { success: false, error: "ID photo must be a JPEG, PNG, WEBP, or HEIC image." };
  }

  try {
    const payload = await getPayload({ config });

    // Authoritative "once per day" rule enforced against the database — a verified member
    // can request a fresh coupon again later, but the same email can't spam the review inbox.
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentRequests = await payload.find({
      collection: "military-discount-requests",
      where: {
        and: [{ email: { equals: email } }, { createdAt: { greater_than: oneDayAgo } }],
      },
      limit: 1,
      overrideAccess: true,
    });
    if (recentRequests.totalDocs > 0) {
      return {
        success: false,
        error: "You can only submit this form once per day. Please wait for a response to your previous request.",
      };
    }

    const request = await payload.create({
      collection: "military-discount-requests",
      data: { fullName, email, branch, status: "pending" },
      overrideAccess: true,
    });

    const approveToken = signMilitaryActionToken({ requestId: request.id, action: "approve" });
    const rejectToken = signMilitaryActionToken({ requestId: request.id, action: "reject" });

    const arrayBuffer = await idPhoto.arrayBuffer();
    const adminNotice = generateMilitaryAdminEmail({
      fullName,
      email,
      branch,
      approveUrl: `${SITE_URL}/api/military/action?token=${encodeURIComponent(approveToken)}`,
      rejectUrl: `${SITE_URL}/api/military/action?token=${encodeURIComponent(rejectToken)}`,
    });
    // Must be awaited: on serverless the function can be frozen right after returning,
    // which silently drops a fire-and-forget send.
    const sent = await sendTrackedEmail({
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: adminNotice.subject,
      html: adminNotice.html,
      attachments: [{ filename: idPhoto.name || "id-photo.jpg", content: Buffer.from(arrayBuffer) }],
    });

    if (!sent.success) {
      // Roll back so the once-per-day rule doesn't block a retry of a request nobody was notified about.
      await payload.delete({ collection: "military-discount-requests", id: request.id, overrideAccess: true });
      return { success: false, error: "We couldn't send your request. Please try again in a few minutes." };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to submit military discount request:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
