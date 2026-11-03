import type { CollectionConfig } from 'payload'
import { handleApplicationApproval } from '../lib/affiliate/handleApplicationApproval'

const staffOnly = ({ req: { user } }: any) => !!user && ['admin', 'staff'].includes(user.role)

export const AffiliateApplications: CollectionConfig = {
  slug: 'affiliate-applications',
  admin: { group: 'Affiliates',
    useAsTitle: 'displayName',
  },
  hooks: {
    // create access requires a logged-in user (below), but nothing stops that user from
    // passing a different `user` id or a pre-set status:"approved" in the request body —
    // force both server-side so an application can never be filed on someone else's behalf
    // or created already-approved.
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id
          data.status = 'pending'
          data.reviewedBy = undefined
          data.linkedAffiliate = undefined
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req }) => {
        void handleApplicationApproval({ doc, previousDoc, payload: req.payload }).catch((err) =>
          console.error('Affiliate application approval hook failed:', err)
        )
        return doc
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (['admin', 'staff'].includes(user.role as string)) return true
      return { user: { equals: user.id } }
    },
    create: ({ req }) => !!req.user,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'websiteUrl',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'select', options: ['instagram', 'youtube', 'tiktok', 'twitter', 'reddit'] },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'promotionMethods',
      type: 'textarea',
      required: true,
    },
    {
      name: 'estimatedMonthlyReach',
      type: 'select',
      options: [
        { label: '<1k', value: '<1k' },
        { label: '1k-10k', value: '1k-10k' },
        { label: '10k-100k', value: '10k-100k' },
        { label: '100k+', value: '100k+' },
      ],
    },
    {
      name: 'niche',
      type: 'textarea',
    },
    {
      name: 'whyJoin',
      type: 'textarea',
    },
    {
      name: 'agreedToTerms',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'reviewedAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
    {
      name: 'linkedAffiliate',
      type: 'relationship',
      relationTo: 'affiliates',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
