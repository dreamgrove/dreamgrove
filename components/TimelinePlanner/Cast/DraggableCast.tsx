import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Cast } from '@/models/Cast'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'
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
  const { timeToPixels } = useTimelineControls()

  const cssId = `cast-${castInfo.spell.spellId}-${castInfo.current_charge}-${idx}`
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  })

  const cast_duration_s = castInfo.duration_s
  const cast_width_px = timeToPixels(cast_duration_s)

  return (
    <div
      id={cssId}
      ref={setNodeRef}
      style={{
        left: `${timeToPixels(castInfo.start_s)}px`,
        width: cast_width_px,
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
        isOverlay={false}
        isDragging={isDragging}
        className={`${isDragging ? 'cursor-grabbing' : 'cursor-move'}`}
        hasCollision={true}
      />
    </div>
  )
}

export default DraggableCast
