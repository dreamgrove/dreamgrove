import { EventType, Talents } from 'lib/types/cd_planner'
import { GlobalAction } from 'lib/types/global_handler'

export const cenariusGuidance: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.CenariusGuidance)) {
    //Always reduce Convoke the Spirits cooldown by 50%
    state.activeEffects.set(Talents.CenariusGuidance, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 391528) {
        //If Convoke the Spirits
        spell.cooldown *= 0.5
        spell.effect_duration *= 0.75
      }
    })
  }
  // If its Tree of Life, add the treants events
  if (event.spellId === 33891) {
    const treantsEvents = {
      type: EventType.CenariusGuidance,
      time: event.time + 15,
      spellId: 102693,
      castId: event.castId,
    }
    return {
      changedEvent: event,
      eventsToAdd: [treantsEvents],
      newState: state,
      newSpells: spells,
    }
  }

  return {
    changedEvent: event,
    eventsToAdd: [],
    newState: state,
    newSpells: spells,
  }
}
