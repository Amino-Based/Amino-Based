import type { CollectionConfig } from 'payload'

export const MilitaryDiscountRequests: CollectionConfig = {
  slug: 'military-discount-requests',
  admin: { group: 'Customers',
    useAsTitle: 'email',
    defaultColumns: ['fullName', 'email', 'branch', 'status', 'couponCode'],
    description: 'ID photos are never stored here — they are emailed to support for manual review and are not retained.',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    { name: 'fullName', type: 'text' },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'branch', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: { readOnly: true },
    },
    {
      name: 'couponCode',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'The one-time, email-locked coupon generated when this request was approved.',
      },
    },
    { name: 'reviewedAt', type: 'date', admin: { readOnly: true } },
  ],
}
