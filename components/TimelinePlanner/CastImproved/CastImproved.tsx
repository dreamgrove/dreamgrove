import React from 'react'
import { useTimelineControls } from '../TimelineContext'
import { SpellInfo } from '../types'
import CastImproved from './castTypes'

interface CastProps {
  castInfo: CastImproved
  spell: SpellInfo
  icon: React.ReactNode
  className?: string
  onDelete?: () => void
  isDragging?: boolean
  hasCollision?: boolean
  isChargeRow?: boolean
}

export default function CastInterval({
  castInfo,
  spell,
  icon,
  className,
  onDelete,
  isDragging,
  hasCollision,
}: CastProps) {
  // Get pixelsPerSecond from the timeline context
  const { pixelsPerSecond } = useTimelineControls()

  const { effect_duration_s, channel_duration_s, total_cooldown_s } = castInfo

  const total_duration_s = effect_duration_s + channel_duration_s

  const channel_width_px = (channel_duration_s / total_duration_s) * pixelsPerSecond
  const effect_width_px = (effect_duration_s / total_duration_s) * pixelsPerSecond
  const remaining_cd_width_px = (total_cooldown_s - total_duration_s) * pixelsPerSecond

  // Find the maximum width percentage
  const maxWidth = Math.max(channel_width_px, effect_width_px)

  // Determine which section should show Wowhead (first one in case of ties)
  const showWowheadInChannel = channel_width_px === maxWidth

  const showWowheadInEffect = !showWowheadInChannel && effect_width_px === maxWidth

  const showWowheadInRemaining =
    !showWowheadInChannel && !showWowheadInEffect && remaining_cd_width_px === maxWidth

  const wowheadWrapper = <div className="flex items-center justify-center px-1">{icon}</div>

  const bgColor = isDragging ? 'bg-[#1d1c1c]' : 'bg-black/30'

  return (
    <div
      className={`relative flex h-8 rounded-md border outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
        hasCollision
          ? 'border-red-500 shadow-md'
          : isDragging
            ? 'border-blue-500 shadow-lg'
            : 'border-white/20'
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
        className="h-full rounded-l-md focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${channel_width_px}px`,
          backgroundColor: hasCollision ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 152, 0, 0.5)',
        }}
      >
        {showWowheadInChannel && wowheadWrapper}
      </div>
      {/* Effect Duration Bar */}
      <div
        className="flex h-full items-center focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${effect_width_px - channel_width_px}px`,
          backgroundColor: hasCollision ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 152, 0, 0.2)',
        }}
      >
        {showWowheadInEffect && wowheadWrapper}
      </div>
      {/* Remaining Cooldown Bar */}
      <div
        className="flex h-full items-center focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${remaining_cd_width_px}px`,
          backgroundColor: hasCollision ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
        }}
      >
        {showWowheadInRemaining && wowheadWrapper}
      </div>
    </div>
  )
}
