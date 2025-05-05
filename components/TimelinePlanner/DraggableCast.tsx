import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import Cast from './Cast'
import { CastInfo, SpellInfo } from './types'
import { useTimelineControls } from './TimelineContext'

interface DraggableCastProps {
  id: string
  castInfo: CastInfo
  spell: SpellInfo
  timeline_total_length_px: number
  total_length_s: number
  wowheadComponent: React.ReactNode
  onClick?: () => void
  onDelete?: () => void
  otherCasts?: (CastInfo & { id?: string })[]
  isChargeRow?: boolean
}

export default function DraggableCast({
  id,
  castInfo,
  spell,
  timeline_total_length_px,
  total_length_s,
  wowheadComponent,
  onClick,
  onDelete,
  otherCasts = [],
  isChargeRow = false,
}: DraggableCastProps) {
  // Get timeToPixels and pixelsToTime helpers from context
  const { timeToPixels, pixelsToTime } = useTimelineControls()

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const [hasCollision, setHasCollision] = useState(false)

  // Store values in refs to avoid dependency issues and race conditions
  const castInfoRef = useRef(castInfo)
  const otherCastsRef = useRef(otherCasts)
  const transformRef = useRef(transform)
  const isDraggingRef = useRef(isDragging)
  const hasCollisionRef = useRef(hasCollision)
  const timelineTotalLengthPxRef = useRef(timeline_total_length_px)
  const totalLengthSRef = useRef(total_length_s)

  const cast_duration_s = castInfo.end_s - castInfo.start_s
  const cast_width_px = timeToPixels(cast_duration_s)

  // Keep refs updated with latest props
  useEffect(() => {
    castInfoRef.current = castInfo
    otherCastsRef.current = otherCasts
    timelineTotalLengthPxRef.current = timeline_total_length_px
    totalLengthSRef.current = total_length_s
  }, [castInfo, otherCasts, timeline_total_length_px, total_length_s])

  // Create a modified transform that only includes the x-coordinate
  const modifiedTransform = transform
    ? {
        ...transform,
        y: 0, // Force y coordinate to always be 0
      }
    : null

  // Memoize the checkCollision function
  const checkCollision = useCallback(() => {
    const currentTransform = transformRef.current
    if (!currentTransform || !isDraggingRef.current || otherCastsRef.current.length === 0) {
      return false
    }

    // Function to check if two time ranges overlap
    const checkOverlap = (startA, endA, startB, endB) => {
      return startA < endB && endA > startB
    }

    const currentCastInfo = castInfoRef.current

    // Calculate the dragged position in seconds
    const deltaSeconds = pixelsToTime(currentTransform.x)

    // Current position in seconds
    const currentStartS = Math.max(
      0,
      Math.min(
        totalLengthSRef.current - (currentCastInfo.end_s - currentCastInfo.start_s),
        currentCastInfo.start_s + deltaSeconds
      )
    )
    const currentEndS = currentStartS + (currentCastInfo.end_s - currentCastInfo.start_s)

    // Check for collisions with other casts
    for (const otherCast of otherCastsRef.current) {
      if (
        otherCast.id !== id &&
        checkOverlap(currentStartS, currentEndS, otherCast.start_s, otherCast.end_s)
      ) {
        return true
      }
    }

    return false
  }, [id, pixelsToTime])

  // Update state based on refs - uses useLayoutEffect for synchronous update before paint
  useLayoutEffect(() => {
    isDraggingRef.current = isDragging
    transformRef.current = modifiedTransform

    // Skip calculations if not dragging or no transform
    if (!isDragging) {
      if (hasCollisionRef.current) {
        hasCollisionRef.current = false
        setHasCollision(false)
      }
      return
    }

    // Only run collision check if we're actually dragging
    if (isDragging && modifiedTransform) {
      const newCollisionState = checkCollision()

      // Only update state if the collision state has changed
      if (hasCollisionRef.current !== newCollisionState) {
        hasCollisionRef.current = newCollisionState
        setHasCollision(newCollisionState)
      }
    }
  }, [isDragging, modifiedTransform, checkCollision])

  const style = {
    position: 'absolute' as const,
    left: `${timeToPixels(castInfo.start_s)}px`,
    width: `${cast_width_px}px`,
    top: 8,
    zIndex: isDragging ? 100 : 50,
    opacity: isDragging ? 0.2 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      {...listeners}
      {...attributes}
      className="focus:outline-none focus-visible:outline-none focus-visible:ring-0"
    >
      <Cast
        castInfo={castInfo}
        spell={spell}
        Wowhead={wowheadComponent}
        onDelete={onDelete}
        className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${hasCollision ? '' : ''}`}
        isDragging={isDragging}
        hasCollision={hasCollision}
        isChargeRow={isChargeRow}
      />
    </div>
  )
}
