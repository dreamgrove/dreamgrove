import { EventType, GlobalAction } from '../../../types'

export const controlOfTheDream: GlobalAction = (event, queue, state, spells) => {
  if (event.type === EventType.CooldownEnd) {
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
  return {
    changedEvent: event,
    eventsToAdd: [],
    newState: state,
    newSpells: spells,
  }
}
