import { EventType, GlobalAction, SpellInfo, Talents } from '@/types/index'

/**
 * A talent that changes spell data for the rest of the timeline. It applies once,
 * on the first cast of any spell it is bound to, to the processor's working copy
 * of the spells. `modify` maps a spell id to the change for that spell.
 */
export function spellModifier(
  talent: Talents,
  modify: Record<number, (spell: SpellInfo) => void>
): GlobalAction {
  return (event, queue, state, spells) => {
    if (event.type !== EventType.CastStart) return []
    if (!spells.some((s) => s.spellId === event.spellId)) return []
    if (state.activeEffects.get(talent)) return []

    state.activeEffects.set(talent, new Map([[event.spellId, event.time]]))
    for (const spell of spells) {
      modify[spell.spellId]?.(spell)
    }
    return []
  }
}
