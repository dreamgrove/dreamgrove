// Spell data for the admin editor: the token table bundled with the site and
// the full list served by /api/spells, fetched once and shared.
import spellData from '../../spellData.json'

export type Spell = {
  id: number
  name: string
  spec: string | null
}

export type IndexedSpell = Spell & { idStr: string }

/** Spell ids by name, as `!Moonfire!` tokens resolve them (plugins/remarkSpell.js) */
export const SPELL_IDS_BY_NAME = spellData as Record<string, string | number>

let spellCache: IndexedSpell[] | null = null
let spellPromise: Promise<IndexedSpell[]> | null = null
let namesById: Map<string, string> | null = null

/** The spell list once it has loaded, else null */
export const cachedSpells = () => spellCache

export function loadSpells(): Promise<IndexedSpell[]> {
  if (spellCache) return Promise.resolve(spellCache)
  if (!spellPromise) {
    spellPromise = fetch('/api/spells')
      .then((res) => res.json())
      .then((data) => {
        const spells: Spell[] = data?.spells ?? []
        spellCache = spells.map((s) => ({ ...s, idStr: String(s.id) }))
        namesById = null
        return spellCache
      })
      .catch((err) => {
        console.error('Failed to load spells', err)
        spellPromise = null
        return []
      })
  }
  return spellPromise
}

/**
 * A spell's name by id: from the full spell list once it has loaded, else the
 * English names in the bundled token table.
 */
export function spellNameById(id: string | number): string | undefined {
  if (!namesById) {
    namesById = new Map()
    for (const [name, i] of Object.entries(SPELL_IDS_BY_NAME)) {
      // Skip the Korean names; the token table lists both
      if (!/[^\u0000-ɏ]/.test(name) && !namesById.has(String(i))) namesById.set(String(i), name)
    }
    for (const s of spellCache ?? []) namesById.set(s.idStr, s.name)
  }
  return namesById.get(String(id))
}

// Maps a path folder (blog/<spec>/...) to the spec label used in spells.db
const SPEC_FOLDERS: Record<string, string> = {
  balance: 'Balance',
  feral: 'Feral',
  guardian: 'Guardian',
  resto: 'Restoration',
  restoration: 'Restoration',
}

/** The spells.db spec of the page at `filePath`, used to rank on-spec spells first */
export function specFromPath(filePath: string): string | null {
  const seg = filePath
    .toLowerCase()
    .split('/')
    .find((s) => SPEC_FOLDERS[s])
  return seg ? SPEC_FOLDERS[seg] : null
}
