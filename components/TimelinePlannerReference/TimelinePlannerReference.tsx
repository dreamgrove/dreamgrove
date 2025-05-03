'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './TimelinePlannerReference.module.css'
import Cast from './CastReference'

interface Spell {
  id: string
  name: string
  duration: number
  cooldown: number
  spellId?: string | number // Add spellId for Wowhead lookup
  channeled?: boolean
}

interface Cast {
  id: string
  spellId: string
  startTime: number
  pixelPosition?: number // Add pixel position for direct positioning
  cooldownReduction?: number
}

interface TimelinePlannerProps {
  spells: Spell[]
  prerenderedWowheads: Record<string, React.ReactNode>
  prerenderedWowheadNames: Record<string, React.ReactNode> // For spell name column
}

// Timeline constants
const TIMELINE_GAP = 30 // Gap between time markers in seconds
const DEFAULT_TIMELINE_GAP_DISTANCE = 200 // Default pixel distance between time markers
const INITIAL_TIMELINE_LENGTH = 180 // Initial timeline length in seconds
// Minimum and maximum zoom (gap distance in px)
const MIN_GAP_DISTANCE = 60
const MAX_GAP_DISTANCE = 400

// --- Modular Rule System Types ---
interface TimelineWarning {
  ruleId: string
  castId: string
  message: string
  // Optionally, reference the cast/spell it intersects with
  relatedCastId?: string
}

interface TimelineRule {
  id: string
  check: (casts: Cast[], spells: Spell[], timelineLength: number) => TimelineWarning[]
}

// --- Rule: Channeled Interruption ---
const channeledInterruptionRule: TimelineRule = {
  id: 'channeled-interruption',
  check: (allCasts, spells, _timelineLength) => {
    const warnings: TimelineWarning[] = []
    // Find all channeled spells
    const channeledCasts = allCasts.filter((cast) => {
      const spell = spells.find((s) => s.id === cast.spellId)
      return spell?.channeled
    })
    // Check each cast against channeled spells
    allCasts.forEach((cast) => {
      const castSpell = spells.find((s) => s.id === cast.spellId)
      if (!castSpell || castSpell.channeled) return // Skip if it's a channeled spell itself
      const castStart = cast.startTime
      const castEnd = castStart + (castSpell.duration || 0)
      channeledCasts.forEach((channeledCast) => {
        if (cast.id === channeledCast.id) return // Skip self
        const channeledSpell = spells.find((s) => s.id === channeledCast.spellId)
        if (!channeledSpell) return
        const channeledStart = channeledCast.startTime
        const channeledEnd = channeledStart + channeledSpell.duration
        // Check for intersection
        if (
          (castStart >= channeledStart && castStart <= channeledEnd) ||
          (castEnd >= channeledStart && castEnd <= channeledEnd) ||
          (castStart <= channeledStart && castEnd >= channeledEnd)
        ) {
          warnings.push({
            ruleId: 'channeled-interruption',
            castId: cast.id,
            relatedCastId: channeledCast.id,
            message: '', // Message will be rendered in the component for flexibility
          })
        }
      })
    })
    return warnings
  },
}

// --- Rule: Missed Casts ---
const missedCastsRule: TimelineRule = {
  id: 'missed-casts',
  check: (allCasts, spells, timelineLength) => {
    const warnings: TimelineWarning[] = []
    // For each spell, check for missed cast opportunities
    spells.forEach((spell) => {
      // Get all casts for this spell, sorted by startTime
      const spellCasts = allCasts
        .filter((c) => c.spellId === spell.id)
        .sort((a, b) => a.startTime - b.startTime)
      // Log spell and cast times
      console.log(`[Missed Casts Rule] Checking spell: ${spell.name}`)
      console.log(
        `[Missed Casts Rule] Sorted cast times:`,
        spellCasts.map((c) => c.startTime)
      )
      let unusedTime = 0
      // If there are no casts, the whole timeline is unused
      if (spellCasts.length === 0) {
        unusedTime = timelineLength
        warnings.push({
          ruleId: 'missed-casts',
          castId: spell.id, // Use first cast or spell id if no casts
          message: `Missed cast: ${spell.name} could have been cast again during ${unusedTime.toFixed(1)}s of unused time.`,
        })
        return warnings
      } else {
        // Time before the first cast
        unusedTime += spellCasts[0].startTime
        // Gaps between casts
        for (let i = 1; i < spellCasts.length; i++) {
          const prevCast = spellCasts[i - 1]
          const prevEnd = prevCast.startTime + (spell.cooldown || 0)
          const currStart = spellCasts[i].startTime
          if (currStart > prevEnd) {
            unusedTime += currStart - prevEnd
          }
        }
        // Time after the last cast
        const lastCast = spellCasts[spellCasts.length - 1]
        const lastEnd = lastCast.startTime + (spell.cooldown || 0)
        if (lastEnd < timelineLength) {
          unusedTime += timelineLength - lastEnd
        }
      }
      // Log unused time
      console.log(
        `[Missed Casts Rule] Unused time for ${spell.name}: ${unusedTime}s (cooldown: ${spell.cooldown}s)`
      )
      // If unused time is greater than the cooldown, we missed at least one cast
      if (unusedTime > spell.cooldown) {
        console.log(`[Missed Casts Rule] Missed cast detected for ${spell.name}`)
        warnings.push({
          ruleId: 'missed-casts',
          castId: spellCasts[0]?.id || spell.id, // Use first cast or spell id if no casts
          message: `Missed cast: ${spell.name} could have been cast again during ${unusedTime.toFixed(1)}s of unused time.`,
        })
      } else {
        console.log(`[Missed Casts Rule] No missed cast for ${spell.name}`)
      }
    })
    return warnings
  },
}

// --- Rule Engine: Add more rules here as needed ---
const timelineRules: TimelineRule[] = [
  channeledInterruptionRule,
  missedCastsRule,
  // Add more rules here
]

// --- Control of the Dream spell IDs ---
const CONTROL_OF_DREAM_SPELL_IDS = [194223, 205636, 391528]
const CONTROL_OF_DREAM_MAX_REDUCTION = 15 // seconds

export const TimelinePlanner: React.FC<TimelinePlannerProps> = ({
  spells,
  prerenderedWowheads,
  prerenderedWowheadNames,
}) => {
  // State for timeline length (in seconds)
  const [timelineLength, setTimelineLength] = useState<number>(INITIAL_TIMELINE_LENGTH)
  // State for user input (minutes/seconds)
  const [inputMinutes, setInputMinutes] = useState<number>(Math.floor(INITIAL_TIMELINE_LENGTH / 60))
  const [inputSeconds, setInputSeconds] = useState<number>(INITIAL_TIMELINE_LENGTH % 60)
  // State for zoom (gap distance in px)
  const [gapDistance, setGapDistance] = useState<number>(DEFAULT_TIMELINE_GAP_DISTANCE)
  const [casts, setCasts] = useState<Cast[]>([])
  const [draggedCast, setDraggedCast] = useState<string | null>(null)
  const [initialMouseX, setInitialMouseX] = useState<number>(0)
  const [initialScrollLeft, setInitialScrollLeft] = useState<number | null>(null)
  const [initialCastPositions, setInitialCastPositions] = useState<Record<string, number>>({})
  const [warnings, setWarnings] = useState<TimelineWarning[]>([])
  const timelineRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const scrollAnimationRef = useRef<number | null>(null)
  const lastMouseEventRef = useRef<React.MouseEvent | null>(null)
  const followScrollSpeed = 10
  const followScrollTriggerDistance = 60
  const [invalidDrag, setInvalidDrag] = useState<string | null>(null)
  // State to toggle warnings visibility
  const [showWarnings, setShowWarnings] = useState<boolean>(true)
  // State for Control of the Dream effect
  const [controlOfDream, setControlOfDream] = useState<boolean>(false)
  // State for Control of the Dream effect
  const [availableTimes, setAvailableTimes] = useState<Record<string, number>>({})

  // Generate time markers based on TIMELINE_GAP
  // Always include the last marker at the timeline's total length
  const timeMarkers = (() => {
    const markers = Array.from(
      { length: Math.ceil(timelineLength / TIMELINE_GAP) },
      (_, i) => i * TIMELINE_GAP
    )
    if (markers[markers.length - 1] !== timelineLength) {
      markers.push(timelineLength)
    }
    return markers
  })()

  // Calculate minimum width based on initial length and current gap distance
  const timelineMinWidth = (INITIAL_TIMELINE_LENGTH / TIMELINE_GAP) * gapDistance
  // Calculate widths based on the gap distance
  const timeSegmentWidth = gapDistance
  const totalTimelineWidth = Math.max(
    timelineMinWidth,
    (timelineLength / TIMELINE_GAP) * gapDistance
  )

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.style.setProperty('--timeline-gap-width', `${timeSegmentWidth}px`)
      timelineRef.current.style.setProperty('--timeline-min-width', `${totalTimelineWidth}px`)
    }
  }, [timeSegmentWidth, timelineLength, totalTimelineWidth])

  // Clear animation frame on unmount
  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
      }
    }
  }, [])

  // Utility: Recalculate pixel positions for all casts
  const recalculatePixelPositions = (
    castsToUpdate: Cast[],
    timelineLengthVal = timelineLength,
    gapDistanceVal = gapDistance
  ) => {
    // Calculate minimum width based on initial length and current gap distance
    const timelineMinWidthVal = (INITIAL_TIMELINE_LENGTH / TIMELINE_GAP) * gapDistanceVal
    return castsToUpdate.map((cast) => ({
      ...cast,
      pixelPosition: (cast.startTime / timelineLengthVal) * timelineMinWidthVal,
    }))
  }

  // Robustly recalculate pixel positions whenever casts, timelineLength, or gapDistance changes
  useEffect(() => {
    setCasts((prevCasts) => recalculatePixelPositions(prevCasts))
     
  }, [gapDistance, timelineLength, casts.length])

  // Re-run rules when timelineLength changes
  useEffect(() => {
    runRules(casts)
     
  }, [timelineLength])

  // --- Track available time for Control of the Dream spells ---
  // This state tracks, for each spellId, the accumulated available time since last cast
  useEffect(() => {
    if (!controlOfDream) {
      setAvailableTimes({})
      return
    }
    // For each affected spell, calculate the available time between casts
    const newAvailableTimes: Record<string, number> = {}
    CONTROL_OF_DREAM_SPELL_IDS.forEach((spellIdNum) => {
      const spell = spells.find((s) => Number(s.spellId) === spellIdNum)
      if (!spell) return
      // Get all casts for this spell, sorted by startTime
      const spellCasts = casts
        .filter((c) => c.spellId === spell.id)
        .sort((a, b) => a.startTime - b.startTime)
      let availableTime = 0
      if (spellCasts.length === 0) {
        // If never cast, available time is the whole timeline
        availableTime = timelineLength
      } else {
        // Time before first cast
        availableTime += spellCasts[0].startTime
        // Gaps between casts
        for (let i = 1; i < spellCasts.length; i++) {
          const prevCast = spellCasts[i - 1]
          const prevEnd = prevCast.startTime + (spell.cooldown || 0)
          const currStart = spellCasts[i].startTime
          if (currStart > prevEnd) {
            availableTime += currStart - prevEnd
          }
        }
        // Time after last cast (not needed for reduction, only before next cast)
      }
      // Cap at 15s
      newAvailableTimes[spell.id] = Math.min(availableTime, CONTROL_OF_DREAM_MAX_REDUCTION)
    })
    setAvailableTimes(newAvailableTimes)
     
  }, [casts, spells, timelineLength, controlOfDream])

  const handleScroll = (e: React.MouseEvent) => {
    if (!scrollAreaRef.current || !draggedCast) return

    // Store the latest mouse event for use in the animation frame
    lastMouseEventRef.current = e

    const container = scrollAreaRef.current
    const containerRect = container.getBoundingClientRect()
    const distanceFromRight = containerRect.right - e.clientX
    const distanceFromLeft = e.clientX - containerRect.left

    // Cancel any existing animation frame
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }

    // Start scrolling if within trigger distance of either edge
    if (
      distanceFromRight < followScrollTriggerDistance ||
      (distanceFromLeft < followScrollTriggerDistance && container.scrollLeft > 0)
    ) {
      const scrollStep = () => {
        if (!scrollAreaRef.current || !lastMouseEventRef.current) return

        const currentRect = scrollAreaRef.current.getBoundingClientRect()
        const currentDistanceFromRight = currentRect.right - lastMouseEventRef.current.clientX
        const currentDistanceFromLeft = lastMouseEventRef.current.clientX - currentRect.left

        if (currentDistanceFromRight < followScrollTriggerDistance) {
          scrollAreaRef.current.scrollLeft += followScrollSpeed
        } else if (
          currentDistanceFromLeft < followScrollTriggerDistance &&
          scrollAreaRef.current.scrollLeft > 0
        ) {
          scrollAreaRef.current.scrollLeft -= followScrollSpeed
        }

        // Update cast position without triggering another scroll check
        if (lastMouseEventRef.current) {
          updateCastPosition(lastMouseEventRef.current)
        }

        scrollAnimationRef.current = requestAnimationFrame(scrollStep)
      }

      scrollAnimationRef.current = requestAnimationFrame(scrollStep)
    }
  }

  const runRules = (allCasts: Cast[]) => {
    let allWarnings: TimelineWarning[] = []
    for (const rule of timelineRules) {
      allWarnings = allWarnings.concat(rule.check(allCasts, spells, timelineLength))
    }
    setWarnings(allWarnings)
  }

  const updateCastPosition = (e: React.MouseEvent) => {
    if (!draggedCast || !timelineRef.current || !scrollAreaRef.current) return

    const scrollOffset = scrollAreaRef.current.scrollLeft
    const totalDeltaX = e.clientX - initialMouseX + (scrollOffset - (initialScrollLeft || 0))

    setCasts((prevCasts) => {
      const castIndex = prevCasts.findIndex((c) => c.id === draggedCast)
      if (castIndex === -1) return prevCasts

      const updatedCasts = [...prevCasts]
      const cast = updatedCasts[castIndex]
      const spell = spells.find((s) => s.id === cast.spellId)

      // Get the initial position of this cast
      const initialPosition = initialCastPositions[draggedCast] || 0

      // Calculate new position by adding total delta to initial position
      const newPixelPosition = Math.max(0, initialPosition + totalDeltaX)

      // Find previous cast of the same spell
      const prevCast = updatedCasts
        .filter((c, idx) => c.spellId === cast.spellId && idx < castIndex)
        .sort((a, b) => b.startTime - a.startTime)[0]

      let minPixelPosition = 0
      if (prevCast && spell) {
        // Use the actual cooldown (with reduction) for the previous cast
        const prevCooldown = getCastCooldown(prevCast, spell)
        minPixelPosition =
          (prevCast.pixelPosition !== undefined
            ? prevCast.pixelPosition
            : (prevCast.startTime / timelineLength) * timelineMinWidth) +
          (prevCooldown / timelineLength) * timelineMinWidth
        if (newPixelPosition < minPixelPosition) {
          setInvalidDrag(draggedCast)
        } else {
          setInvalidDrag(null)
        }
      } else {
        setInvalidDrag(null)
      }

      // Calculate time position
      const timePosition = (newPixelPosition / timelineMinWidth) * timelineLength

      // Update the cast with new pixel position
      updatedCasts[castIndex] = {
        ...cast,
        pixelPosition: newPixelPosition,
        startTime: timePosition,
      }

      // Update subsequent casts pixel positions as well
      for (let i = castIndex + 1; i < updatedCasts.length; i++) {
        if (updatedCasts[i].spellId === cast.spellId) {
          const spell = spells.find((s) => s.id === cast.spellId)
          if (!spell) continue

          const prevCast = updatedCasts[i - 1]
          const prevCastPosition = prevCast.pixelPosition || 0
          // Use the actual cooldown (with reduction) for the previous cast
          const prevCooldown = getCastCooldown(prevCast, spell)
          const minPixelPosition =
            prevCastPosition + (prevCooldown / timelineLength) * timelineMinWidth

          // Initialize pixel position if needed
          if (updatedCasts[i].pixelPosition === undefined) {
            updatedCasts[i].pixelPosition =
              (updatedCasts[i].startTime / timelineLength) * timelineMinWidth
          }

          const currentPosition = updatedCasts[i].pixelPosition || 0

          if (currentPosition < minPixelPosition) {
            updatedCasts[i] = {
              ...updatedCasts[i],
              pixelPosition: minPixelPosition,
              startTime: (minPixelPosition / timelineMinWidth) * timelineLength,
            }
          }
        }
      }

      runRules(updatedCasts)
      return updatedCasts
    })
  }

  const handleDragMove = (e: React.MouseEvent) => {
    handleScroll(e)
    updateCastPosition(e)
  }

  // Helper to determine if a spell is affected by Control of the Dream
  const isControlOfDreamSpell = (spell: Spell) =>
    CONTROL_OF_DREAM_SPELL_IDS.includes(Number(spell.spellId))

  // --- Modified addCast to apply Control of the Dream effect ---
  const addCast = (spellId: string) => {
    const spell = spells.find((s) => s.id === spellId)
    if (!spell) return
    // Find the first available time slot
    const spellCasts = casts
      .filter((c) => c.spellId === spellId)
      .sort((a, b) => a.startTime - b.startTime)
    let startTime = 0
    for (const cast of spellCasts) {
      if (cast.startTime >= startTime + getCastCooldown(cast, spell)) {
        break
      }
      startTime = cast.startTime + getCastCooldown(cast, spell)
    }
    // --- Apply Control of the Dream cooldown reduction if enabled and spell is affected ---
    let cooldownReduction = 0
    if (controlOfDream && isControlOfDreamSpell(spell)) {
      if (spellCasts.length === 0) {
        // First cast always gets max reduction
        cooldownReduction = CONTROL_OF_DREAM_MAX_REDUCTION
      } else {
        // Find previous cast and its cooldown
        const prevCast = spellCasts[spellCasts.length - 1]
        const prevCooldown = getCastCooldown(prevCast, spell)
        const availableStart = prevCast.startTime + prevCooldown
        // Time spell was available before this cast
        const availableTime = Math.max(0, startTime - availableStart)
        cooldownReduction = Math.min(CONTROL_OF_DREAM_MAX_REDUCTION, availableTime)
      }
    }
    // Calculate pixel position for the new cast immediately
    const timelineMinWidthVal = (INITIAL_TIMELINE_LENGTH / TIMELINE_GAP) * gapDistance
    const pixelPosition = (startTime / timelineLength) * timelineMinWidthVal
    const newCast: Cast = {
      id: `${spellId}-${Date.now()}`,
      spellId,
      startTime: Math.max(0, startTime),
      cooldownReduction,
      pixelPosition,
    }
    setCasts((prevCasts) => {
      // Add the new cast and recalculate all pixel positions for robustness
      const newCasts = recalculatePixelPositions([...prevCasts, newCast])
      runRules(newCasts)
      return newCasts
    })
    // Reset available time for this spell after cast
    setAvailableTimes((prev) => ({ ...prev, [spell.id]: 0 }))
  }

  // --- Helper to get cooldown for a cast, considering Control of the Dream effect ---
  const getCastCooldown = (cast: Cast, spell: Spell) => {
    // @ts-ignore
    const reduction =
      controlOfDream && isControlOfDreamSpell(spell) ? cast.cooldownReduction || 0 : 0
    return Math.max(0, (spell.cooldown || 0) - reduction)
  }

  const handleDragStart = (castId: string, e: React.MouseEvent) => {
    if (!timelineRef.current || !scrollAreaRef.current) return

    const cast = casts.find((c) => c.id === castId)
    if (!cast) return

    // Store initial mouse position and scroll position
    setInitialMouseX(e.clientX)
    setInitialScrollLeft(scrollAreaRef.current.scrollLeft)

    // Store initial position of the cast being dragged
    const initialPosition =
      cast.pixelPosition !== undefined
        ? cast.pixelPosition
        : (cast.startTime / timelineLength) * timelineMinWidth

    setInitialCastPositions({
      ...initialCastPositions,
      [castId]: initialPosition,
    })

    setDraggedCast(castId)
  }

  const handleDragEnd = () => {
    if (draggedCast) {
      setCasts((prevCasts) => {
        const castIndex = prevCasts.findIndex((c) => c.id === draggedCast)
        if (castIndex === -1) return prevCasts
        const updatedCasts = [...prevCasts]
        const cast = updatedCasts[castIndex]
        const spell = spells.find((s) => s.id === cast.spellId)
        // Snap to minimum allowed position if needed
        if (spell) {
          const prevCast = updatedCasts
            .filter((c, idx) => c.spellId === cast.spellId && idx < castIndex)
            .sort((a, b) => b.startTime - a.startTime)[0]
          let minPixelPosition = 0
          if (prevCast) {
            // Use the actual cooldown (with reduction) for the previous cast
            const prevCooldown = getCastCooldown(prevCast, spell)
            minPixelPosition =
              (prevCast.pixelPosition !== undefined
                ? prevCast.pixelPosition
                : (prevCast.startTime / timelineLength) * timelineMinWidth) +
              (prevCooldown / timelineLength) * timelineMinWidth
            if (cast.pixelPosition !== undefined && cast.pixelPosition < minPixelPosition) {
              updatedCasts[castIndex] = {
                ...cast,
                pixelPosition: minPixelPosition,
                startTime: (minPixelPosition / timelineMinWidth) * timelineLength,
              }
            }
          }
        }
        return updatedCasts
      })
      setInvalidDrag(null)
    }
    setDraggedCast(null)
  }

  const deleteCast = (castId: string) => {
    setCasts((prevCasts) => {
      const newCasts = prevCasts.filter((c) => c.id !== castId)
      runRules(newCasts)
      return newCasts
    })
  }

  // Get unique spell IDs that have casts
  const activeSpellIds = [...new Set(casts.map((cast) => cast.spellId))]

  // Update the cleanup in drag end handlers
  const cleanupScroll = () => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }
    lastMouseEventRef.current = null
  }

  return (
    <div className={styles.container}>
      {/* Control of the Dream Checkbox */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={controlOfDream}
            onChange={(e) => setControlOfDream(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Control of the Dream
        </label>
      </div>
      <div className={styles.timelineLengthControls}>
        <label>
          Minutes:
          <input
            type="number"
            min={0}
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            style={{ width: 60, marginLeft: 4, marginRight: 12 }}
          />
        </label>
        <label>
          Seconds:
          <input
            type="number"
            min={0}
            max={59}
            value={inputSeconds}
            onChange={(e) => setInputSeconds(Number(e.target.value))}
            style={{ width: 60, marginLeft: 4, marginRight: 12 }}
          />
        </label>
        <button
          className={styles.setLengthButton}
          onClick={() => {
            // Clamp seconds to 0-59, minutes >= 0
            const minutes = Math.max(0, inputMinutes)
            const seconds = Math.max(0, Math.min(59, inputSeconds))
            setTimelineLength(minutes * 60 + seconds)
          }}
        >
          Set Length
        </button>
        {/* Zoom controls */}
        <div className={styles.zoomControls}>
          <button
            className={styles.zoomButton}
            aria-label="Zoom out"
            onClick={() => setGapDistance((g) => Math.max(MIN_GAP_DISTANCE, g - 20))}
            type="button"
          >
            −
          </button>
          <button
            className={styles.zoomButton}
            aria-label="Zoom in"
            onClick={() => setGapDistance((g) => Math.min(MAX_GAP_DISTANCE, g + 20))}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.spellButtons}>
        {spells.map((spell) => (
          <button key={spell.id} onClick={() => addCast(spell.id)} className={styles.spellButton}>
            {spell.name}
          </button>
        ))}
      </div>

      <div className={styles.timelineWrapper}>
        <div className={styles.spellNamesColumn}>
          {activeSpellIds.map((spellId) => {
            const spell = spells.find((s) => s.id === spellId)
            if (!spell) return null
            return (
              <div key={spellId} className={styles.spellLine}>
                {/* Use prerendered Wowhead for tooltip/hover only, no icon, not clickable */}
                <div className={styles.spellName}>{prerenderedWowheadNames[spell.id]}</div>
              </div>
            )
          })}
        </div>

        <div className={styles.timelineScrollArea} ref={scrollAreaRef}>
          <div className={styles.timeline} ref={timelineRef}>
            <div className={styles.timeMarkers}>
              {timeMarkers.map((time) => (
                <div key={time} className={styles.timeMarker}>
                  {time}s
                  <div className={styles.timeMarkerLine} />
                </div>
              ))}
            </div>

            {activeSpellIds.map((spellId) => {
              const spell = spells.find((s) => s.id === spellId)
              if (!spell) return null

              const spellCasts = casts.filter((c) => c.spellId === spellId)

              return (
                <div key={spellId} className={styles.spellLine}>
                  <div className={styles.castContainer}>
                    {spellCasts.map((cast) => {
                      const castSpell = spells.find((s) => s.id === cast.spellId)
                      if (!castSpell) return null

                      // Use direct pixel positioning if available, otherwise calculate from startTime
                      const leftPosition =
                        cast.pixelPosition !== undefined
                          ? cast.pixelPosition
                          : (cast.startTime / timelineLength) * timelineMinWidth

                      // Calculate widths based on timeline scale
                      // Use getCastCooldown to get the correct cooldown for this cast
                      const cooldownWidth =
                        (getCastCooldown(cast, castSpell) / timelineLength) * timelineMinWidth
                      const durationWidth = (castSpell.duration / timelineLength) * timelineMinWidth
                      const contentInRemainder = durationWidth < 20

                      return (
                        <div
                          key={cast.id}
                          className={[
                            styles.cast,
                            draggedCast === cast.id && invalidDrag === cast.id
                              ? styles.invalidCastDrag
                              : '',
                          ].join(' ')}
                          style={{
                            left: `${leftPosition}px`,
                            height: '42px', // Ensure consistent height
                          }}
                          onMouseDown={(e) => {
                            if (e.button !== 0) return // Only allow left click for drag
                            if (e.target instanceof HTMLButtonElement) return // Don't drag if clicking button
                            handleDragStart(cast.id, e)
                          }}
                        >
                          <Cast
                            cooldown={cooldownWidth}
                            duration={durationWidth}
                            channeled={!!castSpell.channeled}
                          >
                            <div
                              className={styles.castContent}
                              style={{
                                position: 'absolute',
                                left: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                              }}
                            >
                              {prerenderedWowheads[castSpell.id]}
                              <button
                                className={styles.deleteButton}
                                onClick={() => deleteCast(cast.id)}
                              >
                                ×
                              </button>
                            </div>
                          </Cast>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Toggle warnings visibility */}
      <div style={{ margin: '12px 0' }}>
        <button
          type="button"
          className={styles.setLengthButton}
          onClick={() => setShowWarnings((v) => !v)}
        >
          {showWarnings ? 'Hide Warnings' : 'Show Warnings'}
        </button>
      </div>

      {/* Show warnings if enabled */}
      {showWarnings && warnings.length > 0 && (
        <div className={styles.warningContainer}>
          {warnings.map((warning) => {
            // Render warning message based on rule
            if (warning.ruleId === 'channeled-interruption') {
              const cast = casts.find((c) => c.id === warning.castId)
              const intersectingCast = casts.find((c) => c.id === warning.relatedCastId)
              const castSpell = spells.find((s) => s.id === cast?.spellId)
              const intersectingSpell = spells.find((s) => s.id === intersectingCast?.spellId)
              return (
                <div key={`${warning.castId}-${warning.relatedCastId}`} className={styles.warning}>
                  ⚠️ {castSpell?.name} will interrupt the channel of {intersectingSpell?.name}
                </div>
              )
            }
            if (warning.ruleId === 'missed-casts') {
              // Show the missed cast warning message
              return (
                <div key={warning.castId} className={styles.warning}>
                  ⚠️ {warning.message}
                </div>
              )
            }
            // Default fallback for unknown rules
            return (
              <div key={warning.castId} className={styles.warning}>
                ⚠️ {warning.message}
              </div>
            )
          })}
        </div>
      )}

      {draggedCast && (
        <div
          className={styles.dragOverlay}
          onMouseMove={handleDragMove}
          onMouseUp={(e) => {
            cleanupScroll()
            handleDragEnd()
          }}
          onMouseLeave={(e) => {
            cleanupScroll()
            handleDragEnd()
          }}
        />
      )}

      {/* Debug Panel: Shows all current active casts and their info */}
      <div
        style={{
          marginTop: 32,
          background: '#222',
          color: '#fff',
          padding: 16,
          borderRadius: 8,
          fontSize: 14,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Debug Panel: Active Casts</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #444' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Spell</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Start</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>End</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Duration</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Cooldown</th>
            </tr>
          </thead>
          <tbody>
            {casts.map((cast) => {
              const spell = spells.find((s) => s.id === cast.spellId)
              if (!spell) return null
              // Calculate cooldown with reduction
              const cooldown = getCastCooldown(cast, spell)
              const duration = spell.duration
              const start = cast.startTime
              const end = start + duration
              return (
                <tr key={cast.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '4px 8px' }}>{spell.name}</td>
                  <td style={{ padding: '4px 8px' }}>{start.toFixed(2)}s</td>
                  <td style={{ padding: '4px 8px' }}>{end.toFixed(2)}s</td>
                  <td style={{ padding: '4px 8px' }}>{duration}s</td>
                  <td style={{ padding: '4px 8px' }}>{cooldown}s</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
