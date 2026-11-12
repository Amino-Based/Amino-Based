import type { Metadata, Viewport } from "next";
import { Syncopate, Michroma, Open_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/cart/CartDrawer";
import SessionProvider from "@/components/providers/SessionProvider";
import AgeGate from "@/components/AgeGate";
import SiteHeader from "@/components/nav/SiteHeader";
import HeaderVisibility from "@/components/nav/HeaderVisibility";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Analytics from "@/components/Analytics";
import AdminOverflowFix from "@/components/admin/AdminOverflowFix";
import SitePreloader from "@/components/preloader/SitePreloader";
import { siteUrl } from "@/lib/siteUrl";
import { SITE_INDEXING_ENABLED } from "@/lib/indexability";

const futuristicFont = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-futuristic",
});

const michromaFont = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-michroma",
});

const openSansFont = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-opensans",
});

const cormorantFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

// Indexing is opt-IN via SITE_INDEXABLE, shared with robots.ts and sitemap.ts through
// lib/indexability.ts so the three can never disagree. The previous expression also accepted
// VERCEL_ENV === "production", which Railway never sets, so the live site silently fell through
// to the staging branch and served noindex + Disallow: /.
//
// Page metadata intentionally checks only the ENVIRONMENT, not the request host. Host-awareness
// here would require headers() inside metadata generation, which opts every page into dynamic
// rendering and would lose static generation across the whole site. The host dimension is
// enforced where it is cheap and authoritative instead: robots.txt (per request) plus the
// www -> apex 301. The Railway hostname therefore still renders pages, but is Disallow'd in
// robots.txt and canonicalises to the apex, so it cannot compete for indexing.
const isIndexable = SITE_INDEXING_ENABLED;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Amino Based | Research Peptides & Advanced Biotech",
  description: "Setting the gold standard in peptide synthesis with verified HPLC/MS testing for uncompromised results.",
  // Belt and braces alongside robots.ts: a robots.txt rule only asks a crawler not to fetch,
  // whereas this meta tag also keeps an already-known staging URL out of the index. Omitted
  // entirely in production, so nothing changes for the live site.
  ...(isIndexable ? {} : { robots: { index: false, follow: false } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body
        suppressHydrationWarning
        className={`${futuristicFont.variable} ${michromaFont.variable} ${openSansFont.variable} ${cormorantFont.variable} font-opensans antialiased bg-black text-white`}
      >
        <SitePreloader />
        <Analytics />
        <AdminOverflowFix />
        <SmoothScrollProvider>
          <SessionProvider>
            <HeaderVisibility>
              <AgeGate />
              <SiteHeader />
            </HeaderVisibility>
            {children}
            <HeaderVisibility>
              <CartDrawer />
            </HeaderVisibility>
          </SessionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
