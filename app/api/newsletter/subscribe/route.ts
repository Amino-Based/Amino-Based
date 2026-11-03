import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const payload = await getPayload({ config });

    const existing = await payload.find({
      collection: "newsletter-subscribers",
      where: { email: { equals: email.toLowerCase() } },
      overrideAccess: true,
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "newsletter-subscribers",
        data: { email: email.toLowerCase() },
        overrideAccess: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
