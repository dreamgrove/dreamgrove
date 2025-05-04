import React, { useState } from 'react'
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DndContextProps,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import Cast, { CastInfo } from './Cast'
import DraggableCast from './DraggableCast'
import { SpellInfo, ChargeIndex, SpellChargeCasts } from './types'

interface SpellCastsRowProps {
  spellName: string
  casts: CastInfo[]
  spellInfo: SpellInfo
  timeline_total_length_px: number
  total_length_s: number
  wowheadComponent: React.ReactNode
  onCastDelete?: (castId: string) => void
  onCastMove?: (castId: string, newStartTime: number, chargeIndex: number) => void
  className?: string
  chargeIndex: ChargeIndex
  allSpellRows?: SpellChargeCasts[] // All rows for all spells, needed for charge validation
}

// Interface for candidate position with distance info
interface PositionCandidate {
  position: number // start time in seconds
  distance: number // distance from proposed position
  priority: number // priority of the position (higher is better)
  description?: string // description for debugging
}

export default function SpellCastsRow({
  casts,
  spellInfo,
  timeline_total_length_px,
  total_length_s,
  wowheadComponent,
  onCastDelete,
  onCastMove,
  className,
  chargeIndex = 0,
  allSpellRows = [],
}: SpellCastsRowProps) {
  // State to track active drag
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeCast = activeDragId ? casts.find((cast) => cast.id === activeDragId) : null

  // Configure sensors for drag detection
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

  // Function to check if two time ranges overlap
  const checkOverlap = (startA: number, endA: number, startB: number, endB: number): boolean => {
    // Two ranges overlap if the start of one is before the end of the other,
    // and the end of one is after the start of the other
    return startA < endB && endA > startB
  }

  // Function to find a valid position for a cast that doesn't overlap with others
  const findValidPosition = (
    activeCastId: string,
    proposedStart: number,
    proposedEnd: number,
    allCasts: (CastInfo & { id?: string })[]
  ): number => {
    // Get the active cast
    const activeCast = allCasts.find((cast) => cast.id === activeCastId)
    if (!activeCast) return proposedStart

    // Determine if we're moving forward or backward
    const isMovingForward = proposedStart > activeCast.start_s

    // Get all other casts (except the active one) and sort them by start time
    const otherCasts = allCasts
      .filter((cast) => cast.id !== activeCastId)
      .sort((a, b) => a.start_s - b.start_s)

    // If no other casts, return the proposed start
    if (otherCasts.length === 0) {
      return proposedStart
    }

    // First check if the proposed position is already valid (no overlaps)
    let hasOverlap = false
    let overlappingCast: (CastInfo & { id?: string }) | undefined = undefined

    for (const otherCast of otherCasts) {
      if (checkOverlap(proposedStart, proposedEnd, otherCast.start_s, otherCast.end_s)) {
        hasOverlap = true
        overlappingCast = otherCast
        break
      }
    }

    // If no overlap, we can use the proposed position
    if (!hasOverlap) {
      return proposedStart
    }

    const castDuration = proposedEnd - proposedStart

    // Find all potential valid positions
    const validPositions: PositionCandidate[] = []

    // 1. Consider the original position as a fallback with low priority
    validPositions.push({
      position: activeCast.start_s,
      distance: Math.abs(activeCast.start_s - proposedStart),
      priority: 0,
      description: 'Original position',
    })

    // 2. Consider position 0 if there's room and we have casts
    if (otherCasts.length > 0 && otherCasts[0].start_s >= castDuration) {
      validPositions.push({
        position: 0,
        distance: Math.abs(proposedStart),
        priority: 1,
        description: 'Start of timeline',
      })
    }

    // 3. Look for positions between casts
    for (let i = 0; i < otherCasts.length; i++) {
      const currentCast = otherCasts[i]
      const nextCast = i < otherCasts.length - 1 ? otherCasts[i + 1] : null

      if (nextCast) {
        // Space between casts
        const gapBetweenCasts = nextCast.start_s - currentCast.end_s

        if (gapBetweenCasts >= castDuration) {
          // We can fit in this gap

          // If moving forward, prioritize position where end aligns with next cast start
          if (isMovingForward && currentCast.end_s < proposedStart) {
            // Position where cast ends exactly at next cast start
            const alignEndPosition = nextCast.start_s - castDuration

            validPositions.push({
              position: alignEndPosition,
              distance: Math.abs(alignEndPosition - proposedStart),
              priority: 10, // High priority
              description: 'Aligned with next cast',
            })

            // Also consider start of gap
            validPositions.push({
              position: currentCast.end_s,
              distance: Math.abs(currentCast.end_s - proposedStart),
              priority: 5,
              description: 'After current cast',
            })
          }
          // If moving backward, prioritize position where start aligns with previous cast end
          else if (!isMovingForward && nextCast.start_s > proposedStart) {
            // Position where cast starts exactly at current cast end
            const alignStartPosition = currentCast.end_s

            validPositions.push({
              position: alignStartPosition,
              distance: Math.abs(alignStartPosition - proposedStart),
              priority: 10, // High priority
              description: 'Aligned with previous cast',
            })

            // Also consider end of gap
            validPositions.push({
              position: nextCast.start_s - castDuration,
              distance: Math.abs(nextCast.start_s - castDuration - proposedStart),
              priority: 5,
              description: 'Before next cast',
            })
          } else {
            // Regular gap filling without direction preference
            validPositions.push({
              position: currentCast.end_s,
              distance: Math.abs(currentCast.end_s - proposedStart),
              priority: 5,
              description: 'Start of gap',
            })

            validPositions.push({
              position: nextCast.start_s - castDuration,
              distance: Math.abs(nextCast.start_s - castDuration - proposedStart),
              priority: 5,
              description: 'End of gap',
            })
          }
        }
      }
    }

    // 4. Consider position at the end of the timeline if there's room
    if (otherCasts.length > 0) {
      const lastCast = otherCasts[otherCasts.length - 1]
      const maxPosition = total_length_s - castDuration

      if (lastCast.end_s <= maxPosition) {
        validPositions.push({
          position: lastCast.end_s,
          distance: Math.abs(lastCast.end_s - proposedStart),
          priority: 2,
          description: 'After last cast',
        })

        validPositions.push({
          position: maxPosition,
          distance: Math.abs(maxPosition - proposedStart),
          priority: 1,
          description: 'End of timeline',
        })
      }
    }

    // If we have overlapping position and we're moving forward,
    // try to place it right before the overlapping cast
    if (overlappingCast && isMovingForward) {
      const posBeforeOverlap = overlappingCast.start_s - castDuration
      if (posBeforeOverlap >= 0) {
        // Check if this position doesn't overlap with other casts
        let isValid = true
        for (const otherCast of otherCasts) {
          if (
            otherCast !== overlappingCast &&
            checkOverlap(
              posBeforeOverlap,
              overlappingCast.start_s,
              otherCast.start_s,
              otherCast.end_s
            )
          ) {
            isValid = false
            break
          }
        }

        if (isValid) {
          validPositions.push({
            position: posBeforeOverlap,
            distance: Math.abs(posBeforeOverlap - proposedStart),
            priority: 8,
            description: 'Before overlapping cast',
          })
        }
      }
    }

    // If we have overlapping position and we're moving backward,
    // try to place it right after the overlapping cast
    if (overlappingCast && !isMovingForward) {
      const posAfterOverlap = overlappingCast.end_s
      if (posAfterOverlap + castDuration <= total_length_s) {
        // Check if this position doesn't overlap with other casts
        let isValid = true
        for (const otherCast of otherCasts) {
          if (
            otherCast !== overlappingCast &&
            checkOverlap(
              posAfterOverlap,
              posAfterOverlap + castDuration,
              otherCast.start_s,
              otherCast.end_s
            )
          ) {
            isValid = false
            break
          }
        }

        if (isValid) {
          validPositions.push({
            position: posAfterOverlap,
            distance: Math.abs(posAfterOverlap - proposedStart),
            priority: 8,
            description: 'After overlapping cast',
          })
        }
      }
    }

    // Sort by priority (higher first) and then by distance (closer first)
    validPositions.sort((a, b) => {
      // First sort by priority (higher first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      // Then sort by distance (closer first)
      return a.distance - b.distance
    })

    return validPositions[0].position
  }

  // Get the charge constraints for the currently dragged cast
  const getChargeConstraints = () => {
    if (!activeDragId) return { min: 0, max: total_length_s }

    const activeCast = casts.find((c) => c.id === activeDragId)
    if (!activeCast) return { min: 0, max: total_length_s }

    const castDuration = activeCast.end_s - activeCast.start_s
    let minAllowedStart = 0
    let maxAllowedStart = total_length_s - castDuration

    // Only apply constraints for multi-charge spells
    if (spellInfo.charges && spellInfo.charges > 1) {
      // Find all rows for this spell
      const spellRows = allSpellRows.filter((row) => row.spell.id === spellInfo.id)

      // Organize casts by charge and position in sequence
      const castsByCharge: Record<number, CastInfo[]> = {}

      // Group and sort casts for each charge
      spellRows.forEach((row) => {
        const chargeIdx = row.chargeIndex
        if (!castsByCharge[chargeIdx]) {
          castsByCharge[chargeIdx] = []
        }
        // Sort casts by start time within each charge
        const sortedCasts = [...row.casts].sort((a, b) => a.start_s - b.start_s)
        castsByCharge[chargeIdx] = sortedCasts
      })

      // Find position of the active cast in its charge's sequence
      const currentChargeCasts = castsByCharge[chargeIndex] || []
      // When determining sequence position, we need to handle both:
      // 1. The cast that's currently being dragged (using activeDragId)
      // 2. The position of the cast in the sorted order
      let activeCastSequencePosition = currentChargeCasts.findIndex((c) => c.id === activeDragId)

      // If we couldn't find position by ID (which can happen in some edge cases),
      // try to find it by matching properties
      if (activeCastSequencePosition === -1 && activeCast) {
        // Try to match by start/end times or other properties
        activeCastSequencePosition = currentChargeCasts.findIndex(
          (c) => c.start_s === activeCast.start_s && c.end_s === activeCast.end_s
        )
      }

      if (chargeIndex === 0) {
        // For first charge (index 0), set max based on next charge
        const nextChargeRow = spellRows.find((row) => row.chargeIndex === 1)
        if (nextChargeRow && nextChargeRow.casts.length > 0) {
          // Default constraint - earliest start time of any cast in the next charge
          const earliestNextChargeStart = Math.min(
            ...nextChargeRow.casts.map((cast) => cast.start_s)
          )
          maxAllowedStart = earliestNextChargeStart - castDuration

          // If we can identify position in sequence, use corresponding cast in next charge
          if (activeCastSequencePosition !== -1) {
            const nextChargeCasts = castsByCharge[1] || []
            if (activeCastSequencePosition < nextChargeCasts.length) {
              // Get the corresponding cast in the next charge
              const correspondingNextCast = nextChargeCasts[activeCastSequencePosition]

              // Make sure we don't move after the corresponding cast in the next charge
              // (first charge cast can't start after its corresponding next charge cast)
              const correspondingMaxStart = correspondingNextCast.start_s

              // Use the stricter constraint (min of default and sequence-based)
              maxAllowedStart = Math.min(maxAllowedStart, correspondingMaxStart)
            }
          }
        }
      } else {
        // For charges after the first, set min based on previous charge
        const prevChargeRow = spellRows.find((row) => row.chargeIndex === chargeIndex - 1)
        if (prevChargeRow && prevChargeRow.casts.length > 0) {
          // Default constraint - use the latest end time of any cast in previous charge
          const latestPrevChargeStart = Math.max(...prevChargeRow.casts.map((cast) => cast.start_s))
          const latestPrevChargeEnd = Math.max(...prevChargeRow.casts.map((cast) => cast.end_s))
          minAllowedStart = latestPrevChargeStart
          maxAllowedStart = latestPrevChargeEnd

          // If we can identify position in sequence, use corresponding cast in previous charge
          if (activeCastSequencePosition !== -1) {
            const prevChargeCasts = castsByCharge[chargeIndex - 1] || []
            if (activeCastSequencePosition < prevChargeCasts.length) {
              // Get the corresponding cast in the previous charge
              const correspondingPrevCast = prevChargeCasts[activeCastSequencePosition]

              // Make sure we don't move before the corresponding cast in the previous charge
              const correspondingMinEnd = correspondingPrevCast.end_s
              const correspondingMinStart = correspondingPrevCast.start_s

              // Use the stricter constraint (max of default and sequence-based)
              minAllowedStart = correspondingMinStart
              maxAllowedStart = correspondingMinEnd
            }
          }
        }

        // Also set max based on next charge if not the last charge
        if (chargeIndex < spellInfo.charges - 1) {
          const nextChargeRow = spellRows.find((row) => row.chargeIndex === chargeIndex + 1)
          if (nextChargeRow && nextChargeRow.casts.length > 0) {
            // Default constraint - earliest start time of any cast in the next charge
            const earliestMaxChargeEnd = Math.min(...nextChargeRow.casts.map((cast) => cast.end_s))
            const nextChargeMaxAllowed = earliestMaxChargeEnd - castDuration

            // Use the stricter constraint
            maxAllowedStart = Math.min(maxAllowedStart, nextChargeMaxAllowed)

            // If we can identify position in sequence, use corresponding cast in next charge
            if (activeCastSequencePosition !== -1) {
              const nextChargeCasts = castsByCharge[chargeIndex + 1] || []
              if (activeCastSequencePosition < nextChargeCasts.length) {
                // Get the corresponding cast in the next charge
                const correspondingNextCast = nextChargeCasts[activeCastSequencePosition]

                // Make sure we don't move after the corresponding cast in the next charge
                const correspondingMaxStart = correspondingNextCast.end_s

                // Use the stricter constraint
                maxAllowedStart = Math.min(maxAllowedStart, correspondingMaxStart)
              }
            }
          }
        }
      }
    }
    // Ensure min is never greater than max
    if (minAllowedStart > maxAllowedStart) {
      // In case of conflict, prefer the min constraint to prevent overlaps
      maxAllowedStart = minAllowedStart
    }

    return { min: minAllowedStart, max: maxAllowedStart }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event

    if (active && delta.x !== 0) {
      const castId = active.id as string
      const cast = casts.find((c) => c.id === castId)

      if (cast && onCastMove) {
        // Calculate new position based on delta and convert pixels to seconds
        const pixelsPerSecond = timeline_total_length_px / total_length_s
        const deltaSeconds = delta.x / pixelsPerSecond

        // Calculate proposed new start time, ensuring it doesn't go below 0 or beyond timeline length
        const proposedStartTime = Math.max(
          0,
          Math.min(total_length_s - (cast.end_s - cast.start_s), cast.start_s + deltaSeconds)
        )

        // Calculate the proposed end time
        const proposedEndTime = proposedStartTime + (cast.end_s - cast.start_s)

        // Check for collisions and find the closest valid position
        const validStartTime = findValidPosition(castId, proposedStartTime, proposedEndTime, casts)

        // Only update if position changed
        if (validStartTime !== cast.start_s) {
          // Pass the chargeIndex to handleCastMove so it knows which charge is being moved
          onCastMove(castId, validStartTime, chargeIndex)
        }
      }
    }

    setActiveDragId(null)
  }

  // Configuration for DndContext to restrict movement to horizontal axis
  // and apply charge-based constraints
  const modifiers: DndContextProps['modifiers'] = [
    // Restrict to horizontal movement only
    ({ transform }) => {
      return {
        ...transform,
        y: 0,
      }
    },
    // Apply charge-based constraints during drag
    ({ transform }) => {
      if (!activeDragId) return transform

      const activeCast = casts.find((c) => c.id === activeDragId)
      if (!activeCast) return transform

      // Get the constraints for this cast based on charge relationships
      const { min, max } = getChargeConstraints()

      // Convert current position to seconds
      const pixelsPerSecond = timeline_total_length_px / total_length_s
      const currentPositionSeconds = activeCast.start_s
      const dragDeltaSeconds = transform.x / pixelsPerSecond

      // Calculate proposed new position in seconds
      const proposedPositionSeconds = currentPositionSeconds + dragDeltaSeconds

      console.log('proposedPositionSeconds', proposedPositionSeconds)
      console.log('min', min)
      console.log('max', max)
      // Apply constraints and convert back to pixels
      let constrainedPositionSeconds = proposedPositionSeconds
      if (constrainedPositionSeconds < min) constrainedPositionSeconds = min
      if (constrainedPositionSeconds > max) constrainedPositionSeconds = max

      const adjustedDeltaPixels =
        (constrainedPositionSeconds - currentPositionSeconds) * pixelsPerSecond

      console.log('adjustedDeltaPixels', adjustedDeltaPixels)
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
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      <div className={`relative w-full ${className || ''} ${chargeIndex > 0 ? 'charge-row' : ''}`}>
        {casts.map((cast, index) => (
          <DraggableCast
            key={cast.id || `cast-${index}`}
            id={cast.id || `cast-${index}`}
            castInfo={cast}
            spell={spellInfo}
            timeline_total_length_px={timeline_total_length_px}
            total_length_s={total_length_s}
            wowheadComponent={
              chargeIndex === 0 ? (
                wowheadComponent
              ) : (
                <span className="text-sm text-gray-400">Charge {chargeIndex + 1}</span>
              )
            }
            onDelete={cast.id && onCastDelete ? () => onCastDelete(cast.id!) : undefined}
            otherCasts={casts}
            isChargeRow={chargeIndex > 0}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDragId && activeCast && (
          <Cast
            castInfo={activeCast}
            spell={spellInfo}
            Wowhead={
              chargeIndex === 0 ? (
                wowheadComponent
              ) : (
                <span className="text-sm text-gray-400">Charge {chargeIndex + 1}</span>
              )
            }
            isDragging={true}
            className="cursor-grabbing focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            hasCollision={false}
            isChargeRow={chargeIndex > 0}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
