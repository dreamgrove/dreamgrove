import { useEffect, useMemo, useState } from 'react'
import { cachedSpells, loadSpells, type Spell } from '@/lib/admin/spells'

/** Spell names by id */
export function useSpellNames(): Map<number, string> {
  // Read from the shared cache on render, as another loader may have filled it
  const [loaded, setLoaded] = useState<Spell[] | null>(null)
  const list = loaded ?? cachedSpells()
  useEffect(() => {
    if (cachedSpells()) return
    let active = true
    loadSpells().then((list) => {
      if (active) setLoaded(list)
    })
    return () => {
      active = false
    }
  }, [])
  return useMemo(() => new Map(list?.map((s) => [s.id, s.name])), [list])
}
