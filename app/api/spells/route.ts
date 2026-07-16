import { NextResponse } from 'next/server'
import path from 'path'
import { DatabaseSync } from 'node:sqlite'

// node:sqlite is a Node builtin (needs the Node runtime, not edge).
export const runtime = 'nodejs'

type Spell = { id: number; name: string; spec: string | null }

// The DB is a static build artifact (data/spells.db, rebuilt by
// `pnpm populate-spells`), so read it once and cache the rows in module scope.
// `spec` is precomputed at ingest time — no JSON parsing happens here.
let cache: Spell[] | null = null

function loadSpells(): Spell[] {
  if (cache) return cache
  const dbPath = path.join(process.cwd(), 'data', 'spells.db')
  const db = new DatabaseSync(dbPath, { readOnly: true })
  try {
    cache = db.prepare('SELECT id, name, spec FROM spells ORDER BY name').all() as Spell[]
    return cache
  } finally {
    db.close()
  }
}

export async function GET() {
  try {
    return NextResponse.json({ spells: loadSpells() })
  } catch (error) {
    console.error('Error loading spells:', error)
    return NextResponse.json({ error: 'Failed to load spells' }, { status: 500 })
  }
}
