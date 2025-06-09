import { EventType, Talents, GlobalAction } from '../../../types'

export const dreamstate: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)

  if (!spellInfo || event.type !== EventType.ChannelStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.Dreamstate)) {
    state.activeEffects.set(Talents.Dreamstate, new Map([[event.spellId, event.time]]))
    if (event.spellId === 740) {
      const dreamstateEvent = {
        type: EventType.DreamstateCdr,
        time: event.time,
        spellId: event.spellId,
        castId: event.castId,
      }
      return {
        changedEvent: event,
        eventsToAdd: [dreamstateEvent],
        newState: state,
        newSpells: spells,
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
