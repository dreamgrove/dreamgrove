import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SpecSelector from '@/components/TimelinePlanner/TimelineView/SpecSelector'
import {
  TimelineContext,
  TimelineContextType,
} from '@/components/TimelinePlanner/TimelineProvider/TimelineProvider'
import { DruidSpec } from '@/components/TimelinePlanner/TimelineView/TimelineView'

// Mock the useTimelineContext hook's returned values
const mockSetCurrentSpec = jest.fn()

const createMockContext = (currentSpec: DruidSpec = 'balance'): TimelineContextType => ({
  currentSpec,
  setCurrentSpec: mockSetCurrentSpec,
  // Include other required context values with empty/mock implementations
  inputEvents: [],
  setInputEvents: jest.fn(),
  handleCastDelete: jest.fn(),
  handleCastMove: jest.fn(),
  localSpells: [],
  createCustomSpell: jest.fn(),
  deleteCustomSpell: jest.fn(),
  getSpellsForSpec: jest.fn(() => []),
  activeTalents: [],
  toggleTalent: jest.fn(),
  availableTalents: [],
  keysToTalents: new Map(),
  processedState: { spells: [], timeline_length_s: 0 },
  processedEvents: [],
  filteredSpells: [],
})

describe('SpecSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows label of currentSpec from context', () => {
    // Render with 'balance' as the current spec
    render(
      <TimelineContext.Provider value={createMockContext('balance')}>
        <SpecSelector />
      </TimelineContext.Provider>
    )

    // Check if the Balance label is displayed
    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('toggles dropdown visibility when clicking the main button', () => {
    render(
      <TimelineContext.Provider value={createMockContext()}>
        <SpecSelector />
      </TimelineContext.Provider>
    )

    // Dropdown should be initially closed
    expect(screen.queryByText('All Specs')).not.toBeInTheDocument()

    // Click the dropdown button
    fireEvent.click(screen.getByText('Balance'))

    // Dropdown should now be open with all options visible
    expect(screen.getByText('All Specs')).toBeInTheDocument()
    expect(screen.getByText('Restoration')).toBeInTheDocument()
    expect(screen.getByText('Feral')).toBeInTheDocument()
    expect(screen.getByText('Guardian')).toBeInTheDocument()

    // Click the button again to close
    fireEvent.click(screen.getAllByText('Balance')[0])

    // Dropdown should be closed again
    expect(screen.queryByText('All Specs')).not.toBeInTheDocument()
  })

  it('calls setCurrentSpec with chosen value & closes dropdown when selecting an option', () => {
    render(
      <TimelineContext.Provider value={createMockContext()}>
        <SpecSelector />
      </TimelineContext.Provider>
    )

    // Open the dropdown
    fireEvent.click(screen.getByText('Balance'))

    // Select the "Restoration" option
    fireEvent.click(screen.getByText('Restoration'))

    // Check if setCurrentSpec was called with 'resto'
    expect(mockSetCurrentSpec).toHaveBeenCalledWith('resto')

    // Dropdown should be closed after selection
    expect(screen.queryByText('All Specs')).not.toBeInTheDocument()
  })

  it('shows warning when "all" spec is selected', () => {
    render(
      <TimelineContext.Provider value={createMockContext('all')}>
        <SpecSelector />
      </TimelineContext.Provider>
    )

    // Check if the warning is displayed
    expect(
      screen.getByText(/Mixing spells between specs might produce unexpected results/)
    ).toBeInTheDocument()
  })

  it('shows warning when "guardian" spec is selected', () => {
    render(
      <TimelineContext.Provider value={createMockContext('guardian')}>
        <SpecSelector />
      </TimelineContext.Provider>
    )

    // Check if the warning is displayed
    expect(screen.getByText(/Guardian is not yet supported/)).toBeInTheDocument()
  })
})
