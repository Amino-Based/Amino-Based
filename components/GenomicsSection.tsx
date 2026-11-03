"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GenomicsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

    tl.fromTo(textRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(subTextRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(topTextRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.8"
    )
    .fromTo(imageRef.current,
      { y: 150, opacity: 0, filter: "blur(20px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
      "-=1"
    )
    .fromTo(toggleRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" },
      "-=1"
    );



  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-[100svh] md:h-screen bg-white text-[#0F0F11] overflow-hidden flex flex-col font-sans">
      
      {/* Background Masked Blur Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-[#F3EFFE]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Right Image */}
      <div 
        className="absolute right-0 bottom-0 h-full w-full flex items-end justify-end pointer-events-none z-10"
      >
         <img 
           ref={imageRef}
           src="/placeholder-product.svg" 
           alt="Holding Vial" 
           className="h-[60%] sm:h-[70%] md:h-[90%] w-auto object-contain object-right-bottom translate-x-[2%]"
         />
         {/* Smooth bottom blur */}
         <div 
           className="absolute bottom-0 left-0 w-full h-[20%] z-10" 
           style={{ WebkitMaskImage: 'linear-gradient(to top, black, transparent)', maskImage: 'linear-gradient(to top, black, transparent)' }}
         ></div>
         {/* Vertical fading for bottom edge */}
         <div className="absolute bottom-0 left-0 w-full h-[15%] bg-gradient-to-t from-white via-white/80 to-transparent z-20"></div>
      </div>

      <div className="relative z-10 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto px-6 flex flex-col md:flex-row items-center justify-between h-full pt-16">
        
        {/* Top Center text */}
        <div ref={topTextRef} className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 max-w-sm hidden md:block text-sm text-[#0F0F11]/80 z-20 font-inter font-light leading-relaxed text-center">
           Rigorous third-party testing for<br/>
           absolute confidence.
        </div>

        {/* Left Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center h-full z-20 relative">
          <div ref={textRef}>
            <div className="inline-block px-3 py-1.5 mb-6 text-[10px] md:text-xs font-bold tracking-widest text-[#C9B8F9] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-md uppercase shadow-sm">
              Certificate of Analysis
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-inter font-light leading-[1.1] mb-8 tracking-tight text-[#0F0F11]">
              Transparency<br />
              in Every Batch.
            </h2>
          </div>
          
          <p ref={subTextRef} className="text-[#0F0F11]/70 max-w-xs text-sm font-inter font-light leading-relaxed mb-10">
            Every peptide is independently<br />
            verified to ≥99% purity<br />
            and identity.
          </p>

          <div ref={toggleRef} className="z-40">
            <Link
              href="/certificates"
              className="inline-block px-6 py-3 text-sm font-inter font-medium text-[#0F0F11] bg-[#F4F4F6] hover:bg-[#EDEDF1] border border-[#E6E6EA] rounded-md transition-all shadow-xl"
            >
              View COA
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
