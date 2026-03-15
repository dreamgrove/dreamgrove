import { useMemo } from 'react'
import { GlobalAction } from '@/types/events'
import { SpellInfo, Talents } from '@/types/timeline'
import { bindings } from '@/lib/talent_handlers'

export function useKeysToTalents(activeTalents: string[], spells: SpellInfo[]) {
  const keysToTalents = useMemo(() => {
    const map = new Map<string, Set<GlobalAction>>()
    bindings.forEach((binding) => {
      if (activeTalents.includes(binding.id)) {
        const affectedKeys = binding.affectedSpells.map(String)
        // For CotD, also include custom spells that opted in
        if (binding.id === Talents.ControlOfTheDream) {
          for (const spell of spells) {
            if (spell.cotdAffected && !affectedKeys.includes(String(spell.spellId))) {
              affectedKeys.push(String(spell.spellId))
            }
          }
        }
        for (const key of affectedKeys) {
          if (!map.has(key)) {
            map.set(key, new Set())
          }
          map.get(key)!.add(binding.handler)
        }
      }
    })
    return map
  }, [activeTalents, spells])

  return {
    keysToTalents,
  }
}
