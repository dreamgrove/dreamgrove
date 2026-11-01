import { GlobalAction } from '@/types/events'
import { SpellInfo, Talents } from '@/types/timeline'
import { bindings } from './bindings'
import { cotdAffectedSpellIds } from './Balance/controlOfTheDream'

/** Maps each affected spell id to the handlers of the active talents that modify it. */
export function buildKeysToTalents(
  activeTalents: string[],
  spells: SpellInfo[]
): Map<string, Set<GlobalAction>> {
  const map = new Map<string, Set<GlobalAction>>()
  bindings.forEach((binding) => {
    if (activeTalents.includes(binding.id)) {
      const affectedSpells =
        binding.id === Talents.ControlOfTheDream
          ? cotdAffectedSpellIds(spells)
          : binding.affectedSpells
      for (const key of affectedSpells.map(String)) {
        if (!map.has(key)) {
          map.set(key, new Set())
        }
        map.get(key)!.add(binding.handler)
      }
    }
  })
  return map
}
