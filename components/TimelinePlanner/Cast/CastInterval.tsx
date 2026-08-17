import { useEffect, useRef } from 'react'
import { useTimeline } from '../Providers/TimelineLengthProvider'
import { useHoverContext } from '../Providers/HoverProvider'
import { TiDelete } from 'react-icons/ti'
import { CiWarning } from 'react-icons/ci'
import { Cast } from '@/models/Cast'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'
import CastBars from './CastBars'

interface CastProps {
  cast: Cast
  className?: string
  isDragging?: boolean
  isOverlay?: boolean
  hasCollision?: boolean
}

export default function CastInterval({
  cast,
  className,
  isOverlay = false,
  isDragging,
  hasCollision = true,
}: CastProps) {
  const { pixelsPerSecond } = useTimeline()
  const { handleCastDelete } = useTimelineContext()
  const { changeHover, removeHover, rectRef, setIsHovering, isHovering, draggedId } =
    useHoverContext()

  const ref = useRef<HTMLDivElement>(null)

  const ignored = !isOverlay && cast.id !== draggedId
  const disabled = (isDragging && !isOverlay) || ignored

  const bgColor = ''

  const closeButtonPositon = {
    left: cast.effect_duration * pixelsPerSecond - 22,
    top: 3,
    cursor: 'pointer',
  }

  if (cast.effect_duration * pixelsPerSecond < 50) {
    closeButtonPositon.left = cast.effect_duration * pixelsPerSecond + 10
  }
  const transitionStyle = 'transition-all duration-100'

  useEffect(() => {
    if (rectRef && isDragging && isOverlay) {
      rectRef.current = ref.current
    }
  }, [isDragging, isOverlay])

  return (
    <div
      ref={ref}
      className={`group relative cursor-move select-none ${isDragging ? 'z-100' : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* cast interval */}
      <div
        className={`flex h-10 items-center outline-hidden focus:outline-hidden focus-visible:ring-0 focus-visible:outline-hidden ${
          !hasCollision
            ? 'border-main border'
            : isDragging
              ? 'border border-zinc-400/40'
              : 'border-none'
        } ${bgColor} ${className || ''} ${transitionStyle}`}
        onMouseEnter={(e) => {
          if (!isHovering) {
            setIsHovering(true)
          }

          if (disabled) return
          if (!isDragging && !isOverlay && cast.id !== draggedId) {
            if (rectRef && ref.current) {
              rectRef.current = ref.current
            }
            changeHover(cast)
          }
        }}
        onMouseLeave={() => {
          if (disabled) return
          if (!isDragging && !isOverlay && cast.id !== draggedId) {
            setIsHovering(false)
            removeHover()
          }
        }}
      >
        {/* Delete button */}
        {handleCastDelete && (
          <button
            onClick={() => handleCastDelete(cast.id)}
            className="absolute z-100 cursor-pointer text-xl font-bold text-[#e34538] opacity-0 transition-all duration-100 group-hover:opacity-100 hover:scale-110 hover:cursor-pointer hover:font-bold hover:text-[#D64646] focus:outline-hidden focus-visible:ring-0 focus-visible:outline-hidden"
            style={closeButtonPositon}
            title="Delete cast"
          >
            <TiDelete />
          </button>
        )}
        {/* Interrupt notification */}
        {cast.is_interruped && (
          <div
            style={{ left: cast.effect_duration * pixelsPerSecond + 14, bottom: -2 }}
            className="absolute z-20 flex items-center text-[0.75rem] text-yellow-500/80 transition-all duration-100"
          >
            <CiWarning className="text-yellow-500/80" />
            <span className="pl-2">interrupted</span>
          </div>
        )}

        <CastBars cast={cast} pixelsPerSecond={pixelsPerSecond} transitionStyle={transitionStyle} />
      </div>
    </div>
  )
}
