import type { CollectionConfig } from 'payload'

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  admin: { group: 'System', description: 'Audit log of every outbound email.', defaultColumns: ['to', 'subject', 'sentAt', 'status'], useAsTitle: 'subject' },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'to', type: 'text' },
    { name: 'subject', type: 'text', required: true },
    { name: 'body', type: 'json', required: true },
    { name: 'sentAt', type: 'date', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'sent',
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}
