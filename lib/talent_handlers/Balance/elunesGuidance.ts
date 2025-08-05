import { EventType, Talents, GlobalAction } from '../../../types'

export const elunesGuidance: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.ElunesGuidance)) {
    state.activeEffects.set(Talents.ElunesGuidance, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 391528) {
        //If Convoke
        spell.cooldown *= 0.5
        spell.channel_duration *= 0.75
        spell.effect_duration *= 0.75
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
