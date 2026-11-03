"use client";

import React, { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plus, Edit2, Trash2, X } from "lucide-react";
import { addAddress, updateAddress, deleteAddress } from "@/app/account/addresses/actions";

export interface AddressItem {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const inputClass =
  "font-inter w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const labelClass =
  "font-inter block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2";

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
      setMessage({ type: "success", text: editingId ? "Address updated." : "Address added." });
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-inter text-3xl md:text-5xl uppercase font-bold tracking-wider text-gray-900">
            Addresses
          </h1>
          <p className="font-inter text-gray-500 mt-3 max-w-lg text-sm">
            Manage the shipping and billing addresses on your account.
          </p>
        </div>
        <button
          onClick={openForNew}
          className="font-inter w-fit flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {message && (
        <div
          className={`font-inter px-4 py-3 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <form
              action={handleSubmit}
              key={editingId || "new"}
              className="bg-white border border-black/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-inter text-lg uppercase tracking-wider text-gray-900">
                  {editingId ? "Edit Address" : "New Address"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input name="firstName" required defaultValue={editingAddress?.firstName} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input name="lastName" required defaultValue={editingAddress?.lastName} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Company (optional)</label>
                  <input name="company" defaultValue={editingAddress?.company} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input name="line1" required defaultValue={editingAddress?.line1} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Apartment, suite, etc. (optional)</label>
                  <input name="line2" defaultValue={editingAddress?.line2} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input name="city" required defaultValue={editingAddress?.city} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
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
                  <label className={labelClass}>Phone</label>
                  <input name="phone" type="tel" required defaultValue={editingAddress?.phone} className={inputClass} />
                </div>
                <input type="hidden" name="label" defaultValue={editingAddress?.label} />
                <div className="sm:col-span-2 flex items-center gap-3 pt-2 border-t border-black/5">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    defaultChecked={editingAddress?.isDefault}
                    className="w-4 h-4 rounded border-black/20 accent-indigo-600"
                  />
                  <label htmlFor="isDefault" className="font-inter text-sm text-gray-600">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="font-inter px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  {isPending ? "Saving..." : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="font-inter px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length > 0 ? (
        <div className="bg-white border border-black/5 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col divide-y divide-gray-100">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="group flex flex-col md:flex-row md:items-start justify-between py-6 gap-4"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-black/5 flex items-center justify-center text-gray-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="font-inter flex flex-col text-sm text-gray-500 leading-relaxed">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gray-900 font-semibold">
                        {address.firstName} {address.lastName}
                      </span>
                      {address.isDefault && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    {address.company && <span>{address.company}</span>}
                    <span>{address.line1}</span>
                    {address.line2 && <span>{address.line2}</span>}
                    <span>
                      {address.city}, {address.state} {address.postalCode}
                    </span>
                    <span>{address.country}</span>
                    <span className="text-gray-400 mt-2">{address.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    disabled={isPending}
                    onClick={() => openForEdit(address.id)}
                    className="font-inter flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(address.id)}
                    className="font-inter flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500/80 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-black/5 rounded-2xl shadow-sm">
          <MapPin className="w-10 h-10 text-gray-300 mb-5" strokeWidth={1} />
          <h2 className="font-inter text-xl uppercase tracking-wider text-gray-900 mb-2">
            No addresses yet
          </h2>
          <p className="font-inter text-gray-500 max-w-sm text-sm">
            Add a shipping or billing address to speed up checkout next time.
          </p>
        </div>
      )}
    </div>
  );
}
