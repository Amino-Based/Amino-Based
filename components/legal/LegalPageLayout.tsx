"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Clock, FileText, ArrowRight, ShieldAlert, Mail } from "lucide-react";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/nav/Breadcrumbs";

const LEGAL_TABS = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
];

export default function LegalPageLayout({
  eyebrow,
  title,
  intro,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ========================================================= */}
      {/* 1. HERO HEADER (Clinical Laboratory Document Header)      */}
      {/* ========================================================= */}
      <section className="bg-white pt-28 sm:pt-36 pb-10 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-24 border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto">
          {/* Wayfinding Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Legal & Compliance", href: "/terms-and-conditions" },
                { label: title },
              ]}
            />
          </div>

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs font-bold tracking-wider text-cyan-800 bg-cyan-500/10 border border-cyan-400/30 rounded-full uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>{eyebrow || "Legal & Compliance"}</span>
          </div>

          {/* Document Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-normal text-[#071739] tracking-tight mb-4 leading-tight">
            {title}
          </h1>

          {/* Intro Paragraph */}
          {intro && (
            <p className="font-inter text-[#71717A] text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
              {intro}
            </p>
          )}

          {/* Document Metadata Strip */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-4 border-t border-[#F1F5F9]">
            {lastUpdated && (
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <Clock className="w-3.5 h-3.5 text-[#031B4E]" />
                <span>Last Updated: {lastUpdated}</span>
              </span>
            )}
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-medium text-cyan-800">
              <FileText className="w-3.5 h-3.5 text-cyan-600" />
              <span>United States Laboratory Synthesis Compliance</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#031B4E] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
              RUO Governance
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SUB-NAVIGATION TABS (Quick Document Switcher)          */}
      {/* ========================================================= */}
      <nav
        aria-label="Legal documents navigation"
        className="sticky top-16 sm:top-20 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 md:px-12 lg:px-24 py-2.5 overflow-x-auto no-scrollbar shadow-2xs"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {LEGAL_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#031B4E] text-white shadow-2xs"
                    : "bg-transparent text-slate-600 hover:text-[#071739] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 3. DOCUMENT BODY (Clean Elevated Laboratory Paper Card)   */}
      {/* ========================================================= */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xs p-6 sm:p-10 md:p-14">
          <div className="prose prose-slate max-w-none space-y-8 prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#071739] prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:border-b prose-h2:border-[#F1F5F9] prose-h2:pb-3 prose-h2:mt-8 first:prose-h2:mt-0 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-600 prose-li:text-sm sm:prose-li:text-base prose-strong:text-[#071739] prose-strong:font-bold prose-a:text-[#031B4E] prose-a:font-semibold prose-a:underline underline-offset-2 hover:prose-a:text-[#071739]">
            {children}
          </div>

          {/* Institutional Support Bar */}
          <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
            <div>
              <h4 className="text-sm font-bold text-[#071739] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-600" />
                <span>Compliance &amp; Laboratory Support Inquiries</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Have inquiries regarding analytical documentation, Certificate of Analysis verifications, or institutional accounts?
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#031B4E] hover:bg-[#071739] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
