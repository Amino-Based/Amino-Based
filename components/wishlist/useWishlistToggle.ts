"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toggleWishlistItem } from "@/lib/wishlist/actions";
import { useWishlistStore } from "@/lib/wishlist/store";

/**
 * Powers a heart button. `aliases` are all the ids the card might be known by (database id, SKU,
 * slug); `id` is what gets sent to the server to resolve the product. Signed-out visitors are
 * sent to the login page instead of silently doing nothing.
 */
export function useWishlistToggle(args: { id: string; aliases: string[]; variantSku: string; price: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const keys = useWishlistStore((s) => s.keys);
  const apply = useWishlistStore((s) => s.apply);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isWishlisted = args.aliases.some((alias) => alias && keys.includes(alias));

  function toggle() {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await toggleWishlistItem(args.id, args.variantSku, args.price, pathname ?? undefined);
      if ("error" in result) {
        if (result.error === "login_required") {
          router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/shop")}`);
        } else {
          setError("Couldn't update your wishlist. Please try again.");
        }
        return;
      }
      apply(result.keys, result.added);
      router.refresh(); // keeps the nav wishlist count in sync
    });
  }

  return { isWishlisted, isPending, error, toggle };
}
