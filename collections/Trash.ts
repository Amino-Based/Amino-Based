import type { CollectionConfig } from 'payload'

/**
 * Safety net for deletes: before a record is deleted from most collections (see withTrash in
 * payload.config.ts) a copy is stored here, so an accidental delete — of an order, product, coupon —
 * can be undone with the "Restore" button. Entries are created by the server only.
 */
export const Trash: CollectionConfig = {
  slug: 'trash',
  admin: {
    group: 'System',
    useAsTitle: 'label',
    defaultColumns: ['label', 'originalCollection', 'deletedBy', 'createdAt'],
    description: 'Deleted records. Open one and click "Restore" to bring it back.',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  endpoints: [
    {
      // POST /api/trash/:id/restore
      path: '/:id/restore',
      method: 'post',
      handler: async (req) => {
        if (req.user?.role !== 'admin') {
          return Response.json({ error: 'Only admins can restore records.' }, { status: 403 })
        }
        const raw = req.routeParams?.id as string | undefined
        if (!raw) return Response.json({ error: 'Missing id.' }, { status: 400 })
        const trashId = Number.isNaN(Number(raw)) ? raw : Number(raw)

        const entry: any = await req.payload
          .findByID({ collection: 'trash', id: trashId, overrideAccess: true })
          .catch(() => null)
        if (!entry) return Response.json({ error: 'Trash entry not found.' }, { status: 404 })

        try {
          const { id: _id, createdAt: _c, updatedAt: _u, ...data } = (entry.data ?? {}) as Record<string, unknown>
          const restored: any = await req.payload.create({
            collection: entry.originalCollection,
            data: data as any,
            overrideAccess: true,
          })
          await req.payload.delete({ collection: 'trash', id: trashId, overrideAccess: true })
          return Response.json({ success: true, collection: entry.originalCollection, id: restored?.id })
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : 'Could not restore this record.' },
            { status: 500 }
          )
        }
      },
    },
  ],
  fields: [
    {
      name: 'restoreAction',
      type: 'ui',
      admin: { components: { Field: '/components/admin/TrashRestoreButton#default' } },
    },
    { name: 'label', type: 'text', admin: { readOnly: true } },
    { name: 'originalCollection', type: 'text', required: true, index: true, admin: { readOnly: true } },
    { name: 'originalId', type: 'text', admin: { readOnly: true } },
    { name: 'deletedBy', type: 'text', admin: { readOnly: true } },
    { name: 'data', type: 'json', admin: { readOnly: true, description: 'Full copy of the record as it was deleted.' } },
  ],
}
