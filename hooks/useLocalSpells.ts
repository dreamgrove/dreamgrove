import { useState, useCallback, useMemo } from 'react'
import { SpellInfo } from '@/types/timeline'
import { usePersistedState, type StorageCodec } from '@/hooks/usePersistedState'
import {
  CUSTOM_SPELLS_KEY,
  removeCustomSpell,
  toCustomSpells,
  type CustomSpell,
} from '@/lib/utils/customSpellStorage'

const NO_CUSTOM_SPELLS: CustomSpell[] = []
const customSpellsCodec: StorageCodec<CustomSpell[]> = {
  parse: (raw) => toCustomSpells(JSON.parse(raw)),
  serialize: JSON.stringify,
}

/**
 * The planner's spells: the built-in ones, the user's saved custom spells (kept
 * in sync with localStorage) and custom spells that only came with an imported
 * loadout, which last for the session.
 */
export function useLocalSpells(baseSpells: SpellInfo[]) {
  const [savedSpells] = usePersistedState(CUSTOM_SPELLS_KEY, NO_CUSTOM_SPELLS, customSpellsCodec)
  const [sessionSpells, setSessionSpells] = useState<SpellInfo[]>([])

  const localSpells = useMemo(() => {
    const spells = [...baseSpells, ...savedSpells]
    for (const spell of sessionSpells) {
      if (!spells.some((s) => s.spellId === spell.spellId)) spells.push(spell)
    }
    return spells
  }, [baseSpells, savedSpells, sessionSpells])

  const createCustomSpell = useCallback((params: SpellInfo) => {
    setSessionSpells((prev) => [...prev, params])
  }, [])

  const deleteCustomSpell = useCallback((spellId: number) => {
    removeCustomSpell(spellId)
    setSessionSpells((prev) => prev.filter((spell) => spell.spellId !== spellId))
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
    createCustomSpell,
    deleteCustomSpell,
    getSpellsForSpec,
  }
}
