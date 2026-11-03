import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import ShopClient from "@/components/shop/ShopClient";
import { toShopCardProducts } from "@/lib/shopCardProduct";
import type { ShopProduct } from "@/lib/types/shop";
import { siteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

const TITLE = "Research Peptides Catalog | ≥99% HPLC Verified | Amino Based";
const DESCRIPTION =
  "Browse our full catalog of research-grade peptides — GLP-1, recovery, longevity, and metabolic analogs. Every batch is HPLC tested with a Certificate of Analysis.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/shop` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/shop`,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/placeholder-wide.svg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function ShopPage() {
  let products: ShopProduct[] = [];
  let categoryNames: string[] = [];
  // Distinguishes "the catalog is empty" from "we could not read the catalog". The shop used
  // to render the 98-entry static master catalog in both cases, advertising products that do
  // not exist in the database.
  let loadError = false;

  try {
    const payload = await getPayload({ config });
    const [productsResult, categoriesResult] = await Promise.all([
      payload.find({
        collection: "products",
        where: { and: [{ status: { equals: "active" } }, { isVisible: { equals: true } }] },
        depth: 2,
        limit: 100,
      }),
      payload.find({
        collection: "categories",
        where: { isVisible: { equals: true } },
        sort: "sortOrder",
        limit: 50,
      }),
    ]);
    products = (productsResult.docs ?? []) as unknown as ShopProduct[];
    categoryNames = (categoriesResult.docs ?? []).map((c) => c.name as string).filter(Boolean);
  } catch (err) {
    console.error("Failed to load shop data from Payload:", err);
    loadError = true;
  }

  const cardProducts = toShopCardProducts(products);

  return <ShopClient products={cardProducts} categories={categoryNames} loadError={loadError} />;
}
