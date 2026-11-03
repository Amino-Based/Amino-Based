import type { CollectionConfig } from 'payload'

export const OrderCounters: CollectionConfig = {
  slug: 'order_counters',
  admin: {
    hidden: true,
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'id',
      type: 'number',
    },
    {
      name: 'counter',
      type: 'number',
      required: true,
      defaultValue: 1,
    },
  ],
}
