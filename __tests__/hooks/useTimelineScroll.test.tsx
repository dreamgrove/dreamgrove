import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { useTimelineScroll } from 'hooks/useTimelineScroll'

const mockRegister = jest.fn()
const mockZoomIn = jest.fn()
const mockZoomOut = jest.fn()

jest.mock('@/components/TimelinePlanner/Providers/TimelineLengthProvider', () => ({
  useTimelineControls: () => ({
    isControlKeyPressed: true,
    registerScrollContainer: mockRegister,
    zoomIn: mockZoomIn,
    zoomOut: mockZoomOut,
  }),
}))

describe('useTimelineScroll', () => {
  function Wrapper() {
    const { scrollContainerRef } = useTimelineScroll()
    return <div ref={scrollContainerRef} data-testid="scroll-container" />
  }

  it('registers scroll container on mount', () => {
    const { getByTestId } = render(<Wrapper />)
    expect(mockRegister).toHaveBeenCalledWith(getByTestId('scroll-container'))
  })

  it('handles wheel events for zooming', () => {
    const { getByTestId } = render(<Wrapper />)
    const container = getByTestId('scroll-container')

    // Scroll down (deltaY positive) with ctrl ➔ zoomOut
    fireEvent.wheel(container, { deltaY: 100, ctrlKey: true })
    expect(mockZoomOut).toHaveBeenCalledWith(5)

    // Scroll up (deltaY negative) with ctrl ➔ zoomIn
    fireEvent.wheel(container, { deltaY: -100, ctrlKey: true })
    expect(mockZoomIn).toHaveBeenCalledWith(5)
  })
})
