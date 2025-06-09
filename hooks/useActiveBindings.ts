import { useState, useEffect, useCallback, useMemo } from 'react'
import { bindings as allBindings } from '@/lib/talent_handlers/bindings'

export function useActiveBindings(setInputActions: (actions: any[]) => void, currentSpec: string) {
  const [activeTalents, setActiveTalents] = useState<string[]>([])

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
  }
}
