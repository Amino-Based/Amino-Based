import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body ?? {};

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const payload = await getPayload({ config });

    // Always resolve the same way whether or not the account exists,
    // so this endpoint can't be used to enumerate registered emails.
    try {
      await payload.forgotPassword({
        collection: "users",
        data: { email },
        disableEmail: false,
      });
    } catch (innerError) {
      console.error("forgotPassword error (suppressed from client):", innerError);
    }

    return NextResponse.json({
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process request. Please try again." },
      { status: 500 }
    );
  }
}
