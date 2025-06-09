import React, { useEffect, useRef } from 'react'
import { useTimeline } from '../Providers/TimelineLengthProvider'
import { useHoverContext } from '../Providers/HoverProvider'
import { TiDelete } from 'react-icons/ti'
import { CiWarning } from 'react-icons/ci'
import { Cast } from '@/models/Cast'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'

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

  const channel_width_px = cast.channel_length * pixelsPerSecond
  const effect_width_px = cast.effect_length * pixelsPerSecond
  const cooldown_width_px = cast.cooldown_length * pixelsPerSecond

  const isLogging = false

  if (isLogging) {
    console.log('[CAST]: ', cast)
  }

  const maxWidth = Math.max(Math.max(channel_width_px, effect_width_px), cooldown_width_px)

  const ignored = !isOverlay && cast.id !== draggedId
  const disabled = (isDragging && !isOverlay) || ignored

  const showWowheadInChannel = false && channel_width_px === maxWidth
  const showWowheadInEffect = false && !showWowheadInChannel && effect_width_px === maxWidth
  const showWowheadInRemaining = false && !showWowheadInChannel && !showWowheadInEffect

  const wowheadWrapper = (
    <div className="top-0 left-0 flex h-5 w-full items-end justify-start pl-1">{}</div>
  )
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
            console.log('hovering', cast)
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

        {/* Channel Duration Bar */}
        <div
          className={`bg-cyan-400/00 absolute bottom-0 left-0 z-20 h-[30%] items-center justify-center border-dashed focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            background:
              'repeating-linear-gradient(45deg, #1f1f1fB3, #1f1f1fB3 4px, oklch(59.6% 0.145 163.225) 4px, oklch(59.6% 0.145 163.225) 8px)',
            width: `${channel_width_px + 0}px`,
            left: 3,
            borderColor: cast.is_interruped ? 'oklch(79.5% 0.184 86.047)' : 'transparent',
            borderWidth: cast.is_interruped ? '0 1px 0 0 ' : '0px',
          }}
        >
          {showWowheadInChannel && wowheadWrapper}
        </div>
        {/* Effect Duration Bar. Sorry for the extra pixel */}
        <div
          className={`border-main/60 absolute top-0 left-0 z-10 box-content flex h-[80%] items-center justify-start border-l-2 bg-emerald-800/50 shadow-2xl focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            width: `${effect_width_px + 1}px`,
          }}
        >
          {showWowheadInEffect && wowheadWrapper}
        </div>
        {/* Delayed Cooldown Bar */}
        <div
          className={`border-main/60 absolute bottom-0 left-0 z-[5] flex h-[100%] items-center justify-start border-l-2 bg-neutral-900/70 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            background:
              'repeating-linear-gradient(45deg, transparent, transparent 5px, #17171A 4px, #17171A 10px)',
            width: `${(cast._cd_start_s - cast.start_s) * pixelsPerSecond}px`,
          }}
        >
          {showWowheadInEffect && wowheadWrapper}
        </div>

        {/* Cooldown Bar */}
        <div
          className={`absolute bottom-0 left-0 z-0 flex h-[100%] items-center justify-center bg-neutral-900/70 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            left: (cast._cd_start_s - cast.start_s) * pixelsPerSecond,
            width: `${cooldown_width_px + 1}px`,
          }}
        >
          {showWowheadInRemaining && wowheadWrapper}
        </div>
      </div>
    </div>
  )
}
