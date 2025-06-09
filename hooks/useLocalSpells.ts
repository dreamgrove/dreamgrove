import { useState, useEffect, useCallback } from 'react'
import { SpellInfo } from '@/types/timeline'
import { loadCustomSpells } from '@/lib/utils/customSpellStorage'

export function useLocalSpells(baseSpells: SpellInfo[]) {
  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(baseSpells)

  // Load custom spells and merge with base spells
  useEffect(() => {
    const customSpells = loadCustomSpells()
    setLocalSpells([...baseSpells, ...customSpells])
  }, [baseSpells])

  // Add a custom spell
  const handleCreateCustomElement = useCallback((params: SpellInfo) => {
    setLocalSpells((prev) => [...prev, params])
  }, [])

  // Delete a custom spell
  const handleDeleteCustomSpell = useCallback((spellId: number) => {
    setLocalSpells((prev) => prev.filter((spell) => spell.spellId !== spellId))
  }, [])

  // Get spells for a specific spec (like filteredSpells)
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
    handleCreateCustomElement,
    handleDeleteCustomSpell,
    getSpellsForSpec,
  }
}
