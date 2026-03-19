import { EventType, Talents, GlobalAction } from '../../../types'

export const whirlingStars: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.WhirlingStars)) {
    state.activeEffects.set(Talents.WhirlingStars, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 194223) {
        //If Celestial Alignment
        spell.cooldown -= 60
        spell.charges = 2
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
