"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileDown,
  Minus,
  Plus,
  Heart,
  Check,
  ChevronDown,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { useWishlistToggle } from "@/components/wishlist/useWishlistToggle";
import { getProductDisplayDetails, getMultiVariantConfig } from "@/lib/shopCardProduct";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { resolveMediaUrl, type ShopProduct } from "@/lib/types/shop";
import { type ProductRelatedPost } from "@/lib/types/blog";
import type { ShopMockProduct } from "@/lib/shopCardProduct";
import { resolveProductImageUrl } from "@/lib/products/productImage";

// 10 Detailed Laboratory Research FAQs for this specific product
const PRODUCT_TEN_FAQS = [
  {
    question: "How should this lyophilized peptide be stored upon arrival?",
    answer:
      "Store the sealed, lyophilized vial in a laboratory freezer at -20°C (or -80°C for long-term archival stability), protected from light and moisture. In its solid lyophilized state, the peptide sequence remains stable for up to 24–36 months.",
  },
  {
    question: "What is the recommended reconstitution procedure for in-vitro assays?",
    answer:
      "Allow the vial to equilibrate to room temperature (approx. 20–30 minutes) prior to reconstitution to avoid condensation. Introduce sterile bacteriostatic water gently along the inside glass wall. Swirl smoothly until fully dissolved; avoid vigorous vortexing to prevent mechanical shear of the peptide sequence.",
  },
  {
    question: "How long does the reconstituted peptide solution remain viable?",
    answer:
      "Once reconstituted with bacteriostatic water, store the vial refrigerated at 2°C to 8°C. For optimal analytical fidelity, solutions should be utilized within 21 to 28 days. Avoid repeated freeze-thaw cycles.",
  },
  {
    question: "What analytical testing confirms the purity of this batch?",
    answer:
      "Analytical documentation is published per lot on our Certificates page when a certificate is available for a product. Where no certificate is listed for this product, no testing results have been published for it.",
  },
  {
    question: "What is the guaranteed analytical purity threshold?",
    answer:
      "Amino Based guarantees a minimum analytical purity threshold of ≥99.0%. Where a lot-specific certificate has been published for a product, the figure recorded on that certificate is shown on the product page.",
  },
  {
    question: "Is a lot-specific Certificate of Analysis (COA) accessible?",
    answer:
      "Each vial label displays a lot number. Where a certificate has been published for a product, it can be viewed and downloaded from our Certificates page (/certificates).",
  },
  {
    question: "Is this compound approved for human, clinical, or veterinary use?",
    answer:
      "No. All peptide formulations provided by Amino Based are strictly synthesized for laboratory research, in-vitro investigations, cell culture assays, and analytical calibration only. They are not intended for diagnostic, clinical, therapeutic, or in-vivo administration.",
  },
  {
    question: "What does the stated vial dosage (mg) represent?",
    answer:
      "The indicated quantity (e.g., 5mg, 10mg) represents the net peptide content. The lyophilized powder cake may include trace counter-ions and analytical lyophilization stabilizers to protect peptide integrity during vacuum sealing.",
  },
  {
    question: "What temperature-control measures are used during transit?",
    answer:
      "Orders ship directly from our United States laboratory facility in insulated protective packaging with cold-packs. Lyophilized peptides possess high solid-state thermodynamic stability during domestic transit.",
  },
  {
    question: "Are volume discounts and institutional purchase orders supported?",
    answer:
      "Yes. We partner with academic departments, biotechnology firms, and contract research organizations (CROs). For volume quotes, custom lot reservations, and institutional invoicing, contact our institutional support desk at orders@aminobased.com.",
  },
];

export default function ProductClient({
  product,
  cardProduct,
  relatedProducts,
  reviewsSlot,
}: {
  product: ShopProduct;
  cardProduct: ShopMockProduct;
  relatedProducts: ShopMockProduct[];
  relatedPosts?: ProductRelatedPost[];
  reviewsSlot?: React.ReactNode;
}) {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedDosage, setSelectedDosage] = useState(
    cardProduct.dosageOptions && cardProduct.dosageOptions.length > 0
      ? cardProduct.dosageOptions[0]
      : "Standard"
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedMessage, setAddedMessage] = useState(false);

  // Accordion states for the right column overview
  const [openRightAccordions, setOpenRightAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    shipping: false,
    reviews: false,
  });

  const toggleRightAccordion = (key: string) => {
    setOpenRightAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Accordion states for the technical dossier section (Details, Research, Quality, Compliance)
  const [openDossierAccordions, setOpenDossierAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    research: false,
    quality: false,
    compliance: false,
  });

  const toggleDossierAccordion = (key: string) => {
    setOpenDossierAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mvConfig = getMultiVariantConfig(cardProduct.slug || cardProduct.name);
  const displayDetails = getProductDisplayDetails(cardProduct, selectedDosage);

  const activePrice = displayDetails.price;
  // Resolved through lib/products/productImage.ts so a Prime Time Bio Labs photograph stored
  // against this product can never reach the gallery, and so the dosage on a local vial
  // photograph matches the variant the visitor has selected.
  const activeImage = resolveProductImageUrl({
    name: cardProduct.name,
    slug: cardProduct.slug,
    dosage: selectedDosage,
    dbImageUrl: displayDetails.image || cardProduct.image,
  });
  const {
    isWishlisted,
    isPending: wishlistPending,
    toggle: toggleWishlist,
  } = useWishlistToggle({
    id: displayDetails.sku,
    aliases: [displayDetails.sku, cardProduct.id, cardProduct.slug],
    variantSku: selectedDosage,
    price: activePrice,
  });

  // Construct gallery images (main active image + variant thumbnails)
  const galleryImages =
    displayDetails.galleryImages && displayDetails.galleryImages.length > 0
      ? displayDetails.galleryImages
      : [
          activeImage,
          "/assets/vial_glp3rt.png",
          "/assets/vial_glp2tz.png",
          "/assets/vial_bpc157.png",
        ];

  const currentMainImage = galleryImages[selectedImageIndex] || activeImage;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addItem(
      {
        id: displayDetails.sku,
        name: cardProduct.name,
        imageUrl: activeImage,
        slug: cardProduct.slug,
      },
      selectedDosage,
      quantity,
      activePrice,
      selectedDosage
    );
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addItem(
      {
        id: displayDetails.sku,
        name: cardProduct.name,
        imageUrl: activeImage,
        slug: cardProduct.slug,
      },
      selectedDosage,
      quantity,
      activePrice,
      selectedDosage
    );
    window.location.href = "/checkout";
  };

  const coaUrl = resolveMediaUrl(product.coaFile);

  // COA facts come from the product record or are not shown at all. These were hardcoded to a
  // single fabricated lot number, purity figure and testing-confirmation line that rendered
  // on every product regardless of whether any certificate existed. A batch number, a purity
  // figure and a testing method are claims about a real assay, so each is displayed only when
  // the data backs it, and the method is never inferred — the schema records no test method,
  // so none is asserted.
  const coaBatchNumber =
    typeof product.coaBatchNumber === "string" && product.coaBatchNumber.trim().length > 0
      ? product.coaBatchNumber.trim()
      : null;
  const coaPurity = typeof product.coaPurity === "number" ? product.coaPurity : null;

  // Content for Details, Research, Quality, Compliance
  const dossierDetails = {
    detailsTitle: product.productDetailsTitle || "Product Details & Characterization",
    detailsContent:
      product.productDetailsDescription ||
      `Every batch of ${cardProduct.name} is synthesized via automated solid-phase peptide synthesis (SPPS) and lyophilized under high-vacuum cryogenic conditions. The compound is hermetically sealed in Type-1 borosilicate glass vials with PTFE-coated butyl stoppers to eliminate moisture permeability. Each vial features a printed lot identifier for complete analytical traceability. Prior to reconstitution, store in a laboratory freezer at -20°C.`,
    
    researchTitle: product.researchFocusTitle || "Research Focus & Biological Pathways",
    researchContent:
      product.researchFocusDescription ||
      `This compound is synthesized strictly for in-vitro biochemical assays, receptor kinetics, cell culture investigations, and cellular pathway characterization. It is not for human or animal consumption. Researchers are advised to observe standard institutional biosafety Level 1/2 protocols, appropriate personal protective equipment (PPE), and proper chemical disposal practices.`,
    
    qualityTitle: product.qualityPurityTitle || "Quality & Analytical Testing Standards",
    qualityContent:
      product.qualityPurityDescription ||
      `Where a lot-specific Certificate of Analysis has been published for this product, it is available from the Certificates page and any purity figure shown here is taken from that certificate. Where no certificate is published, no analytical results are claimed for this lot.`,
    
    complianceTitle: product.complianceNoticeTitle || "Research Compliance & Regulatory Notice",
    complianceContent:
      product.complianceNoticeDescription ||
      `For Laboratory Research Use Only (RUO). This product is not a drug, cosmetic, food, or medical device and has not been evaluated by the United States Food and Drug Administration (FDA). Sale is restricted strictly to qualified laboratories, researchers, and scientific institutions. Not for therapeutic or diagnostic procedures.`,
  };

  // Combine product FAQs with the 10 detailed research FAQs
  const combinedFaqs =
    product.faqs && product.faqs.length >= 10 ? product.faqs : PRODUCT_TEN_FAQS;

  return (
    <main className="min-h-screen bg-white text-[#0F0F11]">
      <div className="pt-24 sm:pt-28 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. BREADCRUMBS (CENTERED ELEGANT SANS-SERIF MATCHING REFERENCE)           */}
        {/* ========================================================================= */}
        <div className="text-center mb-8 sm:mb-10">
          <nav className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#71717A] tracking-normal">
            <Link href="/" className="hover:text-[#031B4E] transition-colors">
              Home
            </Link>
            <span className="text-[#A1A1AA]">/</span>
            <Link href="/shop" className="hover:text-[#031B4E] transition-colors">
              Collections
            </Link>
            <span className="text-[#A1A1AA]">/</span>
            <Link
              href={`/shop?category=${encodeURIComponent(cardProduct.category || "All")}`}
              className="hover:text-[#031B4E] transition-colors"
            >
              {cardProduct.category || "Research Peptides"}
            </Link>
            <span className="text-[#A1A1AA]">/</span>
            <span className="text-[#071739] font-medium">{cardProduct.name}</span>
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN PRODUCT SECTION (2-COLUMN REFERENCE LAYOUT)                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start mb-16 sm:mb-20">
          
          {/* Left Column: Big Main Image Container + Row of 4 Thumbnails */}
          <div>
            {/* Main Featured Image Container - Pure image filling frame with zero added border or inner margins */}
            <div className="relative aspect-square w-full rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-xs group">
              {cardProduct.featured && (
                <span className="absolute top-5 left-5 z-10 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-white bg-[#031B4E] rounded-full shadow-xs">
                  Featured
                </span>
              )}
              <Image
                src={currentMainImage}
                alt={cardProduct.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Row of 4 Thumbnails directly below main image */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-4">
              {galleryImages.slice(0, 4).map((imgSrc, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      if (mvConfig && mvConfig.dosageOptions[idx]) {
                        setSelectedDosage(mvConfig.dosageOptions[idx]);
                      }
                    }}
                    className={`relative aspect-square rounded-[14px] overflow-hidden transition-all flex items-center justify-center ${
                      isSelected
                        ? "ring-2 ring-[#031B4E] shadow-xs opacity-100"
                        : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`${cardProduct.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Title, Price, Dual Buttons & Accordions */}
          <div className="flex flex-col pt-1">
            
            {/* Title & Price Header Row (Matching reference: Serif Title on Left, Serif Price on Right) */}
            <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-7">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#071739] font-normal tracking-tight leading-tight">
                {cardProduct.name}
              </h1>

              <div className="text-right shrink-0">
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#071739] font-light">
                  ${activePrice.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Specification / Dosage Pill Selector */}
            {cardProduct.dosageOptions && cardProduct.dosageOptions.length > 1 && (
              <div className="mb-6 sm:mb-7">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#71717A]">
                    Specification / Size
                  </span>
                  {/* Subtle Quantity Selector beside specs */}
                  <div className="inline-flex items-center border border-[#E2E8F0] rounded-md overflow-hidden bg-white h-8 sm:h-8.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#031B4E]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs sm:text-sm font-semibold text-[#071739]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#031B4E]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {cardProduct.dosageOptions.map((dosage) => (
                    <button
                      key={dosage}
                      type="button"
                      onClick={() => setSelectedDosage(dosage)}
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wider border transition-all ${
                        selectedDosage === dosage
                          ? "bg-[#031B4E] border-[#031B4E] text-white shadow-2xs"
                          : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#031B4E]/40 hover:text-[#071739]"
                      }`}
                    >
                      {dosage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dual Action Buttons Row: [ ADD TO CART ] [ BUY NOW ] */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mb-8 sm:mb-9">
              {/* Button 1: Solid ADD TO CART */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`h-12 sm:h-[52px] rounded-lg text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 ${
                  addedMessage
                    ? "bg-emerald-600 text-white"
                    : "bg-[#031B4E] hover:bg-[#07266E] text-white"
                }`}
              >
                {addedMessage ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>

              {/* Button 2: Clean Outline BUY NOW */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="h-12 sm:h-[52px] rounded-lg border border-[#071739] text-[#071739] hover:bg-[#071739]/5 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center active:scale-98"
              >
                Buy Now
              </button>
            </div>

            {/* Right Column Accordions (Description, Shipping, Reviews) */}
            <div className="border-t border-[#E4E4E7]/80 divide-y divide-[#E4E4E7]/80">
              
              {/* Accordion: Description */}
              <div className="py-4.5 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleRightAccordion("description")}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                    Description
                  </span>
                  <span className="text-sm font-light text-[#71717A] w-5 text-center">
                    {openRightAccordions.description ? "—" : "+"}
                  </span>
                </button>
                {openRightAccordions.description && (
                  <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed space-y-3">
                    <p>{cardProduct.description}</p>
                    <ul className="space-y-2 pt-1 pl-1 text-[#475569]">
                      {cardProduct.purity && (
                        <li className="flex items-center gap-2">
                          <span className="text-[#031B4E] font-bold">•</span>
                          <span>{cardProduct.purity}</span>
                        </li>
                      )}
                      {coaUrl && (
                        <li className="flex items-center gap-2">
                          <span className="text-[#031B4E] font-bold">•</span>
                          <span>Certificate of Analysis (COA) available for download</span>
                        </li>
                      )}
                      <li className="flex items-center gap-2">
                        <span className="text-[#031B4E] font-bold">•</span>
                        <span>Physical State: Lyophilized solid powder in sealed borosilicate vial</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#031B4E] font-bold">•</span>
                        <span>Storage: Store at -20°C prior to reconstitution</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion: Shipping */}
              <div className="py-4.5 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleRightAccordion("shipping")}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                    Shipping
                  </span>
                  <span className="text-sm font-light text-[#71717A] w-5 text-center">
                    {openRightAccordions.shipping ? "—" : "+"}
                  </span>
                </button>
                {openRightAccordions.shipping && (
                  <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed space-y-2">
                    <p>
                      Orders placed before 2:00 PM EST ship same-day via temperature-regulated expedited carrier directly from our United States facility.
                    </p>
                    <p>
                      All vials are packed in insulated protective enclosures with cold-packs to preserve chemical integrity during transit.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion: Reviews */}
              <div className="py-4.5 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleRightAccordion("reviews")}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                    Reviews
                  </span>
                  <span className="text-sm font-light text-[#71717A] w-5 text-center">
                    {openRightAccordions.reviews ? "—" : "+"}
                  </span>
                </button>
                {openRightAccordions.reviews && (
                  <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                    {reviewsSlot || (
                      <p className="text-sm text-gray-500">
                        Verified customer ratings & laboratory evaluation reviews.
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. LABORATORY DOSSIER & CONTENT SECTION (DETAILS, RESEARCH, QUALITY, RUO)  */}
        {/*    (JUST ABOVE "YOU MAY ALSO LIKE" WITH THE SAME ACCORDION DESIGN)        */}
        {/* ========================================================================= */}
        <section className="max-w-5xl mx-auto mb-16 sm:mb-20">
          
          {/* Section Header */}
          <div className="mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#1C427B] block mb-1">
              Technical Dossier
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071739]">
              Laboratory Specifications & Research Information
            </h2>
          </div>

          {/* Accordion Group matching the exact design of Description, Shipping, Reviews */}
          <div className="border-t border-b border-[#E4E4E7]/80 divide-y divide-[#E4E4E7]/80">
            
            {/* 1. Details */}
            <div className="py-4.5 sm:py-5">
              <button
                type="button"
                onClick={() => toggleDossierAccordion("details")}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                  {dossierDetails.detailsTitle}
                </span>
                <span className="text-sm font-light text-[#71717A] w-5 text-center">
                  {openDossierAccordions.details ? "—" : "+"}
                </span>
              </button>
              {openDossierAccordions.details && (
                <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                  <p>{dossierDetails.detailsContent}</p>
                </div>
              )}
            </div>

            {/* 2. Research */}
            <div className="py-4.5 sm:py-5">
              <button
                type="button"
                onClick={() => toggleDossierAccordion("research")}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                  {dossierDetails.researchTitle}
                </span>
                <span className="text-sm font-light text-[#71717A] w-5 text-center">
                  {openDossierAccordions.research ? "—" : "+"}
                </span>
              </button>
              {openDossierAccordions.research && (
                <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                  <p>{dossierDetails.researchContent}</p>
                </div>
              )}
            </div>

            {/* 3. Quality */}
            <div className="py-4.5 sm:py-5">
              <button
                type="button"
                onClick={() => toggleDossierAccordion("quality")}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                  {dossierDetails.qualityTitle}
                </span>
                <span className="text-sm font-light text-[#71717A] w-5 text-center">
                  {openDossierAccordions.quality ? "—" : "+"}
                </span>
              </button>
              {openDossierAccordions.quality && (
                <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed space-y-3">
                  <p>{dossierDetails.qualityContent}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mt-2">
                    <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-[#071739]">
                      {coaBatchNumber && (
                        <span>
                          Batch: <strong className="text-[#031B4E]">{coaBatchNumber}</strong>
                        </span>
                      )}
                      {coaPurity !== null && (
                        <span>
                          Purity: <strong className="text-emerald-700">{coaPurity}%</strong>
                        </span>
                      )}
                    </div>
                    {coaUrl ? (
                      <a
                        href={coaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#031B4E] hover:underline"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Download COA PDF</span>
                      </a>
                    ) : (
                      <Link
                        href="/certificates"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#031B4E] hover:underline"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Verify Lot Online &rarr;</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Compliance */}
            <div className="py-4.5 sm:py-5">
              <button
                type="button"
                onClick={() => toggleDossierAccordion("compliance")}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-sm sm:text-base font-semibold text-[#071739] group-hover:text-[#031B4E] transition-colors">
                  {dossierDetails.complianceTitle}
                </span>
                <span className="text-sm font-light text-[#71717A] w-5 text-center">
                  {openDossierAccordions.compliance ? "—" : "+"}
                </span>
              </button>
              {openDossierAccordions.compliance && (
                <div className="pt-3.5 pb-1 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                  <p>{dossierDetails.complianceContent}</p>
                </div>
              )}
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. FULL-WIDTH HORIZONTAL DIVIDER MATCHING REFERENCE                       */}
        {/* ========================================================================= */}
        <hr className="border-t border-[#E4E4E7]/70 my-16 sm:my-20" />

        {/* ========================================================================= */}
        {/* 5. "YOU MAY ALSO LIKE" SECTION (EXACT REFERENCE 4-COLUMN CARDS)           */}
        {/* ========================================================================= */}
        <section className="mb-20 sm:mb-28">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#071739] tracking-tight text-center mb-10 sm:mb-14">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group flex flex-col items-center text-center cursor-pointer"
              >
                {/* Pure image rounded card container matching reference with zero added borders */}
                <div className="relative w-full aspect-[3/4] rounded-[20px] overflow-hidden shadow-xs group-hover:shadow-md transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Centered Product Title below image (uppercase matching reference) */}
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#071739] group-hover:text-[#031B4E] transition-colors mt-4">
                  {item.name}
                </h3>

                {/* Centered Price below title */}
                <p className="font-serif text-sm font-normal text-[#64748B] mt-1">
                  ${item.price.toFixed(0)}
                </p>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* 6. PRODUCT FAQS SECTION (EXACT HOMEPAGE 2-COLUMN FAQ DESIGN, 10 FAQS)     */}
      {/* ========================================================================= */}
      <FAQSection
        badgeText="Product Inquiries & Guidelines"
        title={
          <>
            Frequently asked <br />
            questions
          </>
        }
        faqs={combinedFaqs.slice(0, 10)}
        calloutTitle="Still have a questions?"
        calloutText="Can't find the answer to your research inquiry? Contact our scientific support team for lot verifications, reconstitution protocols, or COAs."
        calloutButtonText="Send email"
        calloutButtonLink="/contact-us"
      />

      {/* Unified Footer with halfway-cut blurred lowercase wordmark */}
      <Footer />
    </main>
  );
}
