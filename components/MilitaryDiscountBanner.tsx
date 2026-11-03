"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lock, Star, Anchor, Plane, Shield, LifeBuoy, Rocket, MoreHorizontal } from "lucide-react";

const BRANCHES = [
  { label: "Army", icon: Star },
  { label: "Navy", icon: Anchor },
  { label: "Air Force", icon: Plane },
  { label: "Marines", icon: Shield },
  { label: "Coast Guard", icon: LifeBuoy },
  { label: "Space Force", icon: Rocket },
  { label: "And More", icon: MoreHorizontal },
];

export default function MilitaryDiscountBanner() {
  return (
    <section className="bg-[#FAFAFA]">
      <div className="relative overflow-hidden min-h-[50vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
            <img
              src="/placeholder-wide.svg"
              alt="Military and veteran researcher standing before the US flag"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/85 md:via-[#FAFAFA]/70 to-transparent" />
          </div>

          {/* Top-right tagline */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 text-right hidden sm:block">
            <p className="font-inter text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-900/70 leading-relaxed">
              Verified Service.
              <br />
              Trusted Research.
            </p>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-16 py-8 md:py-10 max-w-2xl">
            <span className="font-inter text-indigo-600 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 block">
              Military &amp; Veteran
            </span>
            <h2 className="font-inter text-3xl sm:text-4xl md:text-5xl uppercase font-bold leading-[1.1] tracking-wider mb-2 text-gray-900">
              Research{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Discount
              </span>
            </h2>
            <p className="font-inter text-gray-700 text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Serve With Honor. Research With Us.
            </p>
            <p className="font-inter text-gray-600 text-sm md:text-base leading-relaxed mb-5 max-w-lg">
              Active-duty service members, veterans and their immediate family qualify for a standing discount
              on every research peptide in our catalogue.
            </p>

            {/* Branch icons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              {BRANCHES.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 bg-white/70 border border-black/10 rounded-full pl-1.5 pr-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center text-gray-700 shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-gray-600">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA + privacy note */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/military-discount"
                className="font-inter inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-colors shadow-[0_8px_20px_rgba(79,70,229,0.25)] shrink-0"
              >
                Verify Your Service
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-3 sm:border-l sm:border-black/10 sm:pl-4">
                <div className="bg-white p-1.5 rounded-full text-indigo-600 shrink-0 border border-black/5">
                  <Lock className="w-3 h-3" />
                </div>
                <p className="font-inter text-gray-600 text-xs leading-relaxed max-w-xs">
                  <span className="font-bold text-gray-900">ID photos protected.</span> Reviewed once, then
                  permanently deleted.
                </p>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}

