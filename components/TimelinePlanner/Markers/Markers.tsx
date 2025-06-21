import React, { useEffect, useState } from 'react'
import { useSettings } from '../Providers/SettingsProvider'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'

interface MarkerProps {
  label: number
  width: number
}

const Marker: React.FC<MarkerProps> = ({ label, width }) => {
  const { timestampFormat } = useSettings()

  const formatTimestamp = (seconds: number) => {
    if (timestampFormat === 'minutes') {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${seconds % 1 === 0 ? seconds : seconds.toFixed(0)}s`
  }

  const label_processed = formatTimestamp(label)
  const label_length = label_processed.toString().length
  const left =
    label_length > 4 ? 12 : label_length > 3 ? 10 : label_length > 2 ? 8 : label_length > 1 ? 6 : 4

  return (
    <div
      className="pointer-events-none relative top-0 z-10 flex h-full flex-row items-start"
      style={{ width: width }}
    >
      {label != 0 && (
        <>
          <div
            className="absolute h-[85%] w-px bg-gray-400/10 opacity-50"
            style={{ left: -(width / 2), bottom: 0 }}
          />
          <span
            className="absolute top-1 z-20 py-0 text-[0.5rem] whitespace-nowrap text-gray-500"
            style={{ left: -(width / 2) - 4 }}
          ></span>
        </>
      )}
      {/* Vertical marker line */}
      <div className="absolute bottom-0 left-0 h-[90%] w-px bg-gray-400/30 opacity-30" />
      {/* Timestamp label  */}
      <span
        className="absolute top-0 z-20 py-0 text-xs whitespace-nowrap text-gray-200"
        style={{ left: -left }}
      >
        {label_processed}
      </span>
    </div>
  )
}

interface MarkersProps {
  className?: string
}

/**
 * Markers: evenly spaced vertical lines and labels across the timeline.
 * Markers are generated dynamically based on marker_spacing_s until reaching total_length_s.
 */
const Markers: React.FC<MarkersProps> = React.memo(
  function Markers({ className = '' }) {
    const { total_length_s, pixelsPerSecond, marker_spacing_s } = useTimelineControls()

    const [effective_marker_spacing_s, setMarkerSpacing] = useState(marker_spacing_s)
    const [previousSize_px, setPreviousSize_px] = useState(0)

    const size_px = marker_spacing_s * pixelsPerSecond

    useEffect(() => {
      if (previousSize_px === 0) {
        setPreviousSize_px(size_px)
      } else if (size_px > previousSize_px * 1.25 && effective_marker_spacing_s > 5) {
        setMarkerSpacing((prev) => prev - 2.5)
        setPreviousSize_px(size_px)
      } else if (
        size_px < previousSize_px * 0.75 &&
        effective_marker_spacing_s < marker_spacing_s * 2
      ) {
        setMarkerSpacing((prev) => prev + 2.5)
        setPreviousSize_px(size_px)
      }
    }, [size_px, previousSize_px, effective_marker_spacing_s, marker_spacing_s])

    if (pixelsPerSecond === 0) return null

    const markerPositions: number[] = []
    for (let pos = 0; pos <= total_length_s; pos += effective_marker_spacing_s) {
      markerPositions.push(pos)
    }

    const numberOfMarkers = total_length_s / effective_marker_spacing_s

    return (
      <div
        className={`pointer-events-none absolute top-0 left-0 z-10 ml-6 flex h-full ${className}`}
        style={{
          width: `${(numberOfMarkers + 1) * effective_marker_spacing_s * pixelsPerSecond}px`,
        }}
      >
        {markerPositions.map((position, i) => (
          <Marker key={i} width={effective_marker_spacing_s * pixelsPerSecond} label={position} />
        ))}
      </div>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.className === nextProps.className
  }
)

export default Markers
