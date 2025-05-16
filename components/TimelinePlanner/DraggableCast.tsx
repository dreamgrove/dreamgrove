import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Cast, SpellInfo } from './types'
import { useTimelineControls } from './TimelineContext'
import CastInterval from './CastInterval'

interface DraggableCastProps {
  id: string
  castInfo: Cast
  icon: React.ReactNode
  onClick?: () => void
  onDelete?: () => void
}

export default function DraggableCast({
  id,
  castInfo,
  icon,
  onClick,
  onDelete,
}: DraggableCastProps) {
  const { timeToPixels, pixelsToTime, total_length_px, total_length_s } = useTimelineControls()

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const [hasCollision, setHasCollision] = useState(false)

  // Store values in refs to avoid dependency issues and race conditions
  const castInfoRef = useRef(castInfo)
  const transformRef = useRef(transform)
  const isDraggingRef = useRef(isDragging)
  const hasCollisionRef = useRef(hasCollision)
  const timelineTotalLengthPxRef = useRef(total_length_px)
  const totalLengthSRef = useRef(total_length_s)

  const cast_duration_s = castInfo.duration_s
  const cast_width_px = timeToPixels(cast_duration_s)

  // Keep refs updated with latest props
  useEffect(() => {
    castInfoRef.current = castInfo
    timelineTotalLengthPxRef.current = total_length_px
    totalLengthSRef.current = total_length_s
  }, [castInfo, total_length_px, total_length_s])

  // Create a modified transform that only includes the x-coordinate
  const modifiedTransform = transform
    ? {
        ...transform,
        y: 0, // Force y coordinate to always be 0
      }
    : null

  // Update state based on refs - uses useLayoutEffect for synchronous update before paint
  useLayoutEffect(() => {
    isDraggingRef.current = isDragging
    transformRef.current = modifiedTransform

    if (!isDragging) {
      if (hasCollisionRef.current) {
        hasCollisionRef.current = false
        setHasCollision(false)
      }
      return
    }
  }, [isDragging, modifiedTransform])

  const style = {
    position: 'relative' as const,
    left: `${timeToPixels(castInfo.start_s)}px`,
    width: `${cast_width_px}px`,
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
      <CastInterval
        cast={castInfo}
        icon={icon}
        className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${hasCollision ? '' : ''}`}
        isDragging={isDragging}
        hasCollision={hasCollision}
      />
    </div>
  )
}
