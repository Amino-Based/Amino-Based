import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Link2,
  LineChart,
  LogIn,
  ShieldCheck,
  TrendingUp,
  XCircle,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { AffiliateSettings } from "@/lib/types/affiliate";
import ApplyForm from "@/components/affiliates/ApplyForm";
import AffiliateBenefitsSection from "@/components/affiliates/AffiliateBenefitsSection";
import AboutPageAnimator from "@/components/about/AboutPageAnimator";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import { siteUrl } from "@/lib/siteUrl";

const PAGE_URL = `${siteUrl}/affiliates`;
const TITLE = "Peptide Affiliate Program | 10% Commission | Amino Based";
const DESCRIPTION =
  "Earn 10% commission promoting research-grade peptides. 30-day cookie, dual link and code tracking, $50 minimum payout, paid monthly. Apply free in minutes.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Peptide Affiliate Program | 10% Commission",
    description:
      "Earn 10% commission with a 30-day cookie, dual link and code attribution, a $50 minimum payout and monthly payments. Research use only positioning throughout.",
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

export const dynamic = "force-dynamic";

async function getAffiliateSettings(): Promise<AffiliateSettings> {
  const fallback: AffiliateSettings = {
    defaultCommissionRate: 10,
    defaultCommissionType: "percentage",
    defaultCookieDurationDays: 30,
    defaultPendingPeriodDays: 14,
    defaultMinimumPayoutThreshold: 50,
    defaultCommissionOn: "subtotal_after_coupon",
  };
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "affiliate-settings" });
    return (settings as unknown as AffiliateSettings) ?? fallback;
  } catch (err) {
    console.error("Failed to load affiliate settings:", err);
    return fallback;
  }
}

const processSteps = [
  {
    number: "01",
    title: "Apply For Approval",
    description:
      "Submit the verified application form. There is no fee and no minimum follower requirement. We review each application against our Research Use Only content standards.",
  },
  {
    number: "02",
    title: "Receive Link & Code",
    description:
      "Upon approval, your partner portal issues an authenticated referral link and custom discount code. Both track independently and activate immediately.",
  },
  {
    number: "03",
    title: "Publish Compliant Content",
    description:
      "Share with your scientific readers, laboratory subscribers, or academic network. Official product photography and purity data sheets are provided.",
  },
  {
    number: "04",
    title: "Automated Monthly Payouts",
    description:
      "Commissions accrue in real time as orders settle. Once your balance clears the $50 threshold, payments disburse automatically each month.",
  },
];

const purposeFeatures = [
  {
    icon: TrendingUp,
    title: "Commission On Every Qualified Sale",
    description: "Earn predictable revenue on every verified peptide order, backed by solid-phase synthesis quality.",
  },
  {
    icon: BadgePercent,
    title: "Audience Discount Incentive",
    description: "Referred laboratory customers receive checkout savings, making your referral naturally compelling.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytical Tracking",
    description: "Observe real-time impressions, conversions, and settled commissions directly within your dashboard.",
  },
  {
    icon: DollarSign,
    title: "Reliable Monthly Disbursements",
    description: "Cleared balances are paid on an orderly monthly schedule with full reporting transparency.",
  },
];

const prohibitedPractices = [
  "No medical, therapeutic, diagnostic, or human-use claims regarding any research peptide",
  "No athletic performance enhancement, cosmetic, or weight-loss outcome framing",
  "No PPC bidding on “Amino Based” or trademarked brand terms in paid search",
  "No unauthorized alteration of the Amino Based seal, logos, or Certificate of Analysis files",
  "No therapeutic promises, health claims, or consumer ingestion recommendations",
  "No deceptive income representations or multi-tier recruitment tactics",
];

const contentStandards = [
  "Maintain an analytical, scientific tone strictly aligned with Research Use Only (RUO) standards",
  "Prominently disclose the affiliate relationship in accordance with FTC endorsement rules",
  "Direct traffic exclusively to active catalog items and lot-verified compound URLs",
  "Consistently reiterate that compounds are intended solely for in-vitro laboratory investigation",
  "Utilize only verified marketing materials and analytical documentation provided in your portal",
];

function buildJsonLd(
  settings: AffiliateSettings,
  commissionLabel: string,
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-US",
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Affiliate Program", item: PAGE_URL },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}#howto`,
        name: "How to join the Amino Based affiliate program",
        description:
          "The four steps to join the Amino Based research peptide affiliate program, from application through to monthly commission payout.",
        step: processSteps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.description,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What commission rate does the Amino Based affiliate program pay?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `${commissionLabel} of order value on every qualifying sale, with no cap and no tiering. We track referrals through both your referral link, which carries a ${settings.defaultCookieDurationDays}-day cookie, and your personal discount code, which has no expiry.`,
            },
          },
          ...faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        ],
      },
    ],
  };
}

export default async function AffiliatesPage() {
  const [user, settings] = await Promise.all([getPayloadUser(), getAffiliateSettings()]);
  const affiliate = user ? await getAffiliateForUser(user.id) : null;

  const isPercentage = settings.defaultCommissionType === "percentage";
  const commissionLabel = isPercentage
    ? `${settings.defaultCommissionRate}%`
    : `$${settings.defaultCommissionRate}`;

  const exampleOrder = 200;
  const exampleCommission = isPercentage
    ? (exampleOrder * settings.defaultCommissionRate) / 100
    : settings.defaultCommissionRate;

  const avgOrder = 150;
  const perReferralCommission = isPercentage
    ? (avgOrder * settings.defaultCommissionRate) / 100
    : settings.defaultCommissionRate;

  const faqs = [
    {
      question: "How does the Amino Based partner program work?",
      answer: `You apply, undergo content review, and receive your verified tracking link and custom coupon code. When researchers order within your ${settings.defaultCookieDurationDays}-day cookie window, you earn ${commissionLabel} commission.`,
    },
    {
      question: "How are commission disbursements processed?",
      answer: `Approved earnings are disbursed on a monthly cadence once your cleared balance reaches $${settings.defaultMinimumPayoutThreshold}, paid directly through your preferred payment option in the dashboard.`,
    },
    {
      question: "How long is the conversion holding window?",
      answer: `Referrals remain pending for ${settings.defaultPendingPeriodDays} days after delivery to accommodate returns or order adjustments, after which they are verified and included in the next monthly distribution.`,
    },
    {
      question: "Are scientific educators and boutique blogs eligible?",
      answer:
        "Yes. We welcome academic publishers, biochemistry newsletter writers, scientific podcasters, and analytical research portals. We review for scientific integrity and RUO compliance rather than raw follower count.",
    },
    {
      question: "How does dual attribution link and coupon tracking function?",
      answer:
        "Our attribution system monitors clicks via cookie and tracks custom coupon codes independently, ensuring you receive full credit whether a customer clicks your link or enters your code at checkout.",
    },
    {
      question: "What is the cookie attribution duration?",
      answer: `Your referral tracking link features a ${settings.defaultCookieDurationDays}-day persistent cookie window, ensuring that returning laboratory buyers within that month-long timeframe credit your account.`,
    },
    {
      question: "Can affiliates offer exclusive audience discount codes?",
      answer:
        "Yes. Every accepted partner is issued a personalized promotional discount code that gives referred researchers a discount while securing your attribution.",
    },
    {
      question: "How is attribution resolved when multiple channels interact?",
      answer:
        "Attribution defaults to the direct coupon code entered at purchase. If no code is entered, the active referral link cookie within the 30-day window receives the commission.",
    },
  ];

  return (
    <main className="min-h-screen bg-white pt-24 sm:pt-32 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(settings, commissionLabel, faqs)) }}
      />

      <AboutPageAnimator>
        {/* ========================================================= */}
        {/* 1. HERO SECTION (Amino Based Editorial Header)            */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-6 md:px-12 lg:px-24 pb-14 sm:pb-18 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Wayfinding Breadcrumbs */}
            <div className="flex justify-center mb-6">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Affiliate Program" },
                ]}
              />
            </div>

            <div className="about-fade inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Amino Based Research Partner Network</span>
            </div>

            <h1 className="about-fade font-serif text-4xl sm:text-5xl lg:text-6xl text-[#071739] font-normal tracking-tight leading-[1.12] mb-5">
              Peptide Research <span className="italic text-[#031B4E]">Affiliate Program</span>
            </h1>

            <p className="about-fade font-inter text-[#71717A] text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Partner with a verified United States peptide synthesis supplier. Earn{" "}
              <strong className="text-[#071739] font-bold">{commissionLabel} commission</strong> on every
              qualifying referral of{" "}
              <Link href="/shop" className="text-[#031B4E] font-semibold underline underline-offset-4 hover:text-[#071739]">
                ≥99% HPLC verified research peptides
              </Link>
              . Dual attribution tracks both your {settings.defaultCookieDurationDays}-day link and indefinite
              discount code.
            </p>

            <div className="about-fade flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
              <Link
                href="#apply"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#031B4E] hover:bg-[#071739] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-[0_10px_25px_rgba(3,27,78,0.2)] hover:shadow-[0_14px_30px_rgba(3,27,78,0.3)] hover:-translate-y-0.5 group"
              >
                <span>Apply to the Program</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#071739] border border-[#E2E8F0] text-xs sm:text-sm font-semibold transition-all"
              >
                <FlaskConical className="w-4 h-4 text-[#031B4E]" />
                <span>Explore Research Catalog</span>
              </Link>
            </div>

            <div className="about-fade flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-semibold text-[#071739] uppercase tracking-wider">
              <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                {commissionLabel} Commission
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                {settings.defaultCookieDurationDays}-Day Cookie
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                Dual Link + Code Tracking
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                ${settings.defaultMinimumPayoutThreshold} Low Payout
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                Monthly Disbursements
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. PROGRAM BANNER                                         */}
        {/* ========================================================= */}
        <section className="pb-20 sm:pb-24">
          <div className="about-fade w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm">
            <img
              src="/email/welcome-hero-amino.jpg"
              alt="Amino Based peptide research affiliate program"
              className="w-full h-[280px] sm:h-[360px] md:h-[440px] object-cover object-center"
            />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. PROGRAM TERMS AT A GLANCE (Clean Laboratory Table)      */}
        {/* ========================================================= */}
        <section className="pb-20 sm:pb-24">
          <div className="about-fade w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="max-w-2xl mb-10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#031B4E] mb-2">
                Operational Overview
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-normal text-[#071739] tracking-tight mb-3">
                Program Terms at a Glance
              </h2>
              <p className="font-inter text-[#71717A] text-sm md:text-base leading-relaxed">
                Clear and transparent guidelines for academic publishers, scientific creators, and laboratory affiliates.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-[#E2E8F0] bg-white shadow-2xs">
              <table className="w-full text-left text-sm">
                <tbody>
                  {[
                    ["Commission rate", `${commissionLabel} of order subtotal on every qualifying referral`],
                    ["Earnings cap", "None — unlimited scaling on high-volume laboratory orders"],
                    ["Cookie duration", `${settings.defaultCookieDurationDays} calendar days from initial referral click`],
                    ["Attribution model", "Independent referral link and coupon code tracking"],
                    ["Code expiration", "None — your custom discount code remains active indefinitely"],
                    ["Audience discount", "Referred buyers receive checkout savings automatically"],
                    ["Minimum payout threshold", `$${settings.defaultMinimumPayoutThreshold} minimum balance for release`],
                    ["Payout schedule", "Monthly automatic disbursements"],
                    ["Cost to join", "100% Free — no membership or software charges"],
                    ["Audience size requirement", "None — applications are evaluated on content compliance and fit"],
                    ["Review process", "Manual review by scientific partnership team against RUO criteria"],
                    ["Approved channels", "Research blogs, newsletters, academic portals, podcasts, laboratory communities"],
                    ["Prohibited promotion", "Human consumption claims, medical/diagnostic advice, branded PPC bidding"],
                  ].map(([term, detail], i) => (
                    <tr key={term} className={i % 2 === 1 ? "bg-[#F8FAFC]/70" : undefined}>
                      <th
                        scope="row"
                        className="px-6 py-3.5 font-bold text-[#071739] align-top whitespace-nowrap border-b border-[#F1F5F9] text-xs sm:text-sm"
                      >
                        {term}
                      </th>
                      <td className="px-6 py-3.5 text-slate-600 align-top border-b border-[#F1F5F9] text-xs sm:text-sm">
                        {detail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. WHO THIS PROGRAM IS BUILT FOR (Architectural Navy Box) */}
        {/* ========================================================= */}
        <section className="relative bg-gradient-to-br from-[#05183E] via-[#071739] to-[#031B4E] text-white py-20 sm:py-24 overflow-hidden">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Audience Alignment</span>
              </div>
              <h2 className="about-fade font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-tight mb-5 leading-tight">
                Engineered for Scientific Publishers &amp; Research Creators
              </h2>
              <p className="about-fade font-inter text-white/70 text-sm sm:text-base leading-relaxed mb-4 max-w-xl">
                This program is built specifically for creators and institutions who communicate with audiences
                engaged in in-vitro biochemistry, solid-phase synthesis, and cellular receptor models.
              </p>
              <p className="about-fade font-inter text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                We provide a comprehensive framework ensuring all promotional content adheres to Research Use Only
                (RUO) boundaries: documented compliance rules, approved COA documentation, and reliable attribution.
              </p>

              <div className="about-fade">
                <Link
                  href="#apply"
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-[#071739] text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-md"
                >
                  <span>Submit Partner Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Feature Cards */}
            <div className="about-stagger grid grid-cols-1 sm:grid-cols-2 gap-4 order-1 lg:order-2">
              {purposeFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="about-stagger-item border border-white/10 bg-white/[0.05] backdrop-blur-xs rounded-[20px] p-6 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-[#031B4E] flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-normal text-lg text-white mb-1.5">{feature.title}</h3>
                    <p className="font-inter text-white/70 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. BENEFITS SECTION (Redesigned with Amino Theme)         */}
        {/* ========================================================= */}
        <AffiliateBenefitsSection
          cookieDurationDays={settings.defaultCookieDurationDays}
          minimumPayoutThreshold={settings.defaultMinimumPayoutThreshold}
        />

        {/* ========================================================= */}
        {/* 6. HOW IT WORKS (Four Sequential Laboratory Steps)        */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-xs font-bold uppercase tracking-wider text-[#031B4E] mb-2">
                Simple Onboarding
              </div>
              <h2 className="about-fade text-3xl md:text-4xl font-serif font-normal text-[#071739] tracking-tight mb-3">
                How to Join in Four Steps
              </h2>
              <p className="about-fade font-inter text-[#71717A] text-sm md:text-base leading-relaxed">
                No complex integration required. Every application is reviewed against our laboratory content
                standards to protect partner compliance.
              </p>
            </div>

            <div className="about-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step) => (
                <div
                  key={step.number}
                  className="about-stagger-item bg-white border border-[#E2E8F0] rounded-[22px] p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(3,27,78,0.06)] hover:border-[#031B4E]/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-3xl font-serif font-light text-[#031B4E]/30 block mb-3">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-[#071739] text-base mb-2">{step.title}</h3>
                  <p className="font-inter text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. COMMISSION SIMULATION & STRUCTURE CARD                 */}
        {/* ========================================================= */}
        <section className="bg-[#F8FAFC]/60 py-20 sm:py-24 border-y border-[#E2E8F0]">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="about-fade bg-gradient-to-br from-[#05183E] via-[#071739] to-[#031B4E] rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-white shadow-[0_24px_60px_rgba(3,27,78,0.25)] relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-px bg-cyan-400" />
                    <span className="font-inter text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold">
                      Earning Potential
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-5 leading-tight">
                    Transparent Earning Structure
                  </h2>
                  <p className="font-inter text-white/70 text-sm sm:text-base mb-8 leading-relaxed max-w-lg">
                    Partners earn {commissionLabel} commission on qualifying order values with zero caps and no
                    arbitrary tiers. Below is an arithmetic illustration to help model your projections.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">
                      <span className="font-serif block text-2xl sm:text-3xl font-light text-white mb-1">
                        {settings.defaultCookieDurationDays}-Day
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-1 block">
                        Cookie Window
                      </span>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        Purchases made within 30 days of the referral click credit to your account.
                      </p>
                    </div>

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">
                      <span className="font-serif block text-2xl sm:text-3xl font-light text-white mb-1">
                        Dual
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-1 block">
                        Attribution
                      </span>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        Referral link + custom discount code operate independently for 100% capture.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calculator Card */}
                <div className="bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Sample Calculation
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Live Rate
                    </span>
                  </div>

                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs uppercase tracking-wider text-white/60">Order Value</span>
                      <span className="font-mono text-xl sm:text-2xl text-white font-bold">
                        ${exampleOrder.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs uppercase tracking-wider text-cyan-300 font-bold">
                        Your Commission ({commissionLabel})
                      </span>
                      <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-cyan-300">
                        ${exampleCommission.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60 block mb-3">
                      Estimated Monthly Volume (@ ${avgOrder} average order)
                    </span>
                    <div className="space-y-2.5">
                      {[10, 25, 50].map((referrals) => (
                        <div
                          key={referrals}
                          className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10"
                        >
                          <span className="text-xs font-semibold text-white/80">{referrals} referrals / mo</span>
                          <span className="font-mono text-sm sm:text-base font-bold text-cyan-300">
                            ${(perReferralCommission * referrals).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/40 mt-3 leading-relaxed">
                      Projections are illustrative and do not guarantee specific income. Actual returns depend on your
                      audience size, engagement, and order volumes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. CONTENT STANDARDS & COMPLIANCE (Dual Panels)           */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="max-w-2xl mb-12">
              <div className="text-xs font-bold uppercase tracking-wider text-[#031B4E] mb-2">
                Compliance Protocol
              </div>
              <h2 className="about-fade text-3xl md:text-4xl font-serif font-normal text-[#071739] tracking-tight mb-3">
                Content Standards &amp; RUO Governance
              </h2>
              <p className="about-fade font-inter text-[#71717A] text-sm md:text-base leading-relaxed">
                All compounds synthesized by Amino Based are sold exclusively for laboratory in-vitro and biochemical
                investigation. Affiliate content must strictly adhere to these compliance parameters.
              </p>
            </div>

            <div className="about-stagger grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Prohibited Panel */}
              <div className="about-stagger-item bg-rose-50/60 rounded-[24px] p-7 sm:p-9 border border-rose-200">
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-normal text-rose-950">Prohibited Practices</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Strictly Enforced</span>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {prohibitedPractices.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-rose-900/90 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Standards Panel */}
              <div className="about-stagger-item bg-emerald-50/50 rounded-[24px] p-7 sm:p-9 border border-emerald-200">
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-normal text-emerald-950">Content Standards</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Required Practices</span>
                  </div>
                </div>
                <ul className="space-y-3.5">
                  {contentStandards.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 9. AFFILIATE TOOLKIT (4 Laboratory Resource Cards)        */}
        {/* ========================================================= */}
        <section className="bg-[#F8FAFC]/70 py-20 sm:py-24 border-t border-[#E2E8F0]">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-xs font-bold uppercase tracking-wider text-[#031B4E] mb-2">
                Partner Assets
              </div>
              <h2 className="about-fade text-3xl md:text-4xl font-serif font-normal text-[#071739] tracking-tight mb-3">
                Your Complete Partner Toolkit
              </h2>
              <p className="about-fade font-inter text-[#71717A] text-sm md:text-base leading-relaxed">
                Everything required to present verified peptide synthesis with complete analytical authority.
              </p>
            </div>

            <div className="about-stagger grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: "Live Analytical Reporting",
                  desc: "Monitor visitor sessions, verified conversions, and monthly statements as they register.",
                },
                {
                  icon: Link2,
                  title: "Deep Link Generator",
                  desc: "Construct custom tracking URLs directly to specific peptide vials, lots, and category indices.",
                },
                {
                  icon: BadgePercent,
                  title: "Personalized Discount Code",
                  desc: "Issue direct checkout savings to your readers that credit commissions even without click tracking.",
                },
                {
                  icon: FileText,
                  title: "Verified Documentation & Creatives",
                  desc: "Access approved lot photographs, high-resolution vial assets, and verified HPLC/MS diagrams.",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="about-stagger-item bg-white rounded-[22px] p-7 sm:p-8 border border-[#E2E8F0] shadow-2xs hover:shadow-[0_14px_30px_rgba(3,27,78,0.08)] hover:border-[#031B4E]/30 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-5 text-[#031B4E]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-normal text-[#071739] mb-1.5">{card.title}</h3>
                    <p className="font-inter text-slate-600 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 10. APPLICATION SECTION (#apply)                          */}
        {/* ========================================================= */}
        <section id="apply" className="bg-white py-20 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 scroll-mt-28 border-t border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#031B4E] mb-2">
                Join the Network
              </div>
              <h2 className="about-fade font-serif text-3xl sm:text-4xl text-[#071739] font-normal tracking-tight mb-4">
                Apply to the Partner Program
              </h2>
              <p className="about-fade font-inter text-[#71717A] text-sm md:text-base leading-relaxed mb-8">
                Applications take approximately 2–3 minutes. If your readership values analytical purity (≥99% HPLC)
                and you can represent compounds within rigorous RUO standards, we invite you to apply.
              </p>

              <div className="about-stagger grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="about-stagger-item bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-center">
                  <BadgePercent className="w-5 h-5 text-[#031B4E] mx-auto mb-1.5" />
                  <div className="font-serif text-2xl font-normal text-[#071739]">{commissionLabel}</div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mt-0.5">Commission</p>
                </div>
                <div className="about-stagger-item bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-center">
                  <Clock className="w-5 h-5 text-[#031B4E] mx-auto mb-1.5" />
                  <div className="font-serif text-2xl font-normal text-[#071739]">
                    {settings.defaultCookieDurationDays}d
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mt-0.5">Cookie</p>
                </div>
                <div className="about-stagger-item bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-center">
                  <DollarSign className="w-5 h-5 text-[#031B4E] mx-auto mb-1.5" />
                  <div className="font-serif text-2xl font-normal text-[#071739]">
                    ${settings.defaultMinimumPayoutThreshold}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] mt-0.5">Min Payout</p>
                </div>
              </div>
            </div>

            {/* Application Shell */}
            <div className="about-fade bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_rgba(3,27,78,0.08)]">
              {!user && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/10 flex items-center justify-center text-[#031B4E] mx-auto mb-4">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#071739] font-normal mb-2">
                    Create Account to Apply
                  </h3>
                  <p className="font-inter text-[#71717A] text-sm mb-6 max-w-sm mx-auto">
                    To link your application to an authenticated partner dashboard, please sign in or register a free
                    research account.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/register?callbackUrl=/affiliates"
                      className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#031B4E] hover:bg-[#071739] transition-all shadow-xs"
                    >
                      Create Partner Account
                    </Link>
                    <Link
                      href="/login?callbackUrl=/affiliates"
                      className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#071739] bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}

              {user && affiliate && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#031B4E]/5 border border-[#031B4E]/10 flex items-center justify-center text-[#031B4E] mx-auto mb-4">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#071739] font-normal mb-2">
                    {affiliate.status === "approved" ? "Active Partner Account" : "Application Under Review"}
                  </h3>
                  <p className="font-inter text-[#71717A] text-sm mb-6 max-w-sm mx-auto">
                    {affiliate.status === "approved" &&
                      "Access your live partner dashboard to generate tracking links and inspect analytical conversions."}
                    {affiliate.status === "pending" &&
                      "Your partner application is currently undergoing manual review by our compliance team."}
                    {affiliate.status === "suspended" &&
                      "Your partner account is currently suspended. Please contact institutional support."}
                    {affiliate.status === "rejected" &&
                      "Your partner application was not approved for content compliance at this time."}
                  </p>
                  {affiliate.status === "approved" && (
                    <Link
                      href="/affiliates/dashboard"
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#031B4E] hover:bg-[#071739] transition-all shadow-xs"
                    >
                      <span>Open Partner Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}

              {user && !affiliate && (
                <>
                  <div className="mb-6 pb-4 border-b border-[#F1F5F9]">
                    <h3 className="font-serif text-2xl text-[#071739] font-normal">
                      Partner Application
                    </h3>
                    <p className="text-xs text-[#71717A] mt-1">
                      Applying as <strong className="text-[#071739]">{user.email}</strong>
                    </p>
                  </div>
                  <ApplyForm />
                </>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 11. FAQ SECTION                                           */}
        {/* ========================================================= */}
        <FAQSection
          badgeText="Affiliate Program FAQ"
          title={
            <>
              Frequently Asked <span className="text-[#031B4E] italic font-normal">Questions</span>
            </>
          }
          subtitle="Key details regarding commission attribution, monthly disbursements, and content compliance."
          faqs={faqs}
        />

        {/* ========================================================= */}
        {/* 12. COMPLIANCE & LEGAL NOTICE                             */}
        {/* ========================================================= */}
        <section className="bg-slate-50 text-[#71717A] py-12 px-4 sm:px-6 md:px-12 border-t border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="about-fade font-inter text-xs leading-relaxed">
              <strong className="text-[#071739] font-bold">Research Use Only (RUO):</strong> All peptide formulations
              synthesized and distributed by Amino Based are intended solely for in-vitro laboratory research, cellular
              assays, and analytical calibration. They are not pharmaceuticals, medical treatments, dietary supplements,
              or food additives, and are not intended for human or animal administration under any circumstances.
              Partners must fully abide by FTC disclosure guidelines and maintain accurate scientific attribution.
            </p>
          </div>
        </section>
      </AboutPageAnimator>

      <Footer />
    </main>
  );
}
