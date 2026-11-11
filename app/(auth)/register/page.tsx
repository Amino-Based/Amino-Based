"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.89c2.28-2.1 3.53-5.2 3.53-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.89-2.98c-1.08.72-2.45 1.15-4.04 1.15-3.11 0-5.74-2.1-6.68-4.92H1.3v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.32 14.33A7.2 7.2 0 0 1 4.9 12c0-.81.14-1.6.4-2.33V6.58H1.3A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.3 5.42l4.02-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.58l4.02 3.09c.94-2.82 3.57-4.92 6.68-4.92z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          acceptsMarketing,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Unable to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      mode="signup"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* First & Last Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-medium text-white/70 mb-1.5"
            >
              First Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full pl-8 pr-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/15 focus:border-white/50 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-medium text-white/70 mb-1.5"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last"
              className="w-full px-3 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/15 focus:border-white/50 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-white/70 mb-1.5"
          >
            Email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/15 focus:border-white/50 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field with Eye Toggle */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-white/70 mb-1.5"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/15 focus:border-white/50 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all font-mono tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-white/40 hover:text-white transition-colors p-0.5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Marketing Checkbox */}
        <label className="flex items-start gap-2.5 text-xs text-white/60 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={acceptsMarketing}
            onChange={(e) => setAcceptsMarketing(e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-0 focus:ring-offset-0 accent-cyan-400 cursor-pointer"
          />
          <span className="leading-tight">
            Keep me updated on research peptides and batch testing releases.
          </span>
        </label>

        {/* Primary Pill Button: "Create Account" */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full bg-[#E5E2DC] hover:bg-white active:scale-[0.99] disabled:opacity-60 text-[#121214] font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Creating account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* "or continue with" Divider */}
      <div className="relative flex items-center justify-center my-5">
        <div className="w-full border-t border-white/10" />
        <span className="absolute bg-[#181c1e] px-3.5 py-0.5 rounded-full text-[11px] font-medium text-white/45 tracking-wider border border-white/5">
          or continue with
        </span>
      </div>

      {/* Social Button: Google */}
      <div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs sm:text-sm font-medium text-white transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>
      </div>
    </AuthShell>
  );
}
