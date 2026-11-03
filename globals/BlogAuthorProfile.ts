import type { GlobalConfig } from 'payload'

export const BlogAuthorProfile: GlobalConfig = {
  slug: 'blog-author-profile',
  label: 'Blog Author Profile',
  admin: { group: 'Content',
    description: 'The single byline used across every blog post.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'title', type: 'text', admin: { description: 'e.g. "Research Team"' } },
  ],
}
