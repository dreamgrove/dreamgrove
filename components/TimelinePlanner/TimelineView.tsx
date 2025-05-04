import React, { useRef, useState, useEffect } from 'react'
import Cast from './Cast'
import Markers from './Markers'
import SpellCastsRow from './SpellCastsRow'
import SpellButtons from './SpellButtons'
import Debug from './Debug'
import Checkboxes from './Checkboxes'
import { applyTimelineEffects, timelineEffects } from './TimelineEffects'
import { SpellInfo, CastInfo, SpellCasts, SpellChargeCasts, ChargeIndex } from './types'

interface TimelineViewProps {
  total_length_s: number
  view_length_s: number // seconds shown per 100% width
  setViewLength: React.Dispatch<React.SetStateAction<number>> // Add setViewLength prop
  marker_spacing_s: number // seconds between markers
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
}

export default function TimelineView({
  total_length_s,
  view_length_s,
  setViewLength, // Add setViewLength to destructured props
  marker_spacing_s,
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
}: TimelineViewProps) {
  // Ref and state for rightSide (scrollable area) width and scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)

  // Add effective view length state instead of zoom level
  const [effectiveViewLength, setEffectiveViewLength] = useState(view_length_s)

  // Track Alt key state
  const [isAltKeyPressed, setIsAltKeyPressed] = useState(false)

  // State for active effects
  const [activeEffects, setActiveEffects] = useState<string[]>([])

  // State for casts in the timeline - using the new SpellChargeCasts type
  const [currentSpells, setCurrentSpells] = useState<SpellChargeCasts[]>([])
  const [patchedSpells, setPatchedSpells] = useState<SpellChargeCasts[]>([])

  // Add state to track which spell charges are collapsed (inverse of expanded, since default is now expanded)
  const [collapsedChargeSpells, setCollapsedChargeSpells] = useState<string[]>([])

  // Toggle function for expanding/collapsing charge rows
  const toggleChargeExpansion = (spellId: string) => {
    // console.log(`Toggle called for spell: ${spellId}`)
    // console.log(`Before toggle - collapsedChargeSpells:`, collapsedChargeSpells)

    // Force the state to be a new array reference
    setCollapsedChargeSpells((prev) => {
      const isCurrentlyCollapsed = prev.includes(spellId)
      // console.log(
      //   `Spell ${spellId} is currently ${isCurrentlyCollapsed ? 'collapsed' : 'expanded'}`
      // )

      // If it's expanded, collapse it; if it's collapsed, expand it
      const newState = isCurrentlyCollapsed
        ? prev.filter((id) => id !== spellId)
        : [...prev, spellId]

      // console.log(`After toggle - new collapsedChargeSpells will be:`, newState)
      return newState
    })
  }

  // Watch for changes to currentSpells to auto-expand new multi-charge spells
  useEffect(() => {
    // Look for new multi-charge spells
    const multiChargeSpells = currentSpells.filter(
      (s) => s.spell.charges && s.spell.charges > 1 && s.chargeIndex === 0
    )

    if (multiChargeSpells.length > 0) {
      // For each multi-charge spell, make sure it's not in the collapsed state
      const spellIdsToExpand: string[] = []

      multiChargeSpells.forEach((spell) => {
        // If this spell is in the collapsed list, add it to our list for removal
        if (collapsedChargeSpells.includes(spell.spell.id)) {
          spellIdsToExpand.push(spell.spell.id)
        }
      })

      // If we have spells to expand, update the collapsedChargeSpells state
      if (spellIdsToExpand.length > 0) {
        // console.log(`Auto-expanding newly added spell charges:`, spellIdsToExpand)
        setCollapsedChargeSpells((prev) => prev.filter((id) => !spellIdsToExpand.includes(id)))
      }
    }
  }, [currentSpells, collapsedChargeSpells])

  // Update width on mount and resize
  useEffect(() => {
    function updateWidth() {
      if (scrollContainerRef.current) {
        setScrollContainerWidth(scrollContainerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Track Alt key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault()
        // console.log('Alt key down')
        setIsAltKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        // console.log('Alt key up')
        setIsAltKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Add wheel event handler for horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    const handleWheel = (e: WheelEvent) => {
      if (scrollContainer) {
        e.preventDefault()

        // Use the tracked Alt key state
        if (isAltKeyPressed || e.altKey) {
          // console.log('ALT zoom activated', e.deltaY, isAltKeyPressed)

          // Change view length by 5 seconds based on wheel direction
          const step = 5 // 5 seconds per scroll step
          const direction = e.deltaY > 0 ? 1 : -1 // 1 for zoom out (more time), -1 for zoom in (less time)

          // Calculate new effective view length, ensuring minimum of 10s and maximum of 300s
          const newEffectiveViewLength = Math.max(
            10,
            Math.min(300, effectiveViewLength + direction * step)
          )

          // console.log('Setting new effective view length:', newEffectiveViewLength)

          // Set new effective view length
          setEffectiveViewLength(newEffectiveViewLength)
        } else {
          // Regular horizontal scrolling
          scrollContainer.scrollLeft += e.deltaY
        }
      }
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [effectiveViewLength, isAltKeyPressed])

  // Helper function to convert SpellChargeCasts to legacy SpellCasts for effects system
  const convertToLegacySpellCasts = (chargeSpells: SpellChargeCasts[]): SpellCasts[] => {
    // console.log('Converting to legacy SpellCasts:', chargeSpells)

    if (!chargeSpells || chargeSpells.length === 0) return []

    // Group by spell ID
    const spellGroups: Record<string, SpellChargeCasts[]> = {}

    chargeSpells.forEach((chargeSpell) => {
      const spellId = chargeSpell.spell.id
      if (!spellGroups[spellId]) {
        spellGroups[spellId] = []
      }
      spellGroups[spellId].push(chargeSpell)
    })

    // Convert each group to a SpellCasts object
    return Object.entries(spellGroups).map(([spellId, group]) => {
      // console.log(`Converting spell ${spellId} with ${group.length} charge rows`)

      // Combine all casts from all charges
      const allCasts = group.flatMap((chargeSpell) =>
        chargeSpell.casts.map((cast) => ({
          ...cast,
          chargeIndex: chargeSpell.chargeIndex, // Ensure chargeIndex is preserved
        }))
      )

      // console.log(`Combined ${allCasts.length} casts for spell ${spellId}`)

      return {
        spell: group[0].spell,
        casts: allCasts,
      }
    })
  }

  // Helper function to convert legacy SpellCasts back to SpellChargeCasts
  const convertToChargeSpellCasts = (legacySpells: SpellCasts[]): SpellChargeCasts[] => {
    // console.log('Converting from legacy SpellCasts:', legacySpells)

    if (!legacySpells || legacySpells.length === 0) return []

    const result: SpellChargeCasts[] = []

    legacySpells.forEach((legacySpell) => {
      // Group casts by chargeIndex
      const castsByCharge: Record<string, CastInfo[]> = {}

      legacySpell.casts.forEach((cast) => {
        const chargeIndex = cast.chargeIndex !== undefined ? cast.chargeIndex : 0
        const chargeKey = chargeIndex.toString()

        if (!castsByCharge[chargeKey]) {
          castsByCharge[chargeKey] = []
        }
        castsByCharge[chargeKey].push(cast)
      })

      // console.log(`Grouped casts for spell ${legacySpell.spell.id} by charge:`, castsByCharge)

      // Create a SpellChargeCasts for each charge
      Object.entries(castsByCharge).forEach(([chargeIndexStr, casts]) => {
        const chargeIndex = parseInt(chargeIndexStr, 10)

        result.push({
          spell: legacySpell.spell,
          chargeIndex,
          casts,
        })

        // console.log(
        //   `Created charge row for spell ${legacySpell.spell.id}, chargeIndex ${chargeIndex} with ${casts.length} casts`
        // )
      })
    })

    // console.log('Conversion result:', result)
    return result
  }

  useEffect(() => {
    if (currentSpells.length > 0) {
      // console.log('TimelineView: Applying effects due to activeEffects or spells change')
      // console.log('Current active effects:', activeEffects)
      // console.log('Current spells before effects:', currentSpells)

      // Convert to legacy format for effects system
      const legacySpells = convertToLegacySpellCasts(currentSpells)

      // Apply effects
      const patchedLegacySpells = applyTimelineEffects(legacySpells, activeEffects, spells)

      // Convert back to charge-based format
      const patchedChargeSpells = convertToChargeSpellCasts(patchedLegacySpells)

      // console.log('Patched spells after effects:', patchedChargeSpells)

      setPatchedSpells(patchedChargeSpells)
    } else {
      // Reset patched spells when there are no current spells
      setPatchedSpells([])
    }
  }, [currentSpells, activeEffects, spells])

  // We calculate the effective view length in seconds
  const effective_view_length_s = effectiveViewLength

  // Using the effective view length in seconds we can calculate the effective view length in pixels
  const effective_num_windows = total_length_s / effective_view_length_s

  //Using the effective view length in pixels we can calculate the effective total length in pixels
  const effective_total_length_px = scrollContainerWidth * effective_num_windows

  const total_length_px = (scrollContainerWidth * total_length_s) / view_length_s

  //using the effective number of windows we can calculate the effective_view_length_px
  const effective_view_length_px = total_length_px / effective_num_windows

  const pixelsPerSecond = effective_total_length_px / total_length_s

  // The marker system uses two measurements:
  // 1. marker_spacing_px: Visual spacing between markers on screen (doesn't change with zoom)
  // 2. marker_spacing_s: Time value displayed on each marker (adjusts with zoom via effective_view_length_s)
  //
  // When zooming, the timeline adjusts by showing more/less time in the same visual space,
  // so the marker_spacing_s changes while marker_spacing_px remains constant.

  // Pixel spacing depends only on the container width and marker count
  // Time spacing depends on the effective view length (adjusted by zoom)

  const handleCastDelete = (castId: string) => {
    // Update currentSpells state
    setCurrentSpells((prevSpells) =>
      prevSpells.map((spellCast) => ({
        ...spellCast,
        casts: spellCast.casts.filter((cast) => cast.id !== castId),
      }))
    )
  }

  const handleCastMove = (castId: string, newStartTime: number, chargeIndex: number) => {
    setCurrentSpells((prevSpells) => {
      // First, make a copy of the prevSpells array to work with
      const updatedSpells = [...prevSpells]

      // Find the spell that this cast belongs to
      const spellCastIndex = updatedSpells.findIndex(
        (spellCast) =>
          spellCast.chargeIndex === chargeIndex &&
          spellCast.casts.some((cast) => cast.id === castId)
      )

      if (spellCastIndex === -1) return prevSpells // Cast not found

      const spellCast = updatedSpells[spellCastIndex]
      const castIndex = spellCast.casts.findIndex((cast) => cast.id === castId)
      if (castIndex === -1) return prevSpells // Cast not found

      // Get the cast and its duration
      const cast = spellCast.casts[castIndex]
      const duration = cast.end_s - cast.start_s

      // Create an updated spell cast with the moved cast
      const updatedSpellCast = {
        ...spellCast,
        casts: [...spellCast.casts],
      }

      // Update the cast with its new position
      updatedSpellCast.casts[castIndex] = {
        ...cast,
        start_s: newStartTime,
        end_s: newStartTime + duration,
      }

      // Replace the spell cast in our updated spells
      updatedSpells[spellCastIndex] = updatedSpellCast

      return updatedSpells
    })
  }

  // Add state for debug panel visibility
  const [showDebug, setShowDebug] = useState(false)
  const toggleDebug = () => setShowDebug((prev) => !prev)

  // Mock warnings for demo
  const [warnings] = useState<Array<{ id: string; castId: string; type: string; message: string }>>(
    []
  )

  // Filter rows to show only visible ones based on charge collapse state
  const filteredSpells = patchedSpells.filter((spellCast) => {
    // Always show the first row (chargeIndex 0)
    if (spellCast.chargeIndex === 0) return true

    // For charge rows (index > 0), only show if the spell is NOT in collapsedChargeSpells
    const result = !collapsedChargeSpells.includes(spellCast.spell.id)

    return result
  })

  // Debug the filtered results
  // console.log('Final filteredSpells:', filteredSpells)
  // console.log('All patchedSpells before filtering:', patchedSpells)
  // console.log('All currentSpells:', currentSpells)

  return (
    <div className="flex w-full flex-col">
      {/* Checkboxes for effects */}
      <Checkboxes
        effects={timelineEffects}
        activeEffects={activeEffects}
        currentSpells={convertToLegacySpellCasts(currentSpells)} // Convert to legacy format for compatibility
        spells={spells}
        onEffectToggle={(effectId, isActive) => {
          // console.log(`TimelineView onEffectToggle: effectId=${effectId}, isActive=${isActive}`)
          // console.log(`Current activeEffects before update:`, activeEffects)

          // Important: Create a new array reference to ensure React detects the state change
          const newActiveEffects = isActive
            ? [...activeEffects, effectId]
            : activeEffects.filter((id) => id !== effectId)

          // console.log(`New activeEffects after update:`, newActiveEffects)

          // Set the state with the new array
          setActiveEffects(newActiveEffects)
        }}
      />

      {/* Debug info showing current view length */}
      <div className="mb-2 flex items-center space-x-2 text-xs text-gray-400">
        <span>View length: {Math.round(effective_view_length_s)}s</span>
        <button
          className="rounded bg-gray-700 px-2 py-0.5 text-white hover:bg-gray-600"
          onClick={() => {
            const newViewLength = Math.max(10, effectiveViewLength - 5)
            setEffectiveViewLength(newViewLength)
          }}
          title="Zoom in (decrease view length)"
        >
          +
        </button>
        <button
          className="rounded bg-gray-700 px-2 py-0.5 text-white hover:bg-gray-600"
          onClick={() => {
            const newViewLength = Math.min(300, effectiveViewLength + 5)
            setEffectiveViewLength(newViewLength)
          }}
          title="Zoom out (increase view length)"
        >
          -
        </button>
        <button
          className="rounded bg-gray-700 px-2 py-0.5 text-white hover:bg-gray-600"
          onClick={() => {
            setEffectiveViewLength(view_length_s)
          }}
          title="Reset view length"
        >
          Reset
        </button>

        {/* Debug button to force create a second charge row */}
        <button
          className="ml-4 rounded bg-red-700 px-2 py-0.5 text-white hover:bg-red-600"
          onClick={() => {
            // Find the first multi-charge spell
            const multiChargeSpell = currentSpells.find(
              (s) => s.spell.charges && s.spell.charges > 1 && s.chargeIndex === 0
            )

            if (multiChargeSpell) {
              // console.log('Found multi-charge spell:', multiChargeSpell)

              // Create a second charge row
              const secondChargeRow: SpellChargeCasts = {
                spell: multiChargeSpell.spell,
                chargeIndex: 1,
                casts: multiChargeSpell.casts.map((cast) => ({
                  ...cast,
                  id: `${cast.id}-charge-1`,
                  chargeIndex: 1,
                  start_s: cast.start_s + 20, // Offset by 20 seconds for visibility
                  end_s: cast.end_s + 20,
                })),
              }

              // console.log('Created second charge row:', secondChargeRow)

              // Add to current spells
              setCurrentSpells((prev) => [...prev, secondChargeRow])
            } else {
              // console.log('No multi-charge spell found with chargeIndex 0')
              // console.log('Current spells:', currentSpells)
            }
          }}
          title="DEBUG: Force add charge row"
        >
          DEBUG Add Charge
        </button>

        {/* Debug button to force toggle collapse */}
        <button
          className="ml-2 rounded bg-blue-700 px-2 py-0.5 text-white hover:bg-blue-600"
          onClick={() => {
            // Find the first multi-charge spell
            const multiChargeSpells = currentSpells.filter(
              (s) => s.spell.charges && s.spell.charges > 1 && s.chargeIndex === 0
            )

            if (multiChargeSpells.length > 0) {
              // Toggle the collapse state of all multi-charge spells
              multiChargeSpells.forEach((spellRow) => {
                // console.log(`DEBUG: Forcing toggle of ${spellRow.spell.id}`)
                toggleChargeExpansion(spellRow.spell.id)
              })
            } else {
              // console.log('No multi-charge spells found')
            }
          }}
          title="DEBUG: Toggle collapse"
        >
          DEBUG Toggle
        </button>
      </div>

      {/* Spell Buttons at the top */}
      <SpellButtons
        currentSpells={currentSpells}
        setCurrentSpells={setCurrentSpells}
        total_length_s={total_length_s}
        spells={spells}
      />

      {/* Timeline view */}
      <div className="flex w-full flex-row">
        {/* Left side: spell names, vertically offset */}
        <div className="w-[200px] min-w-[120px] shrink-0">
          <div className="mt-10">
            <div className="flex flex-col items-start justify-start pl-2">
              {filteredSpells.map((spellCast) => (
                <div
                  key={`spell-name-${spellCast.spell.id}-charge-${spellCast.chargeIndex}`}
                  className="mb-2 flex h-10 w-full items-center pb-2"
                >
                  <div className="w-full truncate text-left">
                    {spellCast.spell.charges &&
                      spellCast.spell.charges > 1 &&
                      spellCast.chargeIndex === 0 && (
                        <button
                          onClick={() => toggleChargeExpansion(spellCast.spell.id)}
                          className="mr-1 font-bold text-yellow-500 hover:text-yellow-300 focus:outline-none"
                          title={
                            collapsedChargeSpells.includes(spellCast.spell.id)
                              ? 'Show charges'
                              : 'Hide charges'
                          }
                        >
                          {collapsedChargeSpells.includes(spellCast.spell.id) ? '+' : '−'}
                        </button>
                      )}
                    {/* Only show wowheadComponent for the main spell row (chargeIndex === 0) */}
                    {spellCast.chargeIndex === 0 ? (
                      wowheadNameMap[spellCast.spell.id] || spellCast.spell.name
                    ) : (
                      <div className="flex w-full justify-end">
                        <span className="text-sm text-gray-400">
                          Charge {spellCast.chargeIndex + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right side: scrollable timeline, contains markers and casts */}
        <div className="relative min-h-[80px] flex-1 overflow-x-auto pl-6" ref={scrollContainerRef}>
          {/* Markers overlay, scrolls with content */}
          <Markers
            marker_spacing_s={marker_spacing_s}
            total_length_s={total_length_s}
            pixelsPerSecond={pixelsPerSecond}
            className="z-10"
          />
          {/* Casts/timeline rows */}
          <div
            className="relative mt-10 flex flex-col"
            style={{
              width: `${effective_total_length_px}px`,
              minHeight: `${filteredSpells.length * 40}px`, // Height based on visible rows
            }}
          >
            {/* Render a SpellCastsRow for each spell and charge */}
            {filteredSpells.map((spellCast) => (
              <SpellCastsRow
                key={`spell-row-${spellCast.spell.id}-charge-${spellCast.chargeIndex}`}
                spellName={spellCast.spell.name}
                casts={spellCast.casts}
                spellInfo={spellCast.spell}
                chargeIndex={spellCast.chargeIndex}
                timeline_total_length_px={effective_total_length_px}
                total_length_s={total_length_s}
                wowheadComponent={
                  spellCast.chargeIndex === 0 ? (
                    wowheadMap[spellCast.spell.id] || <span>{spellCast.spell.name}</span>
                  ) : (
                    <span></span>
                  ) // Empty span for charge rows
                }
                onCastDelete={handleCastDelete}
                onCastMove={handleCastMove}
                className="mb-2 h-10"
                allSpellRows={currentSpells} // Pass all rows for charge validation
              />
            ))}
          </div>
        </div>
      </div>

      {/* Debug */}
      <Debug
        currentSpells={convertToLegacySpellCasts(patchedSpells)} // Convert to legacy format for compatibility
        timelineSettings={{
          totalLength: total_length_s,
          timelineWidth: total_length_px,
          markerSpacing: marker_spacing_s,
        }}
        warnings={warnings}
        showDebug={showDebug}
        toggleDebug={toggleDebug}
      />
    </div>
  )
}
