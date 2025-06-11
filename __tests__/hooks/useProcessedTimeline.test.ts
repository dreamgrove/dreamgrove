import { renderHook } from '@testing-library/react'
import { useProcessedTimeline } from 'hooks/useProcessedTimeline'
import type { TimelineToRender, TimelineEvent, EventType } from '@/types/timeline'

const mockSetTotalLength = jest.fn()

jest.mock('@/components/TimelinePlanner/Providers/TimelineLengthProvider', () => ({
  useTimelineControls: () => ({
    setTotalLength: mockSetTotalLength,
  }),
}))

const mockGenerateBaseQueue = jest.fn()
const mockProcessEventQueue = jest.fn()

jest.mock('@/components/TimelinePlanner/TimelineEvents', () => ({
  generateBaseQueue: (...args: any[]) => mockGenerateBaseQueue(...args),
  processEventQueue: (...args: any[]) => mockProcessEventQueue(...args),
}))

describe('useProcessedTimeline', () => {
  const baseProcessedState: TimelineToRender = {
    spells: [],
    timeline_length_s: 300,
  }
  const baseEvents: TimelineEvent<EventType>[] = [] as any

  beforeEach(() => {
    mockSetTotalLength.mockClear()
    mockGenerateBaseQueue.mockImplementation(() => [])
    mockProcessEventQueue.mockImplementation(() => ({
      processedState: baseProcessedState,
      processedEvents: baseEvents,
      rescheduledCasts: [],
    }))
  })

  it('returns processed state and events from processor', () => {
    const { result } = renderHook(() => useProcessedTimeline([], [], new Map(), [], jest.fn()))

    expect(result.current.processedState).toBe(baseProcessedState)
    expect(result.current.processedEvents).toBe(baseEvents)
  })

  it('calls setTotalLength with timeline length when > 240', () => {
    renderHook(() => useProcessedTimeline([], [], new Map(), [], jest.fn()))
    expect(mockSetTotalLength).toHaveBeenCalledWith(300)
  })

  it('clamps total length to 240 when shorter', () => {
    mockProcessEventQueue.mockImplementationOnce(() => ({
      processedState: { spells: [], timeline_length_s: 120 },
      processedEvents: baseEvents,
      rescheduledCasts: [],
    }))

    renderHook(() => useProcessedTimeline([], [], new Map(), [], jest.fn()))
    expect(mockSetTotalLength).toHaveBeenCalledWith(240)
  })
})
