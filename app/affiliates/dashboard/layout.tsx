import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Home, Link as LinkIcon, Settings, Wallet } from "lucide-react";
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
    <main className="min-h-screen bg-[#0a0a0a] text-gray-200">
      <div className="pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded uppercase">
              Affiliate Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-inter uppercase font-bold tracking-wider text-white">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{affiliate.displayName || "Partner"}</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible bg-white/[0.02] border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
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
