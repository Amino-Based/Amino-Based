import type { CollectionConfig, Field } from 'payload'
import { handleOrderChangeEmails } from '../lib/email/orderNotifications'
import { handleOrderLifecycle } from '../lib/orders/lifecycle'
import { assertValidTransition, syncStatusFields } from '../lib/orders/state'

const addressFields: Field[] = [
  { name: 'line1', type: 'text' },
  { name: 'line2', type: 'text' },
  { name: 'city', type: 'text' },
  { name: 'state', type: 'text' },
  { name: 'postalCode', type: 'text' },
  { name: 'country', type: 'text' },
]

const statusOptions = (values: string[]) =>
  values.map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v }))

// Orders are created server-side by the checkout (app/checkout/actions.ts), which also reserves stock
// and coupon usage. Everything that happens afterwards — payment confirmation, cancel/refund
// reversal, customer emails — is driven by the status fields via the hooks below.
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: 'Store',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerLastName', 'total', 'status', 'paymentStatus', 'paymentMethod', 'createdAt'],
    listSearchableFields: ['orderNumber', 'guestEmail', 'customerFirstName', 'customerLastName', 'customerPhone'],
    description:
      'Customer orders (created by the checkout). To confirm a Zelle / Venmo / Cash App payment, click "Mark as paid" — the customer is emailed automatically.',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      // Without this guard an unauthenticated read produced `{ owner: { equals: undefined } }`, which
      // Payload may reduce to an empty filter — i.e. every order in the table. Every other
      // user-scoped collection here (Addresses, Carts, Wishlists, Users) guards this case too.
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
    create: () => false,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  endpoints: [
    {
      // POST /api/orders/:id/mark-paid — used by the "Mark as paid" button on the order screen.
      path: '/:id/mark-paid',
      method: 'post',
      handler: async (req) => {
        if (req.user?.role !== 'admin') {
          return Response.json({ error: 'Only admins can mark orders as paid.' }, { status: 403 })
        }
        const raw = req.routeParams?.id as string | undefined
        if (!raw) return Response.json({ error: 'Missing order id.' }, { status: 400 })
        const id = Number.isNaN(Number(raw)) ? raw : Number(raw)

        const order: any = await req.payload
          .findByID({ collection: 'orders', id, depth: 0, overrideAccess: true })
          .catch(() => null)
        if (!order) return Response.json({ error: 'Order not found.' }, { status: 404 })
        if (order.paymentStatus === 'captured') {
          return Response.json({ error: 'This order is already marked as paid.' }, { status: 409 })
        }
        if (order.status === 'cancelled' || order.status === 'refunded') {
          return Response.json({ error: `A ${order.status} order can't be marked as paid.` }, { status: 409 })
        }

        try {
          // beforeChange keeps `status` in sync; afterChange finalizes the order and emails the customer.
          await req.payload.update({
            collection: 'orders',
            id,
            data: { paymentStatus: 'captured', status: 'paid' } as any,
            overrideAccess: true,
          })
          return Response.json({ success: true })
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : 'Could not mark the order as paid.' },
            { status: 500 }
          )
        }
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation !== 'update' || !originalDoc) return data
        // Keep status / paymentStatus consistent first, then validate the resulting transitions.
        const synced = syncStatusFields(data as any, originalDoc as any)
        assertValidTransition('status', originalDoc.status, synced.status)
        assertValidTransition('paymentStatus', originalDoc.paymentStatus, synced.paymentStatus)
        return synced
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Awaited so the serverless function isn't frozen before side effects / emails finish.
        await handleOrderLifecycle({ doc, previousDoc, operation, payload: req.payload }).catch((err) =>
          console.error('Order lifecycle hook failed:', err)
        )
        await handleOrderChangeEmails({ doc, previousDoc, operation, payload: req.payload }).catch((err) =>
          console.error('Order email hook failed:', err)
        )
        return doc
      },
    ],
  },
  fields: [
    // ── Sidebar: actions + status ────────────────────────────────────────────────────────────
    {
      name: 'markPaidAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '/components/admin/MarkPaidButton#default' },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: statusOptions(['pending', 'paid', 'fulfilled', 'shipped', 'completed', 'refunded', 'cancelled']),
      required: true,
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
        description:
          'Overall order stage. Setting "Paid" also marks the payment as captured; "Refunded" and "Cancelled" are final and return the stock.',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: statusOptions(['unpaid', 'authorized', 'captured', 'refunded']),
      required: true,
      defaultValue: 'unpaid',
      admin: {
        position: 'sidebar',
        description:
          '"Captured" = money received (this sends the customer their order-confirmed email). Prefer the "Mark as paid" button.',
      },
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      options: statusOptions(['unfulfilled', 'partial', 'fulfilled']),
      required: true,
      defaultValue: 'unfulfilled',
      admin: {
        position: 'sidebar',
        description: 'Shipping progress only. Leave as Unfulfilled until the package is actually dispatched.',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      defaultValue: 'stripe',
      options: [
        { label: 'Card (Stripe)', value: 'stripe' },
        { label: 'Zelle', value: 'zelle' },
        { label: 'Venmo', value: 'venmo' },
        { label: 'Cash App', value: 'cashapp' },
        { label: 'American Express', value: 'amex' },
        { label: 'Card (CircoFlows)', value: 'circoflows' },
        { label: 'Stripe (Payment Link)', value: 'stripe_link' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Zelle / Venmo / Cash App / Amex / payment-link orders stay unpaid until you confirm the money arrived.',
      },
    },
    {
      type: 'collapsible',
      label: 'Totals',
      admin: { position: 'sidebar', initCollapsed: false },
      fields: [
        { name: 'subtotal', type: 'number' },
        { name: 'discountTotal', type: 'number' },
        { name: 'redeemedPoints', type: 'number', defaultValue: 0, admin: { description: 'PB Points used ($1/point)' } },
        { name: 'shippingTotal', type: 'number', defaultValue: 0 },
        { name: 'taxTotal', type: 'number', required: true, defaultValue: 0 },
        { name: 'feeTotal', type: 'number', required: true, defaultValue: 0 },
        { name: 'total', type: 'number', required: true, defaultValue: 0 },
      ],
    },
    {
      type: 'collapsible',
      label: 'System & attribution',
      admin: { position: 'sidebar', initCollapsed: true },
      fields: [
        { name: 'couponCode', type: 'text', admin: { description: 'Coupon that was applied (already counted against its usage limit).' } },
        { name: 'affiliateId', type: 'text' },
        { name: 'clickId', type: 'text' },
        { name: 'orderSource', type: 'text', admin: { readOnly: true } },
        {
          name: 'isFinalized',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            readOnly: true,
            description: 'Set automatically the first time payment is confirmed (affiliate commission is recorded then).',
          },
        },
        {
          name: 'circoflowsTransactionId',
          type: 'text',
          admin: { readOnly: true, condition: (data) => data?.paymentMethod === 'circoflows' },
        },
      ],
    },

    // ── Main column ──────────────────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Customer',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'orderNumber',
          type: 'text',
          admin: { readOnly: true, description: 'Auto-generated order identifier (e.g., 7000).' },
        },
        {
          name: 'owner',
          type: 'relationship',
          relationTo: 'users',
          required: false,
          admin: { description: 'User who placed the order (empty for guest checkout).' },
        },
        { name: 'guestEmail', type: 'text', admin: { description: 'Email for guest orders — confirmation emails go here.' } },
        { name: 'customerFirstName', type: 'text' },
        { name: 'customerLastName', type: 'text' },
        { name: 'customerPhone', type: 'text' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Prices were verified against the catalog when the order was placed.',
      },
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: false },
        { name: 'variantTitle', type: 'text' },
        { name: 'variant', type: 'text' },
        { name: 'price', type: 'number' },
        { name: 'quantity', type: 'number', required: true },
        {
          type: 'collapsible',
          label: 'Product Snapshot Data',
          admin: { initCollapsed: true },
          fields: [{ name: 'productSnapshot', type: 'json' }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Addresses',
      admin: { initCollapsed: false },
      fields: [
        { name: 'shippingAddress', type: 'group', fields: addressFields },
        { name: 'billingAddress', type: 'group', fields: addressFields },
      ],
    },
    {
      type: 'collapsible',
      label: 'Shipping & tracking',
      admin: { initCollapsed: false },
      fields: [
        { name: 'shippingMethod', type: 'text' },
        { name: 'trackingLink', type: 'text', admin: { description: 'URL to track the package.' } },
        {
          name: 'sendTrackingEmail',
          type: 'checkbox',
          admin: { description: 'Tick and save to email the tracking link to the customer (sent once).' },
        },
      ],
    },
    {
      name: 'appliedFees',
      type: 'array',
      admin: { description: 'Processing fees charged on this order (snapshot at checkout).', initCollapsed: true },
      fields: [
        { name: 'feeId', type: 'relationship', relationTo: 'processing-fees' },
        { name: 'feeName', type: 'text' },
        { name: 'amount', type: 'number' },
        { name: 'feeType', type: 'select', options: ['percentage', 'fixed_amount'] },
        { name: 'percentage', type: 'number' },
      ],
    },
    {
      name: 'refunds',
      type: 'array',
      admin: {
        description:
          'Record-keeping only — this does not move money. Refund in your payment app first, then set Status to "Refunded".',
        initCollapsed: true,
      },
      fields: [
        { name: 'amount', type: 'number' },
        { name: 'reason', type: 'text' },
        { name: 'createdAt', type: 'date', admin: { readOnly: true } },
      ],
    },
    { name: 'customerNote', type: 'textarea', admin: { description: 'Note the customer left at checkout.' } },
    {
      name: 'notes',
      type: 'array',
      label: 'Order Notes',
      admin: { description: 'Internal notes, or messages emailed straight to the customer.' },
      fields: [
        {
          name: 'type',
          type: 'radio',
          required: true,
          defaultValue: 'internal',
          options: [
            { label: 'Internal Note', value: 'internal' },
            { label: 'Message to Customer', value: 'customer' },
          ],
        },
        { name: 'note', type: 'textarea', required: true },
        { name: 'date', type: 'date', admin: { readOnly: true } },
        { name: 'isEmailed', type: 'checkbox', label: 'Dispatched to Customer', admin: { readOnly: true } },
      ],
    },
  ],
}
