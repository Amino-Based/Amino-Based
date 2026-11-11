import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  FileText,
  Activity,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Footer from "@/components/Footer";
import FAQSection, { type FAQItem } from "@/components/FAQSection";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "About Amino Based | Pure Peptide Synthesis for Research Excellence";
const DESCRIPTION =
  "Inside the US facility behind Amino Based: automated solid-phase peptide synthesis, independent HPLC and mass spectrometry verification, and a Certificate of Analysis on every batch. RUO.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/about-us` },
  openGraph: {
    title: TITLE,
    description:
      "A US-based synthesis facility, independent HPLC and mass spectrometry verification, and a Certificate of Analysis on every batch. For laboratory research use only.",
    url: `${siteUrl}/about-us`,
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

// 7 Comprehensive About Us FAQs matching homepage accordion system
const ABOUT_FAQS: FAQItem[] = [
  {
    question: "Where are Amino Based research peptides synthesized?",
    answer:
      "All Amino Based compounds are manufactured in domestic United States laboratory facilities equipped with automated solid-phase peptide synthesis (SPPS) platforms, high-vacuum lyophilization manifolds, and controlled cleanroom environments.",
  },
  {
    question: "What analytical methods verify compound purity and identity?",
    answer:
      "Every batch is verified through reverse-phase High-Performance Liquid Chromatography (RP-HPLC) with photodiode array detection to quantify chemical purity, combined with Electrospray Ionization Mass Spectrometry (ESI-MS) to confirm exact molecular mass against theoretical sequence.",
  },
  {
    question: "Are analytical tests performed in-house or by independent laboratories?",
    answer:
      "To ensure absolute neutrality and objective compliance, analytical verification is performed by accredited third-party analytical laboratories. Every lot report includes spectral chromatograms, raw integration data, and analyst sign-offs.",
  },
  {
    question: "What is your guaranteed analytical purity threshold?",
    answer:
      "We guarantee a minimum purity threshold of ≥99.0% across our catalog. Any synthesis lot failing to reach this analytical purity standard is rejected and never released to researchers.",
  },
  {
    question: "How are vials stored and handled prior to dispatch?",
    answer:
      "Finished lyophilized peptides are hermetically sealed in Type-1 borosilicate glass vials with PTFE-faced butyl stoppers under inert gas, stored at -20°C in cryogenic laboratory freezers, and packed with insulated thermal buffering for outbound shipping.",
  },
  {
    question: "How can researchers verify the Certificate of Analysis (COA)?",
    answer:
      "Each vial features a unique printed lot identifier. Researchers can look up the corresponding batch on our public Certificates repository or download the complete PDF COA containing HPLC purity charts and ESI-MS spectral curves directly from the product page.",
  },
  {
    question: "What regulatory standards govern the use of these compounds?",
    answer:
      "All compounds supplied by Amino Based are sold strictly for in-vitro laboratory research and biochemical investigation (RUO). They are not intended for human or veterinary use, clinical diagnostics, pharmaceuticals, cosmetics, or consumer applications.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Amino Based",
      alternateName: "Amino Based Research",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/amino-logo.svg`,
      },
      description:
        "United States supplier of research-grade peptides produced by solid-phase peptide synthesis and verified by independent HPLC and mass spectrometry analysis, with a Certificate of Analysis on every batch. For laboratory research use only.",
      email: "support@aminobased.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@aminobased.com",
        areaServed: "US",
        availableLanguage: "English",
      },
    },
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about-us#webpage`,
      url: `${siteUrl}/about-us`,
      name: TITLE,
      description: DESCRIPTION,
      mainEntity: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
      breadcrumb: { "@id": `${siteUrl}/about-us#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/about-us#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "About Us", item: `${siteUrl}/about-us` },
      ],
    },
  ],
};

const STATS = [
  {
    value: "10+",
    label: "Years in Synthesis",
    sub: "Dedicated peptide research & automated SPPS experience.",
  },
  {
    value: "1,000+",
    label: "Verified Batches",
    sub: "Independently documented synthesis lots released to labs.",
  },
  {
    value: "≥99%",
    label: "Target HPLC Purity",
    sub: "Strict chemical purity standard verified by UV detection.",
  },
  {
    value: "99.8%",
    label: "Batch Consistency",
    sub: "Unequivocal spectral alignment against reference libraries.",
  },
];

const PARTNERS = [
  { name: "Reverse-Phase HPLC Core", tag: "Liquid Chromatography" },
  { name: "ESI-MS Analytical Lab", tag: "Mass Spectrometry" },
  { name: "ISO Class 7 Cleanroom", tag: "Synthesis Facility" },
  { name: "Third-Party QA Testing", tag: "Independent Audit" },
  { name: "Vacuum Lyophilization", tag: "Purity Preservation" },
  { name: "Cold-Chain Logistics", tag: "Cryo Storage -20°C" },
];

const CATALOG_ITEMS = [
  {
    title: "Metabolic & Incretin Research",
    count: "15+ Compounds",
    tag: "Dual & Triple Agonists",
    image: "/assets/about/creative_metabolic.webp",
    description: "Tirzepatide, Semaglutide, Retatrutide and novel incretin receptor probes for cellular metabolic assays.",
    href: "/shop?category=Metabolic",
  },
  {
    title: "Cellular Repair & Tissue Motility",
    count: "20+ Compounds",
    tag: "Cytoprotective Sequences",
    image: "/assets/about/creative_repair.webp",
    description: "BPC-157, TB-500, KPV and angiogenic signalling peptides synthesized for tissue regeneration studies.",
    href: "/shop?category=Repair",
  },
  {
    title: "Mitochondrial & Cellular Longevity",
    count: "25+ Compounds",
    tag: "Mitochondrial Probes",
    image: "/assets/about/creative_longevity.webp",
    description: "MOTS-c, SS-31, Epithalon and NAD+ pathway modulators for oxidative stress and mitochondrial kinetics.",
    href: "/shop?category=Longevity",
  },
];

const WORK_STEPS = [
  {
    step: "01",
    title: "In Silico Sequence Validation & Scope",
    description:
      "Every project begins with computerized sequence verification, predicting hydrophobic clusters, aggregation tendencies, and secondary structures to optimize solid-phase coupling efficiency.",
  },
  {
    step: "02",
    title: "Automated Solid-Phase Peptide Synthesis (SPPS)",
    description:
      "Assembly occurs on high-load polystyrene resins using microwave-assisted Fmoc protocols, guaranteeing maximum stepwise coupling rates for both short oligomers and complex 40+ amino acid chains.",
  },
  {
    step: "03",
    title: "Reverse-Phase HPLC Fractionation",
    description:
      "Crude peptides undergo preparative high-performance liquid chromatography using C18 stationary phases and acetonitrile-water gradients to isolate target fractions at ≥99% purity.",
  },
  {
    step: "04",
    title: "Electrospray Mass Spectrometry (ESI-MS)",
    description:
      "Purified fractions are subjected to electrospray ionization mass spectrometry to confirm exact molecular mass within ±0.5 Da of theoretical sequence before acceptance.",
  },
  {
    step: "05",
    title: "Lyophilization & Lot COA Certification",
    description:
      "Compounds are deep-frozen and sublimated under ultra-low vacuum into uniform white lyophilized cakes, sealed under inert nitrogen, and stamped with an independent Certificate of Analysis.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-[#071739]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =========================================================================
          SECTION 1: HERO BANNER (Matches Reference Image Large Rounded Card)
          ========================================================================= */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl lg:max-w-[1380px] mx-auto">
        {/* Wayfinding Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "About Us" },
            ]}
          />
        </div>

        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex items-end p-6 sm:p-10 lg:p-16 border border-[#E4E4E7] shadow-xl">
          
          {/* Background Image with High-Tech Architecture / Facility Look */}
          <Image
            src="/assets/about/about_hero_synthesis.jpg"
            alt="Amino Based Advanced Peptide Synthesis Facility"
            fill
            className="object-cover object-center scale-105"
            priority
          />

          {/* Gradient Overlay for Crisp Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071739]/95 via-[#071739]/60 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,150,200,0.25),transparent_60%)]" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl space-y-5 sm:space-y-6">
            
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-medium tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#0096c8] animate-pulse" />
              <span>United States Laboratory Standard</span>
            </div>

            {/* Main Headline (Clean Sans + Serif Accent) */}
            <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-serif font-normal text-white tracking-tight leading-[1.08]">
              Pure Peptide Synthesis for Research Excellence
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl font-light">
              Advancing biomedical discovery through automated solid-phase assembly, independent HPLC/MS purity testing, and complete batch analytical transparency.
            </p>

            {/* White Pill Action Button (Exact Match to Reference CTA) */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-[#071739] text-xs sm:text-sm font-bold tracking-wide uppercase hover:bg-[#0096c8] hover:text-white transition-all duration-300 shadow-lg group"
              >
                <span>Explore Research Catalog</span>
                <span className="w-6 h-6 rounded-full bg-[#071739] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#071739] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 2: ABOUT US + 4 STAT METRICS (Matches Reference 2-Col + 2x2 Grid)
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl lg:max-w-[1380px] mx-auto border-t border-[#E4E4E7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading + Narrative Paragraph */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0096c8]">
              <Sparkles className="w-4 h-4" />
              <span>About Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#071739] tracking-tight leading-tight">
              Built on unequivocal analytical proof and synthesis integrity.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#52525B] leading-relaxed">
              <p>
                Amino Based was founded by biochemists and laboratory researchers frustrated by inconsistent commercial peptide standards, opaque synthesis sourcing, and inadequate third-party testing.
              </p>
              <p>
                Operating from domestic US laboratory suites, we manufacture research-grade peptides through automated solid-phase synthesis (SPPS). Every compound released is cross-referenced by independent analytical laboratories utilizing photodiode array RP-HPLC and Electrospray Ionization Mass Spectrometry (ESI-MS).
              </p>
              <p className="font-medium text-[#071739]">
                We guarantee ≥99.0% chemical purity on every production lot, accompanied by a public, downloadable Certificate of Analysis with full chromatographic traces.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#71717A]">
              <span className="inline-flex items-center gap-1.5 text-[#0096c8] font-bold">
                <CheckCircle2 className="w-4 h-4" /> RUO Compliant
              </span>
              <span>•</span>
              <span>Domestic US Facility</span>
              <span>•</span>
              <span>Lot-Specific COA</span>
            </div>

          </div>

          {/* Right Column: 2x2 Metric Grid (Clean Minimalist Cards) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-[24px] bg-[#FAFAFC] border border-[#E4E4E7] hover:border-[#0096c8]/40 transition-colors shadow-2xs space-y-3"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#071739] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-[#071739]">
                  {stat.label}
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 3: INSTITUTIONAL PARTNER / ACCREDITATION LOGO RIBBON
          ========================================================================= */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFC] border-y border-[#E4E4E7]">
        <div className="max-w-7xl lg:max-w-[1380px] mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
              Analytical Verification Standards &amp; Facility Accreditations
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#E4E4E7] flex flex-col items-center text-center justify-center space-y-1 shadow-2xs"
              >
                <span className="text-xs font-bold text-[#071739]">
                  {partner.name}
                </span>
                <span className="text-[10px] font-mono text-[#0096c8] uppercase">
                  {partner.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 4: RESEARCH CATALOG SHOWCASE ("Property Catalog" in Reference)
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl lg:max-w-[1380px] mx-auto">
        <div className="space-y-10">
          
          {/* Header Row: Left Title + Right Navigation Arrows */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E4E4E7]">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0096c8]">
                <FlaskConical className="w-4 h-4" />
                <span>Research Catalog</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#071739] tracking-tight">
                High-Purity Sequences for In Vitro Investigation
              </h2>
              <p className="text-sm text-[#52525B]">
                A comprehensive selection of verified peptide compounds produced for university laboratories and analytical research teams.
              </p>
            </div>

            {/* Pagination / Browse Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0096c8] hover:text-[#0284c7] transition-colors mr-2"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous category"
                  className="w-10 h-10 rounded-full border border-[#E4E4E7] bg-white hover:bg-[#FAFAFC] text-[#071739] flex items-center justify-center transition-colors shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next category"
                  className="w-10 h-10 rounded-full border border-[#E4E4E7] bg-white hover:bg-[#FAFAFC] text-[#071739] flex items-center justify-center transition-colors shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Tall Vertically-Rounded Photo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {CATALOG_ITEMS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="group relative rounded-[26px] overflow-hidden bg-white border border-[#E4E4E7] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Tall Aspect Ratio */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAFAFC]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071739]/90 via-[#071739]/30 to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-md border border-white/20">
                      {item.tag}
                    </span>
                  </div>

                  {/* Bottom Text Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <div className="text-xs font-mono text-[#0096c8] font-bold">
                      {item.count}
                    </div>
                    <h3 className="text-xl font-serif font-normal leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Card Description Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-mono font-bold text-[#071739] group-hover:text-[#0096c8] transition-colors">
                    <span>Inspect Sequences</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 5: HOW WE WORK / QUALITY PIPELINE ("How we work" in Reference)
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFC] border-t border-[#E4E4E7]">
        <div className="max-w-7xl lg:max-w-[1380px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Tall Vertically-Rounded Photo with Floating Quality Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden aspect-[3/4] sm:h-[580px] w-full border border-[#E4E4E7] shadow-xl">
                <Image
                  src="/assets/about/creative_quality_process.webp"
                  alt="Amino Based Synthesis Quality Verification"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071739]/60 via-transparent to-transparent" />
              </div>

              {/* Floating Circular Guarantee Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-2 border-[#0096c8] p-4 flex flex-col items-center justify-center text-center shadow-2xl">
                <ShieldCheck className="w-7 h-7 text-[#0096c8] mb-1" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#071739] leading-tight">
                  HPLC / MS
                </span>
                <span className="text-[9px] text-[#71717A] uppercase tracking-wide">
                  Verified Batch
                </span>
              </div>
            </div>

            {/* Right Column: 5 Sequential Process Steps Separated by Hairline Dividers */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[#0096c8]">
                  <Layers className="w-4 h-4" />
                  <span>Quality Process</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#071739] tracking-tight">
                  How We Work: From Synthesis to Release
                </h2>
                <p className="text-sm text-[#52525B] leading-relaxed max-w-xl">
                  Our systematic 5-tier laboratory pipeline guarantees every vial dispatched adheres to unequivocal analytical benchmarks.
                </p>
              </div>

              {/* 5 Sequential Steps */}
              <div className="divide-y divide-[#E4E4E7] border-y border-[#E4E4E7]">
                {WORK_STEPS.map((step, idx) => (
                  <div key={idx} className="py-5 sm:py-6 flex items-start gap-4 sm:gap-6 group">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#0096c8] shrink-0 mt-0.5">
                      {step.step}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-[#071739] tracking-tight group-hover:text-[#0096c8] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 6: ABOUT FAQS
          ========================================================================= */}
      <FAQSection
        id="about-faqs"
        badgeText="Facility Inquiries"
        faqs={ABOUT_FAQS}
        calloutTitle="Questions About Our Facility?"
        calloutText="Need custom peptide synthesis specifications, volume lot reservations, or technical documentation? Our scientific team is here to assist."
        calloutButtonText="Contact Lab Support"
        calloutButtonLink="/contact-us"
      />


      {/* =========================================================================
          SECTION 7: CLOSING RUO BANNER & MASTER FOOTER
          ========================================================================= */}
      <section className="bg-[#071739] text-white py-12 px-4 sm:px-6 lg:px-8 text-center border-t border-[#0096c8]/30">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#0096c8] uppercase tracking-wider">
            <span>RUO Policy Notice</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif">
            Dedicated Exclusively to In Vitro &amp; Biochemical Research
          </h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
            All materials supplied by Amino Based are intended strictly for in vitro laboratory research and biochemical investigation. They are not pharmaceuticals, medical products, or food additives.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
