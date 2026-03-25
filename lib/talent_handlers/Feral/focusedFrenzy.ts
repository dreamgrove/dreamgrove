import { EventType, Talents, GlobalAction } from '../../../types'

export const focusedFrenzy: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
  }

  if (!state.activeEffects.get(Talents.FocusedFrenzy)) {
    state.activeEffects.set(Talents.FocusedFrenzy, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 274837) spell.cooldown -= 15 // Feral Frenzy
    })
  }

  return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
}
