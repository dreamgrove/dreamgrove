import { EventType, Talents, GlobalAction } from '../../../types'

export const orbitalStrike: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (!spellInfo || event.type !== EventType.CastStart) {
    return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
  }

  if (!state.activeEffects.get(Talents.OrbitalStrike)) {
    state.activeEffects.set(Talents.OrbitalStrike, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 194223) spell.cooldown -= 60 // Celestial Alignment
    })
  }

  return { changedEvent: event, eventsToAdd: [], newState: state, newSpells: spells }
}
