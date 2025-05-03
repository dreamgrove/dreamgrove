import React, { useRef, useState, useEffect } from 'react'
import Cast from './Cast'
import Markers from './Markers'
import SpellCastsRow from './SpellCastsRow'
import SpellButtons from './SpellButtons'
import Debug from './Debug'
import Checkboxes from './Checkboxes'
import { timelineEffects } from './TimelineEffects'
import { SpellInfo, CastInfo, SpellCasts } from './types'

interface TimelineViewProps {
  total_length_s: number
  view_length_s: number // seconds shown per 100% width
  n_markers_per_view: number // number of markers to show per window
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
}

export default function TimelineView({
  total_length_s,
  view_length_s,
  n_markers_per_view,
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
}: TimelineViewProps) {
  // Ref and state for rightSide (scrollable area) width and scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0)

  // State for active effects
  const [activeEffects, setActiveEffects] = useState<string[]>([])

  // State for casts in the timeline
  const [currentSpells, setCurrentSpells] = useState<SpellCasts[]>([])

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

  // Calculate the visible window's start (in seconds)
  const numWindows = total_length_s / view_length_s
  const timeline_total_length_px = scrollContainerWidth * numWindows

  // Calculate total number of markers: marker_count per window * number of windows
  let total_markers = Math.floor(n_markers_per_view * numWindows)
  if (total_markers < 2) total_markers = 2 // Always at least start and end
  // Markers: evenly spaced, last marker at total_length
  const marker_spacing_px = scrollContainerWidth / n_markers_per_view
  const marker_spacing_s = view_length_s / n_markers_per_view

  // Handle effect application
  const handleEffectsApplied = (updatedSpells: SpellCasts[]) => {
    // Safety check before updating state
    if (Array.isArray(updatedSpells) && updatedSpells.length > 0) {
      console.log('Setting updated spells from effects:', updatedSpells)
      setCurrentSpells([...updatedSpells])
    } else if (updatedSpells.length === 0 && currentSpells.length > 0) {
      console.error('Warning: Effects would remove all spells, keeping original spells instead')
    }
  }

  const handleCastDelete = (castId: string) => {
    // Update currentSpells state
    setCurrentSpells((prevSpells) =>
      prevSpells.map((spellCast) => ({
        ...spellCast,
        casts: spellCast.casts.filter((cast) => cast.id !== castId),
      }))
    )
  }

  const handleCastMove = (castId: string, newStartTime: number) => {
    setCurrentSpells((prevSpells) =>
      prevSpells.map((spellCast) => ({
        ...spellCast,
        casts: spellCast.casts.map((cast) => {
          if (cast.id === castId) {
            const duration = cast.end_s - cast.start_s
            return {
              ...cast,
              start_s: newStartTime,
              end_s: newStartTime + duration,
            }
          }
          return cast
        }),
      }))
    )
  }

  // Add state for debug panel visibility
  const [showDebug, setShowDebug] = useState(false)
  const toggleDebug = () => setShowDebug((prev) => !prev)

  // Mock warnings for demo
  const [warnings] = useState<Array<{ id: string; castId: string; type: string; message: string }>>(
    []
  )

  return (
    <div className="flex w-full flex-col">
      {/* Checkboxes for effects */}
      <Checkboxes
        effects={timelineEffects}
        activeEffects={activeEffects}
        currentSpells={currentSpells}
        spells={spells}
        timeline_total_length_px={timeline_total_length_px}
        total_length_s={total_length_s}
        onEffectsApplied={handleEffectsApplied}
        onEffectToggle={(effectId, isActive) => {
          if (isActive) {
            setActiveEffects((prev) => [...prev, effectId])
          } else {
            setActiveEffects((prev) => prev.filter((id) => id !== effectId))
          }
        }}
      />

      {/* Spell Buttons at the top */}
      <SpellButtons
        currentSpells={currentSpells as any} // Type assertion to avoid complex type reconciliation
        setCurrentSpells={setCurrentSpells as any}
        timeline_total_length_px={timeline_total_length_px}
        total_length_s={total_length_s}
        spells={spells}
      />

      {/* Timeline view */}
      <div className="flex w-full flex-row">
        {/* Left side: spell names, vertically offset */}
        <div className="w-[250px] min-w-[120px] shrink-0">
          <div className="mt-10">
            <div className="flex flex-col items-end justify-start pr-2">
              {currentSpells.map((spellCast) => (
                <div
                  key={`spell-name-${spellCast.spell.id}`}
                  className="mb-2 flex h-10 items-center pb-2"
                >
                  {wowheadNameMap[spellCast.spell.id] || spellCast.spell.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right side: scrollable timeline, contains markers and casts */}
        <div className="relative min-h-[80px] flex-1 overflow-x-auto" ref={scrollContainerRef}>
          {/* Markers overlay, scrolls with content */}
          <Markers
            total_markers={total_markers}
            marker_spacing_px={marker_spacing_px}
            marker_spacing_s={marker_spacing_s}
            total_length_s={total_length_s}
            className="z-10"
          />
          {/* Casts/timeline rows */}
          <div
            className="relative mt-10 flex flex-col"
            style={{
              width: `${timeline_total_length_px}px`,
              minHeight: `${currentSpells.length * 40}px`, // Height based on number of spells
            }}
          >
            {/* Render a SpellCastsRow for each spell */}
            {currentSpells.map((spellCast, index) => (
              <SpellCastsRow
                key={`spell-row-${spellCast.spell.id}`}
                spellName={spellCast.spell.name}
                casts={spellCast.casts as CastInfo[]} // Type assertion to avoid complex type reconciliation
                spellInfo={spellCast.spell}
                timeline_total_length_px={timeline_total_length_px}
                total_length_s={total_length_s}
                wowheadComponent={
                  wowheadMap[spellCast.spell.id] || <span>{spellCast.spell.name}</span>
                }
                onCastDelete={handleCastDelete}
                onCastMove={handleCastMove}
                className="mb-2 h-10"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Debug */}
      <Debug
        currentSpells={currentSpells as any} // Type assertion for compatibility
        timelineSettings={{
          totalLength: total_length_s,
          timelineWidth: timeline_total_length_px,
          gapDistance: marker_spacing_px,
        }}
        warnings={warnings}
        showDebug={showDebug}
        toggleDebug={toggleDebug}
      />
    </div>
  )
}
