export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "GLP-1 & Metabolic": "/placeholder-wide.svg",
  "Recovery Peptides": "/placeholder-wide.svg",
  "Peptide Bundles": "/placeholder-wide.svg",
  "Nasal Sprays": "/placeholder-wide.svg",
  "Cosmetic & Skin": "/placeholder-wide.svg",
  "Endocrine Research": "/placeholder-wide.svg",
  "Growth Hormone Secretagogue": "/placeholder-wide.svg",
  "Cognitive & Nootropic": "/placeholder-wide.svg",
  "Longevity Research": "/placeholder-wide.svg",
};

export const PLACEHOLDER_CATEGORY_IMAGE = "/placeholder-wide.svg";

export function getCategoryImage(name: string): string {
  return CATEGORY_IMAGE_MAP[name] ?? PLACEHOLDER_CATEGORY_IMAGE;
}
