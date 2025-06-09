import React, { useMemo } from 'react'
import { ChargeInterval } from '@/types/index'
import { useTimelineControls } from '../../Providers/TimelineLengthProvider'

interface ChargeCounterProps {
  maxCharges: number
  chargeIntervals: ChargeInterval[] | undefined
  className?: string
}

// Define interfaces for our processed segments
interface ProcessedSegment {
  start: number
  end: number
  charges: number
}

interface RenderSegment {
  start: number
  width: number
  opacity: number
  charges: number
}

export default function ChargeCounter({
  maxCharges,
  chargeIntervals,
  className,
}: ChargeCounterProps) {
  const { timeToPixels, total_length_px } = useTimelineControls()

  // Process charge intervals into segments with start, end, and charges count
  const segments = useMemo(() => {
    if (!chargeIntervals || chargeIntervals.length === 0) {
      return [] as ProcessedSegment[]
    }

    const groupedChanges = new Map<number, number>()

    chargeIntervals.forEach((interval) => {
      const instant = interval.instant
      const currentChange = groupedChanges.get(instant) || 0
      groupedChanges.set(instant, currentChange + interval.change)
    })

    // Filter out zero-sum changes at the same instant
    const filteredChanges = new Map<number, number>()
    groupedChanges.forEach((change, instant) => {
      if (change !== 0) {
        filteredChanges.set(instant, change)
      }
    })

    // Convert grouped changes back to sorted intervals
    const groupedIntervals = Array.from(filteredChanges.entries())
      .map(([instant, change]) => ({ instant, change }))
      .sort((a, b) => a.instant - b.instant)

    const processedSegments: ProcessedSegment[] = []

    // Add initial segment from 0 to first interval if there are any intervals
    if (groupedIntervals.length > 0) {
      processedSegments.push({
        start: -20,
        end: groupedIntervals[0].instant,
        charges: maxCharges,
      })
    }

    // Convert change-based intervals to segments with absolute charge counts
    let currentCharges = maxCharges

    for (let i = 0; i < groupedIntervals.length; i++) {
      const interval = groupedIntervals[i]
      const nextInterval = groupedIntervals[i + 1]

      currentCharges += interval.change

      // Create segment from this interval to the next one
      processedSegments.push({
        start: interval.instant,
        end: nextInterval ? nextInterval.instant : Infinity,
        charges: currentCharges,
      })
    }

    return processedSegments
  }, [chargeIntervals, maxCharges])

  // Find max number of charges across all segments
  const totalCharges = useMemo(() => {
    if (segments.length === 0) return maxCharges
    return Math.max(...segments.map((segment) => segment.charges), maxCharges)
  }, [segments, maxCharges])

  // Convert time-based segments to pixel-based segments for rendering
  const renderSegments = useMemo(() => {
    return segments.map((segment) => {
      const startPx = timeToPixels(segment.start)
      const endPx = segment.end === Infinity ? total_length_px : timeToPixels(segment.end)
      const width = endPx - startPx

      // Calculate opacity based on charges (0 charges = 0.2 opacity, total charges = 1.0 opacity)
      const opacity = 0.2 + (segment.charges / totalCharges) * 0.8

      return {
        start: startPx,
        width,
        opacity,
        charges: segment.charges,
      } as RenderSegment
    })
  }, [segments, timeToPixels, total_length_px, totalCharges])

  // Filter out segments that are too close to each other for label display
  const labelSegments = useMemo(() => {
    const MIN_SEGMENT_WIDTH_FOR_LABEL = 20 // Minimum width in pixels to show a label

    return renderSegments.filter((segment, index) => {
      // Always show the first segment
      if (index === 0) return true

      // For other segments, check if they have enough width
      return segment.width >= MIN_SEGMENT_WIDTH_FOR_LABEL
    })
  }, [renderSegments])

  if (!chargeIntervals || chargeIntervals.length === 0) {
    return null
  }

  return (
    <div className={`charges relative h-[18px] w-full ${className || ''}`}>
      {renderSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <div
            className="bg-main absolute top-1 h-[18px] transition-opacity"
            style={{
              left: `${segment.start}px`,
              width: `${segment.width}px`,
              opacity: segment.opacity,
            }}
          />
          {labelSegments.some((labelSegment) => labelSegment.start === segment.start) && (
            <>
              <div
                className="absolute top-[6px] text-xs text-white"
                style={{
                  left: `${segment.start + 3}px`,
                  zIndex: 10,
                }}
              >
                {segment.charges}
              </div>
              <div
                className="border-main absolute w-[2px]"
                style={{
                  left: `${segment.start - 1}px`,
                  top: '20px',
                  zIndex: 10,
                  height: 56 * (segment.charges - 2),
                }}
              />
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
