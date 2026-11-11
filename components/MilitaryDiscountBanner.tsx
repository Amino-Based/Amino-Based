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
    <section className="bg-[#F8FAFC]">
      <div className="relative overflow-hidden min-h-[50vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/placeholder-wide.svg"
            alt="Military and veteran researcher standing before the US flag"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Navy-tinted left-side scrim to match brand palette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/88 md:via-[#F8FAFC]/72 to-transparent" />
        </div>

        {/* Top-right tagline */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 text-right hidden sm:block">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#071739]/60 leading-relaxed">
            Verified Service.
            <br />
            Trusted Research.
          </p>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-16 py-8 md:py-10 max-w-2xl">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            Military &amp; Veteran
          </span>

          <h2 className="font-serif font-normal text-3xl sm:text-4xl md:text-5xl text-[#071739] leading-[1.12] mb-3">
            Research{" "}
            <span className="italic text-[#031B4E]">Discount</span>
          </h2>

          <p className="text-[#071739]/70 text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
            Serve With Honor. Research With Us.
          </p>

          <p className="text-[#64748B] text-sm md:text-base leading-relaxed mb-5 max-w-lg">
            Active-duty service members, veterans and their immediate family qualify for a standing
            discount on every research peptide in our catalogue.
          </p>

          {/* Branch icons */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
            {BRANCHES.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-full pl-1.5 pr-3 py-1.5 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#031B4E] shrink-0">
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748B]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA + privacy note */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/military-discount"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#031B4E] hover:bg-[#071739] rounded-full transition-colors shadow-[0_8px_20px_rgba(3,27,78,0.18)] shrink-0"
            >
              Verify Your Service
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3 sm:border-l sm:border-[#E2E8F0] sm:pl-4">
              <div className="bg-cyan-500/10 border border-cyan-400/30 p-1.5 rounded-full text-[#031B4E] shrink-0">
                <Lock className="w-3 h-3" />
              </div>
              <p className="text-[#64748B] text-xs leading-relaxed max-w-xs">
                <span className="font-semibold text-[#071739]">ID photos protected.</span> Reviewed
                once, then permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
