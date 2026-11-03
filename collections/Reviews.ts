import type { CollectionConfig, Where } from 'payload'
import { recomputeProductRating } from '../lib/reviews/rating'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: { group: 'Store',
    defaultColumns: ['product', 'user', 'rating', 'status', 'verifiedPurchase'],
    description: 'Customer reviews – verification ties to delivered orders.',
  },
  access: {
    // Public read only for approved reviews, admins see all
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      return { status: { equals: 'approved' } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      if (!req.user) return false
      return { and: [{ user: { equals: req.user.id } }, { status: { equals: 'pending' } }] } as Where
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        const isStaff = req.user?.role === 'admin' || req.user?.role === 'staff'
        if (operation === 'create' && !isStaff) {
          // Customers (via the storefront server action) can only review products they bought and
          // paid for, once each. They can't pick their own status or verified flag.
          // A logged-in Payload user can only review as themselves.
          if (req.user) data.user = req.user.id
          const productId = typeof data.product === 'object' ? data.product?.id : data.product
          const userId = typeof data.user === 'object' ? data.user?.id : data.user
          if (!productId || !userId) throw new Error('A review needs a product and a user.')

          const purchase = await req.payload.find({
            collection: 'orders',
            where: {
              and: [
                { owner: { equals: userId } },
                { paymentStatus: { equals: 'captured' } },
                { 'items.product': { equals: productId } },
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })
          if (purchase.docs.length === 0) {
            throw new Error('You can only review products you have purchased.')
          }
          const existing = await req.payload.find({
            collection: 'reviews',
            where: { and: [{ product: { equals: productId } }, { user: { equals: userId } }] },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })
          if (existing.docs.length > 0) throw new Error('You have already reviewed this product.')

          data.order = purchase.docs[0].id
          data.verifiedPurchase = true
          data.status = 'pending'
        }
        if (operation === 'update' && !isStaff) {
          // An author editing their own pending review can't change who/what/status.
          delete data.status
          delete data.verifiedPurchase
          delete data.product
          delete data.user
          delete data.order
        }
        return data
      },
    ],
    afterChange: [({ doc, req }) => recomputeProductRating(req.payload, doc.product)],
    afterDelete: [({ doc, req }) => recomputeProductRating(req.payload, doc.product)],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      validate: (val: number | null | undefined) => (!!val && val >= 1 && val <= 5) || 'Rating must be between 1 and 5',
    },
    {
      name: 'comment',
      type: 'text',
    },
    {
      name: 'verifiedPurchase',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Set automatically: true when the reviewer has a paid order containing this product.' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
  ],
}
