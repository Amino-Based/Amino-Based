import type { CollectionConfig } from 'payload'

export const ProcessingFees: CollectionConfig = {
  slug: 'processing-fees',
  admin: { group: 'Store', defaultColumns: ['name', 'type', 'amount', 'isActive'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the fee displayed to customers (e.g., "Rush Processing", "Insurance")',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount in dollars (e.g., 2.50) OR percentage (e.g., 3 = 3%) depending on type',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'fixed_amount',
      options: [
        { label: 'Fixed Amount', value: 'fixed_amount' },
        { label: 'Percentage of Subtotal', value: 'percentage' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If disabled, this fee will not be applied or shown.',
      },
    },
    {
      name: 'isOptional',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If true, customers must actively check a box to apply this fee. If false, it is mandatory for all orders.',
      },
    },
  ],
}
