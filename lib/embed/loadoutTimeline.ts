import { GlobalAction } from '@/types/events'
import { PlayerAction, SpellInfo, SpellToRender, Talents } from '@/types/timeline'
import { Cast } from '@/models/Cast'
import { bindings } from '@/lib/talent_handlers'
import { decodeLoadout } from '@/lib/utils/loadoutCode'
import { generateBaseQueue, processEventQueue } from '@/components/TimelinePlanner/TimelineEvents'

export function buildKeysToTalents(
  activeTalents: string[],
  spells: SpellInfo[]
): Map<string, Set<GlobalAction>> {
  const map = new Map<string, Set<GlobalAction>>()
  bindings.forEach((binding) => {
    if (activeTalents.includes(binding.id)) {
      const affectedKeys = binding.affectedSpells.map(String)
      // For CotD, also include custom spells that opted in
      if (binding.id === Talents.ControlOfTheDream) {
        for (const spell of spells) {
          if (spell.cotdAffected && !affectedKeys.includes(String(spell.spellId))) {
            affectedKeys.push(String(spell.spellId))
          }
        }
      }
      for (const key of affectedKeys) {
        if (!map.has(key)) {
          map.set(key, new Set())
        }
        map.get(key)!.add(binding.handler)
      }
    }
  })
  return map
}

export const splitCastsByCharges = (casts: Cast[], charges: number): Cast[][] => {
  if (!charges || charges <= 1) {
    return [casts]
  }

  const castsByCharge: Cast[][] = Array.from({ length: charges }, () => [])
  const sortedCasts = [...casts].sort((a, b) => a.start_s - b.start_s)

  // Distribute casts in round-robin fashion
  sortedCasts.forEach((cast, index) => {
    const chargeIndex = index % charges
    castsByCharge[chargeIndex].push(cast)
  })

  return castsByCharge
}

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
