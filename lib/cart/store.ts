"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  lineId: string;
  productId: string;
  variantSku: string;
  variantTitle?: string;
  quantity: number;
  priceSnapshot: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
    slug: string;
  };
};

type CartState = {
  items: CartLine[];
  couponCode: string | null;
  isOpen: boolean;
  setItems: (items: CartLine[]) => void;
  addItem: (
    product: CartLine["product"],
    variantSku: string,
    quantity: number,
    priceSnapshot: number,
    variantTitle?: string
  ) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
  toggleDrawer: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isOpen: false,

      setItems: (items) => set({ items }),

      addItem: (product, variantSku, quantity, priceSnapshot, variantTitle) => {
        const existing = get().items.find(
          (line) => line.productId === product.id && line.variantSku === variantSku
        );

        if (existing) {
          set({
            items: get().items.map((line) =>
              line.lineId === existing.lineId
                ? { ...line, quantity: line.quantity + quantity }
                : line
            ),
            isOpen: true,
          });
          return;
        }

        const newLine: CartLine = {
          lineId: crypto.randomUUID(),
          productId: product.id,
          variantSku,
          variantTitle,
          quantity,
          priceSnapshot,
          product,
        };

        set({ items: [...get().items, newLine], isOpen: true });
      },

      removeItem: (lineId) =>
        set({ items: get().items.filter((line) => line.lineId !== lineId) }),

      updateQuantity: (lineId, quantity) =>
        set({
          items: get().items.map((line) =>
            line.lineId === lineId
              ? { ...line, quantity: Math.max(1, quantity) }
              : line
          ),
        }),

      clear: () => set({ items: [], couponCode: null }),

      setCoupon: (code) => set({ couponCode: code }),

      toggleDrawer: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      // Renamed off the source project's key: both apps run on localhost:3000 in dev, which is one
      // localStorage origin, so the two storefronts were sharing a single persisted cart.
      name: "amino-based-cart-storage",
      // isOpen is transient UI state, not cart contents — never persist it, or a page
      // refreshed while the drawer was open would incorrectly reopen it on next visit.
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
    }
  )
);

export function useCartSubtotal() {
  return useCartStore((state) =>
    state.items.reduce((sum, line) => sum + line.priceSnapshot * line.quantity, 0)
  );
}

export function useCartItemCount() {
  return useCartStore((state) =>
    state.items.reduce((sum, line) => sum + line.quantity, 0)
  );
}
