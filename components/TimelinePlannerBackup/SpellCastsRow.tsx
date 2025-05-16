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
} from '@dnd-kit/core'
import Cast from './Cast'
import DraggableCast from './DraggableCast'
import { SpellInfo, ChargeIndex, SpellChargeCasts, SPELL_GCD, CastInfo } from './types'
import { useTimelineControls } from './TimelineContext'

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
  patchedSpellRows?: SpellChargeCasts[] // All rows with patches applied from timeline effects
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
  patchedSpellRows = [],
}: SpellCastsRowProps) {
  // State to track active drag
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const activeCast = activeDragId ? casts.find((cast) => cast.id === activeDragId) : null

  // Get timeline conversion functions from context
  const { timeToPixels, pixelsToTime } = useTimelineControls()

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

    // Use patched cast end times for overlap detection when available
    for (const otherCast of otherCasts) {
      // Try to find the patched version of this cast
      let otherCastEndTime = otherCast.end_s
      let otherCastStartTime = otherCast.start_s

      // Look for this cast in patchedSpellRows if they exist
      if (patchedSpellRows && patchedSpellRows.length > 0) {
        // Find the row that contains this cast
        const patchedRow = patchedSpellRows.find(
          (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
        )

        if (patchedRow) {
          // Find the patched cast
          const patchedCast = patchedRow.casts.find((cast) => cast.id === otherCast.id)
          if (patchedCast) {
            // Use the patched end time
            otherCastEndTime = patchedCast.end_s
            otherCastStartTime = patchedCast.start_s
          }
        }
      }

      if (checkOverlap(proposedStart, proposedEnd, otherCastStartTime, otherCastEndTime)) {
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

      // Get patched end time for current cast if available
      let currentCastEndTime = currentCast.end_s

      if (patchedSpellRows && patchedSpellRows.length > 0) {
        const patchedRow = patchedSpellRows.find(
          (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
        )

        if (patchedRow) {
          const patchedCast = patchedRow.casts.find((cast) => cast.id === currentCast.id)
          if (patchedCast) {
            currentCastEndTime = patchedCast.end_s
          }
        }
      }

      if (nextCast) {
        // Space between casts
        const gapBetweenCasts = nextCast.start_s - currentCastEndTime

        if (gapBetweenCasts >= castDuration) {
          // We can fit in this gap

          // If moving forward, prioritize position where end aligns with next cast start
          if (isMovingForward && currentCastEndTime < proposedStart) {
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
              position: currentCastEndTime,
              distance: Math.abs(currentCastEndTime - proposedStart),
              priority: 5,
              description: 'After current cast',
            })
          }
          // If moving backward, prioritize position where start aligns with previous cast end
          else if (!isMovingForward && nextCast.start_s > proposedStart) {
            // Position where cast starts exactly at current cast end
            const alignStartPosition = currentCastEndTime

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
              position: currentCastEndTime,
              distance: Math.abs(currentCastEndTime - proposedStart),
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

      // Get patched end time for last cast if available
      let lastCastEndTime = lastCast.end_s

      if (patchedSpellRows && patchedSpellRows.length > 0) {
        const patchedRow = patchedSpellRows.find(
          (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
        )

        if (patchedRow) {
          const patchedCast = patchedRow.casts.find((cast) => cast.id === lastCast.id)
          if (patchedCast) {
            lastCastEndTime = patchedCast.end_s
          }
        }
      }

      const maxPosition = total_length_s - castDuration

      if (lastCastEndTime <= maxPosition) {
        validPositions.push({
          position: lastCastEndTime,
          distance: Math.abs(lastCastEndTime - proposedStart),
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
          // Get patched end time for otherCast if available
          let otherCastEndTime = otherCast.end_s

          if (patchedSpellRows && patchedSpellRows.length > 0) {
            const patchedRow = patchedSpellRows.find(
              (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
            )

            if (patchedRow) {
              const patchedCast = patchedRow.casts.find((cast) => cast.id === otherCast.id)
              if (patchedCast) {
                otherCastEndTime = patchedCast.end_s
              }
            }
          }

          if (
            otherCast !== overlappingCast &&
            checkOverlap(
              posBeforeOverlap,
              overlappingCast.start_s,
              otherCast.start_s,
              otherCastEndTime
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
      // Get patched end time for overlappingCast if available
      let overlappingCastEndTime = overlappingCast.end_s

      if (patchedSpellRows && patchedSpellRows.length > 0) {
        const patchedRow = patchedSpellRows.find(
          (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
        )

        if (patchedRow) {
          const patchedCast = patchedRow.casts.find((cast) => cast.id === overlappingCast.id)
          if (patchedCast) {
            overlappingCastEndTime = patchedCast.end_s
          }
        }
      }

      const posAfterOverlap = overlappingCastEndTime
      if (posAfterOverlap + castDuration <= total_length_s) {
        // Check if this position doesn't overlap with other casts
        let isValid = true
        for (const otherCast of otherCasts) {
          // Get patched end time for otherCast if available
          let otherCastEndTime = otherCast.end_s

          if (patchedSpellRows && patchedSpellRows.length > 0) {
            const patchedRow = patchedSpellRows.find(
              (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
            )

            if (patchedRow) {
              const patchedCast = patchedRow.casts.find((cast) => cast.id === otherCast.id)
              if (patchedCast) {
                otherCastEndTime = patchedCast.end_s
              }
            }
          }

          if (
            otherCast !== overlappingCast &&
            checkOverlap(
              posAfterOverlap,
              posAfterOverlap + castDuration,
              otherCast.start_s,
              otherCastEndTime
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
    if (!activeDragId) return { min: 0, max: total_length_s - SPELL_GCD }

    const activeCast = casts.find((c) => c.id === activeDragId)
    if (!activeCast) return { min: 0, max: total_length_s - SPELL_GCD }

    const castDuration = activeCast.end_s - activeCast.start_s
    let minAllowedStart = 0
    if (spellInfo.id === 'reforestation') {
      minAllowedStart = spellInfo.cooldown
    }
    let maxAllowedStart = total_length_s - SPELL_GCD

    // Only apply constraints for multi-charge spells
    if (spellInfo.charges && spellInfo.charges > 1) {
      // Decide which spell rows to use for constraints based on availability
      const spellRows = patchedSpellRows.length > 0 ? patchedSpellRows : []

      // Find all rows for this spell
      const spellRowsForThisSpell = spellRows.filter((row) => row.spell.id === spellInfo.id)

      // Organize casts by charge and position in sequence
      const castsByCharge: Record<number, CastInfo[]> = {}

      // Group and sort casts for each charge
      spellRowsForThisSpell.forEach((row) => {
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
      const activeCastSequencePosition = currentChargeCasts.findIndex((c) => c.id === activeDragId)

      if (chargeIndex === 0) {
        // For first charge (index 0), set start constraints based on next charge
        const nextChargeRow = spellRowsForThisSpell.find((row) => row.chargeIndex === 1)
        if (nextChargeRow && nextChargeRow.casts.length > 0) {
          // If we can identify position in sequence, use corresponding cast in next charge
          if (activeCastSequencePosition !== -1) {
            const nextChargeCasts = castsByCharge[1] || []

            /* If we already have a cast in the next charge */
            if (activeCastSequencePosition < nextChargeCasts.length) {
              // Get the corresponding cast in the next charge
              const correspondingNextChargeCast = nextChargeCasts[activeCastSequencePosition]
              const startOfNextChargeCast = correspondingNextChargeCast.start_s

              // The first charge start time can't be smaller than the start of the next charge cast - cast duration
              minAllowedStart = Math.max(
                minAllowedStart,
                startOfNextChargeCast - castDuration + SPELL_GCD
              )
              // And it can't be greater than the start of the next charge cast
              maxAllowedStart = Math.min(maxAllowedStart, startOfNextChargeCast - SPELL_GCD)

              /* If we don't have other sub-charges yet */
            } else if (activeCastSequencePosition === nextChargeCasts.length) {
              // Get the last previous cast in the current charge
              const currentPreviousChargeCast = currentChargeCasts[activeCastSequencePosition - 1]

              let endOfPrevChargeCast = currentPreviousChargeCast.end_s

              if (patchedSpellRows.length > 0) {
                const patchedRow = patchedSpellRows.find(
                  (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex
                )

                if (patchedRow) {
                  const patchedPrevCast = patchedRow.casts.find(
                    (cast) => cast.id === currentPreviousChargeCast.id
                  )
                  if (patchedPrevCast) {
                    endOfPrevChargeCast = patchedPrevCast.end_s
                  }
                }
              }
              // Cant be smaller than the end of the previous charge cast
              minAllowedStart = Math.max(minAllowedStart, endOfPrevChargeCast)
              maxAllowedStart = Math.min(maxAllowedStart)
            }
          }
        }
      } else {
        // For charges after the first, set start constraints based on previous charge
        const prevChargeRow = spellRowsForThisSpell.find(
          (row) => row.chargeIndex === chargeIndex - 1
        )
        if (prevChargeRow && prevChargeRow.casts.length > 0) {
          // If we can identify position in sequence, use corresponding cast in previous charge
          if (activeCastSequencePosition !== -1) {
            const prevChargeCasts = castsByCharge[chargeIndex - 1] || []
            if (activeCastSequencePosition < prevChargeCasts.length) {
              // Get the corresponding cast in the previous charge
              const correspondingPrevChargeCast = prevChargeCasts[activeCastSequencePosition]

              // Get patched end time for previous charge cast if available
              let endOfPrevChargeCast = correspondingPrevChargeCast.end_s

              if (patchedSpellRows.length > 0) {
                const patchedPrevRow = patchedSpellRows.find(
                  (row) => row.spell.id === spellInfo.id && row.chargeIndex === chargeIndex - 1
                )

                if (patchedPrevRow) {
                  const patchedPrevCast = patchedPrevRow.casts.find(
                    (cast) => cast.id === correspondingPrevChargeCast.id
                  )
                  if (patchedPrevCast) {
                    endOfPrevChargeCast = patchedPrevCast.end_s
                  }
                }
              }

              const startOfPrevChargeCast = correspondingPrevChargeCast.start_s

              // Any non first charge cast can't start before the start of the previous charge cast
              minAllowedStart = Math.max(minAllowedStart, startOfPrevChargeCast + SPELL_GCD)
              // Any non first charge cast can't end after the end of the previous charge cooldown
              maxAllowedStart = Math.min(maxAllowedStart, endOfPrevChargeCast - SPELL_GCD)
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
          Math.min(total_length_s - SPELL_GCD, cast.start_s + deltaSeconds)
        )

        // Apply charge-based constraints to the proposed start time
        const { min, max } = getChargeConstraints()
        let constrainedStartTime = proposedStartTime
        if (constrainedStartTime < min) constrainedStartTime = min
        if (constrainedStartTime > max) constrainedStartTime = max

        // Check for collisions and find the closest valid position
        const validStartTime = findValidPosition(
          castId,
          constrainedStartTime,
          constrainedStartTime + (cast.end_s - cast.start_s),
          casts
        )

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

      // Convert current position to seconds - use context helpers
      const currentPositionSeconds = activeCast.start_s
      const dragDeltaSeconds = pixelsToTime(transform.x)

      // Calculate proposed new position in seconds
      const proposedPositionSeconds = currentPositionSeconds + dragDeltaSeconds

      // Apply constraints and convert back to pixels
      let constrainedPositionSeconds = proposedPositionSeconds
      if (constrainedPositionSeconds < min) constrainedPositionSeconds = min
      if (constrainedPositionSeconds > max) constrainedPositionSeconds = max

      // Use timeToPixels to convert back to pixels
      const adjustedDeltaPixels = timeToPixels(constrainedPositionSeconds - currentPositionSeconds)

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
