import type { CollectionConfig } from 'payload'

const staffOnly = ({ req: { user } }: any) => !!user && ['admin', 'staff'].includes(user.role)

export const Affiliates: CollectionConfig = {
  slug: 'affiliates',
  admin: { group: 'Affiliates',
    useAsTitle: 'referralSlug',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (['admin', 'staff'].includes(user.role as string)) return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (['admin', 'staff'].includes(user.role as string)) return true
      return { user: { equals: user.id } }
    },
    delete: () => false, // Never delete
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'user', type: 'relationship', relationTo: 'users', required: true, hasMany: false, unique: true, access: { update: staffOnly } },
            { name: 'status', type: 'select', defaultValue: 'pending', options: ['pending', 'approved', 'rejected', 'suspended'], access: { update: staffOnly } },
            { name: 'applicationDate', type: 'date', admin: { readOnly: true }, access: { update: staffOnly } },
            { name: 'approvedAt', type: 'date', admin: { readOnly: true }, access: { update: staffOnly } },
            { name: 'approvedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true }, access: { update: staffOnly } },
            { name: 'suspendedAt', type: 'date', admin: { readOnly: true }, access: { update: staffOnly } },
            { name: 'suspensionReason', type: 'textarea', access: { update: staffOnly } },
            // Safe for the affiliate themselves to edit — profile/marketing info only.
            { name: 'displayName', type: 'text' },
            { name: 'websiteUrl', type: 'text' },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'platform', type: 'select', options: ['instagram', 'youtube', 'tiktok', 'twitter', 'reddit'] },
                { name: 'url', type: 'text' },
              ],
            },
            {
              name: 'parentAffiliate',
              type: 'relationship',
              relationTo: 'affiliates',
              admin: { description: 'For Multi-Tier / MLM. The affiliate who recruited this affiliate.' },
              access: { update: staffOnly },
            },
          ],
        },
        {
          label: 'Referral',
          fields: [
            { name: 'referralSlug', type: 'text', unique: true, index: true, access: { update: staffOnly } },
            { name: 'couponCode', type: 'text', unique: true, access: { update: staffOnly } },
            { name: 'coupon', type: 'relationship', relationTo: 'coupons', admin: { readOnly: true }, access: { update: staffOnly } },
            { name: 'cookieDurationDays', type: 'number', defaultValue: 30, access: { update: staffOnly } },
          ],
        },
        {
          label: 'Commission',
          fields: [
            {
              name: 'commissionRate',
              type: 'number',
              admin: { description: 'Leave blank to use Global Default. Percentage of eligible order value or fixed amount in dollars.' },
              access: { update: staffOnly },
            },
            {
              name: 'commissionType',
              type: 'select',
              options: ['percentage', 'fixed_amount'],
              admin: { description: 'Leave blank to use Global Default.' },
              access: { update: staffOnly },
            },
            {
              name: 'customerDiscount',
              type: 'number',
              defaultValue: 10,
              admin: { description: '% discount the customer gets using their coupon' },
              access: { update: staffOnly },
            },
            {
              name: 'pendingPeriodDays',
              type: 'number',
              admin: { description: 'Leave blank to use Global Default. Days before commission is approved.' },
              access: { update: staffOnly },
            },
            {
              name: 'commissionOn',
              type: 'select',
              options: ['subtotal_after_coupon', 'subtotal_before_coupon'],
              admin: { description: 'Leave blank to use Global Default.' },
              access: { update: staffOnly },
            },
            { name: 'tier', type: 'select', defaultValue: 'standard', options: ['standard', 'silver', 'gold', 'vip'], access: { update: staffOnly } },
          ],
        },
        {
          label: 'Stats',
          fields: [
            { name: 'totalClicks', type: 'number', defaultValue: 0, access: { update: staffOnly } },
            { name: 'uniqueClicks', type: 'number', defaultValue: 0, access: { update: staffOnly } },
            { name: 'totalConversions', type: 'number', defaultValue: 0, access: { update: staffOnly } },
            { name: 'totalRevenue', type: 'number', defaultValue: 0, admin: { description: 'In dollars' }, access: { update: staffOnly } },
            { name: 'totalCommissionEarned', type: 'number', defaultValue: 0, admin: { description: 'In dollars' }, access: { update: staffOnly } },
            { name: 'totalCommissionPending', type: 'number', defaultValue: 0, admin: { description: 'In dollars' }, access: { update: staffOnly } },
            { name: 'totalCommissionApproved', type: 'number', defaultValue: 0, admin: { description: 'In dollars' }, access: { update: staffOnly } },
            {
              name: 'totalCommissionRequested',
              type: 'number',
              defaultValue: 0,
              admin: { description: 'In dollars (pending/approved payout requests)' },
              access: { update: staffOnly },
            },
            { name: 'totalCommissionPaid', type: 'number', defaultValue: 0, admin: { description: 'In dollars' }, access: { update: staffOnly } },
          ],
        },
        {
          label: 'Payout',
          fields: [
            {
              name: 'minimumPayoutThreshold',
              type: 'number',
              admin: { description: 'Leave blank to use Global Default. Minimum payout threshold in dollars (e.g. 50.00).' },
              access: { update: staffOnly },
            },
            // payoutCurrency + payoutMethods stay self-editable — the affiliate needs to be able to set where they get paid.
            { name: 'payoutCurrency', type: 'select', defaultValue: 'USD', options: ['USD', 'BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20', 'STORE_CREDIT'] },
            {
              name: 'payoutMethods',
              type: 'array',
              fields: [
                { name: 'type', type: 'select', options: ['paypal', 'wise', 'bank_wire', 'crypto_btc', 'crypto_eth', 'crypto_usdt_erc20', 'crypto_usdt_trc20', 'store_credit'] },
                { name: 'isPrimary', type: 'checkbox' },
                { name: 'paypalEmail', type: 'text' },
                { name: 'walletAddress', type: 'text' },
                { name: 'walletNetwork', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Fraud & Internal',
          fields: [
            { name: 'flaggedForReview', type: 'checkbox', access: { update: staffOnly } },
            { name: 'fraudScore', type: 'number', access: { update: staffOnly } },
            { name: 'fraudNotes', type: 'textarea', access: { update: staffOnly } },
            { name: 'adminNotes', type: 'textarea', access: { update: staffOnly } },
            { name: 'agreedToTermsAt', type: 'date', access: { update: staffOnly } },
          ],
        },
      ],
    },
  ],
}
