import type { CollectionConfig } from 'payload'

export const AffiliatePayouts: CollectionConfig = {
  slug: 'affiliate-payouts',
  admin: { group: 'Affiliates', defaultColumns: ['affiliate', 'totalAmountCents', 'paymentMethod', 'status', 'paidAt'], },
  access: {
    read: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: () => false,
  },
  fields: [
    { name: 'affiliate', type: 'relationship', relationTo: 'affiliates', required: true },
    { name: 'conversions', type: 'relationship', relationTo: 'affiliate-conversions', hasMany: true, required: true },
    { name: 'conversionCount', type: 'number' },
    { name: 'totalAmountCents', type: 'number', required: true },
    { name: 'currency', type: 'select', options: ['USD', 'BTC', 'ETH', 'USDT'] },
    { name: 'cryptoAmountRaw', type: 'text' },
    { name: 'exchangeRateUsed', type: 'number' },
    { name: 'paymentMethod', type: 'select', options: ['paypal', 'wise', 'bank_wire', 'crypto_btc', 'crypto_eth', 'crypto_usdt_erc20', 'crypto_usdt_trc20', 'store_credit'] },
    { name: 'paymentDestination', type: 'json' },
    { name: 'status', type: 'select', options: ['draft', 'processing', 'paid', 'failed'], defaultValue: 'draft' },
    { name: 'createdBy', type: 'relationship', relationTo: 'users' },
    { name: 'processedBy', type: 'relationship', relationTo: 'users' },
    { name: 'adminNotes', type: 'textarea' },
    { name: 'transactionId', type: 'text' },
    { name: 'receiptFile', type: 'upload', relationTo: 'media' },
    { name: 'receiptUrl', type: 'text' },
    { name: 'exportedAt', type: 'date' },
    { name: 'paidAt', type: 'date' },
    { name: 'failedAt', type: 'date' },
    { name: 'failureReason', type: 'text' },
  ],
  // TODO: port afterChange hook (afterAffiliatePayoutChange) that marks linked conversions paid
  // and updates Affiliates.totalCommissionPaid.
}
