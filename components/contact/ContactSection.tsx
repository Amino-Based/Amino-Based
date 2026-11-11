"use client";

import React, { useActionState, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { submitContactMessage, type ContactFormState } from "@/app/contact-us/actions";

interface ContactSectionProps {
  id?: string;
}

// Shared with /contact-us: both forms post to the same server action, so
// validation, persistence and the admin notification have one implementation.
const initialState: ContactFormState = { success: false };

// 1. Headline Parent & Letter Variants (0 - 0.4s)
const headlineContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0.15,
    color: "#9CA3AF",
  },
  visible: {
    opacity: 1,
    color: "#0F0F11",
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

// 2. Card Keyframed Variants:
// Fly-in rotated (~0.3s - 0.7s) + De-rotate / settle (~0.7s - 1.35s)
const cardVariants: Variants = {
  hidden: {
    y: 150,
    opacity: 0,
    rotate: -22,
    x: "-50%",
  },
  visible: {
    y: [150, 0, 0],
    opacity: [0, 1, 1],
    rotate: [-22, -22, 0],
    x: "-50%",
    transition: {
      duration: 1.05,
      delay: 0.3,
      times: [0, 0.45, 1],
      ease: ["easeOut", "easeInOut"],
    },
  },
};

// 3. Form Container & Input Variants (~0.6s - 1.35s)
const formContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.08,
    },
  },
};

const formItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const sendButtonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function ContactSection({ id = "sec11" }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  // The inputs stay controlled so the existing styling and typing behaviour are
  // unchanged; `name` attributes are what the action actually reads from
  // FormData. Clear them only once the action has confirmed success, so a
  // failed submission keeps what the visitor typed and they can retry.
  useEffect(() => {
    if (state.success) {
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  }, [state.success]);

  // Only `state.success` renders the success message. A provider failure still
  // returns success — correctly, because the enquiry is persisted before the
  // email is attempted, so the visitor must not be asked to resend.
  const feedback = state.success
    ? "Thank you. Your message has been sent successfully."
    : state.error ?? "";

  const headlineLetters = "CONTACT US".split("");

  return (
    <motion.section
      id={id}
      data-motion-owner="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="relative py-14 sm:py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Mobile View: Clean stacked layout so title and card never overlap */}
        <div className="block sm:hidden text-center mb-8">
          <motion.h2
            variants={headlineContainerVariants}
            className="text-3xl xs:text-4xl font-[250] uppercase tracking-[0.05em] leading-tight text-center select-none flex items-center justify-center mb-4"
          >
            {headlineLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block will-change-transform will-change-opacity"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>

          <div className="w-full max-w-[320px] mx-auto bg-gradient-to-br from-[#9D82F7] via-[#8F72F5] to-[#7E5DF2] text-white px-5 py-3 rounded-[22px] shadow-[0_16px_40px_rgba(143,114,245,0.32)] text-left border border-white/35 flex flex-col justify-center gap-1">
            <div className="flex items-center justify-between text-white/95">
              <span className="text-sm font-semibold tracking-tight">
                +1 (800) 529-1037
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/20 border border-white/25">
                Central Lab
              </span>
            </div>
            <div className="text-xs text-white/90 font-medium tracking-wide">
              support@aminobased.com
            </div>
            <div className="text-[10px] text-white/80 tracking-wider">
              Research & Analytical Synthesis Facility
            </div>
            <div className="text-[9px] text-white/70 tracking-wider uppercase">
              Mon – Fri 9:00 AM – 6:00 PM EST
            </div>
          </div>
        </div>

        {/* Desktop View (sm: and up): Signature overlapping rotated floating card */}
        <div className="hidden sm:flex relative items-center justify-center text-center sm:mt-6 mb-20 md:mb-24 lg:mb-28 select-none overflow-visible">
          <div className="relative inline-flex items-center justify-center max-w-full">
            
            {/* 1. Staggered Animated Headline */}
            <motion.h2
              variants={headlineContainerVariants}
              className="sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[120px] 2xl:text-[136px] font-[250] uppercase sm:tracking-[0.05em] md:tracking-[0.06em] lg:tracking-[0.08em] leading-none text-center select-none whitespace-nowrap flex items-center justify-center"
            >
              {headlineLetters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block will-change-transform will-change-opacity"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h2>

            {/* 2. Floating Lavender Card: Flies in rotated -22deg, then de-rotates to 0deg */}
            <motion.div
              variants={cardVariants}
              style={{ transformOrigin: "center center" }}
              className="absolute top-1/2 left-1/2 -translate-y-1/2 sm:w-[310px] md:w-[350px] lg:w-[385px] max-w-[calc(100vw-36px)] sm:h-[106px] md:h-[114px] bg-gradient-to-br from-[#9D82F7] via-[#8F72F5] to-[#7E5DF2] text-white sm:px-6 sm:py-3.5 sm:rounded-[24px] md:rounded-[28px] shadow-[0_22px_55px_rgba(143,114,245,0.38)] text-left z-20 border border-white/35 flex flex-col justify-center sm:gap-1 cursor-pointer select-none backdrop-blur-sm pointer-events-auto will-change-transform"
            >
              <div className="flex items-center justify-between text-white/95">
                <span className="sm:text-sm md:text-[15px] font-semibold tracking-tight">
                  +1 (800) 529-1037
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/20 border border-white/25">
                  Central Lab
                </span>
              </div>
              <div className="sm:text-xs md:text-[13px] text-white/90 font-medium tracking-wide">
                support@aminobased.com
              </div>
              <div className="sm:text-[10px] md:text-[11px] text-white/80 tracking-wider">
                Research & Analytical Synthesis Facility
              </div>
              <div className="sm:text-[9px] md:text-[10px] text-white/70 tracking-wider uppercase">
                Mon – Fri 9:00 AM – 6:00 PM EST
              </div>
            </motion.div>

          </div>
        </div>

        {/* 3. Staggered Form (Name → Email → Subject → Message → Send button) */}
        <motion.form
          variants={formContainerVariants}
          action={formAction}
          className="max-w-5xl mx-auto w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            
            {/* Left Column: 3 Pill Inputs on Row 1 + Message Textarea on Row 2 */}
            <div className="lg:col-span-9 flex flex-col gap-3 sm:gap-4">
              
              {/* Row 1: Staggered Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <motion.div variants={formItemVariants}>
                  <input
                    type="text"
                    name="name"
                    required
                    maxLength={200}
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-14 sm:h-16 lg:h-[68px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-full px-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#8F72F5]/50 focus:bg-white focus:ring-4 focus:ring-[#8F72F5]/15 transition-all"
                  />
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={254}
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-14 sm:h-16 lg:h-[68px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-full px-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#8F72F5]/50 focus:bg-white focus:ring-4 focus:ring-[#8F72F5]/15 transition-all"
                  />
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <input
                    type="text"
                    name="subject"
                    maxLength={300}
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-14 sm:h-16 lg:h-[68px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-full px-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#8F72F5]/50 focus:bg-white focus:ring-4 focus:ring-[#8F72F5]/15 transition-all"
                  />
                </motion.div>
              </div>

              {/* Row 2: Staggered Message Textarea */}
              <motion.div variants={formItemVariants} className="flex-1">
                <textarea
                  rows={5}
                  name="message"
                  required
                  maxLength={5000}
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-full min-h-[175px] sm:min-h-[195px] lg:min-h-[215px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] p-6 sm:p-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#8F72F5]/50 focus:bg-white focus:ring-4 focus:ring-[#8F72F5]/15 transition-all resize-none"
                />
              </motion.div>
            </div>

            {/* Right Column: Staggered + Scaled Purple Send Button */}
            <motion.div variants={sendButtonVariants} className="lg:col-span-3 flex">
              <button
                type="submit"
                disabled={isPending}
                className="w-full min-h-[150px] lg:h-full rounded-[26px] sm:rounded-[30px] lg:rounded-[34px] bg-gradient-to-br from-[#9D82F7] via-[#8F72F5] to-[#7E5DF2] text-white p-6 flex flex-col items-center justify-center gap-3.5 shadow-xl shadow-[#8F72F5]/25 hover:shadow-2xl hover:shadow-[#8F72F5]/40 hover:scale-[1.02] active:scale-[0.98] transition-all group disabled:opacity-75 cursor-pointer"
              >
                <svg
                  className={`w-9 h-9 sm:w-10 sm:h-10 text-white/95 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 stroke-[1.8] ${
                    isPending ? "animate-pulse" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
                <span className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">
                  {isPending ? "Sending..." : "Send"}
                </span>
              </button>
            </motion.div>

          </div>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 p-4 rounded-xl text-center text-sm font-medium ${
                state.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {feedback}
            </div>
          )}
        </motion.form>
      </div>
    </motion.section>
  );
}

