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

// Indexing is opt-IN, and production is the only thing that opts in. Vercel sets VERCEL_ENV
// itself ("production" only for the production deployment), so the live .com keeps exactly the
// indexing behaviour it has today, while local dev and every preview/staging deployment are
// held back. SITE_INDEXABLE=true is the escape hatch for a non-Vercel production host —
// without it, a self-hosted launch would be silently noindexed.
const isIndexable =
  process.env.VERCEL_ENV === "production" || process.env.SITE_INDEXABLE === "true";

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
