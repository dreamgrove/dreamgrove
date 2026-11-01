import { useState, useCallback, useMemo } from 'react'
import { bindings as allBindings } from '@/lib/talent_handlers/bindings'
import type { DruidSpec, PlayerAction } from '@/types/timeline'

function getDefaultTalents(spec: DruidSpec): string[] {
  if (spec === 'all') return []
  return allBindings.filter((b) => b.onByDefault && b.specs.includes(spec)).map((b) => b.id)
}

export interface Plan {
  spec: DruidSpec
  talents: string[]
  events: PlayerAction[]
}

/** The selected spec and its talents, kept in one state so they always change together. */
export function useActiveBindings(setInputActions: (actions: PlayerAction[]) => void) {
  const [{ spec: currentSpec, talents: activeTalents }, setSpecAndTalents] = useState(() => ({
    spec: 'balance' as DruidSpec,
    talents: getDefaultTalents('balance'),
  }))

  // Switching spec starts over: that spec's default talents and an empty timeline.
  const setCurrentSpec = useCallback(
    (spec: DruidSpec) => {
      if (spec === currentSpec) return
      setSpecAndTalents({ spec, talents: getDefaultTalents(spec) })
      setInputActions([])
    },
    [currentSpec, setInputActions]
  )

  /** Replaces spec, talents and casts in one update (loadouts, imports, shared links). */
  const loadPlan = useCallback(
    ({ spec, talents, events }: Plan) => {
      setSpecAndTalents({ spec, talents })
      setInputActions(events)
    },
    [setInputActions]
  )

  const setActiveTalents = useCallback((updater: string[] | ((prev: string[]) => string[])) => {
    setSpecAndTalents((prev) => ({
      ...prev,
      talents: typeof updater === 'function' ? updater(prev.talents) : updater,
    }))
  }, [])

  const toggleTalent = useCallback(
    (id: string, isSelected: boolean) => {
      setActiveTalents((prev) => {
        if (isSelected) {
          const exclusiveWith: string[] = allBindings.find((b) => b.id === id)?.exclusiveWith ?? []
          return [...prev.filter((bindingId) => !exclusiveWith.includes(bindingId)), id]
        } else {
          return prev.filter((bindingId) => bindingId !== id)
        }
      })
    },
    [setActiveTalents]
  )

  const availableTalents = useMemo(() => {
    if (currentSpec === 'all') return allBindings
    return allBindings.filter((binding) => binding.specs && binding.specs.includes(currentSpec))
  }, [currentSpec])

  return {
    currentSpec,
    setCurrentSpec,
    loadPlan,
    activeTalents,
    setActiveTalents,
    toggleTalent,
    availableTalents,
  }
}
