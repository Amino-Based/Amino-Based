import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Shipping, Cold-Chain Logistics & Packaging Policy | Amino Based";
const DESCRIPTION =
  "United States domestic and international shipping standards, cold-chain temperature preservation, and discreet packaging guidelines for Amino Based research peptides.";

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
      eyebrow="Logistics & Handling"
      title="Shipping, Cold-Chain Logistics & Packaging Policy"
      intro="Every research peptide order is packaged under strict laboratory cold-chain standards to protect sequence integrity, lyophilized stability, and vacuum seal fidelity throughout transit."
      lastUpdated="September 5, 2026"
    >
      <div>
        <h2>1. Synthesis Suite Order Processing &amp; Dispatch Schedule</h2>
        <p>
          All catalog peptides are maintained in state-of-the-art cryogenic storage suites in the United States. Following payment
          authorization and laboratory address verification, orders are processed, thermally packed, and released to our courier
          partners within <strong>1 to 3 business days</strong> (Monday through Friday, excluding federal holidays).
        </p>
        <p>
          Custom synthesis sequences, high-volume academic reservations, or specialized lyophilization batches follow distinct
          synthesis production schedules, which will be communicated directly during institutional onboarding.
        </p>
      </div>

      <div>
        <h2>2. Temperature-Controlled Cold-Chain Packaging</h2>
        <p>
          Lyophilized (freeze-dried) peptide cakes exhibit robust thermodynamic stability in their solid state during transit.
          However, to protect biological activity against severe temperature spikes and direct sunlight, every order is dispatched
          using custom protective protocols:
        </p>
        <ul>
          <li>Type-1 borosilicate glass vials sealed with PTFE-coated butyl stoppers and crimped aluminum caps to prevent moisture ingress.</li>
          <li>Reinforced thermal bubble mailers or insulated expanded polystyrene (EPS) containers.</li>
          <li>Refrigerated gel coolant packs to buffer ambient transit heat and safeguard thermodynamic integrity.</li>
          <li>
            <strong>Crucial Laboratory Receiving Protocol:</strong> Immediately upon delivery, unbox vials and place them directly
            into a laboratory freezer maintained at <strong>-20&deg;C</strong> (or <strong>-80&deg;C</strong> for multi-year archival
            stability). Do not leave packages outdoors, in ambient shipping bays, or in direct sunlight.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Shipping Methods &amp; Transit Speeds</h2>
        <p>
          We partner with premium expedited couriers (including FedEx and UPS) to minimize transit duration:
        </p>
        <ul>
          <li><strong>Standard Domestic Tracked:</strong> 2 to 4 business days average transit time across the continental United States.</li>
          <li><strong>Expedited Priority Express:</strong> 1 to 2 business days guaranteed priority delivery for urgent laboratory protocols.</li>
          <li>
            <strong>Real-Time Delivery Estimates:</strong> Specific rates, transit options, and estimated arrival windows are
            calculated dynamically at checkout based on your laboratory&apos;s geographic destination.
          </li>
        </ul>
      </div>

      <div>
        <h2>4. Domestic (US) &amp; International Research Destinations</h2>
        <p>
          Amino Based ships across all 50 United States and to select international research territories permitted under chemical
          export regulations:
        </p>
        <ul>
          <li>
            <strong>United States Shipments:</strong> Dispatched domestically with zero customs delay. We cannot ship to P.O. Boxes
            or residential lockers where cold-chain custody cannot be guaranteed.
          </li>
          <li>
            <strong>International Research Deliveries:</strong> International recipients assume total responsibility for ensuring the
            ordered compounds comply with the import regulations of their destination country. International purchasers are solely
            responsible for applicable customs duties, VAT, import tariffs, or specialized chemical clearance licenses.
          </li>
          <li>
            Amino Based is not liable for packages confiscated, delayed, or assessed additional fees by foreign customs authorities.
          </li>
        </ul>
      </div>

      <div>
        <h2>5. Automated Tracking &amp; Chain-of-Custody</h2>
        <p>
          Once your package is inspected and accepted by the courier, our system dispatches an automated shipping confirmation email
          containing your live tracking number, carrier link, and order reference. You can also view live tracking coordinates,
          packing manifests, and lot allocations by signing in to your <a href="/account">Account Dashboard</a>.
        </p>
      </div>

      <div>
        <h2>6. Delayed, Lost, or Compromised Parcels</h2>
        <p>
          While courier delays are beyond our direct control once in transit, we stand behind our clients&apos; research schedules:
        </p>
        <ul>
          <li>
            If tracking indicates no progress for more than 5 consecutive business days, contact our logistics desk via our{" "}
            <a href="/contact-us">Contact page</a> so we can initiate a formal carrier trace.
          </li>
          <li>
            In the rare event that a package is confirmed lost by the courier, or arrives severely damaged, we will immediately
            re-pack and dispatch a replacement shipment at our expense.
          </li>
        </ul>
      </div>

      <div>
        <h2>7. Discreet Laboratory Packaging</h2>
        <p>
          To maintain research confidentiality and prevent theft of valuable biological compounds, all orders are shipped in plain,
          unmarked, heavy-duty protective cardboard mailers. There are no peptide names, biochemical formulas, or logos printed on the
          exterior packaging, ensuring complete discretion from dispatch to delivery.
        </p>
      </div>
    </LegalPageLayout>
  );
}
