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

  // Compact Homepage Variant (Full-Bleed Landscape Section Banner - No inner card constraint)
  if (!showForm) {
    return (
      <section
        id="sec-military"
        className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center bg-[#090A0F] border-y border-neutral-800/80"
      >
        {/* Full-Bleed Section Background Image - Spanning the Entire Section Edge-to-Edge */}
        <Image
          src="/assets/flag-final-09-salute-row.webp"
          alt="Military & Veteran Research Discount at Amino Based"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] select-none pointer-events-none"
        />

        {/* Cinematic Gradient Scrims for Contrast & Legibility in the Left Corner */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 sm:via-black/55 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

        {/* Written parts placed strictly at the LEFT CORNER of the banner */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 py-12 sm:py-14 lg:py-16 flex items-start">
          <div className="max-w-[520px] flex flex-col justify-start">
            
            {/* Top Badges / Eyebrow */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3.5 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold border border-white/25 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                Honoring Our Heroes
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-purple-300">
                Serve With Honor. Research With Us.
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-serif font-normal text-white tracking-tight leading-[1.12] mb-3 drop-shadow-md">
              Military &amp; Veteran <br className="hidden sm:inline" />
              Research Discount
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-[13px] md:text-sm text-white/85 leading-relaxed mb-5 max-w-[460px] font-normal drop-shadow-xs">
              Active-duty service members, veterans, and their immediate families qualify for a standing discount on every research peptide in our catalogue. The code binds to your account so you never have to re-verify on repeat orders.
            </p>

            {/* Key Benefits (Frosted Glass Micro-Pills in compact left corner) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-[460px]">
              {[
                "Standing 30% discount",
                "All service branches eligible",
                "1–2 business day turnaround",
                "Zero data retention",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/55 backdrop-blur-md border border-white/15 text-xs text-white/95 font-medium shadow-2xs"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/40">
                    <Check className="w-2 h-2 stroke-[2.5]" />
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button & Privacy Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
              <Link
                href="/military-discount"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-95 group/btn shrink-0"
              >
                <span>Claim Your Military Discount</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <div className="inline-flex items-center gap-1.5 text-white/75 text-[11px] sm:text-xs">
                <Lock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span>Privacy first: ID photos permanently deleted.</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // Full Page Variant with "Verify Your Service" Form (Used on /military-discount page)
  return (
    <section id="sec-military" className="bg-[#FAFAFA] py-16 md:py-24 border-t border-[#E4E4E7]">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left: Image */}
          <div className="w-full lg:w-[45%] relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[420px] md:min-h-[550px] shadow-md group order-2 lg:order-1">
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 bg-white/90 px-5 py-2.5 md:px-6 md:py-3 rounded-2xl shadow-sm">
              <span className="font-inter text-gray-900 font-bold text-sm tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Honoring Our Heroes
              </span>
            </div>

            <Image
              src="/assets/flag-final-09-salute-row.webp"
              alt="Military & Veteran Research Discount at Amino Based"
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* Privacy notice */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20 bg-white/95 shadow-lg rounded-2xl p-5 md:p-6 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 bg-indigo-50 p-2.5 rounded-full text-indigo-600 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-inter text-gray-900 font-bold text-sm tracking-[0.1em] uppercase mb-1">
                    Your Privacy, Protected
                  </h3>
                  <p className="font-inter text-gray-600 text-xs leading-relaxed">
                    ID photos are reviewed once for verification, then{" "}
                    <span className="font-bold text-gray-900">permanently deleted</span>. We never store or share
                    your identification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content + Form */}
          <div className="w-full lg:w-[55%] flex flex-col py-4 lg:py-0 lg:pl-8 order-1 lg:order-2">
            <div className="mb-8">
              <span className="font-inter text-indigo-600 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
                Serve With Honor. Research With Us.
              </span>
              <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl uppercase font-bold leading-[1.15] tracking-wider mb-6 text-gray-900">
                Military &amp; Veteran Research Discount
              </h2>
              <p className="font-inter text-gray-500 text-base md:text-lg leading-relaxed w-full lg:max-w-[85%]">
                Active-duty service members, veterans and their immediate family qualify for a standing discount on every research peptide in our catalogue. Upload a photo of your military or veteran identification, and we&apos;ll email your discount code within one to two business days. The code applies to your account rather than a single order, so you never need to re-verify on repeat purchases.
              </p>
              <h3 className="font-inter text-lg md:text-xl uppercase tracking-wider text-gray-900 mt-8 mb-2">
                How We Handle Your ID Photo
              </h3>
              <p className="font-inter text-gray-500 text-sm md:text-base leading-relaxed w-full lg:max-w-[85%]">
                A human reviewer checks your identification photo once, then deletes it permanently from our systems. We do not store it, we do not archive it, and we never share it with a third party. We keep one thing only: a flag on your account recording that verification succeeded.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 w-full mt-auto">
              {state.success ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="font-inter text-xl md:text-2xl uppercase tracking-wider text-gray-900 mb-4">
                    Request Submitted
                  </h3>
                  <p className="font-inter text-gray-500 text-sm leading-relaxed mb-2 max-w-sm">
                    Thank you for your service. Our team will verify your ID and email your discount code within
                    1&ndash;2 business days.
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
                  <h3 className="font-inter text-xl md:text-2xl uppercase tracking-wider text-gray-900 mb-1">
                    Verify Your Service
                  </h3>

                  {state.error && (
                    <div className="font-inter px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                      {state.error}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullName" className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Jane Doe"
                      className="font-inter w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 border border-black/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      className="font-inter w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 border border-black/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="branch" className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      Service Branch
                    </label>
                    <select
                      required
                      name="branch"
                      id="branch"
                      defaultValue=""
                      className="font-inter w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none text-sm font-medium text-gray-900 border border-black/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors appearance-none"
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

                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
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
                      className="w-full border-2 border-dashed border-gray-200 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-inter text-xs font-semibold text-gray-900">
                        {selectedFile ? selectedFile.name : "Click to upload ID photo"}
                      </span>
                      <span className="font-inter text-[10px] text-gray-400 mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(0)} KB · Ready to submit`
                          : "JPG, PNG, or PDF under 3.5 MB"}
                      </span>
                    </div>

                    {fileError && (
                      <span className="font-inter text-red-500 text-xs pl-1">{fileError}</span>
                    )}
                  </div>

                  <button
                    disabled={isPending}
                    type="submit"
                    className="font-inter w-full py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-colors mt-2 shadow-sm disabled:opacity-50"
                  >
                    {isPending ? "Submitting..." : "Submit Verification"}
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
