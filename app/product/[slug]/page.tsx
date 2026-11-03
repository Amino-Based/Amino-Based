import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import ProductClient from "@/components/product/ProductClient";
import ProductReviews, { type PublicReview } from "@/components/product/ProductReviews";
import { getPayloadUser } from "@/lib/auth/getPayloadUser";
import { getReviewEligibility } from "@/lib/reviews/eligibility";
import {
  extractDosageFromName,
  getMultiVariantConfig,
  toShopCardProduct,
  toShopCardProducts,
} from "@/lib/shopCardProduct";
import { getProductPrimaryImageUrl, getEffectivePrice } from "@/lib/types/shop";
import { resolveBlogMediaUrl, type ProductRelatedPost } from "@/lib/types/blog";
import type { ShopProduct } from "@/lib/types/shop";
import { siteUrl } from "@/lib/siteUrl";
import {
  CANONICAL_PRODUCT_SLUGS,
  PRODUCT_SLUG_REDIRECTS,
  resolveCanonicalProductSlug,
} from "@/lib/productSlugs";

export const dynamic = "force-dynamic";

function buildProductJsonLd(product: ShopProduct, imageUrl: string, canonicalSlug: string) {
  const card = toShopCardProduct(product);
  const price = getEffectivePrice(product.price, product.salePrice);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    description: product.description || product.seoDescription || undefined,
    image: imageUrl,
    sku: product.sku || undefined,
    brand: { "@type": "Brand", name: "Amino Based" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${canonicalSlug}`,
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability:
        (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(typeof product.coaPurity === "number"
      ? { additionalProperty: { "@type": "PropertyValue", name: "Purity", value: `${product.coaPurity}%` } }
      : {}),
  };
}

function buildFaqJsonLd(product: ShopProduct) {
  const faqs = (product.faqs ?? []).filter((f) => f.question && f.answer);
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

const getProductBySlug = cache(async (slug: string) => {
  const canonicalSlug = resolveCanonicalProductSlug(slug);
  if (!canonicalSlug) return null;

  try {
    const payload = await getPayload({ config });
    const mvConfig = getMultiVariantConfig(canonicalSlug);

    if (mvConfig) {
      const keywordConditions = (mvConfig.dbKeywords || [mvConfig.name, mvConfig.slug]).flatMap(
        (kw) => [
          { slug: { equals: kw } },
          { slug: { like: `${kw}%` } },
          { name: { like: `${kw}%` } },
          { name: { equals: kw } },
        ]
      );

      const result = await payload.find({
        collection: "products",
        where: {
          or: [
            { slug: { equals: canonicalSlug } },
            { slug: { equals: mvConfig.slug } },
            ...keywordConditions,
          ],
        } as any,
        sort: "name",
        depth: 2,
        limit: 10,
      });

      if (result.docs?.length > 0) {
        const primaryDoc =
          result.docs.find((d: any) => {
            const parsed = extractDosageFromName(d.name || "");
            return parsed.dosage?.toLowerCase() === mvConfig.defaultDosage.toLowerCase();
          }) || result.docs[0];

        return primaryDoc as unknown as ShopProduct;
      }
    }

    let result = await payload.find({
      collection: "products",
      where: { slug: { equals: canonicalSlug } },
      depth: 2,
      limit: 1,
    });
    if (result.docs?.[0]) return result.docs[0] as unknown as ShopProduct;

    result = await payload.find({
      collection: "products",
      where: {
        or: [{ slug: { like: `${canonicalSlug}-%` } }],
      } as any,
      sort: "name",
      depth: 2,
      limit: 1,
    });

    if (result.docs?.[0]) return result.docs[0] as unknown as ShopProduct;
  } catch (err) {
    // A database failure is not "product not found". Returning null would render a 404 and
    // could deindex real products during an outage; the previous behaviour was worse still —
    // it synthesised a product with invented price, stock and COA values. Rethrow so Next
    // renders the error boundary and the outage is visible instead of silently papered over.
    console.error("Product page: database query failed for slug:", canonicalSlug, err);
    throw err;
  }

  // Canonical slug, but no such product in the database (e.g. not seeded yet). The caller
  // turns null into a 404. Never synthesise a placeholder product here.
  return null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalProductSlug(slug);

  if (!canonicalSlug) {
    return { title: "Product Not Found | Amino Based" };
  }

  const product = await getProductBySlug(canonicalSlug);

  if (!product) {
    return { title: "Product Not Found | Amino Based" };
  }

  const cardProduct = toShopCardProduct(product);
  // Metadata fallbacks state nothing that is not already true of every item in the catalogue.
  // The previous defaults asserted a purity level in the page title and a testing method plus a
  // certificate in the meta description, for any product lacking SEO copy — testing claims
  // published to search engines for products with no certificate on file.
  // Research-use-only is a stated sales policy, not a laboratory result, so it is safe to keep.
  const title = product.seoTitle || `${cardProduct.name} | Amino Based`;
  const description =
    product.seoDescription ||
    product.description ||
    `${cardProduct.name} — supplied for laboratory research use only.`;
  const imageUrl = getProductPrimaryImageUrl(product);
  const url = `${siteUrl}/product/${canonicalSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Amino Based",
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (PRODUCT_SLUG_REDIRECTS[slug]) {
    redirect(`/product/${PRODUCT_SLUG_REDIRECTS[slug]}`);
  }

  if (!CANONICAL_PRODUCT_SLUGS.has(slug)) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryIds = (product.categories ?? [])
    .map((c) => (typeof c === "object" ? c.id : c))
    .filter(Boolean);

  let relatedProducts: ShopProduct[] = [];
  let relatedPosts: ProductRelatedPost[] = [];
  let publicReviews: PublicReview[] = [];
  let eligibility: Awaited<ReturnType<typeof getReviewEligibility>>["status"] = "login_required";
  const familyProductIds: Array<number | string> = [product.id];

  try {
    const payload = await getPayload({ config });

    if (categoryIds.length > 0) {
      try {
        const relatedResult = await payload.find({
          collection: "products",
          where: {
            and: [
              { status: { equals: "active" } },
              { isVisible: { equals: true } },
              { categories: { in: categoryIds } },
              { id: { not_equals: product.id } },
            ],
          },
          limit: 8,
          depth: 2,
        });
        relatedProducts = (relatedResult.docs ?? []) as unknown as ShopProduct[];
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    }

    const mvConfig = getMultiVariantConfig(slug);
    if (mvConfig) {
      try {
        const keywordConditions = (mvConfig.dbKeywords || [mvConfig.name, mvConfig.slug]).flatMap(
          (kw) => [{ slug: { like: `${kw}%` } }, { name: { like: `${kw}%` } }]
        );
        const family = await payload.find({
          collection: "products",
          where: { or: [{ slug: { equals: mvConfig.slug } }, ...keywordConditions] } as any,
          limit: 10,
          depth: 0,
        });
        for (const doc of family.docs)
          if (!familyProductIds.includes(doc.id)) familyProductIds.push(doc.id);
      } catch (err) {
        console.error("Failed to load product family for reviews:", err);
      }
    }

    try {
      const postResult = await payload.find({
        collection: "blog-posts",
        where: {
          and: [{ status: { equals: "published" } }, { relatedProducts: { in: familyProductIds } }],
        },
        sort: "-publishedAt",
        limit: 3,
        depth: 1,
      });
      relatedPosts = (postResult.docs ?? []).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: String(post.slug ?? post.id).replace(/^\/+/, ""),
        excerpt: post.excerpt ?? null,
        category: post.category ?? null,
        readTime: post.readTime ?? null,
        publishedAt: post.publishedAt ?? null,
        imageUrl: resolveBlogMediaUrl(post.featuredImage) ?? null,
      }));
    } catch (err) {
      console.error("Failed to load related blog posts:", err);
    }

    try {
      const reviewResult = await payload.find({
        collection: "reviews",
        where: {
          and: [{ product: { in: familyProductIds } }, { status: { equals: "approved" } }],
        },
        sort: "-createdAt",
        limit: 50,
        depth: 1,
        overrideAccess: true,
      });
      publicReviews = reviewResult.docs.map((r: any) => {
        const u = typeof r.user === "object" && r.user ? r.user : null;
        const first = (u?.firstName as string | undefined)?.trim();
        const lastInitial = (u?.lastName as string | undefined)?.trim()?.[0];
        return {
          id: r.id,
          rating: Number(r.rating) || 0,
          comment: r.comment,
          verifiedPurchase: !!r.verifiedPurchase,
          author: first ? `${first}${lastInitial ? ` ${lastInitial}.` : ""}` : "Verified customer",
          createdAt: r.createdAt,
        };
      });
      const viewer = await getPayloadUser();
      eligibility = (await getReviewEligibility(payload, viewer?.id, familyProductIds)).status;
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  } catch (err) {
    // Database offline - fallback gracefully
  }

  // Related products are whatever the database actually returned — possibly none. This block
  // used to top the list up to four with synthesised products built from the static catalog,
  // which produced cards carrying invented prices, stock and COA values and linking to pages
  // that do not exist.
  // Provide fallback related blog posts if none fetched
  if (relatedPosts.length === 0) {
    relatedPosts = [
      {
        id: "guide-reconstitution",
        title: "Standard Laboratory Lyophilized Peptide Reconstitution Protocols",
        slug: "reconstitution-guide",
        excerpt: "Step-by-step analytical procedures for reconstituting solid lyophilized peptides using bacteriostatic water.",
        category: "Laboratory Guides",
        readTime: "4 min read",
        publishedAt: "2024-10-12T00:00:00.000Z",
        imageUrl: "/assets/webinar_1.jpg",
      },
      {
        id: "guide-storage",
        title: "Cold-Chain Integrity: Storage at -20°C vs 2-8°C in Lab Environments",
        slug: "storage-stability",
        excerpt: "An overview of peptide degradation pathways and optimal cryogenic containment conditions.",
        category: "Storage & Stability",
        readTime: "5 min read",
        publishedAt: "2024-10-08T00:00:00.000Z",
        imageUrl: "/assets/webinar_2.jpg",
      },
      {
        id: "guide-hplc",
        title: "Understanding Reverse-Phase HPLC and Mass Spectrometry Chromatograms",
        slug: "interpreting-coa",
        excerpt: "How to interpret retention times, peak areas, and mass confirmation on your lot-specific COA.",
        category: "Analytical Chemistry",
        readTime: "6 min read",
        publishedAt: "2024-09-28T00:00:00.000Z",
        imageUrl: "/assets/webinar_3.jpg",
      },
    ];
  }

  const imageUrl = getProductPrimaryImageUrl(product);
  const productJsonLd: Record<string, unknown> = buildProductJsonLd(product, imageUrl, slug);
  if (publicReviews.length > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (
        publicReviews.reduce((s, r) => s + r.rating, 0) / publicReviews.length
      ).toFixed(1),
      reviewCount: publicReviews.length,
    };
  }
  const faqJsonLd = buildFaqJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ProductClient
        product={product}
        cardProduct={toShopCardProduct(product)}
        relatedProducts={toShopCardProducts(relatedProducts)}
        relatedPosts={relatedPosts}
        reviewsSlot={
          <ProductReviews
            reviews={publicReviews}
            familyProductIds={familyProductIds}
            eligibility={eligibility}
          />
        }
      />
    </>
  );
}
