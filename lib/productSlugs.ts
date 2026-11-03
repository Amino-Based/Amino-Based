/**
 * Single source of truth for canonical product slugs and 301 redirect mappings.
 *
 * Generated from user master catalog specification.
 */

/** Known 301 redirects from legacy / dosage-suffixed slugs to canonical short slugs. */
export const PRODUCT_SLUG_REDIRECTS: Record<string, string> = {
  // Multi-variant products
  "retatrutide-10-mg": "glp-3rta",
  "retatrutide-30-mg": "glp-3rta",
  "retatrutide-10mg": "glp-3rta",
  "retatrutide-30mg": "glp-3rta",
  "retatrutide": "glp-3rta",
  "glp-3rt": "glp-3rta",
  
  "tirzepatide-10-mg": "glp-1trz",
  "tirzepatide-30-mg": "glp-1trz",
  "tirzepatide-10mg": "glp-1trz",
  "tirzepatide-30mg": "glp-1trz",
  "tirzepatide": "glp-1trz",
  "glp-2tz": "glp-1trz",
  
  "tesamorelin-10-mg": "tesamorelin",
  "tesamorelin-20-mg": "tesamorelin",
  "tesamorelin-10mg": "tesamorelin",
  "tesamorelin-20mg": "tesamorelin",
  
  "mots-c-10-mg": "mots-c",
  "mots-c-20-mg": "mots-c",
  "mots-c-10mg": "mots-c",
  "mots-c-40mg": "mots-c",

  // Single-variant and alias cleanups -> canonical single slug
  "semaglutide-10-mg": "semaglutide",
  "semaglutide-10mg": "semaglutide",
  "semaglutide-5mg": "semaglutide",
  "semaglutide-20mg": "semaglutide",
  "semaglutide-30mg": "semaglutide",
  
  "metabolic-x": "metabolic-x-reta-x-cangri",
  "metabolic-x-reta-x-cangri": "glp-3rta",
  
  "bpc-157-10-mg": "bpc-157",
  "bpc-157-10mg": "bpc-157",
  "bpc-157-5mg": "bpc-157",
  
  "tb-500-10-mg": "tb-500",
  "tb-500-10mg": "tb-500",
  "tb-500-5mg": "tb-500",
  
  "kpv-10-mg": "kpv",
  "kpv-10mg": "kpv",
  "kpv-5mg": "kpv",
  
  "wolverine": "bpc-157-tb-500-blend",
  "wolverine-blend": "bpc-157-tb-500-blend",
  
  "igf1-lr3": "igf-1-lr3",
  "igf1-lr3-1-mg": "igf-1-lr3",
  "igf1-lr3-1mg": "igf-1-lr3",
  
  "semax-10-mg": "semax",
  "semax-10mg": "semax",
  "semax-30mg": "semax",
  
  "dsip-10-mg": "dsip",
  "dsip-10mg": "dsip",
  
  "pt-141-10-mg": "pt-141",
  "pt-141-10mg": "pt-141",
  
  "epithalon": "epitalon",
  "epitalon-10-mg": "epitalon",
  "epitalon-10mg": "epitalon",
  
  "nad-plus": "nad",
  "nad-500-mg": "nad",
  "nad-500mg": "nad",
  "nad-1000mg": "nad",
  
  "thymosin": "thymosin-alpha-1",
  "thymosin-beta-4": "tb-500",
  "thymosin-beta": "tb-500",
  
  "ghkcu": "ghk-cu",
  "ghkcu-50-mg": "ghk-cu",
  "ghkcu-50mg": "ghk-cu",
  "ghkcu-100mg": "ghk-cu",
  
  "ahkcu": "ahk-cu",
  "ahkcu-50-mg": "ahk-cu",
  "ahkcu-50mg": "ahk-cu",
  
  "glow-blend": "glow-blend-spray",
  "glow-70-mg": "glow-blend-spray",
  "glow-70mg": "glow-blend-spray",
  
  "klow-blend": "klow-blend-spray",
  "klow-80-mg": "klow-blend-spray",
  "klow-80mg": "klow-blend-spray",
};

/** All canonical product slugs from the master PDF catalog. */
export const CANONICAL_PRODUCT_SLUGS = new Set([
  "5-amino-1mq",
  "5-amino-1mq-spray",
  "ahk-cu",
  "ahk-cu-spray",
  "aod9604",
  "aod9604-spray",
  "ara-290",
  "ara-290-spray",
  "bac-water",
  "bpc-157",
  "bpc-157-spray",
  "bpc-157-tb-500-blend",
  "bpc-157-tb-500-blend-spray",
  "cagrilintide",
  "cagrilintide-spray",
  "cjc-1295-ipamorelin",
  "cjc-1295-ipamorelin-spray",
  "cjc-1295-no-dac",
  "cjc-1295-no-dac-spray",
  "cjc-1295-with-dac",
  "cjc-1295-with-dac-spray",
  "dhea",
  "dihexa",
  "dihexa-spray",
  "dsip",
  "dsip-spray",
  "epitalon",
  "epitalon-spray",
  "ghk-cu",
  "ghk-cu-spray",
  "ghrp-2",
  "ghrp-2-spray",
  "ghrp-6",
  "ghrp-6-spray",
  "glow",
  "glow-blend-spray",
  "glp-1trz",
  "glp-1trz-spray",
  "glp-3rta",
  "glp-3rta-spray",
  "glutathione",
  "glutathione-spray",
  "h-frag",
  "h-frag-spray",
  "hcg",
  "hcg-spray",
  "igf-1-lr3",
  "igf-1-lr3-spray",
  "ipamorelin",
  "ipamorelin-spray",
  "kisspeptin",
  "kisspeptin-spray",
  "klow",
  "klow-blend-spray",
  "kpv",
  "kpv-spray",
  "l-carnitine",
  "l-carnitine-spray",
  "lipo-c",
  "lipo-c-spray",
  "ll-37",
  "ll-37-spray",
  "melanotan-1",
  "melanotan-1-spray",
  "melanotan-2",
  "melanotan-2-spray",
  "mots-c",
  "mots-c-spray",
  "nad",
  "nad-spray",
  "oxytocin",
  "oxytocin-spray",
  "pt-141",
  "pt-141-spray",
  "selank",
  "selank-spray",
  "semaglutide",
  "semaglutide-spray",
  "semax",
  "semax-selank-blend",
  "semax-selank-blend-spray",
  "semax-spray",
  "sermorelin",
  "sermorelin-spray",
  "snap-8",
  "snap-8-spray",
  "ss-31",
  "ss-31-spray",
  "tb-500",
  "tb-500-spray",
  "tesamorelin",
  "tesamorelin-ipamorelin-blend",
  "tesamorelin-ipamorelin-spray",
  "tesamorelin-spray",
  "thymosin-alpha-1",
  "thymosin-alpha-1-spray",
  "vip",
  "vip-spray",
]);

/** Returns canonical slug if valid, or redirect target if legacy, or null if unknown. */
export function resolveCanonicalProductSlug(slug: string): string | null {
  const normalized = (slug || "").toLowerCase().trim();
  if (CANONICAL_PRODUCT_SLUGS.has(normalized)) return normalized;
  if (PRODUCT_SLUG_REDIRECTS[normalized]) return PRODUCT_SLUG_REDIRECTS[normalized];
  return null;
}
