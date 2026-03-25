import { EventType, Talents, GlobalAction } from '../../../types'

export const improvedEclipse: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
  }

  if (!state.activeEffects.get(Talents.ImprovedEclipse)) {
    state.activeEffects.set(Talents.ImprovedEclipse, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 1239669) spell.charges += 1 // Eclipse
    })
  }

  return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
}
