import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: { group: 'Store',
    defaultColumns: ['user', 'items'],
    useAsTitle: 'user',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: false },
        { name: 'variantSku', type: 'text', required: true },
        { name: 'variantTitle', type: 'text', required: false },
        { name: 'quantity', type: 'number', required: true, min: 1, defaultValue: 1 },
        { name: 'addedAt', type: 'date', required: true, defaultValue: () => new Date() },
        { name: 'priceSnapshot', type: 'number', required: true },
      ],
    },
    {
      name: 'abandonedEmailSentAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Records when the abandoned cart email was sent to prevent spamming.',
      },
    },
  ],
}
