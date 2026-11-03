// Master catalog generated from user specification PDF (98 products)

export interface MasterCatalogVariant {
  strength: string;
  size: string;
  sku: string;
  price: number;
}

export interface MasterCatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  description: string;
  purity: string;
  dosageOptions: string[];
  variants: MasterCatalogVariant[];
  image: string;
  isSpray: boolean;
  featured?: boolean;
}

export const MASTER_CATEGORIES = [
  "GLP-1 & Metabolic Research Compounds",
  "Healing & Recovery Research Compounds",
  "Growth Hormone Secretagogue Research Compounds",
  "Longevity & Anti-Aging Research Compounds",
  "Cognitive & Nootropic Research Compounds",
  "Cosmetic & Skin Research Compounds",
  "Sexual & Hormonal Research Compounds",
  "Nasal Sprays",
  "Reconstitution & Lab Supplies",
];

export const MASTER_PRODUCTS: MasterCatalogProduct[] = [
  {
    id: "5-amino-1mq",
    name: "5-Amino-1MQ",
    slug: "5-amino-1mq",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 77.00,
    description: "Analytical grade 5-Amino-1MQ synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["150mg"],
    variants: [
          {
                "strength": "150mg",
                "size": "Single",
                "sku": "5AMINO-150MG",
                "price": 77.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "5-amino-1mq-spray",
    name: "5-Amino-1MQ Spray",
    slug: "5-amino-1mq-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade 5-Amino-1MQ Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["50mg"],
    variants: [
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SPR-5AMINO-50MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "ahk-cu",
    name: "AHK-CU",
    slug: "ahk-cu",
    category: "Cosmetic & Skin Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade AHK-CU synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["50mg", "100mg"],
    variants: [
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "AHKCU-50MG",
                "price": 49.99
          },
          {
                "strength": "100mg",
                "size": "Single",
                "sku": "AHKCU-100MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "ahk-cu-spray",
    name: "AHK-Cu Spray",
    slug: "ahk-cu-spray",
    category: "Nasal Sprays",
    basePrice: 64.99,
    description: "Analytical grade AHK-Cu Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["50mg", "100mg"],
    variants: [
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SPR-AHKCU-50MG",
                "price": 64.99
          },
          {
                "strength": "100mg",
                "size": "Single",
                "sku": "SPR-AHKCU-100MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "aod9604",
    name: "AOD9604",
    slug: "aod9604",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade AOD9604 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "AOD960-5MG",
                "price": 49.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "AOD960-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_glp3rta.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "aod9604-spray",
    name: "AOD9604 Spray",
    slug: "aod9604-spray",
    category: "Nasal Sprays",
    basePrice: 69.99,
    description: "Analytical grade AOD9604 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-AOD960-5MG",
                "price": 69.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-AOD960-10MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_glp3rta.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "ara-290",
    name: "ARA-290",
    slug: "ara-290",
    category: "Healing & Recovery Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade ARA-290 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "ARA290-10MG",
                "price": 44.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "ara-290-spray",
    name: "ARA-290 Spray",
    slug: "ara-290-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade ARA-290 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-ARA290-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "bac-water",
    name: "BAC Water",
    slug: "bac-water",
    category: "Reconstitution & Lab Supplies",
    basePrice: 9.00,
    description: "Analytical grade BAC Water synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["3mL", "10mL", "30mL"],
    variants: [
          {
                "strength": "3mL",
                "size": "Single",
                "sku": "BACWAT-3ML",
                "price": 9.0
          },
          {
                "strength": "10mL",
                "size": "Single",
                "sku": "BACWAT-10ML",
                "price": 15.0
          },
          {
                "strength": "30mL",
                "size": "Single",
                "sku": "BACWAT-30ML",
                "price": 28.0
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    slug: "bpc-157",
    category: "Healing & Recovery Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade BPC-157 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "BPC157-5MG",
                "price": 59.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "BPC157-10MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: false,
    featured: true,
  },
  {
    id: "bpc-157-tb-500-blend",
    name: "BPC-157 / TB-500 Blend",
    slug: "bpc-157-tb-500-blend",
    category: "Healing & Recovery Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade BPC-157 / TB-500 Blend synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg/5mg", "10mg/10mg"],
    variants: [
          {
                "strength": "5mg/5mg",
                "size": "Single",
                "sku": "BPCTB5-55",
                "price": 69.99
          },
          {
                "strength": "10mg/10mg",
                "size": "Single",
                "sku": "BPCTB5-1010",
                "price": 94.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: false,
    featured: true,
  },
  {
    id: "bpc-157-tb-500-blend-spray",
    name: "BPC-157 / TB-500 Blend Spray",
    slug: "bpc-157-tb-500-blend-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade BPC-157 / TB-500 Blend Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg/5mg", "10mg/10mg"],
    variants: [
          {
                "strength": "5mg/5mg",
                "size": "Single",
                "sku": "SPR-BPCTB5-5MG5MG",
                "price": 84.99
          },
          {
                "strength": "10mg/10mg",
                "size": "Single",
                "sku": "SPR-BPCTB5-10MG10MG",
                "price": 109.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "bpc-157-spray",
    name: "BPC-157 Spray",
    slug: "bpc-157-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade BPC-157 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-BPC157-5MG",
                "price": 59.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-BPC157-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "cagrilintide",
    name: "Cagrilintide",
    slug: "cagrilintide",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 74.99,
    description: "Analytical grade Cagrilintide synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "CAGRIL-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_glp3rta.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "cagrilintide-spray",
    name: "Cagrilintide Spray",
    slug: "cagrilintide-spray",
    category: "Nasal Sprays",
    basePrice: 89.99,
    description: "Analytical grade Cagrilintide Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-CAGRIL-10MG",
                "price": 89.99
          }
    ],
    image: "/assets/shelf_vial_glp3rta.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    slug: "cjc-1295-ipamorelin",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade CJC-1295 / Ipamorelin synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg/5mg"],
    variants: [
          {
                "strength": "5mg/5mg",
                "size": "Single",
                "sku": "CJCIPA-5MG5MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "cjc-1295-ipamorelin-spray",
    name: "CJC-1295 / Ipamorelin Spray",
    slug: "cjc-1295-ipamorelin-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade CJC-1295 / Ipamorelin Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg/5mg"],
    variants: [
          {
                "strength": "5mg/5mg",
                "size": "Single",
                "sku": "SPR-CJCIPA-5MG5MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "cjc-1295-no-dac",
    name: "CJC-1295 No DAC",
    slug: "cjc-1295-no-dac",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 79.99,
    description: "Analytical grade CJC-1295 No DAC synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "CJC129-10MG",
                "price": 79.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "cjc-1295-no-dac-spray",
    name: "CJC-1295 No DAC Spray",
    slug: "cjc-1295-no-dac-spray",
    category: "Nasal Sprays",
    basePrice: 94.99,
    description: "Analytical grade CJC-1295 No DAC Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-CJC129-10MG",
                "price": 94.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "cjc-1295-with-dac",
    name: "CJC-1295 with DAC",
    slug: "cjc-1295-with-dac",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade CJC-1295 with DAC synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "CJCWDA-5MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "cjc-1295-with-dac-spray",
    name: "CJC-1295 with DAC Spray",
    slug: "cjc-1295-with-dac-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade CJC-1295 with DAC Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-CJCWDA-5MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "dhea",
    name: "DHEA",
    slug: "dhea",
    category: "Longevity & Anti-Aging Research Compounds",
    basePrice: 70.00,
    description: "Analytical grade DHEA synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "DHEA-10MG",
                "price": 70.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "dihexa",
    name: "Dihexa",
    slug: "dihexa",
    category: "Cognitive & Nootropic Research Compounds",
    basePrice: 65.99,
    description: "Analytical grade Dihexa synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "DIHEXA-10MG",
                "price": 65.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "dihexa-spray",
    name: "Dihexa Spray",
    slug: "dihexa-spray",
    category: "Nasal Sprays",
    basePrice: 69.99,
    description: "Analytical grade Dihexa Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-DIHEXA-10MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "dsip",
    name: "DSIP",
    slug: "dsip",
    category: "Cognitive & Nootropic Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade DSIP synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "DSIP-10MG",
                "price": 49.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "dsip-spray",
    name: "DSIP Spray",
    slug: "dsip-spray",
    category: "Nasal Sprays",
    basePrice: 64.99,
    description: "Analytical grade DSIP Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-DSIP-10MG",
                "price": 64.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "epitalon",
    name: "Epitalon",
    slug: "epitalon",
    category: "Longevity & Anti-Aging Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade Epitalon synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "50mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "EPITAL-10MG",
                "price": 44.99
          },
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "EPITAL-50MG",
                "price": 79.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "epitalon-spray",
    name: "Epitalon Spray",
    slug: "epitalon-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade Epitalon Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "50mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-EPITAL-10MG",
                "price": 59.99
          },
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SPR-EPITAL-50MG",
                "price": 94.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "ghk-cu",
    name: "GHK-CU",
    slug: "ghk-cu",
    category: "Cosmetic & Skin Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade GHK-CU synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["50mg", "100mg"],
    variants: [
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "GHKCU-50MG",
                "price": 49.99
          },
          {
                "strength": "100mg",
                "size": "Single",
                "sku": "GHKCU-100MG",
                "price": 80.0
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "ghk-cu-spray",
    name: "GHK-CU Spray",
    slug: "ghk-cu-spray",
    category: "Nasal Sprays",
    basePrice: 64.99,
    description: "Analytical grade GHK-CU Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["50mg", "100mg"],
    variants: [
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SPR-GHKCU-50MG",
                "price": 64.99
          },
          {
                "strength": "100mg",
                "size": "Single",
                "sku": "SPR-GHKCU-100MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "ghrp-2",
    name: "GHRP-2",
    slug: "ghrp-2",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade GHRP-2 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "GHRP2-10MG",
                "price": 44.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "ghrp-2-spray",
    name: "GHRP-2 Spray",
    slug: "ghrp-2-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade GHRP-2 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-GHRP2-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "ghrp-6",
    name: "GHRP-6",
    slug: "ghrp-6",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade GHRP-6 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "GHRP6-10MG",
                "price": 44.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "ghrp-6-spray",
    name: "GHRP-6 Spray",
    slug: "ghrp-6-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade GHRP-6 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-GHRP6-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "glow",
    name: "Glow",
    slug: "glow",
    category: "Healing & Recovery Research Compounds",
    basePrice: 94.99,
    description: "Analytical grade Glow synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["Standard"],
    variants: [
          {
                "strength": "Standard",
                "size": "Single",
                "sku": "GLOW-STD",
                "price": 94.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "glow-blend-spray",
    name: "Glow Blend Spray",
    slug: "glow-blend-spray",
    category: "Nasal Sprays",
    basePrice: 109.99,
    description: "Analytical grade Glow Blend Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["70mg"],
    variants: [
          {
                "strength": "70mg",
                "size": "Single",
                "sku": "SPR-GLOW-70MG",
                "price": 109.99
          }
    ],
    image: "/assets/shelf_vial_bpc157.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "glp-1trz",
    name: "GLP-1TRZ",
    slug: "glp-1trz",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade GLP-1TRZ synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg", "30mg", "60mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "TIRZEP-10MG",
                "price": 59.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "TIRZEP-20MG",
                "price": 79.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "TIRZEP-30MG",
                "price": 104.99
          },
          {
                "strength": "60mg",
                "size": "Single",
                "sku": "TIRZEP-60MG",
                "price": 159.99
          }
    ],
    image: "/assets/shelf_vial_glp1trz.png",
    isSpray: false,
    featured: true,
  },
  {
    id: "glp-1trz-spray",
    name: "GLP-1TRZ Spray",
    slug: "glp-1trz-spray",
    category: "Nasal Sprays",
    basePrice: 74.99,
    description: "Analytical grade GLP-1TRZ Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg", "30mg", "60mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-TIRZEP-10MG",
                "price": 74.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SPR-TIRZEP-20MG",
                "price": 94.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "SPR-TIRZEP-30MG",
                "price": 119.99
          },
          {
                "strength": "60mg",
                "size": "Single",
                "sku": "SPR-TIRZEP-60MG",
                "price": 174.99
          }
    ],
    image: "/assets/shelf_vial_glp1trz.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "glp-3rta",
    name: "GLP-3RTA",
    slug: "glp-3rta",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 79.99,
    description: "Analytical grade GLP-3RTA synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg", "30mg", "60mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "RETATR-10MG",
                "price": 79.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "RETATR-20MG",
                "price": 124.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "RETATR-30MG",
                "price": 174.99
          },
          {
                "strength": "60mg",
                "size": "Single",
                "sku": "RETATR-60MG",
                "price": 249.99
          }
    ],
    image: "/assets/shelf_vial_glp3rta.png",
    isSpray: false,
    featured: true,
  },
  {
    id: "glp-3rta-spray",
    name: "GLP-3RTA Spray",
    slug: "glp-3rta-spray",
    category: "Nasal Sprays",
    basePrice: 94.99,
    description: "Analytical grade GLP-3RTA Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg", "30mg", "60mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-RETATR-10MG",
                "price": 94.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SPR-RETATR-20MG",
                "price": 139.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "SPR-RETATR-30MG",
                "price": 189.99
          },
          {
                "strength": "60mg",
                "size": "Single",
                "sku": "SPR-RETATR-60MG",
                "price": 264.99
          }
    ],
    image: "/assets/shelf_vial_glp3rta.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "glutathione",
    name: "Glutathione",
    slug: "glutathione",
    category: "Longevity & Anti-Aging Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade Glutathione synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["600mg", "1500mg"],
    variants: [
          {
                "strength": "600mg",
                "size": "Single",
                "sku": "GLUTAT-600MG",
                "price": 49.99
          },
          {
                "strength": "1500mg",
                "size": "Single",
                "sku": "GLUTAT-1500MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "glutathione-spray",
    name: "Glutathione Spray",
    slug: "glutathione-spray",
    category: "Nasal Sprays",
    basePrice: 64.99,
    description: "Analytical grade Glutathione Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["600mg", "1500mg"],
    variants: [
          {
                "strength": "600mg",
                "size": "Single",
                "sku": "SPR-GLUTAT-600MG",
                "price": 64.99
          },
          {
                "strength": "1500mg",
                "size": "Single",
                "sku": "SPR-GLUTAT-1500MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "h-frag",
    name: "H Frag",
    slug: "h-frag",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade H Frag synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "HFRAG-5MG",
                "price": 49.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "h-frag-spray",
    name: "H Frag Spray",
    slug: "h-frag-spray",
    category: "Nasal Sprays",
    basePrice: 64.99,
    description: "Analytical grade H Frag Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-HFRAG-5MG",
                "price": 64.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "hcg",
    name: "HCG",
    slug: "hcg",
    category: "Sexual & Hormonal Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade HCG synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5000 IU", "10000 IU"],
    variants: [
          {
                "strength": "5000 IU",
                "size": "Single",
                "sku": "HCG-5000IU",
                "price": 59.99
          },
          {
                "strength": "10000 IU",
                "size": "Single",
                "sku": "HCG-10000IU",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "hcg-spray",
    name: "HCG Spray",
    slug: "hcg-spray",
    category: "Nasal Sprays",
    basePrice: 74.99,
    description: "Analytical grade HCG Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5000 IU", "10000 IU"],
    variants: [
          {
                "strength": "5000 IU",
                "size": "Single",
                "sku": "SPR-HCG-5000IU",
                "price": 74.99
          },
          {
                "strength": "10000 IU",
                "size": "Single",
                "sku": "SPR-HCG-10000IU",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "igf-1-lr3",
    name: "IGF-1 LR3",
    slug: "igf-1-lr3",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade IGF-1 LR3 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["1mg"],
    variants: [
          {
                "strength": "1mg",
                "size": "Single",
                "sku": "IGF13-1MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "igf-1-lr3-spray",
    name: "IGF-1 LR3 Spray",
    slug: "igf-1-lr3-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade IGF-1 LR3 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["1mg"],
    variants: [
          {
                "strength": "1mg",
                "size": "Single",
                "sku": "SPR-IGF13-1MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    slug: "ipamorelin",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade Ipamorelin synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "IPAMOR-5MG",
                "price": 44.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "IPAMOR-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "ipamorelin-spray",
    name: "Ipamorelin Spray",
    slug: "ipamorelin-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade Ipamorelin Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-IPAMOR-5MG",
                "price": 59.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-IPAMOR-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "kisspeptin",
    name: "Kisspeptin",
    slug: "kisspeptin",
    category: "Sexual & Hormonal Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade Kisspeptin synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "KISSPE-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "kisspeptin-spray",
    name: "Kisspeptin Spray",
    slug: "kisspeptin-spray",
    category: "Nasal Sprays",
    basePrice: 94.99,
    description: "Analytical grade Kisspeptin Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-KISSPE-10MG",
                "price": 94.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "klow",
    name: "Klow",
    slug: "klow",
    category: "Healing & Recovery Research Compounds",
    basePrice: 109.99,
    description: "Analytical grade Klow synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["Standard"],
    variants: [
          {
                "strength": "Standard",
                "size": "Single",
                "sku": "KLOW-STD",
                "price": 109.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "klow-blend-spray",
    name: "KLOW Blend Spray",
    slug: "klow-blend-spray",
    category: "Nasal Sprays",
    basePrice: 124.99,
    description: "Analytical grade KLOW Blend Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["80mg"],
    variants: [
          {
                "strength": "80mg",
                "size": "Single",
                "sku": "SPR-KLOW-80MG",
                "price": 124.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "kpv",
    name: "KPV",
    slug: "kpv",
    category: "Healing & Recovery Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade KPV synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "KPV-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "kpv-spray",
    name: "KPV Spray",
    slug: "kpv-spray",
    category: "Nasal Sprays",
    basePrice: 85.00,
    description: "Analytical grade KPV Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-KPV-5MG",
                "price": 85.0
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "l-carnitine",
    name: "L-Carnitine",
    slug: "l-carnitine",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 25.00,
    description: "Analytical grade L-Carnitine synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["Standard"],
    variants: [
          {
                "strength": "Standard",
                "size": "Single",
                "sku": "LCARNI-STD",
                "price": 25.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "l-carnitine-spray",
    name: "L-Carnitine Spray",
    slug: "l-carnitine-spray",
    category: "Nasal Sprays",
    basePrice: 74.99,
    description: "Analytical grade L-Carnitine Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["400mg"],
    variants: [
          {
                "strength": "400mg",
                "size": "Single",
                "sku": "SPR-LCARNI-400MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "lipo-c",
    name: "Lipo-C",
    slug: "lipo-c",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 39.99,
    description: "Analytical grade Lipo-C synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["Standard"],
    variants: [
          {
                "strength": "Standard",
                "size": "Single",
                "sku": "LIPOC-STD",
                "price": 39.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "lipo-c-spray",
    name: "Lipo-C Spray",
    slug: "lipo-c-spray",
    category: "Nasal Sprays",
    basePrice: 54.99,
    description: "Analytical grade Lipo-C Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["120mg"],
    variants: [
          {
                "strength": "120mg",
                "size": "Single",
                "sku": "SPR-LIPOC-120MG",
                "price": 54.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "ll-37",
    name: "LL-37",
    slug: "ll-37",
    category: "Healing & Recovery Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade LL-37 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["Standard"],
    variants: [
          {
                "strength": "Standard",
                "size": "Single",
                "sku": "LL37-STD",
                "price": 49.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "ll-37-spray",
    name: "LL-37 Spray",
    slug: "ll-37-spray",
    category: "Nasal Sprays",
    basePrice: 64.99,
    description: "Analytical grade LL-37 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["1mg"],
    variants: [
          {
                "strength": "1mg",
                "size": "Single",
                "sku": "SPR-LL37-1MG",
                "price": 64.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "melanotan-1-spray",
    name: "Melanotan 1 Spray",
    slug: "melanotan-1-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade Melanotan 1 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-MELANO1-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "melanotan-2-spray",
    name: "Melanotan II Spray",
    slug: "melanotan-2-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade Melanotan II Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-MELANO2-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "melanotan-1",
    name: "Melanotan-1",
    slug: "melanotan-1",
    category: "Cosmetic & Skin Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade Melanotan-1 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "MELANO1-10MG",
                "price": 44.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "melanotan-2",
    name: "Melanotan-2",
    slug: "melanotan-2",
    category: "Cosmetic & Skin Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade Melanotan-2 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "MELANO2-10MG",
                "price": 44.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "mots-c",
    name: "MOTS-C",
    slug: "mots-c",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade MOTS-C synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "40mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "MOTSC-10MG",
                "price": 59.99
          },
          {
                "strength": "40mg",
                "size": "Single",
                "sku": "MOTSC-40MG",
                "price": 89.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "mots-c-spray",
    name: "MOTS-c Spray",
    slug: "mots-c-spray",
    category: "Nasal Sprays",
    basePrice: 74.99,
    description: "Analytical grade MOTS-c Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "40mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-MOTSC-10MG",
                "price": 74.99
          },
          {
                "strength": "40mg",
                "size": "Single",
                "sku": "SPR-MOTSC-40MG",
                "price": 104.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "nad",
    name: "NAD+",
    slug: "nad",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 64.99,
    description: "Analytical grade NAD+ synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["500mg", "1000mg"],
    variants: [
          {
                "strength": "500mg",
                "size": "Single",
                "sku": "NAD-500MG",
                "price": 64.99
          },
          {
                "strength": "1000mg",
                "size": "Single",
                "sku": "NAD-1000MG",
                "price": 89.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "nad-spray",
    name: "NAD+ Spray",
    slug: "nad-spray",
    category: "Nasal Sprays",
    basePrice: 83.00,
    description: "Analytical grade NAD+ Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["50mg", "100mg"],
    variants: [
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SPR-NAD-50MG",
                "price": 83.0
          },
          {
                "strength": "100mg",
                "size": "Single",
                "sku": "SPR-NAD-100MG",
                "price": 94.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "oxytocin",
    name: "Oxytocin",
    slug: "oxytocin",
    category: "Sexual & Hormonal Research Compounds",
    basePrice: 71.99,
    description: "Analytical grade Oxytocin synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "OXYTOC-10MG",
                "price": 71.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "oxytocin-spray",
    name: "Oxytocin Spray",
    slug: "oxytocin-spray",
    category: "Nasal Sprays",
    basePrice: 74.99,
    description: "Analytical grade Oxytocin Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-OXYTOC-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "pt-141",
    name: "PT-141",
    slug: "pt-141",
    category: "Sexual & Hormonal Research Compounds",
    basePrice: 59.99,
    description: "Analytical grade PT-141 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "PT141-10MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "pt-141-spray",
    name: "PT-141 Spray",
    slug: "pt-141-spray",
    category: "Nasal Sprays",
    basePrice: 74.99,
    description: "Analytical grade PT-141 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-PT141-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "selank",
    name: "Selank",
    slug: "selank",
    category: "Cognitive & Nootropic Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade Selank synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SELANK-10MG",
                "price": 44.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "selank-spray",
    name: "Selank Spray",
    slug: "selank-spray",
    category: "Nasal Sprays",
    basePrice: 75.00,
    description: "Analytical grade Selank Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["100mcg", "300mcg"],
    variants: [
          {
                "strength": "100mcg",
                "size": "Single",
                "sku": "SPR-SELANK-100MCG",
                "price": 75.0
          },
          {
                "strength": "300mcg",
                "size": "Single",
                "sku": "SPR-SELANK-300MCG",
                "price": 85.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "semaglutide",
    name: "Semaglutide",
    slug: "semaglutide",
    category: "GLP-1 & Metabolic Research Compounds",
    basePrice: 54.99,
    description: "Analytical grade Semaglutide synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg", "20mg", "30mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SEMAGL-5MG",
                "price": 54.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SEMAGL-10MG",
                "price": 69.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SEMAGL-20MG",
                "price": 94.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "SEMAGL-30MG",
                "price": 119.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: true,
  },
  {
    id: "semaglutide-spray",
    name: "Semaglutide Spray",
    slug: "semaglutide-spray",
    category: "Nasal Sprays",
    basePrice: 69.99,
    description: "Analytical grade Semaglutide Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg", "20mg", "30mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-SEMAGL-5MG",
                "price": 69.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-SEMAGL-10MG",
                "price": 84.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SPR-SEMAGL-20MG",
                "price": 109.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "SPR-SEMAGL-30MG",
                "price": 134.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "semax",
    name: "Semax",
    slug: "semax",
    category: "Cognitive & Nootropic Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade Semax synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "30mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SEMAX-10MG",
                "price": 49.99
          },
          {
                "strength": "30mg",
                "size": "Single",
                "sku": "SEMAX-30MG",
                "price": 79.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "semax-selank-blend",
    name: "Semax + Selank Blend",
    slug: "semax-selank-blend",
    category: "Cognitive & Nootropic Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade Semax + Selank Blend synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg/10mg"],
    variants: [
          {
                "strength": "10mg/10mg",
                "size": "Single",
                "sku": "SEMAXS-10MG10MG",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "semax-selank-blend-spray",
    name: "Semax + Selank Blend Spray",
    slug: "semax-selank-blend-spray",
    category: "Cognitive & Nootropic Research Compounds",
    basePrice: 120.00,
    description: "Analytical grade Semax + Selank Blend Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["300mcg"],
    variants: [
          {
                "strength": "300mcg",
                "size": "Single",
                "sku": "SPR-SEMAXS-300MCG",
                "price": 120.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "semax-spray",
    name: "Semax Spray",
    slug: "semax-spray",
    category: "Nasal Sprays",
    basePrice: 75.00,
    description: "Analytical grade Semax Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-SEMAX-5MG",
                "price": 75.0
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    slug: "sermorelin",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade Sermorelin synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SERMOR-10MG",
                "price": 69.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SERMOR-20MG",
                "price": 99.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "sermorelin-spray",
    name: "Sermorelin Spray",
    slug: "sermorelin-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade Sermorelin Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-SERMOR-10MG",
                "price": 84.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SPR-SERMOR-20MG",
                "price": 114.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "snap-8",
    name: "Snap-8",
    slug: "snap-8",
    category: "Cosmetic & Skin Research Compounds",
    basePrice: 44.99,
    description: "Analytical grade Snap-8 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SNAP8-10MG",
                "price": 44.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SNAP8-20MG",
                "price": 59.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "snap-8-spray",
    name: "Snap-8 Spray",
    slug: "snap-8-spray",
    category: "Nasal Sprays",
    basePrice: 59.99,
    description: "Analytical grade Snap-8 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-SNAP8-10MG",
                "price": 59.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SPR-SNAP8-20MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "ss-31",
    name: "SS-31",
    slug: "ss-31",
    category: "Longevity & Anti-Aging Research Compounds",
    basePrice: 64.99,
    description: "Analytical grade SS-31 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "50mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SS31-10MG",
                "price": 64.99
          },
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SS31-50MG",
                "price": 119.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "ss-31-spray",
    name: "SS-31 Spray",
    slug: "ss-31-spray",
    category: "Nasal Sprays",
    basePrice: 79.99,
    description: "Analytical grade SS-31 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "50mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-SS31-10MG",
                "price": 79.99
          },
          {
                "strength": "50mg",
                "size": "Single",
                "sku": "SPR-SS31-50MG",
                "price": 134.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "tb-500",
    name: "TB-500",
    slug: "tb-500",
    category: "Healing & Recovery Research Compounds",
    basePrice: 49.99,
    description: "Analytical grade TB-500 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "TB500-5MG",
                "price": 49.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "TB500-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: false,
    featured: true,
  },
  {
    id: "tb-500-spray",
    name: "TB-500 Spray",
    slug: "tb-500-spray",
    category: "Nasal Sprays",
    basePrice: 69.99,
    description: "Analytical grade TB-500 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["5mg", "10mg"],
    variants: [
          {
                "strength": "5mg",
                "size": "Single",
                "sku": "SPR-TB500-5MG",
                "price": 69.99
          },
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-TB500-10MG",
                "price": 94.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    slug: "tesamorelin",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 74.99,
    description: "Analytical grade Tesamorelin synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "TESAMO-10MG",
                "price": 74.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "TESAMO-20MG",
                "price": 109.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "tesamorelin-ipamorelin-blend",
    name: "Tesamorelin + Ipamorelin Blend",
    slug: "tesamorelin-ipamorelin-blend",
    category: "Growth Hormone Secretagogue Research Compounds",
    basePrice: 89.99,
    description: "Analytical grade Tesamorelin + Ipamorelin Blend synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["6.3mg", "13mg"],
    variants: [
          {
                "strength": "6.3mg",
                "size": "Single",
                "sku": "TESALP-63MG",
                "price": 89.99
          },
          {
                "strength": "13mg",
                "size": "Single",
                "sku": "TESALP-13MG",
                "price": 129.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: false,
    featured: false,
  },
  {
    id: "tesamorelin-ipamorelin-spray",
    name: "Tesamorelin / Ipamorelin Blend Spray",
    slug: "tesamorelin-ipamorelin-spray",
    category: "Nasal Sprays",
    basePrice: 104.99,
    description: "Analytical grade Tesamorelin / Ipamorelin Blend Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["6mg/3mg", "13mg/3mg"],
    variants: [
          {
                "strength": "6mg/3mg",
                "size": "Single",
                "sku": "SPR-TESALP-6MG3MG",
                "price": 104.99
          },
          {
                "strength": "13mg/3mg",
                "size": "Single",
                "sku": "SPR-TESALP-13MG3MG",
                "price": 144.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "tesamorelin-spray",
    name: "Tesamorelin Spray",
    slug: "tesamorelin-spray",
    category: "Nasal Sprays",
    basePrice: 94.99,
    description: "Analytical grade Tesamorelin Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg", "20mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-TESAMO-10MG",
                "price": 94.99
          },
          {
                "strength": "20mg",
                "size": "Single",
                "sku": "SPR-TESAMO-20MG",
                "price": 124.99
          }
    ],
    image: "/assets/shelf_vial_semaglutide.webp",
    isSpray: true,
    featured: false,
  },
  {
    id: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    slug: "thymosin-alpha-1",
    category: "Healing & Recovery Research Compounds",
    basePrice: 69.99,
    description: "Analytical grade Thymosin Alpha-1 synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["Standard"],
    variants: [
          {
                "strength": "Standard",
                "size": "Single",
                "sku": "THYMOS-STD",
                "price": 69.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "thymosin-alpha-1-spray",
    name: "Thymosin Alpha-1 Spray",
    slug: "thymosin-alpha-1-spray",
    category: "Nasal Sprays",
    basePrice: 84.99,
    description: "Analytical grade Thymosin Alpha-1 Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-THYMOS-10MG",
                "price": 84.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: true,
    featured: false,
  },
  {
    id: "vip",
    name: "VIP",
    slug: "vip",
    category: "Healing & Recovery Research Compounds",
    basePrice: 74.99,
    description: "Analytical grade VIP synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "VIP-10MG",
                "price": 74.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: false,
    featured: false,
  },
  {
    id: "vip-spray",
    name: "VIP Spray",
    slug: "vip-spray",
    category: "Nasal Sprays",
    basePrice: 89.99,
    description: "Analytical grade VIP Spray synthesized for laboratory in-vitro assays and scientific receptor kinetics.",
    purity: "≥99.0% Purity",
    dosageOptions: ["10mg"],
    variants: [
          {
                "strength": "10mg",
                "size": "Single",
                "sku": "SPR-VIP-10MG",
                "price": 89.99
          }
    ],
    image: "/assets/shelf_vial_tb500.png",
    isSpray: true,
    featured: false,
  },
];
