"use client";

import React, { useState, useTransition } from "react";
import { Save, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfile, updatePassword } from "@/app/account/settings/actions";

interface SettingsUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
  orderSmsUpdates: boolean;
  authProvider: string;
}

const inputClass =
  "font-inter w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const labelClass =
  "font-inter block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex bg-gray-50 border border-black/5 rounded-full p-1 shrink-0">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`font-inter px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
          checked ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        On
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`font-inter px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
          !checked ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        Off
      </button>
    </div>
  );
}

export function SettingsClient({ user }: { user: SettingsUser }) {
  const [isPending, startTransition] = useTransition();
  const [acceptsMarketing, setAcceptsMarketing] = useState(user.acceptsMarketing);
  const [orderSmsUpdates, setOrderSmsUpdates] = useState(user.orderSmsUpdates);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordPending, startPasswordTransition] = useTransition();
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleProfileSubmit(formData: FormData) {
    if (acceptsMarketing) formData.set("acceptsMarketing", "on");
    else formData.delete("acceptsMarketing");
    if (orderSmsUpdates) formData.set("orderSmsUpdates", "on");
    else formData.delete("orderSmsUpdates");

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.success) {
        setProfileMessage({ type: "error", text: result.error });
        return;
      }
      setProfileMessage({ type: "success", text: "Profile updated successfully." });
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    startPasswordTransition(async () => {
      const result = await updatePassword(currentPassword, newPassword);
      if (!result.success) {
        setPasswordMessage({ type: "error", text: result.error });
        return;
      }
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="font-inter text-3xl md:text-5xl uppercase font-bold tracking-wider text-gray-900">
          Settings
        </h1>
        <p className="font-inter text-gray-500 mt-3 max-w-lg text-sm">
          Update your personal information, notification preferences, and account security.
        </p>
      </div>

      {/* Personal Information */}
      <section className="bg-white border border-black/5 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <h2 className="font-inter text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-black/5 pb-4">
          Personal Information
        </h2>

        <form action={handleProfileSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>First Name</label>
              <input name="firstName" defaultValue={user.firstName} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input name="lastName" defaultValue={user.lastName} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Email</label>
              <input value={user.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Phone</label>
              <input name="phone" type="tel" defaultValue={user.phone} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-black/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-inter text-sm text-gray-900">Marketing emails</p>
                <p className="font-inter text-xs text-gray-500">Receive news and promotions.</p>
              </div>
              <Toggle checked={acceptsMarketing} onChange={setAcceptsMarketing} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-inter text-sm text-gray-900">Order SMS updates</p>
                <p className="font-inter text-xs text-gray-500">Get text alerts about your order status.</p>
              </div>
              <Toggle checked={orderSmsUpdates} onChange={setOrderSmsUpdates} />
            </div>
          </div>

          {profileMessage && (
            <div
              className={`font-inter flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {profileMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="font-inter w-fit flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Security */}
      {user.authProvider !== "google" && (
        <section className="bg-white border border-black/5 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <h2 className="font-inter text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-black/5 pb-4">
            Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`font-inter flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
                  passwordMessage.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordPending}
              className="font-inter w-fit flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <Lock className="w-4 h-4" />
              {passwordPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
