import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: { group: 'Customers', defaultColumns: ['name', 'email', 'subject', 'createdAt'], useAsTitle: 'subject' },
  access: {
    create: () => true,
    read: ({ req }) => req.user?.role === 'admin',
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date(), admin: { readOnly: true } },
  ],
}
