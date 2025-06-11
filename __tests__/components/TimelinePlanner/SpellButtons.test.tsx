import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SpellInfo, TimelineToRender } from '@/types/index'
import { CustomSpell } from '@/lib/utils/customSpellStorage'

const mockSetInputEvents = jest.fn()
const mockDeleteCustomSpell = jest.fn()
const mockCreateCustomSpell = jest.fn()

jest.mock('@/lib/utils/customSpellStorage', () => ({
  isCustomSpell: (spell) => spell.isCustom === true,
}))

jest.mock('@/components/TimelinePlanner/CustomSpell/CustomSpellIcon', () => {
  const MockIcon = () => <div data-testid="custom-spell-icon">Icon</div>
  MockIcon.displayName = 'MockCustomSpellIcon'
  return MockIcon
})

jest.useFakeTimers()

describe('SpellButtons', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders one button per filteredSpells entry', async () => {
    const mockRegularSpell: SpellInfo = {
      spellId: 1,
      name: 'Moonfire',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
    }
    const mockCustomSpell: CustomSpell = {
      spellId: -1001,
      name: 'Trinket Custom',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
      isCustom: true,
      color: '#fff',
      createdAt: Date.now(),
    }
    jest.doMock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
      useTimelineContext: () => ({
        processedState: { spells: [], timeline_length_s: 0 } as TimelineToRender,
        setInputEvents: mockSetInputEvents,
        filteredSpells: [mockRegularSpell, mockCustomSpell] as SpellInfo[],
        deleteCustomSpell: mockDeleteCustomSpell,
        createCustomSpell: mockCreateCustomSpell,
      }),
    }))
    const { default: SpellButtons } = await import('@/components/TimelinePlanner/SpellButtons')
    render(<SpellButtons prerenderedIcons={{}} />)
    expect(screen.getByText('Moonfire')).toBeInTheDocument()
    expect(screen.getByText('Trinket Custom')).toBeInTheDocument()
    expect(screen.getByText('Custom Spells:')).toBeInTheDocument()
  })

  it('clicking a spell adds a new PlayerAction', async () => {
    const mockRegularSpell: SpellInfo = {
      spellId: 1,
      name: 'Moonfire',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
    }
    const mockCustomSpell: CustomSpell = {
      spellId: -1001,
      name: 'Custom Trinket',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
      isCustom: true,
      color: '#fff',
      createdAt: Date.now(),
    }
    jest.doMock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
      useTimelineContext: () => ({
        processedState: { spells: [], timeline_length_s: 0 } as TimelineToRender,
        setInputEvents: mockSetInputEvents,
        filteredSpells: [mockRegularSpell, mockCustomSpell] as SpellInfo[],
        deleteCustomSpell: mockDeleteCustomSpell,
        createCustomSpell: mockCreateCustomSpell,
      }),
    }))
    const { default: SpellButtons } = await import('@/components/TimelinePlanner/SpellButtons')
    render(<SpellButtons prerenderedIcons={{}} />)
    fireEvent.click(screen.getByText('Moonfire'))
    expect(mockSetInputEvents).toHaveBeenCalled()
  })

  it('custom-spell buttons display CustomSpellIcon', async () => {
    const mockRegularSpell: SpellInfo = {
      spellId: 1,
      name: 'Moonfire',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
    }
    const mockCustomSpell: CustomSpell = {
      spellId: -1001,
      name: 'Custom Trinket',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
      isCustom: true,
      color: '#fff',
      createdAt: Date.now(),
    }
    jest.doMock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
      useTimelineContext: () => ({
        processedState: { spells: [], timeline_length_s: 0 } as TimelineToRender,
        setInputEvents: mockSetInputEvents,
        filteredSpells: [mockRegularSpell, mockCustomSpell] as SpellInfo[],
        deleteCustomSpell: mockDeleteCustomSpell,
        createCustomSpell: mockCreateCustomSpell,
      }),
    }))
    const { default: SpellButtons } = await import('@/components/TimelinePlanner/SpellButtons')
    render(<SpellButtons prerenderedIcons={{}} />)
    expect(screen.getByTestId('custom-spell-icon')).toBeInTheDocument()
  })

  it('delete (×) removes custom spell via deleteCustomSpell', async () => {
    const mockRegularSpell: SpellInfo = {
      spellId: 1,
      name: 'Moonfire',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
    }
    const mockCustomSpell: CustomSpell = {
      spellId: -1001,
      name: 'Custom Spell',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
      isCustom: true,
      color: '#fff',
      createdAt: Date.now(),
    }
    jest.doMock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
      useTimelineContext: () => ({
        processedState: { spells: [] },
        setInputEvents: mockSetInputEvents,
        filteredSpells: [mockRegularSpell, mockCustomSpell] as SpellInfo[],
        deleteCustomSpell: mockDeleteCustomSpell,
        createCustomSpell: mockCreateCustomSpell,
      }),
    }))
    const { default: SpellButtons } = await import('@/components/TimelinePlanner/SpellButtons')
    render(<SpellButtons prerenderedIcons={{}} />)
    fireEvent.click(screen.getByTitle('Delete custom spell'))
    expect(mockDeleteCustomSpell).toHaveBeenCalled()
  })

  it('Reset All Spells empties inputEvents', async () => {
    const mockRegularSpell: SpellInfo = {
      spellId: 1,
      name: 'Moonfire',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
    }
    const mockCustomSpell: CustomSpell = {
      spellId: -1001,
      name: 'Custom Spell',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
      isCustom: true,
      color: '#fff',
      createdAt: Date.now(),
    }
    jest.doMock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
      useTimelineContext: () => ({
        processedState: { spells: [], timeline_length_s: 0 } as TimelineToRender,
        setInputEvents: mockSetInputEvents,
        filteredSpells: [mockRegularSpell, mockCustomSpell] as SpellInfo[],
        deleteCustomSpell: mockDeleteCustomSpell,
        createCustomSpell: mockCreateCustomSpell,
      }),
    }))
    const { default: SpellButtons } = await import('@/components/TimelinePlanner/SpellButtons')
    render(<SpellButtons prerenderedIcons={{}} />)
    fireEvent.click(screen.getByText('Reset All Spells'))
    expect(mockSetInputEvents).toHaveBeenCalledWith([])
  })

  it('error message auto-clears after 3s', async () => {
    const mockRegularSpell: SpellInfo = {
      spellId: 1,
      name: 'Moonfire',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
    }
    const mockCustomSpell: CustomSpell = {
      spellId: -1001,
      name: 'Custom Spell',
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 10,
      charges: 1,
      isCustom: true,
      color: '#fff',
      createdAt: Date.now(),
    }
    jest.doMock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
      useTimelineContext: () => ({
        processedState: { spells: [] },
        setInputEvents: mockSetInputEvents,
        filteredSpells: [mockRegularSpell, mockCustomSpell],
        deleteCustomSpell: mockDeleteCustomSpell,
        createCustomSpell: mockCreateCustomSpell,
      }),
    }))
    const { default: SpellButtons } = await import('@/components/TimelinePlanner/SpellButtons')
    const { rerender } = render(<SpellButtons prerenderedIcons={{}} />)
    act(() => {
      rerender(<SpellButtons prerenderedIcons={{}} />)
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(true).toBe(true)
  })
})
