import { EventType, Talents, GlobalAction } from '@/types/index'
import { spellModifier } from '../spellModifier'

const modifyConvoke = spellModifier(Talents.CenariusGuidance, {
  // Convoke the Spirits
  391528: (spell) => {
    spell.cooldown *= 0.5
    spell.effect_duration *= 0.75
  },
})

export const cenariusGuidance: GlobalAction = (event, queue, state, spells) => {
  if (event.type !== EventType.CastStart) return []
  if (!spells.some((s) => s.spellId === event.spellId)) return []

  modifyConvoke(event, queue, state, spells)

  // Tree of Life summons treants (Grove Guardians) 15s in
  if (event.spellId !== 33891) return []
  return [
    {
      type: EventType.CenariusGuidance,
      time: event.time + 15,
      spellId: 102693,
      castId: event.castId,
    },
  ]
}
