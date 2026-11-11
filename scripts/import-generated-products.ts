import { config as loadEnv } from 'dotenv'
import fs from 'fs'

// Same env precedence as scripts/seed.ts: .env first, then .env.local wins.
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

// Dynamic imports, matching scripts/seed.ts: this file is ESM, where static
// imports hoist above the dotenv calls and payload.config would read env too early.
const {
  parseArgs,
  missingWriteGates,
  looksLikeProductionTarget,
  evaluateConnection,
  WRITE_GATES,
  READ_GATE,
  CONTENT_DIR,
  IMAGE_DIR,
  SUPPLIED_PRICE_CSV,
  APPROVALS_FILE,
} = await import('./product-import/config.js')
const {
  buildPlan,
  buildContentPayload,
  summarise,
  EMPTY_DATABASE_VIEW,
  PROTECTED_FIELDS,
  WRITABLE_FIELDS,
  MEDIA_AND_IMAGE_FIELDS,
  assertNoImageOrMediaFields,
  assertContentOnlyPayload,
} = await import('./product-import/plan.js')
const { mediaLookupStem } = await import('./product-import/images.js')
const { BLOCKED_SLUGS } = await import('./product-import/approvals.js')
const { resolveCanonicalProductName } = await import('./product-import/catalog.js')

type DatabaseView = import('./product-import/plan.js').DatabaseView

const argv = process.argv.slice(2)
const opts = parseArgs(argv)
const unmetGates = missingWriteGates(argv)
/**
 * Content-only is the default. `--with-images` is the only way to clear it, and
 * even then the plan.ts payload guards still run on every write.
 */
const contentOnly = !opts.withImages

const HR = '-'.repeat(78)
function h(title: string) {
  console.log('\n' + HR + '\n' + title + '\n' + HR)
}

/**
 * Reads existing products and media so the planner can tell create from update
 * and so already-uploaded images are reused. Read-only: find() calls only.
 */
async function loadDatabaseView(): Promise<DatabaseView> {
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../payload.config')
  const payload = await getPayload({ config: configPromise })

  const productIdBySlug = new Map<string, string | number>()
  const existingImageCountBySlug = new Map<string, number>()
  const mediaIdByStem = new Map<string, string | number>()

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    pagination: false,
  })
  for (const doc of products.docs) {
    const slug = doc.slug
    if (typeof slug === 'string' && slug.length > 0) {
      productIdBySlug.set(slug, doc.id)
      existingImageCountBySlug.set(slug, Array.isArray(doc.images) ? doc.images.length : 0)
    }
  }

  const media = await payload.find({
    collection: 'media',
    limit: 5000,
    depth: 0,
    pagination: false,
  })
  for (const doc of media.docs) {
    const filename = doc.filename
    if (typeof filename === 'string' && filename.length > 0) {
      mediaIdByStem.set(mediaLookupStem(filename), doc.id)
    }
  }

  return { productIdBySlug, existingImageCountBySlug, mediaIdByStem, consulted: true }
}

function mimeFor(detected: string | null): string {
  if (detected === 'png') return 'image/png'
  if (detected === 'webp') return 'image/webp'
  return 'image/jpeg'
}

async function main() {
  h('Amino Based - generated product importer')
  console.log('  mode                 ' + (opts.dryRun ? 'DRY RUN (no writes, no uploads)' : 'EXECUTE (writes enabled)'))
  console.log('  content dir          ' + CONTENT_DIR)
  console.log('  image dir            ' + IMAGE_DIR)
  console.log('  supplied price CSV   ' + SUPPLIED_PRICE_CSV)
  console.log('  approvals            ' + APPROVALS_FILE)
  if (opts.only.length > 0) console.log('  restricted to        ' + opts.only.join(', '))

  if (opts.dryRun && unmetGates.length > 0) {
    console.log('\n  Dry run because these write gates are not satisfied:')
    for (const g of unmetGates) console.log('    - ' + g)
    console.log('  Credentials alone never enable writes.')
  }

  // A database view is optional for a dry run and mandatory for a write.
  //
  // Every gate below is evaluated BEFORE `payload` or `payload.config` is
  // imported, so an unsafe target is refused before Payload can initialise a
  // connection pool. This applies to `--dry-run --with-db` as well: reading a
  // non-local database is gated in its own right.
  let db = EMPTY_DATABASE_VIEW
  const wantDb = argv.includes('--with-db') || !opts.dryRun
  if (wantDb) {
    const decision = evaluateConnection(argv)

    if (!decision.allowed) {
      if (decision.skip) {
        // Nothing to connect to; continue without a database view.
        console.log('\n  ' + decision.message)
      } else {
        console.error('\n  ' + decision.message)
        process.exit(2)
      }
    } else {
      // Read is permitted. A write additionally needs the production gate; the
      // read acknowledgement never substitutes for it.
      const target = looksLikeProductionTarget()
      if (!opts.dryRun && target.production && !argv.includes(WRITE_GATES.productionConfirm)) {
        console.error(
          '\n  REFUSED: target looks like production (' + target.reason + ').\n' +
            '  ' + READ_GATE.flag + ' authorises a READ only.\n' +
            '  A write run against it additionally requires ' + WRITE_GATES.productionConfirm + '.',
        )
        process.exit(2)
      }
      console.log('\n  ' + decision.message + ' - read-only find() calls')
      db = await loadDatabaseView()
      console.log('  existing products: ' + db.productIdBySlug.size + '   existing media: ' + db.mediaIdByStem.size)
    }
  }

  const result = buildPlan({ only: opts.only, db })
  const { content, imageAudit, plans, approvals } = result

  h('1. Content validation')
  console.log('  product JSON files found      ' + content.filesSeen)
  console.log('  parsed into product records   ' + content.products.length)
  console.log('  validation issues             ' + content.issues.length)
  for (const i of content.issues) console.log('    [' + (i.slug ?? i.file) + '] ' + i.problem)
  const statusTally: Record<string, number> = {}
  for (const p of content.products) statusTally[p.status] = (statusTally[p.status] ?? 0) + 1
  console.log('  status tally                  ' + JSON.stringify(statusTally))
  const words = content.products.reduce((n, p) => n + p.qc.mainContentWords, 0)
  const faqs = content.products.reduce((n, p) => n + p.qc.faqCount, 0)
  console.log('  content words / FAQs          ' + words + ' / ' + faqs)

  h('2. Image verification')
  console.log('  references            ' + imageAudit.total)
  console.log('  found on disk         ' + imageAudit.found)
  console.log('  missing               ' + imageAudit.missing.length)
  for (const m of imageAudit.missing) console.log('    MISSING  ' + m.slug + ' [' + m.variant + '] -> ' + m.resolved)
  console.log('  unreadable            ' + imageAudit.unreadable.length)
  console.log('  unsupported format    ' + imageAudit.unsupportedFormat.length)
  for (const u of imageAudit.unsupportedFormat) {
    console.log('    FORMAT  ' + u.resolved + ' detected=' + (u.detectedFormat ?? 'unknown'))
  }
  console.log('  corrected by manifest ' + imageAudit.corrected.length)
  for (const c of imageAudit.corrected) {
    console.log('    ' + c.slug + ' [' + c.variant + ']  ' + c.declared + ' -> ' + c.resolved)
  }
  console.log('  duplicate targets     ' + imageAudit.duplicateTargets.size)
  for (const [k, v] of imageAudit.duplicateTargets) {
    console.log('    ' + k + ' claimed by ' + v.map((x) => x.slug + '/' + x.variant).join(', '))
  }
  console.log('  duplicate content     ' + imageAudit.duplicateContent.size)
  for (const [, v] of imageAudit.duplicateContent) {
    console.log('    identical bytes: ' + v.map((x) => x.resolved).join(', '))
  }
  console.log('  amino- prefix issues  ' + imageAudit.prefixViolations.length)
  for (const p of imageAudit.prefixViolations) {
    console.log('    PREFIX  ' + p.resolved + ' would be blocked by productImage.ts')
  }
  console.log('  unreferenced in dir   ' + imageAudit.orphanFiles.length)
  for (const o of imageAudit.orphanFiles) console.log('    orphan  ' + o)

  h('3. Field mapping')
  console.log('  mode                 ' + (contentOnly ? 'CONTENT-ONLY (no media, no image attachment)' : 'CONTENT + IMAGES (--with-images)'))
  console.log('  writable fields (' + WRITABLE_FIELDS.length + '): ' + WRITABLE_FIELDS.join(', '))
  console.log('  never written  (' + PROTECTED_FIELDS.length + '): ' + PROTECTED_FIELDS.join(', '))
  console.log('  media/image fields refused by guard (' + MEDIA_AND_IMAGE_FIELDS.length + '): ' + MEDIA_AND_IMAGE_FIELDS.join(', '))

  h('4. Approval eligibility')
  console.log('  approvals file present  ' + approvals.fileExists)
  console.log('  approved slugs          ' + approvals.approved.size)
  if (approvals.approved.size > 0) console.log('    ' + [...approvals.approved].join(', '))
  console.log('  generator-blocked slugs ' + BLOCKED_SLUGS.size + '  (' + [...BLOCKED_SLUGS].join(', ') + ')')
  if (approvals.blockedButListed.length > 0) {
    console.log('  REFUSED despite being listed: ' + approvals.blockedButListed.join(', '))
  }

  h('5. Plan')
  const s = summarise(plans, contentOnly)
  console.log('  products considered   ' + s.total)
  console.log('  would update          ' + s.updates)
  console.log('  would create          ' + s.creates + (opts.allowCreate ? '' : '  (blocked: --allow-create not passed)'))
  console.log('  would skip            ' + s.skips)
  console.log('  image uploads implied ' + s.imageUploads +
    (contentOnly ? '  (content-only: ' + s.imagesReferenced + ' referenced, none uploaded or attached)' : ''))
  console.log('  image attachments     ' + (contentOnly ? 0 : s.imageUploads))
  console.log('  skip reasons:')
  const tally = [...s.reasonTally].sort((a, b) => b[1] - a[1])
  for (const [r, n] of tally) console.log('    ' + String(r).padEnd(20) + ' ' + n)

  if (opts.verbose) {
    h('5b. Per-product detail')
    for (const p of plans) {
      console.log('  ' + p.slug.padEnd(30) + ' ' + p.action.toUpperCase().padEnd(7) + ' ' + (p.skipReasons.join(',') || '-'))
      for (const n of p.notes) console.log('      note: ' + n)
    }
  }

  const actionable = plans.filter((p) => p.action !== 'skip')

  if (opts.dryRun) {
    h('6. Dry run complete')
    console.log('  0 database writes, 0 media uploads, 0 files changed.')
    if (actionable.length === 0) {
      console.log('  Nothing is currently eligible. Add reviewed slugs to approvals.json to enable writes.')
    }
    if (opts.json) {
      const payloadOut = {
        summary: { ...s, reasonTally: Object.fromEntries(s.reasonTally) },
        plans,
      }
      console.log(JSON.stringify(payloadOut, null, 2))
    }
    return
  }

  // ---- write path, reached only with every gate satisfied ----
  h('6. EXECUTE')
  // A content-only write must name its targets. Without this, a future change
  // to the allowlist could sweep every approved product into an unintended
  // bulk update.
  if (contentOnly && opts.only.length === 0) {
    console.error(
      '\n  REFUSED: a content-only write must name its targets explicitly with --only slug-a,slug-b.',
    )
    process.exit(2)
  }
  if (actionable.length === 0) {
    console.log('  Nothing eligible to write. Exiting without changes.')
    return
  }
  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../payload.config')
  const payload = await getPayload({ config: configPromise })
  const bySlug = new Map(content.products.map((p) => [p.slug, p]))

  const failures: Array<{ slug: string; step: string; error: string }> = []
  let updated = 0
  let created = 0
  let uploaded = 0
  let reused = 0
  let attached = 0

  for (const plan of actionable) {
    const product = bySlug.get(plan.slug)
    if (!product) continue
    try {
      // Media first, so a failed upload cannot leave a half-written product.
      // In content-only mode this loop is never entered: no Media document is
      // created, no byte is read from the image directory, and no R2 object is
      // written.
      const mediaIds: Array<string | number> = []
      for (const img of contentOnly ? [] : plan.images) {
        const stem = mediaLookupStem(img.resolved)
        const existing = db.mediaIdByStem.get(stem)
        if (existing !== undefined) {
          mediaIds.push(existing)
          reused += 1
          continue
        }
        const buf = fs.readFileSync(img.absolutePath)
        const doc = await payload.create({
          collection: 'media',
          data: { alt: product.fields.seoTitle + ' - ' + img.variant },
          file: {
            data: buf,
            mimetype: mimeFor(img.detectedFormat),
            name: img.resolved,
            size: buf.length,
          },
        })
        db.mediaIdByStem.set(stem, doc.id)
        mediaIds.push(doc.id)
        uploaded += 1
      }

      const data: Record<string, unknown> = buildContentPayload(product)
      // Attach images only when images are explicitly enabled AND the product
      // has none, so relationships an admin curated in the CMS are never
      // replaced. In content-only mode `mediaIds` is empty by construction.
      const existingCount = db.existingImageCountBySlug.get(plan.slug) ?? 0
      if (!contentOnly && existingCount === 0 && mediaIds.length > 0) {
        data.images = mediaIds.map((id) => ({ image: id }))
        attached += 1
      }

      // Hard guards, independent of any command-line flag. The first runs in
      // every mode; the second additionally pins content-only runs to exactly
      // the twelve authorised fields.
      assertNoImageOrMediaFields(data, plan.slug)
      if (contentOnly) assertContentOnlyPayload(data, plan.slug)

      if (plan.action === 'update') {
        await payload.update({
          collection: 'products',
          id: db.productIdBySlug.get(plan.slug) as string | number,
          data: data as never,
        })
        updated += 1
        console.log('  updated  ' + plan.slug)
      } else {
        // A create necessarily writes name, slug, status, isVisible and images,
        // none of which is a content field — so it is incompatible with a
        // content-only run by definition, and is refused rather than silently
        // widening the payload.
        if (contentOnly) {
          failures.push({
            slug: plan.slug,
            step: 'content-only',
            error: 'create refused: content-only mode writes only the 12 content fields; pass --with-images to enable full creates',
          })
          console.error('  REFUSED create ' + plan.slug + ': content-only mode cannot create products')
          continue
        }
        if (!opts.allowCreate) {
          console.log('  skipped create ' + plan.slug + ' (--allow-create not passed)')
          continue
        }
        // The product name must be the verified catalogue name. seoTitle is an
        // SEO string and is never acceptable here; an unresolvable name refuses
        // the create rather than synthesising a label.
        const canonical = resolveCanonicalProductName(plan.slug)
        if (canonical.name === null) {
          failures.push({ slug: plan.slug, step: 'canonical-name', error: canonical.reason })
          console.error('  REFUSED create ' + plan.slug + ': ' + canonical.reason)
          continue
        }
        await payload.create({
          collection: 'products',
          data: {
            ...data,
            name: canonical.name,
            slug: plan.slug,
            status: opts.createStatus,
            isVisible: opts.createStatus === 'active',
            images: mediaIds.map((id) => ({ image: id })),
          } as never,
        })
        created += 1
        console.log('  created  ' + plan.slug + ' as "' + canonical.name + '" (' + opts.createStatus + ')')
      }
    } catch (err) {
      failures.push({ slug: plan.slug, step: 'write', error: (err as Error).message })
      console.error('  FAILED   ' + plan.slug + ': ' + (err as Error).message)
    }
  }

  h('7. Result')
  console.log('  mode              ' + (contentOnly ? 'CONTENT-ONLY' : 'CONTENT + IMAGES'))
  console.log('  updated ' + updated + '   created ' + created)
  console.log('  image uploads     ' + uploaded)
  console.log('  image attachments ' + attached)
  console.log('  media reused      ' + reused)
  if (contentOnly && (uploaded > 0 || attached > 0 || reused > 0)) {
    throw new Error('INVARIANT BROKEN: content-only run reported media activity')
  }
  console.log('  failures ' + failures.length)
  for (const f of failures) console.log('    ' + f.slug + ' [' + f.step + '] ' + f.error)
  if (failures.length > 0) {
    console.log('\n  Partial failure. Each product is written independently, so successful')
    console.log('  products are committed and the failures above can be retried: a rerun')
    console.log('  reuses already-uploaded media and updates in place.')
    process.exitCode = 1
  }
}

await main()
