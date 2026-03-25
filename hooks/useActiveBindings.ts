import { useState, useCallback, useMemo } from 'react'
import { bindings as allBindings } from '@/lib/talent_handlers/bindings'

function getDefaultTalents(spec: string): string[] {
  if (spec === 'all') return []
  return allBindings.filter((b) => b.onByDefault && b.specs.includes(spec)).map((b) => b.id)
}

export function useActiveBindings(setInputActions: (actions: any[]) => void, currentSpec: string) {
  const [specAndTalents, setSpecAndTalents] = useState(() => ({
    spec: currentSpec,
    talents: getDefaultTalents(currentSpec),
  }))

  // Reset talents and inputActions on spec change
  if (specAndTalents.spec !== currentSpec) {
    setInputActions([])
    setSpecAndTalents({ spec: currentSpec, talents: getDefaultTalents(currentSpec) })
  }

  const activeTalents = specAndTalents.talents
  const setActiveTalents = useCallback((updater: string[] | ((prev: string[]) => string[])) => {
    setSpecAndTalents((prev) => ({
      ...prev,
      talents: typeof updater === 'function' ? updater(prev.talents) : updater,
    }))
  }, [])

  const toggleTalent = useCallback((id: string, isSelected: boolean) => {
    setActiveTalents((prev) => {
      if (isSelected) {
        return [...prev, id]
      } else {
        return prev.filter((bindingId) => bindingId !== id)
      }
    })
  }, [])

  const availableTalents = useMemo(() => {
    if (currentSpec === 'all') return allBindings
    return allBindings.filter((binding) => binding.specs && binding.specs.includes(currentSpec))
  }, [currentSpec])

  return {
    activeTalents,
    setActiveTalents,
    toggleTalent,
    availableTalents,
  }
}
