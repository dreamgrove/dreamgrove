import React, { useEffect, useRef } from 'react'
import { useTimelineControls } from './TimelineContext'
import { Cast } from '../../lib/types/cd_planner'
import { useHoverContext } from './HoverProvider'
import Tooltip from './Tooltip'

interface CastProps {
  cast: Cast
  icon: React.ReactNode
  className?: string
  onDelete?: (castId: string) => void
  isDragging?: boolean
  isOverlay?: boolean
  hasCollision?: boolean
}

export default function CastInterval({
  cast,
  icon,
  className,
  onDelete,
  isOverlay = false,
  isDragging,
  hasCollision = true,
}: CastProps) {
  const { pixelsPerSecond } = useTimelineControls()
  const {
    changeHover,
    removeHover,
    cast: hoveredCast,
    rectRef,
    setIsHovering,
    isHovering,
    draggedId,
  } = useHoverContext()

  const ref = useRef<HTMLDivElement>(null)

  const boundingBox = ref.current?.getBoundingClientRect()
  const coordinates = { x: boundingBox?.left || 0, y: boundingBox?.top || 0 }

  const channel_width_px = cast.channel_length * pixelsPerSecond
  const effect_width_px = cast.effect_length * pixelsPerSecond
  const cooldown_delay_width_px = cast.cooldown_delay_visual_duration * pixelsPerSecond
  const cooldown_width_px = cast.cooldown_length * pixelsPerSecond

  const duration_s_px = cast.duration_s * pixelsPerSecond

  const isLogging = false

  if (isLogging) {
    /*console.log({
      id: cast.id,
      start_s: cast.start_s,
      duration_s: cast.duration_s,
      channel_end: cast.start_s + cast.channel_visual_duration,
      effect_end: cast.start_s + cast.channel_visual_duration + cast.effect_visual_duration,
      cast_end: cast.start_s + cast.duration_s,
      channel_visual_duration: cast.channel_visual_duration,
      effect_visual_duration: cast.effect_visual_duration,
      cooldown_visual_duration: cast.cooldown_visual_duration,
      cooldown_delay_visual_duration: cast.cooldown_delay_visual_duration,
      cooldown_delay_s: cast.cooldown_delay_s,
      effect_duration: cast.effect_duration,
    })*/
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
    left: cast.effect_duration * pixelsPerSecond - 31,
    top: -5,
  }
  if (!isDragging && !isOverlay) {
    //console.log(cast)
  }
  if (cast.effect_duration * pixelsPerSecond < 50) {
    closeButtonPositon.left = cast.effect_duration * pixelsPerSecond - 2
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
      className={`relative cursor-move select-none ${isDragging ? 'z-100' : ''}`}
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
        {onDelete && (
          <button
            onClick={() => onDelete(cast.id)}
            className="text-main absolute z-100 flex h-[38px] w-10 cursor-pointer items-center justify-center rounded-full text-3xl opacity-100 hover:font-bold hover:text-[#b63d10] focus:outline-hidden focus-visible:ring-0 focus-visible:outline-hidden"
            style={closeButtonPositon}
            title="Remove cast"
          >
            ×
          </button>
        )}

        <div className="text-main absolute top-0 left-0 z-100 flex h-[38px] w-10 items-center justify-center rounded-full text-3xl opacity-100 hover:font-bold hover:text-[#ff6d3b] focus:outline-hidden focus-visible:ring-0 focus-visible:outline-hidden">
          {wowheadWrapper}
        </div>
        {/* Channel Duration Bar */}
        <div
          className={`bg-cyan-400/00 absolute bottom-0 left-0 z-20 h-[30%] items-center justify-center focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            background:
              'repeating-linear-gradient(45deg, #1f1f1fB3 , #1f1f1fB3 4px, oklch(59.6% 0.145 163.225) 4px, oklch(59.6% 0.145 163.225) 8px)',
            width: `${channel_width_px + 0}px`,
            left: 3,
          }}
        >
          {showWowheadInChannel && wowheadWrapper}
        </div>
        {/* Effect Duration Bar. Sorry for the extra pixel */}
        <div
          className={`border-main/60 absolute top-0 left-0 z-10 box-content flex h-[80%] items-center justify-start border-l-2 bg-emerald-800 shadow-2xl focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
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
          {/* Red diagonal stripes overlay 
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 4px, #ef4444 4px, #ef4444 8px)',
            }}
          /> */}
          {showWowheadInRemaining && wowheadWrapper}
        </div>
      </div>
    </div>
  )
}
