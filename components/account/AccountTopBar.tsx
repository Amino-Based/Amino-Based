"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Award } from "lucide-react";
import Breadcrumbs from "@/components/nav/Breadcrumbs";

interface AccountTopBarProps {
  userName: string;
  points: number;
}

export function AccountTopBar({ userName, points }: AccountTopBarProps) {
  const initial = (userName || "A").charAt(0).toUpperCase();
  const pathname = usePathname() || "/account";

  const getAccountSectionLabel = () => {
    if (pathname === "/account/orders") return "Order History";
    if (pathname.startsWith("/account/orders/")) return "Order Details";
    if (pathname === "/account/addresses") return "Saved Addresses";
    if (pathname === "/account/settings") return "Profile Settings";
    if (pathname === "/account/wishlist") return "Saved Compounds";
    return "Account Overview";
  };

  const sectionLabel = getAccountSectionLabel();

  return (
    <div className="flex flex-col gap-3">
      {/* Wayfinding Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: pathname === "/account" ? undefined : "/account" },
          ...(pathname !== "/account" ? [{ label: sectionLabel }] : []),
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Back to store pill */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200/80 text-xs font-medium text-neutral-700 hover:text-black shadow-xs transition-colors shrink-0"
        >
          <ArrowLeft size={13} />
          <span>Return to Catalog</span>
        </Link>

      {/* User Status Capsule matching the dark floating pill theme */}
      <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#141416] text-white border border-white/10 rounded-full pl-2 pr-4 sm:pr-5 py-1.5 shadow-sm max-w-full">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 text-black font-bold text-xs sm:text-sm">
          {initial}
        </div>
        <div className="hidden sm:flex flex-col min-w-0">
          <span className="font-semibold text-xs text-white leading-none truncate max-w-[140px]">
            {userName}
          </span>
          <span className="text-white/50 text-[10px] font-medium mt-0.5">
            Verified Customer
          </span>
        </div>

        <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Award size={15} className="text-cyan-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-xs leading-none text-white">
                {Number(points || 0).toFixed(0)} pts
              </span>
              <span className="text-white/50 text-[9px] font-medium mt-0.5 whitespace-nowrap">
                Rewards Balance
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
