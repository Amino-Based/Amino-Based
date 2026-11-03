import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Shipping Policy | Amino Based";
const DESCRIPTION =
  "Shipping methods, processing times, and packaging standards for Amino Based research chemical orders.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/shipping-policy` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/shipping-policy`,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/email/welcome-hero-amino.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${siteUrl}/email/welcome-hero-amino.jpg`],
  },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Shipping Policy"
      intro="We take care to ensure every order arrives quickly, discreetly, and with the sample integrity your research demands."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>Order Processing Time</h2>
        <p>
          Orders are typically processed and dispatched within 1&ndash;3 business days of payment confirmation. Custom synthesis
          orders may require additional processing time, which will be communicated at the time of order.
        </p>
      </div>

      <div>
        <h2>Shipping Methods</h2>
        <p>
          We offer standard and expedited shipping options at checkout. Estimated delivery times vary based on destination and
          selected shipping method, and are displayed at checkout before you complete your order.
        </p>
      </div>

      <div>
        <h2>Temperature-Controlled Packaging</h2>
        <p>
          To protect sample integrity, temperature-sensitive products are shipped with appropriate insulated packaging and, where
          necessary, cold packs. We recommend refrigerating or freezing products immediately upon arrival per the storage guidance
          provided with each product.
        </p>
      </div>

      <div>
        <h2>Domestic &amp; International Shipping</h2>
        <p>
          We currently ship within the regions listed at checkout. International customers are responsible for any customs duties,
          import taxes, or fees imposed by their destination country, as well as compliance with local regulations governing the
          import of research chemicals.
        </p>
      </div>

      <div>
        <h2>Tracking Your Order</h2>
        <p>
          Once your order ships, you will receive a confirmation email with tracking information. You can also view order status
          from your account dashboard.
        </p>
      </div>

      <div>
        <h2>Lost Or Delayed Shipments</h2>
        <p>
          If your order has not arrived within the estimated delivery window, please contact us via our{" "}
          <a href="/contact-us">Contact page</a> and we will work with the carrier to locate your shipment or arrange a resolution.
        </p>
      </div>

      <div>
        <h2>Discreet Packaging</h2>
        <p>
          All orders are shipped in plain, unmarked packaging with no reference to the contents on the exterior, to protect your
          privacy.
        </p>
      </div>
    </LegalPageLayout>
  );
}
