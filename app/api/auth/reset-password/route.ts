import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateAdminPasswordResetEmail } from "@/lib/email/templates/passwordSecurity";
import { ADMIN_EMAIL } from "@/lib/email/layout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body ?? {};

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    const result = await payload.resetPassword({
      collection: "users",
      data: { token, password },
      overrideAccess: true,
    });

    if (!result?.user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const adminAlert = generateAdminPasswordResetEmail(String(result.user.email));
    void sendTrackedEmail({ to: ADMIN_EMAIL, subject: adminAlert.subject, html: adminAlert.html });

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 }
    );
  }
}
