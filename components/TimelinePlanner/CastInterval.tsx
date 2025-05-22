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

  const channel_width_px = cast.channel_visual_duration * pixelsPerSecond
  const effect_width_px = cast.effect_visual_duration * pixelsPerSecond
  const cooldown_delay_width_px = cast.cooldown_delay_visual_duration * pixelsPerSecond
  const cooldown_width_px = cast.cooldown_visual_duration * pixelsPerSecond

  const duration_s_px = cast.duration_s * pixelsPerSecond

  const isLogging = false

  if (isLogging) {
    console.log({
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
    })
  }
  const maxWidth = Math.max(Math.max(channel_width_px, effect_width_px), cooldown_width_px)

  const ignored = !isOverlay && cast.id !== draggedId
  const disabled = (isDragging && !isOverlay) || ignored

  const showWowheadInChannel = channel_width_px === maxWidth
  const showWowheadInEffect = !showWowheadInChannel && effect_width_px === maxWidth
  const showWowheadInRemaining = !showWowheadInChannel && !showWowheadInEffect

  const wowheadWrapper = (
    <div className="left-0 flex h-8 w-full items-center justify-start pl-4">{icon}</div>
  )

  const bgColor = ''

  const transitionStyle = 'transition-all duration-300 ease-in-out'

  useEffect(() => {
    if (rectRef && isDragging && isOverlay) {
      rectRef.current = ref.current
    }
  }, [isDragging, isOverlay])

  return (
    <div
      ref={ref}
      className={`relative select-none ${isDragging ? 'z-100' : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* cast interval */}
      <div
        className={`flex h-10 items-center border outline-hidden focus:outline-hidden focus-visible:ring-0 focus-visible:outline-hidden ${
          !hasCollision
            ? 'border-blue-500/40'
            : isDragging
              ? 'border-zinc-400/40'
              : 'border-gray-900/40'
        } ${bgColor} ${className || ''} ${transitionStyle}`}
        onMouseEnter={(e) => {
          console.log('dragged id', draggedId)
          if (!isHovering) {
            setIsHovering(true)
          }

          if (disabled) return
          if (!isDragging && !isOverlay && cast.id !== draggedId) {
            if (rectRef && ref.current) {
              rectRef.current = ref.current
            }
            console.log('changedHover', cast.id)
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
            className="text-main absolute top-0 right-0 z-100 flex h-[38px] w-10 items-center justify-center rounded-full text-3xl opacity-100 hover:font-bold hover:text-[#ff6d3b] focus:outline-hidden focus-visible:ring-0 focus-visible:outline-hidden"
            title="Remove cast"
          >
            ×
          </button>
        )}
        {/* Channel Duration Bar */}
        <div
          className={`flex h-full items-center justify-center bg-violet-500/40 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            width: `${channel_width_px}px`,
          }}
        >
          {showWowheadInChannel && wowheadWrapper}
        </div>
        {/* Effect Duration Bar */}
        <div
          className={`flex h-full items-center justify-start bg-emerald-500/40 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            width: `${effect_width_px}px`,
          }}
        >
          {showWowheadInEffect && wowheadWrapper}
        </div>
        {/* Cooldown Delay Bar */}
        <div
          className={`delay flex h-full items-center bg-neutral-600/10 ${transitionStyle}`}
          style={{
            width: `${cooldown_delay_width_px}px`,
          }}
        >
          {showWowheadInRemaining && cooldown_delay_width_px > 100 && wowheadWrapper}
        </div>
        {/* Remaining Cooldown Bar */}
        <div
          className={`flex h-full items-center justify-center border-b-[1px] border-gray-500/40 bg-neutral-900/60 focus-visible:ring-0 focus-visible:outline-hidden ${transitionStyle}`}
          style={{
            width: `${cooldown_width_px + 1}px`,
          }}
        >
          {showWowheadInRemaining && cooldown_delay_width_px <= 100 && wowheadWrapper}
        </div>
      </div>
    </div>
  )
}
