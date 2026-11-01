import React, { useState, useRef, useEffect } from 'react'
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DndContextProps,
  useDroppable,
} from '@dnd-kit/core'
import DraggableCast from '@/components/TimelinePlanner/Cast/DraggableCast'
import { SPELL_GCD, SpellToRender } from '@/types/index'
import { useTimelineScale } from '@/components/TimelinePlanner/Providers/TimelineLengthProvider'
import CastInterval from '@/components/TimelinePlanner/Cast/CastInterval'
import ChargesCounter from './ChargeCounter'
import { useHoverContext } from '@/components/TimelinePlanner/Providers/HoverProvider'
import { useTimelineContext } from '@/components/TimelinePlanner/TimelineProvider/useTimelineContext'
import { splitCastsByCharges } from '@/lib/timeline_events/splitCastsByCharges'

interface SpellRowProps {
  className?: string
  spellTimeline: SpellToRender
}

function DroppableChargeRow({
  id,
  children,
  className,
}: {
  id: string
  children: React.ReactNode
  className: string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      id={id}
      className={`w-full ${className} charge-row ${isOver ? 'bg-blue-100/10' : ''}`}
    >
      {children}
    </div>
  )
}

export default function SpellRow({ spellTimeline }: SpellRowProps) {
  const { handleCastMove } = useTimelineContext()
  const { pixelsPerSecond, timeToPixels, pixelsToTime, total_length_s } = useTimelineScale()
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeDraggedCast = activeDragId
    ? spellTimeline.casts.find((cast) => cast.id === activeDragId)
    : null

  const className = 'my-2 flex h-10 items-center'

  const { changeHover, setIsDragging, removeHover, isHovering, isDragging, rectRef, setDraggedId } =
    useHoverContext()

  useEffect(() => {
    if (activeDraggedCast && !isDragging) {
      changeHover(activeDraggedCast)
    }
  }, [activeDragId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // 1px of movement required before activating
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDragId(active.id as string)
    setDraggedId(active.id as string)
    setIsDragging(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event

    if (active) {
      const castId = active.id as string
      const cast = spellTimeline.casts.find((c) => c.id === castId)

      if (cast && handleCastMove) {
        const deltaSeconds = delta.x / pixelsPerSecond
        const proposedStartTime = Math.max(
          0,
          Math.min(total_length_s - SPELL_GCD, cast.start_s + deltaSeconds)
        )

        if (proposedStartTime !== cast.start_s) {
          handleCastMove(castId, proposedStartTime)
          changeHover(cast.withStart(proposedStartTime))
        }
      }
    }

    if (isHovering) {
      removeHover()
    }
    if (rectRef) {
      rectRef.current = null
    }
    setIsDragging(false)
    setActiveDragId(null)
    setDraggedId('')
  }

  const handleDrag = (event: DragEndEvent) => {
    const { delta: dragDelta, active } = event
    if (active) {
      const castId = active.id as string
      const cast = spellTimeline.casts.find((c) => c.id === castId)
      if (cast && Math.abs(dragDelta.x) >= 1) {
        changeHover(cast.withStart(cast.start_s + dragDelta.x / pixelsPerSecond))
      }
    }
  }

  const modifiers: DndContextProps['modifiers'] = [
    // Restrict to horizontal movement only
    ({ transform }) => {
      return {
        ...transform,
        y: spellTimeline.spell.charges < 2 ? 0 : transform.y,
      }
    },
    ({ transform }) => {
      if (!activeDragId) return transform

      const activeCast = spellTimeline.casts.find((c) => c.id === activeDragId)
      if (!activeCast) return transform

      const currentPositionSeconds = activeCast.start_s
      const dragDeltaSeconds = pixelsToTime(transform.x)

      const proposedPositionSeconds = currentPositionSeconds + dragDeltaSeconds

      const adjustedDeltaPixels = timeToPixels(proposedPositionSeconds - currentPositionSeconds)

      return {
        ...transform,
        x: adjustedDeltaPixels,
      }
    },
  ]

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDrag}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {spellTimeline.spell.charges > 1 ? (
        <RowMultipleCharges spellTimeline={spellTimeline} className={className} />
      ) : (
        <RowSingleCharge spellTimeline={spellTimeline} className={className} />
      )}

      <DragOverlay dropAnimation={null}>
        {activeDraggedCast && activeDragId && (
          <CastInterval
            cast={activeDraggedCast}
            isOverlay={true}
            isDragging={true}
            className="cursor-grabbing"
            hasCollision={false}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

const RowSingleCharge = ({
  spellTimeline,
  className,
}: {
  spellTimeline: SpellToRender
  className: string
}) => {
  return (
    <div id={`timeline-row-${spellTimeline.spell.spellId}`} className={`w-full ${className}`}>
      {spellTimeline.casts.map((cast, index) => (
        <DraggableCast
          key={cast.id || `cast-${index}`}
          idx={index}
          id={cast.id || `cast-${index}`}
          castInfo={cast}
        />
      ))}
    </div>
  )
}

const RowMultipleCharges = ({
  spellTimeline,
  className,
}: {
  spellTimeline: SpellToRender
  className: string
}) => {
  const maxUsedCharges = spellTimeline.chargesUsed
  const castsByCharge = splitCastsByCharges(spellTimeline.casts, maxUsedCharges)

  const chargeRows = castsByCharge.map((chargeCasts, chargeIndex) => (
    <DroppableChargeRow
      key={`charge-${chargeIndex}`}
      id={`charge-${chargeIndex}`}
      className={className}
    >
      {chargeCasts.map((cast, index) => (
        <DraggableCast
          idx={index}
          key={cast.id || `cast-${chargeIndex}-${index}`}
          id={cast.id || `cast-${chargeIndex}-${index}`}
          castInfo={cast}
        />
      ))}
    </DroppableChargeRow>
  ))

  return (
    <div id={`timeline-row-${spellTimeline.spell.spellId}`}>
      <ChargesCounter
        maxCharges={spellTimeline.spell.charges}
        chargeIntervals={spellTimeline.chargeIntervals}
      />
      {chargeRows}
    </div>
  )
}
