import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SpellNames from '@/components/TimelinePlanner/TimelineView/SpellNames'
import { useTimelineContext } from '@/components/TimelinePlanner/TimelineProvider/useTimelineContext'
import { TimelineToRender } from '@/types/index'

jest.mock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
  useTimelineContext: jest.fn(),
}))

jest.mock('@/components/TimelinePlanner/CustomSpell/CustomSpellIcon', () => ({
  __esModule: true,
  default: ({ spell }: any) => <span data-testid={`custom-icon-${spell.spellId}`}>CustomIcon</span>,
}))

const mockUseTimelineContext = useTimelineContext as jest.Mock

describe('SpellNames', () => {
  const wowheadNameMap = {
    1: <span data-testid="wowhead-1">Wowhead One</span>,
    2: <span data-testid="wowhead-2">Wowhead Two</span>,
    3: <span data-testid="wowhead-3">Wowhead Three</span>,
    99: <span data-testid="wowhead-99">Wowhead NNine</span>,
  }

  function makeSpell({ spellId, name, charges = 1, isCustom = false, chargesUsed = 1 }) {
    const baseSpell = {
      spellId,
      name,
      charges,
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 0,
      ...(isCustom ? { isCustom: true } : {}),
    }
    return {
      spell: baseSpell,
      casts: [],
      chargesUsed,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders spells sorted by ascending spellId', () => {
    mockUseTimelineContext.mockReturnValue({
      processedState: {
        spells: [
          makeSpell({ spellId: 2, name: 'B' }),
          makeSpell({ spellId: 1, name: 'A' }),
          makeSpell({ spellId: 3, name: 'C' }),
        ],
      },
    })
    render(<SpellNames wowheadNameMap={wowheadNameMap} />)
    const spellNames = screen.getAllByText(/Wowhead|A|B|C/)
    expect(spellNames[0]).toHaveTextContent('Wowhead One')
    expect(spellNames[1]).toHaveTextContent('Wowhead Two')
    expect(spellNames[2]).toHaveTextContent('Wowhead Three')
  })

  it('shows CustomSpellIcon for custom spells', () => {
    mockUseTimelineContext.mockReturnValue({
      processedState: {
        spells: [makeSpell({ spellId: 99, name: 'Custom Spell', isCustom: true })],
      },
    })
    render(<SpellNames wowheadNameMap={wowheadNameMap} />)
    expect(screen.getByTestId('custom-icon-99')).toBeInTheDocument()
  })

  it('renders Charges # label and placeholder rows for multi-charge spells', () => {
    mockUseTimelineContext.mockReturnValue({
      processedState: {
        spells: [makeSpell({ spellId: 5, name: 'Multi', charges: 3, chargesUsed: 2 })],
        timeline_length_s: 0,
      } as TimelineToRender,
    })
    render(<SpellNames wowheadNameMap={wowheadNameMap} />)
    expect(screen.getByText('Charges #')).toBeInTheDocument()
  })
})
