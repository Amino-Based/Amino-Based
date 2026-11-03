import React from "react";
import Footer from "@/components/Footer";

export default function LegalPageLayout({
  eyebrow,
  title,
  intro,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] text-gray-200 overflow-hidden pt-40 pb-16 px-6 md:px-12 lg:px-24">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded uppercase">
            {eyebrow}
          </div>
          <h1 className="text-4xl md:text-6xl font-inter uppercase font-semibold tracking-wider text-white leading-[1.2] mb-6">
            {title}
          </h1>
          {intro && (
            <p className="font-inter text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed font-light mb-4">{intro}</p>
          )}
          {lastUpdated && <p className="text-xs uppercase tracking-widest text-gray-500">Last updated: {lastUpdated}</p>}
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24 text-gray-700">
        <div className="font-inter max-w-4xl mx-auto prose prose-lg prose-headings:font-inter prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-indigo-600 max-w-none space-y-10">
          {children}
        </div>
      </section>

      <Footer />
    </main>
  );
}
