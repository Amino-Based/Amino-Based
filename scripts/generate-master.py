import json

# Full 98-item catalog definition extracted from user's PDF
catalog_data = [
    {
        "name": "5-Amino-1MQ",
        "slug": "5-amino-1mq",
        "basePrice": 77.00,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "150mg", "size": "Single", "sku": "5AMINO-150MG", "price": 77.00}
        ]
    },
    {
        "name": "5-Amino-1MQ Spray",
        "slug": "5-amino-1mq-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "50mg", "size": "Single", "sku": "SPR-5AMINO-50MG", "price": 84.99}
        ]
    },
    {
        "name": "AHK-CU",
        "slug": "ahk-cu",
        "basePrice": 49.99,
        "category": "Cosmetic & Skin Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "50mg", "size": "Single", "sku": "AHKCU-50MG", "price": 49.99},
            {"strength": "100mg", "size": "Single", "sku": "AHKCU-100MG", "price": 59.99}
        ]
    },
    {
        "name": "AHK-Cu Spray",
        "slug": "ahk-cu-spray",
        "basePrice": 64.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "50mg", "size": "Single", "sku": "SPR-AHKCU-50MG", "price": 64.99},
            {"strength": "100mg", "size": "Single", "sku": "SPR-AHKCU-100MG", "price": 74.99}
        ]
    },
    {
        "name": "AOD9604",
        "slug": "aod9604",
        "basePrice": 49.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "AOD960-5MG", "price": 49.99},
            {"strength": "10mg", "size": "Single", "sku": "AOD960-10MG", "price": 59.99}
        ]
    },
    {
        "name": "AOD9604 Spray",
        "slug": "aod9604-spray",
        "basePrice": 69.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-AOD960-5MG", "price": 69.99},
            {"strength": "10mg", "size": "Single", "sku": "SPR-AOD960-10MG", "price": 84.99}
        ]
    },
    {
        "name": "ARA-290",
        "slug": "ara-290",
        "basePrice": 44.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "ARA290-10MG", "price": 44.99}
        ]
    },
    {
        "name": "ARA-290 Spray",
        "slug": "ara-290-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-ARA290-10MG", "price": 59.99}
        ]
    },
    {
        "name": "BAC Water",
        "slug": "bac-water",
        "basePrice": 9.00,
        "category": "Reconstitution & Lab Supplies",
        "isSpray": False,
        "variants": [
            {"strength": "3mL", "size": "Single", "sku": "BACWAT-3ML", "price": 9.00},
            {"strength": "10mL", "size": "Single", "sku": "BACWAT-10ML", "price": 15.00},
            {"strength": "30mL", "size": "Single", "sku": "BACWAT-30ML", "price": 28.00}
        ]
    },
    {
        "name": "BPC-157",
        "slug": "bpc-157",
        "basePrice": 59.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "featured": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "BPC157-5MG", "price": 59.99},
            {"strength": "10mg", "size": "Single", "sku": "BPC157-10MG", "price": 69.99}
        ]
    },
    {
        "name": "BPC-157 / TB-500 Blend",
        "slug": "bpc-157-tb-500-blend",
        "basePrice": 69.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "featured": True,
        "variants": [
            {"strength": "5mg/5mg", "size": "Single", "sku": "BPCTB5-55", "price": 69.99},
            {"strength": "10mg/10mg", "size": "Single", "sku": "BPCTB5-1010", "price": 94.99}
        ]
    },
    {
        "name": "BPC-157 / TB-500 Blend Spray",
        "slug": "bpc-157-tb-500-blend-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg/5mg", "size": "Single", "sku": "SPR-BPCTB5-5MG5MG", "price": 84.99},
            {"strength": "10mg/10mg", "size": "Single", "sku": "SPR-BPCTB5-10MG10MG", "price": 109.99}
        ]
    },
    {
        "name": "BPC-157 Spray",
        "slug": "bpc-157-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-BPC157-5MG", "price": 59.99},
            {"strength": "10mg", "size": "Single", "sku": "SPR-BPC157-10MG", "price": 74.99}
        ]
    },
    {
        "name": "Cagrilintide",
        "slug": "cagrilintide",
        "basePrice": 74.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "CAGRIL-10MG", "price": 74.99}
        ]
    },
    {
        "name": "Cagrilintide Spray",
        "slug": "cagrilintide-spray",
        "basePrice": 89.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-CAGRIL-10MG", "price": 89.99}
        ]
    },
    {
        "name": "CJC-1295 / Ipamorelin",
        "slug": "cjc-1295-ipamorelin",
        "basePrice": 69.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "5mg/5mg", "size": "Single", "sku": "CJCIPA-5MG5MG", "price": 69.99}
        ]
    },
    {
        "name": "CJC-1295 / Ipamorelin Spray",
        "slug": "cjc-1295-ipamorelin-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg/5mg", "size": "Single", "sku": "SPR-CJCIPA-5MG5MG", "price": 84.99}
        ]
    },
    {
        "name": "CJC-1295 No DAC",
        "slug": "cjc-1295-no-dac",
        "basePrice": 79.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "CJC129-10MG", "price": 79.99}
        ]
    },
    {
        "name": "CJC-1295 No DAC Spray",
        "slug": "cjc-1295-no-dac-spray",
        "basePrice": 94.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-CJC129-10MG", "price": 94.99}
        ]
    },
    {
        "name": "CJC-1295 with DAC",
        "slug": "cjc-1295-with-dac",
        "basePrice": 69.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "CJCWDA-5MG", "price": 69.99}
        ]
    },
    {
        "name": "CJC-1295 with DAC Spray",
        "slug": "cjc-1295-with-dac-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-CJCWDA-5MG", "price": 84.99}
        ]
    },
    {
        "name": "DHEA",
        "slug": "dhea",
        "basePrice": 70.00,
        "category": "Longevity & Anti-Aging Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "DHEA-10MG", "price": 70.00}
        ]
    },
    {
        "name": "Dihexa",
        "slug": "dihexa",
        "basePrice": 65.99,
        "category": "Cognitive & Nootropic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "DIHEXA-10MG", "price": 65.99}
        ]
    },
    {
        "name": "Dihexa Spray",
        "slug": "dihexa-spray",
        "basePrice": 69.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-DIHEXA-10MG", "price": 69.99}
        ]
    },
    {
        "name": "DSIP",
        "slug": "dsip",
        "basePrice": 49.99,
        "category": "Cognitive & Nootropic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "DSIP-10MG", "price": 49.99}
        ]
    },
    {
        "name": "DSIP Spray",
        "slug": "dsip-spray",
        "basePrice": 64.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-DSIP-10MG", "price": 64.99}
        ]
    },
    {
        "name": "Epitalon",
        "slug": "epitalon",
        "basePrice": 44.99,
        "category": "Longevity & Anti-Aging Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "EPITAL-10MG", "price": 44.99},
            {"strength": "50mg", "size": "Single", "sku": "EPITAL-50MG", "price": 79.99}
        ]
    },
    {
        "name": "Epitalon Spray",
        "slug": "epitalon-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-EPITAL-10MG", "price": 59.99},
            {"strength": "50mg", "size": "Single", "sku": "SPR-EPITAL-50MG", "price": 94.99}
        ]
    },
    {
        "name": "GHK-CU",
        "slug": "ghk-cu",
        "basePrice": 49.99,
        "category": "Cosmetic & Skin Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "50mg", "size": "Single", "sku": "GHKCU-50MG", "price": 49.99},
            {"strength": "100mg", "size": "Single", "sku": "GHKCU-100MG", "price": 80.00}
        ]
    },
    {
        "name": "GHK-CU Spray",
        "slug": "ghk-cu-spray",
        "basePrice": 64.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "50mg", "size": "Single", "sku": "SPR-GHKCU-50MG", "price": 64.99},
            {"strength": "100mg", "size": "Single", "sku": "SPR-GHKCU-100MG", "price": 74.99}
        ]
    },
    {
        "name": "GHRP-2",
        "slug": "ghrp-2",
        "basePrice": 44.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "GHRP2-10MG", "price": 44.99}
        ]
    },
    {
        "name": "GHRP-2 Spray",
        "slug": "ghrp-2-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-GHRP2-10MG", "price": 59.99}
        ]
    },
    {
        "name": "GHRP-6",
        "slug": "ghrp-6",
        "basePrice": 44.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "GHRP6-10MG", "price": 44.99}
        ]
    },
    {
        "name": "GHRP-6 Spray",
        "slug": "ghrp-6-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-GHRP6-10MG", "price": 59.99}
        ]
    },
    {
        "name": "Glow",
        "slug": "glow",
        "basePrice": 94.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "Standard", "size": "Single", "sku": "GLOW-STD", "price": 94.99}
        ]
    },
    {
        "name": "Glow Blend Spray",
        "slug": "glow-blend-spray",
        "basePrice": 109.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "70mg", "size": "Single", "sku": "SPR-GLOW-70MG", "price": 109.99}
        ]
    },
    {
        "name": "GLP-1TRZ",
        "slug": "glp-1trz",
        "basePrice": 59.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "featured": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "TIRZEP-10MG", "price": 59.99},
            {"strength": "20mg", "size": "Single", "sku": "TIRZEP-20MG", "price": 79.99},
            {"strength": "30mg", "size": "Single", "sku": "TIRZEP-30MG", "price": 104.99},
            {"strength": "60mg", "size": "Single", "sku": "TIRZEP-60MG", "price": 159.99}
        ]
    },
    {
        "name": "GLP-1TRZ Spray",
        "slug": "glp-1trz-spray",
        "basePrice": 74.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-TIRZEP-10MG", "price": 74.99},
            {"strength": "20mg", "size": "Single", "sku": "SPR-TIRZEP-20MG", "price": 94.99},
            {"strength": "30mg", "size": "Single", "sku": "SPR-TIRZEP-30MG", "price": 119.99},
            {"strength": "60mg", "size": "Single", "sku": "SPR-TIRZEP-60MG", "price": 174.99}
        ]
    },
    {
        "name": "GLP-3RTA",
        "slug": "glp-3rta",
        "basePrice": 79.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "featured": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "RETATR-10MG", "price": 79.99},
            {"strength": "20mg", "size": "Single", "sku": "RETATR-20MG", "price": 124.99},
            {"strength": "30mg", "size": "Single", "sku": "RETATR-30MG", "price": 174.99},
            {"strength": "60mg", "size": "Single", "sku": "RETATR-60MG", "price": 249.99}
        ]
    },
    {
        "name": "GLP-3RTA Spray",
        "slug": "glp-3rta-spray",
        "basePrice": 94.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-RETATR-10MG", "price": 94.99},
            {"strength": "20mg", "size": "Single", "sku": "SPR-RETATR-20MG", "price": 139.99},
            {"strength": "30mg", "size": "Single", "sku": "SPR-RETATR-30MG", "price": 189.99},
            {"strength": "60mg", "size": "Single", "sku": "SPR-RETATR-60MG", "price": 264.99}
        ]
    },
    {
        "name": "Glutathione",
        "slug": "glutathione",
        "basePrice": 49.99,
        "category": "Longevity & Anti-Aging Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "600mg", "size": "Single", "sku": "GLUTAT-600MG", "price": 49.99},
            {"strength": "1500mg", "size": "Single", "sku": "GLUTAT-1500MG", "price": 69.99}
        ]
    },
    {
        "name": "Glutathione Spray",
        "slug": "glutathione-spray",
        "basePrice": 64.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "600mg", "size": "Single", "sku": "SPR-GLUTAT-600MG", "price": 64.99},
            {"strength": "1500mg", "size": "Single", "sku": "SPR-GLUTAT-1500MG", "price": 84.99}
        ]
    },
    {
        "name": "H Frag",
        "slug": "h-frag",
        "basePrice": 49.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "HFRAG-5MG", "price": 49.99}
        ]
    },
    {
        "name": "H Frag Spray",
        "slug": "h-frag-spray",
        "basePrice": 64.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-HFRAG-5MG", "price": 64.99}
        ]
    },
    {
        "name": "HCG",
        "slug": "hcg",
        "basePrice": 59.99,
        "category": "Sexual & Hormonal Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "5000 IU", "size": "Single", "sku": "HCG-5000IU", "price": 59.99},
            {"strength": "10000 IU", "size": "Single", "sku": "HCG-10000IU", "price": 69.99}
        ]
    },
    {
        "name": "HCG Spray",
        "slug": "hcg-spray",
        "basePrice": 74.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5000 IU", "size": "Single", "sku": "SPR-HCG-5000IU", "price": 74.99},
            {"strength": "10000 IU", "size": "Single", "sku": "SPR-HCG-10000IU", "price": 84.99}
        ]
    },
    {
        "name": "IGF-1 LR3",
        "slug": "igf-1-lr3",
        "basePrice": 69.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "1mg", "size": "Single", "sku": "IGF13-1MG", "price": 69.99}
        ]
    },
    {
        "name": "IGF-1 LR3 Spray",
        "slug": "igf-1-lr3-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "1mg", "size": "Single", "sku": "SPR-IGF13-1MG", "price": 84.99}
        ]
    },
    {
        "name": "Ipamorelin",
        "slug": "ipamorelin",
        "basePrice": 44.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "IPAMOR-5MG", "price": 44.99},
            {"strength": "10mg", "size": "Single", "sku": "IPAMOR-10MG", "price": 59.99}
        ]
    },
    {
        "name": "Ipamorelin Spray",
        "slug": "ipamorelin-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-IPAMOR-5MG", "price": 59.99},
            {"strength": "10mg", "size": "Single", "sku": "SPR-IPAMOR-10MG", "price": 74.99}
        ]
    },
    {
        "name": "Kisspeptin",
        "slug": "kisspeptin",
        "basePrice": 59.99,
        "category": "Sexual & Hormonal Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "KISSPE-10MG", "price": 59.99}
        ]
    },
    {
        "name": "Kisspeptin Spray",
        "slug": "kisspeptin-spray",
        "basePrice": 94.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-KISSPE-10MG", "price": 94.99}
        ]
    },
    {
        "name": "Klow",
        "slug": "klow",
        "basePrice": 109.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "Standard", "size": "Single", "sku": "KLOW-STD", "price": 109.99}
        ]
    },
    {
        "name": "KLOW Blend Spray",
        "slug": "klow-blend-spray",
        "basePrice": 124.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "80mg", "size": "Single", "sku": "SPR-KLOW-80MG", "price": 124.99}
        ]
    },
    {
        "name": "KPV",
        "slug": "kpv",
        "basePrice": 59.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "KPV-10MG", "price": 59.99}
        ]
    },
    {
        "name": "KPV Spray",
        "slug": "kpv-spray",
        "basePrice": 85.00,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-KPV-5MG", "price": 85.00}
        ]
    },
    {
        "name": "L-Carnitine",
        "slug": "l-carnitine",
        "basePrice": 25.00,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "Standard", "size": "Single", "sku": "LCARNI-STD", "price": 25.00}
        ]
    },
    {
        "name": "L-Carnitine Spray",
        "slug": "l-carnitine-spray",
        "basePrice": 74.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "400mg", "size": "Single", "sku": "SPR-LCARNI-400MG", "price": 74.99}
        ]
    },
    {
        "name": "Lipo-C",
        "slug": "lipo-c",
        "basePrice": 39.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "Standard", "size": "Single", "sku": "LIPOC-STD", "price": 39.99}
        ]
    },
    {
        "name": "Lipo-C Spray",
        "slug": "lipo-c-spray",
        "basePrice": 54.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "120mg", "size": "Single", "sku": "SPR-LIPOC-120MG", "price": 54.99}
        ]
    },
    {
        "name": "LL-37",
        "slug": "ll-37",
        "basePrice": 49.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "Standard", "size": "Single", "sku": "LL37-STD", "price": 49.99}
        ]
    },
    {
        "name": "LL-37 Spray",
        "slug": "ll-37-spray",
        "basePrice": 64.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "1mg", "size": "Single", "sku": "SPR-LL37-1MG", "price": 64.99}
        ]
    },
    {
        "name": "Melanotan 1 Spray",
        "slug": "melanotan-1-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-MELANO1-10MG", "price": 59.99}
        ]
    },
    {
        "name": "Melanotan II Spray",
        "slug": "melanotan-2-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-MELANO2-10MG", "price": 59.99}
        ]
    },
    {
        "name": "Melanotan-1",
        "slug": "melanotan-1",
        "basePrice": 44.99,
        "category": "Cosmetic & Skin Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "MELANO1-10MG", "price": 44.99}
        ]
    },
    {
        "name": "Melanotan-2",
        "slug": "melanotan-2",
        "basePrice": 44.99,
        "category": "Cosmetic & Skin Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "MELANO2-10MG", "price": 44.99}
        ]
    },
    {
        "name": "MOTS-C",
        "slug": "mots-c",
        "basePrice": 59.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "MOTSC-10MG", "price": 59.99},
            {"strength": "40mg", "size": "Single", "sku": "MOTSC-40MG", "price": 89.99}
        ]
    },
    {
        "name": "MOTS-c Spray",
        "slug": "mots-c-spray",
        "basePrice": 74.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-MOTSC-10MG", "price": 74.99},
            {"strength": "40mg", "size": "Single", "sku": "SPR-MOTSC-40MG", "price": 104.99}
        ]
    },
    {
        "name": "NAD+",
        "slug": "nad",
        "basePrice": 64.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "500mg", "size": "Single", "sku": "NAD-500MG", "price": 64.99},
            {"strength": "1000mg", "size": "Single", "sku": "NAD-1000MG", "price": 89.99}
        ]
    },
    {
        "name": "NAD+ Spray",
        "slug": "nad-spray",
        "basePrice": 83.00,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "50mg", "size": "Single", "sku": "SPR-NAD-50MG", "price": 83.00},
            {"strength": "100mg", "size": "Single", "sku": "SPR-NAD-100MG", "price": 94.00}
        ]
    },
    {
        "name": "Oxytocin",
        "slug": "oxytocin",
        "basePrice": 71.99,
        "category": "Sexual & Hormonal Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "OXYTOC-10MG", "price": 71.99}
        ]
    },
    {
        "name": "Oxytocin Spray",
        "slug": "oxytocin-spray",
        "basePrice": 74.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-OXYTOC-10MG", "price": 74.99}
        ]
    },
    {
        "name": "PT-141",
        "slug": "pt-141",
        "basePrice": 59.99,
        "category": "Sexual & Hormonal Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "PT141-10MG", "price": 59.99}
        ]
    },
    {
        "name": "PT-141 Spray",
        "slug": "pt-141-spray",
        "basePrice": 74.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-PT141-10MG", "price": 74.99}
        ]
    },
    {
        "name": "Selank",
        "slug": "selank",
        "basePrice": 44.99,
        "category": "Cognitive & Nootropic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SELANK-10MG", "price": 44.99}
        ]
    },
    {
        "name": "Selank Spray",
        "slug": "selank-spray",
        "basePrice": 75.00,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "100mcg", "size": "Single", "sku": "SPR-SELANK-100MCG", "price": 75.00},
            {"strength": "300mcg", "size": "Single", "sku": "SPR-SELANK-300MCG", "price": 85.00}
        ]
    },
    {
        "name": "Semaglutide",
        "slug": "semaglutide",
        "basePrice": 54.99,
        "category": "GLP-1 & Metabolic Research Compounds",
        "isSpray": False,
        "featured": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SEMAGL-5MG", "price": 54.99},
            {"strength": "10mg", "size": "Single", "sku": "SEMAGL-10MG", "price": 69.99},
            {"strength": "20mg", "size": "Single", "sku": "SEMAGL-20MG", "price": 94.99},
            {"strength": "30mg", "size": "Single", "sku": "SEMAGL-30MG", "price": 119.99}
        ]
    },
    {
        "name": "Semaglutide Spray",
        "slug": "semaglutide-spray",
        "basePrice": 69.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-SEMAGL-5MG", "price": 69.99},
            {"strength": "10mg", "size": "Single", "sku": "SPR-SEMAGL-10MG", "price": 84.99},
            {"strength": "20mg", "size": "Single", "sku": "SPR-SEMAGL-20MG", "price": 109.99},
            {"strength": "30mg", "size": "Single", "sku": "SPR-SEMAGL-30MG", "price": 134.99}
        ]
    },
    {
        "name": "Semax",
        "slug": "semax",
        "basePrice": 49.99,
        "category": "Cognitive & Nootropic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SEMAX-10MG", "price": 49.99},
            {"strength": "30mg", "size": "Single", "sku": "SEMAX-30MG", "price": 79.99}
        ]
    },
    {
        "name": "Semax + Selank Blend",
        "slug": "semax-selank-blend",
        "basePrice": 69.99,
        "category": "Cognitive & Nootropic Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg/10mg", "size": "Single", "sku": "SEMAXS-10MG10MG", "price": 69.99}
        ]
    },
    {
        "name": "Semax + Selank Blend Spray",
        "slug": "semax-selank-blend-spray",
        "basePrice": 120.00,
        "category": "Cognitive & Nootropic Research Compounds",
        "isSpray": True,
        "variants": [
            {"strength": "300mcg", "size": "Single", "sku": "SPR-SEMAXS-300MCG", "price": 120.00}
        ]
    },
    {
        "name": "Semax Spray",
        "slug": "semax-spray",
        "basePrice": 75.00,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-SEMAX-5MG", "price": 75.00}
        ]
    },
    {
        "name": "Sermorelin",
        "slug": "sermorelin",
        "basePrice": 69.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SERMOR-10MG", "price": 69.99},
            {"strength": "20mg", "size": "Single", "sku": "SERMOR-20MG", "price": 99.99}
        ]
    },
    {
        "name": "Sermorelin Spray",
        "slug": "sermorelin-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-SERMOR-10MG", "price": 84.99},
            {"strength": "20mg", "size": "Single", "sku": "SPR-SERMOR-20MG", "price": 114.99}
        ]
    },
    {
        "name": "Snap-8",
        "slug": "snap-8",
        "basePrice": 44.99,
        "category": "Cosmetic & Skin Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SNAP8-10MG", "price": 44.99},
            {"strength": "20mg", "size": "Single", "sku": "SNAP8-20MG", "price": 59.99}
        ]
    },
    {
        "name": "Snap-8 Spray",
        "slug": "snap-8-spray",
        "basePrice": 59.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-SNAP8-10MG", "price": 59.99},
            {"strength": "20mg", "size": "Single", "sku": "SPR-SNAP8-20MG", "price": 74.99}
        ]
    },
    {
        "name": "SS-31",
        "slug": "ss-31",
        "basePrice": 64.99,
        "category": "Longevity & Anti-Aging Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SS31-10MG", "price": 64.99},
            {"strength": "50mg", "size": "Single", "sku": "SS31-50MG", "price": 119.99}
        ]
    },
    {
        "name": "SS-31 Spray",
        "slug": "ss-31-spray",
        "basePrice": 79.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-SS31-10MG", "price": 79.99},
            {"strength": "50mg", "size": "Single", "sku": "SPR-SS31-50MG", "price": 134.99}
        ]
    },
    {
        "name": "TB-500",
        "slug": "tb-500",
        "basePrice": 49.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "featured": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "TB500-5MG", "price": 49.99},
            {"strength": "10mg", "size": "Single", "sku": "TB500-10MG", "price": 74.99}
        ]
    },
    {
        "name": "TB-500 Spray",
        "slug": "tb-500-spray",
        "basePrice": 69.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "5mg", "size": "Single", "sku": "SPR-TB500-5MG", "price": 69.99},
            {"strength": "10mg", "size": "Single", "sku": "SPR-TB500-10MG", "price": 94.99}
        ]
    },
    {
        "name": "Tesamorelin",
        "slug": "tesamorelin",
        "basePrice": 74.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "TESAMO-10MG", "price": 74.99},
            {"strength": "20mg", "size": "Single", "sku": "TESAMO-20MG", "price": 109.99}
        ]
    },
    {
        "name": "Tesamorelin + Ipamorelin Blend",
        "slug": "tesamorelin-ipamorelin-blend",
        "basePrice": 89.99,
        "category": "Growth Hormone Secretagogue Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "6.3mg", "size": "Single", "sku": "TESALP-63MG", "price": 89.99},
            {"strength": "13mg", "size": "Single", "sku": "TESALP-13MG", "price": 129.99}
        ]
    },
    {
        "name": "Tesamorelin / Ipamorelin Blend Spray",
        "slug": "tesamorelin-ipamorelin-spray",
        "basePrice": 104.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "6mg/3mg", "size": "Single", "sku": "SPR-TESALP-6MG3MG", "price": 104.99},
            {"strength": "13mg/3mg", "size": "Single", "sku": "SPR-TESALP-13MG3MG", "price": 144.99}
        ]
    },
    {
        "name": "Tesamorelin Spray",
        "slug": "tesamorelin-spray",
        "basePrice": 94.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-TESAMO-10MG", "price": 94.99},
            {"strength": "20mg", "size": "Single", "sku": "SPR-TESAMO-20MG", "price": 124.99}
        ]
    },
    {
        "name": "Thymosin Alpha-1",
        "slug": "thymosin-alpha-1",
        "basePrice": 69.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "Standard", "size": "Single", "sku": "THYMOS-STD", "price": 69.99}
        ]
    },
    {
        "name": "Thymosin Alpha-1 Spray",
        "slug": "thymosin-alpha-1-spray",
        "basePrice": 84.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-THYMOS-10MG", "price": 84.99}
        ]
    },
    {
        "name": "VIP",
        "slug": "vip",
        "basePrice": 74.99,
        "category": "Healing & Recovery Research Compounds",
        "isSpray": False,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "VIP-10MG", "price": 74.99}
        ]
    },
    {
        "name": "VIP Spray",
        "slug": "vip-spray",
        "basePrice": 89.99,
        "category": "Nasal Sprays",
        "isSpray": True,
        "variants": [
            {"strength": "10mg", "size": "Single", "sku": "SPR-VIP-10MG", "price": 89.99}
        ]
    }
]

print(f"Total products defined: {len(catalog_data)}")

