import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local" });
const { getPayload } = await import("payload");
const { default: configPromise } = await import("../payload.config");
const payload = await getPayload({ config: configPromise });

const posts = await payload.find({ collection: "blog-posts", limit: 100 });
console.log("Existing blog post slugs:", posts.docs.map((d: any) => d.slug));
if (posts.docs[0]) {
  console.log("\nSample post 'content' field type:", typeof posts.docs[0].content);
  console.log("Sample content value (first 500 chars):", JSON.stringify(posts.docs[0].content).slice(0, 500));
}

const ghkcu = await payload.find({ collection: "products", where: { name: { equals: "GHKCU 50 mg" } } });
console.log("\nGHKCU product id:", ghkcu.docs[0]?.id);

const users = await payload.find({ collection: "users", limit: 5 });
console.log("\nUsers available for 'author' field:", users.docs.map((u: any) => ({ id: u.id, email: u.email, role: u.role })));
process.exit(0);
