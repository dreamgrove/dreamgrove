import { EventType, Talents, GlobalAction } from '../../../types'

export const radiantMoonlight: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
  }

  if (!state.activeEffects.get(Talents.RadiantMoonlight)) {
    state.activeEffects.set(Talents.RadiantMoonlight, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 202770) spell.cooldown -= 15 // Fury of Elune
    })
  }

  return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
}
