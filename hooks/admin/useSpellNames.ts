import { useEffect, useState } from 'react'
import { cachedSpells, loadSpells, spellNameById } from '@/lib/admin/spells'

/** spellNameById, re-rendering once the full spell list has loaded */
export function useSpellNames(): (id: string | number) => string | undefined {
  const [, setLoaded] = useState(() => cachedSpells() !== null)
  useEffect(() => {
    if (cachedSpells()) return
    let active = true
    loadSpells().then(() => {
      if (active) setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [])
  return spellNameById
}
