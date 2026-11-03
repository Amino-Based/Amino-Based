"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".cta-content > *", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 lg:px-12 bg-white">
      <div ref={containerRef} className="max-w-7xl mx-auto w-full relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/placeholder-wide.svg" 
            alt="Call to Action Background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-[#0F0F11]/60 bg-gradient-to-r from-[#0F0F11]/80 to-[#0F0F11]/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 cta-content py-10 px-8 md:py-16 md:px-12 lg:py-20 lg:px-16 flex flex-col items-start text-left text-white max-w-2xl">
          <p className="font-inter text-sm font-bold tracking-widest text-[#A78BFA] uppercase mb-4">
            Accelerate Your Discoveries
          </p>
          <h2 className="text-4xl md:text-5xl font-inter font-bold leading-tight mb-6 uppercase tracking-wider">
            Start Your Next Research Project
          </h2>
          <p className="font-inter text-gray-300 leading-relaxed mb-10 text-lg">
            Browse the full catalogue of research peptides. We synthesise each one in the United States, test it to ≥99% purity through an independent laboratory, and ship it with the Certificate of Analysis for its batch. If you need a compound we do not list, ask us about custom synthesis.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors group"
            >
              Shop the Catalogue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact-us"
              className="flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors group"
            >
              Request Custom Synthesis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
