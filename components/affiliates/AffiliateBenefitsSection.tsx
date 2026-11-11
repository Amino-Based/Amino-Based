import { Activity, CheckCircle2, DollarSign, Link2, TrendingUp } from "lucide-react";

interface AffiliateBenefitsSectionProps {
  cookieDurationDays?: number;
  minimumPayoutThreshold?: number;
}

export default function AffiliateBenefitsSection({
  cookieDurationDays = 30,
  minimumPayoutThreshold = 50,
}: AffiliateBenefitsSectionProps) {
  const features = [
    {
      icon: <Link2 className="w-6 h-6 text-[#031B4E]" />,
      topRightText: "LINK + COUPON\nCODE TRACKING",
      titleMain: "DUAL",
      titleMainColor: "text-[#071739] font-serif text-3xl mb-1",
      titleSub: "ATTRIBUTION: LINK AND CODE BOTH TRACKED",
      description: `Most programs track a referral link and nothing else. We track both independently — your link carries a ${cookieDurationDays}-day cookie, and your personal discount code earns credit whenever someone uses it, with no expiry. You get paid whichever route the customer takes.`,
      badges: ["LINK TRACKING", "CODE TRACKING", "NEVER MISS A SALE"],
    },
    {
      icon: <DollarSign className="w-6 h-6 text-[#031B4E]" />,
      topRightText: "PAID ON EVERY\nQUALIFYING SALE",
      titleMain: `$${minimumPayoutThreshold}`,
      titleMainColor: "text-[#031B4E] font-serif text-4xl mb-1",
      titleSub: "LOW PAYOUT THRESHOLD",
      description: `A payout threshold decides whether you actually get paid or merely accrue an unreleased balance. Programs that set it at $100+ mean smaller scientific creators wait months. Ours is $${minimumPayoutThreshold}, disbursed monthly.`,
      badges: ["NO EARNINGS CAP", "MONTHLY PAYOUTS", "LOW THRESHOLD"],
    },
    {
      icon: <Activity className="w-6 h-6 text-[#031B4E]" />,
      topRightText: "LIVE RESEARCH\nDASHBOARD",
      titleMain: "REAL-TIME",
      titleMainColor: "text-[#071739] font-serif text-3xl mb-1",
      titleSub: "LIVE DATA, NOT A MONTHLY REPORT",
      description:
        "Clicks, conversions, and pending commissions update in your dashboard as they happen, so you can see what's converting while your research content is actively being read.",
      badges: ["LIVE CLICKS", "CONVERSION RATE", "PENDING EARNINGS"],
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#031B4E]" />,
      topRightText: "BUILT-IN AUDIENCE\nSAVINGS",
      titleMain: "HIGH",
      titleMainColor: "text-[#071739] font-serif text-3xl mb-1",
      titleSub: "A DISCOUNT YOUR AUDIENCE ACTUALLY USES",
      description:
        "Referred customers receive an authentic discount at checkout, so your recommendation delivers concrete laboratory value rather than just an empty tracking link.",
      badges: ["LOW FRICTION", "EASY SHARE", "BUILT TO CONVERT"],
    },
  ];

  return (
    <section className="bg-[#F8FAFC]/80 py-20 sm:py-24 px-4 md:px-8 lg:px-12 border-y border-[#E2E8F0]">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            Program Advantages
          </div>
          <h2 className="about-fade text-3xl md:text-4xl lg:text-[40px] font-serif font-normal text-[#071739] tracking-tight">
            What Sets Our Affiliate Program Apart
          </h2>
          <p className="about-fade text-sm sm:text-base text-[#71717A] mt-2.5">
            Engineered specifically for scientific educators, biochemistry publishers, and peptide research communities.
          </p>
        </div>

        <div className="about-stagger grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="about-stagger-item bg-white p-6 sm:p-8 rounded-[22px] border border-[#E2E8F0] shadow-2xs hover:shadow-[0_16px_36px_rgba(3,27,78,0.08)] hover:border-[#031B4E]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] rounded-2xl shadow-2xs">
                  {feature.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold tracking-widest text-[#1C427B] uppercase whitespace-pre-line leading-tight block">
                    {feature.topRightText}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className={`tracking-tight ${feature.titleMainColor}`}>{feature.titleMain}</h3>
                <h4 className="text-sm sm:text-base font-bold text-[#071739] tracking-wide leading-tight">
                  {feature.titleSub}
                </h4>
                <div className="w-10 h-0.5 bg-[#031B4E]/20 mt-3 rounded-full" />
              </div>

              <p className="font-inter text-slate-600 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[#F1F5F9]">
                {feature.badges.map((badge, bIdx) => (
                  <div
                    key={bIdx}
                    className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-full border border-[#E2E8F0]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                    <span className="text-[9px] font-bold text-[#071739] tracking-wider uppercase">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
