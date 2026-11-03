import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: { group: 'Store',
    defaultColumns: ['code', 'type', 'value', 'freeShipping', 'usageCount'],
    useAsTitle: 'code',
  },
  access: {
    // Staff only: a public read would let anyone list every active coupon code through the API.
    // The storefront validates codes server-side (verifyCoupon) with overrideAccess.
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'staff',
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
  },
  hooks: {
    // Usage counting and store-credit draw-down happen at checkout (lib/orders/coupons.ts).
    beforeChange: [
      ({ data }) => {
        if (data?.code) {
          data.code = String(data.code).toUpperCase().trim()
        }
        if (data?.type === 'percentage' && data.value != null && (Number(data.value) <= 0 || Number(data.value) > 100)) {
          throw new Error('A percentage coupon must be between 1 and 100.')
        }
        if ((data?.type === 'fixed_amount' || data?.type === 'store_credit') && data.value != null && Number(data.value) < 0) {
          throw new Error('Coupon value cannot be negative.')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Turn off to instantly pause this coupon without deleting its usage history.',
        position: 'sidebar',
      },
    },
    {
      name: 'freeShipping',
      type: 'checkbox',
      label: 'Free Shipping',
      defaultValue: false,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed_amount' },
        { label: 'Free Shipping', value: 'free_shipping' },
        { label: 'Buy One Get One', value: 'buy_one_get_one' },
        { label: 'Store Credit', value: 'store_credit' },
      ],
    },
    {
      name: 'minSpend',
      type: 'number',
      required: false,
      admin: {
        description: 'Minimum order amount (in dollars) required to apply this coupon.',
        position: 'sidebar',
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      required: false,
      admin: {
        description: 'Maximum number of times this coupon can be used globally.',
        position: 'sidebar',
      },
    },
    {
      name: 'stackable',
      type: 'checkbox',
      label: 'Stackable with other coupons',
      defaultValue: false,
      admin: {
        description: 'Allow this coupon to be combined with other coupons on the same order.',
        position: 'sidebar',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: false,
      admin: {
        description: 'Expiration date after which the coupon is no longer valid.',
        position: 'sidebar',
      },
    },
    {
      name: 'excludeSaleItems',
      type: 'checkbox',
      label: 'Exclude Sale Items',
      defaultValue: false,
      admin: {
        description: 'If enabled, the coupon will not apply to items on sale.',
        position: 'sidebar',
      },
    },
    {
      name: 'autoApply',
      type: 'checkbox',
      label: 'Auto-apply',
      defaultValue: false,
      admin: {
        description: 'When true, the coupon is automatically applied at checkout if conditions are met.',
        position: 'sidebar',
      },
    },
    {
      name: 'newCustomersOnly',
      type: 'checkbox',
      label: 'New Customers Only',
      defaultValue: false,
      admin: {
        description: 'Only valid for logged-in accounts with no prior orders.',
        position: 'sidebar',
      },
    },
    {
      name: 'lockedEmails',
      type: 'array',
      admin: {
        description: 'Restrict coupon usage to specific email addresses (leave empty for unrestricted).',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      name: 'storeCreditAmount',
      type: 'number',
      required: false,
      admin: {
        description: 'Total store credit value in dollars.',
        condition: (_, siblingData) => siblingData?.type === 'store_credit',
        position: 'sidebar',
      },
    },
    {
      name: 'remainingBalance',
      type: 'number',
      required: false,
      admin: {
        description: 'Remaining credit balance. Managed by the system.',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'value',
      type: 'number',
      required: false,
      admin: {
        description: 'Percentage (0-100), fixed amount in dollars, or ignored for free shipping.',
      },
    },
    {
      name: 'applicableProductTypes',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'All Products', value: 'all' },
        { label: 'Singles Only (Exclude Kits)', value: 'normal_only' },
        { label: 'Kits / Bundles Only', value: 'bulk_only' },
      ],
      admin: {
        description: 'Restrict coupon usage to single items or kits. Make sure your kit variants have "isKit" checked.',
      },
    },
    {
      name: 'appliesTo',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Specific Products', value: 'specific_products' },
        { label: 'Specific Categories', value: 'specific_categories' },
      ],
    },
    {
      name: 'products',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData.appliesTo === 'specific_products' },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
      ],
    },
    {
      name: 'categories',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData.appliesTo === 'specific_categories' },
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
      ],
    },
  ],
}
