import { EventType, Talents, GlobalAction } from '../../../types'

export const incarnation: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.Incarnation)) {
    state.activeEffects.set(Talents.Incarnation, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 194223) {
        //If Celestial Alignment
        spell.effect_duration += Math.round(spell.effect_duration * 0.33)
      }
    })
  }

  return {
    changedEvent: event,
    eventsToAdd: [],
    newState: state,
    newSpells: spells,
  }
}
