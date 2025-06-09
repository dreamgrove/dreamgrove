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
import DraggableCast from '../../Cast/DraggableCast'
import { SPELL_GCD, SpellToRender } from '@/types/index'
import { Cast } from '@/models/Cast'
import { useTimelineControls } from '../../Providers/TimelineLengthProvider'
import CastInterval from '../../Cast/CastInterval'
import ChargesCounter from './ChargeCounter'
import { useHoverContext } from '../../Providers/HoverProvider'

interface SpellRowProps {
  wowheadComponent: React.ReactNode
  onCastDelete?: (castId: string) => void
  onCastMove?: (castId: string, newStartTime: number, newCharge?: number) => void
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

export default function SpellRow({
  spellTimeline,
  wowheadComponent,
  onCastDelete,
  onCastMove,
}: SpellRowProps) {
  const { pixelsPerSecond } = useTimelineControls()
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeDraggedCast = activeDragId
    ? spellTimeline.casts.find((cast) => cast.id === activeDragId)
    : null

  const className = 'my-2 flex h-10 items-center'

  const { timeToPixels, pixelsToTime, total_length_s } = useTimelineControls()

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

      if (cast && onCastMove) {
        const deltaSeconds = delta.x / pixelsPerSecond
        const proposedStartTime = Math.max(
          0,
          Math.min(total_length_s - SPELL_GCD, cast.start_s + deltaSeconds)
        )

        if (proposedStartTime !== cast.start_s) {
          onCastMove(castId, proposedStartTime)
          const newCast = new Cast({
            id: cast.id,
            spell: cast.spell,
            start_s: proposedStartTime,
            interrupting_cast: cast.interrupting_cast,
            current_charge: cast.current_charge,
            cooldown_delay_s: cast.cooldown_delay_s,
          })
          newCast.is_interruped = cast.is_interruped
          changeHover(newCast)
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
      if (cast) {
        const newCast = new Cast({
          id: cast.id,
          spell: cast.spell,
          start_s: cast.start_s + dragDelta.x / pixelsPerSecond,
          interrupting_cast: cast.interrupting_cast,
          current_charge: cast.current_charge,
          cooldown_delay_s: cast.cooldown_delay_s,
          cooldown_duration: cast.cooldown_duration,
        })
        newCast.is_interruped = cast.is_interruped
        newCast._ef_end_s = cast._ef_end_s
        if (Math.abs(dragDelta.x) >= 1) {
          changeHover(newCast)
        }
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
        <RowMultipleCharges
          spellTimeline={spellTimeline}
          wowheadComponent={wowheadComponent}
          onCastDelete={onCastDelete}
          className={className}
        />
      ) : (
        <RowSingleCharge
          spellTimeline={spellTimeline}
          wowheadComponent={wowheadComponent}
          onCastDelete={onCastDelete}
          className={className}
        />
      )}

      <DragOverlay dropAnimation={null}>
        {activeDraggedCast && activeDragId && (
          <CastInterval
            cast={activeDraggedCast}
            icon={wowheadComponent}
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
  wowheadComponent,
  onCastDelete,
  className,
}: {
  spellTimeline: SpellToRender
  wowheadComponent: React.ReactNode
  onCastDelete?: (castId: string) => void
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
          icon={wowheadComponent}
          onDelete={onCastDelete}
        />
      ))}
    </div>
  )
}

const RowMultipleCharges = ({
  spellTimeline,
  wowheadComponent,
  onCastDelete,
  className,
}: {
  spellTimeline: SpellToRender
  wowheadComponent: React.ReactNode
  onCastDelete?: (castId: string) => void
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
          icon={wowheadComponent}
          onDelete={cast.id && onCastDelete ? () => onCastDelete(cast.id!) : undefined}
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

const splitCastsByCharges = (casts: Cast[], charges: number): Cast[][] => {
  if (!charges || charges <= 1) {
    return [casts]
  }

  const castsByCharge: Cast[][] = Array.from({ length: charges }, () => [])
  const sortedCasts = [...casts].sort((a, b) => a.start_s - b.start_s)

  // Distribute casts in round-robin fashion
  sortedCasts.forEach((cast, index) => {
    const chargeIndex = index % charges
    castsByCharge[chargeIndex].push(cast)
  })

  return castsByCharge
}
