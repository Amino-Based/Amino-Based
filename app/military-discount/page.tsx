import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import MilitaryDiscountSection from "@/components/MilitaryDiscountSection";
import Footer from "@/components/Footer";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Military & Veteran Discount | Amino Based";
const DESCRIPTION =
  "Active duty, reserve, and veteran researchers get 30% off with a verified Military ID. Submit your verification to receive a one-time discount code.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/military-discount` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/military-discount`,
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

export default function MilitaryDiscountPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative bg-[#FAFAFA] text-gray-900 overflow-hidden pt-28 pb-16 px-6 md:px-12 md:pt-36 lg:px-24">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 rounded uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> Honoring Our Heroes
          </div>
          <h1 className="text-4xl md:text-6xl font-inter uppercase font-bold tracking-wider text-gray-900 leading-[1.2] mb-6">
            Military &amp; Veteran <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Discount</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
            Active duty, reserve, and veteran researchers receive 30% off with a verified Military ID.
            Submit a photo of your ID below and our team will review it and email you a one-time discount code.
          </p>
        </div>
      </section>

      <MilitaryDiscountSection showForm={true} />

      <Footer />
    </main>
  );
}
