import { config } from "dotenv";
import fs from "fs";
import path from "path";
config({ path: ".env" });
// override: .env.local wins over .env, matching the Next.js convention the rest of the
// project follows. dotenv does not overwrite already-set vars, so without this the
// broader .env would silently take precedence and could point the seed at another database.
config({ path: ".env.local", override: true });

// Dynamic imports: this file is loaded as ESM (package.json has "type": "module"),
// where static imports are hoisted above the dotenv calls above, so payload.config's
// `process.env.PAYLOAD_SECRET` read would run before the env vars are actually loaded.
const { getPayload } = await import("payload");
const { default: configPromise } = await import("../payload.config");

// Both required: the old defaults created admin@aminobased.com with a published password.
const ADMIN_EMAIL: string = process.env.SEED_ADMIN_EMAIL ?? "";
if (!ADMIN_EMAIL) throw new Error("SEED_ADMIN_EMAIL is required to run the seed script.");
const ADMIN_PASSWORD: string = process.env.SEED_ADMIN_PASSWORD ?? "";
if (!ADMIN_PASSWORD) throw new Error("SEED_ADMIN_PASSWORD is required to run the seed script.");

const categories = [
  { name: "GLP-1 & Metabolic", sortOrder: 1 },
  { name: "Recovery Peptides", sortOrder: 2 },
  { name: "Peptide Bundles", sortOrder: 3 },
  { name: "Nasal Sprays", sortOrder: 4 },
  { name: "Cosmetic & Skin", sortOrder: 5 },
  { name: "Endocrine Research", sortOrder: 6 },
  { name: "Growth Hormone Secretagogue", sortOrder: 7 },
  { name: "Cognitive & Nootropic", sortOrder: 8 },
  { name: "Longevity Research", sortOrder: 9 },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const COA_IMAGE_DIR = path.resolve(process.cwd(), "public/COA");

// Rotating template variants so the boilerplate sections of the 25 product pages
// aren't byte-identical (avoids thin/duplicate-content SEO issues) while the
// research-focus text (the substantive part) stays fully unique per product.
const PRODUCT_DETAILS_TEMPLATES = [
  (name: string) =>
    `${name} ships as a lyophilized powder in a sealed, light-protected vial with a printed lot number for full batch traceability. Each unit includes handling and reconstitution guidance for laboratory use.`,
  (name: string) =>
    `Supplied as a sterile lyophilized powder, ${name} arrives in a light-protected vial labeled with its lot number for traceability, along with reconstitution and storage guidance for research applications.`,
  (name: string) =>
    `${name} is packaged as a single-use lyophilized vial, sealed and light-protected to preserve peptide integrity during shipping and storage, with a lot-specific label for batch traceability.`,
];

const QUALITY_TEMPLATES = [
  (name: string) =>
    `Every batch of ${name} undergoes third-party HPLC and mass spectrometry testing to verify purity and identity, with a Certificate of Analysis (COA) issued for the specific lot number shipped.`,
  (name: string) =>
    `${name} is manufactured under strict quality controls and independently verified via HPLC and mass spectrometry before release, ensuring each vial matches its published purity and identity profile.`,
  (name: string) =>
    `Each lot of ${name} is third-party tested for purity, identity, and sterility, with COA documentation available for download so researchers can confirm the exact specifications of their shipped batch.`,
];

const COMPLIANCE_TEMPLATES = [
  (name: string) =>
    `${name} is sold strictly for laboratory and research use. It is not a drug, food, or cosmetic product, has not been evaluated by the FDA, and is not intended for human or animal consumption.`,
  (name: string) =>
    `This product is intended for in-vitro laboratory research only. ${name} is not approved for human or veterinary use, has not been reviewed by the FDA, and must not be used as a food, drug, or cosmetic.`,
  (name: string) =>
    `${name} is distributed exclusively for qualified research purposes. It carries no FDA approval, is not intended for human consumption, and must be handled only by trained laboratory personnel.`,
];

function buildTabsContent(name: string, mechanism: string, index: number) {
  return {
    productDetailsDescription: PRODUCT_DETAILS_TEMPLATES[index % 3](name),
    researchFocusDescription: mechanism,
    qualityPurityDescription: QUALITY_TEMPLATES[index % 3](name),
    complianceNoticeDescription: COMPLIANCE_TEMPLATES[index % 3](name),
  };
}

function buildFaqs(name: string, mechanismShort: string) {
  return [
    {
      question: `What is ${name} researched for?`,
      answer: mechanismShort,
    },
    {
      question: `How should ${name} be stored?`,
      answer:
        "Store the lyophilized vial in a freezer at -20°C, protected from light. Once reconstituted, keep refrigerated at 2-8°C and use within the timeframe noted on the Certificate of Analysis.",
    },
    {
      question: `Is a Certificate of Analysis included with ${name}?`,
      answer:
        "Yes. Every batch is third-party tested and a COA matching the lot number on your vial is available for download from your account after purchase.",
    },
    {
      question: "What is the minimum order requirement?",
      answer:
        "There is no minimum order quantity. Bulk pricing is available on select bundles for qualified research institutions — contact us for details.",
    },
  ];
}

function buildSeo(name: string) {
  return {
    seoTitle: `Buy ${name} | Research Peptides – Amino Based`,
    seoDescription: `Shop ${name} research peptide, third-party tested with a Certificate of Analysis for purity verification. Fast, discreet shipping. For laboratory research use only.`,
  };
}

type ProductSeed = {
  name: string;
  categoryName: string;
  price: number;
  sku: string;
  mechanism: string;
  isBestSeller?: boolean;
  /** Kept so a real, Amino Based-issued certificate can be wired back in by dropping a
   *  file into public/COA and setting this field. No row sets it today. */
  coaImage?: string;
};

const RETA_MECHANISM =
  "Retatrutide is a triple agonist engineered to activate GIP, GLP-1, and glucagon receptors simultaneously, a mechanism researchers are studying for its combined effects on appetite signaling, energy expenditure, and lipid metabolism. Pre-clinical models have shown more pronounced body-composition shifts than single- or dual-receptor agonists.";
const TIRZ_MECHANISM =
  "Tirzepatide activates both the GIP and GLP-1 receptors, a dual-agonist mechanism studied for its synergistic influence on insulin secretion, gastric emptying, and appetite regulation. Research models have used it to probe how combined incretin signaling compares to GLP-1-only pathways.";
const SEMA_MECHANISM =
  "Semaglutide is a long-acting GLP-1 receptor agonist studied extensively for its effects on glucose-dependent insulin secretion, gastric emptying, and satiety signaling in metabolic research models.";
const METX_MECHANISM =
  "Metabolic X combines a GIP/GLP-1/glucagon triple agonist with an amylin receptor agonist in a single research vial, allowing investigators to study the combined downstream effects of incretin and amylin pathway activation on appetite and energy balance.";
const BPC157_MECHANISM =
  "BPC-157 is a pentadecapeptide derived from a protective compound found in gastric juice, studied for its potential role in angiogenesis, fibroblast migration, and accelerated tissue repair across gut, tendon, and ligament research models.";
const TB500_MECHANISM =
  "TB-500 is a synthetic fragment of Thymosin Beta-4 studied for its actin-binding properties, which researchers associate with cell migration, blood vessel formation, and the early stages of wound-healing cascades.";
const KPV_MECHANISM =
  "KPV is the C-terminal tripeptide of alpha-MSH, studied for its ability to inhibit NF-kB signaling independent of melanocortin receptor activation, making it a focus of anti-inflammatory and gut-barrier research.";
const WOLVERINE_MECHANISM =
  "Wolverine is a research blend combining BPC-157 and TB-500 in a single vial, formulated for investigators studying the combined tissue-repair and angiogenic pathways of both peptides side by side.";
const TESA_MECHANISM =
  "Tesamorelin is a synthetic analog of growth hormone-releasing hormone (GHRH), studied for its stimulatory effect on pulsatile growth hormone release from the pituitary and its downstream influence on visceral fat metabolism in research models.";
const MOTSC_MECHANISM =
  "MOTS-c is a mitochondrial-derived peptide studied as an exercise mimetic, with research models examining its role in AMPK activation, cellular energy homeostasis, and metabolic stress response.";
const IGF1LR3_MECHANISM =
  "IGF-1 LR3 is a modified analog of insulin-like growth factor 1 with a substituted arginine at position 3, engineered to reduce binding-protein affinity and extend half-life, making it a focus of research into cell proliferation and muscle tissue growth pathways.";
const SEMAX_MECHANISM =
  "Semax is a synthetic heptapeptide analog of ACTH(4-10), studied for its influence on brain-derived neurotrophic factor (BDNF) expression and its potential neuroprotective and cognitive-research applications.";
const DSIP_MECHANISM =
  "DSIP (Delta Sleep-Inducing Peptide) is studied for its modulatory role in sleep-wake regulation and stress-hormone response, with research models examining its interaction with GABAergic and opioid signaling pathways.";
const PT141_MECHANISM =
  "PT-141 (Bremelanotide) is a melanocortin receptor agonist studied for its activation of central nervous system pathways associated with arousal signaling, independent of the vascular mechanisms studied in other compounds.";
const EPITALON_MECHANISM =
  "Epitalon is a synthetic tetrapeptide studied for its proposed role in telomerase activation and circadian rhythm regulation, making it a recurring subject in longevity and cellular-aging research models.";
const NAD_MECHANISM =
  "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme central to cellular energy metabolism, studied for its role in sirtuin activation, mitochondrial function, and DNA repair pathways relevant to aging research.";
const THYMOSIN_MECHANISM =
  "Thymosin Alpha-1 is studied for its immunomodulatory effects, including its influence on T-cell maturation and cytokine signaling, making it a focus of immune-function and host-defense research models.";
const GHKCU_MECHANISM =
  "GHK-Cu is a naturally occurring copper-binding tripeptide studied for its role in collagen and elastin synthesis, fibroblast stimulation, and tissue-remodeling pathways relevant to skin and wound-healing research.";
const AHKCU_MECHANISM =
  "AHK-Cu is a copper-binding tripeptide structurally related to GHK-Cu, studied for its comparable effects on dermal fibroblast activity and its potential advantages in stability and receptor-binding research models.";
const GLOW_MECHANISM =
  "GLOW is a research blend combining GHK-Cu, BPC-157, and TB-500, formulated for investigators studying the combined tissue-remodeling, angiogenic, and copper-peptide pathways relevant to skin and healing research.";
const KLOW_MECHANISM =
  "KLOW expands on the GLOW blend by adding KPV alongside GHK-Cu, BPC-157, and TB-500, giving researchers a single vial to study combined anti-inflammatory, tissue-repair, and copper-peptide pathways together.";

const products: ProductSeed[] = [
  { name: "Retatrutide 10 mg", categoryName: "GLP-1 & Metabolic", price: 64.99, sku: "RETA-10MG", mechanism: RETA_MECHANISM, isBestSeller: true },
  { name: "Retatrutide 30 mg", categoryName: "GLP-1 & Metabolic", price: 99.99, sku: "RETA-30MG", mechanism: RETA_MECHANISM },
  { name: "Tirzepatide 10 mg", categoryName: "GLP-1 & Metabolic", price: 61.99, sku: "TIRZ-10MG", mechanism: TIRZ_MECHANISM, isBestSeller: true },
  { name: "Tirzepatide 30 mg", categoryName: "GLP-1 & Metabolic", price: 89.99, sku: "TIRZ-30MG", mechanism: TIRZ_MECHANISM },
  { name: "Semaglutide 10 mg", categoryName: "GLP-1 & Metabolic", price: 59.99, sku: "SEMA-10MG", mechanism: SEMA_MECHANISM, isBestSeller: true },
  { name: "Metabolic X (Reta x Cangri) 10 mg", categoryName: "GLP-1 & Metabolic", price: 69.99, sku: "METX-10MG", mechanism: METX_MECHANISM },
  { name: "BPC-157 10 mg", categoryName: "Recovery Peptides", price: 59.99, sku: "BPC157-10MG", mechanism: BPC157_MECHANISM, isBestSeller: true },
  { name: "TB-500 10 mg", categoryName: "Recovery Peptides", price: 59.99, sku: "TB500-10MG", mechanism: TB500_MECHANISM },
  { name: "KPV 10 mg", categoryName: "Recovery Peptides", price: 59.99, sku: "KPV-10MG", mechanism: KPV_MECHANISM },
  { name: "Wolverine 20 mg", categoryName: "Recovery Peptides", price: 84.99, sku: "WOLV-20MG", mechanism: WOLVERINE_MECHANISM },
  { name: "Tesamorelin 10 mg", categoryName: "Growth Hormone Secretagogue", price: 64.99, sku: "TESA-10MG", mechanism: TESA_MECHANISM },
  { name: "Tesamorelin 20 mg", categoryName: "Growth Hormone Secretagogue", price: 89.99, sku: "TESA-20MG", mechanism: TESA_MECHANISM },
  { name: "Mots C 10 mg", categoryName: "Growth Hormone Secretagogue", price: 59.99, sku: "MOTSC-10MG", mechanism: MOTSC_MECHANISM },
  { name: "Mots C 20 mg", categoryName: "Growth Hormone Secretagogue", price: 79.99, sku: "MOTSC-20MG", mechanism: MOTSC_MECHANISM },
  { name: "IGF1-LR3 1 mg", categoryName: "Growth Hormone Secretagogue", price: 99.99, sku: "IGF1LR3-1MG", mechanism: IGF1LR3_MECHANISM },
  { name: "Semax 10 mg", categoryName: "Cognitive & Nootropic", price: 59.99, sku: "SEMAX-10MG", mechanism: SEMAX_MECHANISM },
  { name: "DSIP 10 mg", categoryName: "Cognitive & Nootropic", price: 59.99, sku: "DSIP-10MG", mechanism: DSIP_MECHANISM },
  { name: "PT-141 10 mg", categoryName: "Endocrine Research", price: 59.99, sku: "PT141-10MG", mechanism: PT141_MECHANISM },
  { name: "Epitalon 10 mg", categoryName: "Longevity Research", price: 59.99, sku: "EPI-10MG", mechanism: EPITALON_MECHANISM },
  { name: "NAD+ 500 mg", categoryName: "Longevity Research", price: 68.99, sku: "NAD-500MG", mechanism: NAD_MECHANISM },
  { name: "Thymosin 5 mg", categoryName: "Longevity Research", price: 44.99, sku: "THY-5MG", mechanism: THYMOSIN_MECHANISM },
  { name: "GHKCU 50 mg", categoryName: "Cosmetic & Skin", price: 54.99, sku: "GHKCU-50MG", mechanism: GHKCU_MECHANISM },
  { name: "AHKCU 50 mg", categoryName: "Cosmetic & Skin", price: 54.99, sku: "AHKCU-50MG", mechanism: AHKCU_MECHANISM },
  { name: "GLOW 70 mg", categoryName: "Cosmetic & Skin", price: 79.99, sku: "GLOW-70MG", mechanism: GLOW_MECHANISM },
  { name: "KLOW 80 mg", categoryName: "Cosmetic & Skin", price: 89.99, sku: "KLOW-80MG", mechanism: KLOW_MECHANISM },
];

const blogPosts = [
  {
    title: "Breakthroughs in Peptide Synthesis for Next-Gen Therapeutics",
    slug: "breakthroughs-in-peptide-synthesis",
    excerpt:
      "A look at how modern solid-phase synthesis techniques are pushing purity and yield further than ever before.",
    category: "Metabolic research",
    readTime: "8 min read",
  },
  {
    title: "Best Practices for Maintaining Peptide Stability in Storage",
    slug: "peptide-stability-storage-best-practices",
    excerpt:
      "Temperature, reconstitution, and light exposure all affect peptide stability — here's what the research says.",
    category: "Recovery protocols",
    readTime: "6 min read",
  },
  {
    title: "Understanding the Role of GLP-1 Agonists in Metabolic Research",
    slug: "glp-1-agonists-metabolic-research",
    excerpt:
      "GLP-1 receptor agonists have become a cornerstone of metabolic research — here's the mechanism overview.",
    category: "Metabolic research",
    readTime: "10 min read",
  },
];

async function seed() {
  const payload = await getPayload({ config: configPromise });

  // Admin user
  const existingAdmin = await payload.find({
    collection: "users",
    where: { email: { equals: ADMIN_EMAIL } },
  });
  let adminId: string | number;
  if (existingAdmin.docs.length === 0) {
    const created = await payload.create({
      collection: "users",
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        emailVerified: true,
        firstName: "Amino",
        lastName: "Based",
      },
    });
    adminId = created.id;
    // Never echo ADMIN_PASSWORD — the operator supplied it, and this line lands in CI logs.
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  } else {
    adminId = existingAdmin.docs[0].id;
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
  }

  // Categories
  const categoryIdByName = new Map<string, string | number>();
  for (const category of categories) {
    const slug = slugify(category.name);
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
    });
    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: "categories",
        data: { name: category.name, slug, isVisible: true, sortOrder: category.sortOrder },
      });
      categoryIdByName.set(category.name, created.id);
      console.log(`Created category: ${category.name}`);
    } else {
      categoryIdByName.set(category.name, existing.docs[0].id);
      console.log(`Category already exists: ${category.name}`);
    }
  }

  // No product images are seeded, and no placeholder Media record is created.
  //
  // Product imagery is resolved at render time by lib/products/productImage.ts, which returns a
  // verified Amino Based asset when the product identity and dosage match the label in the
  // photograph, and /placeholder-product.svg otherwise. Keeping that the single decision point
  // means the seed never has to pick an image.
  //
  // What used to live here uploaded public/product-card-image.png — a Prime Time Bio Labs
  // Retatrutide vial — into Media and attached it to every product lacking its own photo. That
  // file and the whole public/product-images directory have been deleted as PTBL assets. Do not
  // reintroduce a seeded product image without confirming the file is Amino Based artwork.

  // Wiping the catalog is opt-in and nothing else enables it: .env.local points at the live
  // database, so an unguarded `pnpm seed` would destroy production products, orphan every
  // orders_items row that references them, and flood the trash collection. The default path
  // below upserts by SKU instead, which keeps each product id and therefore every order line,
  // review, cart and wishlist entry pointing at it.
  if (process.env.SEED_RESET === "true") {
    const existingProducts = await payload.find({ collection: "products", limit: 1000 });
    for (const doc of existingProducts.docs) {
      await payload.delete({ collection: "products", id: doc.id });
    }
    if (existingProducts.docs.length > 0) {
      console.log(`SEED_RESET=true — removed ${existingProducts.docs.length} existing product(s).`);
    }
  }

  // Products
  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    const categoryId = categoryIdByName.get(product.categoryName);
    const tabsContent = buildTabsContent(product.name, product.mechanism, index);
    const seo = buildSeo(product.name);
    const mechanismShort = product.mechanism.split(". ")[0] + ".";


    let coaFileId: string | number | null = null;
    if (product.coaImage) {
      const coaTitle = `${product.name} COA`;
      const existingCoa = await payload.find({
        collection: "documents",
        where: { title: { equals: coaTitle } },
        limit: 1,
      });
      if (existingCoa.docs.length > 0) {
        coaFileId = existingCoa.docs[0].id;
      } else {
        const coaPath = path.join(COA_IMAGE_DIR, product.coaImage);
        if (fs.existsSync(coaPath)) {
          const fileBuffer = fs.readFileSync(coaPath);
          const createdDoc = await payload.create({
            collection: "documents",
            data: { title: coaTitle },
            file: {
              data: fileBuffer,
              mimetype: "image/jpeg",
              name: product.coaImage,
              size: fileBuffer.length,
            },
          });
          coaFileId = createdDoc.id;
        } else {
          console.warn(`COA image not found for ${product.name}: ${coaPath}`);
        }
      }
    }

    const productData = {
      name: product.name,
      description: mechanismShort,
      price: product.price,
      stock: 500,
      status: "active",
      isVisible: true,
      isBestSeller: !!product.isBestSeller,
      hasVariants: false,
      sku: product.sku,
      categories: categoryId ? [categoryId] : [],
      // `images` is deliberately NOT part of the shared payload. It is set only when creating a
      // product (below). Including it here would send it on the update path too, and an update
      // carrying `images: []` would clear whatever images an admin had attached in the CMS.
      ...tabsContent,
      ...seo,
      coaFile: coaFileId || undefined,
      // coaBatchNumber / coaPurity / coaAnalyzedDate are deliberately not seeded. The
      // collection fields remain, but a batch number, purity figure or analysis date is a
      // claim about a real assay — it gets populated from an actual Amino Based certificate
      // or not at all. Never generate one here.
      faqs: buildFaqs(product.name, mechanismShort),
    };

    // Match on SKU, which is unique across this seed list. Updating in place preserves the
    // product id, so existing orders, reviews, carts and wishlists keep resolving.
    const existingProduct = await payload.find({
      collection: "products",
      where: { sku: { equals: product.sku } },
      limit: 1,
    });
    if (existingProduct.docs.length > 0) {
      // Partial update: `images` is absent from productData, so Payload leaves the existing
      // associations alone. Any photography an admin has attached since the last seed survives.
      await payload.update({
        collection: "products",
        id: existingProduct.docs[0].id,
        data: productData as any,
      });
      console.log(`Updated product: ${product.name}${coaFileId ? " (with COA)" : ""} (images preserved)`);
    } else {
      // New products start with no images. Render falls back to lib/products/productImage.ts.
      await payload.create({
        collection: "products",
        data: { ...productData, images: [] } as any,
      });
      console.log(`Created product: ${product.name}${coaFileId ? " (with COA)" : ""} (no images)`);
    }
  }

  // Shipping
  const existingShippingZone = await payload.find({
    collection: "shippingzones",
    where: { name: { equals: "United States" } },
    limit: 1,
  });
  if (existingShippingZone.docs.length === 0) {
    await payload.create({
      collection: "shippingzones",
      data: {
        name: "United States",
        methods: [
          {
            method: "Standard Shipping",
            price: 20,
            estimatedDays: 5,
          },
        ],
      } as any,
    });
    console.log("Created shipping zone: United States ($20.00 standard shipping)");
  } else {
    console.log("Shipping zone already exists: United States");
  }

  // Blog posts
  for (const post of blogPosts) {
    const existing = await payload.find({
      collection: "blog-posts",
      where: { slug: { equals: post.slug } },
    });
    if (existing.docs.length > 0) {
      console.log(`Blog post already exists: ${post.title}`);
      continue;
    }
    await payload.create({
      collection: "blog-posts",
      data: {
        title: post.title,
        slug: post.slug,
        author: adminId,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        status: "published",
        publishedAt: new Date().toISOString(),
      } as any,
    });
    console.log(`Created blog post: ${post.title}`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
