import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { BlogPost } from "@/lib/types/blog";
import { resolveBlogMediaUrl } from "@/lib/types/blog";
import { DEFAULT_RESEARCH_BLOGS } from "@/lib/defaultBlogs";
import ModernBlogArticle from "@/components/blog/ModernBlogArticle";
import { SITE_URL } from "@/lib/siteUrl";

function estimateWordCount(post: BlogPost): number {
  const chunks: string[] = [
    post.title,
    post.excerpt || "",
    post.shortAnswer || "",
    post.introScope || "",
    post.conclusion || "",
    post.ruoStatement || "",
  ];

  (post.keyTakeaways ?? []).forEach((t) => chunks.push(t.text));
  (post.structuredSections ?? []).forEach((s) => {
    chunks.push(s.heading);
    if (s.content) chunks.push(s.content);
    (s.subsections ?? []).forEach((sub) => {
      chunks.push(sub.heading);
      chunks.push(sub.content);
    });
  });
  (post.faqs ?? []).forEach((f) => {
    chunks.push(f.question);
    chunks.push(f.answer);
  });

  const fullText = chunks.join(" ").trim();
  return fullText ? fullText.split(/\s+/).filter(Boolean).length : 0;
}

export const dynamic = "force-dynamic";

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "blog-posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 50,
      depth: 1,
    });
    if (result.docs && result.docs.length > 0) {
      return result.docs as unknown as BlogPost[];
    }
  } catch (err) {
    console.error("Failed to load blog posts from database:", err);
  }
  return DEFAULT_RESEARCH_BLOGS;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug || String(p.id) === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | Amino Based" };

  const cleanSlug = slug.replace(/^\/+/, "");
  // Strict rule: Title max 60 characters
  let title = `${post.title} | Amino Based`;
  if (title.length > 60) {
    const maxTitleLen = 60 - " | Amino Based".length;
    title = `${post.title.slice(0, maxTitleLen).trim()} | Amino Based`;
  }

  // Strict rule: Meta description max 155 characters
  let description = post.excerpt || "Technical peptide research monograph by the Amino Based research team.";
  if (description.length > 155) {
    description = description.slice(0, 152).trim() + "...";
  }

  const url = `${SITE_URL}/blog/${cleanSlug}`;
  const imageUrl = resolveBlogMediaUrl(post.featuredImage) ?? `${SITE_URL}/blog-1.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Amino Based",
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug || String(p.id) === slug);
  if (!post) notFound();

  const cleanSlug = slug.replace(/^\/+/, "");
  const pageUrl = `${SITE_URL}/blog/${cleanSlug}`;
  const imageUrl = resolveBlogMediaUrl(post.featuredImage) || `${SITE_URL}/blog-1.jpg`;
  const absoluteImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

  const wordCount = estimateWordCount(post);

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline: post.title,
        description: post.excerpt ?? undefined,
        image: { "@type": "ImageObject", url: absoluteImageUrl },
        datePublished: post.publishedAt ?? undefined,
        dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
        author: {
          "@type": "Organization",
          name: "Amino Based Research Team",
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Amino Based",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/amino-logo.svg` },
        },
        articleSection: post.category ?? undefined,
        wordCount: wordCount > 0 ? wordCount : undefined,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
        ],
      },
    ],
  };

  const faqs = (post.faqs ?? []).filter((f) => f.question && f.answer);
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Modern, Creative Biotech Article Showcase following exact 14-section order */}
      <ModernBlogArticle post={post} allPosts={allPosts} slug={cleanSlug} />
    </main>
  );
}