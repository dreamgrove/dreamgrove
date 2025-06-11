import { useState, useEffect, useCallback, useMemo } from 'react'
import { bindings as allBindings, bindings } from '@/lib/talent_handlers/bindings'
import { GlobalAction } from '@/types/events'

export function useActiveBindings(setInputActions: (actions: any[]) => void, currentSpec: string) {
  const [activeTalents, setActiveTalents] = useState<string[]>([])
  const [keysToTalents, setKeysToTalents] = useState<Map<string, Set<GlobalAction>>>(new Map())

  // Bind a talent handler to a specific key
  const bindGlobalAction = useCallback((keys: string[], action: GlobalAction) => {
    setKeysToTalents((prev) => {
      const newMap = new Map(prev)
      for (const key of keys) {
        if (!newMap.has(key)) {
          newMap.set(key, new Set())
        }
        newMap.get(key)!.add(action)
      }
      return newMap
    })
  }, [])

  // Update keysToActions when activeTalents changes
  useEffect(() => {
    setKeysToTalents(new Map())
    bindings.forEach((binding) => {
      if (activeTalents.includes(binding.id)) {
        bindGlobalAction(binding.affectedSpells.map(String), binding.handler)
      }
    })
  }, [activeTalents, bindGlobalAction])

  const toggleTalent = useCallback((id: string, isSelected: boolean) => {
    setActiveTalents((prev) => {
      if (isSelected) {
        return [...prev, id]
      } else {
        return prev.filter((bindingId) => bindingId !== id)
      }
    })
  }, [])

  // Reset talents and inputActions on spec change
  useEffect(() => {
    setActiveTalents([])
    setInputActions([])
    if (currentSpec !== 'all') {
      setActiveTalents((prev) =>
        prev.filter((bindingId) => {
          const binding = allBindings.find((b) => b.id === bindingId)
          return binding && binding.specs && binding.specs.includes(currentSpec)
        })
      )
    }
  }, [currentSpec, setInputActions])

  const availableTalents = useMemo(() => {
    if (currentSpec === 'all') return allBindings
    return allBindings.filter((binding) => binding.specs && binding.specs.includes(currentSpec))
  }, [currentSpec])

  return {
    activeTalents,
    setActiveTalents,
    toggleTalent,
    availableTalents,
    keysToTalents,
  }
}
