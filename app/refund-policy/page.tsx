import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Refund Policy | Amino Based";
const DESCRIPTION =
  "Our policy on refunds, returns, and order cancellations for research chemical products.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/refund-policy` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/refund-policy`,
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

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Refund Policy"
      intro="Due to the nature of our products, our refund and return policy has some restrictions. Please review the details below."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>General Policy</h2>
        <p>
          Because our products are research chemicals intended for laboratory use, and for reasons of safety, quality control, and
          regulatory compliance, we are unable to accept returns of opened or used products. We want you to be satisfied with your
          order, so please read the guidelines below.
        </p>
      </div>

      <div>
        <h2>Damaged Or Incorrect Orders</h2>
        <p>
          If your order arrives damaged, defective, or incorrect, please contact us within 7 days of delivery via our{" "}
          <a href="/contact-us">Contact page</a>, including your order number and photos of the issue. We will arrange a replacement
          or refund at no additional cost once the issue is verified.
        </p>
      </div>

      <div>
        <h2>Unopened Products</h2>
        <p>
          Unopened, unused products in their original packaging may be eligible for a return within 14 days of delivery, subject to
          a restocking fee. Please contact our support team to request a Return Merchandise Authorization (RMA) before sending any
          product back &mdash; unauthorized returns will not be accepted or refunded.
        </p>
      </div>

      <div>
        <h2>Order Cancellations</h2>
        <p>
          Orders may be canceled for a full refund if they have not yet shipped. Once an order has shipped, it is subject to this
          Refund Policy&apos;s return terms.
        </p>
      </div>

      <div>
        <h2>Non-Refundable Situations</h2>
        <ul>
          <li>Products that have been opened, reconstituted, or used</li>
          <li>Products damaged after delivery due to improper storage or handling</li>
          <li>Custom or made-to-order synthesis requests, unless defective</li>
          <li>Shipping fees, except in cases of our error</li>
        </ul>
      </div>

      <div>
        <h2>Processing Time</h2>
        <p>
          Approved refunds are processed to your original payment method within 5&ndash;10 business days. Please contact us if you
          have not received your refund within this window.
        </p>
      </div>

      <div>
        <h2>Questions</h2>
        <p>
          For any questions about this policy or a specific order, please reach out through our <a href="/contact-us">Contact page</a>.
        </p>
      </div>
    </LegalPageLayout>
  );
}
