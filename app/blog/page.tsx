import { getPayload } from "payload";
import config from "@payload-config";
import type { BlogPost } from "@/lib/types/blog";
import { DEFAULT_RESEARCH_BLOGS } from "@/lib/defaultBlogs";
import BlogListingClient from "@/components/blog/BlogListingClient";
import { siteUrl } from "@/lib/siteUrl";

const TITLE = "Research & Scientific Insights | Amino Based";
const DESCRIPTION =
  "In-depth peer-reviewed articles on peptide synthesis, analytical testing, and cellular mechanisms from the Amino Based research team.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/blog`,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/assets/blog_hero_wide.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${siteUrl}/assets/blog_hero_wide.png`],
  },
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  let posts: BlogPost[] = [];

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "blog-posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 50,
      depth: 1,
    });
    posts = (result.docs ?? []) as unknown as BlogPost[];
  } catch (err) {
    console.error("Failed to load blog posts from database:", err);
    posts = [];
  }

  if (!posts || posts.length === 0) {
    posts = DEFAULT_RESEARCH_BLOGS;
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/blog#collection`,
    name: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Amino Based",
      url: `${siteUrl}/`,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <BlogListingClient initialPosts={posts} />
    </main>
  );
}