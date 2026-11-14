import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Privacy Policy & Laboratory Data Governance | Amino Based";
const DESCRIPTION =
  "How Amino Based collects, utilizes, safeguards, and governs researcher data, institutional orders, and analytical records.";

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
      eyebrow="Data Protection"
      title="Privacy Policy & Laboratory Data Governance"
      intro="Amino Based is committed to the highest standards of researcher privacy, data security, and confidentiality. This policy outlines how information is collected, processed, and safeguarded throughout your relationship with our laboratory synthesis network."
      lastUpdated="November 14, 2026"
    >
      <div>
        <h2>1. Principles of Data Stewardship</h2>
        <p>
          We operate as an analytical chemical supplier serving university departments, research institutions, and qualified
          biochemical investigators. We adhere strictly to the principle of data minimization: we collect only information
          essential to verify scientific eligibility, fulfill temperature-sensitive cold-chain orders, maintain synthesis batch
          traceability, and comply with state and federal chemical distribution regulations.
        </p>
      </div>

      <div>
        <h2>2. Categories of Information Collected</h2>
        <p>We collect and manage information in the following functional categories:</p>
        <ul>
          <li>
            <strong>Researcher &amp; Institutional Account Information:</strong> Full name, institutional affiliation, academic or
            corporate department, verified professional email address, telephone number, and secure account credentials.
          </li>
          <li>
            <strong>Transaction &amp; Order Fulfillment Records:</strong> Physical laboratory delivery address, billing coordinates,
            compound lots requested, vial specifications, custom synthesis parameters, and payment confirmation tokens. Note: Full
            credit card numbers are processed directly by PCI-DSS Level 1 certified payment gateways and are never stored on Amino
            Based servers.
          </li>
          <li>
            <strong>Analytical Communications &amp; Support Inquiries:</strong> Inquiries regarding lot-specific Certificates of
            Analysis, cold-chain handling inquiries, reconstitution guidance, and technical customer service messages.
          </li>
          <li>
            <strong>Partner &amp; Affiliate Data:</strong> Payout coordinates (e.g., PayPal email, ACH routing, or wallet addresses),
            tax classification identifiers where applicable, referral clicks, and settled commission logs.
          </li>
          <li>
            <strong>Technical &amp; Telemetry Data:</strong> IP address, browser type, device identifiers, referring URLs, and
            essential session cookies necessary to maintain authenticated portal access and cart integrity.
          </li>
        </ul>
      </div>

      <div>
        <h2>3. Lawful Basis &amp; Purposes of Processing</h2>
        <p>Your information is processed exclusively for legitimate operational and compliance requirements, including:</p>
        <ul>
          <li>Verifying laboratory credentials and age eligibility (&ge;21 years) prior to order approval.</li>
          <li>Packaging, dispatching, and tracking temperature-sensitive cold-chain shipments to authorized laboratory destinations.</li>
          <li>Maintaining lot-specific chain-of-custody documentation and recall capabilities required for chemical traceability.</li>
          <li>Accrediting commission payouts to approved partners within our 30-day attribution window.</li>
          <li>Preventing fraudulent orders, credit abuse, or unauthorized non-laboratory transactions.</li>
          <li>Communicating critical safety notices, synthesis batch releases, and Certificate of Analysis updates.</li>
        </ul>
      </div>

      <div>
        <h2>4. Cookie Policy &amp; Tracking Technologies</h2>
        <p>
          Amino Based uses cookies, local storage, and similar web technologies strictly to provide essential website
          functionality:
        </p>
        <ul>
          <li>
            <strong>Essential Session Cookies:</strong> Required to keep you authenticated in your account, remember cart contents,
            and navigate the checkout sequence securely.
          </li>
          <li>
            <strong>Partner Attribution Cookies:</strong> Store your affiliate referrer identifier for up to 30 days to ensure
            accurate credit assignment. These cookies do not monitor third-party browsing activity across external websites.
          </li>
          <li>
            <strong>Analytics &amp; Performance:</strong> We use two third-party analytics services, described below, to
            understand how the site is used and to improve it. We do not participate in cross-site behavioural ad-tracking
            networks.
          </li>
        </ul>
        <h3>Google Analytics</h3>
        <p>
          Google Analytics records which pages you visit, the page you arrived from, and aggregate information about your
          device, browser, and approximate location. Before a page address is sent to Google, we remove sensitive query
          parameters from it, including the one-time access links used for order receipts.
        </p>
        <h3>Microsoft Clarity — session recordings and heatmaps</h3>
        <p>
          Microsoft Clarity records individual browsing sessions and builds heatmaps showing where visitors click and scroll.
          This is more detailed than aggregate analytics. A Clarity session recording may capture:
        </p>
        <ul>
          <li>The pages you view and the addresses of those pages.</li>
          <li>Mouse movement, clicks, taps, scrolling, and how long you spend on a page.</li>
          <li>The content of the page as it was displayed to you, including text you typed into forms.</li>
          <li>Your device type, screen size, browser, operating system, and approximate location.</li>
          <li>An identifier Microsoft uses to recognise a returning visitor.</li>
        </ul>
        <p>
          A session recording is not anonymous: it is a reconstruction of one person&apos;s visit, and it may be linked to
          that returning-visitor identifier.
        </p>
        <p>
          We take the following specific steps to keep Clarity away from personal information. Clarity is not loaded at all on
          pages that display or collect it — your account pages, checkout, order confirmations, sign-in, registration and
          password-reset pages, the administrative console, the partner dashboard, and the military and veteran verification
          page. Those pages, and your name where it appears in the site header, are additionally marked so that Clarity masks
          their content. These measures are specific to the pages and elements listed; they are not a guarantee that no
          personal information can ever appear in a recording.
        </p>
      </div>

      <div>
        <h2>5. Confidentiality &amp; Third-Party Disclosure</h2>
        <p>
          <strong>We do not sell, rent, monetize, or trade researcher data to third-party data brokers or marketing firms.</strong>{" "}
          Information is shared solely with vetted operational service providers under strict data processing agreements:
        </p>
        <ul>
          <li>Logistics and cold-chain courier partners (e.g., FedEx, UPS) solely for domestic and international package transit.</li>
          <li>Encrypted PCI-compliant merchant processors to securely authorize transactional charges.</li>
          <li>Transactional communication infrastructure to transmit order confirmations, dispatch updates, and password resets.</li>
          <li>
            Governmental, regulatory, or law enforcement bodies strictly when compelled by valid judicial subpoena, statutory
            mandate, or to prevent unlawful chemical distribution.
          </li>
        </ul>
        <p>
          In addition, the analytics services described in Section 4 are operated by third parties, and the information
          described there is collected by them directly: Google Analytics by Google, and Clarity by Microsoft. Their own
          privacy notices govern what they do with it.
        </p>
      </div>

      <div>
        <h2>6. Security Infrastructure &amp; Data Retention</h2>
        <p>
          We employ military-grade 256-bit Transport Layer Security (TLS) encryption across all endpoints, rigorous database
          firewalls, and multi-factor authentication protocols for administrative personnel. Order and transaction logs are retained
          for the duration required to satisfy commercial tax regulations, chemical synthesis traceability standards, and warranty
          periods, after which records are securely purged.
        </p>
      </div>

      <div>
        <h2>7. Your Rights &amp; Access Controls</h2>
        <p>
          Depending on your regional jurisdiction (including GDPR, CCPA/CPRA, and state privacy frameworks), you maintain statutory
          rights regarding your personal data:
        </p>
        <ul>
          <li>The right to inspect, review, and receive an export of your stored personal information.</li>
          <li>The right to request immediate rectification of inaccurate account details or outdated institutional addresses.</li>
          <li>
            The right to request permanent deletion of your profile, subject to statutory retention obligations for completed
            chemical transactions.
          </li>
          <li>The right to opt out of promotional notifications and research newsletter digests at any time.</li>
        </ul>
        <p>
          To exercise any of these privacy rights, contact our Data Governance Officer via our{" "}
          <a href="/contact-us">Contact page</a> with your account credentials.
        </p>
      </div>
    </LegalPageLayout>
  );
}
