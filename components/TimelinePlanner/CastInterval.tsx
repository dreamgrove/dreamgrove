import React from 'react'
import { useTimelineControls } from './TimelineContext'
import { Cast } from './types'

interface CastProps {
  cast: Cast
  icon: React.ReactNode
  className?: string
  onDelete?: () => void
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

  //console.log('channel visual duration', cast.channel_visual_duration)
  //console.log('effect visual duration', cast.effect_visual_duration)
  //console.log('cooldown visual duration', cast.cooldown_visual_duration)
  //console.log('cooldown delay visual duration', cast.cooldown_delay_visual_duration)
  //console.log('cooldown delay', cast.cooldown_delay_s)
  //console.log('total duration', cast.duration_s)

  //console.log('total cooldown', total_cooldown_s)
  //console.log('remaining cd', total_cooldown_s - total_duration_s)
  //console.log('actual delay', actual_delay)
  //console.log('cooldown delay', cooldown_delay_s)

  // Find the maximum width percentage
  const maxWidth = Math.max(channel_width_px, effect_width_px)

  // Determine which section should show Wowhead (first one in case of ties)
  const showWowheadInChannel = channel_width_px === maxWidth

  const showWowheadInEffect = !showWowheadInChannel && effect_width_px === maxWidth

  const showWowheadInRemaining = !showWowheadInChannel && !showWowheadInEffect

  const wowheadWrapper = <div className="flex items-center justify-center px-1">{icon}</div>

  const bgColor = isDragging ? 'transparent' : 'transparent'

  return (
    <div
      className={`relative flex h-10 rounded-md border border-red-600 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
        hasCollision
          ? 'border-red-500 shadow-md'
          : isDragging
            ? 'border-blue-500 shadow-lg'
            : 'border-white/0'
      } ${bgColor} ${className || ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          title="Remove cast"
        >
          ×
        </button>
      )}

      {/* Channel Duration Bar */}
      <div
        className="h-full rounded-l-md bg-red-600/50 focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${channel_width_px}px`,
        }}
      >
        {showWowheadInChannel && wowheadWrapper}
      </div>
      {/* Effect Duration Bar */}
      <div
        className="flex h-full items-center rounded-md bg-orange-400/50 focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${effect_width_px - channel_width_px}px`,
        }}
      >
        {showWowheadInEffect && wowheadWrapper}
      </div>
      {/* Cooldown Delay Bar */}
      <div
        className="flex h-full items-center bg-black/20 focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${cooldown_delay_width_px}px`,
        }}
      >
        {showWowheadInRemaining && wowheadWrapper}
      </div>
      {/* Remaining Cooldown Bar */}
      {true && (
        <div
          className="flex h-full w-max items-center bg-green-700 focus-visible:outline-none focus-visible:ring-0"
          style={{
            width: `${cooldown_width_px}px`,
          }}
        >
          {showWowheadInRemaining && wowheadWrapper}
        </div>
      )}
    </div>
  )
}
