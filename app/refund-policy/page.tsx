import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Refund, Replacement & Return Policy | Amino Based";
const DESCRIPTION =
  "Official policy on refunds, replacements, order cancellations, and safety protocols for high-purity research peptide orders.";

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
      eyebrow="Order Assurance"
      title="Refund, Replacement & Return Policy"
      intro="Due to the sensitive nature of high-purity lyophilized research peptides and laboratory cold-chain standards, our refund policy reflects strict regulatory safety controls."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>1. Principles of Product Integrity &amp; Safety Control</h2>
        <p>
          Amino Based supplies analytical-grade peptide compounds synthesized strictly for laboratory experimentation. Because
          reagents must maintain complete chain-of-custody, chemical sterility, and verified temperature preservation to yield valid
          experimental results, <strong>we cannot accept physical returns of opened, unsealed, or reconstituted vials under any
          circumstances</strong>.
        </p>
        <p>
          Once a product leaves our synthesis facility and cold-pack custody, exposure to ambient room temperatures, improper
          freezing, or handling renders it ineligible for re-stocking or re-distribution. This protocol guarantees that every vial
          delivered to a client is freshly synthesized and analytically untouched.
        </p>
      </div>

      <div>
        <h2>2. Damaged, Defective, or Incorrect Shipments (7-Day Coverage)</h2>
        <p>
          We stand completely behind the physical delivery fidelity of our synthesis lots. If your shipment arrives with broken glass,
          compromised rubber butyl stoppers, missing items, or a compound differing from your packing slip, you are entitled to an
          immediate, free replacement or full refund:
        </p>
        <ul>
          <li>
            <strong>Notification Window:</strong> Contact our laboratory support team within <strong>7 calendar days</strong> of
            courier delivery confirmation via our <a href="/contact-us">Contact page</a>.
          </li>
          <li>
            <strong>Required Documentation:</strong> Please provide your order number, a brief summary of the issue, and clear,
            high-resolution photographs showing the outer parcel packaging, the damaged vial, and the printed lot number on the label.
          </li>
          <li>
            <strong>Resolution:</strong> Once verified by our logistics team, we will immediately synthesize or dispatch an expedited
            replacement batch at zero cost, or issue a 100% refund to your original payment method.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Unopened Vials &amp; Return Merchandise Authorization (14-Day Window)</h2>
        <p>
          If you ordered an incorrect compound or quantity and wish to return the product, unopened items may be eligible for return
          under the following strict conditions:
        </p>
        <ul>
          <li>The return inquiry must be submitted within <strong>14 calendar days</strong> of initial delivery.</li>
          <li>
            The vials must be completely intact, with tamper-evident caps unopened, seals unpunctured, and original insulated
            laboratory packaging preserved.
          </li>
          <li>
            Prior to shipping, you must receive an official <strong>Return Merchandise Authorization (RMA)</strong> number from our
            support desk. Parcels returned without a verified RMA will be refused and disposed of without refund.
          </li>
          <li>
            Because returned chemical materials require analytical quarantine, purity re-testing, and restocking, returns of unopened
            items are subject to a 15% restocking and laboratory disposal assessment. The client assumes responsibility for return
            cold-pack shipping costs.
          </li>
        </ul>
      </div>

      <div>
        <h2>4. Pre-Shipment Order Cancellations</h2>
        <p>
          Orders may be canceled for a full, 100% refund at any point <strong>prior to packaging assembly and courier custody
          transfer</strong>. Once an order has entered cold-chain pack assembly, insulated thermal boxing, or courier dispatch, the
          shipment cannot be recalled and falls under the return provisions above. To request an urgent cancellation, contact our
          support team immediately with &ldquo;URGENT CANCELLATION&rdquo; in the subject line.
        </p>
      </div>

      <div>
        <h2>5. Strictly Non-Refundable Situations</h2>
        <p>Refunds or replacements cannot be granted under the following circumstances:</p>
        <ul>
          <li>Vials that have had the aluminum flip-off cap detached, stopper punctured, or powder reconstituted with bacteriostatic water or diluent.</li>
          <li>Compounds degraded due to improper laboratory storage upon receipt (e.g., failure to transfer to -20&deg;C storage).</li>
          <li>Custom solid-phase synthesis (SPPS) sequences manufactured specifically to bespoke client specifications, unless analytical purity fails the &ge;99% threshold.</li>
          <li>Delays resulting from customs holds, international regulatory seizures, or incorrect addresses provided at checkout.</li>
          <li>Standard shipping and expedited handling charges, except where transit failure resulted directly from our error.</li>
        </ul>
      </div>

      <div>
        <h2>6. Refund Processing Schedules</h2>
        <p>
          Once an authorized return is received and inspected at our synthesis suite, or a replacement waiver is approved, refunds
          are submitted immediately to our merchant processor. Funds are returned directly to the original funding source (credit card,
          ACH, or cryptocurrency equivalent) within <strong>5 to 10 business days</strong>, depending on your banking institution&apos;s
          settlement cycle.
        </p>
      </div>

      <div>
        <h2>7. Institutional Inquiries &amp; Dedicated Support</h2>
        <p>
          If you have questions regarding lot verifications, shipment damage, or specific batch certificates, our scientific support
          desk is here to assist. Submit your inquiry through our <a href="/contact-us">Contact page</a> or email{" "}
          <strong>support@aminobased.com</strong>.
        </p>
      </div>
    </LegalPageLayout>
  );
}
