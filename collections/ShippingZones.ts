import type { CollectionConfig } from 'payload'

export const ShippingZones: CollectionConfig = {
  slug: 'shippingzones',
  admin: { group: 'Store', useAsTitle: 'name',
    defaultColumns: ['name', 'methods'],
    description: 'Geographic shipping zones with sample shipping methods.',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'methods',
      type: 'array',
      fields: [
        { name: 'method', type: 'text', required: true },
        { name: 'price', type: 'number', required: true, admin: { description: 'Set to 0 for free shipping' } },
        { name: 'estimatedDays', type: 'number' },
        {
          name: 'minOrderAmount',
          type: 'number',
          admin: { description: 'Minimum subtotal required for this method to appear (e.g., 100 for free shipping over $100)' },
        },
        {
          name: 'isInternational',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Check this for the method that should be used for any order shipping to a country other than the US. It replaces all other methods at checkout and ignores minOrderAmount/free-shipping rules. Only one method should have this checked.',
          },
        },
      ],
      admin: {
        description: 'Sample shipping methods for this zone.',
      },
    },
  ],
}
