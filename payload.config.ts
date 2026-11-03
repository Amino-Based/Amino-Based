import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig, type CollectionConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { BlogMedia } from './collections/BlogMedia'
import { Documents } from './collections/Documents'
import { Addresses } from './collections/Addresses'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Carts } from './collections/Carts'
import { Coupons } from './collections/Coupons'
import { BlogPosts } from './collections/BlogPosts'
import { Pages } from './collections/Pages'
import { ContactMessages } from './collections/ContactMessages'
import { EmailLogs } from './collections/EmailLogs'
import { Wishlists } from './collections/Wishlists'
import { Reviews } from './collections/Reviews'
import { Orders } from './collections/Orders'
import { OrderCounters } from './collections/OrderCounters'
import { ShippingZones } from './collections/ShippingZones'
import { ProcessingFees } from './collections/ProcessingFees'
import { MilitaryDiscountRequests } from './collections/MilitaryDiscountRequests'
import { AffiliateApplications } from './collections/AffiliateApplications'
import { Affiliates } from './collections/Affiliates'
import { AffiliateClicks } from './collections/AffiliateClicks'
import { AffiliateConversions } from './collections/AffiliateConversions'
import { AffiliatePayouts } from './collections/AffiliatePayouts'
import { PayoutRequests } from './collections/PayoutRequests'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Trash } from './collections/Trash'

import { AffiliateSettings } from './globals/AffiliateSettings'
import { BlogAuthorProfile } from './globals/BlogAuthorProfile'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Fail fast instead of silently signing every session/CSRF token (and the military
// one-click-action JWTs, which reuse this same secret) with an empty string — that
// would make them trivially forgeable rather than just breaking the app outright.
// A configured Resend key with no verified sender produces an opaque provider rejection at send
// time, long after deploy. Surface it at startup instead, where it is actionable.
if (process.env.RESEND_API_KEY && !process.env.RESEND_FROM_EMAIL) {
  throw new Error(
    'RESEND_FROM_EMAIL is required when RESEND_API_KEY is set. Use an address on a domain verified in Resend.'
  )
}

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required and must not be empty.')
}

// --- Supabase Postgres TLS -------------------------------------------------
// The CA that signs the Supabase database certificate. Pinning it while keeping
// hostname verification on is what makes this connection resistant to MITM, so
// verification is never disabled and a missing CA is a hard startup failure.
const DATABASE_CA_PATH = path.resolve(dirname, 'certs', 'prod-ca-2021.crt')

const loadDatabaseSslCa = (): string => {
  // Vercel (and any other host where the repo's certs/ directory is absent)
  // supplies the PEM through the environment instead. Env values are often
  // pasted with literal backslash-n sequences, which are not a parseable PEM.
  const fromEnv = process.env.DATABASE_SSL_CA?.replace(/\\n/g, '\n').trim()
  if (fromEnv) {
    if (!fromEnv.includes('BEGIN CERTIFICATE')) {
      throw new Error(
        'DATABASE_SSL_CA is set but contains no PEM certificate ("BEGIN CERTIFICATE" block missing).'
      )
    }
    return fromEnv
  }

  let fromFile: string
  try {
    fromFile = fs.readFileSync(DATABASE_CA_PATH, 'utf8').trim()
  } catch (err) {
    throw new Error(
      `Could not read the Postgres CA certificate at ${DATABASE_CA_PATH}: ${
        err instanceof Error ? err.message : String(err)
      }. Set the PEM in the DATABASE_SSL_CA environment variable or restore the file — ` +
        'certificate verification is never disabled, so there is no fallback.'
    )
  }
  if (!fromFile.includes('BEGIN CERTIFICATE')) {
    throw new Error(`${DATABASE_CA_PATH} contains no PEM certificate.`)
  }
  return fromFile
}

const databaseSslCa = loadDatabaseSslCa()

// pg merges parse(connectionString) OVER the explicit pool config — see
// pg/lib/connection-parameters.js: `Object.assign({}, config, parse(config.connectionString))`
// — and pg-connection-string turns any of these parameters into an `ssl` object
// of its own (`?sslmode=require` alone yields `{ rejectUnauthorized: false }`).
// Left in the URI they would silently replace the pinned-CA config below, so
// they are stripped here and the explicit configuration always wins.
const SSL_CONNECTION_PARAMS = [
  'ssl',
  'sslmode',
  'sslrootcert',
  'sslcert',
  'sslkey',
  'sslnegotiation',
] as const

const stripSslConnectionParams = (uri: string): string => {
  if (!uri) return uri
  let url: URL
  try {
    url = new URL(uri)
  } catch {
    // Fail closed. pg-connection-string accepts forms the WHATWG URL parser rejects —
    // notably the empty-host form `postgresql://user:pass@/db`, which it salvages by
    // rewriting `@/` to a dummy host. Returning the URI unchanged here would hand pg a
    // string whose `sslmode=no-verify` we never removed, silently replacing the pinned-CA
    // config with { rejectUnauthorized: false }. Never echo the URI or the parser error
    // (its `input` property carries the URI) — both contain the database credentials.
    throw new Error(
      'DATABASE_URI is not a parseable connection URI. Expected the form ' +
        'postgresql://USER:PASSWORD@HOST:PORT/DATABASE. Its SSL parameters therefore ' +
        'cannot be verified or removed, and certificate verification is never disabled, ' +
        'so the connection is refused.'
    )
  }
  const found = SSL_CONNECTION_PARAMS.filter((param) => url.searchParams.has(param))
  if (found.length === 0) return uri
  for (const param of found) url.searchParams.delete(param)
  // Never log the URI itself — it carries the database credentials.
  console.warn(
    `Ignoring SSL parameter(s) in DATABASE_URI (${found.join(', ')}): the explicit ` +
      'pinned-CA TLS configuration in payload.config.ts takes precedence.'
  )
  return url.toString()
}

// Collections whose deletes are copied to the Trash first. Skipped: Users (passwords can't be restored),
// upload collections (files live in R2), and high-volume / system data.
const NO_TRASH = new Set([
  'trash',
  'users',
  'media',
  'blog-media',
  'documents',
  'email-logs',
  'affiliate-clicks',
  'order_counters',
  'carts',
])

const withTrash = (collection: CollectionConfig): CollectionConfig =>
  NO_TRASH.has(collection.slug)
    ? collection
    : {
        ...collection,
        hooks: {
          ...collection.hooks,
          beforeDelete: [
            ...(collection.hooks?.beforeDelete ?? []),
            async ({ req, id }) => {
              // Never block a delete because the trash copy failed (e.g. its table isn't created yet).
              try {
                const doc: any = await req.payload.findByID({
                  collection: collection.slug as any,
                  id,
                  depth: 0,
                  overrideAccess: true,
                })
                await req.payload.create({
                  collection: 'trash' as any,
                  data: {
                    label: `${collection.slug}: ${doc?.orderNumber ?? doc?.name ?? doc?.title ?? doc?.code ?? doc?.email ?? id}`,
                    originalCollection: collection.slug,
                    originalId: String(id),
                    deletedBy: req.user?.email ?? null,
                    data: doc,
                  },
                  overrideAccess: true,
                })
              } catch (err) {
                console.error(`Could not copy ${collection.slug}/${id} to trash:`, err)
              }
            },
          ],
        },
      }

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      // "Needs attention" counters above the sidebar links.
      beforeNavLinks: ['/components/admin/NavBadges#default'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: '/pb-console',
  },
  // Order here sets the order of the admin sidebar groups (Store → Customers → Affiliates → Content → System).
  collections: [
    // Store
    Orders,
    Products,
    Categories,
    Coupons,
    Reviews,
    ShippingZones,
    ProcessingFees,
    Carts,
    Wishlists,
    // Customers
    Users,
    Addresses,
    MilitaryDiscountRequests,
    NewsletterSubscribers,
    ContactMessages,
    // Affiliates
    Affiliates,
    AffiliateApplications,
    AffiliateConversions,
    AffiliatePayouts,
    PayoutRequests,
    AffiliateClicks,
    // Content
    BlogPosts,
    Pages,
    Media,
    BlogMedia,
    Documents,
    // System
    EmailLogs,
    Trash,
    OrderCounters,
  ].map(withTrash),
  globals: [AffiliateSettings, BlogAuthorProfile],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET,
  email: resendAdapter({
    // Env-only: a hardcoded fallback here would send this brand's mail from another company's address.
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || '',
    defaultFromName: 'Amino Based',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: stripSslConnectionParams(process.env.DATABASE_URI || ''),
      ssl: {
        ca: databaseSslCa,
        rejectUnauthorized: true,
      },
    },
    // Never let `next dev` synchronize the schema. Without this the adapter runs
    // pushDevSchema() on every connect outside production (db-postgres/dist/connect.js:110
    // gates on `this.push !== false`), so simply starting the dev server would alter the
    // live Supabase database. Schema changes go through `payload migrate` instead.
    push: false,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
        },
        'blog-media': {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
        },
        documents: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
  sharp,
})
