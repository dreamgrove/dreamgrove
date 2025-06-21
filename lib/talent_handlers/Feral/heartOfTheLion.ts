import { EventType, Talents, GlobalAction } from '../../../types'

export const heartOfTheLion: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.HeartOfTheLion)) {
    state.activeEffects.set(Talents.HeartOfTheLion, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 106951) {
        //If Berserk
        spell.cooldown -= 60
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
