import { useState, useEffect, useCallback } from 'react'
import { SpellInfo } from '@/types/timeline'
import { loadCustomSpells, removeCustomSpell } from '@/lib/utils/customSpellStorage'

export function useLocalSpells(baseSpells: SpellInfo[]) {
  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(baseSpells)

  // Load custom spells and merge with base spells
  useEffect(() => {
    const customSpells = loadCustomSpells()
    setLocalSpells([...baseSpells, ...customSpells])
  }, [])

  const createCustomSpell = (params: SpellInfo) => {
    setLocalSpells((prev) => [...prev, params])
  }

  const deleteCustomSpell = useCallback((spellId: number) => {
    removeCustomSpell(spellId)
    setLocalSpells((prev) => prev.filter((spell) => spell.spellId !== spellId))
  }, [])

  // Get spells for a specific spec
  const getSpellsForSpec = useCallback(
    (spec: string) => {
      if (spec === 'all') return localSpells
      return localSpells.filter(
        (spell) => spell.specs && (spell.specs.includes(spec) || spell.specs.includes('all'))
      )
    },
    [localSpells]
  )

  return {
    localSpells,
    setLocalSpells,
    createCustomSpell,
    deleteCustomSpell,
    getSpellsForSpec,
  }
}
