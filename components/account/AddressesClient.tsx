"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Edit2, Trash2, X, CheckCircle, ShieldCheck } from "lucide-react";
import {
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/app/account/addresses/actions";

export interface AddressItem {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  company: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const inputClass =
  "w-full px-4 py-3 bg-neutral-50/80 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5";

export function AddressesClient({ addresses }: { addresses: AddressItem[] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const editingAddress = editingId ? addresses.find((a) => a.id === editingId) : null;

  function openForNew() {
    setEditingId(null);
    setFormOpen(true);
    setMessage(null);
  }

  function openForEdit(id: string) {
    setEditingId(id);
    setFormOpen(true);
    setMessage(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = editingId
        ? await updateAddress(editingId, formData)
        : await addAddress(formData);

      if (!result.success) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      setMessage({ type: "success", text: editingId ? "Address updated successfully." : "Address added successfully." });
      closeForm();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (!result.success) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      setMessage({ type: "success", text: "Address deleted." });
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 font-sans">
            Addresses
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-lg leading-relaxed">
            Manage your verified shipping and billing destinations for laboratory deliveries.
          </p>
        </div>
        <button
          onClick={openForNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-95 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <form
              action={handleSubmit}
              key={editingId || "new"}
              className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold text-neutral-950">
                  {editingId ? "Edit Address Details" : "New Address Details"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input name="firstName" required defaultValue={editingAddress?.firstName} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input name="lastName" required defaultValue={editingAddress?.lastName} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Institution / Company (optional)</label>
                  <input name="company" defaultValue={editingAddress?.company} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input name="line1" required defaultValue={editingAddress?.line1} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Apartment, Suite, Unit, Lab # (optional)</label>
                  <input name="line2" defaultValue={editingAddress?.line2} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input name="city" required defaultValue={editingAddress?.city} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input name="state" required defaultValue={editingAddress?.state} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input name="postalCode" required defaultValue={editingAddress?.postalCode} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input name="country" required defaultValue={editingAddress?.country || "US"} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Contact Phone</label>
                  <input name="phone" type="tel" required defaultValue={editingAddress?.phone} className={inputClass} />
                </div>
                <input type="hidden" name="label" defaultValue={editingAddress?.label} />
                <div className="sm:col-span-2 flex items-center gap-2.5 pt-2 border-t border-neutral-100">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    defaultChecked={editingAddress?.isDefault}
                    className="w-4 h-4 rounded border-neutral-300 accent-neutral-950"
                  />
                  <label htmlFor="isDefault" className="text-xs font-medium text-neutral-700 cursor-pointer">
                    Set as default laboratory destination
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-60 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 rounded-full text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/60 flex items-center justify-center text-neutral-700 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-xs sm:text-sm text-neutral-600 leading-relaxed min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-neutral-950 font-bold truncate">
                      {address.firstName} {address.lastName}
                    </span>
                    {address.isDefault && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-900 border border-neutral-200 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  {address.company && <span className="text-neutral-700 font-medium">{address.company}</span>}
                  <span>{address.line1}</span>
                  {address.line2 && <span>{address.line2}</span>}
                  <span>
                    {address.city}, {address.state} {address.postalCode}
                  </span>
                  <span>{address.country}</span>
                  <span className="text-neutral-400 mt-1">{address.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  disabled={isPending}
                  onClick={() => openForEdit(address.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-700 hover:text-black transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleDelete(address.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-xs">
          <MapPin className="w-10 h-10 text-neutral-300 mb-3" strokeWidth={1.5} />
          <h2 className="text-base font-bold text-neutral-900">
            No shipping addresses registered
          </h2>
          <p className="text-xs text-neutral-400 max-w-sm mt-1">
            Add a laboratory delivery destination to accelerate checkout verification.
          </p>
          <button
            onClick={openForNew}
            className="mt-5 px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Add First Address
          </button>
        </div>
      )}
    </div>
  );
}
