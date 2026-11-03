import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const BlogMedia: CollectionConfig = {
  slug: 'blog-media',
  admin: { group: 'Content', useAsTitle: 'filename', defaultColumns: ['filename', 'createdAt'], },
  labels: { singular: 'Blog Media', plural: 'Blog Media' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'staff'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'staff'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'staff'
    },
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../public/blog-media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
