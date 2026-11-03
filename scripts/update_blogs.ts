import { config } from "dotenv";
import fs from "fs";
config({ path: ".env" });
config({ path: ".env.local" });

const { getPayload } = await import("payload");
const { default: configPromise } = await import("../payload.config");

async function run() {
  const payload = await getPayload({ config: configPromise });

  const blogs = [
    {
      slug: "how-to-choose-a-research-peptide-supplier",
      images: [
        {
          path: "C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7fb86b0c-ff9b-44c5-8d7f-c53275c951e7\\research_peptide_vials_production_1789411400167.jpg",
          alt: "Research peptide vials from documented production batches",
          filename: "research_peptide_vials_production.jpg",
        },
        {
          path: "C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7fb86b0c-ff9b-44c5-8d7f-c53275c951e7\\peptide_synthesis_facility_lab_1789411413926.jpg",
          alt: "US-based research peptide synthesis facility",
          filename: "peptide_synthesis_facility_lab.jpg",
        }
      ]
    },
    {
      slug: "solid-phase-peptide-synthesis-explained",
      images: [
        {
          path: "C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7fb86b0c-ff9b-44c5-8d7f-c53275c951e7\\peptide_synthesis_quality_control_1789411444796.jpg",
          alt: "Quality control checkpoints during peptide synthesis",
          filename: "peptide_synthesis_quality_control.jpg",
        },
        {
          path: "C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7fb86b0c-ff9b-44c5-8d7f-c53275c951e7\\solid_phase_peptide_structure_1789411456454.jpg",
          alt: "Peptide chain structure built through solid-phase synthesis",
          filename: "solid_phase_peptide_structure.jpg",
        }
      ]
    },
    {
      slug: "how-to-read-a-peptide-certificate-of-analysis",
      images: [
        {
          path: "C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7fb86b0c-ff9b-44c5-8d7f-c53275c951e7\\peptide_vial_certificate_analysis_1789411466752.jpg",
          alt: "Peptide vial with Certificate of Analysis documentation",
          filename: "peptide_vial_certificate_analysis.jpg",
        },
        {
          path: "C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\7fb86b0c-ff9b-44c5-8d7f-c53275c951e7\\analytical_chemist_verifying_vial_1789411478302.jpg",
          alt: "Analytical chemist verifying a peptide vial's batch number",
          filename: "analytical_chemist_verifying_vial.jpg",
        }
      ]
    }
  ];

  for (const blog of blogs) {
    const post = await payload.find({ collection: 'blog-posts', where: { slug: { equals: blog.slug } } });
    if (post.docs.length > 0) {
      const doc = post.docs[0];
      const inlineImages = [];
      for (const img of blog.images) {
        if (!fs.existsSync(img.path)) {
           console.error("Path not found: ", img.path);
           continue;
        }
        const fileBuffer = fs.readFileSync(img.path);
        const createdMedia = await payload.create({
          collection: 'blog-media',
          data: { alt: img.alt },
          file: {
            data: fileBuffer,
            mimetype: 'image/jpeg',
            name: img.filename,
            size: fileBuffer.length,
          }
        });
        inlineImages.push({
          image: createdMedia.id,
          caption: ''
        });
      }
      await payload.update({
        collection: 'blog-posts',
        id: doc.id,
        data: {
          inlineImages
        }
      });
      console.log(`Updated blog post: ${blog.slug}`);
    }
  }

  process.exit(0);
}

run().catch(console.error);
