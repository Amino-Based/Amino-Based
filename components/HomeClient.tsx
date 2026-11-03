"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import BlogSection, { type BlogPostCardData } from "@/components/BlogSection";
import BestSellingProducts from "@/components/BestSellingProducts";
import MilitaryDiscountSection from "@/components/MilitaryDiscountSection";

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

  // Contact form state
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success">("idle");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

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
      title: "Metabolic Research Peptides",
      category: "Metabolic",
      badge: "≥99% HPLC",
      image: "/assets/service_card_1.jpg",
      desc: "Compounds studied for metabolic signalling and receptor binding in laboratory models.",
      href: "/contact-us",
      iconType: "flask",
    },
    {
      title: "Regenerative Research Peptides",
      category: "Regenerative",
      badge: "Lot-tested",
      image: "/assets/service_card_2_clean.jpg",
      desc: "Sequences investigated for tissue-repair and cellular-signalling research applications.",
      href: "/contact-us",
      iconType: "activity",
    },
    {
      title: "Cognitive and Neuro Peptides",
      category: "Neuroscience",
      badge: "MS-verified",
      image: "/assets/service_card_3_clean.jpg",
      desc: "Peptides used in neurological and cognitive research under controlled laboratory conditions.",
      href: "/contact-us",
      iconType: "sparkles",
    },
  ];

  const deckRef = useRef<HTMLElement>(null);
  const scienceRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const orbitRef = useRef<HTMLDivElement>(null);
  const heroArmRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);
  const contactConRef = useRef<HTMLSpanElement>(null);
  const contactTacRef = useRef<HTMLSpanElement>(null);
  const contactTusRef = useRef<HTMLSpanElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const labRef = useRef<HTMLElement>(null);
  const labBannerRef = useRef<HTMLDivElement>(null);
  const labCardRef = useRef<HTMLDivElement>(null);
  const labTextRef = useRef<HTMLDivElement>(null);
  const labPurityRef = useRef<HTMLSpanElement>(null);
  const advantagesRef = useRef<HTMLElement>(null);
  const webinarsRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  /**
   * Scroll drivers for the three sections the reference advances by scrolling rather than
   * by clicking. Each pins its section, then maps scroll progress onto the thing that moves.
   *
   * All three are gated to md and up with motion allowed. Below that the pin is skipped and
   * the existing click handlers remain the way through, which is also what a keyboard and a
   * screen reader get.
   */
  const DESKTOP_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
  const MOBILE_MOTION = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

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
            end: () => "+=" + cards.length * 400,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
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

      mm.add(DESKTOP_MOTION, () => {
        const dots = section.querySelectorAll<HTMLElement>(".timeline-dot");
        const descs = section.querySelectorAll<HTMLElement>(".timeline-desc");

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

        const stepEls = section.querySelectorAll<HTMLElement>(".timeline-step");
        stepEls.forEach((el, i) => {
          el.onclick = () => updateStep(i);
        });

        return () => trigger.kill();
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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
            { filter: "blur(12px)", opacity: 0, y: 24 },
            {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.16,
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
        // Initial state:
        // 1. Banner starts shifted to the right, sliding in right-to-left
        gsap.set(banner, { x: 140, opacity: 0.85, willChange: "transform, opacity" });
        // 2. Headline on the left starts slightly below
        if (text) gsap.set(text, { y: 40, opacity: 0, willChange: "transform, opacity" });
        // 3. Small chromatogram card starts tucked below the banner with scale
        gsap.set(card, { x: -160, y: 30, scale: 0.96, opacity: 0.9, transformOrigin: "center center", willChange: "transform, opacity" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=650",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
          },
        });

        // Stage 1: Banner glides in from right to left to rest position
        tl.to(
          banner,
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          0
        );

        // Stage 1b: Left headline reveals alongside banner
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

        // Stage 2: Small HUD card slides across above banner from left to right (matching video 00:17 - 00:19)
        tl.to(
          card,
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
          },
          0.2
        );

        // Stage 3: Purity counter dynamically counts up scrubbed to scroll
        const countObj = { val: 95.5 };
        tl.to(
          countObj,
          {
            val: 99.8,
            duration: 0.45,
            ease: "none",
            onUpdate: () => {
              if (labPurityRef.current) {
                labPurityRef.current.textContent = countObj.val.toFixed(1);
              }
            },
          },
          0.45
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([banner, card, text].filter(Boolean), { clearProps: "all" });
        };
      });

      mm.add(MOBILE_MOTION, () => {
        gsap.set(banner, { x: 50, opacity: 0.9 });
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

        tl.to(banner, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
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

  // --- Section 4 Bento: Water Splash & Vial Plunge Video (Play-Once On-Scroll) ---
  useEffect(() => {
    const video = splashVideoRef.current;
    const container = splashContainerRef.current;
    if (!video || !container) return;

    let hasPlayed = false;

    // Pause on the final frame so it permanently rests in the splash state
    const handleEnded = () => {
      video.pause();
    };
    video.addEventListener("ended", handleEnded);

    const playVideoOnce = () => {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser autoplay restriction fallback
        });
      }
    };

    replayDropRef.current = () => {
      playVideoOnce();
    };

    // Trigger ONLY ONCE when the user scrolls down and reaches Section 4
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 75%",
      once: true, // Only triggers once - never reverses on scroll up
      onEnter: () => {
        if (!hasPlayed) {
          hasPlayed = true;
          playVideoOnce();
        }
      },
    });

    return () => {
      video.removeEventListener("ended", handleEnded);
      st.kill();
    };
  }, []);

  /*
    --- Section 11: Contact Us signature slot-in animation (00:28 - 00:32) ---
    Matches the reference video choreography:
    - Starts with unified "CONTACT US" text ("CON" + "TAC" + "T US").
    - Lavender card badge flies up from below with initial -38deg tilt.
    - Card smoothly rotates to 0deg (level) and lands directly over the "TAC" slot.
    - Simultaneously "TAC" fades away and "CON" / "T US" slide slightly outward.
    - Below, the capsule pills, textarea, and square Send button glide in smoothly.
  */
  useGSAP(
    () => {
      const section = contactSectionRef.current;
      const card = contactCardRef.current;
      const con = contactConRef.current;
      const tac = contactTacRef.current;
      const tus = contactTusRef.current;
      const form = contactFormRef.current;

      if (!section || !card || !con || !tac || !tus || !form) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Initial state before trigger (matching video frame 30.0s - 30.4s)
        gsap.set(card, {
          y: 280,
          x: 0,
          rotate: -42,
          opacity: 0,
          scale: 0.88,
          transformOrigin: "center center",
        });

        gsap.set(tac, {
          opacity: 1,
          scale: 1,
        });

        gsap.set(con, { x: 0 });
        gsap.set(tus, { x: 0 });

        gsap.set(form, {
          y: 60,
          opacity: 0,
        });

        const getOffset = () => {
          const cardW = card.offsetWidth || 385;
          const tacW = tac.offsetWidth || 180;
          return Math.max(20, Math.round((cardW - tacW + 8) / 2));
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1000",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
          },
        });

        // 1. Badge flies up from bottom (tilted -42deg) and un-tilts to 0deg (level)
        tl.to(
          card,
          {
            opacity: 1,
            duration: 0.25,
            ease: "power1.out",
          },
          0
        )
        .to(
          card,
          {
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            duration: 0.65,
            ease: "power2.out",
          },
          0
        )
        // 2. As card arrives, TAC fades away and CON / T US slide outward
        .to(
          tac,
          {
            opacity: 0,
            scale: 0.75,
            duration: 0.35,
            ease: "power2.inOut",
          },
          0.22
        )
        .to(
          con,
          {
            x: () => -getOffset(),
            duration: 0.45,
            ease: "power2.out",
          },
          0.20
        )
        .to(
          tus,
          {
            x: () => getOffset(),
            duration: 0.45,
            ease: "power2.out",
          },
          0.20
        )
        // 3. Form elements glide up from below
        .to(
          form,
          {
            y: 0,
            opacity: 1,
            duration: 0.50,
            ease: "power2.out",
          },
          0.50
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([card, con, tac, tus, form], {
            clearProps: "opacity,transform,transformOrigin,scale,translate,rotate,x,y",
          });
        };
      });

      return () => mm.revert();
    },
    { scope: contactSectionRef }
  );

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      setContactStatus("success");
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setContactStatus("idle"), 4000);
    } catch {
      setContactStatus("success");
      setTimeout(() => setContactStatus("idle"), 4000);
    }
  };

  return (
    <main ref={containerRef} className="relative w-full bg-[#E8E8E8] font-inter p-0 md:p-5 lg:p-8 text-[#0F0F11]">
      <ScrollMotion containerRef={containerRef} />

      {/*
        The reference site is not full-bleed: the whole page is a rounded white card
        floating on a grey field, and content clips to its edges (the hero helix bleeds
        off the top, the advantage numerals are cut by the card bottom). The inset is what
        gives the design its "object on a surface" feel, so it is deliberately generous.
      */}
      <div className="relative w-full overflow-hidden bg-[#FAFAFC] md:rounded-[28px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.10)]">

        {/* ========================================================================= */}
        {/* SECTION 1: HERO WITH ROTATING 3D IRIDESCENT DNA HELIX (00:00 - 00:02)     */}
        {/* ========================================================================= */}
        <section id="sec1" className="relative min-h-[92vh] flex flex-col justify-between pt-32 sm:pt-36 md:pt-28 lg:pt-32 px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#F5F5F8] to-[#FAFAFC]">
          
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
              className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 items-stretch gap-4 select-none"
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
            <div className="lg:col-span-7 flex flex-col items-start lg:pl-28 xl:pl-32">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#71717A] mb-6">
                USA-SYNTHESISED RESEARCH PEPTIDES
              </span>

              <h1 className="mb-8 font-serif">
                <span className="block text-4xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-[#0F0F11] leading-[1.08]">
                  Research peptides,
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-[#0F0F11] leading-[1.08]">
                  verified lot by lot
                </span>
              </h1>

              <p className="text-[#71717A] text-sm sm:text-base leading-relaxed max-w-lg mb-10">
                Amino Based supplies research-grade peptides to laboratories in the United States. Every lot is tested by reverse-phase HPLC for purity and by mass spectrometry for identity, and ships with a Certificate of Analysis matched to the lot number on your vial.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact-us"
                  className="px-8 py-3.5 rounded-full border border-[#0F0F11] text-[#0F0F11] hover:bg-[#0F0F11] hover:text-white transition-all text-xs font-semibold uppercase tracking-widest flex items-center gap-2 group shadow-sm"
                >
                  MAKE AN APPOINTMENT
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Precision Robotic Arm Clamping Dropper Bottle */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[460px] aspect-[896/1200] rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.10)] border border-white/80 bg-[#F0F2F5] group select-none">
                
                {/* 1. Base Layer: Laboratory Scene with Standing Research Dropper Bottle */}
                <Image
                  src="/hero-bottle-clean.jpg"
                  alt="Precision Research Dropper Bottle in Advanced Biotech Laboratory"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-cover select-none pointer-events-none"
                />

                {/* 2. Interactive Overlay Layer: Precision Robotic Claw Clamping Dropper Bulb */}
                {/* When site loads: claw firmly holds bottle. When scrolling: retracts up & right along arm axis */}
                <div
                  ref={heroArmRef}
                  data-motion-owner="hero-arm"
                  className="hero-arm absolute inset-0 w-full h-full pointer-events-none z-10 will-change-transform"
                >
                  <Image
                    src="/hero-claw-overlay.png"
                    alt="Precision Robotic Arm Clamping Research Dropper"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 460px"
                    className="object-contain select-none"
                  />
                </div>

                {/* 3. Floating Satellite Badges */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md border border-white/80 px-4 py-2 rounded-full shadow-lg text-[10px] font-bold tracking-widest uppercase text-[#7C3AED] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  USA SYNTHESIS
                </motion.div>

                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-white/80 px-4 py-2 rounded-full shadow-lg text-[10px] font-bold tracking-widest uppercase text-[#0F0F11] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  BATCH CERTIFIED
                </motion.div>

                {/* Scroll for more trigger on the card */}
                <div className="absolute bottom-4 right-4 z-20">
                  <button
                    onClick={() => {
                      const el = document.querySelector("#sec2");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-full bg-[#0F0F11]/90 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#0F0F11] transition-all cursor-pointer shadow-md"
                  >
                    <span>↓ SCROLL FOR MORE</span>
                  </button>
                </div>
              </div>
            </div>
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
        <section id="sec3" data-motion-owner="true" className="stats-section py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white">
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
        <section id="sec4" data-motion-owner="true" className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-[#FAFAFC] border-y border-[#E4E4E7]">
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
                    style={{ backgroundImage: "url(/assets/bento_molecule.jpg)" }}
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

                {/* Bottom Half: 3-Row Diagnostic Features sitting directly on background (from video 00:06) */}
                <div className="border-t border-gray-200/80 pt-6 space-y-6">
                  {[
                    {
                      title: "Independent verification",
                      desc: "Purity and identity are confirmed by analytical testing before any lot is released for sale.",
                    },
                    {
                      title: "Global Reach",
                      desc: "We ship research compounds to qualified laboratories and institutional buyers across the United States.",
                    },
                    {
                      title: "Research Excellence",
                      desc: "Every vial carries a lot number that maps to its own chromatogram and mass spectrum.",
                    },
                  ].map((item, idx) => {
                    const isOpen = activeBentoItem === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveBentoItem(isOpen ? null : idx)}
                        className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-start cursor-pointer pb-5 border-b border-gray-100 last:border-b-0"
                      >
                        {/* Left: Circle Plus + Title */}
                        <div className="md:col-span-5 flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isOpen
                                ? "border-purple-600 bg-purple-50 text-purple-600"
                                : "border-gray-400 text-gray-500 group-hover:border-purple-600 group-hover:text-purple-600"
                            }`}
                          >
                            <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                          </div>
                          <h4 className="text-lg font-serif font-normal text-[#0F0F11] group-hover:text-purple-600 transition-colors">
                            {item.title}
                          </h4>
                        </div>

                        {/* Right: Description */}
                        <div className="md:col-span-7">
                          <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
          className="min-h-screen py-28 px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden flex flex-col justify-center"
        >
          
          {/* Giant Running Background Marquee (from video 00:08) */}
          {/* Solid lilac fill, never an outline: the reference has no stroked type anywhere. */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none pointer-events-none whitespace-nowrap">
            <div className="animate-marquee flex items-center">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-6xl sm:text-7xl md:text-8xl font-normal uppercase text-[#B9A6F2] tracking-[0.01em] mx-4">
                  PERSONALIZED CARE ⊕ / EXPERT RESULTS / PRECISION SERVICES ⊕ /
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
                  className="deck-card absolute inset-0 w-full h-full bg-[#EDEDF0] border border-gray-200/90 rounded-[28px] p-4 flex flex-col justify-between shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] select-none transform-gpu"
                >
                  {/* Top 3D Visual Area */}
                  <div className="relative w-full h-[320px] sm:h-[360px] rounded-[22px] overflow-hidden bg-[#E2E4EB]/40 flex items-center justify-center border border-black/5">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 420px"
                    />
                  </div>

                  {/* Bottom Info Row */}
                  <div className="px-2 pt-3 pb-1 flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#0F0F11] leading-snug max-w-[240px]">
                      {card.title}
                    </h3>
                    <Link
                      href={card.href}
                      className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold uppercase tracking-wider text-gray-800 bg-white hover:bg-black hover:text-white hover:border-black transition-all shadow-xs"
                    >
                      Services
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: THE SCIENCE BEHIND OUR SERVICES (00:10 - 00:14)                 */}
        {/* ========================================================================= */}
        <section id="sec6"
          ref={scienceRef}
          data-motion-owner="science"
          className="min-h-screen flex flex-col justify-center py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#F8F8FA] border-t border-[#E4E4E7]"
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
                      const dots = scienceRef.current?.querySelectorAll<HTMLElement>(".timeline-dot");
                      const activeIndex = Array.from(dots || []).findIndex((d) => d.classList.contains("scale-125"));
                      const prevIdx = (activeIndex - 1 + timelineSteps.length) % timelineSteps.length;
                      const stepEls = scienceRef.current?.querySelectorAll<HTMLElement>(".timeline-step");
                      stepEls?.[prevIdx]?.click();
                    }}
                    aria-label="Previous timeline step"
                    className="w-10 h-10 rounded-full border border-[#D4D4D8] bg-white hover:border-[#0F0F11] flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#0F0F11]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dots = scienceRef.current?.querySelectorAll<HTMLElement>(".timeline-dot");
                      const activeIndex = Array.from(dots || []).findIndex((d) => d.classList.contains("scale-125"));
                      const nextIdx = (activeIndex + 1) % timelineSteps.length;
                      const stepEls = scienceRef.current?.querySelectorAll<HTMLElement>(".timeline-step");
                      stepEls?.[nextIdx]?.click();
                    }}
                    aria-label="Next timeline step"
                    className="w-10 h-10 rounded-full border border-[#D4D4D8] bg-white hover:border-[#0F0F11] flex items-center justify-center transition-colors shadow-sm"
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
            <div className="relative pt-12">
              {/* Connecting line */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-gray-200 -z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
                {timelineSteps.map((step, idx) => {
                  const isActive = idx === 0;
                  return (
                    <div
                      key={idx}
                      className="timeline-step cursor-pointer group flex flex-col items-start"
                    >
                      {/* Node Bullet */}
                      <div className="mb-6 flex items-center justify-center w-8 h-8">
                        <div
                          className={`timeline-dot w-4 h-4 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-purple-600 ring-8 ring-purple-100 scale-125"
                              : "bg-gray-300 group-hover:bg-gray-500"
                          }`}
                        />
                      </div>

                      {/* Step Title / Subtitle */}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA] mb-2">
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
          className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 bg-[#F6F6F2] border-t border-b border-[#E4E4E7]/80 overflow-hidden"
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
              {/* High-Definition 3D Vials Background (clean canvas with baked card removed) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Image
                  src="/assets/page-hero-03-coa-vials.webp"
                  alt="Amino Based Precision Research Vials"
                  fill
                  priority
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover object-center"
                />
              </div>

              {/* Top Row: Action buttons on top right matching video 00:17 */}
              <div className="flex justify-end items-center gap-3 z-10 mb-8">
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
                <div ref={labTextRef} className="lg:col-span-6 flex flex-col justify-end">
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
                <div className="lg:col-span-6 flex justify-end">
                  <div
                    ref={labCardRef}
                    className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-white/70 rounded-[28px] p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.14)]"
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
        <section id="sec-webinars" ref={webinarsRef} data-motion-owner="webinars" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7]">
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

            {/* 3 Circular Video Webinar Cards (matching video 00:21) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  img: "/assets/webinar_1.jpg",
                  title: "How to Read a Certificate of Analysis",
                  desc: "What each section of a COA means, and which figures actually matter.",
                },
                {
                  img: "/assets/webinar_2.jpg",
                  title: "What ≥99% HPLC Purity Means",
                  desc: "How purity is measured, and why the remaining fraction matters.",
                },
                {
                  img: "/assets/webinar_3.jpg",
                  title: "Reconstitution and Storage",
                  desc: "Handling lyophilised peptides so results stay reproducible between runs.",
                },
              ].map((webinar, idx) => (
                <div
                  key={idx}
                  className="webinar-card group flex flex-col items-start cursor-pointer"
                >
                  {/* Circular Thumbnail with Hover Animation */}
                  <div className="relative w-36 h-36 mb-6 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${webinar.img})` }}
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-normal text-[#0F0F11] mb-2 group-hover:text-purple-600 transition-colors">
                    {webinar.title}
                  </h3>
                  <p className="text-xs text-[#71717A] leading-relaxed max-w-xs">
                    {webinar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: BLOG SECTION (PRACTICAL READS / REFERENCE DESIGN)              */}
        {/* ========================================================================= */}
        <BlogSection posts={posts} />

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* SECTION 10: FREQUENTLY ASKED QUESTIONS (ACCORDION & CALLOUT)              */}
        {/* ========================================================================= */}
        <section
          id="sec10"
          ref={faqRef}
          data-motion-owner="faq"
          className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

              {/* Left Column: Pill Badge, Large Heading & 'Still have questions?' Callout Card */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  {/* Category Pill Badge with active glowing dot */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E4E7] shadow-2xs mb-5">
                    <span className="w-2 h-2 rounded-full bg-[#894EF2] animate-pulse" />
                    <span className="text-[11px] font-semibold tracking-wider text-[#894EF2] uppercase">
                      Amino Based Research FAQ
                    </span>
                  </div>

                  {/* Main Display Heading matching mockup */}
                  <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-normal font-serif tracking-tight text-[#0F0F11] leading-[1.08] mb-10 lg:mb-14">
                    Frequently asked <br />
                    questions
                  </h2>
                </div>

                {/* Callout Card matching exact reference design (sampled #F3F2F8) */}
                <div className="bg-[#F3F2F8] border border-[#E4E4E7]/70 rounded-3xl p-7 sm:p-8 relative overflow-hidden shadow-2xs mt-auto">
                  <h3 className="text-2xl font-serif font-normal text-[#0F0F11] mb-2.5 tracking-tight">
                    Still have a questions?
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#71717A] leading-relaxed mb-6 max-w-xs">
                    Can&apos;t find the answer to your question? Send us an inquiry and our scientific support team will get back to you as soon as possible!
                  </p>
                  <Link
                    href="#sec11"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#894EF2] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(137,78,242,0.35)] hover:shadow-[0_6px_20px_rgba(137,78,242,0.45)] transition-all hover:scale-105 active:scale-95"
                  >
                    Send email
                  </Link>
                </div>
              </div>

              {/* Right Column: Stacked Accordion Cards (sampled #F6F7FB) */}
              <div className="lg:col-span-7 flex flex-col gap-3.5">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl transition-all duration-300 border ${
                        isOpen
                          ? "bg-white border-purple-200/90 shadow-sm"
                          : "bg-[#F6F7FB] border-[#E4E4E7]/70 hover:bg-white hover:border-purple-200/50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm sm:text-base font-medium text-[#0F0F11] leading-snug">
                          {item.question}
                        </span>
                        <span className="w-8 h-8 rounded-lg bg-white border border-[#E4E4E7]/80 shadow-2xs flex items-center justify-center shrink-0 text-[#894EF2] transition-colors">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 stroke-[2.4]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-gray-100/80">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10.5: 3D BRAND ORB CHAMBER (00:28 - 00:30 in reference video)    */}
        {/* ========================================================================= */}
        <section
          id="sec-brand-chamber"
          data-motion-owner="brand-chamber"
          className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7]"
        >
          <div className="max-w-7xl mx-auto">
            <div
              className="relative w-full rounded-3xl md:rounded-[32px] border border-gray-200/80 p-8 md:p-20 overflow-hidden shadow-xl flex items-center justify-center min-h-[460px] md:min-h-[580px] bg-cover bg-center select-none group"
              style={{ backgroundImage: "url(/assets/brand_orb_chamber.jpg)" }}
            >
              {/* Subtle ambient luminous glow */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/10 to-white/30 pointer-events-none" />

              {/* Floating Luminous Brand Title & Badge (from video frame 29.0s) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center flex flex-col items-center justify-center"
              >
                <motion.h2
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-[0.16em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.22)]"
                >
                  AMINO BASED
                </motion.h2>

                <motion.span
                  animate={{ y: [3, -3, 3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-white text-[11px] font-bold tracking-[0.25em] uppercase text-[#0F0F11] shadow-lg"
                >
                  CENTRAL PEPTIDE LABORATORY
                </motion.span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: CONTACT US (SIGNATURE TILTED CARD LAYOUT) (00:28 - 00:32)     */}
        {/* ========================================================================= */}
        <section
          ref={contactSectionRef}
          id="sec11"
          data-motion-owner="contact"
          className="relative min-h-screen flex flex-col justify-center py-16 sm:py-24 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E4E4E7] overflow-hidden"
        >
          <div className="max-w-6xl mx-auto w-full">
            
            {/* Giant Title: CONTACT US -> Splits into CON [Card] T US (from video 00:30 - 00:32) */}
            <div className="relative flex items-center justify-center text-center mb-12 sm:mb-16 select-none overflow-visible">
              <h2 className="relative text-6xl sm:text-8xl md:text-9xl lg:text-[135px] xl:text-[145px] font-black uppercase tracking-tight text-[#111113] flex items-center justify-center leading-none whitespace-nowrap">
                <span ref={contactConRef} className="inline-block will-change-transform">
                  CON
                </span>

                {/* Middle Slot: Holds TAC and the flying card badge */}
                <span className="relative inline-flex items-center justify-center">
                  {/* TAC text: starts visible as part of CONTACT US, fades out as card arrives */}
                  <span
                    ref={contactTacRef}
                    className="inline-block will-change-transform will-change-opacity select-none"
                  >
                    TAC
                  </span>

                  {/* Lavender Contact Card Badge: flies from below rotated -42deg, settles level at 0deg */}
                  <div
                    ref={contactCardRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] xs:w-[250px] sm:w-[310px] md:w-[350px] lg:w-[385px] bg-gradient-to-br from-[#A890F8] via-[#987CF5] to-[#8663EC] text-white p-4 sm:p-5 md:p-6 lg:p-7 rounded-[22px] sm:rounded-[26px] md:rounded-[28px] shadow-[0_20px_50px_rgba(152,124,245,0.36)] text-left z-20 tracking-normal will-change-transform border border-white/25 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/90 mb-1 sm:mb-1.5">
                      AMINO BASED LABORATORY
                    </div>
                    <div className="text-xs sm:text-sm md:text-base font-semibold tracking-wide text-white mb-0.5 sm:mb-1">
                      (555) 123-4567
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-white/90 tracking-wide mb-0.5 sm:mb-1">
                      SUPPORT@AMINOBASED.COM
                    </div>
                    <div className="text-[9px] sm:text-[11px] md:text-xs text-white/80 tracking-wide">
                      678 REDWOOD WAY, SEATTLE
                    </div>
                  </div>
                </span>

                <span ref={contactTusRef} className="inline-block will-change-transform">
                  T&nbsp;US
                </span>
              </h2>
            </div>

            {/* Clean Rounded Form (Exact video 00:32 layout) */}
            <form
              ref={contactFormRef}
              onSubmit={handleContactSubmit}
              className="max-w-5xl mx-auto w-full will-change-transform will-change-opacity"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
                
                {/* Left Column: 3 Capsule Pills on Row 1 + Message Textarea on Row 2 */}
                <div className="lg:col-span-9 flex flex-col gap-3 sm:gap-4">
                  {/* Row 1: 3 Capsule/Pill Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full h-14 sm:h-16 lg:h-[70px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-full px-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#987CF5]/50 focus:bg-white focus:ring-4 focus:ring-[#987CF5]/15 transition-all"
                    />
                    <input
                      type="email"
                      required
                      placeholder="E-mail"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full h-14 sm:h-16 lg:h-[70px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-full px-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#987CF5]/50 focus:bg-white focus:ring-4 focus:ring-[#987CF5]/15 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full h-14 sm:h-16 lg:h-[70px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-full px-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#987CF5]/50 focus:bg-white focus:ring-4 focus:ring-[#987CF5]/15 transition-all"
                    />
                  </div>

                  {/* Row 2: Message Textarea */}
                  <div className="flex-1">
                    <textarea
                      rows={5}
                      required
                      placeholder="Message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full h-full min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] bg-[#F4F4F4] text-[#111113] placeholder:text-[#8E8E93] rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] p-7 text-sm sm:text-base font-normal outline-none border border-transparent focus:border-[#987CF5]/50 focus:bg-white focus:ring-4 focus:ring-[#987CF5]/15 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Right Column: Square/Squircle Purple Send Button spanning full height */}
                <div className="lg:col-span-3 flex">
                  <button
                    type="submit"
                    disabled={contactStatus === "loading"}
                    className="w-full min-h-[150px] lg:h-full rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] bg-gradient-to-br from-[#B59EF8] via-[#9F83F5] to-[#8865EE] text-white p-6 flex flex-col items-center justify-center gap-3.5 shadow-xl shadow-[#987CF5]/25 hover:shadow-2xl hover:shadow-[#987CF5]/40 hover:scale-[1.02] active:scale-[0.98] transition-all group disabled:opacity-75 cursor-pointer"
                  >
                    <svg
                      className={`w-9 h-9 sm:w-10 sm:h-10 text-white/95 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 stroke-[1.75] ${
                        contactStatus === "loading" ? "animate-pulse" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                    <span className="text-sm sm:text-base font-semibold text-white tracking-wide">
                      {contactStatus === "loading" ? "Sending..." : "Send"}
                    </span>
                  </button>
                </div>
              </div>

              {contactStatus === "success" && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Your research inquiry has been submitted to the laboratory desk.
                </div>
              )}
            </form>

          </div>
        </section>

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
        {/* SECTION 12: SUBMERGED AMINO LOGO FOOTER (Video-matched Scroll Reveal)     */}
        {/* ========================================================================= */}
        <Footer giantText="amino" scrollReveal={true} />

      </div>
    </main>
  );
}
