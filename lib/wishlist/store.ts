"use client";

import { create } from "zustand";

/**
 * Which products the signed-in customer has wishlisted, shared by every heart button on the page.
 * A product is stored under several keys (database id, SKU, slug) because storefront cards use
 * different ids — multi-dosage cards use a SKU, plain ones the database id.
 */
type WishlistState = {
  keys: string[];
  setKeys: (keys: string[]) => void;
  apply: (keys: string[], added: boolean) => void;
};

export const useWishlistStore = create<WishlistState>((set) => ({
  keys: [],
  setKeys: (keys) => set({ keys }),
  apply: (keys, added) =>
    set((state) => ({
      keys: added
        ? Array.from(new Set([...state.keys, ...keys]))
        : state.keys.filter((k) => !keys.includes(k)),
    })),
}));
