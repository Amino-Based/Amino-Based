import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Privacy Policy | Amino Based";
const DESCRIPTION =
  "How Amino Based collects, uses, and protects your personal information.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/privacy-policy` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/privacy-policy`,
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

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This Privacy Policy describes how Amino Based collects, uses, and safeguards information when you visit our website or purchase our products."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, including when you:</p>
        <ul>
          <li>Create an account or place an order</li>
          <li>Contact our support team or submit a contact form</li>
          <li>Apply to our affiliate program</li>
          <li>Subscribe to marketing communications</li>
        </ul>
        <p>
          This may include your name, email address, shipping and billing address, phone number, and payment information (processed
          securely by our payment provider &mdash; we do not store full card numbers on our servers).
        </p>
      </div>

      <div>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your account, orders, or inquiries</li>
          <li>Administer our affiliate program and process commission payouts</li>
          <li>Improve our website, products, and customer experience</li>
          <li>Send marketing communications, where you have opted in</li>
          <li>Comply with legal obligations and prevent fraud</li>
        </ul>
      </div>

      <div>
        <h2>Cookies &amp; Tracking</h2>
        <p>
          We use cookies and similar technologies to keep you signed in, remember your preferences, and attribute affiliate referrals.
          You can control cookies through your browser settings, though disabling them may affect site functionality.
        </p>
      </div>

      <div>
        <h2>Sharing Of Information</h2>
        <p>
          We do not sell your personal information. We may share information with trusted service providers who help us operate our
          business &mdash; such as payment processors, shipping carriers, and email service providers &mdash; solely for the purpose
          of providing our services. We may also disclose information when required by law.
        </p>
      </div>

      <div>
        <h2>Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures designed to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction.
        </p>
      </div>

      <div>
        <h2>Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information. To
          exercise these rights, please contact us via our <a href="/contact-us">Contact page</a>.
        </p>
      </div>

      <div>
        <h2>Changes To This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised
          &ldquo;last updated&rdquo; date.
        </p>
      </div>
    </LegalPageLayout>
  );
}
