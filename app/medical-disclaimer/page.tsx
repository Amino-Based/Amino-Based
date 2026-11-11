import { ShieldAlert, FlaskConical, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Medical Disclaimer & Research Compliance Statement | Amino Based";
const DESCRIPTION =
  "Official compliance disclosure: Amino Based compounds are strictly synthesized for in-vitro laboratory research and are not for human or veterinary use.";

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
      eyebrow="Compliance Notice"
      title="Medical Disclaimer & Research Compliance Statement"
      intro="Please read this scientific compliance statement carefully before browsing, ordering, or utilizing any peptide compounds manufactured by Amino Based."
      lastUpdated="September 5, 2026"
    >
      {/* Prominent RUO Compliance Alert Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 sm:p-6 mb-10 not-prose">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-950 uppercase tracking-wide">
              Mandatory Research Use Only (RUO) Notice
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/90 mt-1.5 leading-relaxed">
              All chemical formulations, lyophilized peptides, and analytical reference standards supplied by Amino Based are
              exclusively manufactured for <strong>in-vitro laboratory research, cellular pathway assays, receptor kinetics, and
              analytical calibration</strong>. Under no circumstances are compounds intended for clinical, medical, human, or veterinary
              application.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2>1. Strict Research Use Only (RUO) Designation</h2>
        <p>
          All peptide sequences, chemical analogs, and related biological compounds offered by Amino Based (&ldquo;the Company&rdquo;)
          are synthesized, purified, packaged, and distributed strictly for <strong>in-vitro laboratory research and analytical
          investigation (RUO)</strong>. Our products are chemical research reagents and are <strong>explicitly NOT drugs, human
          medicines, dietary supplements, cosmetics, foods, or compounding pharmaceuticals</strong> as defined under Section 503A or
          503B of the Federal Food, Drug, and Cosmetic Act.
        </p>
        <p>
          Under no circumstance should any substance supplied by Amino Based ever be introduced into humans or animals via
          injection, ingestion, inhalation, dermal absorption, or any other physiological vector.
        </p>
      </div>

      <div>
        <h2>2. No FDA Evaluation Or Therapeutic Approval</h2>
        <p>
          None of the products, compound descriptions, research summaries, or statements published on this website have been evaluated,
          cleared, or approved by the <strong>United States Food and Drug Administration (FDA)</strong>, the European Medicines Agency
          (EMA), or any comparable domestic or international regulatory agency.
        </p>
        <p>
          These compounds are not intended to diagnose, treat, mitigate, cure, prevent, or palliate any disease, physiological
          ailment, metabolic syndrome, or medical condition in humans or animals.
        </p>
      </div>

      <div>
        <h2>3. Institutional &amp; Professional Purchaser Representation</h2>
        <p>
          Products are sold exclusively to qualified adults (&ge;21 years of age), certified researchers, academic faculty, contract
          research organizations (CROs), and accredited institutional laboratories. By submitting an order, you warrant that:
        </p>
        <ul>
          <li>You possess the scientific background, credentials, and institutional authorization to safely handle biochemical reagents.</li>
          <li>Your facility is properly equipped with engineering controls, chemical fume hoods, eye wash stations, and hazardous waste disposal systems.</li>
          <li>You will not market, repackage, distribute, or resell any compound for personal, clinical, or consumer applications.</li>
          <li>You assume complete legal responsibility for verifying that your laboratory&apos;s use of the compound complies with all relevant institutional biosafety and chemical inventory regulations.</li>
        </ul>
      </div>

      <div>
        <h2>4. Hazardous Handling &amp; Assumption of Risk</h2>
        <p>
          All chemical substances carry inherent risks. Physical handling, storage, reconstitution, and experimental assaying must be
          conducted exclusively by trained personnel utilizing appropriate <strong>Personal Protective Equipment (PPE)</strong>,
          including laboratory coats, nitrile gloves, and certified eye/face protection.
        </p>
        <p>
          The purchaser assumes all hazard, liability, and responsibility for the safe storage, container containment, reconstitution,
          and eventual neutralization/disposal of all substances purchased from Amino Based.
        </p>
      </div>

      <div>
        <h2>5. Educational &amp; Technical Information (No Medical Advice)</h2>
        <p>
          Nothing contained upon this website, in our published research library, in technical data sheets, on Certificate of Analysis
          (COA) documents, or in direct communications with Amino Based personnel constitutes medical, clinical, or pharmacological
          advice.
        </p>
        <p>
          All published citations, amino acid sequences, molecular weights, and biochemical pathway diagrams are provided exclusively
          for educational reference and academic literature benchmarking.
        </p>
      </div>

      <div>
        <h2>6. Lot Verification &amp; Technical Inquiries</h2>
        <p>
          If your institutional compliance desk or biosafety officer requires specific technical documentation, Safety Data Sheets
          (SDS), or analytical HPLC/MS verification records for a specific production lot, please submit an inquiry via our{" "}
          <a href="/contact-us">Contact page</a> or email our compliance desk directly at <strong>compliance@aminobased.com</strong>.
        </p>
      </div>
    </LegalPageLayout>
  );
}
