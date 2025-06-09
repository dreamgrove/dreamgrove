import { EventType, Talents, GlobalAction } from '../../../types'

export const tearDownTheMighty: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.TearDownTheMighty)) {
    state.activeEffects.set(Talents.TearDownTheMighty, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 274837) {
        //If Force of Nature
        spell.cooldown -= 10
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
