import React from 'react'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'
import { EventType, TimelineEvent } from '@/types/index'
import { useSettings } from '../Providers/SettingsProvider'

const colorFromType = (type: string) => {
  switch (type) {
    case EventType.ControlOfTheDream:
      return 'bg-red-400'
    case EventType.ChannelInterrupted:
      return 'bg-blue-400'
    case EventType.ChannelEnd:
      return 'bg-green-400'
    case EventType.CooldownEnd:
      return 'bg-yellow-400'
    case EventType.EffectEnd:
      return 'bg-purple-400'
    case EventType.GainCharge:
      return 'bg-orange-400'
    case EventType.CastStart:
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
}

const Marker = ({
  label,
  position,
  height,
  wowheadComponent,
  horizontalOffset = 0,
}: {
  label: string
  position: number
  height: number
  wowheadComponent?: React.ReactNode
  horizontalOffset?: number
}): React.ReactNode => {
  return (
    <div
      className="pointer-events-none relative top-0 z-10 flex h-full flex-row items-start"
      style={{ left: position }}
    >
      {/* Vertical marker line */}
      <div
        className={`absolute bottom-0 left-0 h-[87%] w-[2px] ${colorFromType(label)} opacity-30`}
      />

      {/* Label text - vertical orientation on right side of marker */}
      <div
        className="writing-mode-vertical-rl absolute bottom-0 flex h-[87%] items-center text-xs text-white"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          textShadow: '0px 0px 2px rgba(0, 0, 0, 0.8)',
          left: `${1 + horizontalOffset}px`,
        }}
      >
        {label}
      </div>

      {/* Wowhead icon below the time label */}
      {wowheadComponent && (
        <span className="absolute -left-[0px] z-20 h-10 w-10 transform" style={{ top: height }}>
          {wowheadComponent}
        </span>
      )}
    </div>
  )
}
interface EventMarkerProps {
  eventInfo: TimelineEvent<EventType>[]
}

/**
 * Markers: evenly spaced vertical lines and labels across the timeline.
 * Markers are generated dynamically based on marker_spacing_s until reaching total_length_s.
 */
const EventMarkers: React.FC<EventMarkerProps> = ({ eventInfo }) => {
  // Get timeToPixels function from context
  const { timeToPixels, total_length_s } = useTimelineControls()

  const { showEventMarkers } = useSettings()

  // Group events by their pixel positions
  const eventsByPosition = eventInfo.reduce(
    (acc, event) => {
      const pixelPosition = timeToPixels(event.time)
      if (!acc[pixelPosition]) {
        acc[pixelPosition] = []
      }
      acc[pixelPosition].push(event)
      return acc
    },
    {} as Record<number, TimelineEvent<EventType>[]>
  )

  return (
    <div
      className={`pointer-events-none absolute top-0 left-0 z-10 flex h-full pl-6`}
      style={{ width: timeToPixels(total_length_s) }}
    >
      {showEventMarkers &&
        Object.entries(eventsByPosition).flatMap(([position, events]) =>
          events.map((event, i) => (
            <Marker
              key={`event-${position}-${i}`}
              position={parseInt(position)}
              label={event.type === EventType.DreamstateCdr ? '' : event.type}
              height={21}
              horizontalOffset={i * 15}
            />
          ))
        )}
    </div>
  )
}

export default EventMarkers
