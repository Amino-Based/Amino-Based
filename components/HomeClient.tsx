"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  FlaskConical,
  Activity,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  Info,
  GraduationCap,
  Volume2,
  VolumeX,
  Search,
  Menu,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";
import ScrollMotion from "@/components/home/ScrollMotion";
import ScrambleText from "@/components/home/ScrambleText";
import CountUp from "@/components/home/CountUp";
import ScrollTextReveal from "@/components/home/ScrollTextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ShopMockProduct } from "@/lib/shopCardProduct";
import CategoriesSection, { type CategoryCardData } from "@/components/CategoriesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import BlogSection, { type BlogPostCardData } from "@/components/BlogSection";
import BestSellingProducts from "@/components/BestSellingProducts";
import MilitaryDiscountSection from "@/components/MilitaryDiscountSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/contact/ContactSection";
import FluidVialVisual from "@/components/home/FluidVialVisual";
import HangingSpraysVisual from "@/components/home/HangingSpraysVisual";
import InteractiveBrandChamber from "@/components/home/InteractiveBrandChamber";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Hero gutter rail. The ring marks the current entry; later entries are greyed. */
const HERO_SECTIONS = [
  { label: "Intro", href: "#sec1" },
  { label: "Expertise", href: "#sec3" },
  { label: "Technology", href: "#sec6" },
  { label: "Services", href: "#sec5" },
  { label: "Contacts", href: "#sec11" },
] as const;

/**
 * Nodes on the nested-ring diagram (00:03 - 00:05), each sitting on one ring's arc.
 *
 * The rings share no centre, so these are solved per ring rather than by one angle sweep:
 * innermost (59,31) r25, third (55,38) r34, second (51.5,44.5) r42.5, outer (50,50) r50 —
 * all in percentages of the square. Moving a ring means re-solving the dots that ride it.
 */
const ORBIT_NODES = [
  { label: "Sequence\nSpecification", left: "61%", top: "6%" },
  { label: "Solid-Phase\nSynthesis", left: "72%", top: "20%" },
  { label: "HPLC\nPurification", left: "31%", top: "20%" },
  { label: "Mass\nConfirmation", left: "66%", top: "41%" },
  { label: "Lyophilisation\nand Sealing", left: "4%", top: "56%" },
  { label: "COA and Lot Release", left: "30%", top: "78%" },
] as const;

interface HomeClientProps {
  products: ShopMockProduct[];
  categories: CategoryCardData[];
  posts: BlogPostCardData[];
}

export default function HomeClient({ products, categories, posts }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refresh ScrollTrigger after initial DOM layout settles
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => clearTimeout(refreshTimer);
  }, []);

  // Dynamic Hero Section Indicator (0-4)
  const [activeHeroSection, setActiveHeroSection] = useState(0);

  // Top header sound & menu state

  // Interactive Team Member Card
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  // Bento Accordion Item active
  const [activeBentoItem, setActiveBentoItem] = useState<number | null>(0);

  // Section 4 Bento Water Splash & Vial Drop State & Refs
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const splashContainerRef = useRef<HTMLDivElement>(null);
  const splashVideoRef = useRef<HTMLVideoElement>(null);
  const replayDropRef = useRef<() => void>(() => {});

  const handleReplayDrop = () => {
    replayDropRef.current();
  };

  const timelineSteps = [
    {
      title: "Solid-phase synthesis builds the peptide chain one amino acid at a time.",
      subtitle: "Step 01 - SPPS Assembly",
    },
    {
      title: "The finished chain is cleaved from the resin and precipitated for purification.",
      subtitle: "Step 02 - Cleavage and Workup",
    },
    {
      title: "Reverse-phase HPLC separates the target peptide from synthesis by-products.",
      subtitle: "Step 03 - HPLC Purification",
    },
    {
      title: "Mass spectrometry confirms molecular weight against the expected sequence.",
      subtitle: "Step 04 - Mass Confirmation",
    },
    {
      title: "The purified fraction is freeze-dried to a stable powder and sealed under vacuum.",
      subtitle: "Step 05 - Lyophilisation",
    },
    {
      title: "Each lot is assigned a number and released with its own Certificate of Analysis.",
      subtitle: "Step 06 - COA Release",
    },
  ];

  const stackedCards = [
    {
      title: "Solid-Phase Lyophilized Vials",
      category: "Vacuum Borosilicate",
      badge: "≥99% Lot-Tested",
      image: "/assets/amino-based-water-swirl-poster.webp",
      video: "/assets/amino-based-water-swirl-web.mp4",
      desc: "Vacuum-sealed under nitrogen atmosphere to eliminate oxidation and preserve 24+ month peptide integrity.",
      href: "/shop",
      btnText: "Explore Vials",
      iconType: "flask",
      isFluidAnimated: true,
    },
    {
      title: "Calibrated Metered Nasal Sprays",
      category: "Intranasal Aerosol",
      badge: "0.1ml Precision Mist",
      image: "/assets/format_sprays_suspended_lineup.jpg",
      desc: "Engineered intranasal delivery systems for mucosal neuropeptide and cognitive research sequences.",
      href: "/shop?category=nasal-sprays",
      btnText: "Explore Sprays",
      iconType: "activity",
      isFluidAnimated: false,
      isHangingAnimated: true,
    },
    {
      title: "Synergistic Multi-Peptide Blends",
      category: "Concentrate Matrix",
      badge: "GHK-Cu · BPC · TB · KPV",
      image: "/assets/format_blend_klow_stone.jpg",
      desc: "Multi-sequence research formulations combining complementary peptides into unified research concentrates.",
      href: "/shop",
      btnText: "Explore Blends",
      iconType: "sparkles",
      isFluidAnimated: false,
    },
  ];

  const deckRef = useRef<HTMLElement>(null);
  const scienceRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const heroArmRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const contactHeadingRef = useRef<HTMLHeadingElement>(null);
  const contactConRef = useRef<HTMLSpanElement>(null);
  const contactTacRef = useRef<HTMLSpanElement>(null);
  const contactTusRef = useRef<HTMLSpanElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLElement>(null);
  const labBannerRef = useRef<HTMLDivElement>(null);
  const labCardRef = useRef<HTMLDivElement>(null);
  const labTextRef = useRef<HTMLDivElement>(null);
  const labPurityRef = useRef<HTMLSpanElement>(null);
  const advantagesRef = useRef<HTMLElement>(null);
  const webinarsRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  const [activeDeckIndex, setActiveDeckIndex] = useState(0);

  const handleDeckCardSelect = (targetIndex: number) => {
    setActiveDeckIndex(targetIndex);
    const section = deckRef.current;
    if (!section) return;
    const cards = gsap.utils.toArray<HTMLElement>(".deck-card", section);
    if (!cards.length) return;

    cards.forEach((card, idx) => {
      if (idx < targetIndex) {
        gsap.to(card, { yPercent: -130, opacity: 0, pointerEvents: "none", duration: 0.45, ease: "power2.inOut" });
      } else if (idx === targetIndex) {
        gsap.to(card, { zIndex: 30, yPercent: 0, scale: 1.0, rotate: 0, opacity: 1, pointerEvents: "auto", duration: 0.45, ease: "power2.out" });
      } else if (idx === targetIndex + 1) {
        gsap.to(card, { zIndex: 20, yPercent: 0, scale: 0.96, rotate: 5, opacity: 1, pointerEvents: "none", duration: 0.45, ease: "power2.out" });
      } else {
        gsap.to(card, { zIndex: 10, yPercent: 0, scale: 0.92, rotate: -4, opacity: 1, pointerEvents: "none", duration: 0.45, ease: "power2.out" });
      }
    });
  };

  /**
   * Scroll drivers for interactive sections.
   * Gated cleanly by screen width so desktop gets cinematic pinned scrub
   * and mobile gets frictionless responsive transitions without lockup.
   */
  const DESKTOP_MOTION = "(min-width: 768px)";
  const MOBILE_MOTION = "(max-width: 767px)";

  // --- Service cards: travel bottom-to-top through the marquee, tilting as they rise. ---
  useGSAP(
    () => {
      const section = deckRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".deck-card", section);
        if (cards.length === 0) return;

        // Authentic 3D Stacked Deck setup matching video 06.40s - 07.20s:
        // Card 0 (front): z-index 30, rotation -1deg, scale 1.0
        // Card 1 (middle): z-index 20, rotation +7deg (peeking right), scale 0.96
        // Card 2 (back): z-index 10, rotation -5deg (peeking left), scale 0.92
        gsap.set(cards[0], { zIndex: 30, yPercent: 0, rotate: -1, scale: 1.0, opacity: 1 });
        if (cards[1]) {
          gsap.set(cards[1], { zIndex: 20, yPercent: 0, rotate: 7, scale: 0.96, opacity: 1 });
        }
        if (cards[2]) {
          gsap.set(cards[2], { zIndex: 10, yPercent: 0, rotate: -5, scale: 0.92, opacity: 1 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + cards.length * 520,
            refreshPriority: 3,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
          },
        });

        // Step 1: Card 0 peels away UPWARDS; Card 1 straightens up to foreground; Card 2 shifts
        tl.to(
          cards[0],
          { yPercent: -140, rotate: -2, opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 1 },
          0
        );
        if (cards[1]) {
          tl.to(
            cards[1],
            { rotate: -1, scale: 1.0, ease: "power2.out", duration: 0.8 },
            0.2
          );
        }
        if (cards[2]) {
          tl.to(
            cards[2],
            { rotate: 5, scale: 0.96, ease: "power2.out", duration: 0.8 },
            0.2
          );
        }

        // Step 2: Card 1 peels away UPWARDS; Card 2 straightens up to foreground
        if (cards[1]) {
          tl.to(
            cards[1],
            { yPercent: -140, rotate: -2, opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 1 },
            1.2
          );
        }
        if (cards[2]) {
          tl.to(
            cards[2],
            { rotate: 0, scale: 1.0, ease: "power2.out", duration: 0.8 },
            1.4
          );
          // Step 3: Card 2 peels away UPWARDS
          tl.to(
            cards[2],
            { yPercent: -140, rotate: -2, opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 1 },
            2.4
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(cards, { clearProps: "all" });
        };
      });

      mm.add(MOBILE_MOTION, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".deck-card", section);
        if (cards.length === 0) return;

        gsap.set(cards[0], { zIndex: 30, yPercent: 0, rotate: -1, scale: 1.0, opacity: 1 });
        if (cards[1]) gsap.set(cards[1], { zIndex: 20, yPercent: 0, rotate: 5, scale: 0.96, opacity: 1 });
        if (cards[2]) gsap.set(cards[2], { zIndex: 10, yPercent: 0, rotate: -4, scale: 0.92, opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + cards.length * 360,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.3,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
              setActiveDeckIndex(nextIndex);
            },
          },
        });

        tl.to(cards[0], { yPercent: -130, opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 1 }, 0);
        if (cards[1]) tl.to(cards[1], { rotate: 0, scale: 1.0, ease: "power2.out", duration: 0.8 }, 0.2);
        if (cards[2]) tl.to(cards[2], { rotate: 4, scale: 0.96, ease: "power2.out", duration: 0.8 }, 0.2);

        if (cards[1]) {
          tl.to(cards[1], { yPercent: -130, opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 1 }, 1.2);
        }
        if (cards[2]) {
          tl.to(cards[2], { rotate: 0, scale: 1.0, ease: "power2.out", duration: 0.8 }, 1.4);
          tl.to(cards[2], { yPercent: -130, opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 1 }, 2.4);
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(cards, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: deckRef }
  );

  // --- Science timeline: the active node walks the rail as the pinned section scrubs. ---
  useGSAP(
    () => {
      const section = scienceRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      const count = timelineSteps.length;

      const dots = section.querySelectorAll<HTMLElement>(".timeline-dot");
      const descs = section.querySelectorAll<HTMLElement>(".timeline-desc");
      const stepEls = section.querySelectorAll<HTMLElement>(".timeline-step");

      const updateStep = (idx: number) => {
        dots.forEach((dot, i) => {
          if (i === idx) {
            dot.className = "timeline-dot w-4 h-4 rounded-full transition-all duration-300 bg-purple-600 ring-8 ring-purple-100 scale-125";
          } else {
            dot.className = "timeline-dot w-4 h-4 rounded-full transition-all duration-300 bg-gray-300 group-hover:bg-gray-500";
          }
        });
        descs.forEach((desc, i) => {
          if (i === idx) {
            desc.className = "timeline-desc text-xs sm:text-sm leading-relaxed transition-colors duration-300 text-[#0F0F11] font-semibold";
          } else {
            desc.className = "timeline-desc text-xs sm:text-sm leading-relaxed transition-colors duration-300 text-[#71717A] font-normal group-hover:text-[#0F0F11]";
          }
        });
      };

      // Universal tap/click handler for all screen sizes
      stepEls.forEach((el, i) => {
        el.onclick = () => updateStep(i);
      });

      // Desktop: Pinned scrub animation
      mm.add(DESKTOP_MOTION, () => {
        let lastStep = -1;
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + count * 340,
          refreshPriority: 2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(count - 1, Math.floor(self.progress * count));
            if (next !== lastStep) {
              lastStep = next;
              updateStep(next);
            }
          },
        });

        return () => trigger.kill();
      });

      // Mobile: Scroll-driven step activation as each step passes center screen
      mm.add("(max-width: 767px)", () => {
        const triggers: ScrollTrigger[] = [];
        stepEls.forEach((el, i) => {
          const st = ScrollTrigger.create({
            trigger: el,
            start: "top center+=80",
            end: "bottom center-=80",
            onEnter: () => updateStep(i),
            onEnterBack: () => updateStep(i),
          });
          triggers.push(st);
        });
        return () => {
          triggers.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: scienceRef }
  );

  /*
    --- Hero arm: reaches in holding the vial, then withdraws the way it came. ---

    The arm enters frame from the upper right, so both the entrance and the exit travel that
    axis: it drops down-and-left into place on load, and on scroll it retreats up-and-right,
    carrying the vial out of shot. Entrance and exit are separate — the first is time-based
    and plays once, the second is scrubbed so the retreat tracks the wheel exactly.
  */
  useGSAP(
    () => {
      const arm = heroArmRef.current;
      if (!arm) return;

      const mm = gsap.matchMedia();

      mm.add("all", () => {
        // When loaded, the robotic claw is securely holding the peptide.
        // As the user scrolls, the claw retracts up & to the right along the arm's axis.
        const exit = gsap.fromTo(
          arm,
          { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1 },
          {
            xPercent: 36,
            yPercent: -56,
            rotate: 6,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: arm.closest("section") ?? arm,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        return () => {
          exit.scrollTrigger?.kill();
          exit.kill();
          gsap.set(arm, {
            clearProps: "opacity,transform,transformOrigin,scale,translate,rotate",
          });
        };
      });

      return () => mm.revert();
    },
    { scope: heroArmRef }
  );

  /*
    --- Orbit: rings grow and nodes arrive one by one, scrubbed against scroll. ---

    This replaces a one-shot whileInView fade, which had two faults: it completed inside
    about 400px and then never moved again, and the first node fired while the section was
    still below the fold, so it was always already present.

    The start state is applied here rather than in the markup. If this never runs — no JS,
    reduced motion, a thrown error — the diagram stays fully drawn instead of invisible.
  */
  useGSAP(
    () => {
      const orbit = orbitRef.current;
      if (!orbit) return;

      const mm = gsap.matchMedia();

      mm.add("all", () => {
        const rings = gsap.utils.toArray<HTMLElement>(".orbit-ring", orbit);
        const nodes = gsap.utils.toArray<HTMLElement>(".orbit-node", orbit);
        if (!rings.length && !nodes.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: orbit,
            // A fixed scroll distance rather than a viewport-relative end: it keeps the
            // build spread over ~750px on every screen height, so the dots arrive one at a
            // time as you travel the section instead of all landing in the first few px.
            start: "top 78%",
            end: "+=750",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        /*
          The hidden state is applied up front with set(), NOT via fromTo().

          In a scrubbed timeline parked at progress 0, a staggered fromTo only renders its
          "from" values for the tween that has already begun; targets whose turn has not
          come keep their natural state. That left five of the six dots fully visible until
          the playhead reached them, so they appeared immediately and then popped.
        */
        gsap.set(rings, { scale: 0.72, opacity: 0, transformOrigin: "60% 30%" });
        gsap.set(nodes, { opacity: 0, scale: 0.55, transformOrigin: "0% 50%" });

        // Rings open outward from the innermost disc.
        tl.to(
          [...rings].reverse(),
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.18, ease: "power2.out" },
          0
        );

        // Then the dots land in reading order, each one overlapping the last.
        tl.to(
          nodes,
          { opacity: 1, scale: 1, duration: 0.42, stagger: 0.26, ease: "back.out(2)" },
          0.35
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          /*
            Clear ONLY what this timeline wrote. clearProps:"all" empties the whole inline
            style attribute, which also takes the left/top React set for each node's position
            — React will not re-apply them because its props never changed, so under
            StrictMode's mount/cleanup/mount the dots all collapse onto the origin.
          */
          gsap.set([...rings, ...nodes], {
            clearProps: "opacity,transform,transformOrigin,scale,translate,rotate",
          });
        };
      });

      return () => mm.revert();
    },
    { scope: orbitRef }
  );



  /*
    --- Section 7: Why Researchers Choose Us entrance reveal (00:14 - 00:16) ---
    Matches the reference video choreography:
    - "Our Advantages" headline enters with blur-to-clear fade.
    - 3 cards rise into view with staggered upward glide (y: 80 -> 0, opacity: 0 -> 1).
  */
  useGSAP(
    () => {
      const section = advantagesRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const title = section.querySelector(".advantages-title");
        const cards = gsap.utils.toArray<HTMLElement>(".advantage-card", section);

        if (title) {
          gsap.fromTo(
            title,
            { filter: "blur(8px)", opacity: 0, y: 20 },
            {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 92%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 92%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: advantagesRef }
  );

  /*
    --- Section 8: Laboratory device banner + Chromatogram HUD Card (00:16 - 00:19) ---
    Matches the exact video scroll choreography:
    - As the user scrolls into the section, the background laboratory banner slides in from right to left into position.
    - As scrolling continues, the small Chromatogram HUD card slides up above that banner into the right column.
    - Purity counter dynamically counts from 95.2% up to 99.8% scrubbed against scroll.
    - Fully bidirectional: smoothly reverses when scrolling upward.
  */
  useGSAP(
    () => {
      const section = labRef.current;
      const banner = labBannerRef.current;
      const card = labCardRef.current;
      const text = labTextRef.current;
      if (!section || !banner || !card) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        // Dynamically compute the horizontal distance so the card starts at the extreme left side,
        // placed directly over the Certificate of Analysis card
        const computeStartX = () => {
          if (!text || !card) return -720;
          const textInner = text.querySelector(".max-w-lg") || text;
          const currentCardX = (gsap.getProperty(card, "x") as number) || 0;
          const currentTextX = (gsap.getProperty(text, "x") as number) || 0;
          const naturalCardLeft = card.getBoundingClientRect().left - currentCardX;
          const naturalTextLeft = textInner.getBoundingClientRect().left - currentTextX;
          const diff = naturalTextLeft - naturalCardLeft;
          return diff < -200 ? diff : -720;
        };

        // Initial state:
        // 1. Banner starts shifted to the right-bottom corner, sliding diagonally up into place as user scrolls
        gsap.set(banner, { x: 140, y: 120, opacity: 0.85, willChange: "transform, opacity" });
        // 2. Headline on the left starts slightly below
        if (text) gsap.set(text, { y: 40, opacity: 0.9, willChange: "transform, opacity" });
        // 3. Small chromatogram card starts at the extreme left side, right over the Certificate of Analysis text
        gsap.set(card, {
          x: computeStartX(),
          y: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=750",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
          },
        });

        // Stage 1: Laboratory banner slides dynamically from the right-bottom corner up to its rest position
        tl.to(
          banner,
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          0
        );

        // Stage 1b: Left headline rises into place alongside the banner
        if (text) {
          tl.to(
            text,
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              ease: "power2.out",
            },
            0.05
          );
        }

        // Stage 2: Small HUD card slides across the banner all the way from the extreme left side to the right side
        tl.fromTo(
          card,
          {
            x: () => computeStartX(),
            y: 0,
            scale: 1,
            opacity: 1,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power2.inOut",
          },
          0.1
        );

        // Stage 2: Purity counter dynamically counts up scrubbed to scroll
        const countObj = { val: 95.5 };
        tl.to(
          countObj,
          {
            val: 99.8,
            duration: 0.65,
            ease: "none",
            onUpdate: () => {
              if (labPurityRef.current) {
                labPurityRef.current.textContent = countObj.val.toFixed(1);
              }
            },
          },
          0.05
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([banner, card, text].filter(Boolean), { clearProps: "all" });
        };
      });

      mm.add(MOBILE_MOTION, () => {
        gsap.set(banner, { x: 40, y: 50, opacity: 0.9 });
        gsap.set(card, { y: 60, scale: 0.95, opacity: 0 });
        if (text) gsap.set(text, { y: 25, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "bottom 35%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(banner, { x: 0, y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
        if (text) {
          tl.to(text, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0.05);
        }
        tl.to(card, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.3);

        const countObj = { val: 95.5 };
        tl.to(
          countObj,
          {
            val: 99.8,
            duration: 0.4,
            ease: "none",
            onUpdate: () => {
              if (labPurityRef.current) {
                labPurityRef.current.textContent = countObj.val.toFixed(1);
              }
            },
          },
          0.35
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([banner, card, text].filter(Boolean), { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: labRef }
  );

  // --- Section 4 Bento: Water Splash & Vial Plunge Video (Auto-Playing on Mobile & Viewport) ---
  useEffect(() => {
    const video = splashVideoRef.current;
    const container = splashContainerRef.current;
    if (!video) return;

    // Mobile WebKit requirement: explicit DOM properties for autoplay
    video.muted = true;
    (video as any).defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playVideo = () => {
      video.play().catch(() => {});
    };

    playVideo();
    video.addEventListener("loadedmetadata", playVideo, { once: true });
    video.addEventListener("canplay", playVideo, { once: true });

    replayDropRef.current = () => {
      video.currentTime = 0;
      playVideo();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (container) observer.observe(container);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", playVideo);
      video.removeEventListener("canplay", playVideo);
    };
  }, []);



  // Section 11 Contact Us animation is handled independently by Framer Motion in <ContactSection />
  const teamMembers = [
    {
      name: "Juliet Walker",
      role: "Research Director",
      bio: "Directs solid-phase peptide synthesis (SPPS) protocols, sequence fidelity assurance, and mass spectrometry validation.",
      avatar: "/assets/team_juliet.jpg",
    },
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Scientific Officer",
      bio: "Oversees analytical chromatography, purity verification protocols, and custom synthesis research programs.",
      avatar: "/assets/team_sarah.jpg",
    },
    {
      name: "Laura Anderson",
      role: "Research Support Lead",
      bio: "Leads client support, research protocol documentation, and coordinates Certificate of Analysis issuance.",
      avatar: "/assets/team_laura.jpg",
    },
    {
      name: "Dr. Emily Davis",
      role: "Lead Analytical Chemist",
      bio: "Specializes in high-performance liquid chromatography (HPLC) peak deconvolution and electrospray ionization mass spec.",
      avatar: "/assets/team_emily.jpg",
    },
  ];

  // --- Section 9: Educational Webinars - entrance reveal animation ---
  useGSAP(
    () => {
      const section = webinarsRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const title = section.querySelector("h2");
        const cards = gsap.utils.toArray<HTMLElement>(".webinar-card", section);

        if (title) {
          gsap.fromTo(
            title,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.14,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: webinarsRef }
  );

  // --- Section 10: Our Team - entrance reveal animation ---
  useGSAP(
    () => {
      const section = teamRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const title = section.querySelector("h2");
        const cards = gsap.utils.toArray<HTMLElement>(".team-card", section);

        if (title) {
          gsap.fromTo(
            title,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: teamRef }
  );

  const FAQ_ITEMS = [
    {
      question: "What is the purity standard of your research peptides?",
      answer:
        "Every batch is verified by independent third-party laboratories using reverse-phase HPLC and mass spectrometry to a minimum of 99% purity. Full, unedited chromatograms and mass spectral reports ship with each order and are archived in our public lot library.",
    },
    {
      question: "How do I verify the Certificate of Analysis (COA) for my lot?",
      answer:
        "Locate the batch number printed on your vial label or packing documentation, then enter it into our online COA directory. You will immediately access the unedited analytical HPLC chromatogram, mass confirmation, and purity signoff for that exact lot.",
    },
    {
      question: "Where are your peptides synthesized and tested?",
      answer:
        "All research compounds are synthesized in state-of-the-art United States laboratories using automated solid-phase peptide synthesis (SPPS). Purification, lyophilization, and release testing all run under strict US process controls with full batch traceability.",
    },
    {
      question: "How are research peptides packaged and shipped?",
      answer:
        "Peptides ship as vacuum-sealed, lyophilized powder in sterile glass vials. Orders are packed in thermal-insulated containers with cooling elements and dispatched via expedited courier within 24 hours to preserve biochemical integrity.",
    },
    {
      question: "Are these compounds approved for human consumption?",
      answer:
        "No. Amino Based compounds are manufactured strictly for laboratory, in-vitro, and chemical analytical research by qualified scientific professionals. They are never intended for human, clinical, or therapeutic applications.",
    },
  ];

  return (
    <main ref={containerRef} className="relative w-full bg-[#FAFAFC] font-inter p-0 text-[#0F0F11]">
      <ScrollMotion containerRef={containerRef} />

      <div className="relative w-full overflow-hidden bg-[#FAFAFC]">

        {/* ========================================================================= */}
        {/* SECTION 1: HERO WITH ROTATING 3D IRIDESCENT DNA HELIX (00:00 - 00:02)     */}
        {/* ========================================================================= */}
        <section id="sec1" className="relative min-h-[92vh] flex flex-col justify-between pt-28 sm:pt-36 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#F5F5F8] to-[#FAFAFC]">
          
          {/* Subtle Ambient Mesh Backing */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-12 left-1/3 w-[450px] h-[450px] bg-indigo-100/50 rounded-full blur-[130px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
            {/*
              Section rail, in the left gutter clear of the headline. It marks reading
              progress: entries above the ring are set in near-black, those below in grey.
            */}
            <nav
              aria-label="Page sections"
              className="hidden lg:flex absolute -left-12 xl:-left-14 top-1/2 -translate-y-1/2 z-20 items-stretch gap-3.5 select-none"
            >
              <span aria-hidden="true" className="w-px bg-[#D4D4D8] my-2" />
              <ul className="flex flex-col gap-5 text-[12px] leading-none">
                {HERO_SECTIONS.map((item, i) => {
                  const active = i === activeHeroSection;
                  return (
                    <li key={item.label} className="relative">
                      {active && (
                        <motion.span
                          layoutId="heroRailRing"
                          aria-hidden="true"
                          className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full border border-[#0F0F11]"
                        />
                      )}
                      <a
                        href={item.href}
                        onClick={() => setActiveHeroSection(i)}
                        className={`transition-colors hover:text-[#0F0F11] ${
                          i <= activeHeroSection ? "text-[#0F0F11]" : "text-[#C4C4CC]"
                        } ${active ? "font-semibold" : "font-normal"}`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Left Content */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start lg:pl-20 xl:pl-24">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#71717A] mb-5">
                USA-SYNTHESISED RESEARCH PEPTIDES
              </span>

              <h1 className="mb-6 font-serif">
                <span className="block text-[36px] sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-[#0F0F11] leading-[1.08]">
                  Research peptides,
                </span>
                <span className="block text-[36px] sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-[#0F0F11] leading-[1.08]">
                  verified lot by lot
                </span>
              </h1>

              <p className="text-[#71717A] text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                Amino Based supplies research-grade peptides to laboratories in the United States. Every lot is tested by reverse-phase HPLC for purity and by mass spectrometry for identity, and ships with a Certificate of Analysis matched to the lot number on your vial.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/products"
                  className="px-8 py-3.5 rounded-full bg-[#0F0F11] text-white hover:bg-[#27272A] transition-all text-xs font-semibold uppercase tracking-widest flex items-center gap-2 group shadow-sm"
                >
                  EXPLORE PEPTIDES
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact-us"
                  className="px-8 py-3.5 rounded-full border border-[#0F0F11] text-[#0F0F11] hover:bg-[#0F0F11] hover:text-white transition-all text-xs font-semibold uppercase tracking-widest flex items-center gap-2 group shadow-sm"
                >
                  MAKE AN APPOINTMENT
                </Link>
              </div>

              {/* Bottom Floating Product Cards (Matching Reference Layout) */}
              <div className="hidden sm:flex flex-wrap items-center gap-4 pt-1">
                {/* Product Card 1: BPC-157 */}
                <Link
                  href="/products"
                  className="group flex items-center gap-3.5 bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-2.5 pr-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5"
                >
                  <div className="w-12 h-14 relative bg-[#F4F4F6] rounded-xl overflow-hidden flex items-center justify-center p-1 shrink-0">
                    <Image
                      src="/assets/pill_thumb_bpc.webp"
                      alt="BPC-157 5mg Research Vial"
                      fill
                      className="object-contain p-0.5 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#0F0F11] tracking-tight">
                      BPC-157 5mg
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#0F0F11]">$54.00</span>
                      <span className="text-[10px] text-[#71717A] font-medium">-20%</span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#0F0F11] text-white flex items-center justify-center ml-2 group-hover:bg-[#27272A] transition-colors shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* Product Card 2: Semaglutide */}
                <Link
                  href="/products"
                  className="group flex items-center gap-3.5 bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-2.5 pr-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5"
                >
                  <div className="w-12 h-14 relative bg-[#F4F4F6] rounded-xl overflow-hidden flex items-center justify-center p-1 shrink-0">
                    <Image
                      src="/assets/pill_thumb_glp1.webp"
                      alt="Semaglutide 5mg Research Vial"
                      fill
                      className="object-contain p-0.5 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#0F0F11] tracking-tight">
                      Semaglutide 5mg
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#0F0F11]">$68.00</span>
                      <span className="text-[10px] text-[#71717A] font-medium">-25%</span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#0F0F11] text-white flex items-center justify-center ml-2 group-hover:bg-[#27272A] transition-colors shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Interactive 3D Orbiting Fluid Vortex with Center Product Bottle */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[560px] xl:max-w-[620px] aspect-square flex items-center justify-center select-none">
                
                {/* 1. Subtle Ambient Radial Backlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 via-slate-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

                {/* 2. Rotating 3D Aqueous Fluid Splash Ribbon & Crystalline Butterflies Layer */}
                {/* Rotates continuously and smoothly in 3D around the product at an elegant, slow pace */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none will-change-transform"
                >
                  <Image
                    src="/assets/amino_hero_fluid_swirl.webp"
                    alt="Dynamic 3D Rotating Fluid Liquid Ribbon and Translucent Crystalline Butterflies"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 620px"
                    className="object-contain w-full h-full drop-shadow-[0_20px_35px_rgba(15,15,17,0.04)] select-none pointer-events-none"
                  />
                </motion.div>

                {/* 3. Center Luxury Product Bottle with Authentic Amino Based Branding */}
                {/* Floats gently inside rotating fluid at exact original full scale */}
                <motion.div
                  animate={{ y: [-7, 7, -7] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full h-[88%] flex items-center justify-center pointer-events-none select-none"
                >
                  <Image
                    src="/assets/amino_hero_bottle_tight.webp"
                    alt="Amino Based 5-AMINO-1MQ 50mg Luxury Research Bottle"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                    className="object-contain w-full h-full drop-shadow-[0_25px_40px_rgba(15,15,17,0.12)] select-none pointer-events-none"
                  />
                </motion.div>

                {/* 4. Vertical Scroll Down Pill Indicator (Bottom Right of Product) */}
                <div className="absolute -bottom-2 right-2 sm:right-6 hidden sm:flex items-center gap-3 select-none pointer-events-auto z-20">
                  <button
                    onClick={() => {
                      const el = document.querySelector("#sec2");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-2.5 text-[#71717A] hover:text-[#0F0F11] transition-colors cursor-pointer group"
                    aria-label="Scroll Down"
                  >
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">
                      Scroll Down
                    </span>
                    <div className="w-5 h-9 rounded-full border border-[#0F0F11]/30 flex items-start justify-center p-1 group-hover:border-[#0F0F11] transition-colors">
                      <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-2 rounded-full bg-[#0F0F11]"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Far Right Vertical Rail */}
          <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 items-center select-none pointer-events-auto">
            <span className="text-[11px] font-medium tracking-[0.25em] text-[#A1A1AA] hover:text-[#0F0F11] transition-colors uppercase [writing-mode:vertical-rl] rotate-180">
              Amino Based
            </span>
          </div>

          {/* Bottom Floating Frosted Glass Card '01' (overlapping the rotating DNA helix behind it) */}
          <div className="relative z-20 mt-4 mb-8 w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-6">
              <span className="text-4xl md:text-5xl font-light text-[#0F0F11] tracking-tighter">01</span>
              <div>
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1">
                  2022-08-30
                </span>
                <h3 className="text-lg md:text-xl font-serif font-normal text-[#0F0F11]">
                  What a Certificate of Analysis actually proves
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#71717A] max-w-xl leading-relaxed">
              Amino Based is a United States research peptide supplier. Every compound is produced by solid-phase synthesis, purified by reverse-phase HPLC and confirmed by mass spectrometry, then released with a lot-specific Certificate of Analysis. Sold for laboratory research use only.
            </p>

            <Link
              href="/about-us"
              className="px-6 py-2.5 rounded-full bg-[#0F0F11] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors shrink-0 flex items-center gap-2"
            >
              Learn more
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: CONTINUOUS HORIZONTAL MARQUEE TICKER (00:02 - 00:03)           */}
        {/* ========================================================================= */}
        <section id="sec2" data-motion-owner="true" className="relative w-full py-10 md:py-14 bg-white border-y border-[#E4E4E7] overflow-hidden select-none">
          <div className="animate-marquee flex items-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-8 mx-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.01em] uppercase text-[#0F0F11] shrink-0"
              >
                <span>ANALYTICAL PRECISION</span>
                <span className="text-purple-500 font-bold">⊕</span>
                <span className="text-gray-300">/</span>
                <span className="text-[#0F0F11] font-normal">SEQUENCE FIDELITY</span>
                <span className="text-purple-500 font-bold">⊕</span>
                <span className="text-gray-300">/</span>
                <span>PEPTIDE SYNTHESIS</span>
                <span className="text-purple-500 font-bold">⊕</span>
                <span className="text-gray-300">/</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-medium">
                  PURITY ≥99%
                </span>
                <span className="text-purple-500 font-bold">⊕</span>
                <span className="text-gray-300">/</span>
                <span>HPLC VERIFIED</span>
                <span className="text-purple-500 font-bold">⊕</span>
                <span className="text-gray-300">/</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BEST SELLING / FEATURED RESEARCH PRODUCTS (EXACT REFERENCE DESIGN)        */}
        {/* ========================================================================= */}
        <BestSellingProducts products={products} />

        {/* ========================================================================= */}
        {/* SECTION 3: STATS & PLANETARY CONCENTRIC CIRCLES (00:03 - 00:05)            */}
        {/* ========================================================================= */}
        <section id="sec3" data-motion-owner="true" className="stats-section py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Mission & 4-Stat Grid with Underlines */}
            <div className="lg:col-span-6 flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#71717A] mb-4">
                ANALYTICAL STANDARDS
              </span>
              <div className="mb-12">
                <ScrollTextReveal
                  text="Every lot we ship is tested twice before release — by HPLC for purity and by mass spectrometry for molecular identity."
                  highlightWords={["and", "by", "mass", "spectrometry", "for", "molecular", "identity."]}
                  highlightColor="#A1A1AA"
                  className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal leading-snug tracking-tight text-[#0F0F11]"
                  start="top 80%"
                  end="top 35%"
                />
              </div>

              <div className="grid grid-cols-2 gap-8 md:gap-12">
                {/* Figures count up while the captions resolve, exactly as in reference video 00:04 */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="text-4xl sm:text-5xl font-light tracking-tight text-[#0F0F11] mb-2">
                    <CountUp value={15} />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#71717A] font-medium">
                    Years in peptide synthesis
                  </div>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <div className="text-4xl sm:text-5xl font-light tracking-tight text-[#0F0F11] mb-2">
                    <CountUp value={50} suffix="+" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#71717A] font-medium">
                    Catalogue compounds
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-4xl sm:text-5xl font-light tracking-tight text-[#7C3AED] mb-2">
                    <CountUp value={99} suffix="%" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#71717A] font-medium">
                    Minimum verified purity
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-4xl sm:text-5xl font-light tracking-tight text-[#0F0F11] mb-2">
                    <CountUp value={100} suffix="%" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#71717A] font-medium">
                    Lots shipped with a COA
                  </div>
                </div>
              </div>
            </div>

            {/* Right: the concentric diagnostic map from 00:04 */}
            <div className="lg:col-span-6 flex flex-col items-start lg:items-end">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA] mb-8">
                Analytical standards
              </span>

              {/*
                The rings are nested but NOT concentric: each sits lower-left of the last,
                so they read as a nautilus rather than a target. That asymmetry is the whole
                character of the diagram, so the offsets are hand-placed rather than derived.
              */}
              <div
                ref={orbitRef}
                data-motion-owner="orbit"
                className="relative w-full max-w-[460px] aspect-square mx-auto lg:mx-0"
              >
                {/*
                  Rings grow and nodes arrive in sequence, both scrubbed against scroll
                  position rather than fired once on entry — at 00:03.5 three dots are up,
                  five by 00:04.0, six by 00:04.5, and scrolling back takes them away again.
                  The hidden start state is set in JS, so with no JS the diagram renders whole.
                */}
                {/* Slow subtle gyroscopic rotation dashed ring (from video 00:04) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-full border border-dashed border-[#D4D4D8]/70 pointer-events-none"
                />

                <div className="orbit-ring absolute left-0 top-0 w-full h-full rounded-full border border-[#DEDEE4]" />
                <div className="orbit-ring absolute left-[9%] top-[2%] w-[85%] h-[85%] rounded-full border border-[#E4E4EA] bg-[#F2F2F5]/80" />
                <div className="orbit-ring absolute left-[21%] top-[4%] w-[68%] h-[68%] rounded-full border border-[#EAEAF0] bg-[#F9F9FB]" />
                <div className="orbit-ring absolute left-[34%] top-[6%] w-[50%] h-[50%] rounded-full bg-white" />

                {/* A slow drift keeps the diagram alive without turning anything that holds text. */}
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-[44%] top-[9%] w-[32%] h-[32%] rounded-full bg-[radial-gradient(circle_at_34%_30%,#F3EFFE_0%,#FAF8FE_60%,#FFFFFF_100%)]"
                />

                {ORBIT_NODES.map((node) => (
                  <div
                    key={node.label}
                    style={{ left: node.left, top: node.top }}
                    className="orbit-node absolute flex items-start gap-2 max-w-[150px]"
                  >
                    <span className="orbit-dot mt-[4px] w-[7px] h-[7px] shrink-0 rounded-full bg-[#8B7BE8]" />
                    <span className="whitespace-pre-line text-[11px] leading-[1.4] text-[#3F3F46]">
                      {node.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: BENTO 3D CELLULAR & RECEPTOR CARDS (00:05 - 00:07)              */}
        {/* ========================================================================= */}
        {/* SECTION 4: BENTO 3D CELLULAR & RECEPTOR CARDS (00:05 - 00:07)              */}
        {/* ========================================================================= */}
        <section id="sec4" data-motion-owner="true" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#FAFAFC] border-y border-[#E4E4E7] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left Column: Amino Based Semaglutide Vial Water Splash Plunge */}
              <div
                ref={splashContainerRef}
                className="lg:col-span-5 rounded-[28px] shadow-sm relative overflow-hidden min-h-[520px] lg:min-h-[580px] border border-sky-300/30 p-6 flex flex-col justify-between group bg-[#4a98be]"
              >
                {/* 1. Crisp 1080p 60FPS Hardware-Accelerated Video Surface */}
                <video
                  ref={splashVideoRef}
                  src="/assets/vial-water-drop.mp4"
                  poster="/assets/vial-water-drop-poster.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Action Bar: Info Toggle & Controls */}
                <div className="flex items-center justify-between z-10 w-full">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 bg-[#021323]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-400/30 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-wider text-cyan-200 uppercase font-mono">
                      Aqueous Drop • HPLC Pure
                    </span>
                  </div>

                  {/* Top Right Floating Action Pills */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Hydro-Stability Info"
                      onClick={() => setInfoModalOpen(!infoModalOpen)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#0F0F11] text-xs shadow-xs hover:bg-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Replay Vial Drop Animation"
                      onClick={handleReplayDrop}
                      title="Replay Animation"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#0F0F11] text-xs shadow-xs hover:bg-white transition-all cursor-pointer hover:scale-105 active:scale-95 relative"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#0F0F11] translate-x-0.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Expand Simulation Visual"
                      onClick={() => setVideoModalOpen(true)}
                      className="px-2.5 h-8 rounded-full bg-white/90 backdrop-blur-md border border-white/70 flex items-center gap-1.5 text-[#0F0F11] text-[11px] font-medium shadow-xs hover:bg-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      <span className="hidden sm:inline">Watch HD</span>
                    </button>
                  </div>
                </div>

                {/* Slide-down Scientific Info Drawer */}
                <AnimatePresence>
                  {infoModalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-16 right-6 left-6 z-20 bg-white/95 backdrop-blur-xl border border-white/80 p-4 rounded-2xl shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F0F11]">Semaglutide 10mg Solution Spec</span>
                        <button
                          type="button"
                          onClick={() => setInfoModalOpen(false)}
                          className="text-gray-400 hover:text-black cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#52525B] leading-relaxed mb-3">
                        Instant aqueous dissolution in sterile bacteriostatic water. High-affinity peptide integrity maintained at physiologic equilibrium.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                        <div><span className="font-semibold text-gray-900">HPLC Purity:</span> &ge;99.8%</div>
                        <div><span className="font-semibold text-gray-900">Dosage:</span> 10 mg / vial</div>
                        <div><span className="font-semibold text-gray-900">Dissolution:</span> &lt; 15 sec</div>
                        <div><span className="font-semibold text-gray-900">Lot Release:</span> HPLC + MS</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Top (Headline + Molecule Card) & Bottom (3-Row Feature List) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-10">
                
                {/* Top Half: Left Headline + Right Molecule Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Headline & LEARN MORE button */}
                  <div className="md:col-span-6 flex flex-col items-start justify-center pt-4">
                    <p className="text-base sm:text-lg text-[#0F0F11] font-normal leading-relaxed mb-6">
                      Driven by a rich history of expertise and a relentless pursuit of scientific excellence
                    </p>
                    <Link
                      href="/about-us"
                      className="px-7 py-3 rounded-full bg-[#0F0F11] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors shadow-sm"
                    >
                      LEARN MORE
                    </Link>
                  </div>

                  {/* Receptor Complex Molecule Card with Floating Frosted Badge */}
                  <div
                    data-parallax="-4"
                    className="md:col-span-6 rounded-[24px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden bg-cover bg-center min-h-[290px] border border-gray-200/80 bg-[#F4F4F6]"
                    style={{ backgroundImage: "url(/assets/peptide_receptor_interaction.jpg)" }}
                  >
                    <div className="flex justify-end items-start z-10">
                      <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center text-purple-700 text-xs font-bold shadow-xs">
                        ?
                      </span>
                    </div>

                    <div className="my-auto" />

                    {/* Floating Frosted Badge: Good interaction with other molecules */}
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 bg-white/95 backdrop-blur-md border border-white/80 p-4 rounded-2xl shadow-lg flex flex-col gap-2.5 max-w-[210px]"
                    >
                      <h4 className="text-sm font-serif font-normal text-[#0F0F11] leading-snug">
                        Good interaction with other molecules
                      </h4>
                      <Link
                        href="/peptide-calculator"
                        className="self-start px-3.5 py-1 rounded-full bg-[#8B5CF6] text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-[#7C3AED] transition-colors"
                      >
                        Learn more
                      </Link>
                    </motion.div>
                  </div>

                </div>

                {/* Bottom Half: Interactive Diagnostic Topics (Compact, Streamlined) */}
                <div className="border-t border-gray-200/80 pt-5">
                  {(() => {
                    const DIAGNOSTIC_TOPICS = [
                      {
                        title: "Independent verification",
                        metric: "≥99.8% HPLC Certified",
                        desc: "Dual-method ISO/IEC 17025 accredited HPLC testing guarantees baseline purity with zero detectable residual solvents.",
                        tags: ["ISO/IEC 17025", "Dual-Lab Verified"],
                        ctaLabel: "View Sample HPLC",
                        ctaHref: "/certificates",
                      },
                      {
                        title: "Global Reach",
                        metric: "<24h US Cold-Chain",
                        desc: "Same-day temperature-buffered cold-chain dispatch from our US facility for orders placed before 2:00 PM EST.",
                        tags: ["Domestic US Synthesis", "Express Transit"],
                        ctaLabel: "Shop Compounds",
                        ctaHref: "/shop",
                      },
                      {
                        title: "Research Excellence",
                        metric: "100% Traceable COAs",
                        desc: "Scannable vial batch numbers map directly to raw electrospray ionization mass spectrometry (ESI-MS) sequence reports.",
                        tags: ["ESI-MS Verified", "Public Database"],
                        ctaLabel: "Open COA Portal",
                        ctaHref: "/certificates",
                      },
                    ];

                    const activeIndex = activeBentoItem ?? 0;
                    const currentTopic = DIAGNOSTIC_TOPICS[activeIndex] || DIAGNOSTIC_TOPICS[0];

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
                        {/* Left Column: 3 Selectable Topic Rows (5 cols) */}
                        <div className="md:col-span-5 flex flex-col space-y-2">
                          {DIAGNOSTIC_TOPICS.map((item, idx) => {
                            const isActive = activeIndex === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveBentoItem(idx)}
                                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                                  isActive
                                    ? "bg-purple-50/70 border-purple-300 shadow-2xs"
                                    : "bg-white/70 hover:bg-white border-gray-200/70 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                                      isActive
                                        ? "border-[#8B5CF6] bg-[#8B5CF6] text-white"
                                        : "border-gray-300 bg-white text-gray-400 group-hover:border-[#8B5CF6] group-hover:text-[#8B5CF6]"
                                    }`}
                                  >
                                    <Plus
                                      className={`w-3 h-3 transition-transform duration-200 ease-out ${
                                        isActive ? "rotate-45" : "rotate-0"
                                      }`}
                                    />
                                  </div>
                                  <h4
                                    className={`text-sm sm:text-[15px] font-serif transition-colors ${
                                      isActive ? "text-[#7C3AED] font-medium" : "text-[#0F0F11]"
                                    }`}
                                  >
                                    {item.title}
                                  </h4>
                                </div>
                                <div
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    isActive ? "bg-[#8B5CF6]" : "bg-transparent"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>

                        {/* Right Column: Compact Active Detail Panel (7 cols) */}
                        <div className="md:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/80 p-4 sm:p-4.5 shadow-2xs">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeIndex}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="flex flex-col justify-between"
                            >
                              {/* Top Row: Metric Badge & Tags */}
                              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-[11px] font-semibold font-mono">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                                  {currentTopic.metric}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {currentTopic.tags.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="text-[10px] text-gray-500 font-medium px-2 py-0.5 rounded-md bg-gray-100/80 border border-gray-200/60 hidden sm:inline"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Concise 2-line Description */}
                              <p className="text-xs sm:text-[13px] text-[#52525B] leading-relaxed mb-3">
                                {currentTopic.desc}
                              </p>

                              {/* Bottom Row: CTA Link */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <Link
                                  href={currentTopic.ctaHref}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F0F11] hover:bg-[#8B5CF6] text-white text-[11px] font-medium tracking-wide transition-colors group shadow-2xs"
                                >
                                  <span>{currentTopic.ctaLabel}</span>
                                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>

                                <span className="text-[10px] text-gray-400 font-mono">
                                  Topic 0{activeIndex + 1}/03
                                </span>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: STACKED SERVICE CARDS WITH BACKGROUND MARQUEE (00:07 - 00:10)  */}
        {/* ========================================================================= */}
        <section id="sec5"
          ref={deckRef}
          data-motion-owner="deck"
          className="min-h-screen py-16 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden flex flex-col justify-center"
        >
          
          {/* Giant Running Background Marquee (from video 00:08) */}
          {/* Solid lilac fill, never an outline: the reference has no stroked type anywhere. */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none pointer-events-none whitespace-nowrap">
            <div className="animate-marquee flex items-center">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-6xl sm:text-7xl md:text-8xl font-normal uppercase text-[#B9A6F2] tracking-[0.01em] mx-4">
                  PRECISION VIALS ⊕ / METERED NASAL SPRAYS ⊕ / SYNERGISTIC BLENDS ⊕ / PURITY VERIFIED ⊕ /
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">

            {/*
              Cards travel bottom-to-top through the marquee while the section is pinned.
              Initial state: 3D physical stacked deck with Card 1 and 2 visible behind Card 0.
            */}
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[480px] sm:h-[520px] [perspective:1200px]">
              {stackedCards.map((card, idx) => (
                <div
                  key={card.title}
                  style={{ zIndex: 30 - idx * 10 }}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 768) {
                      handleDeckCardSelect((activeDeckIndex + 1) % stackedCards.length);
                    }
                  }}
                  className="deck-card absolute inset-0 w-full h-full bg-[#EDEDF0] border border-gray-200/90 rounded-[28px] p-4 flex flex-col justify-between shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] select-none transform-gpu cursor-pointer md:cursor-default"
                >
                  {/* Top 3D Visual Area */}
                  {card.isFluidAnimated ? (
                    <FluidVialVisual
                      imageSrc={card.image}
                      altText={card.title}
                      videoSrc={card.video}
                      badge={card.badge}
                      priority={idx === 0}
                    />
                  ) : card.isHangingAnimated ? (
                    <HangingSpraysVisual
                      imageSrc={card.image}
                      altText={card.title}
                      badge={card.badge}
                      priority={idx === 0}
                    />
                  ) : (
                    <div className="relative w-full h-[320px] sm:h-[350px] rounded-[22px] overflow-hidden bg-[#E2E4EB]/40 flex items-center justify-center border border-black/5">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                      {/* Laboratory spec badge pill overlay in corner */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/10 shadow-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-800">
                          {card.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Info Row */}
                  <div className="px-2 pt-3 pb-1 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold block mb-0.5">
                        {card.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-medium text-[#0F0F11] leading-snug truncate">
                        {card.title}
                      </h3>
                    </div>
                    <Link
                      href={card.href}
                      className="shrink-0 px-3.5 py-1.5 rounded-full border border-gray-300 text-xs font-semibold uppercase tracking-wider text-gray-800 bg-white hover:bg-black hover:text-white hover:border-black transition-all shadow-xs"
                    >
                      {card.btnText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Interactive Stepper & Dot Navigator */}
            <div className="flex md:hidden items-center justify-between w-full max-w-[360px] mt-5 px-3 select-none z-20">
              <div className="flex items-center gap-2">
                {stackedCards.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDeckCardSelect(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeDeckIndex === i ? "w-7 bg-neutral-900" : "w-2 bg-neutral-300"
                    }`}
                    aria-label={`Go to service card ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-medium text-neutral-500 mr-1">
                  {activeDeckIndex + 1} / {stackedCards.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeckCardSelect(Math.max(0, activeDeckIndex - 1))}
                  disabled={activeDeckIndex === 0}
                  aria-label="Previous service card"
                  className="w-8 h-8 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 disabled:opacity-30 shadow-xs active:scale-90 transition-transform touch-manipulation cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeckCardSelect((activeDeckIndex + 1) % stackedCards.length)}
                  aria-label="Next service card"
                  className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform touch-manipulation cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: THE SCIENCE BEHIND OUR SERVICES (00:10 - 00:14)                 */}
        {/* ========================================================================= */}
        <section id="sec6"
          ref={scienceRef}
          data-motion-owner="science"
          className="min-h-screen flex flex-col justify-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#F8F8FA] border-t border-[#E4E4E7] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            
            {/* Header Row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-serif tracking-tight text-[#0F0F11] mb-6">
                  How We Verify <br />
                  Peptide Purity
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const dots = scienceRef.current?.querySelectorAll(".timeline-dot") as NodeListOf<HTMLElement> | undefined;
                      const activeIndex = Array.from(dots || []).findIndex((d) => d.classList.contains("scale-125"));
                      const prevIdx = (activeIndex - 1 + timelineSteps.length) % timelineSteps.length;
                      const stepEls = scienceRef.current?.querySelectorAll(".timeline-step") as NodeListOf<HTMLElement> | undefined;
                      stepEls?.[prevIdx]?.click();
                      if (window.innerWidth < 1024) {
                        stepEls?.[prevIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    aria-label="Previous timeline step"
                    className="w-10 h-10 rounded-full border border-[#D4D4D8] bg-white hover:border-[#0F0F11] flex items-center justify-center transition-colors shadow-sm active:scale-95 touch-manipulation cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#0F0F11]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dots = scienceRef.current?.querySelectorAll(".timeline-dot") as NodeListOf<HTMLElement> | undefined;
                      const activeIndex = Array.from(dots || []).findIndex((d) => d.classList.contains("scale-125"));
                      const nextIdx = (activeIndex + 1) % timelineSteps.length;
                      const stepEls = scienceRef.current?.querySelectorAll(".timeline-step") as NodeListOf<HTMLElement> | undefined;
                      stepEls?.[nextIdx]?.click();
                      if (window.innerWidth < 1024) {
                        stepEls?.[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    aria-label="Next timeline step"
                    className="w-10 h-10 rounded-full border border-[#D4D4D8] bg-white hover:border-[#0F0F11] flex items-center justify-center transition-colors shadow-sm active:scale-95 touch-manipulation cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-[#0F0F11]" />
                  </button>
                </div>
              </div>

              <div className="max-w-md flex flex-col items-start lg:items-end">
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#0F0F11] text-xs shadow-xs hover:border-black transition-colors cursor-pointer">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#0F0F11] text-xs shadow-xs hover:border-black transition-colors cursor-pointer">
                    <Play className="w-3 h-3 fill-[#0F0F11]" />
                  </span>
                  <Link
                    href="/contact-us"
                    className="px-6 py-2 rounded-full border border-[#0F0F11] text-xs font-semibold uppercase tracking-wider text-[#0F0F11] hover:bg-[#0F0F11] hover:text-white transition-colors shadow-sm"
                  >
                    MAKE AN APPOINTMENT
                  </Link>
                </div>

                <div className="mb-6">
                  <ScrollTextReveal
                    text="Pioneering analytical rigour, we pair solid-phase synthesis with reverse-phase HPLC and high-resolution mass spectrometry."
                    highlightWords={["reverse-phase", "HPLC", "and", "high-resolution", "mass", "spectrometry."]}
                    highlightColor="#7C3AED"
                    className="text-base sm:text-lg text-[#0F0F11] leading-relaxed"
                    start="top 75%"
                    end="top 30%"
                  />
                </div>
              </div>
            </div>

            {/* Horizontal Step Timeline Line with Pulsing Active Node (from video 00:12) */}
            <div className="relative pt-6 sm:pt-12 pl-10 lg:pl-0">
              {/* Mobile Vertical Timeline Rail Line */}
              <div className="absolute left-4 top-4 bottom-6 w-0.5 bg-gray-200 lg:hidden -z-0" />

              {/* Desktop Horizontal Line */}
              <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gray-200 -z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-6 relative z-10">
                {timelineSteps.map((step, idx) => {
                  const isActive = idx === 0;
                  return (
                    <div
                      key={idx}
                      className="timeline-step cursor-pointer group flex flex-row lg:flex-col items-start gap-4 lg:gap-0 pb-3 lg:pb-0 touch-manipulation"
                    >
                      {/* Node Bullet */}
                      <div className="-ml-10 lg:ml-0 mb-0 lg:mb-6 flex items-center justify-center w-8 h-8 shrink-0 z-10 bg-[#F8F8FA]">
                        <div
                          className={`timeline-dot w-4 h-4 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-purple-600 ring-8 ring-purple-100 scale-125"
                              : "bg-gray-300 group-hover:bg-gray-500"
                          }`}
                        />
                      </div>

                      {/* Step Details */}
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-1 sm:mb-2">
                          {step.subtitle}
                        </span>
                        <p
                          className={`timeline-desc text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                            isActive
                              ? "text-[#0F0F11] font-semibold"
                              : "text-[#71717A] font-normal group-hover:text-[#0F0F11]"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: RESEARCH CATEGORIES (SELECT BY CATEGORY)                       */}
        {/* ========================================================================= */}
        <section
          id="sec7"
          ref={advantagesRef}
          data-motion-owner="true"
          className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 md:px-8 bg-[#F6F6F2] border-t border-b border-[#E4E4E7]/80 overflow-hidden"
        >
          <div className="max-w-[1280px] mx-auto">
            <CategoriesSection />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: LABORATORY DEVICE & REAL-TIME HPLC WAVEFORM HUD (00:16 - 00:19) */}
        {/* ========================================================================= */}
        <section
          id="sec8"
          ref={labRef}
          data-motion-owner="true"
          className="min-h-screen py-24 px-6 md:px-12 lg:px-20 bg-[#F4F4F6] border-y border-[#E4E4E7] flex flex-col justify-center overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full">
            {/* Wide Rounded Banner Container with COA Vials Background (slides right-to-left on scroll) */}
            <div
              ref={labBannerRef}
              className="relative w-full rounded-3xl border border-white/10 p-6 sm:p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[560px] sm:min-h-[600px] lg:min-h-[640px] bg-[#030d1a] will-change-transform"
            >
              {/* High-Definition 3D Vials Background with Official Amino Based Branding */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Image
                  src="/assets/page-hero-03-coa-vials-official.webp"
                  alt="Amino Based Precision Research Vials"
                  fill
                  priority
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover object-center"
                />
              </div>

              {/* Top Row: Action buttons on top right matching video 00:17 (Hidden on mobile) */}
              <div className="hidden sm:flex justify-end items-center gap-3 z-10 mb-8">
                <Link
                  href="/shop"
                  className="px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-xs font-semibold uppercase tracking-wider text-[#0F0F11] hover:bg-black hover:text-white transition-colors shadow-xs"
                >
                  Browse Catalog
                </Link>
                <Link
                  href="/certificates"
                  className="px-5 py-2 rounded-full bg-[#0F0F11]/90 backdrop-blur-md text-white border border-white/20 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors shadow-xs"
                >
                  Verify Lot COA
                </Link>
              </div>

              {/* Bottom Content Area: Left Real HTML 'Certificates of Analysis' Card, Right Floating Frosted Glass HPLC HUD Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end z-10 mt-auto">
                {/* Left Card: Real HTML Card matching the reference text and styling */}
                <div ref={labTextRef} className="lg:col-span-6 flex flex-col justify-end relative z-10">
                  <div className="w-full max-w-lg bg-[#F0F4F8] sm:bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[36px] p-7 sm:p-9 md:p-11 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/80">
                    <h2 className="text-3xl sm:text-4xl md:text-[46px] font-sans font-bold text-[#08152B] tracking-tight leading-[1.08] mb-4">
                      Certificates of <br />
                      Analysis
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-[#475569] font-normal leading-relaxed mb-6 sm:mb-8 max-w-md">
                      Independent third-party results for every batch, ready to view.
                    </p>
                    <Link
                      href="/certificates"
                      className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#081E3D] hover:bg-[#0E2F5E] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95 group w-fit"
                    >
                      <span>View Certificates</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Floating Frosted Glass Chromatogram HUD Card (glides from Left across to Right) - UNTOUCHED */}
                <div className="lg:col-span-6 flex justify-end relative z-20">
                  <div
                    ref={labCardRef}
                    className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white/60 rounded-[28px] p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.18)] relative z-20 will-change-transform"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                          HPLC Purity Response
                        </span>
                        <h4 className="text-base font-serif font-normal text-[#0F0F11]">Active Lot Batch Chromatogram</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          The single sharp retention peak verifies absence of sequence truncation.
                        </p>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end mt-4 pt-3 border-t border-gray-200/60">
                      <div className="sm:col-span-5 flex items-baseline">
                        <span ref={labPurityRef} className="text-4xl sm:text-5xl font-light text-[#0F0F11]">
                          95.5
                        </span>
                        <span className="text-xs font-semibold text-purple-600 ml-1.5">% Purity</span>
                      </div>

                      {/* Animated Peak Waveform with Pulsing "Peak" label */}
                      <div className="sm:col-span-7 relative h-20 flex items-end">
                        <svg className="w-full h-full text-purple-600 overflow-visible" viewBox="0 0 200 60" fill="none">
                          <path
                            d="M0,45 L35,45 L55,45 L70,15 L78,50 L90,45 L115,45 L132,6 L142,50 L155,45 L200,45"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="132" cy="6" r="4" fill="#7C3AED" className="animate-ping" />
                          <circle cx="132" cy="6" r="3" fill="#7C3AED" />
                        </svg>
                        <span className="absolute top-0 right-2 text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full shadow-2xs">
                          Peak 99.8%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: MILITARY & VETERAN RESEARCH DISCOUNT                              */}
        {/* ========================================================================= */}
        <MilitaryDiscountSection />

        {/* ========================================================================= */}
        {/* SECTION 9: EDUCATIONAL WEBINARS (00:20 - 00:22 in reference video)        */}
        {/* ========================================================================= */}
        <section id="sec-webinars" ref={webinarsRef} data-motion-owner="webinars" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
              <div className="lg:col-span-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#0F0F11] tracking-tight leading-tight">
                  Our <span className="text-[#8B5CF6] font-normal italic">research guides</span> explain how peptide purity is measured, what a Certificate of Analysis proves, and how to handle lyophilised material.
                </h2>
              </div>
              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full gap-4">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#0F0F11]">
                  <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 shadow-xs">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </span>
                  <span>Research Guides</span>
                </div>
                <Link
                  href="/blog"
                  className="px-6 py-2 rounded-full bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#7C3AED] transition-all shadow-md"
                >
                  SEE ALL
                </Link>
              </div>
            </div>

            {/* 3 Circular Research Guide Cards (matching reference with crisp high-res project imagery & purple arrow button) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  img: "/assets/guide_coa_verification.jpg",
                  title: "How to Read a Certificate of Analysis",
                  desc: "What each section of a COA means, and which figures actually matter.",
                  href: "/certificates",
                },
                {
                  img: "/assets/guide_hplc_purity.jpg",
                  title: "What ≥99% HPLC Purity Means",
                  desc: "How purity is measured, and why the remaining fraction matters.",
                  href: "/certificates",
                },
                {
                  img: "/assets/guide_reconstitution_storage.jpg",
                  title: "Reconstitution and Storage",
                  desc: "Handling lyophilised peptides so results stay reproducible between runs.",
                  href: "/calculator",
                },
              ].map((webinar, idx) => (
                <Link
                  key={idx}
                  href={webinar.href}
                  className="webinar-card group flex flex-col items-start cursor-pointer text-left"
                >
                  {/* Circular Thumbnail with Hover Animation & Top-Right Purple Arrow Badge */}
                  <div className="relative w-36 h-36 mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden border border-gray-200/90 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 relative bg-gray-50">
                      <Image
                        src={webinar.img}
                        alt={webinar.title}
                        fill
                        sizes="(max-width: 768px) 144px, 144px"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    {/* Floating Top-Right Purple Diagonal Arrow Pill (matching reference screenshot) */}
                    <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#A78BFA] via-[#906CF0] to-[#7C3AED] text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 pointer-events-none z-10">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-normal text-[#0F0F11] mb-2 group-hover:text-purple-600 transition-colors">
                    {webinar.title}
                  </h3>
                  <p className="text-xs text-[#71717A] leading-relaxed max-w-xs">
                    {webinar.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHY CHOOSE US SECTION (ACCORDING TO REFERENCE DESIGN)                       */}
        {/* ========================================================================= */}
        <WhyChooseUsSection />

        {/* ========================================================================= */}
        {/* SECTION 10: BLOG SECTION (PRACTICAL READS / REFERENCE DESIGN)              */}
        {/* ========================================================================= */}
        <BlogSection posts={posts} />

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* SECTION 10: FREQUENTLY ASKED QUESTIONS (ACCORDION & CALLOUT)              */}
        {/* ========================================================================= */}
        <FAQSection
          id="sec10"
          faqs={FAQ_ITEMS}
          calloutButtonLink="#sec11"
        />

        {/* ========================================================================= */}
        {/* SECTION 10.5: INTERACTIVE BRAND ORB CHAMBER                               */}
        {/* ========================================================================= */}
        <InteractiveBrandChamber />

        {/* ========================================================================= */}
        {/* SECTION 11: CONTACT US (Framer Motion whileInView Stagger Animation)      */}
        {/* ========================================================================= */}
        <ContactSection id="sec11" />

        {/* Full-Screen High-Definition Scientific Simulation Video Modal */}
        <AnimatePresence>
          {videoModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl"
              onClick={() => setVideoModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-[#0B0D13] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">
                        Aqueous Cellular Dispersal & Bio-Synthesis Dynamics
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        High-resolution molecular stability & hydration kinetic model
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Video / Visual Player */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src="/assets/vial-water-drop.mp4"
                    poster="/assets/vial-water-splash.png"
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Modal Footer Specs */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-white/5 border-t border-white/10 text-xs text-gray-300">
                  <div className="flex items-center gap-4">
                    <span>Batch: <strong className="text-white font-mono">LOT-AM-2026-X</strong></span>
                    <span>Purity: <strong className="text-emerald-400">99.8% HPLC</strong></span>
                    <span>Equilibrium: <strong className="text-white">37.0°C</strong></span>
                  </div>
                  <Link
                    href="/certificates"
                    className="px-4 py-1.5 rounded-full bg-white hover:bg-gray-100 text-[#0F0F11] font-semibold text-[11px] uppercase tracking-wider transition-colors"
                  >
                    Verify Lot COA
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* SECTION 12: SUBMERGED AMINO BASED LOGO FOOTER (Video-matched Reveal)     */}
        {/* ========================================================================= */}
        <Footer giantText="Amino Based" brandTitle="Amino Based" scrollReveal={true} />

      </div>
    </main>
  );
}
