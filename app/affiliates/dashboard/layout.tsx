import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Home, Link as LinkIcon, Settings, Wallet, ShieldCheck } from "lucide-react";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getAffiliateForUser } from "@/lib/affiliate/getAffiliateForUser";

const navItems = [
  { href: "/affiliates/dashboard", label: "Overview", icon: Home },
  { href: "/affiliates/dashboard/conversions", label: "Conversions", icon: BarChart3 },
  { href: "/affiliates/dashboard/links", label: "Links", icon: LinkIcon },
  { href: "/affiliates/dashboard/payouts", label: "Payouts", icon: Wallet },
  { href: "/affiliates/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getPayloadUser();
  if (!user) {
    redirect("/login?callbackUrl=/affiliates/dashboard");
  }

  const affiliate = await getAffiliateForUser(user.id);
  if (!affiliate || affiliate.status !== "approved") {
    redirect("/affiliates");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <div className="pt-28 sm:pt-36 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-bold tracking-widest text-[#031B4E] bg-cyan-500/10 border border-cyan-400/30 rounded-full uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Partner Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#071739] font-normal tracking-tight">
              Welcome, <span className="font-semibold text-[#031B4E]">{affiliate.displayName || "Partner"}</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible bg-white border border-[#E2E8F0] rounded-2xl p-2.5 shadow-2xs">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#071739] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#031B4E]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
