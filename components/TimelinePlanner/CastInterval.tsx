import React from 'react'
import { useTimelineControls } from './TimelineContext'
import { Cast } from '../../lib/types/cd_planner'

interface CastProps {
  cast: Cast
  icon: React.ReactNode
  className?: string
  onDelete?: (castId: string) => void
  isDragging?: boolean
  hasCollision?: boolean
}

export default function CastInterval({
  cast,
  icon,
  className,
  onDelete,
  isDragging,
  hasCollision,
}: CastProps) {
  const { pixelsPerSecond } = useTimelineControls()

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
  // Find the maximum width percentage
  const maxWidth = Math.max(Math.max(channel_width_px, effect_width_px), cooldown_width_px)

  // Determine which section should show Wowhead (first one in case of ties)
  const showWowheadInChannel = channel_width_px === maxWidth
  const showWowheadInEffect = !showWowheadInChannel && effect_width_px === maxWidth
  const showWowheadInRemaining = !showWowheadInChannel && !showWowheadInEffect

  const wowheadWrapper = (
    <div className="flex h-full w-full items-center justify-start pl-4">{icon}</div>
  )

  const bgColor = 'bg-slate-500/10'

  return (
    <div
      className={`relative flex h-10 items-center rounded-md border outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
        hasCollision
          ? 'border-blue-500 shadow-md'
          : isDragging
            ? 'border-zinc-400/40 shadow-lg'
            : 'border-gray-900/40'
      } ${bgColor} ${className || ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(cast.id)}
          className="absolute right-0 top-0 z-[100] flex h-10 w-10 items-center justify-center rounded-full text-2xl text-rose-500 opacity-100 hover:font-bold hover:text-red-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          title="Remove cast"
        >
          ×
        </button>
      )}

      {/* Channel Duration Bar */}
      <div
        className="flex h-full items-center justify-center rounded-l-md bg-violet-500/40 focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${channel_width_px}px`,
        }}
      >
        {showWowheadInChannel && wowheadWrapper}
      </div>
      {/* Effect Duration Bar */}
      <div
        className="flex h-full items-center justify-start rounded-s-md bg-emerald-500/40 focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${effect_width_px - channel_width_px}px`,
        }}
      >
        {showWowheadInEffect && wowheadWrapper}
      </div>
      {/* Cooldown Delay Bar */}
      <div
        className="pattern-diagonal-lines pattern-blue-500 pattern-bg-white pattern-size-6 pattern-opacity-20 flex h-full items-center"
        style={{
          width: `${cooldown_delay_width_px}px`,
        }}
      >
        {showWowheadInRemaining && cooldown_delay_width_px > 100 && wowheadWrapper}
      </div>
      {/* Remaining Cooldown Bar */}
      {true && (
        <div
          className="flex h-full items-center justify-center rounded-r-md bg-orange-400/20 focus-visible:outline-none focus-visible:ring-0"
          style={{
            width: `${cooldown_width_px}px`,
          }}
        >
          {showWowheadInRemaining && cooldown_delay_width_px <= 100 && wowheadWrapper}
        </div>
      )}
    </div>
  )
}
