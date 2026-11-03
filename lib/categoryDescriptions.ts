// Display-only overrides for category tiles: a compliance-safe label (where the
// DB name reads as a consumer-outcome term) and a one-line description. These
// never touch the underlying category record, slug, or `?category=` query value
// — only what's rendered on the tile.
export const CATEGORY_DISPLAY_NAME: Record<string, string> = {
  "Recovery Peptides": "Recovery Peptides",
  "Endocrine Research": "Endocrine Research",
  "Longevity Research": "Longevity Research",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "GLP-1 & Metabolic":
    "Incretin and metabolic-pathway compounds for in-vitro receptor and signalling studies.",
  "Recovery Peptides":
    "Peptides studied in tissue-model, angiogenesis and wound-model research.",
  "Peptide Bundles":
    "Multi-compound sets assembled for comparator and dose-range study designs.",
  "Nasal Sprays":
    "Pre-formulated research solutions in intranasal delivery format for laboratory use.",
  "Cosmetic & Skin":
    "Compounds used in dermal model, collagen and pigmentation research.",
  "Endocrine Research":
    "Hormone-pathway peptides for receptor-binding and endocrine assay work.",
  "Growth Hormone Secretagogue":
    "GHRH and ghrelin-receptor analogues for somatotropic axis research.",
  "Cognitive & Nootropic":
    "Neuropeptides studied in cognition, neuroprotection and synaptic models.",
  "Longevity Research":
    "Mitochondrial, senescence and cellular-ageing research compounds.",
};

export function getCategoryDisplayName(name: string): string {
  return CATEGORY_DISPLAY_NAME[name] ?? name;
}

export function getCategoryDescription(name: string): string | undefined {
  return CATEGORY_DESCRIPTIONS[name];
}
