"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  Heart,
  LogOut,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export const ACCOUNT_NAV_ITEMS = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { href: "/account/settings", label: "Settings", icon: Settings, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
] as const;

export function isNavItemActive(
  pathname: string,
  href: string,
  exact: boolean
) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AccountSidebarProps {
  userName: string;
  userEmail: string;
}

export function AccountSidebar({ userName, userEmail }: AccountSidebarProps) {
  const pathname = usePathname();
  const initial = (userName || "A").charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-2rem)] sticky top-4 bg-[#121214] text-white rounded-[28px] border border-white/10 p-5 m-4 shadow-xl justify-between">
      <div>
        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group pt-1 pb-4"
          aria-label="Amino Based — Home"
        >
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 overflow-hidden p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Amino Based"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-sans">
            Amino Based
          </span>
        </Link>

        {/* User Card */}
        <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-3.5 my-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center text-sm shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[11px] text-white/50 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-6">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-medium tracking-wide transition-all ${
                  active
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-1.5">
        <Link
          href="/shop"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
