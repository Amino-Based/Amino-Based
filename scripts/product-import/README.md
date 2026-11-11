# Generated product importer

Publishes the 50 generated Amino Based product records and their 79 images into
the existing Payload `products` and `media` collections. Media reaches
Cloudflare R2 through the project's existing `s3Storage` adapter
(`payload.config.ts`) — this importer contains no direct-to-R2 code path.

## Dry run (the default, and the only mode exercised so far)

```
npx tsx scripts/import-generated-products.ts --dry-run
```

Useful additions:

| Flag | Effect |
| --- | --- |
| `--with-db` | also consult the database read-only, so create/update and already-uploaded media can be determined. A non-local host additionally requires `--acknowledge-remote-read` |
| `--verbose` | per-product action, skip reasons and notes |
| `--only slug-a,slug-b` | restrict the run |
| `--json` | machine-readable plan on stdout |

A dry run performs **zero** database writes and **zero** uploads.

## Connecting to a database is itself gated

Every database contact — reads included, dry run included — is classified before
`payload` is imported, so an unsafe target is refused before a connection pool
can be created.

| Target | Behaviour |
| --- | --- |
| `DATABASE_URI` unset | skipped; the run continues with no database view |
| `localhost` / `127.0.0.1` / `::1` / `host.docker.internal` | connects, no acknowledgement needed |
| any other host | **refused** unless `--acknowledge-remote-read` is passed |
| unparseable `DATABASE_URI` | **refused**, with or without the acknowledgement — fails closed |

`--acknowledge-remote-read` authorises a **read only**. It is not part of the
write conjunction and can never enable a write; a write against a non-local host
still needs all three write gates *plus* `--allow-production-target`.

Reading a non-local database therefore looks like:

```
npx tsx scripts/import-generated-products.ts --dry-run --with-db --verbose --acknowledge-remote-read
```

## Sources

| Input | Default location | Override |
| --- | --- | --- |
| 50 product JSON files | `content-generation/` | `PRODUCT_IMPORT_CONTENT_DIR` |
| 79 images | `C:\Users\ADIL RAZA KHAN\OneDrive\Desktop\AB` | `PRODUCT_IMPORT_IMAGE_DIR` |
| rename manifest | `content-generation/image-rename-manifest.json` | — |
| supplied price list | `C:\Users\ADIL RAZA KHAN\Downloads\all-products-plus10-vials-only-2026-11-09.csv` | `PRODUCT_IMPORT_PRICE_CSV` |
| approval allowlist | `scripts/product-import/approvals.json` | `PRODUCT_IMPORT_APPROVALS` |

The image directory is read in place. Images are never copied into `public/`.

## Approval is mandatory and manual

`approvals.json` ships with an empty `approvedSlugs`, so **nothing is
publishable until a human adds reviewed slugs**. Structural validity of a JSON
file is not approval — all 50 files validate cleanly, and all 50 are skipped.

The eight generator-BLOCKED slugs are refused even if listed:

```
5-amino-1mq  bpc-157-tb-500-blend  glow  hcg  igf-1-lr3  klow  lipo-c  tb-500
```

Approve a product by adding its slug, with a review record:

```json
{
  "approvedSlugs": ["dsip"],
  "reviewLog": { "dsip": { "reviewer": "name", "date": "2026-11-11", "note": "identity + compliance reviewed" } }
}
```

## What the importer writes, and what it will not touch

Written — the twelve content fields, copied verbatim with no truncation or
rewriting:

```
seoTitle  seoDescription  description
productDetailsTitle  productDetailsDescription
researchFocusTitle   researchFocusDescription
qualityPurityTitle   qualityPurityDescription
complianceNoticeTitle complianceNoticeDescription
faqs
```

Never written, under any flag:

```
price  salePrice  sku  stock  variants  bulkBundles  categories
averageRating  reviewCount
coaFile  coaBatchNumber  coaPurity  coaAnalyzedDate
```

COA fields stay empty. A batch number, purity figure or analysis date is a claim
about a real assay and is populated from an actual client certificate or not at
all — the same policy `scripts/seed.ts` states for itself.

## Content-only mode (the default)

The importer writes **only the twelve content fields** unless `--with-images` is
passed. In content-only mode it never reads an image file, never creates a Media
document, never writes to R2, and never sets `images`. A content-only run also
cannot create products, because a create necessarily writes `name`, `slug`,
`status` and `isVisible`, none of which is a content field.

The flag is convenience, not protection. Two guards in `plan.ts` run on every
write path regardless of flag state:

| Guard | Applies | Refuses |
| --- | --- | --- |
| `assertNoImageOrMediaFields` | **every mode** | any payload containing `images`, `variants`, `bulkBundles`, `coaFile`, `media`, `image`, `thumbnail`, `gallery`, `galleryImages` |
| `assertContentOnlyPayload` | content-only | any key outside the twelve content fields |

Neither guard reads `argv` or the options object, so no flag can disable them. A
content-only write additionally **requires `--only slug-a,slug-b`**: it refuses
to run across everything approved. The run reports `image uploads 0` and
`image attachments 0`, and throws if either is non-zero.

```
PRODUCT_IMPORT_ALLOW_WRITES=true npx tsx scripts/import-generated-products.ts \
  --execute --i-understand-this-writes-to-the-database \
  --acknowledge-remote-read --allow-production-target \
  --only bpc-157,glp-1trz,glp-3rta,ghk-cu,epitalon,semax,nad --verbose
```

## Images

`image-rename-manifest.json` is authoritative over each JSON's `upload_as`.
`content-generation/ll-37.json` declares `amino-ll-37.png` while the manifest and
the file on disk are `amino-ll-37-standard.png`; the importer resolves through
the manifest and reports the correction. Neither the JSON nor the image is
modified.

Every target filename keeps the `amino-` prefix, which
`lib/products/productImage.ts` checks before its blocklist, so uploads cannot be
suppressed as inherited imagery.

Media idempotency matches on filename **stem**, because `collections/Media.ts`
re-encodes uploads to webp — a file sent as `amino-x.png` is stored as
`amino-x.webp`. A rerun reuses the existing media document instead of uploading
again.

Product images are attached only when a product has **no** existing image
relationships, so photography curated in the CMS is never replaced.

## Prices

The supplied CSV sits a uniform **+10%** above `lib/masterCatalogData.ts` for
every comparable variant, which matches the file's own name
(`all-products-plus10-...`). The importer reports this and never resolves it: it
writes no price field at all. The disagreement becomes blocking only on the
create path, where `Products.price` is required.

SKUs come solely from `lib/masterCatalogData.ts`. Where a variant has no SKU
there, the importer reports it and writes no variants — it does not invent one.

## Write mode (not exercised; do not run without authorisation)

Three independent gates, all required together:

```
--execute
--i-understand-this-writes-to-the-database
PRODUCT_IMPORT_ALLOW_WRITES=true
```

Any missing gate leaves the run in dry-run mode. Credentials existing is never
sufficient, and no code path promotes a dry run to a write silently. A non-local
database host additionally requires `--allow-production-target`, or the run
exits with code 2.

Creating new products also requires `--allow-create`; new records are created as
`draft` with `isVisible: false` unless `--create-status active` is passed.

The importer never deletes a product, never resets a collection, never touches
`scripts/seed.ts`, and never uses `SEED_RESET`.

## Tests

```
node --import tsx --test scripts/product-import/__tests__/product-import.test.ts
```
