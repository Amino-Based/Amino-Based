with open('components/HomeClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_import = 'import type { BlogPostCardData } from "@/components/BlogSection";'
new_import = 'import BlogSection, { type BlogPostCardData } from "@/components/BlogSection";'

if old_import in content:
    content = content.replace(old_import, new_import, 1)
    print("Replaced import successfully!")
else:
    print("Import already replaced or not found.")

# Locate Section 10 "Our Team"
start_str = "SECTION 10: OUR TEAM WITH PENDULUM SWINGING LANYARD BADGE"
end_str = "SECTION 10: FREQUENTLY ASKED QUESTIONS"

if start_str in content and end_str in content:
    start_idx = content.find(start_str)
    # Walk backwards to find the preceding comment border
    comment_start = content.rfind("{/* ===", 0, start_idx)
    
    end_idx = content.find(end_str)
    # Walk backwards from end_str to find the </section> closing tag
    section_end = content.rfind("</section>", 0, end_idx) + len("</section>")
    
    blog_replacement = """{/* ========================================================================= */}
        {/* SECTION 10: BLOG SECTION (PRACTICAL READS / REFERENCE DESIGN)              */}
        {/* ========================================================================= */}
        <BlogSection posts={posts} />"""
    
    content = content[:comment_start] + blog_replacement + content[section_end:]
    print("Replaced section 10 successfully!")
    
    with open('components/HomeClient.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("Could not find start or end markers for Section 10!")

