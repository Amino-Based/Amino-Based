import fs from 'fs'
import path from 'path'

/**
 * Source locations and execution gating for the generated-product importer.
 *
 * Every path is overridable by environment variable so the importer can be
 * pointed at a staging copy without editing code. Defaults match where the
 * material actually lives on the authoring machine.
 */

export const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..')

/** Directory holding the 50 generated product JSON files. */
export const CONTENT_DIR =
  process.env.PRODUCT_IMPORT_CONTENT_DIR ?? path.join(REPO_ROOT, 'content-generation')

/**
 * Authoritative image directory. These 79 files are NOT in the repository and
 * must never be copied into `public/` — they reach R2 through Payload's media
 * upload only.
 */
export const IMAGE_DIR =
  process.env.PRODUCT_IMPORT_IMAGE_DIR ?? 'C:/Users/ADIL RAZA KHAN/OneDrive/Desktop/AB'

/** Original -> renamed mapping. Authoritative over each JSON's `upload_as`. */
export const RENAME_MANIFEST = path.join(CONTENT_DIR, 'image-rename-manifest.json')

/** Supplied price list: product,variant,price_usd. Lookup only. */
export const SUPPLIED_PRICE_CSV =
  process.env.PRODUCT_IMPORT_PRICE_CSV ??
  'C:/Users/ADIL RAZA KHAN/Downloads/all-products-plus10-vials-only-2026-11-09.csv'

/** Per-product approval allowlist. Absent or empty means nothing is publishable. */
export const APPROVALS_FILE =
  process.env.PRODUCT_IMPORT_APPROVALS ?? path.join(import.meta.dirname, 'approvals.json')

/** Files in CONTENT_DIR that are not product records. */
export const NON_PRODUCT_FILES = new Set([
  'image-rename-manifest.json',
  'verified-identities.json',
  'product-image-mapping.csv',
  'PHASE12-COMPLETION-REPORT.md',
])

export interface CliOptions {
  /** True unless the operator passed every write gate. Defaults to true. */
  dryRun: boolean
  /**
   * Permit media upload and image attachment. OFF by default, which makes the
   * importer content-only unless an operator explicitly opts in. This flag is
   * convenience, not protection: the payload guards in plan.ts run regardless
   * of how it is set.
   */
  withImages: boolean
  /** Permit creating products that do not yet exist. Off by default. */
  allowCreate: boolean
  /** Status applied to newly created products. Draft unless overridden. */
  createStatus: 'draft' | 'active'
  /** Limit the run to these slugs. */
  only: string[]
  json: boolean
  verbose: boolean
}

/**
 * Write mode requires ALL of the following, independently:
 *   1. `--execute` on the command line
 *   2. `PRODUCT_IMPORT_ALLOW_WRITES=true` in the environment
 *   3. `--i-understand-this-writes-to-the-database`
 *
 * Any missing gate leaves the run in dry-run mode. The presence of database or
 * R2 credentials is never sufficient on its own, and there is no code path that
 * silently promotes a dry run to a write.
 */
export const WRITE_GATES = {
  flag: '--execute',
  env: 'PRODUCT_IMPORT_ALLOW_WRITES',
  confirm: '--i-understand-this-writes-to-the-database',
  /** A production target additionally requires this. */
  productionConfirm: '--allow-production-target',
} as const

/**
 * Reading a non-local database is itself a privileged act, so it has its own
 * acknowledgement — independent of the write gates above.
 *
 * This gate authorises CONNECTING AND READING ONLY. It can never enable a
 * write: `parseArgs` derives `dryRun` purely from WRITE_GATES, and this flag is
 * not part of that conjunction.
 */
export const READ_GATE = {
  flag: '--acknowledge-remote-read',
} as const

export type DatabaseTargetKind =
  /** No DATABASE_URI, so no connection is possible. */
  | 'absent'
  /** localhost / 127.0.0.1 / ::1 / host.docker.internal. */
  | 'local'
  /** A reachable but non-local host — treated as production. */
  | 'remote'
  /** Present but not parseable. Fails closed. */
  | 'unclassifiable'

export interface DatabaseTarget {
  kind: DatabaseTargetKind
  /** Hostname only. Never the user, password, database name or query string. */
  host: string
  /** Safe to log: contains no credential material. */
  reason: string
}

/**
 * Classifies the configured target from the host portion alone. Never returns
 * or logs the credential. `unclassifiable` is deliberate: an unparseable URI
 * must not be assumed safe.
 */
export function classifyDatabaseTarget(uri: string | undefined = process.env.DATABASE_URI): DatabaseTarget {
  if (!uri || uri.trim().length === 0) {
    return { kind: 'absent', host: '', reason: 'DATABASE_URI is not set' }
  }
  let host = ''
  try {
    host = new URL(uri).hostname
  } catch {
    return {
      kind: 'unclassifiable',
      host: '',
      reason: 'DATABASE_URI is not a parseable URI — target cannot be classified',
    }
  }
  if (!host) {
    return { kind: 'unclassifiable', host: '', reason: 'DATABASE_URI has no hostname' }
  }
  if (/^(localhost|127\.0\.0\.1|::1|\[::1\]|host\.docker\.internal)$/i.test(host)) {
    return { kind: 'local', host, reason: `local host (${host})` }
  }
  return { kind: 'remote', host, reason: `non-local database host (${host})` }
}

export interface ConnectionDecision {
  allowed: boolean
  /** True when there is simply nothing to connect to. */
  skip: boolean
  target: DatabaseTarget
  /** Operator-facing explanation. Credential-free. */
  message: string
}

/**
 * Decides whether a database connection may be opened at all.
 *
 * Called BEFORE `payload` or `payload.config` is imported, so an unsafe target
 * is refused before Payload initialises a pool. Applies to every mode,
 * including `--dry-run --with-db`: reading production is gated too.
 */
export function evaluateConnection(argv: string[], uri?: string): ConnectionDecision {
  const target = classifyDatabaseTarget(uri)
  const acknowledged = argv.includes(READ_GATE.flag)

  if (target.kind === 'absent') {
    return { allowed: false, skip: true, target, message: 'DATABASE_URI is not set — continuing without a database view.' }
  }
  if (target.kind === 'unclassifiable') {
    // Fail closed: an unclassifiable target is never connected to, with or
    // without an acknowledgement.
    return {
      allowed: false,
      skip: false,
      target,
      message:
        `REFUSED: ${target.reason}. An unclassifiable target is treated as unsafe ` +
        `and cannot be connected to, even with ${READ_GATE.flag}.`,
    }
  }
  if (target.kind === 'local') {
    return { allowed: true, skip: false, target, message: `connecting to ${target.reason}` }
  }
  // remote
  if (!acknowledged) {
    return {
      allowed: false,
      skip: false,
      target,
      message:
        `REFUSED: ${target.reason}. Reading a non-local database requires ` +
        `${READ_GATE.flag}. This acknowledges a READ ONLY and never authorises a write.`,
    }
  }
  return {
    allowed: true,
    skip: false,
    target,
    message: `connecting to ${target.reason} — read acknowledged via ${READ_GATE.flag}`,
  }
}

export function parseArgs(argv: string[]): CliOptions {
  const has = (f: string) => argv.includes(f)
  const value = (f: string): string | undefined => {
    const i = argv.indexOf(f)
    if (i === -1) return undefined
    const next = argv[i + 1]
    return next && !next.startsWith('--') ? next : undefined
  }

  const gatesPassed =
    has(WRITE_GATES.flag) &&
    has(WRITE_GATES.confirm) &&
    process.env[WRITE_GATES.env] === 'true'

  const createStatus = value('--create-status') === 'active' ? 'active' : 'draft'

  return {
    // Dry run is the default and the fallback. It is only ever cleared by the
    // conjunction above, never by a single flag or by credentials existing.
    dryRun: !gatesPassed,
    // Content-only is the default: images require an explicit opt-in.
    withImages: has('--with-images'),
    allowCreate: has('--allow-create'),
    createStatus,
    only: (value('--only') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    json: has('--json'),
    verbose: has('--verbose'),
  }
}

/** Which gates are missing, for an explicit report rather than a silent downgrade. */
export function missingWriteGates(argv: string[]): string[] {
  const missing: string[] = []
  if (!argv.includes(WRITE_GATES.flag)) missing.push(WRITE_GATES.flag)
  if (!argv.includes(WRITE_GATES.confirm)) missing.push(WRITE_GATES.confirm)
  if (process.env[WRITE_GATES.env] !== 'true') missing.push(`${WRITE_GATES.env}=true`)
  return missing
}

/**
 * Production detection for the WRITE gate, expressed over `classifyDatabaseTarget`
 * so read and write gating share one classifier. Reads only the host portion and
 * never returns or logs the credential.
 *
 * `absent` reports production:false because no connection is possible at all;
 * `unclassifiable` reports production:true so it fails closed.
 */
export function looksLikeProductionTarget(uri?: string): { production: boolean; reason: string } {
  const t = classifyDatabaseTarget(uri)
  if (t.kind === 'absent') return { production: false, reason: 'DATABASE_URI not set' }
  if (t.kind === 'local') return { production: false, reason: t.reason }
  if (t.kind === 'unclassifiable') {
    return { production: true, reason: 'DATABASE_URI unparseable — treated as production' }
  }
  return { production: true, reason: t.reason }
}

export function readJsonFile<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T
}
