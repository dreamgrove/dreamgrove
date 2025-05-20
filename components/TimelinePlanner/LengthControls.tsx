import React, { useState, useEffect } from 'react'
import styles from './TimelinePlanner.module.css'

interface LengthControlsProps {
  total_length_s?: number
  setTotalLength?: (length: number) => void
  n_markers_per_view?: number
  setMarkersPerView?: (markers: number) => void
  view_length_s?: number
  setViewLength?: (length: number) => void
}

export default function LengthControls({
  total_length_s = 240,
  setTotalLength = () => {},
  n_markers_per_view = 4,
  setMarkersPerView = () => {},
  view_length_s = 60,
  setViewLength = () => {},
}: LengthControlsProps) {
  // Calculate minutes and seconds from total seconds
  const [minutes, setMinutes] = useState(Math.floor(total_length_s / 60))
  const [seconds, setSeconds] = useState(total_length_s % 60)

  // Zoom state - combined markers and view length
  const [zoomLevel, setZoomLevel] = useState(1)

  // Calculate zoom level based on initial props
  useEffect(() => {
    // Base zoom level calculation - normalize around the default values
    const markerRatio = n_markers_per_view / 4 // 4 is the default marker count
    const viewRatio = 60 / view_length_s // 60 is the default view length

    // Zoom is an average of both ratios - higher means more zoomed in
    const calculatedZoom = (markerRatio + viewRatio) / 2
    setZoomLevel(calculatedZoom)
  }, [])

  useEffect(() => {
    setMinutes(Math.floor(total_length_s / 60))
    setSeconds(total_length_s % 60)
  }, [total_length_s])

  // Handler for updating the timeline length
  const handleSetLength = () => {
    // Calculate total seconds, ensuring valid values
    const validMinutes = Math.max(0, minutes)
    const validSeconds = Math.max(0, Math.min(59, seconds))
    const totalSeconds = validMinutes * 60 + validSeconds

    // Ensure we don't set a length of 0
    if (totalSeconds > 0) {
      setTotalLength(totalSeconds)
    }
  }

  // Zoom levels constants
  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 2
  const ZOOM_STEP = 0.25

  // Zoom in/out handlers - affects both markers and view length
  const handleZoomIn = () => {
    if (zoomLevel < MAX_ZOOM) {
      const newZoomLevel = Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP)
      setZoomLevel(newZoomLevel)

      // Update markers - more markers when zoomed in
      const newMarkers = Math.max(2, Math.min(10, Math.round(4 * newZoomLevel)))
      setMarkersPerView(newMarkers)

      // Update view length - less time shown when zoomed in
      const newViewLength = Math.round(60 / newZoomLevel)
      setViewLength(newViewLength)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > MIN_ZOOM) {
      const newZoomLevel = Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP)
      setZoomLevel(newZoomLevel)

      // Update markers - fewer markers when zoomed out
      const newMarkers = Math.max(2, Math.min(10, Math.round(4 * newZoomLevel)))
      setMarkersPerView(newMarkers)

      // Update view length - more time shown when zoomed out
      const newViewLength = Math.round(60 / newZoomLevel)
      setViewLength(newViewLength)
    }
  }

  return (
    <div className={styles.timelineLengthControls}>
      <div className={styles.lengthSection}>
        <span className={styles.controlLabel}>Timeline Length:</span>
        <div className={styles.inputGroup}>
          <label>
            Minutes:
            <input
              type="number"
              min={0}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>
          <label>
            Seconds:
            <input
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
            />
          </label>
          <button className={styles.setLengthButton} onClick={handleSetLength}>
            Apply
          </button>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.zoomControls}>
        <span className={styles.controlLabel}>Zoom:</span>
        <button
          className={styles.zoomButton}
          onClick={handleZoomOut}
          disabled={zoomLevel <= MIN_ZOOM}
          title="Zoom out (show more time)"
        >
          -
        </button>
        <span title={`Zoom level: ${zoomLevel.toFixed(2)}`}>
          {n_markers_per_view} markers / {view_length_s}s
        </span>
        <button
          className={styles.zoomButton}
          onClick={handleZoomIn}
          disabled={zoomLevel >= MAX_ZOOM}
          title="Zoom in (show less time)"
        >
          +
        </button>
      </div>
    </div>
  )
}
