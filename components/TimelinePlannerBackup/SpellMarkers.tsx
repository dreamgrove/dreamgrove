import React, { useEffect, useState } from 'react'
import { useTimelineControls } from './TimelineContext'

const Marker = ({
  label,
  position,
  height,
  wowheadComponent,
}: {
  label: number
  position: number
  height: number
  wowheadComponent?: React.ReactNode
}): React.ReactNode => {
  return (
    <div
      className="pointer-events-none relative top-0 z-10 flex h-full flex-row items-start"
      style={{ left: position }}
    >
      {/* Vertical marker line */}
      <div className="absolute bottom-0 left-0 h-[87%] w-[2px] bg-red-400 opacity-30" />

      {/* Wowhead icon below the time label */}
      {wowheadComponent && (
        <span className="absolute left-[0px] z-20 h-10 w-10 transform" style={{ top: height }}>
          {wowheadComponent}
        </span>
      )}
    </div>
  )
}
interface SpellMarkerProps {
  spellInfo: Record<string, number[]>
  wowheadMap?: Record<string, React.ReactNode>
}

/**
 * Markers: evenly spaced vertical lines and labels across the timeline.
 * Markers are generated dynamically based on marker_spacing_s until reaching total_length_s.
 */
const SpellMarkers: React.FC<SpellMarkerProps> = ({ spellInfo, wowheadMap = {} }) => {
  // Get timeToPixels function from context
  const { timeToPixels } = useTimelineControls()

  const gg_timestamps = spellInfo['gg'] || []
  const convoke_timestamps = spellInfo['flourish'] || []
  const fon_timestamps = spellInfo['tranq'] || []

  return (
    <div
      className={`pointer-events-none absolute left-0 top-0 z-10 ml-6 flex h-full`}
      style={{ width: 6000 }}
    >
      {gg_timestamps.map((timestamp, i) => (
        <Marker
          key={`gg-${i}`}
          position={timeToPixels(timestamp)}
          label={timestamp}
          wowheadComponent={wowheadMap['gg']}
          height={21}
        />
      ))}
      {convoke_timestamps.map((timestamp, i) => (
        <Marker
          key={`flourish-${i}`}
          position={timeToPixels(timestamp)}
          label={timestamp}
          wowheadComponent={wowheadMap['flourish']}
          height={21}
        />
      ))}
      {fon_timestamps.map((timestamp, i) => (
        <Marker
          key={`tranq-${i}`}
          position={timeToPixels(timestamp)}
          label={timestamp}
          wowheadComponent={wowheadMap['tranq']}
          height={21}
        />
      ))}
    </div>
  )
}

export default SpellMarkers
