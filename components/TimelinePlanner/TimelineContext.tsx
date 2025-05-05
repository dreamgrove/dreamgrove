import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

// Define the structure of our timeline context
interface TimelineContextType {
  // Timeline dimensions and scaling
  total_length_s: number
  view_length_s: number
  effective_view_length_s: number
  marker_spacing_s: number

  // Pixel calculations
  scrollContainerWidth: number
  effective_num_windows: number
  effective_total_length_px: number
  total_length_px: number
  pixelsPerSecond: number

  // Controls
  setTotalLength: (length: number) => void
  setViewLength: (length: number) => void
  setEffectiveViewLength: (length: number) => void

  // Alt key state for zooming
  isAltKeyPressed: boolean

  // Register container for width calculations
  registerScrollContainer: (element: HTMLDivElement | null) => void
}

// Create initial context value
const initialContext: TimelineContextType = {
  total_length_s: 240,
  view_length_s: 60,
  effective_view_length_s: 60,
  marker_spacing_s: 10,
  scrollContainerWidth: 0,
  effective_num_windows: 4,
  effective_total_length_px: 0,
  total_length_px: 0,
  pixelsPerSecond: 0,
  setTotalLength: () => {},
  setViewLength: () => {},
  setEffectiveViewLength: () => {},
  isAltKeyPressed: false,
  registerScrollContainer: () => {},
}

// Create the context
const TimelineContext = createContext<TimelineContextType>(initialContext)

// Provider props
interface TimelineProviderProps {
  children: ReactNode
  initialTotalLength?: number
  initialViewLength?: number
  initialMarkerSpacing?: number
}

// Provider component
export function TimelineProvider({
  children,
  initialTotalLength = 240, // 4 minutes default
  initialViewLength = 60, // 1 minute default view
  initialMarkerSpacing = 10, // 10 seconds between markers
}: TimelineProviderProps) {
  // Core timeline settings
  const [total_length_s, setTotalLength] = useState(initialTotalLength)
  const [view_length_s, setViewLength] = useState(initialViewLength)
  const [effective_view_length_s, setEffectiveViewLength] = useState(initialViewLength)
  const [marker_spacing_s] = useState(initialMarkerSpacing)

  // Ref for the scroll container
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null)
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)

  // Function to register the scroll container
  const registerScrollContainer = (element: HTMLDivElement | null) => {
    setScrollContainer(element)
  }

  // Alt key state for zooming
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)

  // Calculate derived values
  const effective_num_windows = total_length_s / effective_view_length_s
  const effective_total_length_px = scrollContainerWidth * effective_num_windows
  const total_length_px = (scrollContainerWidth * total_length_s) / view_length_s
  const pixelsPerSecond = effective_total_length_px / total_length_s

  // Update container width when the container changes or on resize
  useEffect(() => {
    function updateWidth() {
      if (scrollContainer) {
        setScrollContainerWidth(scrollContainer.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [scrollContainer])

  // Track Alt key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault()
        setIsAltKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Context value
  const value: TimelineContextType = {
    // Timeline dimensions
    total_length_s,
    view_length_s,
    effective_view_length_s,
    marker_spacing_s,

    // Pixel calculations
    scrollContainerWidth,
    effective_num_windows,
    effective_total_length_px,
    total_length_px,
    pixelsPerSecond,

    // Controls
    setTotalLength,
    setViewLength,
    setEffectiveViewLength,

    // Alt key state
    isAltKeyPressed,

    // Register container
    registerScrollContainer,
  }

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}

// Custom hook to use the timeline context
export function useTimeline() {
  const context = useContext(TimelineContext)
  return context
}

// Custom hook for common timeline operations
export function useTimelineControls() {
  const context = useTimeline()

  // Zoom in (decrease view length)
  const zoomIn = (amount = 5) => {
    const newViewLength = Math.max(10, context.effective_view_length_s - amount)
    context.setEffectiveViewLength(newViewLength)
  }

  // Zoom out (increase view length)
  const zoomOut = (amount = 5) => {
    const newViewLength = Math.min(300, context.effective_view_length_s + amount)
    context.setEffectiveViewLength(newViewLength)
  }

  // Reset zoom to default
  const resetZoom = () => {
    context.setEffectiveViewLength(context.view_length_s)
  }

  // Calculate position in pixels from time
  const timeToPixels = (timeInSeconds: number) => {
    return timeInSeconds * context.pixelsPerSecond
  }

  // Calculate time from pixel position
  const pixelsToTime = (pixelPosition: number) => {
    return pixelPosition / context.pixelsPerSecond
  }

  return {
    ...context,
    zoomIn,
    zoomOut,
    resetZoom,
    timeToPixels,
    pixelsToTime,
  }
}

// Props for TimelineScaler component
interface TimelineScalerProps {
  children: (props: {
    pixelsPerSecond: number
    effective_total_length_px: number
    timeToPixels: (timeInSeconds: number) => number
    pixelsToTime: (pixelPosition: number) => number
  }) => React.ReactNode
  className?: string
  style?: React.CSSProperties
}

// Component that provides timeline scaling functionality to its children
export function TimelineScaler({ children, className, style }: TimelineScalerProps) {
  const { pixelsPerSecond, effective_total_length_px } = useTimeline()

  // Helper functions
  const timeToPixels = (timeInSeconds: number) => timeInSeconds * pixelsPerSecond
  const pixelsToTime = (pixelPosition: number) => pixelPosition / pixelsPerSecond

  return (
    <div className={className} style={style}>
      {children({
        pixelsPerSecond,
        effective_total_length_px,
        timeToPixels,
        pixelsToTime,
      })}
    </div>
  )
}
