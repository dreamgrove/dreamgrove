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
  const {
    setInputEvents,
    currentSpec,
    setCurrentSpec,
    setActiveTalents,
    localSpells,
    createCustomSpell,
  } = useTimelineContext()

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
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        })
      }

      const hasNewCustomSpells = decoded.customSpells.some(
        (cs) => !localSpells.some((s) => s.spellId === cs.spellId)
      )
      for (const cs of decoded.customSpells) {
        if (!localSpells.some((s) => s.spellId === cs.spellId)) {
          createCustomSpell(cs)
        }
      }

      const applyLoadout = () => {
        setInputEvents(events)
        setActiveTalents(decoded.activeTalents)
      }

      if (decoded.spec !== currentSpec) {
        setCurrentSpec(decoded.spec)
      }

      if (decoded.spec !== currentSpec || hasNewCustomSpells) {
        setTimeout(applyLoadout, 0)
      } else {
        applyLoadout()
      }
    },
    [localSpells, currentSpec, setInputEvents, setActiveTalents, setCurrentSpec, createCustomSpell]
  )
}
