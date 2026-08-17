import { EventType, Talents, GlobalAction } from '../../../types'

export const bounteousBloom: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
  }

  if (!state.activeEffects.get(Talents.BounteousBloom)) {
    state.activeEffects.set(Talents.BounteousBloom, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 205636) spell.effect_duration += 4 // Force of Nature
    })
  }

  return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
}
