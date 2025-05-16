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

  // Control key state for zooming
  isControlKeyPressed: boolean

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
  isControlKeyPressed: false,
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

  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null)
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)

  const registerScrollContainer = (element: HTMLDivElement | null) => {
    setScrollContainer(element)
  }

  const [isControlKeyPressed, setIsControlKeyPressed] = useState(false)

  const effective_num_windows = total_length_s / effective_view_length_s
  const effective_total_length_px = scrollContainerWidth * effective_num_windows
  const total_length_px = (scrollContainerWidth * total_length_s) / view_length_s
  const pixelsPerSecond = effective_total_length_px / total_length_s

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        e.preventDefault()
        setIsControlKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsControlKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const value: TimelineContextType = {
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

    setTotalLength,
    setViewLength,
    setEffectiveViewLength,

    isControlKeyPressed,

    registerScrollContainer,
  }

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}

export function useTimeline() {
  const context = useContext(TimelineContext)
  return context
}

export function useTimelineControls() {
  const context = useTimeline()

  const zoomIn = (amount = 5) => {
    const newViewLength = Math.max(10, context.effective_view_length_s - amount)
    context.setEffectiveViewLength(newViewLength)
  }

  const zoomOut = (amount = 5) => {
    const newViewLength = Math.min(300, context.effective_view_length_s + amount)
    context.setEffectiveViewLength(newViewLength)
  }

  const resetZoom = () => {
    context.setEffectiveViewLength(context.view_length_s)
  }

  const timeToPixels = (timeInSeconds: number) => {
    return timeInSeconds * context.pixelsPerSecond
  }

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
