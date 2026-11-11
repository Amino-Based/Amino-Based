"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut, ArrowLeft } from "lucide-react";
import { ACCOUNT_NAV_ITEMS, isNavItemActive } from "./AccountSidebar";

interface MobileNavProps {
  userName: string;
}

export function MobileNav({ userName }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current =
    ACCOUNT_NAV_ITEMS.find((item) => isNavItemActive(pathname, item.href, item.exact))
      ?.label ?? "Portal";

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#141416]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Amino Based"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-[10px] font-medium text-white/50 leading-tight">
              {userName}
            </p>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              {current}
            </h2>
          </div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle account menu"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1.5 px-4 pb-5 pt-2 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-1">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
