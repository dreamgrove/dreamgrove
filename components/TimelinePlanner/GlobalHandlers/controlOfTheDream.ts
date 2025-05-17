import { EventType, Talents } from '../../../lib/types/cd_planner'
import { GlobalAction } from '../../../lib/types/global_handler'

export const controlOfTheDream: GlobalAction = (event, queue, state, spells) => {
  console.log('COTD: Cooldown end', event)
  if (event.type === EventType.CooldownEnd) {
    if (event.spellId === 194223 || event.spellId === 205636 || event.spellId === 391528) {
      console.log('COTD: Spell found', event.spellId)
      const spell = spells.find((s) => s.spellId === event.spellId)
      if (spell) {
        const spellState = state.findOrCreateSpellState(event.spellId, spell.charges || 1)
        if (spellState.usedCharges === 0) {
          console.log('COTD: Adding event', event.time + 0.01)
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
