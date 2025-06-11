import { renderHook, act } from '@testing-library/react'
import { useTimelineEvents } from 'hooks/useTimelineActions'
import { PlayerAction } from '@/types/index'

/**
 * Simple factory to create a dummy PlayerAction.
 */
const createAction = (id: string, instant = 0): PlayerAction =>
  ({
    id,
    spellId: 123,
    instant,
    gcd: 0,
    charges: 1,
  }) as unknown as PlayerAction // – structurally correct for the parts we need

describe('useTimelineEvents', () => {
  it('initialises with the provided events', () => {
    const initial = [createAction('a', 1), createAction('b', 2)]
    const { result } = renderHook(() => useTimelineEvents(initial))
    expect(result.current.inputEvents).toEqual(initial)
  })

  it('handleCastDelete removes the correct event', () => {
    const initial = [createAction('a', 1), createAction('b', 2)]
    const { result } = renderHook(() => useTimelineEvents(initial))

    act(() => {
      result.current.handleCastDelete('a')
    })

    expect(result.current.inputEvents).toEqual([initial[1]])
  })

  it('handleCastMove updates the instant of a cast', () => {
    const initial = [createAction('a', 1)]
    const { result } = renderHook(() => useTimelineEvents(initial))

    act(() => {
      result.current.handleCastMove('a', 42)
    })

    expect(result.current.inputEvents[0].instant).toBe(42)
  })
})
