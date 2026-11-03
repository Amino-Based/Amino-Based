import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local" });

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../payload.config");

async function main() {
  const payload = await getPayload({ config: configPromise });

  const categories = await payload.find({
    collection: "categories",
    limit: 100,
  });

  console.log("Found", categories.docs.length, "categories in database.");
  for (const c of categories.docs) {
    console.log(`- ID: ${c.id}, Name: "${c.name}", Slug: "${c.slug}"`);
  }

  const renameMap: Record<string, { newName: string; newSlug: string }> = {
    "Healing & Recovery": { newName: "Recovery Peptides", newSlug: "recovery-peptides" },
    "Sexual & Hormonal": { newName: "Endocrine Research", newSlug: "endocrine-research" },
    "Longevity & Anti-Aging": { newName: "Longevity Research", newSlug: "longevity-research" },
  };

  for (const doc of categories.docs) {
    const target = renameMap[doc.name];
    if (target) {
      console.log(`Updating category ID ${doc.id}: "${doc.name}" -> "${target.newName}" (${target.newSlug})`);
      await payload.update({
        collection: "categories",
        id: doc.id,
        data: {
          name: target.newName,
          slug: target.newSlug,
        },
      });
    }
  }

  const updated = await payload.find({
    collection: "categories",
    limit: 100,
    sort: "sortOrder",
  });

  console.log("\n--- VERIFIED CATEGORIES IN DATABASE ---");
  for (const c of updated.docs) {
    console.log(`• ID: ${c.id}, Name: "${c.name}", Slug: "${c.slug}"`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
