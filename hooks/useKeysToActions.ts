import { useState, useEffect, useCallback } from 'react'
import { GlobalAction } from '@/types/events'
import { bindings } from '@/lib/talent_handlers'

export function useKeysToTalents(activeTalents: string[]) {
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

  return {
    keysToTalents,
    setKeysToTalents,
    bindGlobalAction,
  }
}
