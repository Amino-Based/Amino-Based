import type { CollectionConfig, Where } from 'payload'
import { sql } from '@payloadcms/db-postgres/drizzle'
import { generateForgotPasswordEmail } from '../lib/email/templates/forgotPassword'

const staffOnly = ({ req: { user } }: any) => !!user && ['admin', 'staff'].includes(user.role)

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { group: 'Customers', defaultColumns: ['email', 'firstName', 'lastName', 'role', 'createdAt'],
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200,
    forgotPassword: {
      generateEmailSubject: () => generateForgotPasswordEmail('').subject,
      generateEmailHTML: (args) => generateForgotPasswordEmail(args?.token || '').html,
    },
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    create: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      if (['admin', 'staff'].includes(req.user.role as string)) return true
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.role === 'admin',
    // Who may open the admin panel at all. Without this, payload/dist/utilities/canAccessAdmin.js
    // falls through to its `adminUserSlug !== incomingUserSlug` branch — both are 'users' here, so
    // it grants access. Combined with `create: () => true` (public signup), that let any customer
    // who registered on the storefront log in to /pb-console. Collection access still scoped what
    // they could read, but the back-office shell itself was open to them.
    admin: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    // default fields added by Payload: email, password
    {
      name: 'firstName',
      type: 'text',
      required: false,
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
    },
    {
      name: 'googleId',
      type: 'text',
      unique: true,
      index: true,
      // Never publicly settable — this field is the account-linking key the Google
      // sign-in callback trusts (lib/auth/authOptions.ts). If a public create request
      // could set it, an attacker could pre-register a victim's Google account id and
      // hijack their next Google sign-in.
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'credentials',
      options: [
        { label: 'Email/Password', value: 'credentials' },
        { label: 'Google', value: 'google' },
      ],
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'phone',
      type: 'text',
      validate: (val: string | null | undefined) => {
        if (!val) return true
        const regex = /^\+?[1-9]\d{1,14}$/
        return regex.test(val) || 'Phone must be in E.164 format'
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
      // The collection-level `create` access is public (anyone can register), so without a
      // field-level restriction here a signup request could set role:"admin" directly —
      // Payload defaults unset field access to allow, independent of the collection access.
      // Only admins/staff may set or change this field; public registration falls back to
      // the defaultValue above.
      access: { create: staffOnly, update: staffOnly },
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      access: { create: staffOnly, update: staffOnly },
    },
    {
      name: 'acceptsMarketing',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'orderSmsUpdates',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Send SMS notifications for order status updates.',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      access: { create: staffOnly, update: staffOnly },
    },
    {
      name: 'defaultShippingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      filterOptions: ({ id, data }): Where => {
        const userId = id || (data && data.id)
        if (userId) {
          return {
            user: {
              equals: userId,
            },
          }
        }
        return {
          id: {
            equals: 'none',
          },
        }
      },
    },
    {
      name: 'defaultBillingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      filterOptions: ({ id, data }): Where => {
        const userId = id || (data && data.id)
        if (userId) {
          return {
            user: {
              equals: userId,
            },
          }
        }
        return {
          id: {
            equals: 'none',
          },
        }
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      access: { create: staffOnly, update: staffOnly },
    },
    {
      name: 'metadata',
      type: 'json',
      access: { create: staffOnly, update: staffOnly },
    },
    {
      name: 'hbPoints',
      label: 'PB Points',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'PB Points ($1 per point). Can be used by users at checkout.',
      },
      // Only server-side code (checkout, refund hooks) using overrideAccess may change this —
      // never a customer's own PATCH request, or they could mint free store credit for themselves.
      access: { create: staffOnly, update: staffOnly },
    },
    {
      name: 'orderHistory',
      type: 'ui',
      admin: { components: { Field: '/components/admin/UserOrderHistory#default' } },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.email) {
          data.email = String(data.email).toLowerCase()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Link earlier guest orders (placed with this email before the account existed) to the new
        // account, so they show up in the customer's order history. Single UPDATE, no nested hooks.
        if (operation !== 'create' || !doc?.email) return doc
        try {
          await (req.payload.db as any).drizzle.execute(
            sql`UPDATE orders SET owner_id = ${doc.id} WHERE owner_id IS NULL AND lower(guest_email) = ${String(doc.email).toLowerCase()}`
          )
        } catch (err) {
          console.error('Failed to link guest orders to new user:', err)
        }
        return doc
      },
    ],
  },
}
