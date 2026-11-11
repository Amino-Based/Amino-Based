import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'fs'
import os from 'os'
import path from 'path'

import {
  parseArgs,
  missingWriteGates,
  looksLikeProductionTarget,
  classifyDatabaseTarget,
  evaluateConnection,
  WRITE_GATES,
  READ_GATE,
} from '../config.js'
import { resolveCanonicalProductName } from '../catalog.js'
import { MASTER_PRODUCTS } from '../../../lib/masterCatalogData.js'
import { loadProducts, listProductFiles, SEO_DESCRIPTION_MAX } from '../content.js'
import {
  detectFormat,
  isSupportedFormat,
  loadRenameManifest,
  mediaLookupStem,
  resolveImageTarget,
  resolveProductImages,
  auditImages,
  stemOf,
} from '../images.js'
import { loadApprovals, isPublishable, BLOCKED_SLUGS } from '../approvals.js'
import { splitCsvLine, slugifyProductName, loadSuppliedPrices, resolveIdentity } from '../catalog.js'
import {
  buildPlan,
  buildContentPayload,
  PROTECTED_FIELDS,
  WRITABLE_FIELDS,
  EMPTY_DATABASE_VIEW,
  MEDIA_AND_IMAGE_FIELDS,
  assertNoImageOrMediaFields,
  assertContentOnlyPayload,
  ImageFieldViolation,
  ContentOnlyViolation,
} from '../plan.js'
import { CONTENT_FIELD_KEYS } from '../types.js'

// ---------------------------------------------------------------------------
// JSON parsing and schema validation
// ---------------------------------------------------------------------------

test('all generated product files parse and validate', () => {
  const res = loadProducts()
  assert.equal(res.filesSeen, 50, 'expected exactly 50 product JSON files')
  assert.equal(res.products.length, 50, 'all 50 must parse into product records')
  assert.deepEqual(res.issues, [], 'no validation issue may be present')
})

test('non-product files are excluded from the product list', () => {
  const files = listProductFiles().map((f) => path.basename(f))
  for (const excluded of ['image-rename-manifest.json', 'verified-identities.json']) {
    assert.ok(!files.includes(excluded), excluded + ' must not be treated as a product')
  }
})

test('every product carries all twelve content fields with content', () => {
  const { products } = loadProducts()
  for (const p of products) {
    for (const key of CONTENT_FIELD_KEYS) {
      const v = (p.fields as unknown as Record<string, unknown>)[key]
      if (key === 'faqs') {
        assert.ok(Array.isArray(v) && v.length >= 10, p.slug + ' faqs must have >= 10 entries')
      } else {
        assert.equal(typeof v, 'string', p.slug + '.' + key + ' must be a string')
        assert.ok((v as string).trim().length > 0, p.slug + '.' + key + ' must be non-empty')
      }
    }
    assert.ok(p.fields.seoDescription.length <= SEO_DESCRIPTION_MAX, p.slug + ' seoDescription too long')
  }
})

test('validation reports rather than repairs a malformed file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-content-'))
  const file = path.join(dir, 'broken.json')
  fs.writeFileSync(file, '{ not json')
  const before = fs.readFileSync(file, 'utf8')
  const res = loadProducts(dir)
  assert.equal(res.products.length, 0)
  assert.equal(res.issues.length, 1)
  assert.match(res.issues[0].problem, /unparseable JSON/)
  assert.equal(fs.readFileSync(file, 'utf8'), before, 'source file must not be rewritten')
  fs.rmSync(dir, { recursive: true, force: true })
})

test('duplicate slugs across files are detected', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-dup-'))
  const body = (slug: string) => ({
    _meta: {
      slug,
      status: 'NEEDS VERIFICATION',
      payload_collection: 'products',
      qc: { ruo_disclaimer_present: true, human_dosing_present: false, treatment_claims_present: false },
      variants_from_csv: [],
      images: [],
    },
    payload_fields: Object.fromEntries([
      ...CONTENT_FIELD_KEYS.filter((k) => k !== 'faqs').map((k) => [k, 'x']),
      ['faqs', Array.from({ length: 10 }, (_, i) => ({ question: 'q' + i, answer: 'a' + i }))],
    ]),
  })
  // Same _meta.slug in two differently named files.
  fs.writeFileSync(path.join(dir, 'a.json'), JSON.stringify(body('shared-slug')))
  fs.writeFileSync(path.join(dir, 'b.json'), JSON.stringify(body('shared-slug')))
  const res = loadProducts(dir)
  assert.ok(res.issues.some((i) => /duplicate slug/.test(i.problem)), 'duplicate slug must be reported')
  fs.rmSync(dir, { recursive: true, force: true })
})

// ---------------------------------------------------------------------------
// Image manifest matching, including the ll-37 mismatch
// ---------------------------------------------------------------------------

test('rename manifest holds 79 entries', () => {
  const m = loadRenameManifest()
  assert.equal(m.entries.length, 79)
  assert.equal(m.byRenamed.size, 79, 'renamed filenames must be unique')
  assert.equal(m.byOriginal.size, 79, 'original filenames must be unique')
})

test('ll-37 declared filename is corrected through the manifest', () => {
  const m = loadRenameManifest()
  // The product JSON declares this stale name.
  const declared = 'amino-ll-37.png'
  assert.ok(!m.byRenamed.has(declared.toLowerCase()), 'declared name is not a manifest target')
  const { resolved, corrected } = resolveImageTarget(declared, m)
  assert.equal(resolved, 'amino-ll-37-standard.png')
  assert.equal(corrected, true)
})

test('already-correct filenames are passed through unchanged', () => {
  const m = loadRenameManifest()
  const { resolved, corrected } = resolveImageTarget('amino-glow-standard.png', m)
  assert.equal(resolved, 'amino-glow-standard.png')
  assert.equal(corrected, false)
})

test('all 79 image references resolve to readable supported files', () => {
  const { products } = loadProducts()
  const m = loadRenameManifest()
  const resolved = resolveProductImages(products, m)
  assert.equal(resolved.length, 79, 'expected 79 image references')
  const audit = auditImages(resolved)
  assert.deepEqual(audit.missing.map((x) => x.resolved), [], 'no image may be missing')
  assert.deepEqual(audit.unreadable.map((x) => x.resolved), [], 'every image must be readable')
  assert.deepEqual(audit.unsupportedFormat.map((x) => x.resolved), [], 'formats must be png/jpeg/webp')
  assert.equal(audit.found, 79)
})

test('no duplicate upload targets and no ambiguous mappings', () => {
  const { products } = loadProducts()
  const resolved = resolveProductImages(products, loadRenameManifest())
  const audit = auditImages(resolved)
  assert.equal(audit.duplicateTargets.size, 0, 'two products must not claim one filename')
  assert.equal(audit.duplicateContent.size, 0, 'identical bytes under two names would be ambiguous')
})

test('every upload target clears the amino- allowlist prefix', () => {
  const { products } = loadProducts()
  const resolved = resolveProductImages(products, loadRenameManifest())
  const audit = auditImages(resolved)
  assert.deepEqual(
    audit.prefixViolations.map((x) => x.resolved),
    [],
    'a target without the amino- prefix would be blocked by lib/products/productImage.ts',
  )
})

test('format detection uses magic bytes, not the extension', () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0])
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0])
  const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')])
  assert.equal(detectFormat(png), 'png')
  assert.equal(detectFormat(jpeg), 'jpeg')
  assert.equal(detectFormat(webp), 'webp')
  assert.equal(detectFormat(Buffer.from('not an image at all')), null)
  assert.equal(isSupportedFormat('png'), true)
  assert.equal(isSupportedFormat(null), false)
  assert.equal(isSupportedFormat('gif'), false)
})

// ---------------------------------------------------------------------------
// Idempotent media matching
// ---------------------------------------------------------------------------

test('media lookup is extension-insensitive because Media re-encodes to webp', () => {
  // collections/Media.ts formatOptions converts uploads to webp, so a file sent
  // as amino-x.png is stored as amino-x.webp and must still be recognised.
  assert.equal(mediaLookupStem('amino-dsip-10mg.png'), 'amino-dsip-10mg')
  assert.equal(mediaLookupStem('amino-dsip-10mg.webp'), 'amino-dsip-10mg')
  assert.equal(mediaLookupStem('amino-dsip-10mg.png'), mediaLookupStem('amino-dsip-10mg.webp'))
  assert.equal(stemOf('AMINO-X.PNG'), 'amino-x')
})

test('existing media is reused rather than re-uploaded', () => {
  const { products } = loadProducts()
  const resolved = resolveProductImages(products, loadRenameManifest())
  const sample = resolved[0]
  const mediaIdByStem = new Map<string, string | number>([[mediaLookupStem(sample.resolved), 'media-123']])
  // The importer consults this map before uploading; a hit means reuse.
  assert.equal(mediaIdByStem.has(mediaLookupStem(sample.resolved)), true)
  // The webp-converted filename must resolve to the same entry.
  const converted = sample.resolved.replace(/\.[a-z]+$/i, '.webp')
  assert.equal(mediaIdByStem.get(mediaLookupStem(converted)), 'media-123')
})

// ---------------------------------------------------------------------------
// Approval filtering
// ---------------------------------------------------------------------------

test('the allowlist contains only explicitly reviewed slugs', () => {
  const a = loadApprovals()
  assert.equal(a.fileExists, true)
  // The allowlist is owner-maintained. The invariant is not that it is empty,
  // but that every entry was deliberately added and recorded in reviewLog, and
  // that nothing blocked ever appears.
  // Snapshot of the owner-maintained allowlist. It grows as products are
  // authorised; what must hold is that every entry is recorded in reviewLog and
  // that no BLOCKED slug ever appears.
  assert.equal(a.approved.size, 42)
  for (const core of ['bpc-157', 'epitalon', 'ghk-cu', 'glp-1trz', 'glp-3rta', 'nad', 'semax']) {
    assert.ok(a.approved.has(core), core + ' must remain approved')
  }
  for (const blocked of BLOCKED_SLUGS) {
    assert.equal(a.approved.has(blocked), false, blocked + ' must never be approved')
  }
  assert.deepEqual(a.blockedButListed, [], 'no blocked slug may be listed')
  for (const slug of a.approved) {
    const entry = a.reviewLog[slug]
    assert.ok(entry, slug + ' must have a reviewLog entry')
    assert.ok(entry.reviewer && entry.reviewer.length > 0, slug + ' needs a reviewer')
    assert.ok(entry.date && /^\d{4}-\d{2}-\d{2}$/.test(entry.date), slug + ' needs an ISO date')
  }
})

test('an empty allowlist would publish nothing', () => {
  // The default-deny behaviour itself, independent of the current file.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-empty-'))
  const file = path.join(dir, 'approvals.json')
  fs.writeFileSync(file, JSON.stringify({ approvedSlugs: [], reviewLog: {} }))
  const a = loadApprovals(file)
  assert.equal(a.approved.size, 0)
  const { products } = loadProducts()
  assert.equal(products.filter((p) => isPublishable(p, a).ok).length, 0)
  fs.rmSync(dir, { recursive: true, force: true })
})

test('the eight generator-blocked slugs are exactly as classified', () => {
  assert.equal(BLOCKED_SLUGS.size, 8)
  for (const s of [
    '5-amino-1mq',
    'bpc-157-tb-500-blend',
    'glow',
    'hcg',
    'igf-1-lr3',
    'klow',
    'lipo-c',
    'tb-500',
  ]) {
    assert.ok(BLOCKED_SLUGS.has(s), s + ' must be blocked')
  }
})

test('generated statuses match the blocked classification', () => {
  const { products } = loadProducts()
  const blocked = products.filter((p) => p.status === 'BLOCKED').map((p) => p.slug).sort()
  assert.deepEqual(blocked, [...BLOCKED_SLUGS].sort())
  assert.equal(products.filter((p) => p.status === 'NEEDS VERIFICATION').length, 42)
})

test('a blocked slug is refused even when added to the allowlist', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-appr-'))
  const file = path.join(dir, 'approvals.json')
  fs.writeFileSync(file, JSON.stringify({ approvedSlugs: ['tb-500', 'dsip'] }))
  const a = loadApprovals(file)
  assert.deepEqual(a.blockedButListed, ['tb-500'])
  assert.equal(a.approved.has('tb-500'), false, 'blocked slug must not become approved')
  assert.equal(a.approved.has('dsip'), true)
  fs.rmSync(dir, { recursive: true, force: true })
})

test('NEEDS VERIFICATION is not publishable without explicit approval', () => {
  const { products } = loadProducts()
  const nv = products.find((p) => p.status === 'NEEDS VERIFICATION')
  assert.ok(nv)
  const empty = { approved: new Set<string>(), reviewLog: {}, fileExists: true, blockedButListed: [], blockedOverrides: new Map() }
  assert.deepEqual(isPublishable(nv, empty), { ok: false, reason: 'NOT_APPROVED' })
  const approved = { ...empty, approved: new Set([nv.slug]) }
  assert.deepEqual(isPublishable(nv, approved), { ok: true })
})

test('structural validity alone never implies approval', () => {
  const { products, issues } = loadProducts()
  assert.deepEqual(issues, [], 'all 50 are structurally valid')
  const a = loadApprovals()
  const publishable = products.filter((p) => isPublishable(p, a).ok)
  // Publishable is exactly the approved allowlist plus any BLOCKED product
  // carrying a complete override record. Nothing becomes publishable merely by
  // parsing, which is what this test exists to pin.
  assert.equal(publishable.length, a.approved.size + a.blockedOverrides.size)
  // A structurally valid but unreviewed product stays unpublishable.
  // Pinned against a controlled allowlist rather than today's approvals.json,
  // so the invariant holds however many products the owner has authorised.
  const emptyList = { approved: new Set<string>(), reviewLog: {}, fileExists: true, blockedButListed: [], blockedOverrides: new Map() }
  const valid = products.find((p) => p.status !== 'BLOCKED')
  assert.ok(valid, 'there must be a structurally valid, unblocked product')
  assert.deepEqual(isPublishable(valid, emptyList), { ok: false, reason: 'NOT_APPROVED' })
})

// ---------------------------------------------------------------------------
// Content field mapping
// ---------------------------------------------------------------------------

test('content payload contains the twelve fields verbatim and nothing else', () => {
  const { products } = loadProducts()
  const p = products.find((x) => x.slug === 'dsip')
  assert.ok(p)
  const data = buildContentPayload(p)
  assert.deepEqual(Object.keys(data).sort(), [...CONTENT_FIELD_KEYS].sort())
  // Verbatim: no truncation or rewriting.
  assert.equal(data.productDetailsDescription, p.fields.productDetailsDescription)
  assert.equal(data.researchFocusDescription, p.fields.researchFocusDescription)
  assert.equal((data.faqs as unknown[]).length, p.fields.faqs.length)
  assert.equal((data.faqs as Array<{ answer: string }>)[0].answer, p.fields.faqs[0].answer)
})

test('protected fields are never part of a write payload', () => {
  const { products } = loadProducts()
  const data = buildContentPayload(products[0])
  for (const f of PROTECTED_FIELDS) {
    assert.ok(!(f in data), f + ' must never be written by this importer')
  }
  for (const f of ['price', 'sku', 'stock', 'variants', 'coaPurity', 'coaBatchNumber']) {
    assert.ok(!(f in data), f + ' must never be written')
  }
})

test('writable field list is exactly the twelve content keys', () => {
  assert.deepEqual([...WRITABLE_FIELDS].sort(), [...CONTENT_FIELD_KEYS].sort())
})

// ---------------------------------------------------------------------------
// Price and SKU reconciliation
// ---------------------------------------------------------------------------

test('csv splitter handles quoted cells', () => {
  assert.deepEqual(splitCsvLine('"AHK-CU","ahk-cu","50mg","54.99"'), ['AHK-CU', 'ahk-cu', '50mg', '54.99'])
  assert.deepEqual(splitCsvLine('a,b,c'), ['a', 'b', 'c'])
  assert.deepEqual(splitCsvLine('"with,comma",b'), ['with,comma', 'b'])
})

test('product name slugification matches catalogue slugs', () => {
  assert.equal(slugifyProductName('5-Amino-1MQ'), '5-amino-1mq')
  assert.equal(slugifyProductName('NAD+'), 'nad')
  assert.equal(slugifyProductName('CJC-1295 No DAC'), 'cjc-1295-no-dac')
})

test('price disagreement is reported, never silently resolved', () => {
  const { products } = loadProducts()
  const p = products.find((x) => x.slug === 'dsip')
  assert.ok(p)
  // Deliberately wrong supplied price for this variant.
  const fakeSupplied = p.variants.map((v) => ({
    product: 'DSIP',
    variant: v.variant,
    priceUsd: Number(v.price_usd) + 10,
  }))
  const id = resolveIdentity(p, fakeSupplied)
  assert.equal(id.priceDisagreement, true)
  assert.ok(id.variants[0].disagreements.length > 0)
  // Both figures are retained so the operator can adjudicate.
  assert.equal(id.variants[0].jsonPrice, Number(p.variants[0].price_usd))
  assert.equal(id.variants[0].csvPrice, Number(p.variants[0].price_usd) + 10)
})

test('supplied price csv is loaded when present, and absence is tolerated', () => {
  const rows = loadSuppliedPrices()
  if (rows.length > 0) {
    assert.ok(rows.every((r) => Number.isFinite(r.priceUsd)))
  }
  assert.deepEqual(loadSuppliedPrices(path.join(os.tmpdir(), 'definitely-not-here.csv')), [])
})

test('all 50 slugs are canonical, so no product page would 404', () => {
  const { products } = loadProducts()
  const supplied = loadSuppliedPrices()
  for (const p of products) {
    const id = resolveIdentity(p, supplied)
    assert.equal(id.canonical, true, p.slug + ' must be in CANONICAL_PRODUCT_SLUGS')
  }
})

// ---------------------------------------------------------------------------
// Dry-run write protection
// ---------------------------------------------------------------------------

test('dry run is the default with no arguments', () => {
  assert.equal(parseArgs([]).dryRun, true)
})

test('--dry-run stays a dry run', () => {
  assert.equal(parseArgs(['--dry-run']).dryRun, true)
})

test('no single flag can enable writes', () => {
  const prev = process.env[WRITE_GATES.env]
  delete process.env[WRITE_GATES.env]
  assert.equal(parseArgs(['--execute']).dryRun, true, '--execute alone must not write')
  assert.equal(parseArgs([WRITE_GATES.confirm]).dryRun, true, 'confirm flag alone must not write')
  process.env[WRITE_GATES.env] = 'true'
  assert.equal(parseArgs([]).dryRun, true, 'env var alone must not write')
  assert.equal(parseArgs(['--execute']).dryRun, true, 'env + execute without confirm must not write')
  if (prev === undefined) delete process.env[WRITE_GATES.env]
  else process.env[WRITE_GATES.env] = prev
})

test('writes require all three gates together', () => {
  const prev = process.env[WRITE_GATES.env]
  process.env[WRITE_GATES.env] = 'true'
  const opts = parseArgs(['--execute', WRITE_GATES.confirm])
  assert.equal(opts.dryRun, false, 'all three gates satisfied enables writes')
  if (prev === undefined) delete process.env[WRITE_GATES.env]
  else process.env[WRITE_GATES.env] = prev
})

test('missing gates are reported individually', () => {
  const prev = process.env[WRITE_GATES.env]
  delete process.env[WRITE_GATES.env]
  const missing = missingWriteGates([])
  assert.equal(missing.length, 3)
  assert.ok(missing.includes('--execute'))
  assert.ok(missing.includes(WRITE_GATES.confirm))
  assert.ok(missing.some((m) => m.startsWith(WRITE_GATES.env)))
  if (prev !== undefined) process.env[WRITE_GATES.env] = prev
})

test('create is off unless --allow-create is passed', () => {
  assert.equal(parseArgs([]).allowCreate, false)
  assert.equal(parseArgs(['--allow-create']).allowCreate, true)
})

test('new products default to draft status', () => {
  assert.equal(parseArgs([]).createStatus, 'draft')
  assert.equal(parseArgs(['--create-status', 'active']).createStatus, 'active')
  assert.equal(parseArgs(['--create-status', 'nonsense']).createStatus, 'draft')
})

test('a non-local database host is treated as production', () => {
  const prev = process.env.DATABASE_URI
  process.env.DATABASE_URI = 'postgresql://u:p@db.example.supabase.co:5432/postgres'
  assert.equal(looksLikeProductionTarget().production, true)
  process.env.DATABASE_URI = 'postgresql://u:p@localhost:5432/postgres'
  assert.equal(looksLikeProductionTarget().production, false)
  process.env.DATABASE_URI = 'not-a-uri'
  assert.equal(looksLikeProductionTarget().production, true, 'unparseable must fail safe')
  if (prev === undefined) delete process.env.DATABASE_URI
  else process.env.DATABASE_URI = prev
})

test('production detection never returns the credential', () => {
  const prev = process.env.DATABASE_URI
  process.env.DATABASE_URI = 'postgresql://user:SUPERSECRET@db.example.com:5432/postgres'
  const r = looksLikeProductionTarget()
  assert.ok(!r.reason.includes('SUPERSECRET'), 'reason must not leak the password')
  assert.ok(!r.reason.includes('user'), 'reason must not leak the username')
  if (prev === undefined) delete process.env.DATABASE_URI
  else process.env.DATABASE_URI = prev
})

// ---------------------------------------------------------------------------
// Planning and relationship preservation
// ---------------------------------------------------------------------------

test('without a database view nothing is actionable', () => {
  const res = buildPlan({ db: EMPTY_DATABASE_VIEW })
  assert.equal(res.plans.length, 50)
  assert.equal(res.plans.filter((p) => p.action !== 'skip').length, 0)
  assert.ok(res.plans.every((p) => p.skipReasons.length > 0))
})

test('plan skips every product while the allowlist is empty', () => {
  const db = {
    productIdBySlug: new Map<string, string | number>([['dsip', 1]]),
    existingImageCountBySlug: new Map<string, number>([['dsip', 0]]),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  // An explicitly empty allowlist, so this pins the mechanism rather than
  // whatever approvals.json currently holds.
  const res = buildPlan({
    db,
    approvals: { approved: new Set<string>(), reviewLog: {}, fileExists: true, blockedButListed: [], blockedOverrides: new Map() },
  })
  const dsip = res.plans.find((p) => p.slug === 'dsip')
  assert.ok(dsip)
  assert.equal(dsip.action, 'skip')
  assert.ok(dsip.skipReasons.includes('NOT_APPROVED'))
  assert.deepEqual(dsip.fieldsToWrite, [], 'a skipped product writes no fields')
})

test('blocked products are skipped with the BLOCKED reason', () => {
  const db = {
    productIdBySlug: new Map<string, string | number>([['tb-500', 7]]),
    existingImageCountBySlug: new Map<string, number>(),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  // No override supplied, so the refusal must hold. (The separate suite
  // blocked-override.test.ts covers the recorded-override path.)
  const res = buildPlan({
    only: ['tb-500'],
    db,
    approvals: { approved: new Set<string>(['tb-500']), reviewLog: {}, fileExists: true, blockedButListed: ['tb-500'], blockedOverrides: new Map() },
  })
  assert.equal(res.plans.length, 1)
  assert.equal(res.plans[0].action, 'skip')
  assert.ok(res.plans[0].skipReasons.includes('BLOCKED'))
})

test('an existing image relationship is recorded as untouched', () => {
  const db = {
    productIdBySlug: new Map<string, string | number>([['dsip', 1]]),
    existingImageCountBySlug: new Map<string, number>([['dsip', 3]]),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  const res = buildPlan({ only: ['dsip'], db })
  assert.ok(
    res.plans[0].notes.some((n) => /already has 3 image relationship/.test(n)),
    'existing image relationships must be reported and preserved',
  )
})

test('the ll-37 correction surfaces in the plan notes', () => {
  const db = {
    productIdBySlug: new Map<string, string | number>([['ll-37', 1]]),
    existingImageCountBySlug: new Map<string, number>(),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  const res = buildPlan({ only: ['ll-37'], db })
  assert.ok(
    res.plans[0].notes.some((n) => n.includes('amino-ll-37.png -> amino-ll-37-standard.png')),
    'the manifest correction must be reported, not silent',
  )
})

test('--only restricts the plan', () => {
  const res = buildPlan({ only: ['dsip', 'kpv'] })
  assert.deepEqual(res.plans.map((p) => p.slug).sort(), ['dsip', 'kpv'])
})

// ---------------------------------------------------------------------------
// Part A - the three corrected disclaimers
// ---------------------------------------------------------------------------

const THREE = ['bpc-157', 'glp-1trz', 'glp-3rta']

function readProduct(slug: string) {
  return JSON.parse(fs.readFileSync(path.join('content-generation', slug + '.json'), 'utf8'))
}

test('the three corrected product files parse', () => {
  for (const s of THREE) {
    const d = readProduct(s)
    assert.equal(d._meta.slug, s)
    assert.equal(d.payload_fields.faqs.length, 10)
  }
})

test('bpc-157 states that RUO is not a determination of legal status', () => {
  const cn = readProduct('bpc-157').payload_fields.complianceNoticeDescription
  assert.match(cn, /research use only["”]? describes the supplier's intended use/i)
  assert.match(cn, /not,? in itself,? a determination of legal status/i)
  assert.match(cn, /does not exempt a purchaser from applicable law/i)
})

test('glp-1trz distinguishes the research material without calling tirzepatide "not a drug"', () => {
  const cn = readProduct('glp-1trz').payload_fields.complianceNoticeDescription
  // The material-category statement is present...
  assert.match(cn, /not supplied as, and must not be used as, a drug, a dietary supplement, a cosmetic, a food or a medical device/i)
  // ...and is explicitly scoped to how it is supplied, not to the molecule.
  assert.match(cn, /describes how Amino Based supplies and sells this material/i)
  assert.match(cn, /not a legal classification of the substance/i)
  assert.match(cn, /is not a claim that tirzepatide/i)
  // The approved status of the molecule is still stated plainly.
  assert.match(cn, /Tirzepatide is an approved human medicine/i)
  // And the blanket falsehood is absent.
  assert.ok(
    !/tirzepatide is not a drug/i.test(cn),
    'must never assert that the approved molecule is not a drug',
  )
})

test('glp-3rta states that no numerical purity measurement is supplied', () => {
  const qp = readProduct('glp-3rta').payload_fields.qualityPurityDescription
  assert.match(qp, /No published numerical purity measurement is currently supplied for this product/i)
  assert.match(qp, /absence of a reported figure should be read as the absence of a published measurement/i)
  assert.match(qp, /not as an implied standard/i)
})

test('none of the three asserts legal approval, exemption or independent testing', () => {
  for (const s of THREE) {
    const pf = readProduct(s).payload_fields
    const body = [
      pf.description, pf.productDetailsDescription, pf.researchFocusDescription,
      pf.qualityPurityDescription, pf.complianceNoticeDescription,
      ...pf.faqs.map((f: { question: string; answer: string }) => f.question + ' ' + f.answer),
    ].join(' ')
    for (const bad of [
      /this product is (legal|lawful|approved)/i,
      /exempt from (applicable law|regulation)/i,
      /legally (cleared|permitted|approved) (for|to)/i,
      /independently tested by/i,
      /GMP[- ]certified/i,
      /ISO[- ]?\d{4,5}\s*(certified|accredited)/i,
      /\b9[0-9](\.\d+)?\s*%\s*(pure|purity)/i,
    ]) {
      assert.ok(!bad.test(body), s + ' must not match ' + bad)
    }
    // The honest counterweight is still present.
    assert.match(pf.qualityPurityDescription, /has not performed independent laboratory testing/i)
  }
})

test('no purity figure is claimed and coaPurity remains unset across the three', () => {
  for (const s of THREE) {
    const d = readProduct(s)
    assert.ok(!('coaPurity' in d.payload_fields), s + ': coaPurity must not be in payload_fields')
    assert.ok(
      d._meta.unverified.some((u: string) => /Purity/i.test(u)),
      s + ': purity must remain a declared unverified item',
    )
  }
})

// ---------------------------------------------------------------------------
// Part B - content-only safeguard
// ---------------------------------------------------------------------------

test('content-only is the default and --with-images is the only opt-in', () => {
  assert.equal(parseArgs([]).withImages, false)
  assert.equal(parseArgs(['--execute']).withImages, false)
  assert.equal(parseArgs(['--with-images']).withImages, true)
})

test('the image guard rejects every media field, in any mode', () => {
  for (const field of MEDIA_AND_IMAGE_FIELDS) {
    const payload: Record<string, unknown> = { description: 'x' }
    payload[field] = [{ image: 1 }]
    assert.throws(
      () => assertNoImageOrMediaFields(payload, 'test-slug'),
      (e: Error) => e instanceof ImageFieldViolation && /media\/image field/i.test(e.message),
      'field ' + field + ' must be refused',
    )
  }
})

test('the image guard passes a pure content payload', () => {
  const { products } = loadProducts()
  const data = buildContentPayload(products[0]) as Record<string, unknown>
  assert.doesNotThrow(() => assertNoImageOrMediaFields(data, 'ok'))
  assert.doesNotThrow(() => assertContentOnlyPayload(data, 'ok'))
})

test('the content-only guard rejects any non-content field', () => {
  const { products } = loadProducts()
  for (const extra of ['price', 'sku', 'stock', 'status', 'isVisible', 'name', 'slug', 'coaPurity']) {
    const data = buildContentPayload(products[0]) as Record<string, unknown>
    data[extra] = 'whatever'
    assert.throws(
      () => assertContentOnlyPayload(data, 'test-slug'),
      (e: Error) => e instanceof ContentOnlyViolation && e.message.includes(extra),
      extra + ' must be refused in content-only mode',
    )
  }
})

test('the guards do not depend on a command-line flag', () => {
  // The guard functions take no options object and read no argv: they cannot be
  // disabled by flag state. Asserted structurally so a refactor cannot regress it.
  assert.equal(assertNoImageOrMediaFields.length, 2, 'guard takes (data, slug) only')
  assert.equal(assertContentOnlyPayload.length, 2, 'guard takes (data, slug) only')
  const src = fs.readFileSync(path.join(import.meta.dirname, '..', 'plan.ts'), 'utf8')
  const start = src.indexOf('export function assertNoImageOrMediaFields')
  const end = src.indexOf('export const PROTECTED_FIELDS')
  const region = src.slice(start, end)
  assert.ok(!/withImages|contentOnly|argv|process\.argv/.test(region), 'guards must not read flags')
})

test('the importer skips the media loop and never sets images in content-only mode', () => {
  const src = fs.readFileSync(path.join(import.meta.dirname, '..', '..', 'import-generated-products.ts'), 'utf8')
  // Content-only is derived from the absence of the opt-in, not asserted ad hoc.
  assert.match(src, /const contentOnly = !opts\.withImages/)
  // The upload loop is short-circuited.
  assert.match(src, /for \(const img of contentOnly \? \[\] : plan\.images\)/)
  // images is only ever set when NOT content-only.
  assert.match(src, /if \(!contentOnly && existingCount === 0 && mediaIds\.length > 0\)/)
  // Both guards run before the update call.
  const guardAt = src.indexOf('assertNoImageOrMediaFields(data, plan.slug)')
  const updateAt = src.indexOf('await payload.update(')
  assert.ok(guardAt > -1 && updateAt > -1 && guardAt < updateAt, 'guard must precede the update')
  // A content-only run cannot create.
  assert.match(src, /content-only mode cannot create products/)
  // The reported invariant.
  assert.match(src, /INVARIANT BROKEN: content-only run reported media activity/)
})

test('a content-only write must name its targets explicitly', () => {
  const src = fs.readFileSync(path.join(import.meta.dirname, '..', '..', 'import-generated-products.ts'), 'utf8')
  assert.match(src, /contentOnly && opts\.only\.length === 0/)
  assert.match(src, /must name its targets explicitly with --only/)
})

test('only the seven named slugs enter the seven-product update plan', () => {
  const SEVEN = ['bpc-157', 'glp-1trz', 'glp-3rta', 'ghk-cu', 'epitalon', 'semax', 'nad']
  const res = buildPlan({ only: SEVEN })
  assert.deepEqual(res.plans.map((p) => p.slug).sort(), [...SEVEN].sort())
  assert.equal(res.plans.length, 7)
  // tb-500 is blocked and must not be reachable through this plan.
  assert.ok(!res.plans.some((p) => p.slug === 'tb-500'))
  // And a slug outside the list cannot appear.
  for (const p of res.plans) assert.ok(SEVEN.includes(p.slug), p.slug + ' is not one of the seven')
})

test('every one of the seven produces a payload of exactly the 12 content fields', () => {
  const SEVEN = ['bpc-157', 'glp-1trz', 'glp-3rta', 'ghk-cu', 'epitalon', 'semax', 'nad']
  const { products } = loadProducts()
  for (const slug of SEVEN) {
    const p = products.find((x) => x.slug === slug)
    assert.ok(p, slug + ' must exist')
    const data = buildContentPayload(p) as Record<string, unknown>
    assert.deepEqual(Object.keys(data).sort(), [...CONTENT_FIELD_KEYS].sort())
    assert.doesNotThrow(() => assertContentOnlyPayload(data, slug))
    for (const f of PROTECTED_FIELDS) assert.ok(!(f in data), slug + ': ' + f + ' must be absent')
  }
})

// ---------------------------------------------------------------------------
// The four-product operation
// ---------------------------------------------------------------------------

const FOUR = ['semax', 'ghk-cu', 'epitalon', 'nad']

test('the four-product plan contains exactly those four slugs', () => {
  const res = buildPlan({ only: FOUR })
  assert.deepEqual(res.plans.map((p) => p.slug).sort(), [...FOUR].sort())
  assert.equal(res.plans.length, 4)
})

test('no slug outside the four can enter the four-product plan', () => {
  const res = buildPlan({ only: FOUR })
  const allowed = new Set(FOUR)
  for (const p of res.plans) assert.ok(allowed.has(p.slug), p.slug + ' must not appear')
  // Spot-check that excluded products really are excluded, including the
  // blocked one and the three regulatory-flagged ones dropped from the seven.
  for (const excluded of ['tb-500', 'bpc-157', 'glp-1trz', 'glp-3rta', '5-amino-1mq', 'hcg']) {
    assert.ok(!res.plans.some((p) => p.slug === excluded), excluded + ' must be excluded')
  }
})

test('an --only list cannot be widened by the planner', () => {
  // A single-slug run yields one plan; the planner never adds siblings.
  for (const s of FOUR) {
    const res = buildPlan({ only: [s] })
    assert.equal(res.plans.length, 1, s + ' must yield exactly one plan')
    assert.equal(res.plans[0].slug, s)
  }
  // An unknown slug yields nothing rather than falling back to everything.
  assert.equal(buildPlan({ only: ['not-a-real-slug'] }).plans.length, 0)
})

test('each of the four builds a payload of exactly the 12 content fields', () => {
  const { products } = loadProducts()
  for (const slug of FOUR) {
    const p = products.find((x) => x.slug === slug)
    assert.ok(p, slug + ' source must exist')
    const data = buildContentPayload(p) as Record<string, unknown>
    assert.deepEqual(Object.keys(data).sort(), [...CONTENT_FIELD_KEYS].sort())
    assert.doesNotThrow(() => assertContentOnlyPayload(data, slug))
    assert.doesNotThrow(() => assertNoImageOrMediaFields(data, slug))
    for (const f of ['id', 'slug', 'name', 'sku', 'price', 'stock', 'status', 'isVisible',
      'images', 'variants', 'categories', 'coaFile', 'coaPurity']) {
      assert.ok(!(f in data), slug + ': ' + f + ' must never be written')
    }
    assert.equal((data.faqs as unknown[]).length, 10, slug + ' must carry 10 FAQs')
  }
})

test('content-only mode blocks all image and media activity for the four', () => {
  // No plan for the four implies any upload once content-only is active: the
  // CLI iterates an empty array in that mode, asserted structurally below.
  const src = fs.readFileSync(
    path.join(import.meta.dirname, '..', '..', 'import-generated-products.ts'), 'utf8')
  assert.match(src, /for \(const img of contentOnly \? \[\] : plan\.images\)/)
  assert.match(src, /if \(!contentOnly && existingCount === 0 && mediaIds\.length > 0\)/)
  // The media create sits inside that loop, so it is unreachable when the
  // loop iterates an empty array. Search from the loop onward, because an
  // earlier `collection: 'media'` belongs to the read-only find().
  const loopAt = src.indexOf('for (const img of contentOnly ? [] : plan.images)')
  const updateAt = src.indexOf('await payload.update(')
  const mediaCreateAt = src.indexOf("collection: 'media'", loopAt)
  assert.ok(loopAt > -1, 'short-circuited loop must exist')
  assert.ok(mediaCreateAt > loopAt && mediaCreateAt < updateAt,
    'the media create must sit between the loop start and the product update')
  // And the run throws if any media counter is non-zero in content-only mode.
  assert.match(src, /contentOnly && \(uploaded > 0 \|\| attached > 0 \|\| reused > 0\)/)
})

test('the supplied CSV is recognised as a uniform +10% uplift', () => {
  const { products } = loadProducts()
  const supplied = loadSuppliedPrices()
  if (supplied.length === 0) return // CSV not present on this machine
  const id = resolveIdentity(products.find((p) => p.slug === 'semaglutide')!, supplied)
  assert.equal(id.priceDisagreement, true, 'the raw figures do differ')
  assert.equal(id.uniformTenPercentUplift, true, 'and the difference is a uniform +10%')
  assert.ok(id.notes.some((n) => /uniform \+10% uplift/.test(n)), 'the relationship must be reported')
})

test('a price disagreement does not block an UPDATE, since no price is written', () => {
  const db = {
    productIdBySlug: new Map<string, string | number>([['dsip', 1]]),
    existingImageCountBySlug: new Map<string, number>([['dsip', 0]]),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  const res = buildPlan({
    only: ['dsip'],
    db,
    approvals: { approved: new Set<string>(), reviewLog: {}, fileExists: true, blockedButListed: [], blockedOverrides: new Map() },
  })
  const plan = res.plans[0]
  assert.ok(
    !plan.skipReasons.includes('PRICE_DISAGREEMENT'),
    'an existing product must not be withheld over a price the importer never writes',
  )
  // It is still surfaced to the operator.
  assert.ok(plan.notes.some((n) => /price disagreement|uplift/.test(n)))
  // Only approval stands in the way.
  assert.deepEqual(plan.skipReasons, ['NOT_APPROVED'])
})

// ---------------------------------------------------------------------------
// C1 - every database connection is gated, reads included
// ---------------------------------------------------------------------------

const REMOTE = 'postgresql://u:p@aws-0-us-east-1.pooler.supabase.com:5432/postgres'
const LOCAL = 'postgresql://u:p@localhost:5432/postgres'

test('target classification covers absent, local, remote and unclassifiable', () => {
  assert.equal(classifyDatabaseTarget(undefined).kind, 'absent')
  assert.equal(classifyDatabaseTarget('').kind, 'absent')
  assert.equal(classifyDatabaseTarget(LOCAL).kind, 'local')
  assert.equal(classifyDatabaseTarget('postgresql://u:p@127.0.0.1:5432/db').kind, 'local')
  assert.equal(classifyDatabaseTarget('postgresql://u:p@host.docker.internal:5432/db').kind, 'local')
  assert.equal(classifyDatabaseTarget(REMOTE).kind, 'remote')
  assert.equal(classifyDatabaseTarget('not-a-uri-at-all').kind, 'unclassifiable')
})

test('a production dry-run read is REFUSED without the read acknowledgement', () => {
  const d = evaluateConnection(['--dry-run', '--with-db'], REMOTE)
  assert.equal(d.allowed, false, 'a remote read must not be allowed by default')
  assert.equal(d.skip, false, 'this is a refusal, not a skip')
  assert.match(d.message, /REFUSED/)
  assert.match(d.message, /--acknowledge-remote-read/)
})

test('the guard is evaluated before Payload is imported', () => {
  // Proven structurally rather than by executing the importer: the connection
  // decision must appear before any payload import or database call.
  const src = fs.readFileSync(
    path.join(import.meta.dirname, '..', '..', 'import-generated-products.ts'),
    'utf8',
  )
  const guardAt = src.indexOf('evaluateConnection(argv)')
  const payloadImportAt = src.indexOf("await import('payload')")
  const loadViewAt = src.indexOf('await loadDatabaseView()')
  assert.ok(guardAt > -1, 'the guard must be present')
  assert.ok(payloadImportAt > -1 && loadViewAt > -1)
  assert.ok(guardAt < loadViewAt, 'guard must precede loadDatabaseView()')
  // process.exit on refusal sits between the guard and the connection.
  const exitAt = src.indexOf('process.exit(2)', guardAt)
  assert.ok(exitAt > guardAt && exitAt < loadViewAt, 'refusal must exit before connecting')
})

test('an acknowledged production read is allowed but authorises no write', () => {
  const prev = process.env[WRITE_GATES.env]
  delete process.env[WRITE_GATES.env]
  const d = evaluateConnection(['--dry-run', '--with-db', READ_GATE.flag], REMOTE)
  assert.equal(d.allowed, true, 'the read is permitted once acknowledged')
  // The crucial property: the read gate is not part of the write conjunction.
  assert.equal(parseArgs(['--with-db', READ_GATE.flag]).dryRun, true, 'read ack must never enable writes')
  assert.equal(
    parseArgs(['--execute', READ_GATE.flag]).dryRun,
    true,
    'read ack plus --execute must still be a dry run',
  )
  if (prev === undefined) delete process.env[WRITE_GATES.env]
  else process.env[WRITE_GATES.env] = prev
})

test('write gates remain independently enforced alongside the read gate', () => {
  const prev = process.env[WRITE_GATES.env]
  process.env[WRITE_GATES.env] = 'true'
  // Read ack present, but the confirm flag is missing -> still a dry run.
  assert.equal(parseArgs(['--execute', READ_GATE.flag]).dryRun, true)
  // All three write gates satisfied -> write, independent of the read gate.
  assert.equal(parseArgs(['--execute', WRITE_GATES.confirm]).dryRun, false)
  // The read gate is not among the reported missing write gates.
  const missing = missingWriteGates([READ_GATE.flag])
  assert.ok(!missing.includes(READ_GATE.flag), 'read gate is not a write gate')
  if (prev === undefined) delete process.env[WRITE_GATES.env]
  else process.env[WRITE_GATES.env] = prev
})

test('an unclassifiable target is refused even with the read acknowledgement', () => {
  const d = evaluateConnection(['--with-db', READ_GATE.flag], 'postgres-but-not-a-url')
  assert.equal(d.allowed, false, 'unknown targets must fail closed')
  assert.equal(d.skip, false)
  assert.match(d.message, /REFUSED/)
  assert.match(d.message, /unclassifiable|not a parseable/i)
  // And it is production for write purposes.
  assert.equal(looksLikeProductionTarget('postgres-but-not-a-url').production, true)
})

test('localhost connects without any acknowledgement', () => {
  const d = evaluateConnection(['--dry-run', '--with-db'], LOCAL)
  assert.equal(d.allowed, true, 'local development must keep working')
  assert.equal(d.skip, false)
  assert.ok(!/REFUSED/.test(d.message))
  assert.equal(looksLikeProductionTarget(LOCAL).production, false)
})

test('an absent DATABASE_URI is a skip, not a refusal', () => {
  const d = evaluateConnection(['--with-db'], undefined)
  assert.equal(d.allowed, false)
  assert.equal(d.skip, true, 'nothing to connect to is not an error')
  assert.ok(!/REFUSED/.test(d.message))
})

// ---------------------------------------------------------------------------
// C2 - product creation uses the canonical catalogue name
// ---------------------------------------------------------------------------

test('creation resolves the canonical name from masterCatalogData', () => {
  const r = resolveCanonicalProductName('semaglutide')
  assert.equal(r.failure, null)
  assert.equal(typeof r.name, 'string')
  const expected = MASTER_PRODUCTS.find((p) => p.slug === 'semaglutide')?.name
  assert.equal(r.name, expected, 'must be the exact catalogue name')
})

test('all 50 generated slugs resolve to a unique canonical name', () => {
  const { products } = loadProducts()
  const unresolved = products.map((p) => ({ slug: p.slug, r: resolveCanonicalProductName(p.slug) })).filter((x) => x.r.name === null)
  assert.deepEqual(unresolved.map((x) => x.slug + ': ' + x.r.reason), [], 'every slug must have one verified name')
})

test('seoTitle is never used as the product name', () => {
  const { products } = loadProducts()
  for (const p of products) {
    const r = resolveCanonicalProductName(p.slug)
    assert.notEqual(r.name, p.fields.seoTitle, p.slug + ': name must not equal seoTitle')
    assert.ok(!(r.name ?? '').includes('|'), p.slug + ': a canonical name carries no SEO pipe separators')
  }
  // And the importer source must not pass seoTitle as name.
  const src = fs.readFileSync(path.join(import.meta.dirname, '..', '..', 'import-generated-products.ts'), 'utf8')
  assert.ok(!/name:\s*product\.fields\.seoTitle/.test(src), 'seoTitle must not be assigned to name')
  assert.ok(/name:\s*canonical\.name/.test(src), 'the canonical name must be used instead')
})

test('a missing canonical name refuses creation', () => {
  const r = resolveCanonicalProductName('a-slug-that-is-not-in-the-catalogue')
  assert.equal(r.name, null)
  assert.equal(r.failure, 'NOT_FOUND')
  assert.match(r.reason, /no entry in masterCatalogData/)
})

test('the planner blocks a create that has no canonical name', () => {
  const db = {
    productIdBySlug: new Map<string, string | number>(), // absent -> would create
    existingImageCountBySlug: new Map<string, number>(),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  const res = buildPlan({ only: ['dsip'], db })
  const plan = res.plans[0]
  // dsip does resolve, so the create is not blocked on the name...
  assert.ok(!plan.skipReasons.includes('NO_CANONICAL_NAME'))
  // ...and the resolved name is reported.
  assert.ok(plan.notes.some((n) => /create would use canonical name/.test(n)))
})

test('existing product updates are unchanged by the C2 fix', () => {
  const { products } = loadProducts()
  const p = products.find((x) => x.slug === 'dsip')!
  const data = buildContentPayload(p)
  // An update payload carries the twelve content fields and no name field.
  assert.deepEqual(Object.keys(data).sort(), [...CONTENT_FIELD_KEYS].sort())
  assert.ok(!('name' in data), 'an update must not rewrite the product name')
  assert.ok(!('slug' in data), 'an update must not rewrite the slug')
  assert.ok(!('status' in data), 'an update must not change publication status')
  assert.ok(!('isVisible' in data), 'an update must not change visibility')
})

test('a price disagreement does block a CREATE, where price is required', () => {
  const db = {
    // Product absent from the database, so the plan would be a create.
    productIdBySlug: new Map<string, string | number>(),
    existingImageCountBySlug: new Map<string, number>(),
    mediaIdByStem: new Map<string, string | number>(),
    consulted: true,
  }
  const res = buildPlan({ only: ['dsip'], db })
  const plan = res.plans[0]
  assert.ok(
    plan.skipReasons.includes('PRICE_DISAGREEMENT'),
    'creating a product requires Products.price, so the price must be adjudicated first',
  )
})
