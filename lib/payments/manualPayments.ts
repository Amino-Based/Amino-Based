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
  {
    label: string;
    recipient: string;
    /**
     * Path under `public/` to a QR code for this method, or "" when there isn't one.
     *
     * Must point at an account that belongs to Amino Based — see the warning above. The
     * renderers turn this into an absolute URL, because a relative path does not resolve in
     * an email client.
     *
     * A QR is never sufficient on its own: Gmail, Outlook and Apple Mail block remote images
     * by default, so a customer may see nothing at all. Keep `recipient` filled in as the
     * text fallback wherever a QR is offered.
     */
    qrPath: string;
  }
> = {
  zelle: { label: "Zelle", recipient: "", qrPath: "/payments/zelle-qr.png" },
  venmo: { label: "Venmo", recipient: "", qrPath: "" },
  cashapp: { label: "Cash App", recipient: "", qrPath: "" },
};

export function getManualPaymentInfo(method?: string | null) {
  return method && method in MANUAL_PAYMENT_INFO
    ? MANUAL_PAYMENT_INFO[method as ManualPaymentMethod]
    : null;
}
