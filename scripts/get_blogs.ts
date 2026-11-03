import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local" });

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../payload.config");

async function run() {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: 'blog-posts',
    limit: 10,
  });

  console.log(JSON.stringify(posts.docs.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    inlineImages: p.inlineImages,
    content: p.content,
  })), null, 2));
  
  process.exit(0);
}

run().catch(console.error);
