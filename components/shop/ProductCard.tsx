"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { toggleWishlistItem } from "@/lib/wishlist/actions";
import {
  formatUsd,
  getEffectivePrice,
  getProductPrimaryImageUrl,
  type ShopProduct,
} from "@/lib/types/shop";
import { resolveCanonicalProductSlug } from "@/lib/productSlugs";

export default function ProductCard({
  product,
  isWishlisted = false,
}: {
  product: ShopProduct;
  isWishlisted?: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isPending, setIsPending] = useState(false);

  const imageUrl = getProductPrimaryImageUrl(product);
  const defaultVariant =
    product.hasVariants && product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;

  const price = defaultVariant ? defaultVariant.price : product.price;
  const salePrice = defaultVariant ? defaultVariant.salePrice : product.salePrice;
  const effectivePrice = getEffectivePrice(price, salePrice);
  const sku = defaultVariant ? defaultVariant.sku : product.sku ?? String(product.id);
  const inStock = (defaultVariant ? defaultVariant.stock : product.stock) > 0;

  const dosageLabel = defaultVariant?.options?.find((o) => o.value)?.value;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    const canonicalSlug = resolveCanonicalProductSlug(product.slug ?? "") ?? product.slug ?? String(product.id);
    addItem(
      {
        id: String(product.id),
        name: product.name,
        imageUrl,
        slug: canonicalSlug,
      },
      sku,
      1,
      effectivePrice,
      defaultVariant
        ? defaultVariant.options?.map((o) => o.value).filter(Boolean).join(" / ")
        : undefined
    );
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    setIsPending(true);
    try {
      const result = await toggleWishlistItem(product.id, sku, effectivePrice);
      if ("error" in result) {
        if (result.error === "login_required") {
          router.push("/login");
        }
        return;
      }
      setWishlisted(result.added);
    } finally {
      setIsPending(false);
    }
  };

  const canonicalProductSlug = resolveCanonicalProductSlug(product.slug ?? "") ?? product.slug ?? "";

  return (
    <Link
      href={`/product/${canonicalProductSlug}`}
      className="product-card group relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <button
        type="button"
        onClick={handleToggleWishlist}
        disabled={isPending}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-50"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            wishlisted ? "fill-indigo-400 text-indigo-400" : "text-gray-300"
          }`}
        />
      </button>

      {product.isBestSeller && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
            Best Seller
          </span>
        </div>
      )}

      <div className="relative h-48 mb-6 flex items-center justify-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
            No Image
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium font-inter leading-tight text-gray-100">
            {product.name}
          </h3>
          {dosageLabel && (
            <span className="text-sm font-mono text-gray-400 shrink-0 ml-2">{dosageLabel}</span>
          )}
        </div>

        {typeof product.coaPurity === "number" && (
          <div className="flex items-center gap-2 mb-4 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-medium text-gray-300">
              {product.coaPurity}%+ Purity
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
          <div className="flex items-baseline gap-2">
            {salePrice ? (
              <>
                <span className="text-xl font-light text-white">{formatUsd(salePrice)}</span>
                <span className="text-sm font-light text-gray-500 line-through">
                  {formatUsd(price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-light text-white">{formatUsd(price)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:text-white"
            aria-label={inStock ? "Add to cart" : "Out of stock"}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        {!inStock && (
          <span className="text-[11px] uppercase tracking-widest text-red-400/80 mt-2">
            Out of Stock
          </span>
        )}
      </div>
    </Link>
  );
}
