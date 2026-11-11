"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FluidVialVisualProps {
  imageSrc: string;
  altText: string;
  videoSrc?: string;
  badge?: string;
  priority?: boolean;
}

export default function FluidVialVisual({
  imageSrc,
  altText,
  videoSrc,
  badge,
  priority = false,
}: FluidVialVisualProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile Safari requirement: set DOM properties explicitly
    video.muted = true;
    (video as any).defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    if (video.readyState >= 2) {
      setVideoLoaded(true);
    }

    const tryPlay = () => {
      video.play().then(() => {
        setVideoLoaded(true);
      }).catch(() => {});
    };

    tryPlay();
    video.addEventListener("loadedmetadata", tryPlay, { once: true });
    video.addEventListener("canplay", tryPlay, { once: true });

    // IntersectionObserver guarantees playback without the ScrollTrigger onLeaveBack pause bug
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[350px] rounded-[22px] overflow-hidden bg-[#0A0D12] flex items-center justify-center border border-black/10 select-none">
      
      {/* 1. Seamless High-Definition Video Layer (Amino Based Water Swirl) */}
      {videoSrc && !videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={imageSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* 2. Crisp Static Image (Always rendered as rock-solid instant fallback) */}
      <Image
        src={imageSrc}
        alt={altText}
        fill
        className="object-cover object-center"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 420px"
      />

      {/* 3. Laboratory Spec Badge Pill Overlay */}
      {badge && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/10 shadow-xs flex items-center gap-1.5 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-800">
            {badge}
          </span>
        </div>
      )}

    </div>
  );
}
