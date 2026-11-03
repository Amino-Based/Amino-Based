/**
 * AUDIT-ONLY verification harness. Reads only; renders nothing; touches no database.
 * Run: npx tsx asset-audit/verify-product-images.mts
 */
import { MASTER_PRODUCTS } from "../lib/masterCatalogData.ts";
import {
  resolveProductImageUrl,
  isBlockedProductImage,
  safeProductImageUrl,
  PRODUCT_IMAGE_PLACEHOLDER,
  VERIFICATION_PENDING,
} from "../lib/products/productImage.ts";

let failures = 0;
const check = (label: string, actual: unknown, expected: unknown) => {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}\n        got ${actual}\n        exp ${expected}`);
};

// ---------------------------------------------------------------- 1. Full catalogue sweep
// Worst case: the Media record still holds the inherited PTBL upload for every product.
console.log("=== 1. All 98 catalogue products x every dosage, with a PTBL image stored in the CMS ===\n");
const byImage = new Map<string, string[]>();
for (const p of MASTER_PRODUCTS) {
  const dosages = p.dosageOptions.length ? p.dosageOptions : ["Standard"];
  for (const d of dosages) {
    const url = resolveProductImageUrl({
      name: p.name,
      slug: p.slug,
      dosage: d,
      dbImageUrl: `/product-images/${p.name.replace(/ /g, "-")}.webp`,
    });
    const list = byImage.get(url) ?? [];
    list.push(`${p.name} @ ${d}`);
    byImage.set(url, list);
  }
}
let total = 0;
for (const [img, list] of [...byImage.entries()].sort((a, b) => b[1].length - a[1].length)) {
  total += list.length;
  console.log(`${img}  (${list.length} product/dosage combinations)`);
  if (img !== PRODUCT_IMAGE_PLACEHOLDER) list.forEach((x) => console.log(`      ${x}`));
  console.log("");
}
console.log(`total combinations: ${total}`);
const ptblLeak = [...byImage.keys()].filter((u) => isBlockedProductImage(u));
console.log(`PTBL images reachable: ${ptblLeak.length === 0 ? "NONE" : ptblLeak.join(", ")}\n`);
check("no PTBL image resolves anywhere in the catalogue", ptblLeak.length, 0);

// ---------------------------------------------------------------- 2. Block list
console.log("\n=== 2. Blocking ===\n");
const mustBlock = [
  "/product-images/BPC-157-10mg.webp",
  "/product-card-image.png",
  "/product-retatrutide.png",
  "/product-image-reta.png",
  "/media/product-placeholder.webp",
  "/media/product-placeholder-400x400.webp",
  "https://r2.example.com/Retatrutide%2010%20mg.webp",
  "https://cdn.example.com/Tirzepatide_10mg.WEBP",
  "https://cdn.example.com/NAD+500MG.webp?v=2",
];
for (const u of mustBlock) check(`blocked: ${u}`, isBlockedProductImage(u), true);

const mustAllow = [
  "/assets/shelf_vial_bpc157.png",
  "/placeholder-product.svg",
  "https://r2.example.com/amino-retatrutide-10mg.webp", // documented escape hatch
  "https://r2.example.com/new-amino-photo-2026.webp",
];
for (const u of mustAllow) check(`allowed: ${u}`, isBlockedProductImage(u), false);

// ---------------------------------------------------------------- 3. Future uploads propagate
console.log("\n=== 3. Future CMS uploads take precedence ===\n");
check(
  "new CMS upload wins over the local fallback",
  resolveProductImageUrl({ name: "BPC-157", slug: "bpc-157", dosage: "10mg", dbImageUrl: "https://r2/new-bpc.webp" }),
  "https://r2/new-bpc.webp"
);
check(
  "new CMS upload gives an image to a product that had none",
  resolveProductImageUrl({ name: "Epitalon", slug: "epitalon", dosage: "10mg", dbImageUrl: "https://r2/new-epitalon.webp" }),
  "https://r2/new-epitalon.webp"
);

// ---------------------------------------------------------------- 4. Identity + dosage rules
console.log("\n=== 4. Identity and dosage rules ===\n");
check("BPC-157 10mg -> verified vial", resolveProductImageUrl({ name: "BPC-157", dosage: "10mg" }), "/assets/shelf_vial_bpc157.png");
check("BPC-157 5mg  -> placeholder (label reads 10 mg)", resolveProductImageUrl({ name: "BPC-157", dosage: "5mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("BPC-157 Spray -> placeholder (different product)", resolveProductImageUrl({ name: "BPC-157 Spray", dosage: "10mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("BPC-157/TB-500 Blend -> placeholder", resolveProductImageUrl({ name: "BPC-157 / TB-500 Blend", dosage: "10mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("TB-500 10mg -> verified vial", resolveProductImageUrl({ name: "TB-500", dosage: "10mg" }), "/assets/shelf_vial_tb500.png");
check("Semaglutide 10mg -> verified vial", resolveProductImageUrl({ name: "Semaglutide", dosage: "10mg" }), "/assets/shelf_vial_semaglutide.webp");
check("Semaglutide 30mg -> placeholder", resolveProductImageUrl({ name: "Semaglutide", dosage: "30mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("Epitalon -> placeholder (never the Semaglutide vial)", resolveProductImageUrl({ name: "Epitalon", dosage: "10mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("GLP-1TRZ -> placeholder (identity unconfirmed)", resolveProductImageUrl({ name: "GLP-1TRZ", dosage: "10mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("GLP-3RTA -> placeholder (identity unconfirmed)", resolveProductImageUrl({ name: "GLP-3RTA", dosage: "10mg" }), PRODUCT_IMAGE_PLACEHOLDER);
check("unknown product -> placeholder", resolveProductImageUrl({ name: "Totally Unknown" }), PRODUCT_IMAGE_PLACEHOLDER);

// ---------------------------------------------------------------- 5. Historical snapshots / persisted carts
console.log("\n=== 5. safeProductImageUrl (order snapshots, localStorage carts) ===\n");
check("historical PTBL snapshot -> placeholder", safeProductImageUrl("/product-images/Semaglutide-10mg.webp"), PRODUCT_IMAGE_PLACEHOLDER);
check("historical PTBL fallback -> placeholder", safeProductImageUrl("/product-card-image.png"), PRODUCT_IMAGE_PLACEHOLDER);
check("empty -> placeholder", safeProductImageUrl(undefined), PRODUCT_IMAGE_PLACEHOLDER);
check("clean Amino asset passes through", safeProductImageUrl("/assets/shelf_vial_tb500.png"), "/assets/shelf_vial_tb500.png");

console.log("\n=== Held back pending identity confirmation ===");
VERIFICATION_PENDING.forEach((v) => console.log(`  ${v.asset}  label "${v.labelText}"  closest catalogue product: ${v.closestProduct}`));

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}`);
process.exit(failures === 0 ? 0 : 1);
