import { EventType, Talents, GlobalAction } from '../../../types'

export const predator: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
  }

  if (!state.activeEffects.get(Talents.Predator)) {
    state.activeEffects.set(Talents.Predator, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 5217) spell.effect_duration += 5 // Tiger's Fury
    })
  }

  return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
}
