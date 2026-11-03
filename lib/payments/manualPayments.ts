/**
 * Customer-facing instructions for the manual payment methods. `recipient` is the payment
 * handle shown to the customer — fill these in; the amount/memo instructions are shown
 * regardless, and the recipient line is hidden while blank.
 *
 * The QR code images that previously accompanied these methods were inherited from a different
 * business and encoded unverified payment destinations, so they were removed from the checkout
 * page, the order-confirmation page and the order emails. Do not add a `qrPath` back without
 * first confirming that the destination account belongs to Amino Based.
 */
export type ManualPaymentMethod = "zelle" | "venmo" | "cashapp";

export const MANUAL_PAYMENT_INFO: Record<
  ManualPaymentMethod,
  { label: string; recipient: string }
> = {
  zelle: { label: "Zelle", recipient: "" },
  venmo: { label: "Venmo", recipient: "" },
  cashapp: { label: "Cash App", recipient: "" },
};

export function getManualPaymentInfo(method?: string | null) {
  return method && method in MANUAL_PAYMENT_INFO
    ? MANUAL_PAYMENT_INFO[method as ManualPaymentMethod]
    : null;
}
