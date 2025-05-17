import { TimelineEvent, EventType, Talents } from '../../../lib/types/cd_planner'
import { GlobalAction } from '../../../lib/types/global_handler'

export const earlySpring: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.EarlySpring)) {
    state.activeEffects.set(Talents.EarlySpring, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 205636) {
        //If Force of Nature
        spell.cooldown -= 15
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
