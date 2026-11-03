import type { CollectionConfig, Where } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { group: 'Store',
    defaultColumns: ['name', 'price', 'hasVariants', 'status', 'isBestSeller'],
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'staff') return true
      return { and: [{ status: { equals: 'active' } }, { isVisible: { equals: true } }] } as Where
    },
    create: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    update: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => !!user?.role && ['admin', 'staff'].includes(user.role as string),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data?.slug && data?.name) {
          data.slug = String(data.name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Upload images for the product. The first image is the primary thumbnail.',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'sku',
      type: 'text',
      admin: {
        condition: (data) => !data.hasVariants,
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'salePrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'If set, this price will override the regular price.',
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'weight',
      type: 'number',
      min: 0,
      admin: { description: 'Weight in kg or lbs' },
    },
    {
      name: 'dimensions',
      type: 'group',
      fields: [
        { name: 'length', type: 'number', min: 0 },
        { name: 'width', type: 'number', min: 0 },
        { name: 'height', type: 'number', min: 0 },
      ],
      admin: { description: 'Dimensions in cm or inches' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'hasVariants',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'sku',
          type: 'text',
          required: true,
        },
        {
          name: 'isKit',
          type: 'checkbox',
          label: 'Is this a Kit / Bundle?',
          defaultValue: false,
          admin: {
            description: 'Check this if this variant is a multi-item kit (used for coupon filtering).',
          },
        },
        {
          name: 'images',
          type: 'array',
          label: 'Variant Images',
          admin: {
            description: 'Optional specific images for this variant',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'salePrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'stock',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'key', type: 'text' },
            { name: 'value', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'bulkBundles',
      type: 'array',
      admin: {
        description: 'Offer multi-kit bulk bundles of THIS product directly on the product page.',
      },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'e.g. 5 Kits' } },
        { name: 'quantity', type: 'number', required: true, min: 2, admin: { description: 'Number of items in this bundle' } },
        { name: 'discountPercentage', type: 'number', min: 0, max: 100, admin: { description: 'Percentage discount off the total' } },
        { name: 'price', type: 'number', min: 0, admin: { description: 'Legacy hardcoded price' } },
        { name: 'salePrice', type: 'number', min: 0 },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'variantOverrides',
          type: 'array',
          fields: [
            { name: 'variantSku', type: 'text', required: true },
            { name: 'price', type: 'number', required: true, min: 0 },
            { name: 'salePrice', type: 'number', min: 0 },
          ],
        },
      ],
    },
    {
      name: 'averageRating',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            { name: 'productDetailsTitle', type: 'text', defaultValue: 'Product Details' },
            { name: 'productDetailsDescription', type: 'textarea' },
          ],
        },
        {
          label: 'Research Focus & Mechanism Overview',
          fields: [
            { name: 'researchFocusTitle', type: 'text', defaultValue: 'Research Focus & Mechanism Overview' },
            { name: 'researchFocusDescription', type: 'textarea' },
          ],
        },
        {
          label: 'Quality & Purity Standards',
          fields: [
            { name: 'qualityPurityTitle', type: 'text', defaultValue: 'Quality & Purity Standards' },
            { name: 'qualityPurityDescription', type: 'textarea' },
          ],
        },
        {
          label: 'Compliance Notice',
          fields: [
            { name: 'complianceNoticeTitle', type: 'text', defaultValue: 'Compliance Notice' },
            { name: 'complianceNoticeDescription', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'coaFile',
      type: 'upload',
      relationTo: 'documents',
      admin: {
        description: 'Upload the Certificate of Analysis (COA) document',
      },
    },
    {
      name: 'coaBatchNumber',
      type: 'text',
      admin: {
        description: 'Batch number shown on the certificates page',
      },
    },
    {
      name: 'coaPurity',
      type: 'number',
      min: 0,
      admin: {
        description: 'Purity/potency percentage',
      },
    },
    {
      name: 'coaAnalyzedDate',
      type: 'date',
      admin: {
        description: 'Date the batch was analyzed',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'faqs',
      type: 'array',
      labels: {
        singular: 'FAQ',
        plural: 'FAQs',
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'isBestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this product in the homepage Best Sellers section.',
        position: 'sidebar',
      },
    },
  ],
}
