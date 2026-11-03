"use client";

import React, { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "@/app/contact-us/actions";

const initialState: ContactFormState = { success: false };

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = "" }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-12 px-6 bg-white/70 rounded-2xl border border-emerald-200 shadow-xs">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">
          Message Transmitted
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md leading-relaxed">
          Thank you for reaching out to Amino Based. Your inquiry has been routed directly to our laboratory support specialists. We will follow up within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-6 sm:space-y-7 ${className}`}>
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Field 1: Full name */}
      <div className="relative">
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full name"
          className="w-full bg-transparent border-b border-[#D5D7DE] focus:border-[#0F172A] py-2.5 sm:py-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-colors"
        />
      </div>

      {/* Field 2: Email */}
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full bg-transparent border-b border-[#D5D7DE] focus:border-[#0F172A] py-2.5 sm:py-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-colors"
        />
      </div>

      {/* Field 3: Subject */}
      <div className="relative">
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          className="w-full bg-transparent border-b border-[#D5D7DE] focus:border-[#0F172A] py-2.5 sm:py-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-colors"
        />
      </div>

      {/* Field 4: Message */}
      <div className="relative">
        <textarea
          id="message"
          name="message"
          required
          rows={3}
          placeholder="Message"
          className="w-full bg-transparent border-b border-[#D5D7DE] focus:border-[#0F172A] py-2.5 sm:py-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Submit Pill Button matching reference */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#111827] hover:bg-[#1F2937] active:scale-98 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2.5 transition-all shadow-xs disabled:opacity-50 group"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 group-hover:scale-125 transition-transform" />
              <span>Send a message</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
