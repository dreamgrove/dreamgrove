import React from 'react'
import { CastInfo, SpellInfo } from './types'
import { useTimelineControls } from './TimelineContext'

interface CastProps {
  castInfo: CastInfo
  spell: SpellInfo
  Wowhead: React.ReactNode
  className?: string
  onDelete?: () => void
  isDragging?: boolean
  hasCollision?: boolean
  isChargeRow?: boolean
}

export default function Cast({
  castInfo,
  spell,
  Wowhead,
  className,
  onDelete,
  isDragging,
  hasCollision,
}: CastProps) {
  // Get pixelsPerSecond from the timeline context
  const { pixelsPerSecond } = useTimelineControls()

  const { start_s, end_s } = castInfo
  const { channel_duration, effect_duration, cooldown } = spell

  const total_duration_s = end_s - start_s

  const channelWidthPct = (channel_duration / total_duration_s) * 100
  const effectWidthPct = (effect_duration / total_duration_s) * 100
  const remainingCdWidthPct =
    ((cooldown - effect_duration - channel_duration) / total_duration_s) * 100

  // Find the maximum width percentage
  const maxWidthPct = Math.max(channelWidthPct, effectWidthPct, remainingCdWidthPct)

  // Determine which section should show Wowhead (first one in case of ties)
  const showWowheadInChannel = channelWidthPct === maxWidthPct
  const showWowheadInEffect = !showWowheadInChannel && effectWidthPct === maxWidthPct
  const showWowheadInRemaining =
    !showWowheadInChannel && !showWowheadInEffect && remainingCdWidthPct === maxWidthPct

  const wowheadWrapper = <div className="flex items-center justify-center px-1">{Wowhead}</div>

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
          width: `${channelWidthPct}%`,
          backgroundColor: hasCollision ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 152, 0, 0.5)',
        }}
      >
        {showWowheadInChannel && wowheadWrapper}
      </div>
      {/* Effect Duration Bar */}
      <div
        className="flex h-full items-center focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${effectWidthPct}%`,
          backgroundColor: hasCollision ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 152, 0, 0.2)',
        }}
      >
        {showWowheadInEffect && wowheadWrapper}
      </div>
      {/* Remaining Cooldown Bar */}
      <div
        className="flex h-full items-center focus-visible:outline-none focus-visible:ring-0"
        style={{
          width: `${remainingCdWidthPct}%`,
          backgroundColor: hasCollision ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
        }}
      >
        {showWowheadInRemaining && wowheadWrapper}
      </div>
    </div>
  )
}
