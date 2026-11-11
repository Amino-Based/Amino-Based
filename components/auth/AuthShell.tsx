"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface AuthShellProps {
  mode?: "signin" | "signup" | "recovery";
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  showcaseImage?: string;
  showcaseTitle?: React.ReactNode;
  showcaseSubtitle?: string;
  children: React.ReactNode;
}

export default function AuthShell({
  mode = "signin",
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  showcaseImage = "/assets/auth_tree_branch_semaglutide_widescreen.webp",
  children,
}: AuthShellProps) {
  const isTabbed = mode === "signin" || mode === "signup";
  const isSignIn = mode === "signin";

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center md:justify-end p-4 sm:p-6 md:p-10 lg:p-14 xl:pr-24 2xl:pr-32 overflow-hidden select-none bg-[#07090D]">
      {/* ========================================================================= */}
      {/* FULLSCREEN BACKGROUND: Cinematic Tree Branch & Research Vial Environment  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <Image
          src={showcaseImage}
          alt="Amino Based Precision Research Peptides"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center pointer-events-none blur-[1.5px] scale-[1.015]"
        />
        {/* Soft, atmospheric twilight vignette */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
        {/* Right side gentle shade strictly behind the login card for clean UI contrast */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-black/60 via-black/25 to-transparent pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* FLOATING TOP-LEFT: Back to Home Button                                    */}
      {/* ========================================================================= */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-xs font-medium text-white/85 hover:text-white transition-all shadow-md group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to site</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING FROSTED GLASS CARD: Positioned cleanly on the right half          */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-[420px] rounded-[32px] sm:rounded-[36px] bg-[#121516]/70 backdrop-blur-xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.7)] p-6 sm:p-9 text-white">
        
        {/* Top Center: Official Amino Based Molecule Logo Emblem */}
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            aria-label="Amino Based — Home"
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 shadow-md transition-transform hover:scale-105 active:scale-95 group overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Amino Based"
              className="w-full h-full object-contain"
            />
          </Link>
        </div>

        {/* Tab Switcher: "Sign In" | "Sign Up" */}
        {isTabbed ? (
          <div className="grid grid-cols-2 border-b border-white/10 mb-6 text-center text-sm font-medium">
            <Link
              href="/login"
              className={`pb-3 relative transition-colors ${
                isSignIn
                  ? "text-white font-semibold"
                  : "text-white/45 hover:text-white/80"
              }`}
            >
              <span>Sign In</span>
              {isSignIn && (
                <span className="absolute bottom-0 inset-x-3 h-[2px] bg-white rounded-full" />
              )}
            </Link>
            <Link
              href="/register"
              className={`pb-3 relative transition-colors ${
                !isSignIn
                  ? "text-white font-semibold"
                  : "text-white/45 hover:text-white/80"
              }`}
            >
              <span>Sign Up</span>
              {!isSignIn && (
                <span className="absolute bottom-0 inset-x-3 h-[2px] bg-white rounded-full" />
              )}
            </Link>
          </div>
        ) : (
          <div className="text-center mb-6">
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form Body */}
        {children}

        {/* Footer Prompt */}
        {footerText && footerLinkHref && footerLinkText && (
          <div className="mt-6 pt-2 text-center text-xs text-white/50">
            <span>{footerText}</span>{" "}
            <Link
              href={footerLinkHref}
              className="font-semibold text-white hover:underline transition-colors"
            >
              {footerLinkText}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
