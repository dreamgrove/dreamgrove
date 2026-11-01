import { useCallback } from 'react'
import { useTimelineContext } from '@/components/TimelinePlanner/TimelineProvider/useTimelineContext'
import { decodeLoadout } from '@/lib/utils/loadoutCode'
import { PlayerAction } from '@/types/timeline'

/**
 * Returns a function that decodes a loadout code and applies it to the planner
 * (spec, talents, casts, custom spells). Throws on an invalid code.
 * Shared by LoadoutManager's import input and the #loadout= URL import.
 */
export function useApplyLoadout() {
  const { loadPlan, localSpells, createCustomSpell } = useTimelineContext()

  return useCallback(
    (code: string) => {
      const decoded = decodeLoadout(code)

      const allSpells = [...localSpells, ...decoded.customSpells]
      const spellMap = new Map(allSpells.map((s) => [s.spellId, s]))

      const events: PlayerAction[] = []
      for (const e of decoded.events) {
        const spell = spellMap.get(e.spellId)
        if (!spell) continue
        events.push({
          spell,
          instant: e.instant,
          id: crypto.randomUUID(),
        })
      }

      for (const cs of decoded.customSpells) {
        if (!localSpells.some((s) => s.spellId === cs.spellId)) {
          createCustomSpell(cs)
        }
      }

      // Same event as createCustomSpell, so React applies both in one render
      loadPlan({ spec: decoded.spec, talents: decoded.activeTalents, events })
    },
    [localSpells, loadPlan, createCustomSpell]
  )
}
