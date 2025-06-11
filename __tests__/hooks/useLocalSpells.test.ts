import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocalSpells } from 'hooks/useLocalSpells'
import type { SpellInfo } from '@/types/timeline'
import { loadCustomSpells, removeCustomSpell } from '@/lib/utils/customSpellStorage'

jest.mock('@/lib/utils/customSpellStorage', () => ({
  loadCustomSpells: jest.fn(),
  removeCustomSpell: jest.fn(),
}))

const mockedLoad = loadCustomSpells as jest.Mock
const mockedRemove = removeCustomSpell as jest.Mock
const mockedSpell: SpellInfo = {
  spellId: 999,
  name: 'Custom',
  channel_duration: 0,
  effect_duration: 0,
  cooldown: 10,
  charges: 1,
}
mockedLoad.mockReturnValue([mockedSpell])

const baseSpells: SpellInfo[] = [
  { spellId: 1, cooldown: 5, name: 'Base', channel_duration: 0, effect_duration: 0, charges: 1 },
]

describe('useLocalSpells', () => {
  it('merges base and custom spells on mount', async () => {
    const { result } = renderHook(() => useLocalSpells(baseSpells))

    expect(result.current.localSpells).toHaveLength(2)
    expect(result.current.localSpells).toContain(baseSpells[0])
    expect(result.current.localSpells).toContain(mockedSpell)
  })

  it('createCustomSpell adds a spell', () => {
    const { result } = renderHook(() => useLocalSpells(baseSpells))

    const newSpell = { spellId: 2, label: 'New', cooldown: 7 } as unknown as SpellInfo

    act(() => {
      result.current.createCustomSpell(newSpell)
    })

    expect(result.current.localSpells.find((s) => s.spellId === 2)).toBeDefined()
  })

  it('deleteCustomSpell removes a spell and calls storage util', () => {
    const { removeCustomSpell } = jest.requireMock('@/lib/utils/customSpellStorage') as {
      removeCustomSpell: jest.Mock
    }
    const { result } = renderHook(() => useLocalSpells(baseSpells))

    act(() => {
      result.current.deleteCustomSpell(999)
    })

    expect(removeCustomSpell).toHaveBeenCalledWith(999)
    expect(result.current.localSpells.find((s) => s.spellId === 999)).toBeUndefined()
  })

  it('getSpellsForSpec filters correctly', () => {
    const specSpells: SpellInfo[] = [
      { spellId: 3, label: 'BalanceOnly', cooldown: 5, specs: ['balance'] } as unknown as SpellInfo,
    ]
    const { result } = renderHook(() => useLocalSpells([...baseSpells, ...specSpells]))

    const filtered = result.current.getSpellsForSpec('balance')
    expect(filtered.some((s) => s.spellId === 3)).toBe(true)
    expect(filtered.some((s) => s.spellId === 1)).toBe(false)
  })
})
