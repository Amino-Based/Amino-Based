import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { group: 'Content', defaultColumns: ['title', 'author', 'status', 'publishedAt'], useAsTitle: 'title' },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'blog-media', label: 'Featured Image' },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown on blog listing cards and used as the default SEO/social description.' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'inlineImages',
      type: 'array',
      admin: {
        description:
          'Images interleaved through the article body (roughly evenly spaced between paragraphs). Add 1-3.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'blog-media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Metabolic research', value: 'Metabolic research' },
        { label: 'Recovery protocols', value: 'Recovery protocols' },
        { label: 'Growth research', value: 'Growth research' },
        { label: 'Muscle studies', value: 'Muscle studies' },
        { label: 'Regulatory', value: 'Regulatory' },
        { label: 'Endocrine Research', value: 'Endocrine Research' },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readTime',
      type: 'text',
      admin: { description: "e.g. '12 min read'. Leave blank to auto-calculate from content length when rendered." },
    },
    {
      name: 'keyTakeaways',
      type: 'array',
      admin: { description: 'Short factual bullet points summarizing the post.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'faqs',
      type: 'array',
      admin: { description: 'Populates FAQPage schema.org markup and on-page FAQ accordion.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'references',
      type: 'array',
      admin: { description: 'Peer-reviewed sources cited in this post.' },
      fields: [
        { name: 'citationText', type: 'text', required: true, admin: { description: 'e.g. "Smith et al., 2023, Journal of Peptide Science"' } },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'focusKeyphrase',
      type: 'text',
      admin: { position: 'sidebar', description: 'Primary target keyword/phrase for this post (editorial SEO guidance).' },
    },
    {
      name: 'keywords',
      type: 'text',
      admin: { position: 'sidebar', description: 'Comma-separated secondary keywords for meta keywords / internal search relevance.' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.title) {
          data.slug = data.title.toLowerCase().replace(/\s+/g, '-')
        }
        return data
      },
    ],
  },
}
