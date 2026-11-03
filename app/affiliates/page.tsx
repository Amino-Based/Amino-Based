import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  Activity,
  AlertTriangle,
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
} from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";
import type { AffiliateSettings } from "@/lib/types/affiliate";
import ApplyForm from "@/components/affiliates/ApplyForm";
import AffiliateBenefitsSection from "@/components/affiliates/AffiliateBenefitsSection";
import AboutPageAnimator from "@/components/about/AboutPageAnimator";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
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
    title: "Apply",
    description:
      "Submit the application form. There is no cost and no minimum audience size. We review every application against our content standards, so approval is not automatic.",
  },
  {
    number: "02",
    title: "Get Your Link and Code",
    description:
      "On approval, your dashboard issues a unique referral link and a personal discount code. Both are live immediately, and both track independently.",
  },
  {
    number: "03",
    title: "Publish",
    description:
      "Promote through your blog, newsletter, social channels or video, within the content standards below. Approved creatives are available in the dashboard.",
  },
  {
    number: "04",
    title: "Get Paid",
    description:
      "Commission accrues as referrals convert. Once your approved balance clears the payout threshold, payment goes out on the monthly cycle.",
  },
];

const purposeFeatures = [
  {
    icon: TrendingUp,
    title: "Commission On Every Sale",
    description: "Earn on every qualified referral you send our way, paid out monthly.",
  },
  {
    icon: BadgePercent,
    title: "A Discount For Your Audience",
    description: "Referred customers get a discount, making your link an easy recommendation.",
  },
  {
    icon: LineChart,
    title: "Real-Time Tracking",
    description: "Watch clicks, conversions, and pending commissions update live in your dashboard.",
  },
  {
    icon: DollarSign,
    title: "Reliable Monthly Payouts",
    description: "Approved commissions are paid out on a predictable monthly schedule.",
  },
];

const prohibitedPractices = [
  "No medical, dosing, or human-use claims about any research peptide in affiliate content",
  "No bodybuilding, athletic-performance, or weight-loss outcome framing",
  "No bidding on “Amino Based” brand terms in paid search advertising",
  "No unauthorized use of the Amino Based logo, trademark, or brand assets",
  "No guaranteed-outcome, cure, or treatment claims of any kind",
  "No earnings claims about this affiliate program made to recruit sub-affiliates",
];

const contentStandards = [
  "Maintain a research-focused, scientific tone consistent with our own RUO positioning",
  "Disclose the affiliate relationship clearly, consistent with FTC guidance",
  "Link only to current, approved product and category pages",
  "Keep all messaging consistent with “Research Use Only, not for human consumption” labeling",
  "Use only approved marketing assets and creatives provided through the affiliate dashboard",
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
  const perReferralCommission = isPercentage ? (avgOrder * settings.defaultCommissionRate) / 100 : settings.defaultCommissionRate;

  const faqs = [
    {
      question: "How does the affiliate program work?",
      answer: `You apply, get approved, and receive a unique referral link and discount code from your dashboard. When someone orders using either one within the ${settings.defaultCookieDurationDays}-day cookie window, you earn a ${commissionLabel} commission.`,
    },
    {
      question: "How do I get paid as an affiliate?",
      answer: `Approved commissions are paid out monthly once you cross the $${settings.defaultMinimumPayoutThreshold} minimum payout threshold, using whichever payout method you set in your affiliate dashboard.`,
    },
    {
      question: "When do I receive my commissions?",
      answer: `Commissions are marked pending for ${settings.defaultPendingPeriodDays} days after a sale (to account for returns), then approved and included in the next monthly payout.`,
    },
    {
      question: "Can beginners join this affiliate program?",
      answer:
        "Yes. There's no minimum audience size or prior affiliate experience required to apply — the application is reviewed for fit with our content standards, not follower count.",
    },
    {
      question: "How are referrals tracked?",
      answer:
        "Referrals are tracked two ways at once — through your unique link and through your personal discount code — so a sale is credited to you whether the customer clicks through or types the code in directly.",
    },
    {
      question: "What is cookie duration and why does it matter?",
      answer: `Cookie duration is how long a referral click stays credited to you after someone visits through your link. Ours is ${settings.defaultCookieDurationDays} days, meaning a purchase made within that window still counts as your referral.`,
    },
    {
      question: "Are there any costs to join the affiliate program?",
      answer:
        "No. The affiliate program is free to join, with no application fee, subscription cost, or minimum spend required to start earning commission.",
    },
    {
      question: "What marketing methods can I use?",
      answer:
        "Blogs, email newsletters, and social media are all permitted, provided your content follows our content standards — research-focused, RUO-consistent language rather than medical or dosing claims.",
    },
    {
      question: "Can I use my own discount code?",
      answer:
        "Yes. Every approved affiliate receives a personal discount code that customers can apply directly at checkout, in addition to their unique referral link.",
    },
    {
      question: "What happens if someone uses another affiliate's code after clicking my link?",
      answer:
        "Our dual tracking system credits the touchpoint actually used at checkout — if a different affiliate's code is applied at purchase, that affiliate receives the commission for that order.",
    },
  ];

  return (
    <main className="min-h-screen bg-white pt-32 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(settings, commissionLabel, faqs)) }}
      />

      <AboutPageAnimator>
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-24 pb-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="about-fade text-4xl md:text-5xl font-inter font-bold text-gray-900 leading-tight mb-6">
              Peptide{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Affiliate Program
              </span>
            </h1>
            <p className="about-fade font-inter text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              Amino Based pays {commissionLabel} commission on every qualifying referral of{" "}
              <Link href="/shop" className="text-indigo-600 font-medium hover:underline">
                research-grade peptides verified to ≥99% purity
              </Link>
              . We track referrals two ways — your link for {settings.defaultCookieDurationDays} days, and your
              personal discount code with no expiry — so credit does not fall through the gap. Payouts run monthly
              once your balance clears ${settings.defaultMinimumPayoutThreshold}.
            </p>
            <Link
              href="#apply"
              className="about-fade font-inter inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors mb-8"
            >
              Apply to the Program
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
            <div className="about-fade flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] md:text-xs uppercase tracking-widest text-gray-400 font-mono">
              <span>{commissionLabel} commission</span>
              <span className="text-black/20">·</span>
              <span>{settings.defaultCookieDurationDays}-day cookie</span>
              <span className="text-black/20">·</span>
              <span>Dual link + code tracking</span>
              <span className="text-black/20">·</span>
              <span>${settings.defaultMinimumPayoutThreshold} minimum</span>
              <span className="text-black/20">·</span>
              <span>Paid monthly</span>
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className="pb-24">
          <div className="about-fade w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto rounded-3xl overflow-hidden">
            <img
              src="/email/welcome-hero-amino.jpg"
              alt="Amino Based affiliate program"
              className="w-full h-[280px] md:h-[420px] object-cover object-center"
            />
          </div>
        </section>

        {/* Program Terms at a Glance */}
        <section className="pb-24">
          <div className="about-fade w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="max-w-2xl mb-10">
              <h2 className="text-2xl md:text-3xl font-inter font-bold text-gray-900 mb-4">
                Program Terms at a Glance
              </h2>
              <p className="font-inter text-gray-500 text-sm md:text-base leading-relaxed">
                Everything a prospective affiliate compares programs on, in one table.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <tbody>
                  {[
                    ["Commission rate", `${commissionLabel} of order value on every qualifying sale`],
                    ["Earnings cap", "None"],
                    ["Cookie duration", `${settings.defaultCookieDurationDays} days from click`],
                    ["Attribution", "Referral link and personal discount code, tracked independently"],
                    ["Code expiry", "None — your discount code works indefinitely"],
                    ["Customer incentive", "Referred customers receive a discount at checkout"],
                    ["Payout threshold", `$${settings.defaultMinimumPayoutThreshold}`],
                    ["Payout frequency", "Monthly"],
                    ["Cost to join", "Free"],
                    ["Minimum audience", "None"],
                    ["Approval", "Application reviewed; approval is not automatic"],
                    ["Permitted promotion", "Blog, social, email, video, community — see content standards below"],
                    ["Prohibited", "Brand-term PPC bidding; medical, dosing or human-use claims"],
                  ].map(([term, detail], i) => (
                    <tr key={term} className={i % 2 === 1 ? "bg-gray-50" : undefined}>
                      <th scope="row" className="px-5 py-3 font-semibold text-gray-900 align-top whitespace-nowrap border-b border-gray-100">
                        {term}
                      </th>
                      <td className="px-5 py-3 text-gray-600 align-top border-b border-gray-100">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Purpose */}
        <section className="relative bg-black pt-24 overflow-hidden">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="about-stagger flex flex-col gap-5 pb-10 lg:pb-24 order-2 lg:order-1">
              {purposeFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="about-stagger-item border border-white/10 bg-white/[0.02] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-inter font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="font-inter text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="relative min-h-[420px] lg:min-h-full order-1 lg:order-2">
              <h2 className="about-fade text-2xl md:text-3xl font-inter font-bold text-white mb-3">
                Who This Program Is Built For
              </h2>
              <p className="about-fade font-inter text-gray-400 text-sm md:text-base leading-relaxed mb-4 max-w-md">
                This program suits people who already write, film or post for an audience with a working interest
                in research compounds — science and biohacking bloggers, longevity and research-community
                creators, newsletter operators, and affiliates who run compliant content in regulated categories.
              </p>
              <p className="about-fade font-inter text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                What we provide in exchange is a framework that keeps you inside research-use-only limits: written
                content standards, approved creatives, and attribution that does not quietly drop conversions.
              </p>
            </div>
          </div>
        </section>

        {/* Why partner with us */}
        <AffiliateBenefitsSection
          cookieDurationDays={settings.defaultCookieDurationDays}
          minimumPayoutThreshold={settings.defaultMinimumPayoutThreshold}
        />

        {/* How it works */}
        <section className="py-24">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="about-fade text-2xl md:text-3xl font-inter font-bold text-gray-900 mb-4">
                How to Join in Four Steps
              </h2>
              <p className="about-fade font-inter text-gray-500 text-sm md:text-base leading-relaxed">
                No technical setup required. Every application is reviewed against our content standards, so
                approval is not automatic.
              </p>
            </div>

            <div className="about-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {processSteps.map((step) => (
                <div key={step.number} className="about-stagger-item border border-gray-200 rounded-2xl p-6">
                  <span className="text-3xl font-inter font-bold text-indigo-100 block mb-4">{step.number}</span>
                  <h3 className="font-inter font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="font-inter text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Commission structure */}
        <section className="bg-gray-50 py-24">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="about-fade bg-black rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-indigo-400" />
                    <span className="font-inter text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold">
                      Commission Structure
                    </span>
                  </div>
                  <h2 className="font-inter text-3xl md:text-5xl font-bold text-white mb-6 uppercase leading-[1.1]">
                    How Much You Earn
                  </h2>
                  <p className="font-inter text-white/60 text-base md:text-lg mb-10 leading-relaxed max-w-lg">
                    Commission is {commissionLabel} of order value, with no cap and no tiering. The figures below
                    are arithmetic, shown so you can model the programme against your own traffic.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <span className="font-inter block text-3xl font-bold text-white mb-2">
                        {settings.defaultCookieDurationDays}-Day
                      </span>
                      <span className="font-inter text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                        Cookie Duration
                      </span>
                      <p className="font-inter text-xs text-white/50">
                        A click stays credited to you for {settings.defaultCookieDurationDays} days, even without a
                        code at checkout.
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <span className="font-inter block text-3xl font-bold text-white mb-2">Dual</span>
                      <span className="font-inter text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                        Attribution System
                      </span>
                      <p className="font-inter text-xs text-white/50">
                        Both link tracking and coupon-code tracking ensure you never miss a commission.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col">
                  <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-white/40 mb-8 flex justify-between items-center">
                    <span>Commission Example</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/80">LIVE CALCULATION</span>
                  </h3>

                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="font-inter text-white/40 text-xs font-bold tracking-widest uppercase">
                        Customer Order Value
                      </span>
                      <span className="font-mono text-2xl text-white">${exampleOrder.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end pb-2">
                      <span className="font-inter text-indigo-400 text-sm font-bold tracking-widest uppercase">
                        Your Commission ({commissionLabel})
                      </span>
                      <span className="font-mono text-4xl md:text-5xl font-bold text-indigo-400">
                        ${exampleCommission.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
                      Commission at Different Referral Volumes <span className="normal-case font-normal">(@ ${avgOrder} avg order)</span>
                    </h3>
                    <div className="space-y-3">
                      {[10, 25, 50].map((referrals) => (
                        <div
                          key={referrals}
                          className={`flex justify-between items-center gap-4 p-4 rounded-2xl ${
                            referrals === 50 ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-white/5"
                          }`}
                        >
                          <div className="font-inter font-bold text-white/80 text-sm">{referrals} referrals/mo</div>
                          <div className={`font-mono text-lg ${referrals === 50 ? "text-indigo-400 font-bold" : "text-white"}`}>
                            ${(perReferralCommission * referrals).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="font-inter text-white/30 text-[10px] leading-relaxed mt-4">
                      These figures are arithmetic illustrations at a ${avgOrder} average order value, not a
                      representation of typical or expected earnings. Actual commission depends on your traffic,
                      your audience and order values, and many affiliates earn nothing. We make no guarantee of
                      income.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Standards */}
        <section className="py-24">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="about-fade text-2xl md:text-3xl font-inter font-bold text-gray-900 mb-4">
                Content Standards &amp; Compliance
              </h2>
              <p className="about-fade font-inter text-gray-500 text-sm md:text-base leading-relaxed">
                Every product we sell is labelled for laboratory research use only, and affiliate content has to
                hold that same line. This is not a formality — content that frames a research compound as
                something a person takes creates exposure for you and for us, and it is the fastest way for a
                program in this category to be shut down.
              </p>
            </div>

            <div className="about-stagger grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="about-stagger-item bg-black rounded-[2rem] p-8 md:p-10 border border-red-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-inter text-xl font-bold text-white tracking-tight">Prohibited Practices</h3>
                </div>
                <ul className="space-y-4">
                  {prohibitedPractices.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-500/80 shrink-0 mt-0.5" />
                      <span className="font-inter text-white/70 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="about-stagger-item bg-black rounded-[2rem] p-8 md:p-10 border border-indigo-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="font-inter text-xl font-bold text-white tracking-tight">Content Standards</h3>
                </div>
                <ul className="space-y-4">
                  {contentStandards.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400/80 shrink-0 mt-0.5" />
                      <span className="font-inter text-white/70 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="about-fade font-inter text-gray-500 text-sm leading-relaxed mt-10 max-w-3xl">
              We review affiliate content periodically and on report. A first breach brings a written notice and a
              correction window. Repeated or serious breaches — human-use claims above all — end the partnership,
              and commissions on affected traffic are withheld. We would rather explain a rule than enforce it, so
              ask us first if something is borderline.
            </p>
          </div>
        </section>

        {/* Management tools */}
        <section className="bg-gray-50 py-24">
          <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
            <div className="text-center mb-14">
              <h2 className="about-fade text-2xl md:text-3xl font-inter font-bold text-gray-900 mb-4">
                Your Affiliate Toolkit
              </h2>
              <p className="about-fade font-inter text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                A complete affiliate toolkit, from live analytics to ready-to-use marketing assets.
              </p>
            </div>

            <div className="about-stagger grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="about-stagger-item bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-inter font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
                <p className="font-inter text-gray-500 text-sm leading-relaxed">
                  Track clicks, conversions, and earnings as they happen from a live affiliate dashboard.
                </p>
              </div>
              <div className="about-stagger-item bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                  <Link2 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-inter font-semibold text-gray-900 mb-2">Link Management</h3>
                <p className="font-inter text-gray-500 text-sm leading-relaxed">
                  Generate and organize custom referral links for different campaigns and platforms.
                </p>
              </div>
              <div className="about-stagger-item bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                  <BadgePercent className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-inter font-semibold text-gray-900 mb-2">Discount Code Management</h3>
                <p className="font-inter text-gray-500 text-sm leading-relaxed">
                  Your personal discount code lets customers convert directly at checkout.
                </p>
              </div>
              <div className="about-stagger-item bg-white rounded-2xl p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-inter font-semibold text-gray-900 mb-2">Commission Reports</h3>
                <p className="font-inter text-gray-500 text-sm leading-relaxed">
                  Download detailed commission statements and approved marketing resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Apply */}
        <section id="apply" className="bg-black py-24 px-6 md:px-12 lg:px-24 scroll-mt-32">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="about-fade text-2xl md:text-3xl font-inter font-bold text-white mb-4">
                Apply to the Program
              </h2>
              <p className="about-fade font-inter text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                Applications cost nothing and take a few minutes, and we review each one against the content
                standards above. If your audience has a genuine interest in research-grade compounds and you can
                work within research-use-only framing, we would like to hear from you.
              </p>
              <div className="about-stagger grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="about-stagger-item bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-center">
                  <BadgePercent className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="font-inter text-xl font-bold text-white">{commissionLabel}</div>
                  <p className="font-inter text-[10px] uppercase tracking-widest text-gray-400 mt-1">Commission</p>
                </div>
                <div className="about-stagger-item bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-center">
                  <Clock className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="font-inter text-xl font-bold text-white">{settings.defaultCookieDurationDays}d</div>
                  <p className="font-inter text-[10px] uppercase tracking-widest text-gray-400 mt-1">Cookie</p>
                </div>
                <div className="about-stagger-item bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-center">
                  <DollarSign className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="font-inter text-xl font-bold text-white">
                    ${settings.defaultMinimumPayoutThreshold}
                  </div>
                  <p className="font-inter text-[10px] uppercase tracking-widest text-gray-400 mt-1">Min. Payout</p>
                </div>
              </div>
            </div>

            <div className="about-fade bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
              {!user && (
                <div className="text-center">
                  <LogIn className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                  <h2 className="text-xl font-inter uppercase tracking-wider text-white mb-3">Apply to the Program</h2>
                  <p className="font-inter text-gray-400 text-sm mb-6">
                    Create a free account to submit your affiliate application, or log in if you already have one.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/register?callbackUrl=/affiliates"
                      className="font-inter px-6 py-3 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                    >
                      Create Account
                    </Link>
                    <Link
                      href="/login?callbackUrl=/affiliates"
                      className="font-inter px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
              )}

              {user && affiliate && (
                <div className="text-center">
                  <LineChart className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                  <h2 className="text-xl font-inter uppercase tracking-wider text-white mb-3">
                    {affiliate.status === "approved" ? "You're an Affiliate" : "Application Status"}
                  </h2>
                  <p className="font-inter text-gray-400 text-sm mb-6">
                    {affiliate.status === "approved" &&
                      "Head to your dashboard to grab your referral link and track your earnings."}
                    {affiliate.status === "pending" && "Your affiliate account is awaiting approval."}
                    {affiliate.status === "suspended" &&
                      "Your affiliate account is currently suspended. Contact support for details."}
                    {affiliate.status === "rejected" && "Your affiliate account was not approved at this time."}
                  </p>
                  {affiliate.status === "approved" && (
                    <Link
                      href="/affiliates/dashboard"
                      className="font-inter inline-block px-6 py-3 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                    >
                      Go To Dashboard
                    </Link>
                  )}
                </div>
              )}

              {user && !affiliate && (
                <>
                  <h2 className="text-xl font-inter uppercase tracking-wider text-white mb-6 text-center">
                    Apply To Become An Affiliate
                  </h2>
                  <ApplyForm />
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection
          title={
            <>
              Affiliate <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Questions</span>
            </>
          }
          subtitle="Find answers to common questions about commissions, tracking, and payouts."
          faqs={faqs}
        />

        {/* Compliance note */}
        <section className="bg-black text-gray-400 py-16 px-6 md:px-12 lg:px-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <p className="about-fade font-inter text-sm leading-relaxed">
              <span className="text-red-500 font-bold">Research Use Only:</span> All Amino Based products are
              manufactured and sold exclusively for laboratory research purposes. They are not for human
              consumption, medical treatment, or athletic performance enhancement. This affiliate program covers
              the marketing of research compounds only. Affiliates must comply with all applicable laws and
              regulations, including FTC disclosure requirements.
            </p>
          </div>
        </section>
      </AboutPageAnimator>

      <Footer />
    </main>
  );
}
