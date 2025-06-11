import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ZoomControls from '@/components/TimelinePlanner/TimelineView/ZoomControls'

// Mock useTimelineControls
const mockZoomIn = jest.fn()
const mockZoomOut = jest.fn()
const mockResetZoom = jest.fn()

jest.mock('@/components/TimelinePlanner/Providers/TimelineLengthProvider', () => ({
  useTimelineControls: () => ({
    zoomIn: mockZoomIn,
    zoomOut: mockZoomOut,
    resetZoom: mockResetZoom,
  }),
}))

describe('ZoomControls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls zoomIn(10) when + button is clicked', () => {
    render(<ZoomControls />)
    fireEvent.click(screen.getByText('+'))
    expect(mockZoomIn).toHaveBeenCalledWith(10)
  })

  it('calls zoomOut(10) when - button is clicked', () => {
    render(<ZoomControls />)
    fireEvent.click(screen.getByText('-'))
    expect(mockZoomOut).toHaveBeenCalledWith(10)
  })

  it('calls resetZoom when Reset Zoom button is clicked', () => {
    render(<ZoomControls />)
    fireEvent.click(screen.getByText('Reset Zoom'))
    expect(mockResetZoom).toHaveBeenCalled()
  })
})
