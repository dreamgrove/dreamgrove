import { useState, useEffect, useCallback } from 'react'
import { Talents } from '@/types/timeline'
import { GlobalAction } from '@/types/events'
import {
  earlySpring,
  controlOfTheDream,
  whirlingStars,
  potentEnchantments,
  incarnation,
  dreamstate,
  tearDownTheMighty,
  ashamanesGuidance,
  heartOfTheLion,
  cenariusGuidance,
  bindings,
} from '@/lib/talent_handlers'

export function useKeysToActions(activeBindings: string[]) {
  const [keysToActions, setKeysToActions] = useState<Map<string, Set<GlobalAction>>>(new Map())

  // Bind a global action to keys
  const bindGlobalAction = useCallback((keys: string[], action: GlobalAction) => {
    setKeysToActions((prev) => {
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

  // Update keysToActions when activeBindings changes
  useEffect(() => {
    setKeysToActions(new Map())
    activeBindings.forEach((bindingId) => {
      if (bindingId === Talents.EarlySpring) {
        bindGlobalAction(['205636', '102693'], earlySpring)
      }
      if (bindingId === Talents.ControlOfTheDream) {
        bindGlobalAction(['194223', '391528', '205636', '33891'], controlOfTheDream)
      }
      if (bindingId === Talents.Incarnation) {
        bindGlobalAction(['194223'], incarnation)
      }
      if (bindingId === Talents.WhirlingStars) {
        bindGlobalAction(['194223'], whirlingStars)
      }
      if (bindingId === Talents.PotentEnchantments) {
        bindGlobalAction(['194223'], potentEnchantments)
      }
      if (bindingId === Talents.Dreamstate) {
        bindGlobalAction(['740'], dreamstate)
      }
      if (bindingId === Talents.TearDownTheMighty) {
        bindGlobalAction(['274837'], tearDownTheMighty)
      }
      if (bindingId === Talents.AshamanesGuidance) {
        bindGlobalAction(['391528'], ashamanesGuidance)
      }
      if (bindingId === Talents.HeartOfTheLion) {
        bindGlobalAction(['106951'], heartOfTheLion)
      }
      if (bindingId === Talents.CenariusGuidance) {
        bindGlobalAction(['391528', '33891'], cenariusGuidance)
      }
    })
  }, [activeBindings, bindGlobalAction])

  return {
    keysToActions,
    setKeysToActions,
    bindGlobalAction,
  }
}
