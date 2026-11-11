import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import ScrollToTopButton from "@/components/contact/ScrollToTopButton";
import { siteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Contacts | Amino Based",
  description:
    "We are always ready to help you and answer your questions. Get in touch with our peptide research support team for technical inquiries, institutional quotes, or order support.",
  alternates: {
    canonical: `${siteUrl}/contact-us`,
  },
  openGraph: {
    title: "Contacts | Amino Based",
    description:
      "We are always ready to help you and answer your questions. Get in touch with our peptide research support team.",
    url: `${siteUrl}/contact-us`,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/assets/peptide_contact_hero.jpg` }],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Amino Based",
      alternateName: "AminoBased",
      url: siteUrl,
      email: "support@aminobased.com",
      telephone: "+1-704-555-0127",
      address: {
        "@type": "PostalAddress",
        streetAddress: "3891 Ranchview Dr.",
        addressLocality: "Richardson",
        addressRegion: "CA",
        postalCode: "62639",
        addressCountry: "US",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@aminobased.com",
          telephone: "+1-704-555-0127",
          areaServed: "US",
          availableLanguage: "English",
        },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": `${siteUrl}/contact-us#webpage`,
      url: `${siteUrl}/contact-us`,
      name: "Contacts | Amino Based",
      description:
        "We are always ready to help you and answer your questions. Contact our laboratory support specialists.",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
    },
  ],
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A] relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Floating Scroll-to-Top Button matching reference (red circular button) */}
      <ScrollToTopButton />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION (MATCHING REFERENCE SIZE & PEPTIDE THEME)          */}
      {/* ========================================================================= */}
      <section className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8 max-w-[1360px] mx-auto mb-14 sm:mb-20 md:mb-24">
        <div className="relative w-full rounded-[24px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[440px] aspect-[2.4/1] flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none shadow-sm border border-black/5">
          
          {/* Peptide Fluid & Helical Molecular Background Image */}
          <Image
            src="/assets/peptide_contact_hero.jpg"
            alt="Amino Based peptide research and molecular formulation"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1360px"
            className="object-cover object-center"
          />

          {/* Left-to-Right Dark Ambient Overlay Scrim for Crisp Typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />

          {/* Top Left: Logo / Emblem & Main Title */}
          <div className="relative z-10 flex flex-col items-start">
            {/* Molecular emblem badge */}
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 mb-4 sm:mb-6 shadow-xs">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <circle cx="6" cy="12" r="2.8" />
                <circle cx="18" cy="7" r="2.8" />
                <circle cx="18" cy="17" r="2.8" />
                <path d="M8.5 11L15.5 8M8.5 13L15.5 16" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>

            {/* Title: Contacts */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-sans drop-shadow-xs">
              Contacts
            </h1>
          </div>

          {/* Right Edge: Giant Vertical Outline Typography "Contacts" matching reference */}
          <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden sm:block">
            <span
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-widest text-transparent [writing-mode:vertical-rl] opacity-40 select-none"
              style={{ WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.75)" }}
            >
              Contacts
            </span>
          </div>

          {/* Bottom Right Tab: "Home / Contacts" Breadcrumb nestled into the card corner */}
          <div className="absolute bottom-0 right-4 sm:right-8 md:right-12 z-10 bg-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-t-2xl flex items-center shadow-xs">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Contacts" },
              ]}
            />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN SECTION: "WE ARE ALWAYS READY TO HELP..." + FORM CARD   */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading, Subtitle & 4-Grid Contact Channels (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Mono Tag */}
              <span className="text-xs sm:text-sm font-mono text-[#64748B] tracking-wider block mb-4">
                / get in touch /
              </span>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-[#0F172A] leading-[1.14] mb-6">
                We are always ready to help you and answer your questions
              </h2>

              {/* Subtitle Description */}
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-lg mb-12 sm:mb-16">
                Whether you are planning analytical research protocols, requesting lot-specific Certificates of Analysis, or coordinating custom institutional peptide synthesis, our laboratory team is available to assist.
              </p>
            </div>

            {/* 4-Item Information Grid matching reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 pt-2 border-t border-gray-100">
              
              {/* Call Center */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] mb-2 tracking-tight">
                  Call Center
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  (704) 555-0127
                </p>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  +1 (800) 529-1037
                </p>
              </div>

              {/* Our Location */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] mb-2 tracking-tight">
                  Our Location
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  USA, California - 62639
                </p>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  3891 Ranchview Dr. Richardson
                </p>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] mb-2 tracking-tight">
                  Email
                </h3>
                <a
                  href="mailto:support@aminobased.com"
                  className="text-xs sm:text-sm text-[#475569] hover:text-[#0F172A] transition-colors"
                >
                  support@aminobased.com
                </a>
              </div>

              {/* Social Network */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] mb-2.5 tracking-tight">
                  Social network
                </h3>
                <div className="flex items-center gap-4 text-[#475569]">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0F172A] transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0F172A] transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0F172A] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0F172A] transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Sleek Light Grey Form Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#F4F5F7] rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 md:p-12 border border-[#E9EAEF] shadow-2xs">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-2">
                Get in Touch
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mb-8 leading-relaxed">
                Define your goals and identify areas where our peptide specialists can assist your research.
              </p>

              {/* Minimalist Underline Form */}
              <ContactForm />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MODERN MAP SECTION (MATCHING REFERENCE CONTAINER & MONOCHROME STYLE)   */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 mb-20 sm:mb-28">
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#E4E4E7] shadow-xs bg-[#E5E7EB]">
          
          {/* Styled Google Maps iframe with desaturated / clean map view */}
          <iframe
            title="Amino Based Research Facility Location"
            src="https://maps.google.com/maps?q=3891+Ranchview+Dr,+Richardson,+CA&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 filter grayscale contrast-[1.08] opacity-90"
            loading="lazy"
            allowFullScreen
          />

          {/* Interactive Floating Location Card Overlay on Top Left matching reference */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200/80 max-w-[280px] sm:max-w-[340px]">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                  Amino Based Research Facility
                </h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  3891 Ranchview Dr. Richardson, California 62639
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=3891+Ranchview+Dr,+Richardson,+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                title="Get Directions"
                aria-label="Get Directions"
              >
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#0F172A] font-semibold pt-2 border-t border-gray-100">
              <span>4.9</span>
              <span className="text-amber-500 tracking-tighter">★★★★★</span>
              <span className="text-xs text-[#64748B] font-normal ml-0.5">(184 reviews)</span>
            </div>
          </div>

          {/* Subtle bottom gradient vignette */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOOTER (UNIFIED WITH ALL PAGES: FULL "AMINO BASED" WORDMARK)           */}
      {/* ========================================================================= */}
      <Footer />
    </main>
  );
}
