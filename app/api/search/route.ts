import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import Fuse from "fuse.js";

import { resolveCanonicalProductSlug } from "@/lib/productSlugs";
import { toCleanSlug } from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";
import { resolveMediaUrl } from "@/lib/types/shop";

export const dynamic = "force-dynamic";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const payload = await getPayload({ config });

    const productsResult = await payload.find({
      collection: "products",
      where: {
        status: { equals: "active" },
        isVisible: { equals: true },
      },
      limit: 500,
      depth: 1,
      overrideAccess: true,
    });

    const items: (SearchResult & { description?: string | null })[] = (
      productsResult.docs ?? []
    ).map((product) => {
      // Was hardcoded to /product-card-image.png — a Prime Time Bio Labs Retatrutide vial
      // served as the thumbnail for every search result. Resolved properly now: a stored
      // image when there is one, else a verified Amino Based asset, else the placeholder.
      const imageUrl = resolveProductImageUrl({
        name: product.name,
        slug: product.slug,
        dbImageUrl: resolveMediaUrl(product.images?.[0]?.image as never),
      });
      const canonicalSlug = resolveCanonicalProductSlug(product.slug ?? "") ?? toCleanSlug(product.slug, product.name);
      return {
        id: String(product.id),
        name: product.name,
        slug: canonicalSlug,
        price: product.price,
        imageUrl,
        description: product.description,
      };
    });

    const fuse = new Fuse(items, {
      keys: [
        { name: "name", weight: 3 },
        { name: "description", weight: 1 },
      ],
      threshold: 0.4,
    });

    const results = fuse
      .search(q)
      .slice(0, 8)
      .map(({ item }) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        imageUrl: item.imageUrl,
      }));

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search failed:", err);
    return NextResponse.json([], { status: 200 });
  }
}
