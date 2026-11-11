import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Terms of Service & Research Supply Agreement | Amino Based";
const DESCRIPTION =
  "Terms of service, user eligibility, laboratory purchasing standards, and research compliance agreements governing Amino Based.";

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
      eyebrow="Terms of Service"
      title="Terms of Service & Research Agreement"
      intro="These Terms of Service govern all interactions with the Amino Based research platform, catalog browsing, institutional order placement, and the acquisition of laboratory-grade peptide compounds synthesized in the United States."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>1. Scope of Agreement &amp; Acceptance</h2>
        <p>
          By accessing, navigating, creating an account upon, or completing a transaction through the Amino Based website
          (&ldquo;the Service&rdquo; or &ldquo;Amino Based&rdquo;), you (&ldquo;Purchaser,&rdquo; &ldquo;Researcher,&rdquo;
          or &ldquo;Institution&rdquo;) explicitly enter into a legally binding contract subject to these Terms of Service. If you
          or your organization do not unconditionally agree to each covenant, condition, and restriction set forth herein, you
          must immediately terminate use of our platform and refrain from acquiring materials.
        </p>
      </div>

      <div>
        <h2>2. Professional Eligibility &amp; Research Intended Use</h2>
        <p>
          Amino Based supplies materials exclusively for <em>in-vitro</em> laboratory research, academic exploration, receptor
          kinetic modeling, and analytical chromatography standardization. By submitting an order or establishing an account, you
          warrant and represent the following:
        </p>
        <ul>
          <li>You are an adult of legal majority in your jurisdiction and at least 21 years of age.</li>
          <li>
            You are an accredited researcher, laboratory technician, corporate entity, academic faculty member, or qualified
            scientific investigator possessing the facilities, safety protocols, and technical training required to handle
            biochemical compounds safely.
          </li>
          <li>
            All materials acquired will be used exclusively for lawful, ethical laboratory experimentation. Under no circumstance
            shall any compound be introduced into humans, clinical patients, or animals, nor utilized as food additives,
            cosmetics, diagnostic reagents, or therapeutic drugs.
          </li>
          <li>
            You will maintain complete compliance with municipal, state, federal, and international chemical distribution statutes
            applicable to your facility.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Synthesis Standards, Purity Claims &amp; Analytical COAs</h2>
        <p>
          Amino Based manufactures and distributes research peptides synthesized through automated solid-phase peptide synthesis
          (SPPS). Every catalog production lot undergoes dual-tier verification: reverse-phase high-performance liquid
          chromatography (RP-HPLC) for analytical chemical purity (guaranteed minimum threshold of &ge;99.0%) and electrospray
          ionization mass spectrometry (ESI-MS) to verify molecular sequence fidelity.
        </p>
        <p>
          Certificates of Analysis (COAs) containing spectral data and purity chromatograms are published on our public repository
          for reference. While we make every analytical effort to reflect exact lot specifications, published data represents batch
          testing and should be verified independently according to your institution&apos;s assay protocols.
        </p>
      </div>

      <div>
        <h2>4. Ordering, Payment &amp; Transaction Verification</h2>
        <p>
          All pricing across our catalog is denominated in United States Dollars ($USD). Amino Based reserves the right to
          re-evaluate, modify, or adjust pricing without prior notice. An order confirmation email reflects receipt of a purchase
          inquiry and does not signify formal acceptance until verified by our compliance team.
        </p>
        <p>
          We reserve the right to decline, cancel, or refund any transaction at our sole discretion, including instances of
          suspected residential or non-laboratory delivery destinations, address discrepancies, unverified credentials, pricing
          typographical errors, or suspected unauthorized payment usage. All orders must be settled in full via approved payment
          methods prior to packaging and cold-chain courier release.
        </p>
      </div>

      <div>
        <h2>5. Cold-Chain Delivery &amp; Transfer of Risk</h2>
        <p>
          Orders are dispatched in thermal-insulated protective laboratory packaging with cooling packs to preserve lyophilized
          powder integrity during transit. Title and risk of loss transfer to the purchaser once the package has been accepted by
          the courier. The purchaser is responsible for inspecting packaging integrity, factory seals, and lot identifiers
          immediately upon delivery and ensuring immediate transfer to -20&deg;C storage.
        </p>
      </div>

      <div>
        <h2>6. Intellectual Property &amp; Analytical Documentation</h2>
        <p>
          All digital and published assets displayed on the Amino Based platform &mdash; including technical documentation,
          spectroscopy charts, HPLC chromatograms, peptide calculators, graphic identity marks, and site architecture &mdash; remain
          the exclusive intellectual property of Amino Based. Unauthorized scraping, commercial re-distribution, branding
          emulation, or derivative publication is strictly prohibited without explicit written consent.
        </p>
      </div>

      <div>
        <h2>7. Partner &amp; Affiliate Compliance Governance</h2>
        <p>
          Participation in the Amino Based Partner Network is governed by our published Content Standards and Federal Trade
          Commission (FTC) disclosure mandates. Affiliates must maintain strict adherence to Research Use Only (RUO) positioning.
          Any representation of compounds involving human outcomes, therapeutic benefits, clinical efficacy, or off-label use
          will result in immediate termination of the affiliate account and forfeiture of accrued commission balances.
        </p>
      </div>

      <div>
        <h2>8. Disclaimer of Warranties</h2>
        <p>
          The service, catalog, compounds, and documentation are provided strictly on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. Amino Based expressly disclaims all warranties of any kind, whether express or implied, including
          without limitation merchantability, fitness for a particular experimental purpose, non-infringement, and experimental
          outcome.
        </p>
      </div>

      <div>
        <h2>9. Limitation of Liability &amp; Indemnification</h2>
        <p>
          Under no circumstances shall Amino Based, its directors, biochemists, synthesis contractors, or affiliates be held liable
          for incidental, consequential, punitive, indirect, or laboratory downtime damages resulting from compound handling,
          storage failure, experimental outcome, or breach of these terms. Our aggregate financial liability for any claim shall
          never exceed the net purchase amount paid for the specific compound lot in question.
        </p>
        <p>
          The purchaser agrees to defend, indemnify, and hold harmless Amino Based against any claims, losses, liabilities, and
          legal expenses arising from unauthorized handling, improper containment, re-sale, or violation of applicable chemical
          regulations.
        </p>
      </div>

      <div>
        <h2>10. Governing Jurisdiction &amp; Severability</h2>
        <p>
          These Terms of Service are governed by and construed under the laws of the United States and the State in which Amino
          Based operates, without regard to conflict of law principles. If any individual provision is deemed unenforceable by a
          competent court, that provision will be modified to the minimum extent necessary, and all remaining provisions shall
          remain in full legal force and effect.
        </p>
      </div>
    </LegalPageLayout>
  );
}
