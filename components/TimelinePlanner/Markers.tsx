import React from 'react'

interface MarkerProps {
  label: number
}

const Marker: React.FC<MarkerProps> = ({ label }) => {
  return (
    <div className="pointer-events-none relative top-0 z-10 flex h-full flex-row items-start">
      {/* Vertical marker line */}
      <div className="h-full w-[1px] bg-gray-400" />
      {/* Seconds label to the right of the marker, at the top */}
      <span className="absolute left-[1px] top-0 z-20 whitespace-nowrap rounded bg-white/70 py-0 text-xs text-gray-500">
        {label % 1 === 0 ? label : label.toFixed(2)}s
      </span>
    </div>
  )
}

interface MarkersProps {
  total_markers: number
  marker_spacing_px: number
  marker_spacing_s: number
  total_length_s: number
  className?: string
}

/**
 * Markers: evenly spaced vertical lines and labels across the timeline.
 * The number of markers is marker_count * (total_length / width_seconds), rounded.
 * The last marker is always at total_length.
 */
const Markers: React.FC<MarkersProps> = ({
  total_markers,
  marker_spacing_px,
  marker_spacing_s,
  total_length_s,
  className = '',
}) => {
  const isDebug = true
  if (isDebug) {
    console.log('total_markers', total_markers)
    console.log('marker_spacing_px', marker_spacing_px)
    console.log('marker_spacing_s', marker_spacing_s)
    console.log('total_length_s', total_length_s)
  }
  return (
    <div
      className={`pointer-events-none absolute left-0 top-0 z-10 flex h-full w-full ${className}`}
      style={{ gap: `${marker_spacing_px - 1}px` }}
    >
      {Array.from({ length: total_markers }, (_, i) => (
        <Marker key={i} label={marker_spacing_s * i} />
      ))}
      <Marker key={total_markers} label={total_length_s} />
    </div>
  )
}

export default Markers
