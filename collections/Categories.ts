import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { group: 'Store', defaultColumns: ['name', 'slug', 'isVisible', 'sortOrder'], useAsTitle: 'name' },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
    { name: 'slug', type: 'text', unique: true, admin: { position: 'sidebar' } },
    { name: 'parent', type: 'relationship', relationTo: 'categories', hasMany: false },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data?.slug && data?.name) {
          data.slug = String(data.name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}
