import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import HomeClient from "@/components/HomeClient";
import type { CategoryCardData } from "@/components/CategoriesSection";
import { getCategoryImage } from "@/lib/categoryImages";
import type { BlogPostCardData } from "@/components/BlogSection";
import { toShopCardProducts, type ShopMockProduct } from "@/lib/shopCardProduct";
import type { ShopProduct } from "@/lib/types/shop";
import { DEFAULT_FAQS } from "@/lib/defaultFaqs";
import { DEFAULT_RESEARCH_BLOGS } from "@/lib/defaultBlogs";
import { siteUrl } from "@/lib/siteUrl";
import { SITE_INDEXING_ENABLED } from "@/lib/indexability";

const FALLBACK_BLOG_IMAGE = "/blog-1.jpg";

const TITLE = "Research Peptides | ≥99% Purity, COA Verified | Amino Based";
const DESCRIPTION =
  "Buy research peptides tested by HPLC and mass spectrometry to ≥99% purity. Every lot ships with a matching Certificate of Analysis. US-made. RUO only.";
const OG_DESCRIPTION =
  "Every lot is HPLC and MS tested to ≥99% purity and ships with a Certificate of Analysis you can match to the vial label. For laboratory research use only.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: siteUrl },
  // No hardcoded `index: true`. It used to override the root layout's noindex,
  // so this page advertised itself as indexable on every staging and preview
  // host — including the Railway domain. Indexability is now decided in one
  // place (lib/indexability.ts) and inherited from the layout; only the
  // preview-size hints, which are meaningless when noindexed, are set here.
  ...(SITE_INDEXING_ENABLED
    ? {
        robots: {
          googleBot: {
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
      }
    : {}),
  openGraph: {
    title: TITLE,
    description: OG_DESCRIPTION,
    url: siteUrl,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/placeholder-wide.svg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: OG_DESCRIPTION,
    images: [`${siteUrl}/placeholder-wide.svg`],
  },
};

function buildJsonLdGraph(products: ShopMockProduct[]) {
  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Amino Based",
    alternateName: "AminoBased",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/placeholder-product.svg`,
    },
    description:
      "Amino Based is a United States supplier of research-grade peptides. Every lot is analysed by reverse-phase HPLC for purity and by mass spectrometry for molecular identity, and ships with a lot-specific Certificate of Analysis. Products are sold for laboratory research use only and are not drugs, supplements or cosmetics.",
    email: "support@aminobased.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@aminobased.com",
      areaServed: "US",
      availableLanguage: "English",
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Amino Based",
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${siteUrl}/#bestsellers`,
    name: "Best-Selling Research Peptides",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${p.name} Research Peptide`,
        url: `${siteUrl}/product/${p.slug}`,
        image: p.image.startsWith("http") ? p.image : `${siteUrl}${p.image}`,
        sku: p.id,
        description: p.description,
        brand: { "@type": "Brand", name: "Amino Based" },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/product/${p.slug}`,
          price: p.price.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${siteUrl}/#organization` },
        },
      },
    })),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: DEFAULT_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webPage, itemList, faqPage],
  };
}

interface MediaRef {
  url?: string | null;
}

interface CategoryDoc {
  id: string | number;
  name: string;
  slug?: string | null;
  isVisible?: boolean | null;
  sortOrder?: number | null;
}

interface BlogPostDoc {
  id: string | number;
  title: string;
  slug?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  readTime?: string | null;
  featuredImage?: MediaRef | string | number | null;
}

function mapCategory(category: CategoryDoc): CategoryCardData {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug || String(category.id),
    image: getCategoryImage(category.name),
  };
}

function formatBlogDate(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

function getBlogImageUrl(post: BlogPostDoc): string {
  const image = post.featuredImage;
  if (image && typeof image === "object" && "url" in image && image.url) {
    return image.url;
  }
  return FALLBACK_BLOG_IMAGE;
}

function mapBlogPost(post: BlogPostDoc): BlogPostCardData {
  return {
    id: post.id,
    tag: post.category || "Research",
    date: formatBlogDate(post.publishedAt),
    title: post.title,
    excerpt: post.excerpt || undefined,
    readTime: post.readTime || undefined,
    image: getBlogImageUrl(post),
    slug: post.slug || String(post.id),
  };
}

export default async function Home() {
  let products: ShopMockProduct[] = [];
  let categories: CategoryCardData[] = [];
  let posts: BlogPostCardData[] = [];

  try {
    const payload = await getPayload({ config });

    const [productsResult, categoriesResult, postsResult] = await Promise.all([
      payload.find({
        collection: "products",
        where: {
          isBestSeller: { equals: true },
          status: { equals: "active" },
        },
        limit: 4,
        depth: 2,
        overrideAccess: true,
      }),
      payload.find({
        collection: "categories",
        where: { isVisible: { equals: true } },
        sort: "sortOrder",
        overrideAccess: true,
      }),
      payload.find({
        collection: "blog-posts",
        where: { status: { equals: "published" } },
        sort: "-publishedAt",
        limit: 4,
        overrideAccess: true,
      }),
    ]);

    products = toShopCardProducts(productsResult.docs as unknown as ShopProduct[]);
    categories = (categoriesResult.docs as CategoryDoc[]).map(mapCategory);
    posts = (postsResult.docs as BlogPostDoc[]).map(mapBlogPost);
  } catch (error) {
    // No database connection yet (or a query error) — fall back to the
    // hardcoded arrays baked into each section component so the homepage
    // never renders broken before the database is seeded.
    console.error("Failed to load homepage data from Payload:", error);
  }

  // Fallback to default research blogs if none retrieved from DB
  if (!posts || posts.length === 0) {
    posts = DEFAULT_RESEARCH_BLOGS.map((p) => ({
      id: p.id,
      tag: p.category || "Research",
      date: formatBlogDate(p.publishedAt),
      readTime: p.readTime || "5 min read",
      title: p.title,
      excerpt: p.excerpt || undefined,
      image:
        p.featuredImage && typeof p.featuredImage === "object" && "url" in p.featuredImage && p.featuredImage.url
          ? p.featuredImage.url
          : "/blog-1.jpg",
      slug: p.slug || String(p.id),
    }));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLdGraph(products)) }}
      />
      <HomeClient products={products} categories={categories} posts={posts} />
    </>
  );
}
