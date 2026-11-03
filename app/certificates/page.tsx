import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import { FileCheck2, FlaskConical, ShieldCheck, FileDown } from "lucide-react";
import Footer from "@/components/Footer";
import { resolveMediaUrl } from "@/lib/types/shop";
import type { ShopProduct } from "@/lib/types/shop";
import { toShopCardProduct } from "@/lib/shopCardProduct";
import { siteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

const TITLE = "Certificates of Analysis | Amino Based";
const DESCRIPTION =
  "Every batch we produce is independently tested. Browse batch-specific Certificates of Analysis (COA) below or on each product page.";

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

const steps = [
  {
    icon: FlaskConical,
    title: "Independent Testing",
    description: "Every production batch is sent to a third-party lab for HPLC and mass spectrometry analysis.",
  },
  {
    icon: FileCheck2,
    title: "Batch-Specific COAs",
    description: "Each product page lists the exact batch number, purity percentage, and analysis date, with the COA document available to download.",
  },
  {
    icon: ShieldCheck,
    title: "Full Transparency",
    description: "We believe researchers deserve full visibility into what they're purchasing &mdash; no exceptions.",
  },
];

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

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative bg-[#FAFAFA] text-gray-900 overflow-hidden pt-28 pb-16 px-6 md:px-12 md:pt-36 lg:px-24">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 rounded uppercase">
            Quality &amp; Compliance
          </div>
          <h1 className="text-4xl md:text-6xl font-inter uppercase font-bold tracking-wider text-gray-900 leading-[1.2] mb-6">
            Certificates Of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Analysis</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
            Every peptide we produce is verified for purity and identity by an independent testing laboratory. Browse available COAs below, or find the batch-specific one on each product&apos;s page.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-24 border-t border-black/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-white border border-black/5 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-inter uppercase tracking-wide text-gray-900 mb-3 text-sm">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COA Grid */}
      <section className="bg-[#FAFAFA] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-inter uppercase tracking-wide text-gray-900 text-xl md:text-2xl mb-10 text-center">
            Available Certificates
          </h2>

          {productsWithCoa.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsWithCoa.map((product) => {
                const card = toShopCardProduct(product as any);
                const coaUrl = resolveMediaUrl(product.coaFile as any);
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                  >
                    {coaUrl && (
                      <Link href={`/product/${card.slug}`} className="block aspect-[4/3] bg-gray-100 overflow-hidden">
                        {/* COA images are scanned certificate documents, not product photography — a plain img keeps this simple and avoids next/image's remote-domain allowlist. */}
                        <img
                          src={coaUrl}
                          alt={`${product.name} Certificate of Analysis`}
                          className="w-full h-full object-cover object-top"
                        />
                      </Link>
                    )}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div>
                        <Link href={`/product/${card.slug}`}>
                          <h3 className="font-inter uppercase text-sm text-gray-900 hover:text-indigo-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 font-inter">
                          {product.coaBatchNumber && <span>Batch: {product.coaBatchNumber}</span>}
                          {typeof product.coaPurity === "number" && <span>Purity: {product.coaPurity}%</span>}
                        </div>
                      </div>
                      {coaUrl && (
                        <a
                          href={coaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          <FileDown className="w-4 h-4" /> Download COA
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No certificates are available to browse right now — check individual product pages for batch-specific COAs.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
