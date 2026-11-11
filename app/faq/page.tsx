import type { Metadata } from "next";
import Footer from "@/components/Footer";
import FaqHubClient from "@/components/faq/FaqHubClient";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import { ALL_VISIBLE_FAQS } from "@/lib/faqHubData";
import { siteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Amino Based",
  description:
    "Answers on research peptide purity and COAs, shipping and tracking, payments, storage, returns, and legality from Amino Based.",
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Frequently Asked Questions | Amino Based",
    description:
      "Answers on research peptide purity and COAs, shipping and tracking, payments, storage, returns, and legality from Amino Based.",
    url: `${siteUrl}/faq`,
    siteName: "Amino Based",
    type: "website",
    images: [
      {
        url: `${siteUrl}/email/welcome-hero-amino.jpg`,
        width: 1200,
        height: 630,
        alt: "Frequently Asked Questions | Amino Based",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Amino Based",
    description:
      "Answers on research peptide purity and COAs, shipping and tracking, payments, storage, returns, and legality from Amino Based.",
    images: [`${siteUrl}/email/welcome-hero-amino.jpg`],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://aminobased.com/#organization",
      "name": "Amino Based",
      "alternateName": "Amino Based Research",
      "url": "https://aminobased.com/",
      "email": "support@aminobased.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://aminobased.com/#website",
      "url": "https://aminobased.com/",
      "name": "Amino Based",
      "publisher": {
        "@id": "https://aminobased.com/#organization",
      },
      "inLanguage": "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://aminobased.com/faq#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://aminobased.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "FAQ",
          "item": "https://aminobased.com/faq",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://aminobased.com/faq#webpage",
      "isPartOf": {
        "@id": "https://aminobased.com/#website",
      },
      "name": "Frequently Asked Questions | Amino Based",
      "description":
        "Answers on research peptide purity and COAs, shipping and tracking, payments, storage, returns, and legality from Amino Based.",
      "inLanguage": "en-US",
      "mainEntity": ALL_VISIBLE_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.plainAnswer,
        },
      })),
    },
  ],
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F0F11]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 md:pt-44 pb-12 md:pb-16 px-6 md:px-12 lg:px-24 border-b border-[#E4E4E7]">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Wayfinding Breadcrumbs */}
          <div className="flex justify-center">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Support & Research Hub", href: "/faq" },
                { label: "Frequently Asked Questions" },
              ]}
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#894EF2] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider text-[#894EF2] uppercase">
              Support &amp; Research Hub
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#0F0F11] leading-[1.08]">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#71717A] leading-relaxed max-w-3xl mx-auto">
            Everything below answers questions about ordering research peptides from Amino Based. The answers cover analytical purity testing and Certificates of Analysis (COAs), shipping procedures, storage standards, payment mechanics, and regulatory compliance. Every product listed is supplied strictly for laboratory and in-vitro research use only.
          </p>
        </div>
      </section>

      {/* Interactive FAQ Hub Client */}
      <div className="py-12 md:py-16">
        <FaqHubClient />
      </div>

      <Footer />
    </main>
  );
}
