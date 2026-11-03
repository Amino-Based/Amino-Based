import React from "react";
import { redirect } from "next/navigation";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { MobileNav } from "@/components/account/MobileNav";
import { AccountTopBar } from "@/components/account/AccountTopBar";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPayloadUser();
  if (!user) redirect("/login");

  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AccountSidebar userName={userName} userEmail={user.email} />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileNav userName={userName} />
        <main className="flex-1 w-full px-4 py-6 md:px-8 lg:px-12 lg:py-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <AccountTopBar userName={userName} points={user.hbPoints || 0} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
