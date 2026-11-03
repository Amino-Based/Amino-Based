import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Terms & Conditions | Amino Based";
const DESCRIPTION =
  "The terms and conditions governing your use of the Amino Based website and purchase of our research products.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/terms-and-conditions` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/terms-and-conditions`,
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

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="Please read these Terms and Conditions carefully before using our website or purchasing our products."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>Acceptance Of Terms</h2>
        <p>
          By accessing or using the Amino Based website, or by purchasing any product from us, you agree to be bound by these
          Terms and Conditions. If you do not agree, please do not use our website or purchase our products.
        </p>
      </div>

      <div>
        <h2>Eligibility</h2>
        <p>
          Our products are sold exclusively for laboratory research purposes to qualified adults, researchers, and institutions. By
          placing an order, you confirm that you are at least 21 years of age and are purchasing solely for legitimate research use,
          in compliance with all applicable laws in your jurisdiction. See our <a href="/medical-disclaimer">Medical Disclaimer</a>{" "}
          for further details.
        </p>
      </div>

      <div>
        <h2>Orders &amp; Payment</h2>
        <p>
          All prices are listed in U.S. dollars unless otherwise stated. We reserve the right to refuse or cancel any order at our
          discretion, including in cases of suspected fraud, pricing errors, or non-compliance with our eligibility requirements.
          Payment must be received in full before an order is processed and shipped.
        </p>
      </div>

      <div>
        <h2>Product Information</h2>
        <p>
          We make reasonable efforts to ensure product descriptions, purity data, and pricing are accurate. However, we do not
          warrant that product descriptions or other content are error-free. Certificates of Analysis are provided for reference; see
          our <a href="/certificates">Certificates page</a> for details.
        </p>
      </div>

      <div>
        <h2>Affiliate Program</h2>
        <p>
          Participation in our affiliate program is subject to approval and to the specific commission, cookie duration, and payout
          terms communicated to each affiliate. We reserve the right to modify, suspend, or terminate the affiliate program, or any
          individual affiliate&apos;s participation, at our discretion &mdash; including for suspected fraud or self-referral.
        </p>
      </div>

      <div>
        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, and images, is the property of Amino Based or its
          licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create
          derivative works from our content without prior written consent.
        </p>
      </div>

      <div>
        <h2>Limitation Of Liability</h2>
        <p>
          To the fullest extent permitted by law, Amino Based shall not be liable for any indirect, incidental, special, or
          consequential damages arising from the use or misuse of our products or website. Our total liability for any claim shall
          not exceed the amount you paid for the product giving rise to the claim.
        </p>
      </div>

      <div>
        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Amino Based
          is established, without regard to its conflict of law principles.
        </p>
      </div>

      <div>
        <h2>Changes To These Terms</h2>
        <p>
          We may revise these Terms at any time. Continued use of our website or services after changes are posted constitutes
          acceptance of the revised Terms.
        </p>
      </div>
    </LegalPageLayout>
  );
}
