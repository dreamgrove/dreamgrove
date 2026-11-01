import { PlayerAction, SpellInfo, SpellToRender } from '@/types/timeline'
import { decodeLoadout } from '@/lib/utils/loadoutCode'
import { generateBaseQueue, processEventQueue } from '@/lib/timeline_events/processEventQueue'
import { buildKeysToTalents } from '@/lib/talent_handlers/keysToTalents'

export interface SimulatedLoadout {
  spec: string
  timelineLengthS: number
  spells: SpellToRender[]
  skippedSpellIds: number[]
  customSpells: SpellInfo[]
}

export const EMBED_MIN_LENGTH_S = 30

/**
 * Decode a loadout code and run it through the planner's simulation pipeline,
 * producing render-ready spell rows. Mirrors LoadoutManager's import logic but
 * is pure: no React state, deterministic cast ids.
 */
export function simulateLoadout(code: string, baseSpells: SpellInfo[]): SimulatedLoadout {
  const decoded = decodeLoadout(code)

  const allSpells = [...baseSpells, ...decoded.customSpells]
  const spellMap = new Map(allSpells.map((s) => [s.spellId, s]))

  const events: PlayerAction[] = []
  const skippedSpellIds: number[] = []
  decoded.events.forEach((e, i) => {
    const spell = spellMap.get(e.spellId)
    if (!spell) {
      if (!skippedSpellIds.includes(e.spellId)) skippedSpellIds.push(e.spellId)
      return
    }
    events.push({ spell, instant: e.instant, id: `embed-${i}` })
  })

  const queue = generateBaseQueue(events)
  const { processedState } = processEventQueue(
    queue,
    allSpells,
    buildKeysToTalents(decoded.activeTalents, allSpells),
    decoded.activeTalents
  )

  const spells = [...processedState.spells].sort((a, b) => a.spell.spellId - b.spell.spellId)

  return {
    spec: decoded.spec,
    timelineLengthS: Math.max(processedState.timeline_length_s, EMBED_MIN_LENGTH_S),
    spells,
    skippedSpellIds,
    customSpells: decoded.customSpells,
  }
}
