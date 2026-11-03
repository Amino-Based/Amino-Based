import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found | Amino Based",
  description: "The requested page or research protocol could not be located in the Amino Based archive.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F2F1ED] text-[#0F0F11] flex flex-col selection:bg-black selection:text-white">
      {/* Main Content Area matching exact reference architecture */}
      <main className="flex-1 relative flex flex-col items-center justify-center text-center px-6 pt-32 sm:pt-40 pb-24 sm:pb-32 overflow-hidden">
        
        {/* Subtle Architectural Grid Lines in Background */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 grid grid-cols-4 pointer-events-none">
          <div className="border-r border-black/[0.04] h-full" />
          <div className="border-r border-black/[0.04] h-full" />
          <div className="border-r border-black/[0.04] h-full" />
          <div className="h-full" />
        </div>

        {/* Massive 404 Watermark Behind the Content */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        >
          <span className="font-sans font-black text-[220px] sm:text-[340px] md:text-[460px] lg:text-[540px] tracking-tighter text-[#E6E5DF]/90 leading-none">
            404
          </span>
        </div>

        {/* Foreground Content Card / Typography */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-[68px] lg:text-[76px] font-normal tracking-tight text-[#0F0F11] leading-none mb-5 font-sans">
            Page Not Found
          </h1>

          <p className="text-xs sm:text-sm md:text-[15px] text-[#6B6B72] max-w-md leading-relaxed mb-8 sm:mb-10 mx-auto font-normal">
            The page you are looking for doesn't exist or has moved. Explore our catalog or return to the main archive.
          </p>

          {/* Action Buttons matching exact reference */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            {/* Primary Solid Black Pill Button */}
            <Link
              href="/contact-us"
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-[#0F0F11] hover:bg-[#27272A] text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 transition-all shadow-xs group cursor-pointer"
            >
              <span>Get in touch</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>

            {/* Outlined Pill Button with Fine Border */}
            <Link
              href="/"
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-transparent hover:bg-black/5 text-[#0F0F11] border border-black/85 text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-all cursor-pointer"
            >
              Go Home
            </Link>
          </div>
        </div>

      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
