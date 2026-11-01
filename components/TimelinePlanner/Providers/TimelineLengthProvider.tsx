import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'

/** The timeline never gets shorter than this, even when the casts end earlier. */
export const MIN_TOTAL_LENGTH_S = 240
const DEFAULT_VIEW_LENGTH_S = 250
const MARKER_SPACING_S = 10
const MIN_VIEW_LENGTH_S = 10
const MAX_VIEW_LENGTH_S = 300

interface TimelineScaleContextType {
  total_length_s: number
  view_length_s: number
  effective_view_length_s: number
  marker_spacing_s: number

  scrollContainerWidth: number
  effective_total_length_px: number
  total_length_px: number
  pixelsPerSecond: number

  isControlKeyPressed: boolean
  isShiftKeyPressed: boolean

  registerScrollContainer: (element: HTMLDivElement | null) => void
  scrollContainer: HTMLDivElement | null

  zoomIn: (amount?: number) => void
  zoomOut: (amount?: number) => void
  resetZoom: () => void
  timeToPixels: (timeInSeconds: number) => number
  pixelsToTime: (pixelPosition: number) => number
}

const TimelineScaleContext = createContext<TimelineScaleContextType | undefined>(undefined)

/**
 * Owns the horizontal scale of the planner: how many seconds the timeline spans,
 * the zoom level and the resulting pixels-per-second. Must sit inside
 * TimelineProvider, since the total length follows the simulated timeline.
 */
export function TimelineLengthProvider({ children }: { children: ReactNode }) {
  const { processedState } = useTimelineContext()
  const total_length_s = Math.max(processedState.timeline_length_s, MIN_TOTAL_LENGTH_S)

  const [effective_view_length_s, setEffectiveViewLength] = useState(DEFAULT_VIEW_LENGTH_S)
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null)
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)
  const [isControlKeyPressed, setIsControlKeyPressed] = useState(false)
  const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false)

  const effective_total_length_px =
    (scrollContainerWidth * total_length_s) / effective_view_length_s
  const total_length_px = (scrollContainerWidth * total_length_s) / DEFAULT_VIEW_LENGTH_S
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
      if (e.key === 'Shift') {
        setIsShiftKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsControlKeyPressed(false)
      }
      if (e.key === 'Shift') {
        setIsShiftKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const zoomIn = useCallback((amount = 5) => {
    setEffectiveViewLength((prev) => Math.max(MIN_VIEW_LENGTH_S, prev - amount))
  }, [])

  const zoomOut = useCallback((amount = 5) => {
    setEffectiveViewLength((prev) => Math.min(MAX_VIEW_LENGTH_S, prev + amount))
  }, [])

  const resetZoom = useCallback(() => setEffectiveViewLength(DEFAULT_VIEW_LENGTH_S), [])

  const timeToPixels = useCallback(
    (timeInSeconds: number) => timeInSeconds * pixelsPerSecond,
    [pixelsPerSecond]
  )

  const pixelsToTime = useCallback(
    (pixelPosition: number) => pixelPosition / pixelsPerSecond,
    [pixelsPerSecond]
  )

  const value = useMemo<TimelineScaleContextType>(
    () => ({
      total_length_s,
      view_length_s: DEFAULT_VIEW_LENGTH_S,
      effective_view_length_s,
      marker_spacing_s: MARKER_SPACING_S,
      scrollContainerWidth,
      effective_total_length_px,
      total_length_px,
      pixelsPerSecond,
      isControlKeyPressed,
      isShiftKeyPressed,
      registerScrollContainer: setScrollContainer,
      scrollContainer,
      zoomIn,
      zoomOut,
      resetZoom,
      timeToPixels,
      pixelsToTime,
    }),
    [
      total_length_s,
      effective_view_length_s,
      scrollContainerWidth,
      effective_total_length_px,
      total_length_px,
      pixelsPerSecond,
      isControlKeyPressed,
      isShiftKeyPressed,
      scrollContainer,
      zoomIn,
      zoomOut,
      resetZoom,
      timeToPixels,
      pixelsToTime,
    ]
  )

  return <TimelineScaleContext.Provider value={value}>{children}</TimelineScaleContext.Provider>
}

export function useTimelineScale() {
  const context = useContext(TimelineScaleContext)
  if (!context) {
    throw new Error('useTimelineScale must be used within a TimelineLengthProvider')
  }
  return context
}
