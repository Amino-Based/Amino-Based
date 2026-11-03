import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateStripeDisputeEmail } from "@/lib/email/templates/stripeDispute";
import { ADMIN_EMAIL } from "@/lib/email/layout";

export const dynamic = "force-dynamic";

async function updateOrderFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
  data: Record<string, unknown>
) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  const payload = await getPayload({ config });
  const numericId = Number(orderId);

  try {
    await payload.update({
      collection: "orders",
      id: Number.isNaN(numericId) ? orderId : numericId,
      data: data as any,
      overrideAccess: true,
    });
  } catch (err) {
    // The order is already in a final state (e.g. cancelled, then a late webhook arrives).
    // Acknowledge instead of failing, otherwise Stripe retries the event for days.
    if (err instanceof Error && /Invalid (Status|Payment Status) change/.test(err.message)) {
      console.warn(`Stripe webhook ignored for order ${orderId}: ${err.message}`);
      return;
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = new Stripe(secretKey);

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    if (!webhookSecret || !signature) {
      throw new Error("Missing Stripe webhook secret or signature.");
    }
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await updateOrderFromPaymentIntent(paymentIntent, {
          paymentStatus: "captured",
          status: "paid",
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await updateOrderFromPaymentIntent(paymentIntent, {
          status: "cancelled",
        });
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          await updateOrderFromPaymentIntent(paymentIntent, {
            status: "refunded",
            paymentStatus: "refunded",
          });
        }
        break;
      }
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const disputeEmail = generateStripeDisputeEmail({
          chargeId: typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id,
          amount: dispute.amount / 100,
          reason: dispute.reason,
        });
        void sendTrackedEmail({ to: ADMIN_EMAIL, subject: disputeEmail.subject, html: disputeEmail.html });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler failed:", err);
    // Return 500 so Stripe retries the event.
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
