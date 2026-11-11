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
  "w-full px-4 py-3 bg-neutral-50/80 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex bg-neutral-100 border border-neutral-200/80 rounded-full p-1 shrink-0">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
          checked ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-400 hover:text-neutral-600"
        }`}
      >
        On
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
          !checked ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-400 hover:text-neutral-600"
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
    <div className="flex flex-col gap-6 max-w-3xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-sans">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-lg leading-relaxed">
          Update your researcher profile, notification preferences, and account security credentials.
        </p>
      </div>

      {/* Personal Information */}
      <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        <h2 className="text-sm font-bold text-neutral-950 pb-3 border-b border-neutral-100 font-sans">
          Personal Information
        </h2>

        <form action={handleProfileSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input name="firstName" defaultValue={user.firstName} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input name="lastName" defaultValue={user.lastName} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Email Address</label>
              <input value={user.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Phone Number</label>
              <input name="phone" type="tel" defaultValue={user.phone} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-900">Research &amp; Product Updates</p>
                <p className="text-[11px] text-neutral-400">Receive verified lot releases and scientific publication highlights.</p>
              </div>
              <Toggle checked={acceptsMarketing} onChange={setAcceptsMarketing} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-900">Delivery SMS Alerts</p>
                <p className="text-[11px] text-neutral-400">Receive cold-chain dispatch and shipment tracking text alerts.</p>
              </div>
              <Toggle checked={orderSmsUpdates} onChange={setOrderSmsUpdates} />
            </div>
          </div>

          {profileMessage && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium border ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-fit inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-60 text-white text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Saving..." : "Save Preferences"}</span>
          </button>
        </form>
      </section>

      {/* Security */}
      {user.authProvider !== "google" && (
        <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
          <h2 className="text-sm font-bold text-neutral-950 pb-3 border-b border-neutral-100 font-sans">
            Password &amp; Security
          </h2>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium border ${
                  passwordMessage.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={passwordPending}
              className="w-fit inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-60 text-white text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-95 cursor-pointer mt-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{passwordPending ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
