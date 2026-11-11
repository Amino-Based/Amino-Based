import { getPayload } from "payload";
import config from "@payload-config";
import type { ShopProduct } from "@/lib/types/shop";
import { siteUrl } from "@/lib/siteUrl";
import CertificatesClient from "@/components/certificates/CertificatesClient";

export const dynamic = "force-dynamic";

const TITLE = "Certificates of Analysis (COA) | HPLC & MS Verified | Amino Based";
const DESCRIPTION =
  "Access batch-specific Certificates of Analysis for all Amino Based research peptides. View reverse-phase HPLC purity chromatograms and mass spectrometry reports.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${siteUrl}/certificates` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl}/certificates`,
    siteName: "Amino Based",
    type: "website",
    images: [{ url: `${siteUrl}/email/welcome-hero-amino.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${siteUrl}/email/welcome-hero-amino.jpg`],
  },
};

export default async function CertificatesPage() {
  let productsWithCoa: ShopProduct[] = [];
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "products",
      where: {
        and: [
          { status: { equals: "active" } },
          { isVisible: { equals: true } },
          { coaFile: { exists: true } },
        ],
      },
      depth: 2,
      limit: 100,
      sort: "name",
    });
    productsWithCoa = (result.docs ?? []) as unknown as ShopProduct[];
  } catch (err) {
    console.error("Failed to load COA products:", err);
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
        name: "Certificates of Analysis",
        item: `${siteUrl}/certificates`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CertificatesClient dbProducts={productsWithCoa} />
    </main>
  );
}
