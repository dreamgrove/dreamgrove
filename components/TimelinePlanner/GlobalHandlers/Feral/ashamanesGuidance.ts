import { EventType, Talents } from 'lib/types/cd_planner'
import { GlobalAction } from 'lib/types/global_handler'

export const ashamanesGuidance: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.AshamanesGuidance)) {
    state.activeEffects.set(Talents.AshamanesGuidance, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 391528) {
        //If Convoke the Spirits
        spell.cooldown *= 0.5
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
