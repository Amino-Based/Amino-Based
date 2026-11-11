import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import Fuse from "fuse.js";

import { resolveCanonicalProductSlug } from "@/lib/productSlugs";
import { toCleanSlug } from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";
import { resolveMediaUrl } from "@/lib/types/shop";

export const dynamic = "force-dynamic";

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  category?: string | null;
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
      const imageUrl = resolveProductImageUrl({
        name: product.name,
        slug: product.slug,
        dbImageUrl: resolveMediaUrl(product.images?.[0]?.image as never),
      });
      const canonicalSlug =
        resolveCanonicalProductSlug(product.slug ?? "") ?? toCleanSlug(product.slug, product.name);

      let categoryName: string | null = null;
      if (Array.isArray(product.categories) && product.categories.length > 0) {
        const firstCat = product.categories[0];
        if (typeof firstCat === "object" && firstCat && "name" in firstCat) {
          categoryName = (firstCat as { name: string }).name;
        }
      }

      return {
        id: String(product.id),
        name: product.name,
        slug: canonicalSlug,
        price: product.price,
        imageUrl,
        category: categoryName,
        description: product.description,
      };
    });

    const fuse = new Fuse(items, {
      keys: [
        { name: "name", weight: 3 },
        { name: "category", weight: 1.5 },
        { name: "description", weight: 1 },
      ],
      threshold: 0.4,
    });

    const results: SearchResult[] = fuse
      .search(q)
      .slice(0, 8)
      .map(({ item }) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category ?? null,
      }));

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search failed:", err);
    return NextResponse.json([], { status: 200 });
  }
}
