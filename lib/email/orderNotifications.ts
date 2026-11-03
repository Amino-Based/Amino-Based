import type { Payload } from "payload";
import { sendTrackedEmail } from "./sendTrackedEmail";
import { generateOrderEmail, type OrderEmailNotice } from "./templates/orderInvoice";
import { ADMIN_EMAIL } from "./layout";

const MANUAL_PAYMENT_METHODS = new Set(["zelle", "venmo", "cashapp", "amex", "circoflows", "stripe_link"]);

async function resolveRecipientEmail(doc: any, payload: Payload): Promise<string | null> {
  if (doc.guestEmail) return doc.guestEmail;
  const ownerId = typeof doc.owner === "object" ? doc.owner?.id : doc.owner;
  if (!ownerId) return null;
  const user = await payload.findByID({ collection: "users", id: ownerId, overrideAccess: true }).catch(() => null);
  return user?.email ?? null;
}

async function sendOrderNotice(doc: any, payload: Payload, notice: OrderEmailNotice, bccAdmin = false) {
  const to = await resolveRecipientEmail(doc, payload);
  if (!to) return;
  const { subject, html } = generateOrderEmail(doc, notice, to);
  await sendTrackedEmail({ to, subject, html, bcc: bccAdmin ? ADMIN_EMAIL : undefined });
}

/**
 * Central order-lifecycle email dispatcher, wired as an afterChange hook on the Orders
 * collection. Fires the customer-facing invoice/status emails at every meaningful
 * transition — new manual-payment order, Stripe payment captured, refunded, cancelled,
 * shipped (admin sets sendTrackingEmail), and ad-hoc admin notes to the customer.
 */
export async function handleOrderChangeEmails(args: {
  doc: any;
  previousDoc?: any;
  operation: "create" | "update";
  payload: Payload;
}): Promise<void> {
  const { doc, previousDoc, operation, payload } = args;

  // New order placed via a manual/no-webhook payment method — invoice immediately,
  // since there's no later "payment captured" transition to hang the email on.
  if (operation === "create" && MANUAL_PAYMENT_METHODS.has(doc.paymentMethod)) {
    await sendOrderNotice(doc, payload, { kind: "confirmation" }, true);
    return;
  }

  if (operation !== "update" || !previousDoc) return;

  // Stripe payment just captured (via client-side confirm or the webhook, whichever lands first).
  if (previousDoc.paymentStatus !== "captured" && doc.paymentStatus === "captured") {
    await sendOrderNotice(doc, payload, { kind: "confirmation" }, true);
  }

  if (previousDoc.status !== "refunded" && doc.status === "refunded") {
    await sendOrderNotice(doc, payload, { kind: "refunded" });
  }

  if (previousDoc.status !== "cancelled" && doc.status === "cancelled") {
    const wasEverPaid = previousDoc.paymentStatus === "captured" || previousDoc.paymentStatus === "authorized";
    await sendOrderNotice(doc, payload, { kind: wasEverPaid ? "cancelled" : "payment_failed" });
  }

  // Admin checked "Dispatched" + filled a tracking link — send once, then reset the flag.
  if (doc.sendTrackingEmail && !previousDoc.sendTrackingEmail) {
    await sendOrderNotice(doc, payload, { kind: "shipped", trackingLink: doc.trackingLink });
    await payload
      .update({
        collection: "orders",
        id: doc.id,
        data: { sendTrackingEmail: false },
        overrideAccess: true,
      })
      .catch((err) => console.error("Failed to reset sendTrackingEmail flag:", err));
  }

  // Any newly-added "message to customer" order note that hasn't been emailed yet.
  const notes: any[] = Array.isArray(doc.notes) ? doc.notes : [];
  const pendingNoteIndexes = notes
    .map((note, index) => ({ note, index }))
    .filter(({ note }) => note.type === "customer" && !note.isEmailed);

  if (pendingNoteIndexes.length > 0) {
    for (const { note } of pendingNoteIndexes) {
      await sendOrderNotice(doc, payload, { kind: "custom_note", note: note.note });
    }
    const updatedNotes = notes.map((note) => (note.type === "customer" ? { ...note, isEmailed: true } : note));
    await payload
      .update({
        collection: "orders",
        id: doc.id,
        data: { notes: updatedNotes },
        overrideAccess: true,
      })
      .catch((err) => console.error("Failed to mark order notes as emailed:", err));
  }
}
