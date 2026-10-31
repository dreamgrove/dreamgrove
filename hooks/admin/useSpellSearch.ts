import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { cachedSpells, loadSpells, type IndexedSpell, type Spell } from '@/lib/admin/spells'

const MAX_RESULTS = 50
const SPEC_BOOST = 0.1
const NONE: IndexedSpell[] = []

/**
 * Fuzzy-searches the spell list by name or id, with on-spec spells slightly prioritized
 * Returns [] until a query is typed. `enabled` defers the fetch until
 * first use.
 */
export function useSpellSearch(
  query: string,
  currentSpec: string | null | undefined,
  enabled = true
): Spell[] {
  // The shared cache may be filled by another loader (rich mode) at any time,
  // so it's read on every render rather than copied into state once
  const [loaded, setLoaded] = useState<IndexedSpell[] | null>(null)
  const spells = loaded ?? cachedSpells() ?? NONE

  useEffect(() => {
    if (!enabled || cachedSpells()) return
    let active = true
    loadSpells().then((s) => {
      if (active) setLoaded(s)
    })
    return () => {
      active = false
    }
  }, [enabled])

  const fuse = useMemo(
    () =>
      new Fuse(spells, {
        keys: ['name', 'idStr'],
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
      }),
    [spells]
  )

  return useMemo(() => {
    const q = query.trim()
    if (!q) return []
    const onSpec = (s: Spell) => !!currentSpec && !!s.spec && s.spec.includes(currentSpec)
    const score = (r: { item: Spell; score?: number }) =>
      (r.score ?? 0) - (onSpec(r.item) ? SPEC_BOOST : 0)
    return fuse
      .search(q)
      .sort((a, b) => score(a) - score(b))
      .slice(0, MAX_RESULTS)
      .map((r) => r.item)
  }, [query, fuse, currentSpec])
}
