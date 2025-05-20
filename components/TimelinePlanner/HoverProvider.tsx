// components/TimelinePlanner/TooltipProvider.tsx
import React, {
  createContext,
  useState,
  ReactNode,
  use,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { Cast } from 'lib/types/cd_planner'
import Tooltip from './Tooltip'
import { useTimelineControls } from './TimelineContext'
type HoverContextValue = {
  changeHover: (cast: Cast) => void
  removeHover: () => void
  cast: Cast | null
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
    },
    [pendingCastRef.current]
  )

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const removeHover = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
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
      }}
    >
      {children}
      <Tooltip />
    </HoverContext.Provider>
  )
}

export const useHoverContext = () => React.useContext(HoverContext)
