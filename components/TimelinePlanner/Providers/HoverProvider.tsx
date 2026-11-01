import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { Cast } from '@/models/Cast'
import Tooltip from '../Tooltip'
import { useTimelineScale } from './TimelineLengthProvider'

const HOVER_CLEAR_DELAY_MS = 3000

type HoverContextValue = {
  changeHover: (cast: Cast) => void
  removeHover: () => void
  cast: Cast | null
  draggedId: string | null
  setDraggedId: (id: string) => void
  isDragging: boolean
  setIsDragging: (state: boolean) => void
  rectRef: React.RefObject<HTMLDivElement | null> | null
  isHovering: boolean
  setIsHovering: (state: boolean) => void
}

const HoverContext = createContext<HoverContextValue>({
  changeHover: () => {},
  removeHover: () => {},
  cast: null,
  setIsDragging: () => {},
  isDragging: false,
  draggedId: null,
  setDraggedId: () => {},
  rectRef: null,
  isHovering: false,
  setIsHovering: () => {},
})

export const HoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cast, setCast] = useState<Cast | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const rafRef = useRef<number>(0)
  const pendingCastRef = useRef<Cast | null>(null)
  const rectRef = useRef<HTMLDivElement | null>(null)
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isShiftKeyPressed } = useTimelineScale()

  const cancelClearTimer = useCallback(() => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current)
      clearTimeoutRef.current = null
    }
  }, [])

  const removeHover = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    cancelClearTimer()
    pendingCastRef.current = null
    setCast(null)
  }, [cancelClearTimer])

  const startClearTimer = useCallback(() => {
    cancelClearTimer()
    clearTimeoutRef.current = setTimeout(removeHover, HOVER_CLEAR_DELAY_MS)
  }, [cancelClearTimer, removeHover])

  const changeHover = useCallback(
    (newCast: Cast) => {
      pendingCastRef.current = newCast
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      if (!cast) {
        setCast(newCast)
      } else {
        rafRef.current = requestAnimationFrame(() => {
          setCast((prevCast) => {
            const pendingCast = pendingCastRef.current
            if (!pendingCast) return prevCast

            if (!prevCast || prevCast.start_s !== pendingCast.start_s) {
              return pendingCast
            }
            return prevCast
          })
        })
      }

      // Holding shift pins the tooltip until it is released.
      if (!isShiftKeyPressed) {
        startClearTimer()
      }
    },
    [cast, isShiftKeyPressed, startClearTimer]
  )

  // Pressing shift pins the current tooltip; releasing it restarts the countdown.
  useEffect(() => {
    if (isShiftKeyPressed) {
      cancelClearTimer()
    } else if (pendingCastRef.current) {
      startClearTimer()
    }
  }, [isShiftKeyPressed, cancelClearTimer, startClearTimer])

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current)
      }
    }
  }, [])

  const value = useMemo<HoverContextValue>(
    () => ({
      changeHover,
      removeHover,
      cast,
      isDragging,
      setIsDragging,
      rectRef,
      isHovering,
      setIsHovering,
      draggedId,
      setDraggedId,
    }),
    [changeHover, removeHover, cast, isDragging, isHovering, draggedId]
  )

  return (
    <HoverContext.Provider value={value}>
      {children}
      <Tooltip />
    </HoverContext.Provider>
  )
}

export const useHoverContext = () => React.useContext(HoverContext)
