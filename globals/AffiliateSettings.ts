import type { GlobalConfig } from 'payload'

export const AffiliateSettings: GlobalConfig = {
  slug: 'affiliate-settings',
  admin: { group: 'Affiliates', },
  access: {
    read: () => true,
    // These defaults apply to every affiliate site-wide — only admins/staff may change them.
    update: ({ req: { user } }) => !!user && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    {
      name: 'defaultCommissionRate',
      type: 'number',
      required: true,
      defaultValue: 10,
      admin: {
        description: 'Global default commission percentage applied to all affiliates unless individually overridden.',
      },
    },
    {
      name: 'defaultCommissionType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: ['percentage', 'fixed_amount'],
      admin: {
        description: 'Global default commission type.',
      },
    },
    {
      name: 'defaultCookieDurationDays',
      type: 'number',
      required: true,
      defaultValue: 30,
    },
    {
      name: 'defaultPendingPeriodDays',
      type: 'number',
      required: true,
      defaultValue: 14,
    },
    {
      name: 'defaultMinimumPayoutThreshold',
      type: 'number',
      required: true,
      defaultValue: 50,
      admin: {
        description: 'Global default minimum payout threshold in dollars (e.g. 50.00).',
      },
    },
    {
      name: 'defaultCommissionOn',
      type: 'select',
      required: true,
      defaultValue: 'subtotal_after_coupon',
      options: ['subtotal_after_coupon', 'subtotal_before_coupon'],
      admin: {
        description: 'Global default base for calculating commission.',
      },
    },
  ],
}
