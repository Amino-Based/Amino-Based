import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { IMAGE_DIR, RENAME_MANIFEST, readJsonFile } from './config.js'
import type { GeneratedProduct, RenameEntry, ResolvedImage } from './types.js'

/**
 * Resolves the 79 product images.
 *
 * Authority order, deliberately: image-rename-manifest.json first, then the
 * filesystem, and the product JSON's own `upload_as` last. `content-generation/
 * ll-37.json` declares `amino-ll-37.png` while the manifest and the actual file
 * both say `amino-ll-37-standard.png`; resolving through the manifest fixes that
 * without touching either the JSON or the image.
 */

export const ALWAYS_ALLOWED_PREFIX = 'amino-'

export interface ManifestIndex {
  /** renamed filename -> original filename */
  byRenamed: Map<string, string>
  /** original filename -> renamed filename */
  byOriginal: Map<string, string>
  entries: RenameEntry[]
}

export function loadRenameManifest(file: string = RENAME_MANIFEST): ManifestIndex {
  const entries = readJsonFile<RenameEntry[]>(file)
  const byRenamed = new Map<string, string>()
  const byOriginal = new Map<string, string>()
  for (const e of entries) {
    byRenamed.set(e.renamed.toLowerCase(), e.original)
    byOriginal.set(e.original.toLowerCase(), e.renamed)
  }
  return { byRenamed, byOriginal, entries }
}

/** Magic-byte sniffing. The extension is not trusted. */
export function detectFormat(buf: Buffer): string | null {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return 'png'
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg'
  if (buf.length >= 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP')
    return 'webp'
  if (buf.length >= 6 && buf.subarray(0, 6).toString('ascii').startsWith('GIF8')) return 'gif'
  return null
}

const SUPPORTED_FORMATS = new Set(['png', 'jpeg', 'webp'])

export function isSupportedFormat(fmt: string | null): boolean {
  return !!fmt && SUPPORTED_FORMATS.has(fmt)
}

/**
 * The filename a Media document will be looked up and uploaded under.
 *
 * Resolution: if the declared name is in the manifest as a `renamed` value, it
 * is already correct. Otherwise the declared name's stem is matched against the
 * manifest's renamed values, which recovers the `ll-37` case.
 */
export function resolveImageTarget(declared: string, manifest: ManifestIndex): { resolved: string; corrected: boolean } {
  const lower = declared.toLowerCase()
  if (manifest.byRenamed.has(lower)) return { resolved: declared, corrected: false }

  const stem = stemOf(declared)
  const candidates = manifest.entries.filter((e) => {
    const s = stemOf(e.renamed)
    return s === stem || s === `${stem}-standard`
  })
  if (candidates.length === 1) {
    return { resolved: candidates[0].renamed, corrected: candidates[0].renamed !== declared }
  }
  // Ambiguous or absent: keep the declared name and let existence checking fail
  // loudly rather than guessing between candidates.
  return { resolved: declared, corrected: false }
}

export function stemOf(filename: string): string {
  return filename.replace(/\.[A-Za-z0-9]+$/, '').toLowerCase()
}

export function resolveProductImages(
  products: GeneratedProduct[],
  manifest: ManifestIndex,
  imageDir: string = IMAGE_DIR,
): ResolvedImage[] {
  const out: ResolvedImage[] = []
  for (const p of products) {
    for (const ref of p.images) {
      const { resolved, corrected } = resolveImageTarget(ref.upload_as, manifest)
      const abs = path.join(imageDir, resolved)
      let exists = false
      let readable = false
      let byteSize = 0
      let sha256: string | null = null
      let detectedFormat: string | null = null
      try {
        const st = fs.statSync(abs)
        exists = st.isFile()
        byteSize = st.size
      } catch {
        exists = false
      }
      if (exists) {
        try {
          const buf = fs.readFileSync(abs)
          readable = true
          sha256 = crypto.createHash('sha256').update(buf).digest('hex')
          detectedFormat = detectFormat(buf)
        } catch {
          readable = false
        }
      }
      out.push({
        slug: p.slug,
        variant: ref.variant,
        declared: ref.upload_as,
        resolved,
        correctedByManifest: corrected,
        absolutePath: abs,
        existsOnDisk: exists,
        readable,
        byteSize,
        sha256,
        detectedFormat,
      })
    }
  }
  return out
}

export interface ImageAudit {
  total: number
  found: number
  missing: ResolvedImage[]
  unreadable: ResolvedImage[]
  unsupportedFormat: ResolvedImage[]
  corrected: ResolvedImage[]
  /** Same target filename claimed by more than one product/variant. */
  duplicateTargets: Map<string, ResolvedImage[]>
  /** Identical file content under different target names. */
  duplicateContent: Map<string, ResolvedImage[]>
  /** Target filenames that would not clear the `amino-` allowlist. */
  prefixViolations: ResolvedImage[]
  /** Files present in the image directory that no product references. */
  orphanFiles: string[]
}

export function auditImages(resolved: ResolvedImage[], imageDir: string = IMAGE_DIR): ImageAudit {
  const byTarget = new Map<string, ResolvedImage[]>()
  const byHash = new Map<string, ResolvedImage[]>()
  for (const r of resolved) {
    byTarget.set(r.resolved.toLowerCase(), [...(byTarget.get(r.resolved.toLowerCase()) ?? []), r])
    if (r.sha256) byHash.set(r.sha256, [...(byHash.get(r.sha256) ?? []), r])
  }

  let onDisk: string[] = []
  try {
    onDisk = fs.readdirSync(imageDir).filter((f) => fs.statSync(path.join(imageDir, f)).isFile())
  } catch {
    onDisk = []
  }
  const referenced = new Set(resolved.map((r) => r.resolved.toLowerCase()))

  return {
    total: resolved.length,
    found: resolved.filter((r) => r.existsOnDisk).length,
    missing: resolved.filter((r) => !r.existsOnDisk),
    unreadable: resolved.filter((r) => r.existsOnDisk && !r.readable),
    unsupportedFormat: resolved.filter((r) => r.readable && !isSupportedFormat(r.detectedFormat)),
    corrected: resolved.filter((r) => r.correctedByManifest),
    duplicateTargets: new Map([...byTarget].filter(([, v]) => v.length > 1)),
    duplicateContent: new Map([...byHash].filter(([, v]) => v.length > 1)),
    prefixViolations: resolved.filter((r) => !r.resolved.toLowerCase().startsWith(ALWAYS_ALLOWED_PREFIX)),
    orphanFiles: onDisk.filter((f) => !referenced.has(f.toLowerCase())),
  }
}

/**
 * Media filenames are matched on stem, not full filename: the media collection
 * re-encodes uploads to webp (collections/Media.ts formatOptions), so a file
 * uploaded as `amino-x.png` is stored as `amino-x.webp`.
 */
export function mediaLookupStem(resolvedFilename: string): string {
  return stemOf(resolvedFilename)
}
