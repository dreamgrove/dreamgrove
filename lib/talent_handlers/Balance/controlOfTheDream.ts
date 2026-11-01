import { EventType, GlobalAction, SpellInfo } from '@/types/index'

/** Celestial Alignment, Convoke the Spirits, Force of Nature, Tree of Life */
export const COTD_SPELL_IDS = [194223, 391528, 205636, 33891]

/** The spells Control of the Dream affects: the built-in ones plus custom spells that opted in. */
export function cotdAffectedSpellIds(spells: SpellInfo[]): number[] {
  const ids = [...COTD_SPELL_IDS]
  for (const spell of spells) {
    if (spell.cotdAffected && !ids.includes(spell.spellId)) ids.push(spell.spellId)
  }
  return ids
}

export const controlOfTheDream: GlobalAction = (event, queue, state, spells) => {
  if (event.type !== EventType.CooldownEnd) return []
  const spell = spells.find((s) => s.spellId === event.spellId)
  if (!spell) return []

  const spellState = state.findOrCreateSpellState(event.spellId, spell.charges || 1)
  if (spellState.usedCharges !== 0) return []

  return [
    {
      type: EventType.ControlOfTheDream,
      time: event.time + 0.01,
      spellId: event.spellId,
      castId: event.castId,
    },
  ]
}
