import { EventType, Talents } from 'lib/types/cd_planner'
import { GlobalAction } from 'lib/types/global_handler'

export const potentEnchantments: GlobalAction = (event, queue, state, spells) => {
  const spellInfo = spells.find((s) => s.spellId === event.spellId)
  if (
    !spellInfo ||
    event.type !== EventType.CastStart ||
    !state.activeEffects.get(Talents.WhirlingStars)
  ) {
    return {
      changedEvent: event,
      eventsToAdd: [],
      newState: state,
      newSpells: spells,
    }
  }

  if (!state.activeEffects.get(Talents.PotentEnchantments)) {
    state.activeEffects.set(Talents.PotentEnchantments, new Map([[event.spellId, event.time]]))
    spells.forEach((spell) => {
      if (spell.spellId === 194223) {
        //If Celestial Alignment
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
