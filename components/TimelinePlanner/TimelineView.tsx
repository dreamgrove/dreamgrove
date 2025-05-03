import React, { useRef, useState, useEffect } from 'react'
import Cast, { CastInfo } from './Cast'
import Markers from './Markers'
import SpellCastsRow from './SpellCastsRow'
import SpellButtons from './SpellButtons'
import Debug from './Debug'

interface Spell {
  id: string
  spellId: number
  name: string
  channel_duration: number
  effect_duration: number
  cooldown: number
  channeled?: boolean
}

interface TimelineViewProps {
  total_length_s: number
  view_length_s: number // seconds shown per 100% width
  n_markers_per_view: number // number of markers to show per window
  spells: Spell[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
}

// Extended CastInfo with name and id for demo purposes
interface SpellCastData {
  spellName: string
  spellId: string | number
  casts: (CastInfo & { id: string })[]
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

  const [currentSpells, setCurrentSpells] = useState<SpellCastData[]>([])

  // Update timeline_total_length_px and total_length_s in casts when they change
  useEffect(() => {
    setCurrentSpells((prevSpells) =>
      prevSpells.map((spell) => ({
        ...spell,
        casts: spell.casts.map((cast) => ({
          ...cast,
          timeline_total_length_px,
          total_length_s,
        })),
      }))
    )
  }, [timeline_total_length_px, total_length_s])

  const handleCastClick = (castId: string) => {
    console.log('Cast clicked:', castId)
  }

  const handleCastDragStart = (castId: string, event: React.MouseEvent) => {
    console.log('Cast drag started:', castId)
  }

  const handleCastDelete = (castId: string) => {
    setCurrentSpells((prevSpells) =>
      prevSpells.map((spell) => ({
        ...spell,
        casts: spell.casts.filter((cast) => cast.id !== castId),
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
      {/* Spell Buttons at the top */}
      <SpellButtons
        currentSpells={currentSpells}
        setCurrentSpells={setCurrentSpells}
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
              {currentSpells.map((spell) => (
                <div
                  key={`spell-name-${spell.spellId}`}
                  className="mb-2 flex h-10 items-center pb-2"
                >
                  {wowheadNameMap[spell.spellId as string] || spell.spellName}
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
            {currentSpells.map((spell, index) => (
              <SpellCastsRow
                key={`spell-row-${spell.spellId}`}
                spellName={spell.spellName}
                casts={spell.casts}
                wowheadComponent={
                  wowheadMap[spell.spellId as string] || <span>{spell.spellName}</span>
                }
                onCastClick={handleCastClick}
                onCastDragStart={handleCastDragStart}
                onCastDelete={handleCastDelete}
                className="mb-2 h-10"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Debug */}
      <Debug
        currentSpells={currentSpells}
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
