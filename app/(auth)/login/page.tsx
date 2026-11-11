"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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

function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 170" className={className} fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.93-12-14.55-6.19-9.5-11.05-20.2-14.59-32.08-3.53-11.89-5.3-23.08-5.3-33.58 0-14.28 3.65-25.79 10.96-34.52 7.31-8.73 16.5-13.19 27.56-13.38 5.76 0 11.75 1.48 17.97 4.43 6.22 2.96 10.19 4.49 11.91 4.59 1.52 0 5.65-1.63 12.38-4.88 6.73-3.26 12.74-4.64 18.04-4.16 13.91.73 24.58 5.74 32.01 15.02-12.06 7.31-18.04 17.5-17.94 30.56.1 10.23 3.99 18.87 11.68 25.92 7.69 7.05 16.89 10.99 27.6 11.83-2.3 6.84-4.99 13.88-8.08 21.13zM119.22 31.84c0-7.39 2.68-14.29 8.04-20.71C132.62 4.7 139.75.87 148.66 0c.34 1.25.51 2.37.51 3.38 0 7.38-2.77 14.47-8.31 21.26-5.54 6.8-12.65 10.87-21.33 12.22-.11-1.7-.31-3.37-.31-5.02z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      mode="signin"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Field matching reference */}
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
              className="dark-glass-input w-full pl-10 pr-4 py-3 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/15 focus:border-white/50 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field matching reference */}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="dark-glass-input w-full pl-10 pr-10 py-3 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/15 focus:border-white/50 rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all font-mono tracking-wider"
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

          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Primary Pill Button: "Sign In" */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full bg-[#E5E2DC] hover:bg-white active:scale-[0.99] disabled:opacity-60 text-[#121214] font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
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

      {/* Social Buttons: Google & Apple matching reference */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs sm:text-sm font-medium text-white transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs sm:text-sm font-medium text-white transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <AppleIcon className="w-4 h-4" />
          <span>Continue with Apple</span>
        </button>
      </div>
    </AuthShell>
  );
}
