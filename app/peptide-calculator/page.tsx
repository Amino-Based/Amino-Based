import React from "react";
import type { Metadata } from "next";
import PeptideCalculatorClient from "@/components/calculator/PeptideCalculatorClient";
import { CALCULATOR_FAQS } from "@/lib/calculatorFaqs";
import Footer from "@/components/Footer";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Peptide Concentration Calculator — Reconstitution Guide | Amino Based";
const DESCRIPTION =
  "Peptide concentration calculator: enter vial mass in mg and diluent volume in mL to get concentration in mg/mL and mcg/mL, with a full reconstitution guide, lookup chart, storage rules and FAQs. Research use only.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/peptide-calculator` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/peptide-calculator`,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/assets/calculator/amino-based-calculator-hero.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${siteUrl}/assets/calculator/amino-based-calculator-hero.png`],
  },
};

export default function PeptideCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (CALCULATOR_FAQS || []).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main>
        <PeptideCalculatorClient />
      </main>
      <Footer />
    </>
  );
}
