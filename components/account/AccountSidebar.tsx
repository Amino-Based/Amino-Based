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

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-black px-5 py-8">
      <Link href="/" className="mb-10 block">
        <img
          src="/amino-logo.svg"
          alt="Amino Based"
          className="h-9 w-auto"
        />
      </Link>

      <div className="mb-8 px-1">
        <p className="font-inter text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
          Signed in as
        </p>
        <p className="font-inter text-sm font-medium text-white truncate">{userName}</p>
        <p className="font-inter text-xs text-gray-500 truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-inter flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                active
                  ? "bg-indigo-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.35)]"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="font-inter mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Sign Out
      </button>
    </aside>
  );
}
