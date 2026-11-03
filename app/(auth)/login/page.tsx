"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsSubmitting(false);
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
      title="Sign in"
      subtitle="Welcome back! Enter your details below."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Address Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-[13px] font-medium text-[#0F172A] mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-all"
          />
        </div>

        {/* Password Field with Forgot Password Link */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs sm:text-[13px] font-medium text-[#0F172A]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-all"
          />
        </div>

        {/* Keep Me Logged In Checkbox matching reference */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[#CBD5E1] text-[#0F172A] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#0F172A]"
          />
          <label
            htmlFor="remember"
            className="text-xs text-[#64748B] cursor-pointer select-none"
          >
            Keep me logged in
          </label>
        </div>

        {/* Primary Dark Sign In Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* OR Divider with Hairline matching reference */}
      <div className="relative flex items-center justify-center my-6">
        <div className="w-full border-t border-[#E2E8F0]" />
        <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
          OR
        </span>
      </div>

      {/* Social Button: Google */}
      <div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs sm:text-sm font-medium text-[#0F172A] transition-all shadow-2xs cursor-pointer active:scale-98"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>
      </div>
    </AuthShell>
  );
}
