import React from 'react'

// TypeScript interface for cast info
export interface CastInfo {
  start_s: number
  end_s: number
  channel_duration_s: number
  effect_duration_s: number
  spell_cooldown_s: number
  timeline_total_length_px: number
  total_length_s: number
}

interface CastProps {
  castInfo: CastInfo
  Wowhead: React.ReactNode
  className?: string
  onDelete?: () => void
}

export default function Cast({ castInfo, Wowhead, className, onDelete }: CastProps) {
  const {
    start_s,
    end_s,
    channel_duration_s,
    effect_duration_s,
    spell_cooldown_s,
    timeline_total_length_px,
    total_length_s,
  } = castInfo

  const total_duration_s = spell_cooldown_s

  console.log(total_duration_s, total_length_s, timeline_total_length_px)

  // First we calculate the spell width in px based on the duration of the spell
  const spell_width_px = (total_duration_s / total_length_s) * timeline_total_length_px

  // Calculate widths as percentages of total duration
  const channelWidthPct = (channel_duration_s / total_duration_s) * 100
  const channelWidthPx = (channelWidthPct / 100) * spell_width_px
  const effectWidthPct = (effect_duration_s / total_duration_s) * 100
  const effectWidthPx = (effectWidthPct / 100) * spell_width_px
  const remainingCdWidthPct =
    ((spell_cooldown_s - effect_duration_s - channel_duration_s) / total_duration_s) * 100
  const remainingCdWidthPx = (remainingCdWidthPct / 100) * spell_width_px

  // Find the maximum width percentage
  const maxWidthPct = Math.max(channelWidthPct, effectWidthPct, remainingCdWidthPct)

  // Determine which section should show Wowhead (first one in case of ties)
  const showWowheadInChannel = channelWidthPct === maxWidthPct
  const showWowheadInEffect = !showWowheadInChannel && effectWidthPct === maxWidthPct
  const showWowheadInRemaining =
    !showWowheadInChannel && !showWowheadInEffect && remainingCdWidthPct === maxWidthPct

  const wowheadWrapper = <div className="px-2">{Wowhead}</div>

  return (
    <div
      className={`relative flex h-8 rounded-md border border-white/20 bg-black/30 ${className || ''}`}
      style={{ width: `${spell_width_px}px` }}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600 focus:outline-none"
          title="Remove cast"
        >
          ×
        </button>
      )}

      {/* Channel Duration Bar */}
      <div
        className="h-full rounded-l-md"
        style={{
          width: `${channelWidthPx}px`,
          backgroundColor: 'rgba(255, 152, 0, 0.5)',
        }}
      >
        {showWowheadInChannel && wowheadWrapper}
      </div>
      {/* Effect Duration Bar */}
      <div
        className="flex h-full items-center"
        style={{
          width: `${effectWidthPx}px`,
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
        }}
      >
        {showWowheadInEffect && wowheadWrapper}
      </div>
      {/* Remaining Cooldown Bar */}
      <div
        className="flex h-full items-center"
        style={{
          width: `${remainingCdWidthPx}px`,
        }}
      >
        {showWowheadInRemaining && wowheadWrapper}
      </div>
    </div>
  )
}
