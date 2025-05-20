import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Cast, SpellInfo } from '../../lib/types/cd_planner'
import { useTimelineControls } from './TimelineContext'
import CastInterval from './CastInterval'

interface DraggableCastProps {
  idx: number
  id: string
  castInfo: Cast
  icon: React.ReactNode
  onClick?: () => void
  onDelete?: (castId: string) => void
  deltaSeconds?: number
}

const DraggableCast = ({ idx, id, castInfo, icon, onClick, onDelete }: DraggableCastProps) => {
  const { timeToPixels, total_length_px, total_length_s } = useTimelineControls()

  const cssId = `cast-${castInfo.spell.spellId}-${castInfo.current_charge}-${idx}`
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const [hasCollision, setHasCollision] = useState(false)

  const castInfoRef = useRef(castInfo)
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

  const modifiedTransform = transform
    ? {
        ...transform,
        y: 0, // Force y coordinate to always be 0
      }
    : null

  return (
    <div
      id={cssId}
      ref={setNodeRef}
      style={{
        left: `${timeToPixels(castInfo.start_s)}px`,
        width: `${cast_width_px + 1}px`, //I think the +1 is here because of the border but who knows
        zIndex: isDragging ? 20 : 10,
        opacity: isDragging ? 0.2 : 1,
      }}
      onClick={onClick}
      {...listeners}
      {...attributes}
      className="absolute focus:outline-hidden"
    >
      <CastInterval
        cast={castInfo}
        icon={icon}
        onDelete={onDelete}
        isDragging={isDragging}
        className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        hasCollision={true}
      />
    </div>
  )
}

export default DraggableCast
