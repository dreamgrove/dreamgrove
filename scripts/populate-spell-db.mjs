import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'

const API_URL = 'https://simcode.dev/api/spells/druid'

const DB_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../data/spells.db'
)

const CREATE_TABLE = `
CREATE TABLE spells (
  id                  INTEGER PRIMARY KEY,
  name                TEXT,
  school              TEXT,
  spell_type          TEXT,
  class               TEXT,
  spell_level         TEXT,
  cast_time           TEXT,
  gcd                 TEXT,
  gcd_ms              INTEGER,
  cooldown            TEXT,
  category_cooldown   TEXT,
  duration            TEXT,
  duration_ms         INTEGER,
  range               TEXT,
  max_range           INTEGER,
  is_dot              INTEGER,
  is_channel          INTEGER,
  proc_chance         TEXT,
  mechanic            TEXT,
  proc_flags          INTEGER,
  spell_family_flags  INTEGER,
  description         TEXT,
  tooltip             TEXT,
  raw                 TEXT NOT NULL
);
`

const CREATE_INDEX = 'CREATE INDEX idx_spells_name ON spells (name);'

// Ordered list of the typed columns (must match CREATE_TABLE order, excluding `raw`).
const COLUMNS = [
  'id',
  'name',
  'school',
  'spell_type',
  'class',
  'spell_level',
  'cast_time',
  'gcd',
  'gcd_ms',
  'cooldown',
  'category_cooldown',
  'duration',
  'duration_ms',
  'range',
  'max_range',
  'is_dot',
  'is_channel',
  'proc_chance',
  'mechanic',
  'proc_flags',
  'spell_family_flags',
  'description',
  'tooltip',
]

// node:sqlite only binds null | number | bigint | string | Uint8Array, so every
// value must be coerced to one of those before it hits stmt.run().
function coerce(value) {
  if (value === undefined || value === null) return null
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'number' || typeof value === 'bigint') return value
  if (typeof value === 'string') return value
  return null
}

/**
 * Fetch the druid spell list and (re)build data/spells.db. Strict: throws on any
 * failure. The DB file is only opened after a successful fetch + parse, so a
 * failed run leaves any prior spells.db intact.
 */
export async function populate() {
  mkdirSync(path.dirname(DB_PATH), { recursive: true })

  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`fetch ${API_URL} failed: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()

  const entries = Object.values(data?.by_id ?? {})
  if (entries.length === 0) {
    throw new Error(`no spells found in response from ${API_URL}`)
  }

  const db = new DatabaseSync(DB_PATH)
  try {
    db.exec('DROP TABLE IF EXISTS spells')
    db.exec(CREATE_TABLE)
    db.exec(CREATE_INDEX)

    const allCols = [...COLUMNS, 'raw']
    const placeholders = allCols.map(() => '?').join(', ')
    const stmt = db.prepare(
      `INSERT INTO spells (${allCols.join(', ')}) VALUES (${placeholders})`
    )

    let inserted = 0
    db.exec('BEGIN')
    try {
      for (const spell of entries) {
        if (spell?.id === undefined || spell?.id === null) {
          console.warn(`[populate-spell-db] skipping spell with no id: ${spell?.name ?? '?'}`)
          continue
        }
        const values = COLUMNS.map((col) => coerce(spell[col]))
        values.push(JSON.stringify(spell))
        stmt.run(...values)
        inserted++
      }
      db.exec('COMMIT')
    } catch (e) {
      db.exec('ROLLBACK')
      throw e
    }

    console.log(`[populate-spell-db] wrote ${inserted} spells to ${DB_PATH}`)
  } finally {
    db.close()
  }
}

/**
 * Non-fatal wrapper for the build pipeline: an API outage or transient failure
 * logs a warning and never breaks the build (this system is not consumed yet).
 */
export async function populateSpellDbSafe() {
  try {
    await populate()
  } catch (e) {
    console.warn('[populate-spell-db] skipped:', e.message)
  }
}

export default populateSpellDbSafe

// Standalone run (e.g. `pnpm populate-spells`) uses the strict path and exits
// non-zero on failure so deliberate runs surface problems.
if (import.meta.url === `file://${process.argv[1]}`) {
  populate().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
