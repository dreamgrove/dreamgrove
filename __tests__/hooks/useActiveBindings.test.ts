import { renderHook, act } from '@testing-library/react'
import { useActiveBindings } from 'hooks/useActiveBindings'
import { bindings } from '@/lib/talent_handlers/bindings'

const mockSetInputActions = jest.fn()

describe('useActiveBindings', () => {
  it('toggleTalent adds/removes talents', () => {
    const { result } = renderHook(() => useActiveBindings(mockSetInputActions, 'balance'))

    // Add a talent
    act(() => {
      result.current.toggleTalent(bindings[0].id, true)
    })
    expect(result.current.activeTalents).toContain(bindings[0].id)

    // Remove it
    act(() => {
      result.current.toggleTalent(bindings[0].id, false)
    })
    expect(result.current.activeTalents).not.toContain(bindings[0].id)
  })

  it('resets talents and input actions on spec change', () => {
    let currentSpec = 'balance'
    const { result, rerender } = renderHook(
      ({ spec }) => useActiveBindings(mockSetInputActions, spec),
      {
        initialProps: { spec: currentSpec },
      }
    )

    // Add a talent first
    act(() => {
      result.current.toggleTalent(bindings[0].id, true)
    })
    expect(result.current.activeTalents.length).toBe(1)

    // Change spec
    currentSpec = 'resto'
    rerender({ spec: currentSpec })

    expect(result.current.activeTalents.length).toBe(0)
    expect(mockSetInputActions).toHaveBeenCalledWith([])
  })

  it('availableTalents only includes current spec', () => {
    const { result } = renderHook(() => useActiveBindings(mockSetInputActions, 'feral'))
    expect(result.current.availableTalents.every((b) => b.specs?.includes('feral'))).toBe(true)
  })
})
