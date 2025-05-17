import { EventType, Talents } from '../../../lib/types/cd_planner'
import { GlobalAction } from '../../../lib/types/global_handler'

export const controlOfTheDream: GlobalAction = (event, queue, state, spells) => {
  if (event.type === EventType.CooldownEnd) {
    if (event.spellId === 194223 || event.spellId === 205636 || event.spellId === 391528) {
      const spell = spells.find((s) => s.spellId === event.spellId)
      if (spell) {
        const spellState = state.findOrCreateSpellState(event.spellId, spell.charges || 1)
        if (spellState.usedCharges === 0) {
          const cotdEvent = {
            type: EventType.ControlOfTheDream,
            time: event.time + 0.01,
            spellId: event.spellId,
            castId: event.castId,
          }
          return {
            changedEvent: event,
            eventsToAdd: [cotdEvent],
            newState: state,
            newSpells: spells,
          }
        }
      }
    }
  }
  return {
    changedEvent: event,
    eventsToAdd: [],
    newState: state,
    newSpells: spells,
  }
}
