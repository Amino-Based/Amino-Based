// Single source of truth for the Amino Based FAQ Hub
// Contains all 7 categories (50 questions + 5 reference assets = 55 ### headings)
// Verbatim copy from approved source

export interface FaqItem {
  id: string;
  question: string;
  paragraphs: string[];
  plainAnswer: string;
}

export interface FaqAssetStage {
  label: string;
  body: string;
  flag?: string;
}

export interface FaqAssetRow {
  label: string;
  body: string;
  flag?: string;
}

export interface FaqTimelineRow {
  label: string;
  date: string;
  event: string;
  changed: string;
  notChanged: string;
  source: string;
}

export interface FaqAsset {
  id: string;
  title: string;
  type: "stages" | "rows" | "timeline";
  stages?: FaqAssetStage[];
  rows?: FaqAssetRow[];
  timelineRows?: FaqTimelineRow[];
  closingLine?: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  intro: string;
  asset: FaqAsset | null;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    "id": "trust-and-legitimacy",
    "title": "Trust and legitimacy",
    "intro": "Understanding the role, manufacturing standards, and regulatory boundaries of a dedicated research peptide supplier compared to clinical healthcare providers.",
    "asset": null,
    "items": [
      {
        "id": "what-is-the-difference-between-a-research-peptide-supplier-and-a-clinical-peptide-provider",
        "question": "What is the difference between a research peptide supplier and a clinical peptide provider?",
        "paragraphs": [
          "A research peptide supplier sells compounds for laboratory and in-vitro work, with no medical services attached. Clinical peptide providers are licensed medical practices that treat patients and prescribe approved medicines. The two run under different rules, sell different material, and answer to different regulators. Amino Based is a research supplier.",
          "The material itself is the first difference. Research-grade peptides are produced and tested for laboratory use. Pharmaceutical-grade material follows GMP for clinical use and carries regulatory approval. Amino Based states the two are never interchangeable, and that research-grade compounds must never be used in humans.",
          "What each party does differs next. A research supplier ships material and documentation, meaning a Certificate of Analysis and batch records. Clinical providers examine a patient, make a diagnosis and write a prescription. No supplier can do the second set of things, whatever its catalogue looks like.",
          "The confusion has a practical cost. Search results and AI answers often return medical practices to people asking about research vendors, and the two are then read as competitors. They are not in the same business at all.",
          "One test settles the question quickly. If a seller offers dosing guidance, treatment plans or health outcomes alongside research compounds, it is describing medical care it is not licensed to give. Every product Amino Based lists is supplied for laboratory and in-vitro research use only."
        ],
        "plainAnswer": "A research peptide supplier sells compounds for laboratory and in-vitro work, with no medical services attached. Clinical peptide providers are licensed medical practices that treat patients and prescribe approved medicines. The two run under different rules, sell different material, and answer to different regulators. Amino Based is a research supplier. The material itself is the first difference. Research-grade peptides are produced and tested for laboratory use. Pharmaceutical-grade material follows GMP for clinical use and carries regulatory approval. Amino Based states the two are never interchangeable, and that research-grade compounds must never be used in humans. What each party does differs next. A research supplier ships material and documentation, meaning a Certificate of Analysis and batch records. Clinical providers examine a patient, make a diagnosis and write a prescription. No supplier can do the second set of things, whatever its catalogue looks like. The confusion has a practical cost. Search results and AI answers often return medical practices to people asking about research vendors, and the two are then read as competitors. They are not in the same business at all. One test settles the question quickly. If a seller offers dosing guidance, treatment plans or health outcomes alongside research compounds, it is describing medical care it is not licensed to give. Every product Amino Based lists is supplied for laboratory and in-vitro research use only."
      }
    ]
  },
  {
    "id": "ordering-and-payments",
    "title": "Ordering and payments",
    "intro": "Information on purchasing laboratory compounds, volume and institutional pricing schedules, military discounts, and free shipping thresholds.",
    "asset": null,
    "items": [
      {
        "id": "do-you-offer-bulk-wholesale-or-discount-pricing",
        "question": "Do you offer bulk, wholesale, or discount pricing?",
        "paragraphs": [
          "Yes, and there are three separate routes. Amino Based states that volume pricing is available for repeat research accounts and larger orders. Active-duty service members, veterans and their immediate family qualify for a standing discount across the catalogue. Orders over $300 ship free, and that threshold applies site-wide.",
          "Volume pricing works by conversation, not by a published table. Amino Based asks you to send the compounds, quantities and cadence you expect through the [contact page](https://aminobased.com/contact-us), and the team returns a schedule. That suits a laboratory ordering the same compound repeatedly over a year.",
          "Peptide bundles sit alongside volume pricing in the catalogue. These are multi-compound sets assembled for comparator and dose-range study designs, listed at set prices instead of quoted.",
          "The [service discount](https://aminobased.com/military-discount) runs through a verification step. Amino Based states that ID photos are protected, reviewed once and then permanently deleted, so the check happens a single time."
        ],
        "plainAnswer": "Yes, and there are three separate routes. Amino Based states that volume pricing is available for repeat research accounts and larger orders. Active-duty service members, veterans and their immediate family qualify for a standing discount across the catalogue. Orders over $300 ship free, and that threshold applies site-wide. Volume pricing works by conversation, not by a published table. Amino Based asks you to send the compounds, quantities and cadence you expect through the contact page, and the team returns a schedule. That suits a laboratory ordering the same compound repeatedly over a year. Peptide bundles sit alongside volume pricing in the catalogue. These are multi-compound sets assembled for comparator and dose-range study designs, listed at set prices instead of quoted. The service discount runs through a verification step. Amino Based states that ID photos are protected, reviewed once and then permanently deleted, so the check happens a single time."
      }
    ]
  },
  {
    "id": "shipping-and-delivery",
    "title": "Shipping and delivery",
    "intro": "Orders leave the facility within one to three business days of payment confirmation, in plain unmarked packaging, with tracking following by email. Temperature-sensitive material travels insulated with coolant. This section covers dispatch timing, tracking, packaging and what to do when a delivery goes wrong. Several shipping details are set at checkout instead of published, and those are flagged where they arise.",
    "asset": {
      "id": "how-an-order-moves",
      "title": "How an order moves",
      "type": "stages",
      "stages": [
        {
          "label": "Stage 1. Payment confirmed.",
          "body": "Your order is accepted and queued for dispatch. Payment must be received in full before an order is processed and shipped."
        },
        {
          "label": "Stage 2. Processing and dispatch.",
          "body": "One to three business days for catalogue products. Custom synthesis takes longer, and that timing is communicated when the order is placed."
        },
        {
          "label": "Stage 3. Packaging.",
          "body": "Plain, unmarked outer packaging with no reference to the contents. Temperature-sensitive products travel in insulated packaging and, where necessary, with cold packs."
        },
        {
          "label": "Stage 4. Tracking issued.",
          "body": "A confirmation email carries tracking information once the order ships. Order status also appears in your account dashboard."
        },
        {
          "label": "Stage 5. In transit.",
          "body": "Standard and expedited services are offered at checkout. Estimated delivery times vary by destination and service, and both appear at checkout before you complete the order."
        },
        {
          "label": "Stage 6. Delivered.",
          "body": "Refrigerate or freeze on arrival, per the storage guidance supplied with each product."
        },
        {
          "label": "Stage 7. Something went wrong.",
          "body": "Damaged, defective or incorrect items go through support within 7 days of delivery, with your order number and photos. For a delivery that has not arrived inside its estimated window, contact support and the team works with the carrier."
        },
        {
          "label": "Stage 8. Lost package.",
          "body": "",
          "flag": "item 8. No time threshold is published for when a package is treated as lost, and no reship or refund rule is published either. This row is the asset's weakest point and the category's biggest opportunity."
        }
      ]
    },
    "items": [
      {
        "id": "how-long-does-shipping-take",
        "question": "How long does shipping take?",
        "paragraphs": [
          "Orders are typically processed and dispatched within one to three business days of payment confirmation. Delivery time after that depends on the service you select. Standard and expedited options appear at checkout, with estimated delivery times shown by destination before you complete the order. Custom synthesis needs longer, quoted per project. Shipping is free on orders over $300.",
          "No single delivery figure is published, because the estimate is generated at checkout from your destination and chosen service. That is where to look for a date, not in a policy page.",
          "Dispatch and delivery are worth separating when an order feels slow. The one to three business day window covers only the time before the package leaves. Everything after that belongs to the carrier and the service level you chose.",
          "<!-- OWNER FACT NEEDED: item 6. Carriers used and published delivery timeframes by service. A site-wide banner publishes free shipping on orders over $300; beyond that, rates are set at checkout. Naming the carriers would let this answer give real ranges instead of pointing at checkout. -->"
        ],
        "plainAnswer": "Orders are typically processed and dispatched within one to three business days of payment confirmation. Delivery time after that depends on the service you select. Standard and expedited options appear at checkout, with estimated delivery times shown by destination before you complete the order. Custom synthesis needs longer, quoted per project. Shipping is free on orders over $300. No single delivery figure is published, because the estimate is generated at checkout from your destination and chosen service. That is where to look for a date, not in a policy page. Dispatch and delivery are worth separating when an order feels slow. The one to three business day window covers only the time before the package leaves. Everything after that belongs to the carrier and the service level you chose."
      },
      {
        "id": "when-will-i-get-my-tracking-number-what-if-my-tracking-isnt-updating",
        "question": "When will I get my tracking number? What if my tracking isn't updating?",
        "paragraphs": [
          "A confirmation email carrying tracking information goes out once your order ships. Order status is also visible in your account dashboard, so the email is not the only route to it. Tracking that has not appeared after the dispatch window has passed is worth raising with support directly.",
          "Tracking that stops updating is a different situation from tracking that never arrived. Carrier scans can pause for a day or two in normal transit, particularly over weekends and holidays.",
          "No guidance on stalled tracking is currently published. The practical step is to compare the last scan against the estimated delivery window shown at checkout. Once that window has passed, contact support through the [contact page](https://aminobased.com/contact-us)."
        ],
        "plainAnswer": "A confirmation email carrying tracking information goes out once your order ships. Order status is also visible in your account dashboard, so the email is not the only route to it. Tracking that has not appeared after the dispatch window has passed is worth raising with support directly. Tracking that stops updating is a different situation from tracking that never arrived. Carrier scans can pause for a day or two in normal transit, particularly over weekends and holidays. No guidance on stalled tracking is currently published. The practical step is to compare the last scan against the estimated delivery window shown at checkout. Once that window has passed, contact support through the contact page."
      },
      {
        "id": "how-discreet-is-the-packaging",
        "question": "How discreet is the packaging?",
        "paragraphs": [
          "All orders ship in plain, unmarked outer packaging with no reference to the contents on the exterior. Amino Based states this is to protect your privacy. Nothing on the outside identifies the product, the category or the nature of the business inside the parcel.",
          "Discretion stops at the outer packaging, which is the part visible in transit and on a doorstep. The Certificate of Analysis and any product documentation travel inside with the order."
        ],
        "plainAnswer": "All orders ship in plain, unmarked outer packaging with no reference to the contents on the exterior. Amino Based states this is to protect your privacy. Nothing on the outside identifies the product, the category or the nature of the business inside the parcel. Discretion stops at the outer packaging, which is the part visible in transit and on a doorstep. The Certificate of Analysis and any product documentation travel inside with the order."
      },
      {
        "id": "my-package-is-delayed-is-it-considered-late",
        "question": "My package is delayed. Is it considered late?",
        "paragraphs": [
          "A delivery counts as late once it passes the estimated delivery window shown at checkout for your destination and service. Before that point, a slow scan is usually normal transit. After it, contact support through the [contact page](https://aminobased.com/contact-us) and the team works with the carrier to locate the shipment.",
          "The estimated window is the reference point, and it is generated per order. That is why no universal day count appears anywhere on the site.",
          "What follows a report is described as locating the shipment or arranging a resolution. The specific remedy is decided case by case at present."
        ],
        "plainAnswer": "A delivery counts as late once it passes the estimated delivery window shown at checkout for your destination and service. Before that point, a slow scan is usually normal transit. After it, contact support through the contact page and the team works with the carrier to locate the shipment. The estimated window is the reference point, and it is generated per order. That is why no universal day count appears anywhere on the site. What follows a report is described as locating the shipment or arranging a resolution. The specific remedy is decided case by case at present."
      },
      {
        "id": "my-package-arrived-damaged-or-with-missing-or-wrong-items-what-do-i-do",
        "question": "My package arrived damaged or with missing or wrong items. What do I do?",
        "paragraphs": [
          "Contact support within 7 days of delivery through the [contact page](https://aminobased.com/contact-us), including your order number and photos of the issue. The same route covers damaged, defective and incorrect items. Once the issue is verified, Amino Based arranges a replacement or refund at no additional cost to you.",
          "Photographs carry most of the weight in this process. A clear image of the vial label, the batch number and the outer packaging lets the team confirm what shipped against what was ordered.",
          "Damage after delivery sits outside this route. Product damaged through improper storage or handling once it reaches you is named as non-refundable in the [refund policy](https://aminobased.com/refund-policy)."
        ],
        "plainAnswer": "Contact support within 7 days of delivery through the contact page, including your order number and photos of the issue. The same route covers damaged, defective and incorrect items. Once the issue is verified, Amino Based arranges a replacement or refund at no additional cost to you. Photographs carry most of the weight in this process. A clear image of the vial label, the batch number and the outer packaging lets the team confirm what shipped against what was ordered. Damage after delivery sits outside this route. Product damaged through improper storage or handling once it reaches you is named as non-refundable in the refund policy."
      },
      {
        "id": "do-peptides-need-cold-or-ice-pack-shipping",
        "question": "Do peptides need cold or ice-pack shipping?",
        "paragraphs": [
          "Temperature-sensitive products ship in insulated packaging and, where necessary, with cold packs. Lyophilised peptides travel dry in insulated packaging with coolant and move on expedited services. Amino Based recommends refrigerating or freezing products immediately on arrival, per the storage guidance supplied with each product.",
          "Lyophilised material is more forgiving in transit than material in solution. Short ambient periods are tolerated, which is what makes standard parcel shipping workable for dry powder.",
          "The handover is the part worth planning. Packaging protects the vial in transit, and storage protects it afterwards, so a parcel left sitting after delivery loses the benefit of both."
        ],
        "plainAnswer": "Temperature-sensitive products ship in insulated packaging and, where necessary, with cold packs. Lyophilised peptides travel dry in insulated packaging with coolant and move on expedited services. Amino Based recommends refrigerating or freezing products immediately on arrival, per the storage guidance supplied with each product. Lyophilised material is more forgiving in transit than material in solution. Short ambient periods are tolerated, which is what makes standard parcel shipping workable for dry powder. The handover is the part worth planning. Packaging protects the vial in transit, and storage protects it afterwards, so a parcel left sitting after delivery loses the benefit of both."
      },
      {
        "id": "what-happens-if-my-package-is-lost-when-do-you-reship-or-refund",
        "question": "What happens if my package is lost? When do you reship or refund?",
        "paragraphs": [
          "Contact support through the [contact page](https://aminobased.com/contact-us) if your order has not arrived within its estimated delivery window. The team then works with the carrier to locate the shipment or arrange a resolution. No day threshold is currently published for when a package is treated as lost, and no automatic reship or refund rule is published either.",
          "Tracking is the first thing to check. An old final scan combined with an expired delivery window is the signal to make contact instead of waiting longer.",
          "What happens next is handled case by case at present. A published rule would let you know in advance whether a reship or a refund follows, and how long the carrier claim takes.",
          "<!-- OWNER FACT NEEDED: item 8. The day threshold, and what follows it. This is the single highest-value unpublished fact across the whole hub, and no competitor publishes it either. -->"
        ],
        "plainAnswer": "Contact support through the contact page if your order has not arrived within its estimated delivery window. The team then works with the carrier to locate the shipment or arrange a resolution. No day threshold is currently published for when a package is treated as lost, and no automatic reship or refund rule is published either. Tracking is the first thing to check. An old final scan combined with an expired delivery window is the signal to make contact instead of waiting longer. What happens next is handled case by case at present. A published rule would let you know in advance whether a reship or a refund follows, and how long the carrier claim takes."
      },
      {
        "id": "do-you-ship-internationally-do-you-ship-to-my-state",
        "question": "Do you ship internationally? Do you ship to my state?",
        "paragraphs": [
          "Amino Based states that orders ship within the regions listed at checkout, and the checkout is the only place those regions appear. No country or state list is published anywhere on the site. The shipping policy does address customs duties for international customers, which implies international service without confirming any destination.",
          "Checkout is therefore the only reliable check available to you today. Enter your address and the available services either appear or they do not.",
          "The customs language is worth reading if you are outside the United States. Amino Based states that international customers are responsible for duties, import taxes and their own country's rules on research chemical imports.",
          "<!-- OWNER FACT NEEDED: item 21. Served countries and any state restrictions. The shipping policy page needs the same fix, since it currently speaks to international customers without saying whether they can order. -->"
        ],
        "plainAnswer": "Amino Based states that orders ship within the regions listed at checkout, and the checkout is the only place those regions appear. No country or state list is published anywhere on the site. The shipping policy does address customs duties for international customers, which implies international service without confirming any destination. Checkout is therefore the only reliable check available to you today. Enter your address and the available services either appear or they do not. The customs language is worth reading if you are outside the United States. Amino Based states that international customers are responsible for duties, import taxes and their own country's rules on research chemical imports."
      },
      {
        "id": "can-i-change-my-shipping-address-after-ordering",
        "question": "Can I change my shipping address after ordering?",
        "paragraphs": [
          "No address-change policy is published on the site. Orders are typically dispatched within one to three business days. A change request needs to reach support quickly to land before the package leaves. Contact the team through the [contact page](https://aminobased.com/contact-us) with your order number.",
          "Once a parcel is with the carrier, redirection is a carrier question and not a policy question. Options at that point depend on the service used and what that carrier permits.",
          "Cancellation is a separate route with a published rule. An order that has not yet shipped can be cancelled for a full refund, under the [refund policy](https://aminobased.com/refund-policy).",
          "<!-- OWNER FACT NEEDED: item 10. Whether the shipping address can be changed after ordering, and up to what point. -->"
        ],
        "plainAnswer": "No address-change policy is published on the site. Orders are typically dispatched within one to three business days. A change request needs to reach support quickly to land before the package leaves. Contact the team through the contact page with your order number. Once a parcel is with the carrier, redirection is a carrier question and not a policy question. Options at that point depend on the service used and what that carrier permits. Cancellation is a separate route with a published rule. An order that has not yet shipped can be cancelled for a full refund, under the refund policy."
      }
    ]
  },
  {
    "id": "product-quality-and-coas",
    "title": "Product quality and COAs",
    "intro": "Every Amino Based batch goes to an independent laboratory before it ships, and a Certificate of Analysis travels with the order. What that document proves, and what it does not, decides how much weight it should carry in your records. This section covers purity standards, what a COA contains, and how research grade differs from pharmaceutical grade. It also covers where the site's own verification path currently falls short.",
    "asset": {
      "id": "what-a-certificate-of-analysis-does-and-does-not-prove",
      "title": "What a Certificate of Analysis does and does not prove",
      "type": "rows",
      "rows": [
        {
          "label": "Row 1. Identity.",
          "body": "Mass spectrometry confirms the molecule is the sequence named on the label. It does not establish that the compound performs any function, in a laboratory or anywhere else."
        },
        {
          "label": "Row 2. Purity.",
          "body": "HPLC reports the percentage of the sample that is the target compound. It does not establish sterility, endotoxin status by itself, or net peptide content. Net peptide content measures peptide mass against total vial mass and is a separate figure."
        },
        {
          "label": "Row 3. Specification versus result.",
          "body": "The specification is the floor the batch had to clear. The result is what the instrument measured. A specification of ≥98.0% with a result of 99.9% means the batch cleared its floor comfortably. Neither number is a promise about the next batch."
        },
        {
          "label": "Row 4. Endotoxin.",
          "body": "The COA reports a limit of ≤10 EU/mg. It establishes that the batch met that limit on testing. It does not establish sterility, and it says nothing about handling after the vial left the facility."
        },
        {
          "label": "Row 5. Traceability.",
          "body": "The batch number ties the vial to its own analysis. Amino Based states it keeps a chain-of-custody record linking the raw material lot, the synthesis run and the final vial count to that number. It does not establish that the vial in your hand is the one the record describes. A working lookup is what would let you check that."
        },
        {
          "label": "Row 6. Scope.",
          "body": "Testing describes the material as it left the facility. Storage, shipping conditions and handling after delivery sit outside the document entirely."
        }
      ]
    },
    "items": [
      {
        "id": "are-your-peptides-third-party-tested",
        "question": "Are your peptides third-party tested?",
        "paragraphs": [
          "Amino Based states that every batch is analysed by an independent laboratory using HPLC and mass spectrometry. HPLC measures purity and mass spectrometry confirms identity. A Certificate of Analysis for that batch ships with every order, carrying the purity result, the batch number and the analysis date.",
          "The two methods answer different questions, which is why both appear. Mass spectrometry establishes that the molecule is what the label says by measuring its mass. HPLC separates the sample and reports what proportion of it is the target compound.",
          "<!-- OWNER FACT NEEDED: item 15. The testing laboratory's name and any accreditation such as ISO/IEC 17025. The COA's laboratory field currently reads \"Verified Third-Party Laboratory\", which is a placeholder rather than an identifiable lab. Naming the lab is the single largest trust upgrade available to this category. -->"
        ],
        "plainAnswer": "Amino Based states that every batch is analysed by an independent laboratory using HPLC and mass spectrometry. HPLC measures purity and mass spectrometry confirms identity. A Certificate of Analysis for that batch ships with every order, carrying the purity result, the batch number and the analysis date. The two methods answer different questions, which is why both appear. Mass spectrometry establishes that the molecule is what the label says by measuring its mass. HPLC separates the sample and reports what proportion of it is the target compound."
      },
      {
        "id": "what-does-99-purity-actually-mean",
        "question": "What does 99% purity actually mean?",
        "paragraphs": [
          "Purity by HPLC reports what proportion of the sample is the target compound. Amino Based publishes a minimum of 99% purity by high-performance liquid chromatography as its standard. One observed Certificate of Analysis sets its release specification at ≥98.0%, with one recent certificate reporting 99.9%. Both numbers describe the same measurement at different thresholds.",
          "Specifications and results are worth separating. A specification is the floor a batch must clear to be released. A result is what the instrument actually measured on that batch. One recent certificate specifies ≥98.0% and reports 99.9%, which means the material cleared its floor by a wide margin.",
          "What the figure does not cover matters just as much. Purity by HPLC is not net peptide content, which measures how much of the vial's total mass is peptide rather than residual salts and water. It is not sterility, and it is not a safety finding of any kind."
        ],
        "plainAnswer": "Purity by HPLC reports what proportion of the sample is the target compound. Amino Based publishes a minimum of 99% purity by high-performance liquid chromatography as its standard. One observed Certificate of Analysis sets its release specification at ≥98.0%, with one recent certificate reporting 99.9%. Both numbers describe the same measurement at different thresholds. Specifications and results are worth separating. A specification is the floor a batch must clear to be released. A result is what the instrument actually measured on that batch. One recent certificate specifies ≥98.0% and reports 99.9%, which means the material cleared its floor by a wide margin. What the figure does not cover matters just as much. Purity by HPLC is not net peptide content, which measures how much of the vial's total mass is peptide rather than residual salts and water. It is not sterility, and it is not a safety finding of any kind."
      },
      {
        "id": "what-is-the-difference-between-hplc-and-mass-spectrometry",
        "question": "What is the difference between HPLC and mass spectrometry?",
        "paragraphs": [
          "HPLC separates a sample into its components and reports how much of it is the target compound, which gives you the purity percentage. Mass spectrometry measures molecular mass and confirms identity, meaning that the compound is the sequence named on the label. Amino Based states both run on every batch.",
          "Neither method substitutes for the other. A sample could be 99% one compound while that compound is the wrong one, which HPLC alone would not catch. Identity confirmed without a purity figure leaves the proportion of the target compound unknown.",
          "Both are analytical measurements on material as tested. Neither method addresses sterility, endotoxin levels, or how the material behaves in any application."
        ],
        "plainAnswer": "HPLC separates a sample into its components and reports how much of it is the target compound, which gives you the purity percentage. Mass spectrometry measures molecular mass and confirms identity, meaning that the compound is the sequence named on the label. Amino Based states both run on every batch. Neither method substitutes for the other. A sample could be 99% one compound while that compound is the wrong one, which HPLC alone would not catch. Identity confirmed without a purity figure leaves the proportion of the target compound unknown. Both are analytical measurements on material as tested. Neither method addresses sterility, endotoxin levels, or how the material behaves in any application."
      },
      {
        "id": "are-your-coas-batch-specific",
        "question": "Are your COAs batch-specific?",
        "paragraphs": [
          "Amino Based states that every order includes the Certificate of Analysis for its own batch. Certificates are archived, so the record stays available after purchase. Batch numbers are product-specific in format, as shown on the TB-500 product page, which ties a number to one product and one run.",
          "The archive matters for anyone keeping method records. A certificate that disappears when a product page changes is not usable for audit or method reporting six months later."
        ],
        "plainAnswer": "Amino Based states that every order includes the Certificate of Analysis for its own batch. Certificates are archived, so the record stays available after purchase. Batch numbers are product-specific in format, as shown on the TB-500 product page, which ties a number to one product and one run. The archive matters for anyone keeping method records. A certificate that disappears when a product page changes is not usable for audit or method reporting six months later."
      },
      {
        "id": "how-do-i-know-the-coa-matches-the-vial-i-received",
        "question": "How do I know the COA matches the vial I received?",
        "paragraphs": [
          "Match the batch number printed on your vial against the batch number on the certificate that came with your order. That pairing is what ties the document to the material in front of you. Amino Based states it maintains a chain-of-custody record for each batch.",
          "That record links the raw material lot, the synthesis run and the final vial count to one batch number. It is the stronger claim of the two, because it covers the whole path, not just the final document. What it means in practice is that one batch number should resolve to one synthesis run and a known vial count."
        ],
        "plainAnswer": "Match the batch number printed on your vial against the batch number on the certificate that came with your order. That pairing is what ties the document to the material in front of you. Amino Based states it maintains a chain-of-custody record for each batch. That record links the raw material lot, the synthesis run and the final vial count to one batch number. It is the stronger claim of the two, because it covers the whole path, not just the final document. What it means in practice is that one batch number should resolve to one synthesis run and a known vial count."
      },
      {
        "id": "how-do-i-verify-a-coa",
        "question": "How do I verify a COA?",
        "paragraphs": [
          "Read the document you were sent and check four fields against your vial. Those fields are the product name, the batch number, the purity result against its specification, and the analysis date. Verification beyond that is not currently possible from this site.",
          "What stops it is the certificate's laboratory field, which reads as a generic description instead of a named lab. There is no institution to check with. A named lab with a reference number you could quote is what independent verification requires.",
          "Retrieval is the second gap in the chain. The site describes more than one way to find a batch-specific certificate, and those descriptions do not agree with each other.",
          "<!-- OWNER FACT NEEDED: item 14. How a customer retrieves the certificate for a batch number they hold. The site currently describes three different methods across three pages, and none of them is written here because none can be confirmed as the working one. This is the most consequential gap in the category. -->"
        ],
        "plainAnswer": "Read the document you were sent and check four fields against your vial. Those fields are the product name, the batch number, the purity result against its specification, and the analysis date. Verification beyond that is not currently possible from this site. What stops it is the certificate's laboratory field, which reads as a generic description instead of a named lab. There is no institution to check with. A named lab with a reference number you could quote is what independent verification requires. Retrieval is the second gap in the chain. The site describes more than one way to find a batch-specific certificate, and those descriptions do not agree with each other."
      },
      {
        "id": "what-is-an-acceptable-purity-level-for-research-peptides",
        "question": "What is an acceptable purity level for research peptides?",
        "paragraphs": [
          "Acceptable depends on the work, not on a universal threshold. Analytical and quantitative methods generally demand tighter purity than qualitative screening does. Amino Based publishes a minimum of 99% by HPLC as its standard. One observed certificate sets its release specification at ≥98.0%. Sufficiency is a judgement that belongs to your method.",
          "Two figures often get conflated at this point. HPLC purity describes the proportion of the sample that is the target compound. Net peptide content describes how much of the vial's mass is peptide at all, with the remainder typically counterions, residual solvent and water.",
          "For quantitative work the second figure is often the one that matters, since it determines how much peptide is actually present. A certificate reporting only HPLC purity leaves that question open.",
          "<!-- OWNER FACT NEEDED: items 14 and 15. A named laboratory and a single working retrieval method would let this answer become the numbered walkthrough the brief specifies. Until both exist, promising verification the site cannot deliver would be worse than stating the limit. -->"
        ],
        "plainAnswer": "Acceptable depends on the work, not on a universal threshold. Analytical and quantitative methods generally demand tighter purity than qualitative screening does. Amino Based publishes a minimum of 99% by HPLC as its standard. One observed certificate sets its release specification at ≥98.0%. Sufficiency is a judgement that belongs to your method. Two figures often get conflated at this point. HPLC purity describes the proportion of the sample that is the target compound. Net peptide content describes how much of the vial's mass is peptide at all, with the remainder typically counterions, residual solvent and water. For quantitative work the second figure is often the one that matters, since it determines how much peptide is actually present. A certificate reporting only HPLC purity leaves that question open."
      },
      {
        "id": "can-i-send-a-sample-for-independent-testing-myself",
        "question": "Can I send a sample for independent testing myself?",
        "paragraphs": [
          "Nothing prevents you from sending material to a laboratory of your choosing, and Amino Based states it supplies batch documentation and COA archives on request. Independent testing is the strongest form of verification available to a buyer. Method and sample handling drive the result, so a mismatch is not automatically a finding.",
          "Several ordinary differences produce different numbers. Laboratories use different HPLC methods, columns and gradients. Sample handling between delivery and testing introduces its own variables, particularly for material that has been reconstituted.",
          "If your result diverges meaningfully from the certificate, contact support with your order number, your batch number and your laboratory's report through the [contact page](https://aminobased.com/contact-us). The [refund policy](https://aminobased.com/refund-policy) covers material that does not match its documentation within 7 days of delivery."
        ],
        "plainAnswer": "Nothing prevents you from sending material to a laboratory of your choosing, and Amino Based states it supplies batch documentation and COA archives on request. Independent testing is the strongest form of verification available to a buyer. Method and sample handling drive the result, so a mismatch is not automatically a finding. Several ordinary differences produce different numbers. Laboratories use different HPLC methods, columns and gradients. Sample handling between delivery and testing introduces its own variables, particularly for material that has been reconstituted. If your result diverges meaningfully from the certificate, contact support with your order number, your batch number and your laboratory's report through the contact page. The refund policy covers material that does not match its documentation within 7 days of delivery."
      },
      {
        "id": "what-is-the-difference-between-research-grade-and-pharmaceutical-grade-peptides",
        "question": "What is the difference between research-grade and pharmaceutical-grade peptides?",
        "paragraphs": [
          "Research-grade material is produced and tested for laboratory use. Pharmaceutical-grade material follows GMP for clinical use and carries regulatory approval. Amino Based states the two are never interchangeable and that research-grade compounds must never be used in humans. Everything sold here is research grade.",
          "The difference is a whole regulatory apparatus, not a purity number. Pharmaceutical grade means an approved product, a validated manufacturing process, and an FDA-reviewed label describing a specific use. A research compound has none of those regardless of how clean its chromatography looks.",
          "This is the distinction that most often gets lost. A high purity figure describes what is in the vial. Approval describes what a regulator has evaluated and permitted, and no purity result substitutes for it."
        ],
        "plainAnswer": "Research-grade material is produced and tested for laboratory use. Pharmaceutical-grade material follows GMP for clinical use and carries regulatory approval. Amino Based states the two are never interchangeable and that research-grade compounds must never be used in humans. Everything sold here is research grade. The difference is a whole regulatory apparatus, not a purity number. Pharmaceutical grade means an approved product, a validated manufacturing process, and an FDA-reviewed label describing a specific use. A research compound has none of those regardless of how clean its chromatography looks. This is the distinction that most often gets lost. A high purity figure describes what is in the vial. Approval describes what a regulator has evaluated and permitted, and no purity result substitutes for it."
      },
      {
        "id": "do-you-offer-custom-synthesis",
        "question": "Do you offer custom synthesis?",
        "paragraphs": [
          "Yes, Amino Based takes custom synthesis requests. Send your target sequence, required purity threshold and quantity, along with any modifications such as amidation, acetylation or conjugation. The team returns a quotation with a projected timeline. Custom synthesis carries longer processing than catalogue products, and that timing is communicated when the order is placed.",
          "Two things follow from custom work that differ from a catalogue order. Processing time is quoted per project and falls outside the standard 1 to 3 business day dispatch window. Custom and made-to-order synthesis is also non-refundable unless it arrives defective, under the [refund policy](https://aminobased.com/refund-policy).",
          "Institutional buyers have a separate path worth knowing. Amino Based states it supplies purchase orders, W-9 forms, batch documentation and COA archives on request, which covers most procurement requirements."
        ],
        "plainAnswer": "Yes, Amino Based takes custom synthesis requests. Send your target sequence, required purity threshold and quantity, along with any modifications such as amidation, acetylation or conjugation. The team returns a quotation with a projected timeline. Custom synthesis carries longer processing than catalogue products, and that timing is communicated when the order is placed. Two things follow from custom work that differ from a catalogue order. Processing time is quoted per project and falls outside the standard 1 to 3 business day dispatch window. Custom and made-to-order synthesis is also non-refundable unless it arrives defective, under the refund policy. Institutional buyers have a separate path worth knowing. Amino Based states it supplies purchase orders, W-9 forms, batch documentation and COA archives on request, which covers most procurement requirements."
      }
    ]
  },
  {
    "id": "storage-and-handling",
    "title": "Storage and handling",
    "intro": "Peptides arrive from Amino Based as lyophilised powder in sealed vials, packed in insulated containers with coolant. What happens after that vial reaches your bench decides whether the material still matches its Certificate of Analysis six months later. This section covers temperatures, shelf life, transit conditions and the physical signs worth checking on arrival. Everything here is chemical-handling information for laboratory materials.",
    "asset": {
      "id": "storage-reference",
      "title": "Storage reference",
      "type": "rows",
      "rows": [
        {
          "label": "Row 1.",
          "body": "Lyophilised, sealed, unopened. −20°C. Away from light and moisture. Stable for 24 months or longer. Assumes an unbroken seal, no moisture ingress, and no repeated warming and refreezing."
        },
        {
          "label": "Row 2.",
          "body": "Lyophilised, in transit. Ambient. Insulated packaging with coolant, as shipped. Short periods tolerated without loss of integrity. Assumes days rather than weeks, and packaging left sealed until arrival."
        },
        {
          "label": "Row 3.",
          "body": "Lyophilised, on arrival. Refrigerate or freeze immediately. Per the guidance supplied with each product. Returns to the Row 1 figure once at −20°C. Assumes prompt transfer rather than an extended bench stay."
        },
        {
          "label": "Row 4.",
          "body": "Reconstituted. 2–8°C, refrigerated (per published product-page guidance). Stability drops considerably after solvent is added, and the figure varies by sequence, solvent and temperature.",
          "flag": "item 22, shelf life"
        }
      ]
    },
    "items": [
      {
        "id": "how-do-i-store-peptides-freezer-or-fridge-for-lyophilized-peptides",
        "question": "How do I store peptides? Freezer or fridge for lyophilized peptides?",
        "paragraphs": [
          "Store unopened lyophilised vials at −20°C, away from light and moisture. A freezer, not a fridge, is the reference condition Amino Based publishes for long-term stability. Short ambient periods during transit do not compromise integrity. On arrival, refrigerate or freeze promptly rather than leaving vials on the bench.",
          "The distinction matters because the two temperatures serve different purposes. A domestic freezer at roughly −20°C is the long-term condition, and it is what the 24-month stability figure assumes. Refrigeration handles the short gap between delivery and transfer, and the [shipping policy](https://aminobased.com/shipping-policy) directs exactly that.",
          "Light and moisture do as much damage as temperature. Keep vials in their original packaging, sealed, and avoid repeated cycles of warming and refreezing. Each cycle is an opportunity for condensation to reach the powder."
        ],
        "plainAnswer": "Store unopened lyophilised vials at −20°C, away from light and moisture. A freezer, not a fridge, is the reference condition Amino Based publishes for long-term stability. Short ambient periods during transit do not compromise integrity. On arrival, refrigerate or freeze promptly rather than leaving vials on the bench. The distinction matters because the two temperatures serve different purposes. A domestic freezer at roughly −20°C is the long-term condition, and it is what the 24-month stability figure assumes. Refrigeration handles the short gap between delivery and transfer, and the shipping policy directs exactly that. Light and moisture do as much damage as temperature. Keep vials in their original packaging, sealed, and avoid repeated cycles of warming and refreezing. Each cycle is an opportunity for condensation to reach the powder."
      },
      {
        "id": "what-does-lyophilized-mean-why-does-it-arrive-as-powder",
        "question": "What does lyophilized mean? Why does it arrive as powder?",
        "paragraphs": [
          "Lyophilisation is freeze-drying. The peptide is frozen, then the water is removed under vacuum, leaving a dry solid. Amino Based ships every peptide in this form, sealed in vials, because dry material holds its structure far longer than material sitting in solution.",
          "Water is what drives most degradation pathways in a peptide. Remove it and the reactions that break peptide bonds slow dramatically. That single fact explains the whole format, and it explains why the published stability figure for sealed lyophilised material runs to 24 months or longer while reconstituted material is measured in far shorter spans.",
          "The powder itself can look different from vial to vial. A fluffy cake, a thin film on the glass, or a small compact pellet are all normal outcomes of the drying process. Appearance alone says nothing about purity, which is what the [Certificate of Analysis](https://aminobased.com/certificates) records."
        ],
        "plainAnswer": "Lyophilisation is freeze-drying. The peptide is frozen, then the water is removed under vacuum, leaving a dry solid. Amino Based ships every peptide in this form, sealed in vials, because dry material holds its structure far longer than material sitting in solution. Water is what drives most degradation pathways in a peptide. Remove it and the reactions that break peptide bonds slow dramatically. That single fact explains the whole format, and it explains why the published stability figure for sealed lyophilised material runs to 24 months or longer while reconstituted material is measured in far shorter spans. The powder itself can look different from vial to vial. A fluffy cake, a thin film on the glass, or a small compact pellet are all normal outcomes of the drying process. Appearance alone says nothing about purity, which is what the Certificate of Analysis records."
      },
      {
        "id": "my-peptide-didnt-fully-dissolve-or-looks-cloudy-is-it-bad",
        "question": "My peptide didn't fully dissolve or looks cloudy. Is it bad?",
        "paragraphs": [
          "Cloudiness or incomplete dissolution is a physical observation, not a purity measurement. Every Amino Based batch is tested by an independent laboratory to a minimum of 99% purity by HPLC, with mass spectrometry confirming identity. Check the batch number on your vial against its certificate before drawing any conclusion.",
          "Several ordinary causes produce a cloudy solution. Solvent choice matters, since some sequences dissolve poorly in certain diluents. Agitation matters too, and forcing dissolution by shaking can denature material rather than help it. Temperature at the time of mixing plays a part as well.",
          "What a Certificate of Analysis covers is identity and purity in the vial as tested. It does not certify behaviour in any particular solvent, and it does not cover handling after the vial left the facility. If the material genuinely does not match its certificate, the [refund policy](https://aminobased.com/refund-policy) covers that case within 7 days of delivery."
        ],
        "plainAnswer": "Cloudiness or incomplete dissolution is a physical observation, not a purity measurement. Every Amino Based batch is tested by an independent laboratory to a minimum of 99% purity by HPLC, with mass spectrometry confirming identity. Check the batch number on your vial against its certificate before drawing any conclusion. Several ordinary causes produce a cloudy solution. Solvent choice matters, since some sequences dissolve poorly in certain diluents. Agitation matters too, and forcing dissolution by shaking can denature material rather than help it. Temperature at the time of mixing plays a part as well. What a Certificate of Analysis covers is identity and purity in the vial as tested. It does not certify behaviour in any particular solvent, and it does not cover handling after the vial left the facility. If the material genuinely does not match its certificate, the refund policy covers that case within 7 days of delivery."
      },
      {
        "id": "what-happens-if-you-dont-refrigerate-peptides",
        "question": "What happens if you don't refrigerate peptides?",
        "paragraphs": [
          "Lyophilised material tolerates short ambient periods without losing integrity, which is why vials survive transit in insulated packaging with coolant. Extended time at room temperature is a different matter, and it erodes the 24-month stability figure that assumes storage at −20°C. Degradation is gradual rather than instant.",
          "No published figure exists for how long is too long, because the answer depends on the sequence, the ambient temperature and the humidity. Treating a few days in transit as acceptable and a few weeks on a bench as not is the practical reading of the guidance.",
          "Degraded material does not announce itself. A vial that spent a month warm can look identical to one stored correctly, which is why storage records matter more than visual inspection in a laboratory setting."
        ],
        "plainAnswer": "Lyophilised material tolerates short ambient periods without losing integrity, which is why vials survive transit in insulated packaging with coolant. Extended time at room temperature is a different matter, and it erodes the 24-month stability figure that assumes storage at −20°C. Degradation is gradual rather than instant. No published figure exists for how long is too long, because the answer depends on the sequence, the ambient temperature and the humidity. Treating a few days in transit as acceptable and a few weeks on a bench as not is the practical reading of the guidance. Degraded material does not announce itself. A vial that spent a month warm can look identical to one stored correctly, which is why storage records matter more than visual inspection in a laboratory setting."
      },
      {
        "id": "what-is-the-shelf-life-of-lyophilized-versus-reconstituted-research-peptides",
        "question": "What is the shelf life of lyophilized versus reconstituted research peptides?",
        "paragraphs": [
          "Sealed at −20°C, away from light and moisture, lyophilised research peptides generally remain stable for 24 months or longer. Reconstituted material behaves differently once solvent is added. Stability drops considerably, and the useful window depends on the specific sequence, the solvent used and the storage temperature.",
          "<!-- OWNER FACT NEEDED: item 22. The reconstituted shelf-life timeframe Amino Based stands behind. Product pages publish 2–8°C refrigerated as the temperature, so only the duration remains unpublished. -->",
          "The gap between the two states is the single most consequential thing in this category. Dry material is measured in years. Material in solution is measured in far less, and any figure quoted for it carries assumptions about sequence and solvent that a general number cannot hold. Always confirm against your own stability data for the compound you are working with."
        ],
        "plainAnswer": "Sealed at −20°C, away from light and moisture, lyophilised research peptides generally remain stable for 24 months or longer. Reconstituted material behaves differently once solvent is added. Stability drops considerably, and the useful window depends on the specific sequence, the solvent used and the storage temperature. The gap between the two states is the single most consequential thing in this category. Dry material is measured in years. Material in solution is measured in far less, and any figure quoted for it carries assumptions about sequence and solvent that a general number cannot hold. Always confirm against your own stability data for the compound you are working with."
      },
      {
        "id": "how-fragile-are-reconstituted-peptides",
        "question": "How fragile are reconstituted peptides?",
        "paragraphs": [
          "They are more fragile than the lyophilised form by a wide margin. Adding solvent restarts the hydrolysis pathways that freeze-drying shut down, and the rate depends on sequence, solvent and temperature. Mechanical handling matters too, since vigorous agitation can denature material that gentle mixing would leave intact.",
          "<!-- OWNER FACT NEEDED: item 22. A published reconstituted holding window would let this answer give a concrete limit rather than a direction. The 2–8°C refrigeration temperature is now published on product pages. -->",
          "Three variables drive the outcome, and none of them is visible. Sequence composition determines which bonds are vulnerable. Solvent choice and pH determine how fast those bonds break. Temperature scales the whole process.",
          "What this means in practice is that reconstituted material is working stock rather than storage stock. The [storage reference above](#storage-reference) treats the two states separately for that reason."
        ],
        "plainAnswer": "They are more fragile than the lyophilised form by a wide margin. Adding solvent restarts the hydrolysis pathways that freeze-drying shut down, and the rate depends on sequence, solvent and temperature. Mechanical handling matters too, since vigorous agitation can denature material that gentle mixing would leave intact. Three variables drive the outcome, and none of them is visible. Sequence composition determines which bonds are vulnerable. Solvent choice and pH determine how fast those bonds break. Temperature scales the whole process. What this means in practice is that reconstituted material is working stock rather than storage stock. The storage reference above treats the two states separately for that reason."
      },
      {
        "id": "is-the-30-day-rule-real",
        "question": "Is the 30-day rule real?",
        "paragraphs": [
          "It is convention rather than a measured constant. No single figure covers every peptide in solution, because stability varies by sequence, solvent and temperature. Amino Based publishes no 30-day figure, and treating a round number as a hard boundary substitutes a rule of thumb for actual stability data.",
          "<!-- OWNER FACT NEEDED: item 22. If the company stands behind a specific reconstituted window, this answer should name it and explain its assumptions rather than leaving the reader with convention alone. -->",
          "Round numbers spread because they are easy to remember, not because they were measured across a compound library. A short sequence in a cold, well-chosen solvent may hold longer. A sensitive sequence held warm may not reach the figure at all.",
          "The honest position is that stability data for your specific compound and solvent beats any general number. Where that data does not exist, the uncertainty is real and worth stating rather than papering over."
        ],
        "plainAnswer": "It is convention rather than a measured constant. No single figure covers every peptide in solution, because stability varies by sequence, solvent and temperature. Amino Based publishes no 30-day figure, and treating a round number as a hard boundary substitutes a rule of thumb for actual stability data. Round numbers spread because they are easy to remember, not because they were measured across a compound library. A short sequence in a cold, well-chosen solvent may hold longer. A sensitive sequence held warm may not reach the figure at all. The honest position is that stability data for your specific compound and solvent beats any general number. Where that data does not exist, the uncertainty is real and worth stating rather than papering over."
      },
      {
        "id": "can-i-freeze-a-reconstituted-vial",
        "question": "Can I freeze a reconstituted vial?",
        "paragraphs": [
          "Freezing is possible, though it introduces a cost the lyophilised form does not have. Each freeze and thaw cycle stresses material in solution, and repeated cycles compound the damage. Product pages publish 2–8°C refrigerated for reconstituted material. No freezing guidance is published, so no company figure covers this case at present.",
          "<!-- OWNER FACT NEEDED: item 22. Whether the company recommends freezing reconstituted material is unpublished. -->",
          "Aliquoting is the standard way laboratories reduce the cost. Dividing solution into single-use portions means thawing one portion rather than cycling the whole vial repeatedly. That is general laboratory practice for materials in solution, not a Amino Based instruction.",
          "Two things stay true regardless. Dry material at −20°C remains the stable form, and anything in solution is on a shorter clock. For questions about a specific compound, the [contact page](https://aminobased.com/contact-us) reaches the team directly."
        ],
        "plainAnswer": "Freezing is possible, though it introduces a cost the lyophilised form does not have. Each freeze and thaw cycle stresses material in solution, and repeated cycles compound the damage. Product pages publish 2–8°C refrigerated for reconstituted material. No freezing guidance is published, so no company figure covers this case at present. Aliquoting is the standard way laboratories reduce the cost. Dividing solution into single-use portions means thawing one portion rather than cycling the whole vial repeatedly. That is general laboratory practice for materials in solution, not a Amino Based instruction. Two things stay true regardless. Dry material at −20°C remains the stable form, and anything in solution is on a shorter clock. For questions about a specific compound, the contact page reaches the team directly."
      }
    ]
  },
  {
    "id": "returns-refunds-and-order-changes",
    "title": "Returns, refunds and order changes",
    "intro": "Two clocks run on every order, and the [refund policy](https://aminobased.com/refund-policy) does not run them the same length. Damaged or incorrect deliveries get 7 days from arrival. Unopened product you simply want to send back gets 14 days, and Amino Based requires authorisation first. Anything opened or reconstituted falls outside both. This section covers which clock applies and what the policy says happens once it starts.",
    "asset": {
      "id": "refund-timeline",
      "title": "Refund timeline",
      "type": "stages",
      "stages": [
        {
          "label": "Stage 1. Request.",
          "body": "You contact support through the [contact page](https://aminobased.com/contact-us) with your order number. The policy sets 14 days from delivery for unopened product, or 7 days for damaged, defective or incorrect items. Photos are required on the damage route."
        },
        {
          "label": "Stage 2. Authorisation.",
          "body": "Amino Based issues a Return Merchandise Authorization. The policy states that unauthorised returns will not be accepted or refunded, so nothing should ship before the RMA arrives.",
          "flag": "item 12, typical turnaround for RMA issue."
        },
        {
          "label": "Stage 3. Return and inspection.",
          "body": "You ship the product back and the team verifies its condition. The damage route skips this stage, since the policy settles those cases once photos verify the issue.",
          "flag": "item 12, inspection window."
        },
        {
          "label": "Stage 4. Refund issued.",
          "body": "Amino Based states that approved refunds are processed to your original payment method within 5 to 10 business days. The policy applies a restocking fee to unopened returns.",
          "flag": "item 12, restocking fee amount."
        },
        {
          "label": "Stage 5. Bank posting.",
          "body": "Your bank or card issuer posts the credit. This leg sits outside the company's control and varies by issuer.",
          "flag": "items 2 and 12, posting days by payment method."
        }
      ]
    },
    "items": [
      {
        "id": "do-you-offer-refunds-or-returns",
        "question": "Do you offer refunds or returns?",
        "paragraphs": [
          "Amino Based states that unopened, unused products in their original packaging may be eligible for return within 14 days of delivery. The policy does not accept returns of opened or used products, and a restocking fee applies to unopened returns. It asks you to request a Return Merchandise Authorization before sending anything back.",
          "The restriction follows from what these products are. Research material that has left controlled storage cannot be verified as unaltered, so a returned open vial carries no traceable handling history behind it.",
          "The [refund policy](https://aminobased.com/refund-policy) names four categories as non-refundable. Opened, reconstituted or used products qualify for none. Products damaged after delivery through improper storage or handling are excluded, as are custom or made-to-order synthesis requests unless defective. Shipping fees are also listed, except in cases of the company's error."
        ],
        "plainAnswer": "Amino Based states that unopened, unused products in their original packaging may be eligible for return within 14 days of delivery. The policy does not accept returns of opened or used products, and a restocking fee applies to unopened returns. It asks you to request a Return Merchandise Authorization before sending anything back. The restriction follows from what these products are. Research material that has left controlled storage cannot be verified as unaltered, so a returned open vial carries no traceable handling history behind it. The refund policy names four categories as non-refundable. Opened, reconstituted or used products qualify for none. Products damaged after delivery through improper storage or handling are excluded, as are custom or made-to-order synthesis requests unless defective. Shipping fees are also listed, except in cases of the company's error."
      },
      {
        "id": "can-i-cancel-or-modify-my-order",
        "question": "Can I cancel or modify my order?",
        "paragraphs": [
          "Amino Based states that orders may be cancelled for a full refund if they have not yet shipped. Once an order has shipped, the policy says it falls under the return terms instead. Since the shipping policy puts dispatch at one to three business days, the cancellation window is short.",
          "Custom synthesis runs on a different schedule, with processing time communicated at the time of order. That extends the window in one sense. Custom work is also named as non-refundable once made unless defective, which makes early cancellation the only clean exit.",
          "Modification is a narrower question than cancellation, and the published policy addresses cancellation only. Contacting support quickly is the practical move either way, since dispatch can happen the next business day.",
          "<!-- OWNER FACT NEEDED: item 10. Whether a shipping address can be changed after ordering, and up to what point. -->"
        ],
        "plainAnswer": "Amino Based states that orders may be cancelled for a full refund if they have not yet shipped. Once an order has shipped, the policy says it falls under the return terms instead. Since the shipping policy puts dispatch at one to three business days, the cancellation window is short. Custom synthesis runs on a different schedule, with processing time communicated at the time of order. That extends the window in one sense. Custom work is also named as non-refundable once made unless defective, which makes early cancellation the only clean exit. Modification is a narrower question than cancellation, and the published policy addresses cancellation only. Contacting support quickly is the practical move either way, since dispatch can happen the next business day."
      },
      {
        "id": "what-if-my-order-never-arrives",
        "question": "What if my order never arrives?",
        "paragraphs": [
          "The shipping policy asks you to contact support if your order has not arrived within its estimated delivery window. Amino Based states the team then works with the carrier to locate the shipment or arrange a resolution. No fixed day count is published for when a package is treated as lost.",
          "Tracking is the first place to look. Amino Based states that a confirmation email carries tracking information once an order ships, and that order status also appears in your account dashboard.",
          "Delivery windows are generated at checkout by destination and service level, so no single published figure covers them. If the last scan is old and that window has passed, the policy points you to the [contact page](https://aminobased.com/contact-us).",
          "<!-- OWNER FACT NEEDED: item 8. After how many days without carrier movement is a package treated as lost, and what follows: reship, refund, or carrier claim first? This is the single most valuable unpublished fact in the policy and shipping categories. -->"
        ],
        "plainAnswer": "The shipping policy asks you to contact support if your order has not arrived within its estimated delivery window. Amino Based states the team then works with the carrier to locate the shipment or arrange a resolution. No fixed day count is published for when a package is treated as lost. Tracking is the first place to look. Amino Based states that a confirmation email carries tracking information once an order ships, and that order status also appears in your account dashboard. Delivery windows are generated at checkout by destination and service level, so no single published figure covers them. If the last scan is old and that window has passed, the policy points you to the contact page."
      },
      {
        "id": "what-if-i-receive-the-wrong-item",
        "question": "What if I receive the wrong item?",
        "paragraphs": [
          "Amino Based asks you to make contact within 7 days of delivery through the [contact page](https://aminobased.com/contact-us), including your order number and photos of the issue. The policy applies the same window to damaged, defective and incorrect items. It states that a replacement or refund follows at no additional cost once the issue is verified.",
          "Photographs do most of the work here. A clear image of the vial label, the batch number and the outer packaging lets the team confirm what shipped against what was ordered.",
          "One case sits close to this and is worth naming. Material that does not match the batch details on its [Certificate of Analysis](https://aminobased.com/certificates) falls under the same 7-day route. It counts as a fulfilment error and not a change of mind."
        ],
        "plainAnswer": "Amino Based asks you to make contact within 7 days of delivery through the contact page, including your order number and photos of the issue. The policy applies the same window to damaged, defective and incorrect items. It states that a replacement or refund follows at no additional cost once the issue is verified. Photographs do most of the work here. A clear image of the vial label, the batch number and the outer packaging lets the team confirm what shipped against what was ordered. One case sits close to this and is worth naming. Material that does not match the batch details on its Certificate of Analysis falls under the same 7-day route. It counts as a fulfilment error and not a change of mind."
      },
      {
        "id": "do-you-offer-shipping-insurance",
        "question": "Do you offer shipping insurance?",
        "paragraphs": [
          "Amino Based publishes no separate shipping insurance product. What the policy offers instead is the damage route, giving you 7 days from delivery to report a damaged or incorrect order with photos. Shipping fees themselves are listed as non-refundable, except in cases of the company's error.",
          "Packaging is the first line of protection and it is not a policy at all. Amino Based states that temperature-sensitive products ship in insulated packaging with cold packs where necessary. All orders travel in plain, unmarked outer packaging with no reference to the contents.",
          "<!-- OWNER FACT NEEDED: item 8. What happens to a package lost instead of damaged, and whether customs seizure is treated separately, are both unpublished. -->"
        ],
        "plainAnswer": "Amino Based publishes no separate shipping insurance product. What the policy offers instead is the damage route, giving you 7 days from delivery to report a damaged or incorrect order with photos. Shipping fees themselves are listed as non-refundable, except in cases of the company's error. Packaging is the first line of protection and it is not a policy at all. Amino Based states that temperature-sensitive products ship in insulated packaging with cold packs where necessary. All orders travel in plain, unmarked outer packaging with no reference to the contents."
      },
      {
        "id": "how-long-do-refunds-take-to-appear",
        "question": "How long do refunds take to appear?",
        "paragraphs": [
          "Amino Based states that approved refunds are processed to your original payment method within 5 to 10 business days. That window covers the company issuing the refund. How long it then takes to post depends on your bank or card issuer. That second leg sits outside the company's control.",
          "Counting the two legs separately explains most refund anxiety. A refund issued on day 8 and posted by the bank on day 12 looks like a 12-day delay from the customer's chair. Only the first 8 days belong to the company.",
          "If the refund has not appeared after the stated window, the policy asks you to contact support."
        ],
        "plainAnswer": "Amino Based states that approved refunds are processed to your original payment method within 5 to 10 business days. That window covers the company issuing the refund. How long it then takes to post depends on your bank or card issuer. That second leg sits outside the company's control. Counting the two legs separately explains most refund anxiety. A refund issued on day 8 and posted by the bank on day 12 looks like a 12-day delay from the customer's chair. Only the first 8 days belong to the company. If the refund has not appeared after the stated window, the policy asks you to contact support."
      }
    ]
  },
  {
    "id": "legality-and-research-use",
    "title": "Legality and research use",
    "intro": "Three separate legal events sit behind the 2026 peptide headlines, and the market keeps treating them as one. Removal from a restricted category, an advisory committee vote, and an actual rule are not the same thing. The timeline below dates each one and names what it left unchanged. Every entry points to a primary government source you can open yourself.",
    "asset": {
      "id": "regulatory-timeline",
      "title": "Regulatory timeline",
      "type": "timeline",
      "timelineRows": [
        {
          "label": "Row 1",
          "date": "September 2023 through December 2024",
          "event": "FDA moved a group of widely compounded peptides into Category 2 of its interim 503A bulk drug substances list. It is the category for substances the agency determined raise significant safety concerns. BPC-157, TB-500, CJC-1295 and ipamorelin were among them, and they left licensed clinical supply chains within weeks. Reported counts vary across this window. Secretary Kennedy has asserted the figure was 19 peptides reclassified in September 2023.",
          "changed": "Compounding pharmacies operating under section 503A stopped preparing these substances. The significant safety risk designation gave FDA the basis for enforcement action against compounders who distributed them.",
          "notChanged": "Nothing about the research supply chain. Category placement governs pharmacy compounding, not laboratory materials sold for research use.",
          "source": "FDA, Bulk Drug Substances Nominated for Use in Compounding Under Section 503A, fda.gov"
        },
        {
          "label": "Row 2",
          "date": "February 27, 2026",
          "event": "HHS Secretary Robert F. Kennedy Jr. appeared on The Joe Rogan Experience. He signaled that the administration would move to make roughly 14 peptides more accessible through lawful compounding channels. He said he expected FDA to act within a couple of weeks so consumers could buy from ethical suppliers.",
          "changed": "The appearance changed nothing in law. A cabinet secretary stated an expectation on a podcast.",
          "notChanged": "It touched no category, no list, and no rule. FDA had published no updated list at that point, and reclassification would not have made any peptide an approved drug.",
          "source": "HHS public statements, hhs.gov. Coverage of the remarks appears at npr.org."
        },
        {
          "label": "Row 3",
          "date": "April 15 and 16, 2026",
          "event": "On 15 April 2026, FDA republished its interim 503A Bulks List with two changes, both following withdrawn nominations. The agency announced intent to remove twelve peptide bulk drug substances from Category 2 within seven calendar days. It also removed GHK-Cu for non-injectable routes from Category 1, a track Row 4 follows. A separate Federal Register notice, \"Pharmacy Compounding Advisory Committee; Notice of Meeting\", published 16 April 2026 as FR Doc. 2026-07361 under Docket No. FDA-2025-N-6895, formalized the advisory committee hearing for July 23 and 24, 2026.",
          "changed": "It started a seven-day clock on the Category 2 removals. It put seven of those substances on a hearing calendar.",
          "notChanged": "The removal rested on withdrawn nominations, not on a new safety finding. Removal from Category 2 does not make a bulk drug substance eligible for compounding under section 503A. The announcement did not place any of them in Category 1. The Federal Register notice scheduled the hearing and did not announce the removal.",
          "source": "Federal Register, FR Doc. 2026-07361, Docket No. FDA-2025-N-6895, federalregister.gov. FDA interim 503A Bulks List, fda.gov."
        },
        {
          "label": "Row 4",
          "date": "April 22, 2026",
          "event": "The twelve peptides came off Category 2. The group covered BPC-157, LL-37, Dihexa acetate, DSIP, Epitalon, injectable GHK-Cu, KPV, PEG-MGF, Melanotan II, MOTS-c, Semax and TB-500. GHK-Cu moved on two separate tracks that day, since the non-injectable form came off Category 1 at the same time, also for withdrawn nominations. That second part was then reversed. One nominator clarified on May 5, 2026 that it had intended to withdraw only its injectable nomination, and FDA added GHK-Cu, except for injectable routes, back into Category 1 in a document revision dated May 14, 2026.",
          "changed": "Eleven substances plus injectable GHK-Cu left the category FDA had used to signal significant safety risk in compounding. Non-injectable GHK-Cu spent roughly three weeks outside Category 1 before returning to it.",
          "notChanged": "The removed substances sat in an intermediate status, no longer flagged as high risk, and not explicitly permitted either. Category 1 is an under-evaluation bucket carrying interim enforcement discretion, so the GHK-Cu restoration is not approval and not placement on the 503A Bulks List. Both GHK-Cu routes still face PCAC review before the end of February 2027.",
          "source": "FDA, Updates to categories of substances nominated for the 503A bulk drug substances list, revised May 14, 2026, fda.gov"
        },
        {
          "label": "Row 5",
          "date": "July 23, 2026",
          "event": "The Pharmacy Compounding Advisory Committee met at FDA's White Oak campus in Silver Spring, Maryland. It took up BPC-157, KPV, TB-500 and MOTS-c, each in free base and acetate forms. All four substances drew favorable recommendations. BPC-157, KPV and TB-500 each passed 8 to 6 with one abstention, and MOTS-c passed 7 to 5 with two abstentions. The committee broke with FDA staff scientists, who had argued the data did not support addition.",
          "changed": "Four substances gained an advisory recommendation for the 503A Bulks List.",
          "notChanged": "The votes did not make any peptide an FDA-approved drug, and FDA is not bound by the panel.",
          "source": "FDA, Meeting of the Pharmacy Compounding Advisory Committee, July 23 and 24, 2026, fda.gov"
        },
        {
          "label": "Row 6",
          "date": "July 24, 2026",
          "event": "The committee heard Emideltide, also called DSIP, along with Epitalon and Semax. Emideltide failed 6 to 7 with one abstention. Epitalon and Semax were recommended, bringing the two-day total to six favorable recommendations out of seven substances reviewed.",
          "changed": "Six substances carried recommendations into FDA's compounding policy record. Only Emideltide failed to win a recommendation.",
          "notChanged": "The six are not listed in 21 CFR 216.23, and FDA issued no final determination. A favorable recommendation does not place a substance on the 503A Bulks List, and it does not change federal law.",
          "source": "21 CFR 216.23, ecfr.gov. FDA advisory committee meeting materials, fda.gov."
        },
        {
          "label": "Row 7",
          "date": "Status as of",
          "event": "FDA is expected to open notice-and-comment rulemaking on the recommended peptides, with some form of informal enforcement discretion anticipated in the interim. Published estimates of how long that takes differ. One legal analysis puts the cycle at eight to twelve months before 503A pharmacies hold unambiguous authority.",
          "changed": "As of this review, nothing has changed. No proposed rule had published.",
          "notChanged": "Enforcement discretion, if it arrives, is informal and carries less legal weight than completed rulemaking.",
          "source": "Federal Register, federalregister.gov. Check the docket for current status."
        },
        {
          "label": "Row 8",
          "date": "Before the end of February 2027",
          "event": "A second PCAC meeting is scheduled for the five substances not heard in July, namely Cathelicidin LL-37, Dihexa acetate, injectable GHK-Cu, PEG-MGF and Melanotan II.",
          "changed": "The meeting has not happened yet.",
          "notChanged": "A scheduled meeting sets no legal status. The same advisory-only limit applies to whatever it recommends.",
          "source": "FDA advisory committee calendar, fda.gov"
        }
      ],
      "closingLine": "Watch for an official FDA notice or a change to the regulation itself. Summaries that use approved, unbanned or legalized as shorthand collapse several distinct stages into one. Every product Amino Based sells is supplied for laboratory research use only, whatever happens in the compounding pathway."
    },
    "items": [
      {
        "id": "what-does-research-use-only-mean",
        "question": "What does \"research use only\" mean?",
        "paragraphs": [
          "Research use only means the material is sold for laboratory work, not for human or veterinary use. It is a statement about intended use, set by federal law on how products are marketed. The FDA treats a product marketed for human consumption without approval as a violation, whatever the label says.",
          "The phrase describes how material is offered for sale, and it grants no special legal permission. Federal law governs marketing claims. A product promoted for treating, preventing or curing anything in people meets the definition of a drug under the Federal Food, Drug, and Cosmetic Act. Selling an unapproved drug that way breaks that law, and a research use only label does not change the analysis. That part is settled law rather than interpretation.",
          "Company policy covers the rest. Amino Based ships every item for laboratory research, requires buyers to be 21 or older, and publishes no guidance on human use. Where a question crosses into what someone should do with a compound personally, the answer belongs with a licensed clinician."
        ],
        "plainAnswer": "Research use only means the material is sold for laboratory work, not for human or veterinary use. It is a statement about intended use, set by federal law on how products are marketed. The FDA treats a product marketed for human consumption without approval as a violation, whatever the label says. The phrase describes how material is offered for sale, and it grants no special legal permission. Federal law governs marketing claims. A product promoted for treating, preventing or curing anything in people meets the definition of a drug under the Federal Food, Drug, and Cosmetic Act. Selling an unapproved drug that way breaks that law, and a research use only label does not change the analysis. That part is settled law rather than interpretation. Company policy covers the rest. Amino Based ships every item for laboratory research, requires buyers to be 21 or older, and publishes no guidance on human use. Where a question crosses into what someone should do with a compound personally, the answer belongs with a licensed clinician."
      },
      {
        "id": "what-does-for-research-use-only-imply-about-safety-and-efficacy",
        "question": "What does \"for research use only\" imply about safety and efficacy?",
        "paragraphs": [
          "A research use only label carries no claim about safety or effectiveness in people. It signals intended use, and nothing more. None of these compounds is an FDA-approved drug, and approval is the process that evaluates a specific product, dose, indication and label. Purity testing on a vial says nothing about clinical outcomes.",
          "Two different things get confused here. Manufacturing quality is measurable, and a certificate of analysis reports identity and purity for a specific lot. Clinical benefit is a separate question, answered by controlled trials in people.",
          "Evidence for these compounds remains thin by that second standard. At the July 2026 advisory committee meeting, FDA staff scientists recommended against all seven peptides under review. One committee member, Brian Lee of the Keck School of Medicine at USC, said existing randomized data suggested BPC-157 may perform no better than placebo. Those are the agency's own position and a panelist's statement, and we report them rather than argue with them. Treat them as the current state of the evidence."
        ],
        "plainAnswer": "A research use only label carries no claim about safety or effectiveness in people. It signals intended use, and nothing more. None of these compounds is an FDA-approved drug, and approval is the process that evaluates a specific product, dose, indication and label. Purity testing on a vial says nothing about clinical outcomes. Two different things get confused here. Manufacturing quality is measurable, and a certificate of analysis reports identity and purity for a specific lot. Clinical benefit is a separate question, answered by controlled trials in people. Evidence for these compounds remains thin by that second standard. At the July 2026 advisory committee meeting, FDA staff scientists recommended against all seven peptides under review. One committee member, Brian Lee of the Keck School of Medicine at USC, said existing randomized data suggested BPC-157 may perform no better than placebo. Those are the agency's own position and a panelist's statement, and we report them rather than argue with them. Treat them as the current state of the evidence."
      },
      {
        "id": "why-wont-you-provide-dosing-or-usage-instructions",
        "question": "Why won't you provide dosing or usage instructions?",
        "paragraphs": [
          "Dosing and administration guidance would describe human use, and these products are not sold for human use. Providing it would contradict the research use only terms every order ships under. Amino Based supplies handling and storage information for laboratory materials instead. For anything involving a person, a licensed clinician is the right source.",
          "Identity is part of the problem too. FDA staff told the July 2026 committee they had encountered multiple materials sold as BPC-157 that contained different active molecules. No standardization exists across this market. Usage instructions written against that backdrop would be guesswork dressed as guidance.",
          "Storage and handling sit in a different category, and those we do publish. Temperature ranges, reconstitution chemistry and shelf life describe how a laboratory material behaves inside a vial. None of that tells anyone to put a compound into a person."
        ],
        "plainAnswer": "Dosing and administration guidance would describe human use, and these products are not sold for human use. Providing it would contradict the research use only terms every order ships under. Amino Based supplies handling and storage information for laboratory materials instead. For anything involving a person, a licensed clinician is the right source. Identity is part of the problem too. FDA staff told the July 2026 committee they had encountered multiple materials sold as BPC-157 that contained different active molecules. No standardization exists across this market. Usage instructions written against that backdrop would be guesswork dressed as guidance. Storage and handling sit in a different category, and those we do publish. Temperature ranges, reconstitution chemistry and shelf life describe how a laboratory material behaves inside a vial. None of that tells anyone to put a compound into a person."
      },
      {
        "id": "can-anyone-buy-research-only-peptides",
        "question": "Can anyone buy research-only peptides?",
        "paragraphs": [
          "No. Amino Based requires every buyer to be 21 or older, and the site runs an age gate before checkout. Orders ship only for laboratory research use. Beyond that company rule, certain buyers face separate restrictions that have nothing to do with us, and competitive athletes are the clearest example.",
          "Federal law is the first layer. These compounds are not FDA-approved drugs, and they are not scheduled under the Controlled Substances Act. Possession for research is therefore not a federal drug-scheduling question. That is the law as it stands, not an interpretation of it.",
          "State rules form a second layer and they differ. Some states regulate the sale and possession of unapproved substances more tightly than federal law does, and a few limit purchases by entity type. Check your own state's current rules rather than assuming a single national answer.",
          "Anti-doping rules form a third. The World Anti-Doping Agency lists BPC-157 under S0, its category for non-approved substances. Athletes subject to testing risk sanction regardless of how a product is labeled. USADA has issued the same warning. An athlete under a testing pool should treat that as disqualifying before anything else."
        ],
        "plainAnswer": "No. Amino Based requires every buyer to be 21 or older, and the site runs an age gate before checkout. Orders ship only for laboratory research use. Beyond that company rule, certain buyers face separate restrictions that have nothing to do with us, and competitive athletes are the clearest example. Federal law is the first layer. These compounds are not FDA-approved drugs, and they are not scheduled under the Controlled Substances Act. Possession for research is therefore not a federal drug-scheduling question. That is the law as it stands, not an interpretation of it. State rules form a second layer and they differ. Some states regulate the sale and possession of unapproved substances more tightly than federal law does, and a few limit purchases by entity type. Check your own state's current rules rather than assuming a single national answer. Anti-doping rules form a third. The World Anti-Doping Agency lists BPC-157 under S0, its category for non-approved substances. Athletes subject to testing risk sanction regardless of how a product is labeled. USADA has issued the same warning. An athlete under a testing pool should treat that as disqualifying before anything else."
      },
      {
        "id": "do-i-need-a-license-or-lab-affiliation-to-order",
        "question": "Do I need a license or lab affiliation to order?",
        "paragraphs": [
          "Federal law sets no licensing requirement for buying these specific compounds, because they are neither FDA-approved drugs nor scheduled controlled substances. No DEA registration applies. Institutional affiliation is a separate matter of company policy and state law, so check both before ordering.",
          "The absence of a license requirement is not permission for any particular use. It reflects where these substances sit in the regulatory structure, which is outside both the approved-drug pathway and the controlled-substance schedules. Nothing about that changes the research use only terms on every order.",
          "State law can add requirements that federal law does not. A handful of states impose their own conditions on who may purchase unapproved substances. FDA.gov covers the federal picture, and your state board or attorney general's office covers the rest.",
          "<!-- OWNER FACT NEEDED: item 20. Whether checkout collects any credential, institutional email, affiliation or attestation beyond what the terms already describe. The terms make order placement itself the attestation, and the Medical Disclaimer uses \"qualified professional\" self-representation language, so this answer stands as written unless checkout does more. Only a yes changes the copy. -->"
        ],
        "plainAnswer": "Federal law sets no licensing requirement for buying these specific compounds, because they are neither FDA-approved drugs nor scheduled controlled substances. No DEA registration applies. Institutional affiliation is a separate matter of company policy and state law, so check both before ordering. The absence of a license requirement is not permission for any particular use. It reflects where these substances sit in the regulatory structure, which is outside both the approved-drug pathway and the controlled-substance schedules. Nothing about that changes the research use only terms on every order. State law can add requirements that federal law does not. A handful of states impose their own conditions on who may purchase unapproved substances. FDA.gov covers the federal picture, and your state board or attorney general's office covers the rest."
      },
      {
        "id": "are-peptides-legal-to-buy-in-the-us-in-2026",
        "question": "Are peptides legal to buy in the US in 2026?",
        "paragraphs": [
          "Buying research peptides for laboratory use is not prohibited by federal law in 2026. These compounds are not FDA-approved drugs, and they are not controlled substances. What federal law does regulate is marketing. A product sold for human use without approval violates the Federal Food, Drug, and Cosmetic Act, and individual states add their own conditions.",
          "The regulatory news of 2026 concerned pharmacy compounding, not the research market. On April 22, 2026, FDA removed twelve peptides from Category 2 of its interim 503A list. On July 23 and 24, an advisory committee recommended six of seven reviewed substances for the 503A Bulks List. Neither event touched how laboratory materials are sold, and neither made any peptide an approved drug.",
          "Legality turns on purpose rather than on the molecule. The same vial is a laboratory material when sold for research and an unapproved drug when marketed for treating people. That distinction is where enforcement happens.",
          "State law is the layer buyers most often overlook. Requirements differ, and a few states regulate unapproved substances more tightly than federal law does. Check your own state's current position rather than relying on a single national answer."
        ],
        "plainAnswer": "Buying research peptides for laboratory use is not prohibited by federal law in 2026. These compounds are not FDA-approved drugs, and they are not controlled substances. What federal law does regulate is marketing. A product sold for human use without approval violates the Federal Food, Drug, and Cosmetic Act, and individual states add their own conditions. The regulatory news of 2026 concerned pharmacy compounding, not the research market. On April 22, 2026, FDA removed twelve peptides from Category 2 of its interim 503A list. On July 23 and 24, an advisory committee recommended six of seven reviewed substances for the 503A Bulks List. Neither event touched how laboratory materials are sold, and neither made any peptide an approved drug. Legality turns on purpose rather than on the molecule. The same vial is a laboratory material when sold for research and an unapproved drug when marketed for treating people. That distinction is where enforcement happens. State law is the layer buyers most often overlook. Requirements differ, and a few states regulate unapproved substances more tightly than federal law does. Check your own state's current position rather than relying on a single national answer."
      },
      {
        "id": "what-are-the-regulations-surrounding-the-purchase-of-research-peptides-in-the-us",
        "question": "What are the regulations surrounding the purchase of research peptides in the US?",
        "paragraphs": [
          "Three frameworks matter. The Federal Food, Drug, and Cosmetic Act defines what counts as a drug and governs marketing claims. Section 503A of that Act governs pharmacy compounding, which is a separate pathway from research supply. State law adds its own requirements, and anti-doping rules bind athletes independently of all three.",
          "The compounding framework gets misread constantly. Section 503A concerns what licensed pharmacies may prepare for patients holding a valid prescription. Substances reach the 503A Bulks List through rulemaking, and the list itself appears at 21 CFR 216.23. None of that governs a research supplier or a laboratory buyer.",
          "Marketing rules do reach suppliers. A seller who promotes a product for treating, preventing or curing a condition in people has marketed a drug under federal law. Approval status then becomes the question, and none of these compounds has approval.",
          "Anti-doping rules operate on a separate track entirely. The World Anti-Doping Agency and USADA maintain their own prohibited lists. An athlete in a testing pool answers to those bodies regardless of what federal or state law permits."
        ],
        "plainAnswer": "Three frameworks matter. The Federal Food, Drug, and Cosmetic Act defines what counts as a drug and governs marketing claims. Section 503A of that Act governs pharmacy compounding, which is a separate pathway from research supply. State law adds its own requirements, and anti-doping rules bind athletes independently of all three. The compounding framework gets misread constantly. Section 503A concerns what licensed pharmacies may prepare for patients holding a valid prescription. Substances reach the 503A Bulks List through rulemaking, and the list itself appears at 21 CFR 216.23. None of that governs a research supplier or a laboratory buyer. Marketing rules do reach suppliers. A seller who promotes a product for treating, preventing or curing a condition in people has marketed a drug under federal law. Approval status then becomes the question, and none of these compounds has approval. Anti-doping rules operate on a separate track entirely. The World Anti-Doping Agency and USADA maintain their own prohibited lists. An athlete in a testing pool answers to those bodies regardless of what federal or state law permits."
      },
      {
        "id": "is-it-illegal-to-sell-research-peptides",
        "question": "Is it illegal to sell research peptides?",
        "paragraphs": [
          "Selling these compounds for laboratory research is not itself prohibited under federal law. Human use is a different matter. A product marketed to treat, prevent or cure anything in people is a drug under the Federal Food, Drug, and Cosmetic Act. Selling an unapproved drug that way violates the Act's unapproved new drug and misbranding provisions.",
          "FDA enforces against marketing conduct rather than against the molecule. Warning letters to sellers typically cite claims made on a website, in email, or across social accounts. The vial's contents may be identical in both cases. What differs is what the seller said about it.",
          "Testimony at the July 2026 advisory committee meeting described the alternative market plainly. One witness recounted a colleague photographing peptides for sale in a Queens bodega. FDA staff at the same meeting reported encountering multiple products sold as BPC-157 that contained different active molecules.",
          "Amino Based makes no human-use claims anywhere, publishes no dosing guidance, and ships every order under research use only terms. That is a company policy, and it also reflects where the legal line sits."
        ],
        "plainAnswer": "Selling these compounds for laboratory research is not itself prohibited under federal law. Human use is a different matter. A product marketed to treat, prevent or cure anything in people is a drug under the Federal Food, Drug, and Cosmetic Act. Selling an unapproved drug that way violates the Act's unapproved new drug and misbranding provisions. FDA enforces against marketing conduct rather than against the molecule. Warning letters to sellers typically cite claims made on a website, in email, or across social accounts. The vial's contents may be identical in both cases. What differs is what the seller said about it. Testimony at the July 2026 advisory committee meeting described the alternative market plainly. One witness recounted a colleague photographing peptides for sale in a Queens bodega. FDA staff at the same meeting reported encountering multiple products sold as BPC-157 that contained different active molecules. Amino Based makes no human-use claims anywhere, publishes no dosing guidance, and ships every order under research use only terms. That is a company policy, and it also reflects where the legal line sits."
      },
      {
        "id": "are-there-penalties-for-buying-or-selling-research-peptides-online-in-the-us",
        "question": "Are there penalties for buying or selling research peptides online in the US?",
        "paragraphs": [
          "Penalties fall mainly on sellers who market for human use. FDA enforcement tools include warning letters, injunctions, product seizure and referral for prosecution. For buyers, federal law sets no penalty for purchasing a non-scheduled, non-approved substance for research. Customs seizure and anti-doping sanctions are the realistic exposures instead.",
          "Enforcement history shows the pattern. FDA cited the Category 2 significant safety risk designation as the basis for action against compounders distributing those substances between 2023 and 2026. The trigger in each case was conduct, meaning what was prepared, sold, or claimed.",
          "Athletes carry a distinct risk that has no connection to FDA. A sanction under anti-doping rules follows a positive test or a possession finding, and it arrives from a sporting body rather than a court.",
          "These are general-information answers about a regulatory picture that is moving. They are not legal advice. For your own situation, FDA.gov covers the federal position and a qualified attorney covers the rest."
        ],
        "plainAnswer": "Penalties fall mainly on sellers who market for human use. FDA enforcement tools include warning letters, injunctions, product seizure and referral for prosecution. For buyers, federal law sets no penalty for purchasing a non-scheduled, non-approved substance for research. Customs seizure and anti-doping sanctions are the realistic exposures instead. Enforcement history shows the pattern. FDA cited the Category 2 significant safety risk designation as the basis for action against compounders distributing those substances between 2023 and 2026. The trigger in each case was conduct, meaning what was prepared, sold, or claimed. Athletes carry a distinct risk that has no connection to FDA. A sanction under anti-doping rules follows a positive test or a possession finding, and it arrives from a sporting body rather than a court. These are general-information answers about a regulatory picture that is moving. They are not legal advice. For your own situation, FDA.gov covers the federal position and a qualified attorney covers the rest."
      },
      {
        "id": "can-i-legally-import-research-peptides-for-personal-use-in-the-united-states",
        "question": "Can I legally import research peptides for personal use in the United States?",
        "paragraphs": [
          "FDA may refuse admission of unapproved drugs arriving from abroad, and Customs and Border Protection may detain or seize such shipments. No general right of personal importation covers these compounds. FDA's personal importation policy is enforcement discretion applied narrowly, not a legal entitlement, and it does not clear unapproved substances as a class.",
          "Domestic supply avoids the question entirely. Amino Based operates in the United States and ships from here.",
          "<!-- OWNER FACT NEEDED: item 21. Shipping scope. The shipping policy says orders ship \"within the regions listed at checkout\" and addresses international customers on customs duties, without naming a destination. If shipping is domestic only, say so plainly here. If international, name the destinations and note that the buyer is responsible for their own country's import rules. The shipping policy page needs the same fix. -->",
          "Buyers importing from overseas suppliers take on the identity problem as well as the customs problem. The standardization gap FDA described in July 2026 applies with more force to unverified foreign sources. A batch-matched certificate of analysis from a named third-party lab is the only practical check."
        ],
        "plainAnswer": "FDA may refuse admission of unapproved drugs arriving from abroad, and Customs and Border Protection may detain or seize such shipments. No general right of personal importation covers these compounds. FDA's personal importation policy is enforcement discretion applied narrowly, not a legal entitlement, and it does not clear unapproved substances as a class. Domestic supply avoids the question entirely. Amino Based operates in the United States and ships from here. Buyers importing from overseas suppliers take on the identity problem as well as the customs problem. The standardization gap FDA described in July 2026 applies with more force to unverified foreign sources. A batch-matched certificate of analysis from a named third-party lab is the only practical check."
      },
      {
        "id": "what-did-the-july-2026-pcac-vote-actually-change",
        "question": "What did the July 2026 PCAC vote actually change?",
        "paragraphs": [
          "It changed a recommendation, not the law. On July 23 and 24, 2026, FDA's Pharmacy Compounding Advisory Committee reviewed seven peptides and recommended six for the 503A Bulks List. The committee is advisory, and its votes bind nobody. The six are still absent from 21 CFR 216.23, and FDA has issued no final determination.",
          "Headlines collapsed three separate events into one, and that is the error worth correcting. Removal from Category 2 happened in April. A committee recommendation happened in July. Actual placement on the 503A Bulks List requires notice-and-comment rulemaking, which had not opened as of this review.",
          "The votes themselves were close. BPC-157, KPV and TB-500 each passed 8 to 6 with one abstention. MOTS-c passed 7 to 5 with two abstentions. Emideltide, also called DSIP, failed 6 to 7 with one abstention. Epitalon and Semax were recommended on the second day.",
          "Something unusual sits behind those tallies. FDA staff scientists had recommended against all seven substances, and the committee voted the other way six consecutive times. Reporting from the room described an audible reaction when the first tally was read.",
          "What follows now is FDA's decision. The agency reviews the recommendations and public comment, then decides whether to open rulemaking. Published estimates of that cycle range from eight to twelve months in one legal analysis, with longer figures elsewhere. Analysts also expect informal enforcement discretion in the interim, which would carry less weight than a completed rule.",
          "None of this reaches the research market. Compounding pathways govern what licensed pharmacies may prepare for patients holding prescriptions. Every product Amino Based sells ships for laboratory research use only, before and after the vote."
        ],
        "plainAnswer": "It changed a recommendation, not the law. On July 23 and 24, 2026, FDA's Pharmacy Compounding Advisory Committee reviewed seven peptides and recommended six for the 503A Bulks List. The committee is advisory, and its votes bind nobody. The six are still absent from 21 CFR 216.23, and FDA has issued no final determination. Headlines collapsed three separate events into one, and that is the error worth correcting. Removal from Category 2 happened in April. A committee recommendation happened in July. Actual placement on the 503A Bulks List requires notice-and-comment rulemaking, which had not opened as of this review. The votes themselves were close. BPC-157, KPV and TB-500 each passed 8 to 6 with one abstention. MOTS-c passed 7 to 5 with two abstentions. Emideltide, also called DSIP, failed 6 to 7 with one abstention. Epitalon and Semax were recommended on the second day. Something unusual sits behind those tallies. FDA staff scientists had recommended against all seven substances, and the committee voted the other way six consecutive times. Reporting from the room described an audible reaction when the first tally was read. What follows now is FDA's decision. The agency reviews the recommendations and public comment, then decides whether to open rulemaking. Published estimates of that cycle range from eight to twelve months in one legal analysis, with longer figures elsewhere. Analysts also expect informal enforcement discretion in the interim, which would carry less weight than a completed rule. None of this reaches the research market. Compounding pathways govern what licensed pharmacies may prepare for patients holding prescriptions. Every product Amino Based sells ships for laboratory research use only, before and after the vote."
      },
      {
        "id": "is-bpc-157-legal-in-2026",
        "question": "Is BPC-157 legal in 2026?",
        "paragraphs": [
          "BPC-157 is not an FDA-approved drug, and it is not a controlled substance. Selling it for laboratory research is not prohibited under federal law, while marketing it for human use violates the Federal Food, Drug, and Cosmetic Act. Its compounding status changed in 2026, though not in the way most coverage suggested.",
          "Three dated events define the current position. FDA removed BPC-157 from Category 2 on April 22, 2026, because the nominators withdrew their nominations. The advisory committee then recommended it for the 503A Bulks List on July 23, 2026, by an 8 to 6 vote with one abstention. Neither step placed it on that list.",
          "The gap between recommendation and rule is where most confusion lives. FDA must run notice-and-comment rulemaking before BPC-157 appears in 21 CFR 216.23. Until that finishes, licensed pharmacies lack unambiguous authority to compound it, and the substance is no closer to drug approval than it was in 2023.",
          "Athletes face a separate rule set. The World Anti-Doping Agency lists BPC-157 under S0, its non-approved substances category, and USADA has warned athletes against it. That prohibition stands whatever FDA decides about compounding."
        ],
        "plainAnswer": "BPC-157 is not an FDA-approved drug, and it is not a controlled substance. Selling it for laboratory research is not prohibited under federal law, while marketing it for human use violates the Federal Food, Drug, and Cosmetic Act. Its compounding status changed in 2026, though not in the way most coverage suggested. Three dated events define the current position. FDA removed BPC-157 from Category 2 on April 22, 2026, because the nominators withdrew their nominations. The advisory committee then recommended it for the 503A Bulks List on July 23, 2026, by an 8 to 6 vote with one abstention. Neither step placed it on that list. The gap between recommendation and rule is where most confusion lives. FDA must run notice-and-comment rulemaking before BPC-157 appears in 21 CFR 216.23. Until that finishes, licensed pharmacies lack unambiguous authority to compound it, and the substance is no closer to drug approval than it was in 2023. Athletes face a separate rule set. The World Anti-Doping Agency lists BPC-157 under S0, its non-approved substances category, and USADA has warned athletes against it. That prohibition stands whatever FDA decides about compounding."
      },
      {
        "id": "is-tb-500-legal-in-2026",
        "question": "Is TB-500 legal in 2026?",
        "paragraphs": [
          "TB-500 sits in the same position as BPC-157. It is neither FDA-approved nor scheduled. It came off Category 2 on April 22, 2026. The advisory committee recommended it on July 23, 2026, by an 8 to 6 vote with one abstention. Rulemaking has not placed it on the 503A Bulks List.",
          "The reviewed use differs slightly. FDA evaluated TB-500 for wound healing, where it evaluated BPC-157 for ulcerative colitis. Committee recommendations are tied to specific reviewed uses, though prescribers would hold broader discretion if a substance were eventually listed.",
          "Everything in the BPC-157 answer about the recommendation-to-rule gap applies here without change."
        ],
        "plainAnswer": "TB-500 sits in the same position as BPC-157. It is neither FDA-approved nor scheduled. It came off Category 2 on April 22, 2026. The advisory committee recommended it on July 23, 2026, by an 8 to 6 vote with one abstention. Rulemaking has not placed it on the 503A Bulks List. The reviewed use differs slightly. FDA evaluated TB-500 for wound healing, where it evaluated BPC-157 for ulcerative colitis. Committee recommendations are tied to specific reviewed uses, though prescribers would hold broader discretion if a substance were eventually listed. Everything in the BPC-157 answer about the recommendation-to-rule gap applies here without change."
      },
      {
        "id": "is-ghk-cu-legal-in-2026",
        "question": "Is GHK-Cu legal in 2026?",
        "paragraphs": [
          "GHK-Cu runs on two separate tracks by route of administration, which makes it the exception in this group. FDA removed injectable GHK-Cu from Category 2 on April 22, 2026. Non-injectable GHK-Cu currently sits in Category 1, the under-evaluation bucket carrying interim enforcement discretion. Neither form is FDA-approved.",
          "The non-injectable status took a detour worth knowing. Both routes came out of their categories on April 22, because the nominations were withdrawn. One nominator then clarified on May 5, 2026 that it had meant to withdraw only the injectable nomination. FDA added GHK-Cu, except for injectable routes, back into Category 1 in a revision dated May 14, 2026.",
          "Neither track was part of the July hearing. GHK-Cu goes instead to the second advisory committee meeting scheduled before the end of February 2027, alongside Cathelicidin LL-37, Dihexa acetate, PEG-MGF and Melanotan II. Category 1 placement is enforcement discretion rather than approval, and it is not the 503A Bulks List."
        ],
        "plainAnswer": "GHK-Cu runs on two separate tracks by route of administration, which makes it the exception in this group. FDA removed injectable GHK-Cu from Category 2 on April 22, 2026. Non-injectable GHK-Cu currently sits in Category 1, the under-evaluation bucket carrying interim enforcement discretion. Neither form is FDA-approved. The non-injectable status took a detour worth knowing. Both routes came out of their categories on April 22, because the nominations were withdrawn. One nominator then clarified on May 5, 2026 that it had meant to withdraw only the injectable nomination. FDA added GHK-Cu, except for injectable routes, back into Category 1 in a revision dated May 14, 2026. Neither track was part of the July hearing. GHK-Cu goes instead to the second advisory committee meeting scheduled before the end of February 2027, alongside Cathelicidin LL-37, Dihexa acetate, PEG-MGF and Melanotan II. Category 1 placement is enforcement discretion rather than approval, and it is not the 503A Bulks List."
      },
      {
        "id": "are-research-peptides-fda-approved",
        "question": "Are research peptides FDA approved?",
        "paragraphs": [
          "No. None of the compounds discussed on this page is an FDA-approved drug. Approval evaluates a specific finished product, its dose, its indication, its manufacturing process and its label. No peptide sold for research use has been through that process, and the 2026 compounding developments did not change it.",
          "Approval and compounding are separate pathways, and the difference decides how to read every headline from this year. Placement on the 503A Bulks List would let licensed pharmacies prepare a substance for a patient holding a valid prescription. It reflects no finding of clinical benefit. Drug approval is a far higher evidentiary bar, and no peptide reviewed in July 2026 has cleared it.",
          "Watch for the official document rather than the summary. FDA posts changes at fda.gov, proposed and final rules appear in the Federal Register, and the current list lives at 21 CFR 216.23. Words like approved, unbanned and legalized do real damage here, because each one collapses several distinct stages into a single claim.",
          "Everything Amino Based sells ships for laboratory research use only. That does not change with any of the above."
        ],
        "plainAnswer": "No. None of the compounds discussed on this page is an FDA-approved drug. Approval evaluates a specific finished product, its dose, its indication, its manufacturing process and its label. No peptide sold for research use has been through that process, and the 2026 compounding developments did not change it. Approval and compounding are separate pathways, and the difference decides how to read every headline from this year. Placement on the 503A Bulks List would let licensed pharmacies prepare a substance for a patient holding a valid prescription. It reflects no finding of clinical benefit. Drug approval is a far higher evidentiary bar, and no peptide reviewed in July 2026 has cleared it. Watch for the official document rather than the summary. FDA posts changes at fda.gov, proposed and final rules appear in the Federal Register, and the current list lives at 21 CFR 216.23. Words like approved, unbanned and legalized do real damage here, because each one collapses several distinct stages into a single claim. Everything Amino Based sells ships for laboratory research use only. That does not change with any of the above."
      }
    ]
  }
];

export const ALL_VISIBLE_FAQS = [
  {
    "id": "what-is-the-difference-between-a-research-peptide-supplier-and-a-clinical-peptide-provider",
    "category": "trust-and-legitimacy",
    "question": "What is the difference between a research peptide supplier and a clinical peptide provider?",
    "plainAnswer": "A research peptide supplier sells compounds for laboratory and in-vitro work, with no medical services attached. Clinical peptide providers are licensed medical practices that treat patients and prescribe approved medicines. The two run under different rules, sell different material, and answer to different regulators. Amino Based is a research supplier. The material itself is the first difference. Research-grade peptides are produced and tested for laboratory use. Pharmaceutical-grade material follows GMP for clinical use and carries regulatory approval. Amino Based states the two are never interchangeable, and that research-grade compounds must never be used in humans. What each party does differs next. A research supplier ships material and documentation, meaning a Certificate of Analysis and batch records. Clinical providers examine a patient, make a diagnosis and write a prescription. No supplier can do the second set of things, whatever its catalogue looks like. The confusion has a practical cost. Search results and AI answers often return medical practices to people asking about research vendors, and the two are then read as competitors. They are not in the same business at all. One test settles the question quickly. If a seller offers dosing guidance, treatment plans or health outcomes alongside research compounds, it is describing medical care it is not licensed to give. Every product Amino Based lists is supplied for laboratory and in-vitro research use only."
  },
  {
    "id": "do-you-offer-bulk-wholesale-or-discount-pricing",
    "category": "ordering-and-payments",
    "question": "Do you offer bulk, wholesale, or discount pricing?",
    "plainAnswer": "Yes, and there are three separate routes. Amino Based states that volume pricing is available for repeat research accounts and larger orders. Active-duty service members, veterans and their immediate family qualify for a standing discount across the catalogue. Orders over $300 ship free, and that threshold applies site-wide. Volume pricing works by conversation, not by a published table. Amino Based asks you to send the compounds, quantities and cadence you expect through the contact page, and the team returns a schedule. That suits a laboratory ordering the same compound repeatedly over a year. Peptide bundles sit alongside volume pricing in the catalogue. These are multi-compound sets assembled for comparator and dose-range study designs, listed at set prices instead of quoted. The service discount runs through a verification step. Amino Based states that ID photos are protected, reviewed once and then permanently deleted, so the check happens a single time."
  },
  {
    "id": "how-long-does-shipping-take",
    "category": "shipping-and-delivery",
    "question": "How long does shipping take?",
    "plainAnswer": "Orders are typically processed and dispatched within one to three business days of payment confirmation. Delivery time after that depends on the service you select. Standard and expedited options appear at checkout, with estimated delivery times shown by destination before you complete the order. Custom synthesis needs longer, quoted per project. Shipping is free on orders over $300. No single delivery figure is published, because the estimate is generated at checkout from your destination and chosen service. That is where to look for a date, not in a policy page. Dispatch and delivery are worth separating when an order feels slow. The one to three business day window covers only the time before the package leaves. Everything after that belongs to the carrier and the service level you chose."
  },
  {
    "id": "when-will-i-get-my-tracking-number-what-if-my-tracking-isnt-updating",
    "category": "shipping-and-delivery",
    "question": "When will I get my tracking number? What if my tracking isn't updating?",
    "plainAnswer": "A confirmation email carrying tracking information goes out once your order ships. Order status is also visible in your account dashboard, so the email is not the only route to it. Tracking that has not appeared after the dispatch window has passed is worth raising with support directly. Tracking that stops updating is a different situation from tracking that never arrived. Carrier scans can pause for a day or two in normal transit, particularly over weekends and holidays. No guidance on stalled tracking is currently published. The practical step is to compare the last scan against the estimated delivery window shown at checkout. Once that window has passed, contact support through the contact page."
  },
  {
    "id": "how-discreet-is-the-packaging",
    "category": "shipping-and-delivery",
    "question": "How discreet is the packaging?",
    "plainAnswer": "All orders ship in plain, unmarked outer packaging with no reference to the contents on the exterior. Amino Based states this is to protect your privacy. Nothing on the outside identifies the product, the category or the nature of the business inside the parcel. Discretion stops at the outer packaging, which is the part visible in transit and on a doorstep. The Certificate of Analysis and any product documentation travel inside with the order."
  },
  {
    "id": "my-package-is-delayed-is-it-considered-late",
    "category": "shipping-and-delivery",
    "question": "My package is delayed. Is it considered late?",
    "plainAnswer": "A delivery counts as late once it passes the estimated delivery window shown at checkout for your destination and service. Before that point, a slow scan is usually normal transit. After it, contact support through the contact page and the team works with the carrier to locate the shipment. The estimated window is the reference point, and it is generated per order. That is why no universal day count appears anywhere on the site. What follows a report is described as locating the shipment or arranging a resolution. The specific remedy is decided case by case at present."
  },
  {
    "id": "my-package-arrived-damaged-or-with-missing-or-wrong-items-what-do-i-do",
    "category": "shipping-and-delivery",
    "question": "My package arrived damaged or with missing or wrong items. What do I do?",
    "plainAnswer": "Contact support within 7 days of delivery through the contact page, including your order number and photos of the issue. The same route covers damaged, defective and incorrect items. Once the issue is verified, Amino Based arranges a replacement or refund at no additional cost to you. Photographs carry most of the weight in this process. A clear image of the vial label, the batch number and the outer packaging lets the team confirm what shipped against what was ordered. Damage after delivery sits outside this route. Product damaged through improper storage or handling once it reaches you is named as non-refundable in the refund policy."
  },
  {
    "id": "do-peptides-need-cold-or-ice-pack-shipping",
    "category": "shipping-and-delivery",
    "question": "Do peptides need cold or ice-pack shipping?",
    "plainAnswer": "Temperature-sensitive products ship in insulated packaging and, where necessary, with cold packs. Lyophilised peptides travel dry in insulated packaging with coolant and move on expedited services. Amino Based recommends refrigerating or freezing products immediately on arrival, per the storage guidance supplied with each product. Lyophilised material is more forgiving in transit than material in solution. Short ambient periods are tolerated, which is what makes standard parcel shipping workable for dry powder. The handover is the part worth planning. Packaging protects the vial in transit, and storage protects it afterwards, so a parcel left sitting after delivery loses the benefit of both."
  },
  {
    "id": "what-happens-if-my-package-is-lost-when-do-you-reship-or-refund",
    "category": "shipping-and-delivery",
    "question": "What happens if my package is lost? When do you reship or refund?",
    "plainAnswer": "Contact support through the contact page if your order has not arrived within its estimated delivery window. The team then works with the carrier to locate the shipment or arrange a resolution. No day threshold is currently published for when a package is treated as lost, and no automatic reship or refund rule is published either. Tracking is the first thing to check. An old final scan combined with an expired delivery window is the signal to make contact instead of waiting longer. What happens next is handled case by case at present. A published rule would let you know in advance whether a reship or a refund follows, and how long the carrier claim takes."
  },
  {
    "id": "do-you-ship-internationally-do-you-ship-to-my-state",
    "category": "shipping-and-delivery",
    "question": "Do you ship internationally? Do you ship to my state?",
    "plainAnswer": "Amino Based states that orders ship within the regions listed at checkout, and the checkout is the only place those regions appear. No country or state list is published anywhere on the site. The shipping policy does address customs duties for international customers, which implies international service without confirming any destination. Checkout is therefore the only reliable check available to you today. Enter your address and the available services either appear or they do not. The customs language is worth reading if you are outside the United States. Amino Based states that international customers are responsible for duties, import taxes and their own country's rules on research chemical imports."
  },
  {
    "id": "can-i-change-my-shipping-address-after-ordering",
    "category": "shipping-and-delivery",
    "question": "Can I change my shipping address after ordering?",
    "plainAnswer": "No address-change policy is published on the site. Orders are typically dispatched within one to three business days. A change request needs to reach support quickly to land before the package leaves. Contact the team through the contact page with your order number. Once a parcel is with the carrier, redirection is a carrier question and not a policy question. Options at that point depend on the service used and what that carrier permits. Cancellation is a separate route with a published rule. An order that has not yet shipped can be cancelled for a full refund, under the refund policy."
  },
  {
    "id": "are-your-peptides-third-party-tested",
    "category": "product-quality-and-coas",
    "question": "Are your peptides third-party tested?",
    "plainAnswer": "Amino Based states that every batch is analysed by an independent laboratory using HPLC and mass spectrometry. HPLC measures purity and mass spectrometry confirms identity. A Certificate of Analysis for that batch ships with every order, carrying the purity result, the batch number and the analysis date. The two methods answer different questions, which is why both appear. Mass spectrometry establishes that the molecule is what the label says by measuring its mass. HPLC separates the sample and reports what proportion of it is the target compound."
  },
  {
    "id": "what-does-99-purity-actually-mean",
    "category": "product-quality-and-coas",
    "question": "What does 99% purity actually mean?",
    "plainAnswer": "Purity by HPLC reports what proportion of the sample is the target compound. Amino Based publishes a minimum of 99% purity by high-performance liquid chromatography as its standard. One observed Certificate of Analysis sets its release specification at ≥98.0%, with one recent certificate reporting 99.9%. Both numbers describe the same measurement at different thresholds. Specifications and results are worth separating. A specification is the floor a batch must clear to be released. A result is what the instrument actually measured on that batch. One recent certificate specifies ≥98.0% and reports 99.9%, which means the material cleared its floor by a wide margin. What the figure does not cover matters just as much. Purity by HPLC is not net peptide content, which measures how much of the vial's total mass is peptide rather than residual salts and water. It is not sterility, and it is not a safety finding of any kind."
  },
  {
    "id": "what-is-the-difference-between-hplc-and-mass-spectrometry",
    "category": "product-quality-and-coas",
    "question": "What is the difference between HPLC and mass spectrometry?",
    "plainAnswer": "HPLC separates a sample into its components and reports how much of it is the target compound, which gives you the purity percentage. Mass spectrometry measures molecular mass and confirms identity, meaning that the compound is the sequence named on the label. Amino Based states both run on every batch. Neither method substitutes for the other. A sample could be 99% one compound while that compound is the wrong one, which HPLC alone would not catch. Identity confirmed without a purity figure leaves the proportion of the target compound unknown. Both are analytical measurements on material as tested. Neither method addresses sterility, endotoxin levels, or how the material behaves in any application."
  },
  {
    "id": "are-your-coas-batch-specific",
    "category": "product-quality-and-coas",
    "question": "Are your COAs batch-specific?",
    "plainAnswer": "Amino Based states that every order includes the Certificate of Analysis for its own batch. Certificates are archived, so the record stays available after purchase. Batch numbers are product-specific in format, as shown on the TB-500 product page, which ties a number to one product and one run. The archive matters for anyone keeping method records. A certificate that disappears when a product page changes is not usable for audit or method reporting six months later."
  },
  {
    "id": "how-do-i-know-the-coa-matches-the-vial-i-received",
    "category": "product-quality-and-coas",
    "question": "How do I know the COA matches the vial I received?",
    "plainAnswer": "Match the batch number printed on your vial against the batch number on the certificate that came with your order. That pairing is what ties the document to the material in front of you. Amino Based states it maintains a chain-of-custody record for each batch. That record links the raw material lot, the synthesis run and the final vial count to one batch number. It is the stronger claim of the two, because it covers the whole path, not just the final document. What it means in practice is that one batch number should resolve to one synthesis run and a known vial count."
  },
  {
    "id": "how-do-i-verify-a-coa",
    "category": "product-quality-and-coas",
    "question": "How do I verify a COA?",
    "plainAnswer": "Read the document you were sent and check four fields against your vial. Those fields are the product name, the batch number, the purity result against its specification, and the analysis date. Verification beyond that is not currently possible from this site. What stops it is the certificate's laboratory field, which reads as a generic description instead of a named lab. There is no institution to check with. A named lab with a reference number you could quote is what independent verification requires. Retrieval is the second gap in the chain. The site describes more than one way to find a batch-specific certificate, and those descriptions do not agree with each other."
  },
  {
    "id": "what-is-an-acceptable-purity-level-for-research-peptides",
    "category": "product-quality-and-coas",
    "question": "What is an acceptable purity level for research peptides?",
    "plainAnswer": "Acceptable depends on the work, not on a universal threshold. Analytical and quantitative methods generally demand tighter purity than qualitative screening does. Amino Based publishes a minimum of 99% by HPLC as its standard. One observed certificate sets its release specification at ≥98.0%. Sufficiency is a judgement that belongs to your method. Two figures often get conflated at this point. HPLC purity describes the proportion of the sample that is the target compound. Net peptide content describes how much of the vial's mass is peptide at all, with the remainder typically counterions, residual solvent and water. For quantitative work the second figure is often the one that matters, since it determines how much peptide is actually present. A certificate reporting only HPLC purity leaves that question open."
  },
  {
    "id": "can-i-send-a-sample-for-independent-testing-myself",
    "category": "product-quality-and-coas",
    "question": "Can I send a sample for independent testing myself?",
    "plainAnswer": "Nothing prevents you from sending material to a laboratory of your choosing, and Amino Based states it supplies batch documentation and COA archives on request. Independent testing is the strongest form of verification available to a buyer. Method and sample handling drive the result, so a mismatch is not automatically a finding. Several ordinary differences produce different numbers. Laboratories use different HPLC methods, columns and gradients. Sample handling between delivery and testing introduces its own variables, particularly for material that has been reconstituted. If your result diverges meaningfully from the certificate, contact support with your order number, your batch number and your laboratory's report through the contact page. The refund policy covers material that does not match its documentation within 7 days of delivery."
  },
  {
    "id": "what-is-the-difference-between-research-grade-and-pharmaceutical-grade-peptides",
    "category": "product-quality-and-coas",
    "question": "What is the difference between research-grade and pharmaceutical-grade peptides?",
    "plainAnswer": "Research-grade material is produced and tested for laboratory use. Pharmaceutical-grade material follows GMP for clinical use and carries regulatory approval. Amino Based states the two are never interchangeable and that research-grade compounds must never be used in humans. Everything sold here is research grade. The difference is a whole regulatory apparatus, not a purity number. Pharmaceutical grade means an approved product, a validated manufacturing process, and an FDA-reviewed label describing a specific use. A research compound has none of those regardless of how clean its chromatography looks. This is the distinction that most often gets lost. A high purity figure describes what is in the vial. Approval describes what a regulator has evaluated and permitted, and no purity result substitutes for it."
  },
  {
    "id": "do-you-offer-custom-synthesis",
    "category": "product-quality-and-coas",
    "question": "Do you offer custom synthesis?",
    "plainAnswer": "Yes, Amino Based takes custom synthesis requests. Send your target sequence, required purity threshold and quantity, along with any modifications such as amidation, acetylation or conjugation. The team returns a quotation with a projected timeline. Custom synthesis carries longer processing than catalogue products, and that timing is communicated when the order is placed. Two things follow from custom work that differ from a catalogue order. Processing time is quoted per project and falls outside the standard 1 to 3 business day dispatch window. Custom and made-to-order synthesis is also non-refundable unless it arrives defective, under the refund policy. Institutional buyers have a separate path worth knowing. Amino Based states it supplies purchase orders, W-9 forms, batch documentation and COA archives on request, which covers most procurement requirements."
  },
  {
    "id": "how-do-i-store-peptides-freezer-or-fridge-for-lyophilized-peptides",
    "category": "storage-and-handling",
    "question": "How do I store peptides? Freezer or fridge for lyophilized peptides?",
    "plainAnswer": "Store unopened lyophilised vials at −20°C, away from light and moisture. A freezer, not a fridge, is the reference condition Amino Based publishes for long-term stability. Short ambient periods during transit do not compromise integrity. On arrival, refrigerate or freeze promptly rather than leaving vials on the bench. The distinction matters because the two temperatures serve different purposes. A domestic freezer at roughly −20°C is the long-term condition, and it is what the 24-month stability figure assumes. Refrigeration handles the short gap between delivery and transfer, and the shipping policy directs exactly that. Light and moisture do as much damage as temperature. Keep vials in their original packaging, sealed, and avoid repeated cycles of warming and refreezing. Each cycle is an opportunity for condensation to reach the powder."
  },
  {
    "id": "what-does-lyophilized-mean-why-does-it-arrive-as-powder",
    "category": "storage-and-handling",
    "question": "What does lyophilized mean? Why does it arrive as powder?",
    "plainAnswer": "Lyophilisation is freeze-drying. The peptide is frozen, then the water is removed under vacuum, leaving a dry solid. Amino Based ships every peptide in this form, sealed in vials, because dry material holds its structure far longer than material sitting in solution. Water is what drives most degradation pathways in a peptide. Remove it and the reactions that break peptide bonds slow dramatically. That single fact explains the whole format, and it explains why the published stability figure for sealed lyophilised material runs to 24 months or longer while reconstituted material is measured in far shorter spans. The powder itself can look different from vial to vial. A fluffy cake, a thin film on the glass, or a small compact pellet are all normal outcomes of the drying process. Appearance alone says nothing about purity, which is what the Certificate of Analysis records."
  },
  {
    "id": "my-peptide-didnt-fully-dissolve-or-looks-cloudy-is-it-bad",
    "category": "storage-and-handling",
    "question": "My peptide didn't fully dissolve or looks cloudy. Is it bad?",
    "plainAnswer": "Cloudiness or incomplete dissolution is a physical observation, not a purity measurement. Every Amino Based batch is tested by an independent laboratory to a minimum of 99% purity by HPLC, with mass spectrometry confirming identity. Check the batch number on your vial against its certificate before drawing any conclusion. Several ordinary causes produce a cloudy solution. Solvent choice matters, since some sequences dissolve poorly in certain diluents. Agitation matters too, and forcing dissolution by shaking can denature material rather than help it. Temperature at the time of mixing plays a part as well. What a Certificate of Analysis covers is identity and purity in the vial as tested. It does not certify behaviour in any particular solvent, and it does not cover handling after the vial left the facility. If the material genuinely does not match its certificate, the refund policy covers that case within 7 days of delivery."
  },
  {
    "id": "what-happens-if-you-dont-refrigerate-peptides",
    "category": "storage-and-handling",
    "question": "What happens if you don't refrigerate peptides?",
    "plainAnswer": "Lyophilised material tolerates short ambient periods without losing integrity, which is why vials survive transit in insulated packaging with coolant. Extended time at room temperature is a different matter, and it erodes the 24-month stability figure that assumes storage at −20°C. Degradation is gradual rather than instant. No published figure exists for how long is too long, because the answer depends on the sequence, the ambient temperature and the humidity. Treating a few days in transit as acceptable and a few weeks on a bench as not is the practical reading of the guidance. Degraded material does not announce itself. A vial that spent a month warm can look identical to one stored correctly, which is why storage records matter more than visual inspection in a laboratory setting."
  },
  {
    "id": "what-is-the-shelf-life-of-lyophilized-versus-reconstituted-research-peptides",
    "category": "storage-and-handling",
    "question": "What is the shelf life of lyophilized versus reconstituted research peptides?",
    "plainAnswer": "Sealed at −20°C, away from light and moisture, lyophilised research peptides generally remain stable for 24 months or longer. Reconstituted material behaves differently once solvent is added. Stability drops considerably, and the useful window depends on the specific sequence, the solvent used and the storage temperature. The gap between the two states is the single most consequential thing in this category. Dry material is measured in years. Material in solution is measured in far less, and any figure quoted for it carries assumptions about sequence and solvent that a general number cannot hold. Always confirm against your own stability data for the compound you are working with."
  },
  {
    "id": "how-fragile-are-reconstituted-peptides",
    "category": "storage-and-handling",
    "question": "How fragile are reconstituted peptides?",
    "plainAnswer": "They are more fragile than the lyophilised form by a wide margin. Adding solvent restarts the hydrolysis pathways that freeze-drying shut down, and the rate depends on sequence, solvent and temperature. Mechanical handling matters too, since vigorous agitation can denature material that gentle mixing would leave intact. Three variables drive the outcome, and none of them is visible. Sequence composition determines which bonds are vulnerable. Solvent choice and pH determine how fast those bonds break. Temperature scales the whole process. What this means in practice is that reconstituted material is working stock rather than storage stock. The storage reference above treats the two states separately for that reason."
  },
  {
    "id": "is-the-30-day-rule-real",
    "category": "storage-and-handling",
    "question": "Is the 30-day rule real?",
    "plainAnswer": "It is convention rather than a measured constant. No single figure covers every peptide in solution, because stability varies by sequence, solvent and temperature. Amino Based publishes no 30-day figure, and treating a round number as a hard boundary substitutes a rule of thumb for actual stability data. Round numbers spread because they are easy to remember, not because they were measured across a compound library. A short sequence in a cold, well-chosen solvent may hold longer. A sensitive sequence held warm may not reach the figure at all. The honest position is that stability data for your specific compound and solvent beats any general number. Where that data does not exist, the uncertainty is real and worth stating rather than papering over."
  },
  {
    "id": "can-i-freeze-a-reconstituted-vial",
    "category": "storage-and-handling",
    "question": "Can I freeze a reconstituted vial?",
    "plainAnswer": "Freezing is possible, though it introduces a cost the lyophilised form does not have. Each freeze and thaw cycle stresses material in solution, and repeated cycles compound the damage. Product pages publish 2–8°C refrigerated for reconstituted material. No freezing guidance is published, so no company figure covers this case at present. Aliquoting is the standard way laboratories reduce the cost. Dividing solution into single-use portions means thawing one portion rather than cycling the whole vial repeatedly. That is general laboratory practice for materials in solution, not a Amino Based instruction. Two things stay true regardless. Dry material at −20°C remains the stable form, and anything in solution is on a shorter clock. For questions about a specific compound, the contact page reaches the team directly."
  },
  {
    "id": "do-you-offer-refunds-or-returns",
    "category": "returns-refunds-and-order-changes",
    "question": "Do you offer refunds or returns?",
    "plainAnswer": "Amino Based states that unopened, unused products in their original packaging may be eligible for return within 14 days of delivery. The policy does not accept returns of opened or used products, and a restocking fee applies to unopened returns. It asks you to request a Return Merchandise Authorization before sending anything back. The restriction follows from what these products are. Research material that has left controlled storage cannot be verified as unaltered, so a returned open vial carries no traceable handling history behind it. The refund policy names four categories as non-refundable. Opened, reconstituted or used products qualify for none. Products damaged after delivery through improper storage or handling are excluded, as are custom or made-to-order synthesis requests unless defective. Shipping fees are also listed, except in cases of the company's error."
  },
  {
    "id": "can-i-cancel-or-modify-my-order",
    "category": "returns-refunds-and-order-changes",
    "question": "Can I cancel or modify my order?",
    "plainAnswer": "Amino Based states that orders may be cancelled for a full refund if they have not yet shipped. Once an order has shipped, the policy says it falls under the return terms instead. Since the shipping policy puts dispatch at one to three business days, the cancellation window is short. Custom synthesis runs on a different schedule, with processing time communicated at the time of order. That extends the window in one sense. Custom work is also named as non-refundable once made unless defective, which makes early cancellation the only clean exit. Modification is a narrower question than cancellation, and the published policy addresses cancellation only. Contacting support quickly is the practical move either way, since dispatch can happen the next business day."
  },
  {
    "id": "what-if-my-order-never-arrives",
    "category": "returns-refunds-and-order-changes",
    "question": "What if my order never arrives?",
    "plainAnswer": "The shipping policy asks you to contact support if your order has not arrived within its estimated delivery window. Amino Based states the team then works with the carrier to locate the shipment or arrange a resolution. No fixed day count is published for when a package is treated as lost. Tracking is the first place to look. Amino Based states that a confirmation email carries tracking information once an order ships, and that order status also appears in your account dashboard. Delivery windows are generated at checkout by destination and service level, so no single published figure covers them. If the last scan is old and that window has passed, the policy points you to the contact page."
  },
  {
    "id": "what-if-i-receive-the-wrong-item",
    "category": "returns-refunds-and-order-changes",
    "question": "What if I receive the wrong item?",
    "plainAnswer": "Amino Based asks you to make contact within 7 days of delivery through the contact page, including your order number and photos of the issue. The policy applies the same window to damaged, defective and incorrect items. It states that a replacement or refund follows at no additional cost once the issue is verified. Photographs do most of the work here. A clear image of the vial label, the batch number and the outer packaging lets the team confirm what shipped against what was ordered. One case sits close to this and is worth naming. Material that does not match the batch details on its Certificate of Analysis falls under the same 7-day route. It counts as a fulfilment error and not a change of mind."
  },
  {
    "id": "do-you-offer-shipping-insurance",
    "category": "returns-refunds-and-order-changes",
    "question": "Do you offer shipping insurance?",
    "plainAnswer": "Amino Based publishes no separate shipping insurance product. What the policy offers instead is the damage route, giving you 7 days from delivery to report a damaged or incorrect order with photos. Shipping fees themselves are listed as non-refundable, except in cases of the company's error. Packaging is the first line of protection and it is not a policy at all. Amino Based states that temperature-sensitive products ship in insulated packaging with cold packs where necessary. All orders travel in plain, unmarked outer packaging with no reference to the contents."
  },
  {
    "id": "how-long-do-refunds-take-to-appear",
    "category": "returns-refunds-and-order-changes",
    "question": "How long do refunds take to appear?",
    "plainAnswer": "Amino Based states that approved refunds are processed to your original payment method within 5 to 10 business days. That window covers the company issuing the refund. How long it then takes to post depends on your bank or card issuer. That second leg sits outside the company's control. Counting the two legs separately explains most refund anxiety. A refund issued on day 8 and posted by the bank on day 12 looks like a 12-day delay from the customer's chair. Only the first 8 days belong to the company. If the refund has not appeared after the stated window, the policy asks you to contact support."
  },
  {
    "id": "what-does-research-use-only-mean",
    "category": "legality-and-research-use",
    "question": "What does \"research use only\" mean?",
    "plainAnswer": "Research use only means the material is sold for laboratory work, not for human or veterinary use. It is a statement about intended use, set by federal law on how products are marketed. The FDA treats a product marketed for human consumption without approval as a violation, whatever the label says. The phrase describes how material is offered for sale, and it grants no special legal permission. Federal law governs marketing claims. A product promoted for treating, preventing or curing anything in people meets the definition of a drug under the Federal Food, Drug, and Cosmetic Act. Selling an unapproved drug that way breaks that law, and a research use only label does not change the analysis. That part is settled law rather than interpretation. Company policy covers the rest. Amino Based ships every item for laboratory research, requires buyers to be 21 or older, and publishes no guidance on human use. Where a question crosses into what someone should do with a compound personally, the answer belongs with a licensed clinician."
  },
  {
    "id": "what-does-for-research-use-only-imply-about-safety-and-efficacy",
    "category": "legality-and-research-use",
    "question": "What does \"for research use only\" imply about safety and efficacy?",
    "plainAnswer": "A research use only label carries no claim about safety or effectiveness in people. It signals intended use, and nothing more. None of these compounds is an FDA-approved drug, and approval is the process that evaluates a specific product, dose, indication and label. Purity testing on a vial says nothing about clinical outcomes. Two different things get confused here. Manufacturing quality is measurable, and a certificate of analysis reports identity and purity for a specific lot. Clinical benefit is a separate question, answered by controlled trials in people. Evidence for these compounds remains thin by that second standard. At the July 2026 advisory committee meeting, FDA staff scientists recommended against all seven peptides under review. One committee member, Brian Lee of the Keck School of Medicine at USC, said existing randomized data suggested BPC-157 may perform no better than placebo. Those are the agency's own position and a panelist's statement, and we report them rather than argue with them. Treat them as the current state of the evidence."
  },
  {
    "id": "why-wont-you-provide-dosing-or-usage-instructions",
    "category": "legality-and-research-use",
    "question": "Why won't you provide dosing or usage instructions?",
    "plainAnswer": "Dosing and administration guidance would describe human use, and these products are not sold for human use. Providing it would contradict the research use only terms every order ships under. Amino Based supplies handling and storage information for laboratory materials instead. For anything involving a person, a licensed clinician is the right source. Identity is part of the problem too. FDA staff told the July 2026 committee they had encountered multiple materials sold as BPC-157 that contained different active molecules. No standardization exists across this market. Usage instructions written against that backdrop would be guesswork dressed as guidance. Storage and handling sit in a different category, and those we do publish. Temperature ranges, reconstitution chemistry and shelf life describe how a laboratory material behaves inside a vial. None of that tells anyone to put a compound into a person."
  },
  {
    "id": "can-anyone-buy-research-only-peptides",
    "category": "legality-and-research-use",
    "question": "Can anyone buy research-only peptides?",
    "plainAnswer": "No. Amino Based requires every buyer to be 21 or older, and the site runs an age gate before checkout. Orders ship only for laboratory research use. Beyond that company rule, certain buyers face separate restrictions that have nothing to do with us, and competitive athletes are the clearest example. Federal law is the first layer. These compounds are not FDA-approved drugs, and they are not scheduled under the Controlled Substances Act. Possession for research is therefore not a federal drug-scheduling question. That is the law as it stands, not an interpretation of it. State rules form a second layer and they differ. Some states regulate the sale and possession of unapproved substances more tightly than federal law does, and a few limit purchases by entity type. Check your own state's current rules rather than assuming a single national answer. Anti-doping rules form a third. The World Anti-Doping Agency lists BPC-157 under S0, its category for non-approved substances. Athletes subject to testing risk sanction regardless of how a product is labeled. USADA has issued the same warning. An athlete under a testing pool should treat that as disqualifying before anything else."
  },
  {
    "id": "do-i-need-a-license-or-lab-affiliation-to-order",
    "category": "legality-and-research-use",
    "question": "Do I need a license or lab affiliation to order?",
    "plainAnswer": "Federal law sets no licensing requirement for buying these specific compounds, because they are neither FDA-approved drugs nor scheduled controlled substances. No DEA registration applies. Institutional affiliation is a separate matter of company policy and state law, so check both before ordering. The absence of a license requirement is not permission for any particular use. It reflects where these substances sit in the regulatory structure, which is outside both the approved-drug pathway and the controlled-substance schedules. Nothing about that changes the research use only terms on every order. State law can add requirements that federal law does not. A handful of states impose their own conditions on who may purchase unapproved substances. FDA.gov covers the federal picture, and your state board or attorney general's office covers the rest."
  },
  {
    "id": "are-peptides-legal-to-buy-in-the-us-in-2026",
    "category": "legality-and-research-use",
    "question": "Are peptides legal to buy in the US in 2026?",
    "plainAnswer": "Buying research peptides for laboratory use is not prohibited by federal law in 2026. These compounds are not FDA-approved drugs, and they are not controlled substances. What federal law does regulate is marketing. A product sold for human use without approval violates the Federal Food, Drug, and Cosmetic Act, and individual states add their own conditions. The regulatory news of 2026 concerned pharmacy compounding, not the research market. On April 22, 2026, FDA removed twelve peptides from Category 2 of its interim 503A list. On July 23 and 24, an advisory committee recommended six of seven reviewed substances for the 503A Bulks List. Neither event touched how laboratory materials are sold, and neither made any peptide an approved drug. Legality turns on purpose rather than on the molecule. The same vial is a laboratory material when sold for research and an unapproved drug when marketed for treating people. That distinction is where enforcement happens. State law is the layer buyers most often overlook. Requirements differ, and a few states regulate unapproved substances more tightly than federal law does. Check your own state's current position rather than relying on a single national answer."
  },
  {
    "id": "what-are-the-regulations-surrounding-the-purchase-of-research-peptides-in-the-us",
    "category": "legality-and-research-use",
    "question": "What are the regulations surrounding the purchase of research peptides in the US?",
    "plainAnswer": "Three frameworks matter. The Federal Food, Drug, and Cosmetic Act defines what counts as a drug and governs marketing claims. Section 503A of that Act governs pharmacy compounding, which is a separate pathway from research supply. State law adds its own requirements, and anti-doping rules bind athletes independently of all three. The compounding framework gets misread constantly. Section 503A concerns what licensed pharmacies may prepare for patients holding a valid prescription. Substances reach the 503A Bulks List through rulemaking, and the list itself appears at 21 CFR 216.23. None of that governs a research supplier or a laboratory buyer. Marketing rules do reach suppliers. A seller who promotes a product for treating, preventing or curing a condition in people has marketed a drug under federal law. Approval status then becomes the question, and none of these compounds has approval. Anti-doping rules operate on a separate track entirely. The World Anti-Doping Agency and USADA maintain their own prohibited lists. An athlete in a testing pool answers to those bodies regardless of what federal or state law permits."
  },
  {
    "id": "is-it-illegal-to-sell-research-peptides",
    "category": "legality-and-research-use",
    "question": "Is it illegal to sell research peptides?",
    "plainAnswer": "Selling these compounds for laboratory research is not itself prohibited under federal law. Human use is a different matter. A product marketed to treat, prevent or cure anything in people is a drug under the Federal Food, Drug, and Cosmetic Act. Selling an unapproved drug that way violates the Act's unapproved new drug and misbranding provisions. FDA enforces against marketing conduct rather than against the molecule. Warning letters to sellers typically cite claims made on a website, in email, or across social accounts. The vial's contents may be identical in both cases. What differs is what the seller said about it. Testimony at the July 2026 advisory committee meeting described the alternative market plainly. One witness recounted a colleague photographing peptides for sale in a Queens bodega. FDA staff at the same meeting reported encountering multiple products sold as BPC-157 that contained different active molecules. Amino Based makes no human-use claims anywhere, publishes no dosing guidance, and ships every order under research use only terms. That is a company policy, and it also reflects where the legal line sits."
  },
  {
    "id": "are-there-penalties-for-buying-or-selling-research-peptides-online-in-the-us",
    "category": "legality-and-research-use",
    "question": "Are there penalties for buying or selling research peptides online in the US?",
    "plainAnswer": "Penalties fall mainly on sellers who market for human use. FDA enforcement tools include warning letters, injunctions, product seizure and referral for prosecution. For buyers, federal law sets no penalty for purchasing a non-scheduled, non-approved substance for research. Customs seizure and anti-doping sanctions are the realistic exposures instead. Enforcement history shows the pattern. FDA cited the Category 2 significant safety risk designation as the basis for action against compounders distributing those substances between 2023 and 2026. The trigger in each case was conduct, meaning what was prepared, sold, or claimed. Athletes carry a distinct risk that has no connection to FDA. A sanction under anti-doping rules follows a positive test or a possession finding, and it arrives from a sporting body rather than a court. These are general-information answers about a regulatory picture that is moving. They are not legal advice. For your own situation, FDA.gov covers the federal position and a qualified attorney covers the rest."
  },
  {
    "id": "can-i-legally-import-research-peptides-for-personal-use-in-the-united-states",
    "category": "legality-and-research-use",
    "question": "Can I legally import research peptides for personal use in the United States?",
    "plainAnswer": "FDA may refuse admission of unapproved drugs arriving from abroad, and Customs and Border Protection may detain or seize such shipments. No general right of personal importation covers these compounds. FDA's personal importation policy is enforcement discretion applied narrowly, not a legal entitlement, and it does not clear unapproved substances as a class. Domestic supply avoids the question entirely. Amino Based operates in the United States and ships from here. Buyers importing from overseas suppliers take on the identity problem as well as the customs problem. The standardization gap FDA described in July 2026 applies with more force to unverified foreign sources. A batch-matched certificate of analysis from a named third-party lab is the only practical check."
  },
  {
    "id": "what-did-the-july-2026-pcac-vote-actually-change",
    "category": "legality-and-research-use",
    "question": "What did the July 2026 PCAC vote actually change?",
    "plainAnswer": "It changed a recommendation, not the law. On July 23 and 24, 2026, FDA's Pharmacy Compounding Advisory Committee reviewed seven peptides and recommended six for the 503A Bulks List. The committee is advisory, and its votes bind nobody. The six are still absent from 21 CFR 216.23, and FDA has issued no final determination. Headlines collapsed three separate events into one, and that is the error worth correcting. Removal from Category 2 happened in April. A committee recommendation happened in July. Actual placement on the 503A Bulks List requires notice-and-comment rulemaking, which had not opened as of this review. The votes themselves were close. BPC-157, KPV and TB-500 each passed 8 to 6 with one abstention. MOTS-c passed 7 to 5 with two abstentions. Emideltide, also called DSIP, failed 6 to 7 with one abstention. Epitalon and Semax were recommended on the second day. Something unusual sits behind those tallies. FDA staff scientists had recommended against all seven substances, and the committee voted the other way six consecutive times. Reporting from the room described an audible reaction when the first tally was read. What follows now is FDA's decision. The agency reviews the recommendations and public comment, then decides whether to open rulemaking. Published estimates of that cycle range from eight to twelve months in one legal analysis, with longer figures elsewhere. Analysts also expect informal enforcement discretion in the interim, which would carry less weight than a completed rule. None of this reaches the research market. Compounding pathways govern what licensed pharmacies may prepare for patients holding prescriptions. Every product Amino Based sells ships for laboratory research use only, before and after the vote."
  },
  {
    "id": "is-bpc-157-legal-in-2026",
    "category": "legality-and-research-use",
    "question": "Is BPC-157 legal in 2026?",
    "plainAnswer": "BPC-157 is not an FDA-approved drug, and it is not a controlled substance. Selling it for laboratory research is not prohibited under federal law, while marketing it for human use violates the Federal Food, Drug, and Cosmetic Act. Its compounding status changed in 2026, though not in the way most coverage suggested. Three dated events define the current position. FDA removed BPC-157 from Category 2 on April 22, 2026, because the nominators withdrew their nominations. The advisory committee then recommended it for the 503A Bulks List on July 23, 2026, by an 8 to 6 vote with one abstention. Neither step placed it on that list. The gap between recommendation and rule is where most confusion lives. FDA must run notice-and-comment rulemaking before BPC-157 appears in 21 CFR 216.23. Until that finishes, licensed pharmacies lack unambiguous authority to compound it, and the substance is no closer to drug approval than it was in 2023. Athletes face a separate rule set. The World Anti-Doping Agency lists BPC-157 under S0, its non-approved substances category, and USADA has warned athletes against it. That prohibition stands whatever FDA decides about compounding."
  },
  {
    "id": "is-tb-500-legal-in-2026",
    "category": "legality-and-research-use",
    "question": "Is TB-500 legal in 2026?",
    "plainAnswer": "TB-500 sits in the same position as BPC-157. It is neither FDA-approved nor scheduled. It came off Category 2 on April 22, 2026. The advisory committee recommended it on July 23, 2026, by an 8 to 6 vote with one abstention. Rulemaking has not placed it on the 503A Bulks List. The reviewed use differs slightly. FDA evaluated TB-500 for wound healing, where it evaluated BPC-157 for ulcerative colitis. Committee recommendations are tied to specific reviewed uses, though prescribers would hold broader discretion if a substance were eventually listed. Everything in the BPC-157 answer about the recommendation-to-rule gap applies here without change."
  },
  {
    "id": "is-ghk-cu-legal-in-2026",
    "category": "legality-and-research-use",
    "question": "Is GHK-Cu legal in 2026?",
    "plainAnswer": "GHK-Cu runs on two separate tracks by route of administration, which makes it the exception in this group. FDA removed injectable GHK-Cu from Category 2 on April 22, 2026. Non-injectable GHK-Cu currently sits in Category 1, the under-evaluation bucket carrying interim enforcement discretion. Neither form is FDA-approved. The non-injectable status took a detour worth knowing. Both routes came out of their categories on April 22, because the nominations were withdrawn. One nominator then clarified on May 5, 2026 that it had meant to withdraw only the injectable nomination. FDA added GHK-Cu, except for injectable routes, back into Category 1 in a revision dated May 14, 2026. Neither track was part of the July hearing. GHK-Cu goes instead to the second advisory committee meeting scheduled before the end of February 2027, alongside Cathelicidin LL-37, Dihexa acetate, PEG-MGF and Melanotan II. Category 1 placement is enforcement discretion rather than approval, and it is not the 503A Bulks List."
  },
  {
    "id": "are-research-peptides-fda-approved",
    "category": "legality-and-research-use",
    "question": "Are research peptides FDA approved?",
    "plainAnswer": "No. None of the compounds discussed on this page is an FDA-approved drug. Approval evaluates a specific finished product, its dose, its indication, its manufacturing process and its label. No peptide sold for research use has been through that process, and the 2026 compounding developments did not change it. Approval and compounding are separate pathways, and the difference decides how to read every headline from this year. Placement on the 503A Bulks List would let licensed pharmacies prepare a substance for a patient holding a valid prescription. It reflects no finding of clinical benefit. Drug approval is a far higher evidentiary bar, and no peptide reviewed in July 2026 has cleared it. Watch for the official document rather than the summary. FDA posts changes at fda.gov, proposed and final rules appear in the Federal Register, and the current list lives at 21 CFR 216.23. Words like approved, unbanned and legalized do real damage here, because each one collapses several distinct stages into a single claim. Everything Amino Based sells ships for laboratory research use only. That does not change with any of the above."
  }
];
