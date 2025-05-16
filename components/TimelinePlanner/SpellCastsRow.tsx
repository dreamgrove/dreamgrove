import React, { useState, useEffect } from 'react'
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
import { Cast, SPELL_GCD, SpellToRender, TimelineToRender, ChargeInterval } from './types'
import { useTimelineControls } from './TimelineContext'
import CastInterval from './CastInterval'
import CooldownIndicator from './CooldownIndicator'

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
  className?: string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      id={id}
      className={`relative w-full ${className || ''} charge-row ${isOver ? 'bg-blue-100/10' : ''}`}
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
  className,
}: SpellCastsRowProps) {
  const { pixelsPerSecond } = useTimelineControls()
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeDraggedCast = activeDragId
    ? spellTimeline.casts.find((cast) => cast.id === activeDragId)
    : null

  const { timeToPixels, pixelsToTime, total_length_s, total_length_px } = useTimelineControls()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px of movement required before activating
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDragId(active.id as string)
  }

  const checkOverlap = (current: Cast, other: Cast): boolean => {
    return current.start_s < other.end_s && current.end_s > other.start_s
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

        // If we have a valid over target and it's a charge row, update the row
        // This will change the order of casts in the sorted array, effectively changing its row
        let newChargeRow: number | undefined
        if (over && over.id.toString().startsWith('charge-')) {
          const targetRow = parseInt(over.id.toString().split('-')[1])
          if (!isNaN(targetRow) && targetRow >= 0 && targetRow < spellTimeline.spell.charges) {
            newChargeRow = targetRow
          }
        }

        if (proposedStartTime !== cast.start_s || newChargeRow !== undefined) {
          onCastMove(castId, proposedStartTime, newChargeRow)
        }
      }
    }
    setActiveDragId(null)
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

  const maxUsedCharges = spellTimeline.chargesUsed

  const castsByCharge = splitCastsByCharges(spellTimeline.casts, maxUsedCharges)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      <div className="relative pt-4">
        {spellTimeline.spell.charges > 1 && (
          <CooldownIndicator
            maxCharges={spellTimeline.spell.charges}
            chargeIntervals={spellTimeline.chargeIntervals}
            className={className}
          />
        )}
        {spellTimeline.spell.charges > 1 ? (
          castsByCharge.map((chargeCasts, chargeIndex) => (
            <DroppableChargeRow
              key={`charge-${chargeIndex}`}
              id={`charge-${chargeIndex}`}
              className={className}
            >
              {chargeCasts.map((cast, index) => (
                <DraggableCast
                  key={cast.id || `cast-${chargeIndex}-${index}`}
                  id={cast.id || `cast-${chargeIndex}-${index}`}
                  castInfo={cast}
                  icon={wowheadComponent}
                  onDelete={cast.id && onCastDelete ? () => onCastDelete(cast.id!) : undefined}
                />
              ))}
            </DroppableChargeRow>
          ))
        ) : (
          <>
            <div className={`relative w-full ${className || ''} charge-row`}>
              {spellTimeline.casts.map((cast, index) => (
                <DraggableCast
                  key={cast.id || `cast-${index}`}
                  id={cast.id || `cast-${index}`}
                  castInfo={cast}
                  icon={wowheadComponent}
                  onDelete={cast.id && onCastDelete ? () => onCastDelete(cast.id!) : undefined}
                />
              ))}
            </div>
          </>
        )}

        <DragOverlay dropAnimation={null}>
          {activeDragId && activeDraggedCast && (
            <CastInterval
              cast={activeDraggedCast}
              icon={wowheadComponent}
              isDragging={true}
              className="cursor-grabbing focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              hasCollision={false}
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
