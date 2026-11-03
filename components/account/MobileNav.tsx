"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut } from "lucide-react";
import { ACCOUNT_NAV_ITEMS, isNavItemActive } from "./AccountSidebar";

interface MobileNavProps {
  userName: string;
}

export function MobileNav({ userName }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current =
    ACCOUNT_NAV_ITEMS.find((item) => isNavItemActive(pathname, item.href, item.exact))
      ?.label ?? "Account";

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-black/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="font-inter text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {userName}
          </p>
          <h2 className="font-inter text-lg uppercase tracking-wider text-white">
            {current}
          </h2>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle account menu"
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`font-inter flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-inter flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </nav>
      )}
    </div>
  );
}
