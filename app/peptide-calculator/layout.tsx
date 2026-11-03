import type { Metadata } from "next";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Peptide Reconstitution Calculator | Amino Based";
const DESCRIPTION =
  "Calculate concentration in mg/mL and mcg/mL from vial mass and diluent volume. Includes the reconstitution formula and a vial size chart. Research use only.";
const PAGE_URL = `${siteUrl}/peptide-calculator`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Peptide Reconstitution Calculator",
    description: DESCRIPTION,
    url: PAGE_URL,
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

const RECONSTITUTION_STEPS = [
  {
    name: "Prep",
    text: "Let both the vial and the diluent sit until they reach room temperature. Wipe both stoppers with an alcohol swab and let them dry. Work on a clean, uncluttered surface with the calculation already done and written down. Knowing your target concentration before you open anything removes the guesswork later.",
  },
  {
    name: "Transfer",
    text: "Measure your chosen diluent volume accurately, then angle the vial and run the liquid slowly down the inside glass wall. A slow transfer matters, since a fast stream aimed straight at the powder drives shear and starts foaming, and both damage peptide structure. Keep the vial upright once the transfer is complete.",
  },
  {
    name: "Dissolve",
    text: "Swirl the vial gently, or roll it between your palms. Then wait for the powder to dissolve on its own. Most lyophilized peptides need only a few minutes, and some need longer. Shaking is the one thing to avoid completely. If the solution stays cloudy or leaves visible particles after it has had time to settle, treat the vial as compromised.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is peptide reconstitution?",
    a: "Peptide reconstitution is dissolving a lyophilized peptide powder in a measured volume of diluent to make a solution of known concentration. The vial's peptide mass is fixed by the manufacturer. You choose the volume of liquid you add, and those two numbers together determine the strength of the finished solution in mg/mL.",
  },
  {
    q: "How do you calculate peptide concentration?",
    a: "Divide the peptide mass printed on the vial by the diluent volume you added. A 10 mg vial in 2 mL of bacteriostatic water gives 10 ÷ 2, which is 5 mg/mL. To express the same result in micrograms, multiply by 1,000, giving 5,000 mcg/mL. The calculator on this page runs both steps.",
  },
  {
    q: "How much bacteriostatic water do I add to a 5 mg vial?",
    a: "There is no single correct volume, because the volume you choose is what sets the concentration. Adding 1 mL to a 5 mg vial gives 5 mg/mL. Adding 2 mL gives 2.5 mg/mL. Adding 3 mL gives roughly 1.67 mg/mL. Larger volumes produce lower concentrations and physically larger sample volumes to measure.",
  },
  {
    q: "How much bacteriostatic water do I add to a 10 mg vial?",
    a: "Again, the volume is your decision and it determines the result. One milliliter gives 10 mg/mL, two milliliters give 5 mg/mL, and three milliliters give 3.33 mg/mL. Choose based on the measuring equipment you have. Lower concentrations mean bigger volumes, which most pipettes and graduated devices read more reliably.",
  },
  {
    q: "Does adding more water change the concentration?",
    a: "Yes, and this catches people out. The peptide mass in the vial never changes, so adding diluent spreads that same mass across more liquid and lowers the concentration. A 5 mg vial at 2 mL sits at 2.5 mg/mL. Add another milliliter and it drops to roughly 1.67 mg/mL, so any earlier calculation is void.",
  },
  {
    q: "How long does a reconstituted peptide last?",
    a: "Around 28 days at 2 °C to 8 °C is the working reference for a peptide reconstituted in bacteriostatic water. Sterile water gives a shorter window, since it has no preservative. Actual stability depends on the peptide sequence, how often the vial is opened, and how consistently it stays cold between uses.",
  },
  {
    q: "Can you freeze reconstituted peptides?",
    a: "Generally avoid it for solutions made with bacteriostatic water. Freezing and thawing forms ice crystals that unfold and aggregate peptide, and repeated cycles compound the damage. If a solution must be held beyond its refrigerated window, split it into single-use aliquots first and thaw each one only once.",
  },
  {
    q: "Bacteriostatic water or sterile water, which should I use?",
    a: "Bacteriostatic water suits any vial that will be entered more than once. Its 0.9 percent benzyl alcohol suppresses bacterial growth between uses. Sterile water contains no preservative, so it fits single-use preparations and peptides known to react badly with benzyl alcohol. For most multi-day laboratory work, bacteriostatic water is the standard choice.",
  },
  {
    q: "Why should you not shake peptides?",
    a: "Shaking forces the solution against the air-water interface and creates foam. Peptides unfold at that interface, then clump together, and aggregated peptide does not return to its original state. Swirl the vial gently or roll it between your palms and leave it to dissolve on its own; patience costs nothing here.",
  },
  {
    q: "What does mg/mL mean?",
    a: "Milligrams per milliliter states how much peptide mass sits in each milliliter of solution. A vial at 2.5 mg/mL contains 2.5 milligrams of peptide in every milliliter of liquid present. Because it is a ratio describing the whole solution, the figure holds for any portion you measure out of the vial.",
  },
  {
    q: "How do I convert 200 mcg to mg?",
    a: "Divide by 1,000, so 200 mcg equals 0.2 mg. Going the other direction, multiply milligrams by 1,000 to get micrograms, which makes 0.2 mg equal to 200 mcg. Mixing these two units is a thousand-fold error, so write the unit alongside every number you record.",
  },
  {
    q: "Does this calculator tell me how much to use?",
    a: "No, and that is intentional: this tool performs concentration math only, converting a vial mass and a diluent volume into mg/mL and mcg/mL. It produces no dose figures, volumes to measure out for any purpose, or usage guidance. All products and calculations here are for laboratory research use only.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}#app`,
      name: "Peptide Reconstitution Calculator",
      url: PAGE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any modern web browser",
      browserRequirements: "Requires JavaScript",
      description:
        "Calculate concentration in mg/mL and mcg/mL from vial mass and diluent volume. Includes the reconstitution formula and a vial size chart. Research use only.",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${siteUrl}/#organization` },
      featureList: [
        "Working concentration in mg/mL and mcg/mL",
        "Dilution arithmetic breakdown",
        "Supports any vial size and diluent volume",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": `${siteUrl}/#website` },
      author: {
        "@type": "Organization",
        name: "Amino Based",
        url: `${siteUrl}/about-us`,
      },
      dateModified: "2026-09-29",
      mainEntity: { "@id": `${PAGE_URL}#app` },
      inLanguage: "en-US",
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Peptide Calculator", item: PAGE_URL },
      ],
    },
    {
      "@type": "HowTo",
      "@id": `${PAGE_URL}#howto`,
      name: "How to reconstitute peptides in three steps",
      description:
        "The three-step laboratory method for returning a lyophilized research peptide to solution without contamination or mechanical damage to the peptide structure.",
      supply: [
        { "@type": "HowToSupply", name: "Lyophilized research peptide vial" },
        { "@type": "HowToSupply", name: "Bacteriostatic water" },
        { "@type": "HowToSupply", name: "Alcohol swabs" },
      ],
      tool: [{ "@type": "HowToTool", name: "Graduated transfer tool" }],
      step: RECONSTITUTION_STEPS.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.name,
        text: step.text,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function PeptideCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
