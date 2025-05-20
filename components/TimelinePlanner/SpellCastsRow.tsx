import React, { useState, useRef } from 'react'
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
import DraggableCast from './DraggableCast'
import { Cast, SPELL_GCD, SpellToRender, ChargeInterval } from '../../lib/types/cd_planner'
import { useTimelineControls } from './TimelineContext'
import CastInterval from './CastInterval'
import CooldownIndicator from './CooldownIndicator'
import { defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useHoverContext } from './HoverProvider'

// Function to find the maximum number of charges used at the same time
export const findMaxUsedCharges = (
  chargeIntervals: ChargeInterval[] | undefined,
  totalCharges: number
): number => {
  if (!chargeIntervals || chargeIntervals.length === 0) {
    return 0
  }

  const sortedIntervals = [...chargeIntervals].sort((a, b) => a.instant - b.instant)

  // Start with full charges and track the minimum
  let currentCharges = totalCharges
  let minCharges = totalCharges

  sortedIntervals.forEach((interval) => {
    currentCharges += interval.change // Subtract because negative change means using a charge
    minCharges = Math.min(minCharges, currentCharges)
  })

  // Return the maximum used charges (total - minimum available)
  return totalCharges - minCharges
}

interface SpellCastsRowProps {
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

export default function SpellCastsRow({
  spellTimeline,
  wowheadComponent,
  onCastDelete,
  onCastMove,
}: SpellCastsRowProps) {
  const { pixelsPerSecond } = useTimelineControls()
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeDraggedCast = activeDragId
    ? spellTimeline.casts.find((cast) => cast.id === activeDragId)
    : null

  const className = 'my-2 flex h-10 items-center'

  const { timeToPixels, pixelsToTime, total_length_s } = useTimelineControls()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // 1px of movement required before activating
      },
    })
  )

  const { changeHover, removeHover, setDelta } = useHoverContext()

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDragId(active.id as string)
    console.log('drag start', active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta, over } = event

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
          const newCast = Object.assign({}, cast, {
            start_s: proposedStartTime,
            end_s: proposedStartTime + cast.duration_s,
          })
          changeHover(newCast)
        }
      }
    }
    setActiveDragId(null)
  }

  const handleDrag = (event: DragEndEvent) => {
    const { delta: dragDelta, active } = event
    if (active) {
      const castId = active.id as string
      const cast = spellTimeline.casts.find((c) => c.id === castId)
      if (cast) {
        const newCast = Object.assign({}, cast, {
          start_s: cast.start_s + dragDelta.x / pixelsPerSecond,
          end_s: cast.end_s + dragDelta.x / pixelsPerSecond,
        })
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
            isDragging={true}
            isOverlay={true}
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
      <CooldownIndicator
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
