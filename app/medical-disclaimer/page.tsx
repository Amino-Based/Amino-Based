import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Medical Disclaimer | Amino Based";
const DESCRIPTION =
  "Amino Based research chemicals are for laboratory and in-vitro research use only and are not intended for human or veterinary use.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/medical-disclaimer` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/medical-disclaimer`,
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

export default function MedicalDisclaimerPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Medical Disclaimer"
      intro="Please read this disclaimer carefully before purchasing or using any product sold by Amino Based."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>Research Use Only (RUO)</h2>
        <p>
          All products offered by Amino Based (&ldquo;the Company&rdquo;) are sold strictly for laboratory research and in-vitro
          testing purposes only. Our products are chemical research compounds and are <strong>not drugs, dietary supplements, cosmetics,
          or food products</strong>. They are not intended for human or animal consumption, administration, use, injection, or ingestion
          of any kind.
        </p>
      </div>

      <div>
        <h2>Not For Diagnostic Or Therapeutic Use</h2>
        <p>
          No product sold on this website has been evaluated or approved by the U.S. Food and Drug Administration (FDA) or any
          equivalent regulatory body for use in humans or animals. These products are not intended to diagnose, treat, cure, or
          prevent any disease or medical condition.
        </p>
      </div>

      <div>
        <h2>Qualified Purchasers Only</h2>
        <p>
          Products are sold only to qualified individuals and institutions &mdash; including researchers, laboratories, and
          educational or scientific institutions &mdash; who possess the appropriate training, licensure, and facilities required to
          safely handle research chemicals. By purchasing from Amino Based, you represent and warrant that you are a qualified
          professional purchasing products solely for legitimate research purposes, and that you will handle all substances in
          compliance with applicable laws, regulations, and institutional safety protocols.
        </p>
      </div>

      <div>
        <h2>Assumption Of Risk</h2>
        <p>
          Handling of research chemicals should only be performed by trained professionals using appropriate personal protective
          equipment (PPE) in a properly equipped laboratory setting. The purchaser assumes all risk and liability associated with the
          handling, storage, and use of any product purchased from Amino Based.
        </p>
      </div>

      <div>
        <h2>No Medical Advice</h2>
        <p>
          Nothing on this website, in our marketing materials, or in any communication from Amino Based constitutes medical
          advice. Any information provided about research compounds is for general scientific and educational reference only and
          should not be construed as a recommendation for any particular use.
        </p>
      </div>

      <div>
        <h2>Contact Us</h2>
        <p>
          If you have questions about this disclaimer, please contact us via our <a href="/contact-us">Contact page</a>.
        </p>
      </div>
    </LegalPageLayout>
  );
}
