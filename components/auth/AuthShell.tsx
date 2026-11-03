import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface AuthShellProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  showcaseImage?: string;
  showcaseTitle?: React.ReactNode;
  showcaseSubtitle?: string;
  children: React.ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  showcaseImage = "/assets/login_showcase_dark.jpg",
  showcaseTitle,
  showcaseSubtitle,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen w-full bg-[#ECECF0] flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-10 selection:bg-black selection:text-white">
      {/* Main Outer Floating Card matching reference */}
      <div className="w-full max-w-[1160px] bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-black/5 p-3 sm:p-4 md:p-5 flex flex-col md:flex-row overflow-hidden relative min-h-[660px] lg:min-h-[720px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Visual Showcase Panel (Minimalist Obsidian Dunes Landscape)  */}
        {/* ========================================================================= */}
        <div className="relative w-full md:w-[46%] lg:w-[44%] rounded-[22px] sm:rounded-[28px] md:rounded-[32px] overflow-hidden min-h-[380px] md:min-h-[640px] flex flex-col justify-between p-6 sm:p-8 md:p-10 select-none bg-[#0B0B0D] group shrink-0">
          
          {/* Background Showcase Artwork */}
          <Image
            src={showcaseImage}
            alt="Amino Based login showcase panel"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 540px"
            className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
          />

          {/* Deep Dark Ambient Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20 pointer-events-none" />

          {/* Top-Left: Brand Pill Badge matching reference "clever" badge */}
          <Link
            href="/"
            className="relative z-10 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white text-black shadow-sm w-fit hover:opacity-90 transition-opacity"
          >
            <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white">
              <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-tight text-black font-sans">
              amino
            </span>
          </Link>

          {/* Bottom Left: Headline & Subtitle matching reference */}
          <div className="relative z-10 text-white">
            {showcaseTitle ? (
              showcaseTitle
            ) : (
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.12] mb-3">
                Build something <br />
                amazing today.
              </h2>
            )}
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-sm">
              {showcaseSubtitle || "Precision research peptides, synthesized and verified lot by lot."}
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Auth Form Area (Centered, Clean Minimalist Inputs)          */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[54%] lg:w-[56%] flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-16">
          <div className="w-full max-w-[390px] mx-auto">
            
            {/* Top Navigation: Back to Home */}
            <div className="mb-6 flex justify-start">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to home</span>
              </Link>
            </div>

            {/* Header: Title & Subtitle */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-1.5 font-sans">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                {subtitle}
              </p>
            </div>

            {/* Main Form Content */}
            {children}

            {/* Bottom Footer Link */}
            <p className="text-center text-xs sm:text-[13px] text-[#64748B] mt-8">
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
              >
                {footerLinkText}
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}
