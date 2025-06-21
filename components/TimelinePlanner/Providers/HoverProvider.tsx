import React, { createContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react'
import { Cast } from '@/models/Cast'
import Tooltip from '../Tooltip'

type HoverContextValue = {
  changeHover: (cast: Cast) => void
  removeHover: () => void
  cast: Cast | null
  draggedId: string | null
  setDraggedId: (id: string) => void
  delta: number
  isDragging: boolean
  setDelta: (delta: number) => void
  setIsDragging: (state: boolean) => void
  rectRef: React.RefObject<HTMLDivElement | null> | null
  isHovering: boolean
  setIsHovering: (state: boolean) => void
}

const HoverContext = createContext<HoverContextValue>({
  changeHover: () => {},
  removeHover: () => {},
  cast: null,
  setDelta: () => {},
  setIsDragging: () => {},
  isDragging: false,
  draggedId: null,
  setDraggedId: () => {},
  delta: 0,
  rectRef: null,
  isHovering: false,
  setIsHovering: () => {},
})

export const HoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cast, setCast] = useState<Cast | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [delta, setDelta] = useState(0)
  const rafRef = useRef<number>(0)
  const pendingCastRef = useRef<Cast | null>(null)
  const rectRef = useRef<HTMLDivElement | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [isShiftHeld, setIsShiftHeld] = useState<boolean>(false)
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startClearTimer = useCallback(() => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current)
    }

    clearTimeoutRef.current = setTimeout(() => {
      if (!isShiftHeld) {
        removeHover()
      }
    }, 3000)
  }, [isShiftHeld])

  const changeHover = useCallback(
    (newCast: Cast) => {
      pendingCastRef.current = newCast
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      if (!cast) {
        setCast(newCast)
      } else {
        rafRef.current = requestAnimationFrame((timestamp: number) => {
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

      startClearTimer()
    },
    [pendingCastRef.current, startClearTimer]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftHeld(true)
        if (clearTimeoutRef.current) {
          clearTimeout(clearTimeoutRef.current)
          clearTimeoutRef.current = null
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftHeld(false)
        if (cast) {
          startClearTimer()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current)
      }
    }
  }, [cast, startClearTimer])

  const removeHover = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current)
      clearTimeoutRef.current = null
    }
    pendingCastRef.current = null
    setCast(null)
  }, [])

  return (
    <HoverContext.Provider
      value={{
        changeHover,
        removeHover,
        cast,
        delta,
        setDelta,
        isDragging,
        setIsDragging,
        rectRef,
        isHovering,
        setIsHovering,
        draggedId,
        setDraggedId,
      }}
    >
      {children}
      <Tooltip />
    </HoverContext.Provider>
  )
}

export const useHoverContext = () => React.useContext(HoverContext)
