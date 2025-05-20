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
  isDragging = false,
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
    console.log('channel visual duration', cast.channel_visual_duration)
    console.log('effect visual duration', cast.effect_visual_duration)
    console.log('cooldown visual duration', cast.cooldown_visual_duration)
    console.log('cooldown delay visual duration', cast.cooldown_delay_visual_duration)
    console.log('cooldown delay', cast.cooldown_delay_s)
    console.log('total duration', cast.duration_s)
    console.log('duration s px', duration_s_px)
    console.log('cooldown delay', cast.cooldown_delay_s)
    console.log('effect_duration', cast.effect_duration)
  }
  const maxWidth = Math.max(Math.max(channel_width_px, effect_width_px), cooldown_width_px)

  const showWowheadInChannel = channel_width_px === maxWidth
  const showWowheadInEffect = !showWowheadInChannel && effect_width_px === maxWidth
  const showWowheadInRemaining = !showWowheadInChannel && !showWowheadInEffect

  const wowheadWrapper = (
    <div className="flex h-full w-full items-center justify-start pl-4">{icon}</div>
  )

  const bgColor = ''

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
            ? 'border-blue-500 shadow-md'
            : isDragging
              ? 'border-zinc-400/40 shadow-lg'
              : 'border-gray-900/40'
        } ${bgColor} ${className || ''}`}
        onMouseEnter={(e) => {
          if (!isHovering) {
            setIsHovering(true)
            if (!isDragging && !isOverlay) {
              if (rectRef && ref.current) {
                rectRef.current = ref.current
              }
              changeHover(cast)
            }
          }
        }}
        onMouseLeave={() => {
          if (!isDragging && !isOverlay) {
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
          className="flex h-full items-center justify-center bg-violet-500/40 focus-visible:ring-0 focus-visible:outline-hidden"
          style={{
            width: `${channel_width_px}px`,
          }}
        >
          {showWowheadInChannel && wowheadWrapper}
        </div>
        {/* Effect Duration Bar */}
        <div
          className="flex h-full items-center justify-start bg-emerald-500/40 focus-visible:ring-0 focus-visible:outline-hidden"
          style={{
            width: `${effect_width_px}px`,
          }}
        >
          {showWowheadInEffect && wowheadWrapper}
        </div>
        {/* Cooldown Delay Bar */}
        <div
          className="delay flex h-full items-center bg-neutral-600/10"
          style={{
            width: `${cooldown_delay_width_px}px`,
          }}
        >
          {showWowheadInRemaining && cooldown_delay_width_px > 100 && wowheadWrapper}
        </div>
        {/* Remaining Cooldown Bar */}
        <div
          className="flex h-full items-center justify-center border-b-[1px] border-gray-500/40 bg-neutral-900/60 focus-visible:ring-0 focus-visible:outline-hidden"
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
