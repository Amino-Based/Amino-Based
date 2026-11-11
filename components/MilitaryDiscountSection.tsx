"use client";

import React, { useActionState, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Lock, Upload, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { submitMilitaryDiscountRequest, type MilitaryDiscountFormState } from "@/app/military-discount/actions";
import { compressImage } from "@/lib/client/compressImage";

const BRANCHES = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force", "Other"];
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const initialState: MilitaryDiscountFormState = { success: false };

interface MilitaryDiscountSectionProps {
  showForm?: boolean;
}

export default function MilitaryDiscountSection({ showForm = false }: MilitaryDiscountSectionProps) {
  const [state, formAction, isPending] = useActionState(submitMilitaryDiscountRequest, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Compact Homepage Variant (Full-Bleed Landscape Banner) ───────────────
  if (!showForm) {
    return (
      <section
        id="sec-military"
        className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center border-y border-neutral-900 bg-black"
      >
        {/* Full-Bleed Background Image: mobile focused on soldiers & sunset (68% center) to eliminate clipping, desktop uses center 35% */}
        <Image
          src="/assets/flag-final-09-salute-row.webp"
          alt="Military & Veteran Research Discount at Amino Based"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-[center_35%] select-none pointer-events-none"
        />

        {/* Contrast Scrims: mobile softens the heavy black vignette so soldiers and golden sunset remain vivid and unclipped */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:from-black/95 sm:via-black/55 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 sm:from-black/85 sm:to-black/35 pointer-events-none" />

        {/* Content — left-aligned */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 py-12 sm:py-14 lg:py-16 flex items-start">
          <div className="max-w-[540px] flex flex-col justify-start">

            {/* Eyebrow badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold border border-white/20 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white/90" />
                Honoring Our Heroes
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#A78BFA] drop-shadow-xs">
                SERVE WITH HONOR. RESEARCH WITH US.
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-[1.12] mb-3 drop-shadow-md">
              Military &amp; Veteran <br className="hidden sm:inline" />
              Research Discount
            </h2>

            {/* Body */}
            <p className="text-xs sm:text-[13px] md:text-sm text-neutral-300 leading-relaxed mb-5 max-w-[480px] font-normal drop-shadow-xs">
              Active-duty service members, veterans, and their immediate families qualify for a
              standing discount on every research peptide in our catalogue. The code binds to your
              account so you never have to re-verify on repeat orders.
            </p>

            {/* Key benefit pills: Translucent Dark Glass + Purple Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-[480px]">
              {[
                "Standing 30% discount",
                "All service branches eligible",
                "1–2 business day turnaround",
                "Zero data retention",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 text-xs text-white/90 font-medium shadow-sm hover:border-white/25 transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-[#8F72F5]/25 text-[#A78BFA] flex items-center justify-center shrink-0 border border-[#8F72F5]/40">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA + privacy note: Brand Purple Pill Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
              <Link
                href="/military-discount"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#8F72F5] hover:bg-[#7E5DF2] text-white text-xs sm:text-sm font-bold tracking-wide shadow-[0_10px_25px_rgba(143,114,245,0.4)] hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group/btn shrink-0"
              >
                <span>Claim Your Military Discount</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <div className="inline-flex items-center gap-1.5 text-neutral-400 text-[11px] sm:text-xs">
                <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Privacy first: ID photos permanently deleted.</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // ─── Full Page Variant with "Verify Your Service" Form ────────────────────
  return (
    <section id="sec-military" className="bg-[#F8FAFC] py-16 md:py-24 border-t border-[#E2E8F0]">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* Left: Image panel */}
          <div className="w-full lg:w-[45%] relative rounded-[22px] md:rounded-[32px] overflow-hidden min-h-[420px] md:min-h-[550px] shadow-md group order-2 lg:order-1">
            {/* Overlay badge */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 bg-white/95 px-5 py-2.5 md:px-6 md:py-3 rounded-2xl shadow-sm border border-[#E2E8F0]">
              <span className="text-[#071739] font-bold text-sm tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#031B4E]" /> Honoring Our Heroes
              </span>
            </div>

            <Image
              src="/assets/flag-final-09-salute-row.webp"
              alt="Military & Veteran Research Discount at Amino Based"
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071739]/55 to-transparent pointer-events-none" />

            {/* Privacy card */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20 bg-white/95 shadow-lg border border-[#E2E8F0] rounded-2xl p-5 md:p-6 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 bg-cyan-500/10 border border-cyan-400/30 p-2.5 rounded-full text-[#031B4E] shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[#071739] font-normal text-base tracking-tight mb-1">
                    Your Privacy, Protected
                  </h3>
                  <p className="text-[#64748B] text-xs leading-relaxed">
                    ID photos are reviewed once for verification, then{" "}
                    <span className="font-semibold text-[#071739]">permanently deleted</span>. We
                    never store or share your identification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content + Form */}
          <div className="w-full lg:w-[55%] flex flex-col py-4 lg:py-0 lg:pl-8 order-1 lg:order-2">
            <div className="mb-8">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                Serve With Honor. Research With Us.
              </span>

              <h2 className="font-serif font-normal text-3xl md:text-4xl lg:text-5xl text-[#071739] leading-[1.15] mb-5">
                Military &amp; Veteran <br className="hidden md:inline" />
                Research Discount
              </h2>

              <p className="text-[#64748B] text-base md:text-lg leading-relaxed w-full lg:max-w-[85%]">
                Active-duty service members, veterans and their immediate family qualify for a
                standing discount on every research peptide in our catalogue. Upload a photo of your
                military or veteran identification, and we&apos;ll email your discount code within
                one to two business days. The code applies to your account rather than a single
                order, so you never need to re-verify on repeat purchases.
              </p>

              <h3 className="font-serif font-normal text-xl md:text-2xl text-[#071739] mt-8 mb-2">
                How We Handle Your ID Photo
              </h3>
              <p className="text-[#64748B] text-sm md:text-base leading-relaxed w-full lg:max-w-[85%]">
                A human reviewer checks your identification photo once, then deletes it permanently
                from our systems. We do not store it, we do not archive it, and we never share it
                with a third party. We keep one thing only: a flag on your account recording that
                verification succeeded.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[22px] md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(3,27,78,0.06)] border border-[#E2E8F0] w-full mt-auto">
              {state.success ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-400/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#031B4E]" />
                  </div>
                  <h3 className="font-serif font-normal text-2xl md:text-3xl text-[#071739] mb-4">
                    Request Submitted
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed mb-2 max-w-sm">
                    Thank you for your service. Our team will verify your ID and email your discount
                    code within 1&ndash;2 business days.
                  </p>
                </div>
              ) : (
                <form
                  action={(formData) => {
                    if (selectedFile) formData.set("idPhoto", selectedFile);
                    formAction(formData);
                  }}
                  className="flex flex-col gap-5"
                >
                  <h3 className="font-serif font-normal text-2xl text-[#071739] mb-1">
                    Verify Your Service
                  </h3>

                  {state.error && (
                    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                      {state.error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest pl-1"
                    >
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Jane Doe"
                      className="w-full bg-[#F8FAFC] rounded-2xl px-5 py-4 outline-none text-sm font-medium text-[#071739] placeholder:text-[#94A3B8] border border-[#E2E8F0] focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest pl-1"
                    >
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      className="w-full bg-[#F8FAFC] rounded-2xl px-5 py-4 outline-none text-sm font-medium text-[#071739] placeholder:text-[#94A3B8] border border-[#E2E8F0] focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-colors"
                    />
                  </div>

                  {/* Service Branch */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="branch"
                      className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest pl-1"
                    >
                      Service Branch
                    </label>
                    <select
                      required
                      name="branch"
                      id="branch"
                      defaultValue=""
                      className="w-full bg-[#F8FAFC] rounded-2xl px-5 py-4 outline-none text-sm font-medium text-[#071739] border border-[#E2E8F0] focus:border-[#071739] focus:ring-1 focus:ring-[#071739] transition-colors appearance-none"
                    >
                      <option value="" disabled>
                        Select your branch
                      </option>
                      {BRANCHES.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ID Photo Upload */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest pl-1">
                      Military or Veteran ID Photo
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={async (e) => {
                        setFileError(null);
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (file.type === "application/pdf") {
                          if (file.size > MAX_UPLOAD_BYTES) {
                            setFileError("PDF must be under 3.5 MB.");
                            return;
                          }
                          setSelectedFile(file);
                          return;
                        }

                        if (!file.type.startsWith("image/")) {
                          setFileError("Please upload a JPG, PNG, WEBP, or PDF file.");
                          return;
                        }

                        try {
                          const compressed = await compressImage(file);
                          if (compressed.size > MAX_UPLOAD_BYTES) {
                            setFileError("Image is too large even after compression. Please choose a smaller file.");
                            return;
                          }
                          setSelectedFile(compressed);
                        } catch {
                          setFileError("Could not process this image. Try another file or format.");
                        }
                      }}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#E2E8F0] hover:border-[#031B4E]/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFC] hover:bg-white"
                    >
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-[#031B4E] mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-[#071739]">
                        {selectedFile ? selectedFile.name : "Click to upload ID photo"}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(0)} KB · Ready to submit`
                          : "JPG, PNG, or PDF under 3.5 MB"}
                      </span>
                    </div>

                    {fileError && (
                      <span className="text-red-500 text-xs pl-1">{fileError}</span>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    disabled={isPending}
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#031B4E] hover:bg-[#071739] text-white font-semibold text-sm tracking-wide transition-colors mt-2 shadow-sm disabled:opacity-50"
                  >
                    {isPending ? "Submitting…" : "Submit Verification"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
