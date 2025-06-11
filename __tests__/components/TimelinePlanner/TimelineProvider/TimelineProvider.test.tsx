import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  TimelineProvider,
  TimelineContext,
} from '@/components/TimelinePlanner/TimelineProvider/TimelineProvider'

// Mock hooks used by TimelineProvider
jest.mock('hooks/useTimelineActions', () => ({
  useTimelineEvents: jest.fn(() => ({
    inputEvents: [],
    setInputEvents: jest.fn(),
    handleCastDelete: jest.fn(),
    handleCastMove: jest.fn(),
  })),
}))

jest.mock('hooks/useLocalSpells', () => ({
  useLocalSpells: jest.fn(() => ({
    localSpells: [],
    createCustomSpell: jest.fn(),
    deleteCustomSpell: jest.fn(),
    getSpellsForSpec: jest.fn((spec) => [{ name: `Test Spell for ${spec}`, spellId: 12345 }]),
  })),
}))

jest.mock('hooks/useActiveBindings', () => ({
  useActiveBindings: jest.fn(() => ({
    activeTalents: [],
    toggleTalent: jest.fn(),
    availableTalents: [],
  })),
}))

jest.mock('hooks/useProcessedTimeline', () => ({
  useProcessedTimeline: jest.fn(() => ({
    processedState: { spells: [] },
    processedEvents: [],
  })),
}))

// Test component to consume context
const TestConsumer = () => {
  const context = React.useContext(TimelineContext)
  if (!context) throw new Error('Context is undefined')

  return (
    <div>
      <div data-testid="current-spec">{context.currentSpec}</div>
      <button data-testid="change-spec-button" onClick={() => context.setCurrentSpec('resto')}>
        Change Spec
      </button>
    </div>
  )
}

describe('TimelineProvider', () => {
  it('provides expected context with default values', () => {
    render(
      <TimelineProvider spells={[]}>
        <TestConsumer />
      </TimelineProvider>
    )

    expect(screen.getByTestId('current-spec')).toHaveTextContent('balance')
  })

  it('updates context when setCurrentSpec is called', () => {
    render(
      <TimelineProvider spells={[]}>
        <TestConsumer />
      </TimelineProvider>
    )

    // Initial value should be 'balance'
    expect(screen.getByTestId('current-spec')).toHaveTextContent('balance')

    // Change spec to 'resto'
    act(() => {
      fireEvent.click(screen.getByTestId('change-spec-button'))
    })

    // Value should now be 'resto'
    expect(screen.getByTestId('current-spec')).toHaveTextContent('resto')
  })

  it('provides all required context keys', () => {
    let contextKeys: string[] = []

    const ContextInspector = () => {
      const context = React.useContext(TimelineContext)
      if (!context) throw new Error('Context is undefined')

      contextKeys = Object.keys(context)
      return null
    }

    render(
      <TimelineProvider spells={[]}>
        <ContextInspector />
      </TimelineProvider>
    )

    // Verify all required context keys are present
    const requiredKeys = [
      'inputEvents',
      'setInputEvents',
      'handleCastDelete',
      'handleCastMove',
      'localSpells',
      'createCustomSpell',
      'deleteCustomSpell',
      'getSpellsForSpec',
      'activeTalents',
      'toggleTalent',
      'availableTalents',
      'keysToTalents',
      'processedState',
      'processedEvents',
      'filteredSpells',
      'currentSpec',
      'setCurrentSpec',
    ]

    requiredKeys.forEach((key) => {
      expect(contextKeys).toContain(key)
    })
  })
})
