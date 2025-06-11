import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TimelineScrollContainer from '@/components/TimelinePlanner/TimelineView/TimelineScrollContainer'
import { useTimelineContext } from '@/components/TimelinePlanner/TimelineProvider/useTimelineContext'

// Mock context hook
jest.mock('@/components/TimelinePlanner/TimelineProvider/useTimelineContext', () => ({
  useTimelineContext: jest.fn(),
}))

// Mock child components that TimelineScrollContainer relies on
jest.mock('@/components/TimelinePlanner/Markers/Markers', () => ({
  __esModule: true,
  default: () => <div data-testid="markers" />,
}))

jest.mock('@/components/TimelinePlanner/Markers/EventMarkers', () => ({
  __esModule: true,
  default: () => <div data-testid="event-markers" />,
}))

// We want to inspect the props passed to <SpellMarkers />
let mockSpellMarkers: jest.Mock

jest.mock('@/components/TimelinePlanner/Markers/SpellMarkers', () => {
  const mockFn = jest.fn(() => <div data-testid="spell-markers" />)
  return {
    __esModule: true,
    default: mockFn,
  }
})

// Import the mocked component to access the jest.fn for assertions
import SpellMarkersMock from '@/components/TimelinePlanner/Markers/SpellMarkers'
import { SpellToRender, TimelineToRender } from '@/types/index'
import SpellRow from '@/components/TimelinePlanner/TimelineView/SpellRow/SpellRow'

jest.mock('@/components/TimelinePlanner/TimelineView/SpellRow/SpellRow', () => ({
  __esModule: true,
  default: jest.fn(({ spellTimeline }: any) => (
    <div data-testid={`spell-row-${spellTimeline.spell.spellId}`} />
  )),
}))

const mockUseTimelineContext = useTimelineContext as jest.Mock

// Helper to build a minimal spellTimeline entry expected by the component
function makeSpellTimeline({ spellId, name = `Spell-${spellId}` }): SpellToRender {
  const spell: SpellToRender = {
    spell: {
      spellId,
      name,
      charges: 1,
      channel_duration: 0,
      effect_duration: 0,
      cooldown: 0,
    },
    casts: [],
    chargesUsed: 1,
  }
  return spell
}

describe('TimelineScrollContainer', () => {
  const wowheadMarkerMap = {}
  const averageTimestamps = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows placeholder when there are no spells', () => {
    mockUseTimelineContext.mockReturnValue({
      processedState: { spells: [], timeline_length_s: 0 } as TimelineToRender,
    })

    render(
      <TimelineScrollContainer
        averageTimestamps={averageTimestamps}
        wowheadMarkerMap={wowheadMarkerMap}
      />
    )

    expect(screen.getByText('Add a spell to get started')).toBeInTheDocument()
    expect(screen.queryByTestId('markers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('spell-markers')).not.toBeInTheDocument()
    expect(screen.queryByTestId('event-markers')).not.toBeInTheDocument()
  })

  it('renders markers and one SpellRow per spell when spells exist', () => {
    const spells: SpellToRender[] = [
      makeSpellTimeline({ spellId: 1 }),
      makeSpellTimeline({ spellId: 2 }),
    ]

    const averageTimestampsWithData = { 1: [5], 2: [10] }

    const processedState: TimelineToRender = { spells, timeline_length_s: 0 }

    mockUseTimelineContext.mockReturnValue({
      processedState,
    })

    render(
      <TimelineScrollContainer
        averageTimestamps={averageTimestampsWithData}
        wowheadMarkerMap={wowheadMarkerMap}
      />
    )

    // Placeholder should be gone
    expect(screen.queryByText('Add a spell to get started')).not.toBeInTheDocument()

    // Markers rendered
    expect(screen.getByTestId('markers')).toBeInTheDocument()
    expect(screen.getByTestId('spell-markers')).toBeInTheDocument()
    expect(screen.getByTestId('event-markers')).toBeInTheDocument()

    // SpellRow count matches spells length
    expect(screen.getByTestId('spell-row-1')).toBeInTheDocument()
    expect(screen.getByTestId('spell-row-2')).toBeInTheDocument()

    // SpellMarkers received correct props
    expect(SpellMarkersMock).toHaveBeenCalledWith(
      expect.objectContaining({ spellInfo: averageTimestampsWithData }),
      undefined
    )
  })

  it('passes the correct spellRow props to SpellRow', () => {
    const spells: SpellToRender[] = [
      makeSpellTimeline({ spellId: 1 }),
      makeSpellTimeline({ spellId: 2 }),
    ]
    const averageTimestampsWithData = { 1: [5], 2: [10] }
    const processedState: TimelineToRender = { spells, timeline_length_s: 0 }
    mockUseTimelineContext.mockReturnValue({ processedState })

    render(
      <TimelineScrollContainer
        averageTimestamps={averageTimestampsWithData}
        wowheadMarkerMap={wowheadMarkerMap}
      />
    )

    expect(screen.getByTestId('spell-row-1')).toBeInTheDocument()
    expect(screen.getByTestId('spell-row-2')).toBeInTheDocument()

    expect(SpellRow).toHaveBeenCalledWith(
      expect.objectContaining({ spellTimeline: spells[0] }),
      undefined
    )
    expect(SpellRow).toHaveBeenCalledWith(
      expect.objectContaining({ spellTimeline: spells[1] }),
      undefined
    )
  })
})
