# Phase 12 — Completion Report

Generated 2026-11-10. Content for all 50 catalogue products. Revised after the identity-resolution pass of 2026-11-10.

## Summary

| Metric | Value |
|---|---|
| Products required (distinct slugs in supplied CSV) | 50 |
| Products generated | 50 |
| Coverage | 100% — every CSV slug has a file; no file lacks a CSV slug |
| Validation failures | 0 |
| Total main-content words (excl. FAQs) | 130,110 |
| Mean main-content words | 2602 |
| Minimum main-content words | 2006 (spec floor 2,000) |
| Total FAQs | 500 (exactly 10 per product) |
| Status: NEEDS VERIFICATION | 42 |
| Status: BLOCKED | 8 |
| Status: COMPLETE | 0 — see note |

**Why no product is marked COMPLETE.** COMPLETE would require lot-specific analytical data. No certificate of analysis was supplied for any product, so `coaPurity` is deliberately left unset on all 50 and no page makes a purity claim.

## Identity-resolution pass, 2026-11-10

An attempt was made to resolve every BLOCKED item from primary sources rather than by referring them to the supplier. Four were resolved or materially advanced. The decisive technique was querying PubChem **by CAS registry number rather than by name** — several of these compounds have no name-based database entry but do have a CAS-indexed one.

### Fully resolved — status changed BLOCKED to NEEDS VERIFICATION

- **CJC-1295 no-DAC.** CAS 863288-34-0 returns PubChem CID 56841945, C152H252N44O42, MW 3367.9. Confirmed independently by elemental composition: sermorelin (unmodified GRF 1-29) is C149H246N44O42S at 3357.9 and contains sulfur from Met27, while this analogue contains none — exactly as the documented Met27-to-Leu27 substitution predicts. This also yields a discriminating test: the two differ by only ~10 g/mol (0.3%), so intact mass separates them poorly, but sulfur content separates them absolutely.

### Materially advanced — still BLOCKED, but the remaining gap is a single supplier fact

- **TB-500.** Both candidate molecules are now fully characterised via CAS: full-length thymosin beta-4 is CAS 77591-33-4 / CID 16132341 / C212H350N56O78S / 4963, and the acetylated fragment Ac-LKKTETQ is CAS 885340-08-9 / CID 62707662 / C38H68N10O14 / 889.0. The fragment assignment is self-confirming: unacetylated LKKTETQ is CID 10169788 at 847.0, and 889.0 − 847.0 = exactly 42.0, one acetyl group. What remains unknown is only *which of the two* is in the vial. Propagated to the three blends containing TB-500.
- **5-Amino-1MQ.** The iodide salt is a registered entity: PubChem CID 66522933, C10H11IN2, MW 286.11 — confirming the page's arithmetic exactly (159.21 + 126.90 = 286.1). The active cation is 55.6% of salt mass, so a nominal 150 mg of iodide holds ~83 mg of cation. Which salt is actually supplied is still unstated.
- **HCG.** A usable IU-to-mass range was established: purified hCG biopotency clusters near 13,000 IU/mg (published range ~8,360–16,800), with older reference preparations at ~4,200–9,300 IU/mg. At 13,000 IU/mg a 5,000 IU vial is ~0.4 mg of protein. Lot potency still requires bioassay.
- **Glow and Klow — composition reconstructed.** The repository's own `lib/masterCatalogData.ts` lists spray SKUs `SPR-GLOW-70MG` and `SPR-KLOW-80MG`. Enumerating the component strengths actually offered in this catalogue (GHK-Cu 50/100, BPC-157 5/10, TB-500 5/10, KPV 10) gives exactly one combination summing to 70 mg — GHK-Cu 50 + BPC-157 10 + TB-500 10 — and exactly one summing to 80 mg, the same plus KPV 10. The two totals differ by precisely one unit of the one component that differs between the products. Treated as a reproducible inference, not a specification: the figures describe the spray line, and that catalogue file is stale (its prices differ from the supplied list and its images point at blocked assets).
- **Lipo-C.** Total fill mass of 120 mg recovered from SKU `SPR-LIPOC-120MG`. The split between methionine, inositol and choline remains underdetermined — unlike Glow and Klow, no standalone strengths exist in the catalogue to constrain it.
- **IGF-1 LR3.** Mass sharpened to ~9,111 Da from reagent-supplier characterisation of E. coli-expressed material; still no public registry entry and no reliable CAS. Sources also disagree on the sequence of the defining 13-residue N-terminal extension, which is a material uncertainty rather than a typographical one.

## Compliance gates (all 50 pass)

- RUO disclaimer present · no human dosing · no treatment claims · no purity claim (`coaPurity` unset on all 50)
- Exactly 10 FAQs · meta description ≤160 chars · all five long-form fields and four section titles populated · SEO block and internal links present

## BLOCKED products (8) — reason per product

### 5-amino-1mq
NO INDEXED LITERATURE UNDER ITS OWN NAME, AND AN UNRESOLVED COUNTER-ION. A direct PubMed search for 5-amino-1-methylquinolinium returned ZERO results (verified 2026-11-09). Separately, the verified PubChem record is for a CATION (C10H11N2+, 159.21). A cation cannot be supplied alone; it must be paired with a counter-anion whose identity is not stated. Because the counter-anion can be a large fraction of the vial mass, neither the molar content of the 150 mg presentation nor the identity of the supplied salt can be determined from available information.

### bpc-157-tb-500-blend
INHERITED IDENTITY AMBIGUITY. This blend contains TB-500, a designation applied in commerce to TWO chemically different substances - full-length thymosin beta-4 (approx 4963 Da) and the fragment Ac-LKKTETQ (approx 889 Da) - differing in mass by roughly 5.6-fold. Which is present is not stated and cannot be determined from supplier information. A blend cannot be better characterised than its least-characterised component, so the ambiguity documented on the TB-500 page propagates here in full. Additionally no per-component quantitation is supplied for the stated 5mg/5mg and 10mg/10mg presentations.

### glow
INHERITED IDENTITY AMBIGUITY PLUS UNVERIFIED COMPOSITION. This blend is commonly marketed as GHK-Cu + BPC-157 + TB-500, but the exact per-vial composition and ratios are supplier-specified and NOT VERIFIED, and the product listing states only "Standard" with no quantities at all. It contains TB-500, whose designation covers two chemically different substances differing in mass by roughly 5.6-fold; which is present is not stated. A blend cannot be better characterised than its least-characterised component. Additionally, no per-component quantitation is supplied, and the presence of a redox-active copper complex alongside oxidation-sensitive peptides raises an unaddressed compatibility question.

### hcg
APPROVED BIOLOGIC SOLD AS RUO, WITH UNVERIFIABLE POTENCY. hCG is a heterodimeric glycoprotein hormone of roughly 36-38 kDa; no molecular formula may be stated for it and none is stated on this page. Potency is expressed in International Units against an international reference preparation, so no mass can be inferred and no identity or potency claim can be made without lot-specific bioassay data, which is not supplied. Additionally this is an FDA-APPROVED drug substance, which raises compliance considerations beyond those for unapproved research compounds.

### igf-1-lr3
NO PUBLIC CHEMICAL DATABASE RECORD, AND IDENTITY NOT INDEPENDENTLY VERIFIABLE. IGF-1 LR3 is an 83-residue recombinant protein analogue of approximately 9.1 kDa. PubChem holds no record for it (verified 2026-11-09) and no molecular formula is asserted on this page. As a recombinant protein it additionally cannot be verified by the methods appropriate to synthetic peptides, and no lot-specific characterisation (identity, bioactivity, host-cell impurities, endotoxin) is supplied.

### klow
INHERITED IDENTITY AMBIGUITY PLUS UNVERIFIED COMPOSITION, ACROSS FOUR COMPONENTS. Commonly marketed as GHK-Cu + BPC-157 + TB-500 + KPV, but the exact per-vial composition and ratios are supplier-specified and NOT VERIFIED, and the listing states only "Standard" with no quantities. Contains TB-500, whose designation covers two chemically different substances differing in mass by roughly 5.6-fold. Also contains KPV, whose own page documents a database name collision returning a non-peptide near 192 g/mol. No per-component quantitation is supplied, and a redox-active copper complex shares the vial with oxidation-sensitive peptides.

### lipo-c
COMPOSITION NOT VERIFIED AND NO QUANTITIES STATED. Lipo-C is a lipotropic mixture commonly marketed as methionine, inositol and choline with added B vitamins, but the exact per-vial composition and ratios are supplier-specified and NOT VERIFIED, and the product listing states only "Standard" with no quantities for any component. No molecular formula exists for the product. No component is a peptide. No randomised controlled trial of a lipotropic injection mixture for weight loss was identified in the PubMed-indexed literature.

### tb-500
IDENTITY NOT RESOLVABLE. Material sold as "TB-500" is either full-length thymosin beta-4 (43 residues, approx 4963 Da) or the short fragment Ac-LKKTETQ (thymosin beta-4 17-23, approx 889 Da) - a roughly 5.6-fold mass difference. Which entity this product contains is not stated and cannot be determined from supplier information. The page states both possibilities and asserts neither. Resolving this requires a lot-specific certificate or an explicit supplier statement of molecular identity.

## Per-product table

| Product | Status | Main words | FAQs | Meta len |
|---|---|---|---|---|
| 5-amino-1mq | BLOCKED | 3209 | 10 | 124 |
| ahk-cu | NEEDS VERIFICATION | 2067 | 10 | 154 |
| aod9604 | NEEDS VERIFICATION | 2850 | 10 | 135 |
| ara-290 | NEEDS VERIFICATION | 2890 | 10 | 132 |
| bac-water | NEEDS VERIFICATION | 2919 | 10 | 152 |
| bpc-157-tb-500-blend | BLOCKED | 3158 | 10 | 134 |
| bpc-157 | NEEDS VERIFICATION | 2402 | 10 | 144 |
| cagrilintide | NEEDS VERIFICATION | 2187 | 10 | 157 |
| cjc-1295-ipamorelin | NEEDS VERIFICATION | 2195 | 10 | 157 |
| cjc-1295-no-dac | NEEDS VERIFICATION | 2321 | 10 | 148 |
| cjc-1295-with-dac | NEEDS VERIFICATION | 2059 | 10 | 149 |
| dhea | NEEDS VERIFICATION | 3142 | 10 | 128 |
| dihexa | NEEDS VERIFICATION | 2670 | 10 | 147 |
| dsip | NEEDS VERIFICATION | 2656 | 10 | 117 |
| epitalon | NEEDS VERIFICATION | 2732 | 10 | 150 |
| ghk-cu | NEEDS VERIFICATION | 2225 | 10 | 147 |
| ghrp-2 | NEEDS VERIFICATION | 2090 | 10 | 151 |
| ghrp-6 | NEEDS VERIFICATION | 2125 | 10 | 149 |
| glow | BLOCKED | 3368 | 10 | 135 |
| glp-1trz | NEEDS VERIFICATION | 2024 | 10 | 150 |
| glp-3rta | NEEDS VERIFICATION | 2093 | 10 | 155 |
| glutathione | NEEDS VERIFICATION | 3090 | 10 | 132 |
| h-frag | NEEDS VERIFICATION | 2574 | 10 | 117 |
| hcg | BLOCKED | 3051 | 10 | 148 |
| igf-1-lr3 | BLOCKED | 3063 | 10 | 152 |
| ipamorelin | NEEDS VERIFICATION | 2014 | 10 | 143 |
| kisspeptin | NEEDS VERIFICATION | 2940 | 10 | 126 |
| klow | BLOCKED | 3479 | 10 | 140 |
| kpv | NEEDS VERIFICATION | 2088 | 10 | 147 |
| l-carnitine | NEEDS VERIFICATION | 3113 | 10 | 130 |
| lipo-c | BLOCKED | 3258 | 10 | 137 |
| ll-37 | NEEDS VERIFICATION | 2091 | 10 | 140 |
| melanotan-1 | NEEDS VERIFICATION | 2939 | 10 | 133 |
| melanotan-2 | NEEDS VERIFICATION | 2929 | 10 | 141 |
| mots-c | NEEDS VERIFICATION | 2092 | 10 | 154 |
| nad | NEEDS VERIFICATION | 3098 | 10 | 140 |
| oxytocin | NEEDS VERIFICATION | 2978 | 10 | 138 |
| pt-141 | NEEDS VERIFICATION | 3005 | 10 | 133 |
| selank | NEEDS VERIFICATION | 2102 | 10 | 152 |
| semaglutide | NEEDS VERIFICATION | 2144 | 10 | 152 |
| semax-selank-blend | NEEDS VERIFICATION | 2091 | 10 | 143 |
| semax | NEEDS VERIFICATION | 2074 | 10 | 146 |
| sermorelin | NEEDS VERIFICATION | 2088 | 10 | 156 |
| snap-8 | NEEDS VERIFICATION | 3038 | 10 | 135 |
| ss-31 | NEEDS VERIFICATION | 2051 | 10 | 135 |
| tb-500 | BLOCKED | 2988 | 10 | 135 |
| tesamorelin-ipamorelin-blend | NEEDS VERIFICATION | 2318 | 10 | 160 |
| tesamorelin | NEEDS VERIFICATION | 2006 | 10 | 148 |
| thymosin-alpha-1 | NEEDS VERIFICATION | 2983 | 10 | 151 |
| vip | NEEDS VERIFICATION | 3043 | 10 | 125 |

## Outstanding items

### Resolved

- **Image filenames — DONE.** All 79 images renamed in place to canonical `amino-` names. Verified against the project's own `isBlockedProductImage()`: 14 blocked before, 0 after. Reversible via `image-rename-manifest.json`.
- **Identity resolutions — DONE.** See the pass above: one product fully unblocked, six materially advanced.

### Closed by user decision

- **Vial label purity text ("PURITY ≥ 99%") — DEFERRED.** User will update COA when received from the client; not to be raised meanwhile. Note for the record: the same `purity: "≥99.0% Purity"` string is also hard-coded for every product in `lib/masterCatalogData.ts`, so it exists in code as well as on the labels.

### Still open

1. **Two frontend fixes undeployed** in the working tree: the dossier-rendering fix and the BAC Water image fix, both in `components/product/ProductClient.tsx`. Both `tsc` clean, neither committed.
2. **Eight products remain BLOCKED.** Each now needs exactly one supplier fact: which TB-500 molecule (clears four products at once), which 5-Amino-1MQ salt, HCG lot potency, Glow/Klow/Lipo-C component quantities, and IGF-1 LR3 lot characterisation.
3. **Nothing is published.** All content is JSON in `content-generation/`; no database writes, no image uploads, no commits, no deploys.
