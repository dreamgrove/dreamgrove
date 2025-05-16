import React, { useRef, useState, useEffect } from 'react'
import Markers from './Markers'
import SpellCastsRow from './SpellCastsRow'
import SpellButtons from './SpellButtons'
import CustomElement from './CustomElement'
import Debug from './Debug'
import Checkboxes from './Checkboxes'
import { applyTimelineEffects, timelineEffects } from './TimelineEffects'
import { Cast, SpellInfo, SpellTimeline, PlayerAction, Event, TimelineToRender } from './types'
import SpellMarkers from './SpellMarkers'
import { useTimeline, useTimelineControls } from './TimelineContext'
import { generateBaseQueue, processEventQueue, processPlayerActions } from './TimelineEvents'
import { EventQueue } from './TimelineEvents'

interface TimelineViewProps {
  total_length_s: number
  view_length_s: number // seconds shown per 100% width
  setViewLength: React.Dispatch<React.SetStateAction<number>>
  marker_spacing_s: number // seconds between markers
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
  wowheadMarkerMap?: Record<string, React.ReactNode>
  averageTimestamps?: Record<string, number[]>
  currentEncounterId?: string
}

export default function TimelineView({
  total_length_s,
  setViewLength,
  marker_spacing_s,
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
  currentEncounterId = 'empty',
}: TimelineViewProps) {
  const {
    effective_view_length_s,
    effective_total_length_px,
    pixelsPerSecond,
    isAltKeyPressed,
    registerScrollContainer,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useTimelineControls()

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      registerScrollContainer(scrollContainerRef.current)
    }
  }, [registerScrollContainer])

  const [activeEffects, setActiveEffects] = useState<string[]>([])

  const [inputActions, setInputActions] = useState<PlayerAction[]>([])
  const [baseQueue, setBaseQueue] = useState<EventQueue>(new EventQueue())
  const [processedState, setProcessedState] = useState<TimelineToRender>({ spells: [] })

  const [currentSpells, setCurrentSpells] = useState<SpellTimeline[]>([])
  const [patchedSpells, setPatchedSpells] = useState<SpellTimeline[]>([])

  const [collapsedChargeSpells, setCollapsedChargeSpells] = useState<string[]>([])

  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(spells)

  useEffect(() => {
    setLocalSpells(spells)
  }, [spells])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainer) {
        e.preventDefault()
        if (isAltKeyPressed || e.altKey) {
          if (e.deltaY > 0) {
            zoomOut(5)
          } else {
            zoomIn(5)
          }
        } else {
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
  }, [isAltKeyPressed, zoomIn, zoomOut])

  useEffect(() => {
    const queue = generateBaseQueue(inputActions)
    setBaseQueue(queue)

    const timeline = processEventQueue(queue, localSpells)
    setProcessedState(timeline)
  }, [inputActions, localSpells])

  // Function to modify a cast
  const handleModifyAction = (castId: string, newTime: number) => {
    const actionIndex = inputActions.findIndex((a) => a.id === castId)

    if (actionIndex >= 0) {
      const newActions = [...inputActions]
      newActions[actionIndex].instant = newTime
      setInputActions(newActions)
    }
  }

  // Function to remove a player cast
  const handleRemoveAction = (castId: string) => {
    const cast = findCastById(castId, processedState)
    if (!cast) return

    setInputActions((prev) =>
      prev.filter(
        (action) =>
          !(
            action.spell.spellId === cast.spell.spellId &&
            Math.abs(action.instant - cast.start_s) < 0.001
          )
      )
    )
  }

  // Helper function to find a cast by ID in the processed state
  const findCastById = (castId: string, timeline: TimelineToRender): Cast | null => {
    for (const spell of timeline.spells) {
      const cast = spell.casts.find((c) => c.id === castId)
      if (cast) return cast
    }
    return null
  }

  // For compatibility with the existing UI
  const handleCastDelete = (castId: string) => {
    handleRemoveAction(castId)
  }

  const handleCastMove = (castId: string, newStartTime: number) => {
    handleModifyAction(castId, newStartTime)
  }

  const [showDebug, setShowDebug] = useState(true)
  const toggleDebug = () => setShowDebug((prev) => !prev)

  // Mock warnings for demo
  const [warnings] = useState<Array<{ id: string; castId: string; type: string; message: string }>>(
    []
  )

  const handleEffectToggle = (effectId: string, isSelected: boolean) => {
    setActiveEffects((prev) => {
      if (isSelected) {
        return [...prev, effectId]
      } else {
        return prev.filter((id) => id !== effectId)
      }
    })
  }
  // State for custom elements
  const [customElements, setCustomElements] = useState<Record<string, React.ReactNode>>({})

  const handleCreateCustomElement = (params: SpellInfo) => {
    const newSpell: SpellInfo = {
      id: `custom-${Date.now()}`,
      spellId: Math.floor(Math.random() * 1000000) + 900000,
      name: params.name,
      channel_duration: params.channel_duration,
      effect_duration: params.effect_duration,
      cooldown: params.cooldown,
      charges: params.charges,
      channeled: params.channeled,
    }

    setLocalSpells([...localSpells, newSpell])
    console.log('Create custom element:', params)
  }

  console.log(localSpells)

  return (
    <div className="timeline flex w-full flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <h2 className="flex-grow text-lg font-semibold">{currentEncounterId}</h2>

        {/* Custom element button */}
        <CustomElement onCreate={handleCreateCustomElement} />

        {/* Zoom controls */}
        <button
          onClick={() => resetZoom()}
          className="rounded bg-gray-800 px-2 py-1 text-sm hover:bg-gray-700"
        >
          Reset
        </button>
        <button
          onClick={() => zoomOut(10)}
          className="rounded bg-gray-800 px-2 py-1 text-sm hover:bg-gray-700"
        >
          -
        </button>
        <button
          onClick={() => zoomIn(10)}
          className="rounded bg-gray-800 px-2 py-1 text-sm hover:bg-gray-700"
        >
          +
        </button>
      </div>

      {false && (
        <Checkboxes
          effects={timelineEffects}
          activeEffects={activeEffects}
          onEffectToggle={handleEffectToggle}
          items={timelineEffects.map((effect) => ({
            id: effect.id,
            label: effect.name,
            description: effect.description,
          }))}
          selectedItems={activeEffects}
          onToggle={handleEffectToggle}
        />
      )}

      <SpellButtons
        currentSpells={processedState}
        setCurrentSpells={setInputActions}
        spells={localSpells}
      />

      {/* Timeline view */}
      <div className="flex min-h-[200px] w-full flex-row">
        {/* Left side: spell names, vertically offset */}
        <div className="w-[200px] min-w-[120px] shrink-0">
          <div className="mt-10">
            <div className="flex flex-col items-start justify-start pl-2">
              {processedState.spells.map((spellCast) => (
                <div
                  key={`spell-name-${spellCast.spell.id}`}
                  style={{ height: 67 * spellCast.chargesUsed }}
                  className={`flex h-20 w-full items-center pr-2 ${spellCast.spell.charges && !collapsedChargeSpells.includes(spellCast.spell.id) ? 'border-r-2 border-orange-500/30' : ''}`}
                >
                  <div className="mb-[-20px] w-full truncate text-right">
                    {wowheadNameMap[spellCast.spell.id] || spellCast.spell.name}
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
          />
          <SpellMarkers spellInfo={averageTimestamps} wowheadMap={wowheadMarkerMap} />
          {/* Casts/timeline rows */}
          <div
            className="relative mt-10 flex flex-col"
            style={{
              width: `${effective_total_length_px}px`,
              minHeight: `${currentSpells.length * 40}px`, // Height based on visible rows
            }}
          >
            {/* Render a SpellCastsRow for each spell and charge */}
            {processedState.spells.map((spellCast) => (
              <SpellCastsRow
                key={`spell-row-${spellCast.spell.id}`}
                spellTimeline={spellCast}
                wowheadComponent={
                  customElements[spellCast.spell.id] ||
                  wowheadMap[spellCast.spell.id] || <span>{spellCast.spell.name}</span>
                }
                onCastDelete={handleCastDelete}
                onCastMove={handleCastMove}
                className="mb-2 flex h-12 items-center"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Debug when enabled */}
      <Debug
        processedTimeline={processedState}
        timelineSettings={{
          totalLength: total_length_s,
          timelineWidth: effective_total_length_px,
          markerSpacing: marker_spacing_s,
        }}
        warnings={warnings}
        showDebug={showDebug}
        toggleDebug={toggleDebug}
      />
    </div>
  )
}
