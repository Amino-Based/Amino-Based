import { signOrderAccessToken, ORDER_TOKEN_TTL_EMAIL } from "@/lib/orders/orderAccessToken";
import {
  emailLayout,
  emailHeading,
  emailParagraph,
  emailCallout,
  emailButton,
  SITE_URL,
  ACCENT,
} from "../layout";
import { escapeHtml } from "../escapeHtml";
import { getManualPaymentInfo } from "../../payments/manualPayments";
import { safeProductImageUrl } from "@/lib/products/productImage";

type OrderItem = {
  product?: { name?: string } | string | number | null;
  variantTitle?: string | null;
  price?: number | null;
  quantity?: number | null;
  productSnapshot?: { name?: string; imageUrl?: string } | null;
};

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type OrderLike = {
  id: string | number;
  orderNumber?: string | null;
  createdAt?: string | null;
  items?: OrderItem[] | null;
  subtotal?: number | null;
  discountTotal?: number | null;
  shippingTotal?: number | null;
  shippingMethod?: string | null;
  feeTotal?: number | null;
  total?: number | null;
  couponCode?: string | null;
  customerFirstName?: string | null;
  customerLastName?: string | null;
  customerPhone?: string | null;
  shippingAddress?: Address | null;
  billingAddress?: Address | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
};

export type OrderEmailNotice =
  | { kind: "confirmation" }
  | { kind: "shipped"; trackingLink?: string | null }
  | { kind: "refunded" }
  | { kind: "cancelled" }
  | { kind: "payment_failed" }
  | { kind: "custom_note"; note: string };

const money = (n: number | null | undefined) => `$${Number(n || 0).toFixed(2)}`;

// Methods paid outside the site (no webhook); the order stays pending until an admin marks it paid.
const MANUAL_METHODS = new Set(["zelle", "venmo", "cashapp", "amex", "circoflows", "stripe_link"]);

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe: "Card",
  zelle: "Zelle",
  venmo: "Venmo",
  cashapp: "Cash App",
  amex: "American Express",
  circoflows: "CircoFlows",
  stripe_link: "Stripe (Custom Link)",
};

// Tint per manual payment method, mirroring a distinct card per method.
const MANUAL_METHOD_TINTS: Record<string, { bg: string; border: string; icon: string; title: string; text: string; badge: string }> = {
  zelle: { bg: "#F3E8FF", border: "#E9D5FF", icon: "#E9D5FF", title: "#6B21A8", text: "#7E22CE", badge: "Z" },
  venmo: { bg: "#EFF6FF", border: "#DBEAFE", icon: "#DBEAFE", title: "#1E40AF", text: "#1D4ED8", badge: "V" },
  cashapp: { bg: "#ECFDF5", border: "#D1FAE5", icon: "#D1FAE5", title: "#065F46", text: "#047857", badge: "$" },
};

function paymentInstructionsHtml(order: OrderLike, orderNumber: string): string {
  const method = order.paymentMethod ?? "";
  const manual = getManualPaymentInfo(method);

  if (manual) {
    const t = MANUAL_METHOD_TINTS[method];
    return `
      <div style="background-color:${t.bg};border:1px solid ${t.border};padding:30px 20px;border-radius:12px;text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;width:48px;height:48px;background-color:${t.icon};border-radius:50%;color:${t.title};font-weight:bold;font-size:24px;line-height:48px;margin-bottom:16px;">${t.badge}</div>
        <h3 style="margin:0 0 8px 0;color:${t.title};font-size:18px;font-weight:700;">Complete Your Payment via ${escapeHtml(manual.label)}</h3>
        <p style="margin:0 0 20px 0;color:${t.text};font-size:14px;line-height:1.5;">To finalize your order, please send exactly <strong>${money(order.total)}</strong> via ${escapeHtml(manual.label)}.</p>
        <p style="margin:0 0 16px 0;color:#B91C1C;font-size:13px;font-weight:600;">Please include your order number <strong>#${escapeHtml(orderNumber)}</strong> in the payment note.</p>
        ${
          manual.recipient
            ? `<div style="display:block;margin-bottom:16px;">
          <div style="background-color:#ffffff;border-radius:8px;padding:12px 24px;display:inline-block;">
            <p style="margin:0 0 4px 0;color:${t.text};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Send To</p>
            <p style="margin:0;color:${t.title};font-size:16px;font-weight:700;">${escapeHtml(manual.recipient)}</p>
          </div>
        </div>`
            : `<div style="display:block;margin-bottom:16px;">
          <div style="background-color:#ffffff;border-radius:8px;padding:12px 24px;display:inline-block;">
            <p style="margin:0;color:${t.title};font-size:14px;line-height:1.5;">Please reply to this email and we will confirm where to send your payment before you pay.</p>
          </div>
        </div>`
        }
        <p style="margin:0;color:${t.text};font-size:11px;font-style:italic;">Your order ships as soon as we confirm your payment. If you've already paid, you can ignore this message.</p>
      </div>`;
  }

  if (method === "amex") {
    return `
      <div style="background-color:#EFF6FF;border:1px solid #DBEAFE;padding:30px 20px;border-radius:12px;text-align:center;margin-bottom:32px;">
        <h3 style="margin:0 0 8px 0;color:#1E40AF;font-size:18px;font-weight:700;">Complete Your American Express Payment</h3>
        <p style="margin:0;color:#1D4ED8;font-size:14px;line-height:1.5;">One of our team members will reach out shortly via <strong>SMS or email</strong> with a secure invoice link to finalize your payment.</p>
      </div>`;
  }

  if (method === "stripe_link") {
    return `
      <div style="background-color:#EEF2FF;border:1px solid #E0E7FF;padding:30px 20px;border-radius:12px;text-align:center;margin-bottom:32px;">
        <h3 style="margin:0 0 8px 0;color:#3730A3;font-size:18px;font-weight:700;">Complete Your Secure Payment</h3>
        <p style="margin:0;color:#4338CA;font-size:14px;line-height:1.5;">One of our team members will reach out shortly via <strong>email or SMS</strong> with a secure payment link to finalize your order.</p>
      </div>`;
  }

  if (method === "circoflows") {
    return `
      <div style="background-color:#F0FDFA;border:1px solid #CCFBF1;padding:24px 20px;border-radius:12px;text-align:center;margin-bottom:32px;">
        <p style="margin:0;color:#115E59;font-size:14px;line-height:1.5;">Your order is awaiting confirmation from our payment processor. We'll email you as soon as payment clears.</p>
      </div>`;
  }

  return "";
}

function absoluteImage(url?: string | null): string {
  if (!url) return "";
  const abs = /^https?:\/\//i.test(url) ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  // Product image folders contain spaces, which some mail clients won't load unescaped.
  return encodeURI(abs);
}

function addressBlock(label: string, name: string, addr: Address) {
  return `
    <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.1em;">${label}</p>
    <p style="margin:0;font-size:14px;color:#2A2A2A;line-height:1.5;">
      ${escapeHtml(name)}<br />
      ${escapeHtml(addr.line1)}${addr.line2 ? `<br />${escapeHtml(addr.line2)}` : ""}<br />
      ${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} ${escapeHtml(addr.postalCode)}<br />
      ${escapeHtml(addr.country)}
    </p>`;
}

export function generateOrderEmail(
  order: OrderLike,
  notice: OrderEmailNotice,
  customerEmail?: string | null
): { subject: string; html: string } {
  const orderNumber = String(order.orderNumber || order.id);
  const customerName = `${order.customerFirstName || ""} ${order.customerLastName || ""}`.trim() || "Customer";
  const awaitingPayment = MANUAL_METHODS.has(order.paymentMethod ?? "") && order.paymentStatus !== "captured";
  const isPaid = order.paymentStatus === "captured" || order.paymentStatus === "authorized";

  // --- Subject + intro per notice kind -------------------------------------------------------
  let subject: string;
  let introHtml: string;

  switch (notice.kind) {
    case "confirmation":
      if (awaitingPayment) {
        subject = `Complete your payment for Order #${orderNumber}`;
        introHtml =
          emailHeading(`Thank you for your order, ${escapeHtml(customerName)}!`) +
          emailParagraph(
            `We've reserved order <strong>#${escapeHtml(orderNumber)}</strong>. It will be prepared for shipment as soon as we confirm your payment — please complete it using the instructions below.`,
            { mb: 24 }
          );
      } else {
        subject = `Order Confirmation #${orderNumber}`;
        introHtml =
          emailHeading(`Thank you for your order, ${escapeHtml(customerName)}!`) +
          emailParagraph(
            `Your payment has been received and order <strong>#${escapeHtml(orderNumber)}</strong> is being prepared for shipment. Here's your receipt.`,
            { mb: 24 }
          );
      }
      break;
    case "shipped":
      subject = `Your Order #${orderNumber} has shipped!`;
      introHtml =
        emailHeading("Your order has shipped!") +
        emailParagraph(`Hi ${escapeHtml(customerName)}, order <strong>#${escapeHtml(orderNumber)}</strong> is on its way.`, { mb: 24 });
      break;
    case "refunded":
      subject = `Your Order #${orderNumber} has been refunded`;
      introHtml =
        emailHeading("Your order has been refunded") +
        emailParagraph(`Hi ${escapeHtml(customerName)},`) +
        emailParagraph(
          `Order <strong>#${escapeHtml(orderNumber)}</strong> has been <strong>refunded</strong>. Please allow a few business days for the funds to appear, depending on your payment method.`,
          { mb: 24 }
        );
      break;
    case "cancelled":
      subject = `Your Order #${orderNumber} has been cancelled`;
      introHtml =
        emailHeading("Your order has been cancelled") +
        emailParagraph(`Hi ${escapeHtml(customerName)},`) +
        emailParagraph(
          `Order <strong>#${escapeHtml(orderNumber)}</strong> has been <strong>cancelled</strong>. If you weren't expecting this, please reach out to support.`,
          { mb: 24 }
        );
      break;
    case "payment_failed":
      subject = `Your Order #${orderNumber} payment failed`;
      introHtml =
        emailHeading("Your payment could not be processed", "#B91C1C") +
        emailParagraph(`Hi ${escapeHtml(customerName)},`) +
        emailParagraph(
          `We weren't able to process payment for order <strong>#${escapeHtml(orderNumber)}</strong>, so it has been cancelled. You're welcome to place the order again.`,
          { mb: 24 }
        ) +
        emailButton({ label: "Try Checking Out Again", href: `${SITE_URL}/checkout` });
      break;
    case "custom_note":
      subject = `Update regarding your Order #${orderNumber}`;
      introHtml =
        emailHeading(`Update regarding your order #${escapeHtml(orderNumber)}`) +
        emailCallout(
          `<h3 style="margin:0 0 8px 0;color:${ACCENT};font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Message regarding your order</h3>
           <p style="margin:0;color:#2A2A2A;font-size:14px;line-height:1.6;">${escapeHtml(notice.note).replace(/\n/g, "<br />")}</p>`
        );
      break;
  }

  const paymentHtml = notice.kind === "confirmation" && awaitingPayment ? paymentInstructionsHtml(order, orderNumber) : "";

  const trackingHtml =
    notice.kind === "shipped" && notice.trackingLink && /^https?:\/\//i.test(notice.trackingLink)
      ? emailCallout(
          `<h3 style="margin:0 0 8px 0;color:#065F46;font-size:15px;font-weight:600;">Track Your Order</h3>
           <p style="margin:0 0 12px 0;color:#065F46;font-size:14px;line-height:1.6;">Your package is on the way! You can follow its progress using the link below.</p>
           <a href="${escapeHtml(notice.trackingLink)}" target="_blank" style="display:inline-block;padding:8px 16px;background-color:#10B981;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:4px;">Track Package</a>`,
          "#10B981"
        )
      : "";

  // --- Order info row ------------------------------------------------------------------------
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const infoCell = (label: string, value: string, align: "left" | "center" | "right", color = "#0A0A0A", bold = 500) => `
    <td width="25%" align="${align}" valign="top">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8A8A8A;font-weight:700;">${label}</p>
      <p style="margin:4px 0 0 0;font-size:14px;color:${color};font-weight:${bold};">${value}</p>
    </td>`;
  const infoHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr>
        ${infoCell("Order", `#${escapeHtml(orderNumber)}`, "left")}
        ${infoCell("Payment", escapeHtml(PAYMENT_METHOD_LABELS[order.paymentMethod ?? ""] || "Card"), "center")}
        ${infoCell("Status", isPaid ? "PAID" : "UNPAID", "center", isPaid ? "#15803D" : "#B91C1C", 700)}
        ${infoCell("Date", escapeHtml(orderDate), "right")}
      </tr>
    </table>`;

  // --- Items ---------------------------------------------------------------------------------
  const itemsHtml = (order.items ?? [])
    .map((item) => {
      const name =
        item.productSnapshot?.name ||
        (typeof item.product === "object" && item.product !== null ? item.product.name : undefined) ||
        "Product";
      const variant = item.variantTitle && item.variantTitle !== "DEFAULT" ? ` - ${item.variantTitle}` : "";
      // Order snapshots are historical records and must not be rewritten, but some were
      // captured while the site still served Prime Time Bio Labs photography. Filter at render.
      const img = absoluteImage(safeProductImageUrl(item.productSnapshot?.imageUrl));
      const imgHtml = img
        ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(name)}" width="60" height="60" style="width:60px;height:60px;object-fit:contain;border-radius:6px;display:block;" />`
        : `<div style="width:60px;height:60px;background-color:#f3f4f6;border-radius:6px;"></div>`;
      const lineTotal = (item.price || 0) * (item.quantity || 1);
      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="76" valign="middle">${imgHtml}</td>
                <td valign="middle">
                  <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${escapeHtml(name)}${escapeHtml(variant)}</p>
                  <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">Qty: ${escapeHtml(item.quantity || 1)}</p>
                </td>
                <td valign="middle" align="right">
                  <p style="margin:0;font-size:14px;font-weight:600;color:#111827;white-space:nowrap;">${money(lineTotal)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join("");

  const row = (label: string, value: string, color = "#0A0A0A") =>
    `<tr><td style="padding:8px 0;font-size:14px;color:#4A4A4A;">${label}</td><td align="right" style="padding:8px 0;font-size:14px;color:${color};">${value}</td></tr>`;

  const totalsHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      ${row("Subtotal", money(order.subtotal))}
      ${order.discountTotal ? row(`Discount${order.couponCode ? ` (${escapeHtml(order.couponCode)})` : ""}`, `-${money(order.discountTotal)}`, "#16a34a") : ""}
      ${row(`Shipping (${escapeHtml(order.shippingMethod || "Standard")})`, order.shippingTotal ? money(order.shippingTotal) : "Free")}
      ${order.feeTotal ? row("Processing Fees", money(order.feeTotal)) : ""}
      <tr>
        <td style="padding:16px 0 0 0;font-size:16px;font-weight:700;color:#0A0A0A;border-top:1px solid #e2ddd3;">Total</td>
        <td align="right" style="padding:16px 0 0 0;font-size:18px;font-weight:800;color:${ACCENT};border-top:1px solid #e2ddd3;">${money(order.total)}</td>
      </tr>
    </table>`;

  // --- Addresses + contact -------------------------------------------------------------------
  const ship = order.shippingAddress;
  const bill = order.billingAddress?.line1 ? order.billingAddress : ship;
  const addressesHtml = ship?.line1
    ? `
    <div style="background-color:#fdfbf7;border-radius:12px;border:1px solid #e2ddd3;padding:24px;margin-bottom:32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="50%" valign="top" style="padding-bottom:24px;">${addressBlock("Shipping Address", customerName, ship)}</td>
          <td width="50%" valign="top" style="padding-bottom:24px;">${bill ? addressBlock("Billing Address", customerName, bill) : ""}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:24px;border-top:1px solid #e2ddd3;">
            <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.1em;">Contact Information</p>
            <p style="margin:0;font-size:14px;color:#2A2A2A;line-height:1.5;">
              ${customerEmail ? `Email: ${escapeHtml(customerEmail)}<br />` : ""}
              ${order.customerPhone ? `Phone: ${escapeHtml(order.customerPhone)}` : ""}
              ${!customerEmail && !order.customerPhone ? "No contact information provided" : ""}
            </p>
          </td>
        </tr>
      </table>
    </div>`
    : "";

  const showSummary = notice.kind !== "payment_failed";
  const bodyHtml = `
    ${introHtml}
    ${paymentHtml}
    ${trackingHtml}
    ${
      showSummary
        ? `${infoHtml}
    <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#0A0A0A;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e2ddd3;padding-bottom:8px;">Order Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">${itemsHtml}</table>
    ${totalsHtml}
    ${addressesHtml}
    <div style="text-align:center;">${emailButton({ label: "View Order Status", href: `${SITE_URL}/order-confirmation/${order.id}?t=${signOrderAccessToken(order.id, ORDER_TOKEN_TTL_EMAIL)}` })}</div>`
        : ""
    }`;

  return { subject, html: emailLayout({ title: subject, bodyHtml }) };
}
