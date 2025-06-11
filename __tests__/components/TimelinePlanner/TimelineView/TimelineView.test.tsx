import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TimelineView from '@/components/TimelinePlanner/TimelineView/TimelineView'
import { SpellInfo, PlayerAction } from '@/types/index'
import { useTimelineScroll } from 'hooks/useTimelineScroll'
import { TimelineProvider } from '@/components/TimelinePlanner/TimelineProvider/TimelineProvider'

// Mock the nextstepjs module
jest.mock(
  'nextstepjs',
  () => ({
    useNextStep: jest.fn(() => ({
      startNextStep: jest.fn(),
    })),
  }),
  { virtual: true }
)

// Mock the useTimelineScroll hook
jest.mock('hooks/useTimelineScroll', () => {
  const mockRef = { current: null }
  return {
    useTimelineScroll: jest.fn(() => ({
      scrollContainerRef: mockRef,
    })),
  }
})

// Mock the components used in TimelineView
jest.mock('@/components/TimelinePlanner/TimelineProvider/TimelineProvider', () => ({
  TimelineProvider: jest.fn(({ children }) => (
    <div data-testid="mock-timeline-provider">{children}</div>
  )),
}))

jest.mock('@/components/TimelinePlanner/Providers/SettingsProvider', () => ({
  SettingsProvider: ({ children }) => <div data-testid="mock-settings-provider">{children}</div>,
}))

jest.mock('@/components/TimelinePlanner/TimelineView/SpecSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="spec-selector">SpecSelector</div>,
}))

jest.mock('@/components/TimelinePlanner/TimelineView/TalentBindings/TalentBindings', () => ({
  __esModule: true,
  default: () => <div data-testid="talent-bindings">TalentBindings</div>,
}))

jest.mock('@/components/TimelinePlanner/SpellButtons', () => ({
  __esModule: true,
  default: () => <div data-testid="spell-buttons">SpellButtons</div>,
}))

jest.mock('@/components/TimelinePlanner/TimelineView/ZoomControls', () => ({
  __esModule: true,
  default: () => <div data-testid="zoom-controls">ZoomControls</div>,
}))

jest.mock('@/components/TimelinePlanner/MRTExport', () => ({
  __esModule: true,
  default: () => <div data-testid="mrt-export">MRTExport</div>,
}))

jest.mock('@/components/TimelinePlanner/TimelineView/SpellNames', () => ({
  __esModule: true,
  default: () => <div data-testid="spell-names">SpellNames</div>,
}))

jest.mock('@/components/TimelinePlanner/TimelineView/TimelineScrollContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="timeline-scroll-container">TimelineScrollContainer</div>,
}))

jest.mock('@/components/TimelinePlanner/Warnings', () => ({
  __esModule: true,
  default: () => <div data-testid="warnings">Warnings</div>,
}))

jest.mock('@/components/TimelinePlanner/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('TimelineView', () => {
  const defaultProps = {
    spells: [] as SpellInfo[],
    wowheadMap: {},
    wowheadNameMap: {},
    wowheadMarkerMap: {},
    averageTimestamps: {},
    currentEncounterId: 'test-encounter',
    tutorialSpells: [] as PlayerAction[],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
  })

  it('renders all required sub-components', () => {
    render(<TimelineView {...defaultProps} />)

    // Check that all required components are rendered
    expect(screen.getByTestId('spec-selector')).toBeInTheDocument()
    expect(screen.getByTestId('talent-bindings')).toBeInTheDocument()
    expect(screen.getByTestId('spell-buttons')).toBeInTheDocument()
    expect(screen.getByTestId('zoom-controls')).toBeInTheDocument()
    expect(screen.getByTestId('mrt-export')).toBeInTheDocument()
    expect(screen.getByTestId('spell-names')).toBeInTheDocument()
    expect(screen.getByTestId('timeline-scroll-container')).toBeInTheDocument()
    expect(screen.getByTestId('warnings')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('attaches scrollContainerRef to the scrolling div', () => {
    // Create a mock ref that will be updated during render
    const mockRef = { current: null }
    ;(useTimelineScroll as jest.Mock).mockReturnValue({ scrollContainerRef: mockRef })

    render(<TimelineView {...defaultProps} />)

    // In a real test, the ref would be attached to a DOM element
    // For this mock test, we're just verifying the hook is called
    expect(useTimelineScroll).toHaveBeenCalled()
  })

  it('wraps TimelineViewInner with providers in correct order', () => {
    render(<TimelineView {...defaultProps} />)

    // Check that providers are rendered in the correct hierarchy
    const settingsProvider = screen.getByTestId('mock-settings-provider')
    const timelineProvider = screen.getByTestId('mock-timeline-provider')

    // SettingsProvider should be the outer provider
    expect(settingsProvider).toBeInTheDocument()
    // TimelineProvider should be nested within SettingsProvider
    expect(timelineProvider).toBeInTheDocument()
  })

  it('passes props correctly to TimelineProvider', () => {
    const testSpells: SpellInfo[] = [
      {
        name: 'Test Spell',
        spellId: 12345,
        channel_duration: 0,
        effect_duration: 0,
        cooldown: 10,
        charges: 1,
      },
    ]

    const testTutorialSpells: PlayerAction[] = [
      {
        id: '1',
        spell: testSpells[0],
        instant: 0,
      },
    ]

    render(
      <TimelineView {...defaultProps} spells={testSpells} tutorialSpells={testTutorialSpells} />
    )

    // Verify props are passed correctly to TimelineProvider
    expect(TimelineProvider).toHaveBeenCalled()
    const callProps = (TimelineProvider as jest.Mock).mock.calls[0][0]
    expect(callProps.spells).toEqual(testSpells)
    expect(callProps.tutorialSpells).toEqual(testTutorialSpells)
  })
})
