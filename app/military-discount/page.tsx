import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import MilitaryDiscountSection from "@/components/MilitaryDiscountSection";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
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
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative bg-white overflow-hidden pt-28 pb-16 px-6 md:px-12 md:pt-36 lg:px-24 border-b border-[#E2E8F0]">
        {/* Subtle ambient glows — navy/cyan palette */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#031B4E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Wayfinding Breadcrumbs */}
          <div className="flex justify-center mb-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Military & Veteran Verification" },
              ]}
            />
          </div>

          {/* Cyan badge / eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Honoring Our Heroes
          </div>

          <h1 className="font-serif font-normal text-4xl md:text-6xl text-[#071739] leading-[1.15] mb-6">
            Military &amp; Veteran{" "}
            <span className="italic text-[#031B4E]">Discount</span>
          </h1>

          <p className="text-[#64748B] text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto">
            Active duty, reserve, and veteran researchers receive 30% off with a
            verified Military ID. Submit a photo of your ID below and our team
            will review it and email you a one-time discount code.
          </p>
        </div>
      </section>

      <MilitaryDiscountSection showForm={true} />

      <Footer />
    </main>
  );
}
