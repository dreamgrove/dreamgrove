import React, { useRef, useState, useEffect } from 'react'
import Markers from './Markers'
import SpellCastsRow from './SpellCastsRow'
import SpellButtons from './SpellButtons'
import CustomElement from './CustomElement'
import Debug from './Debug'
import Checkboxes from './Checkboxes'
import ActionBindings from './ActionBindings'
import { applyTimelineEffects, timelineEffects } from './TimelineEffects'
import {
  Cast,
  SpellInfo,
  SpellTimeline,
  PlayerAction,
  TimelineToRender,
  SpellToRender,
  Talents,
  TimelineEvent,
} from '../../lib/types/cd_planner'
import SpellMarkers from './SpellMarkers'
import { useTimeline, useTimelineControls } from './TimelineContext'
import { generateBaseQueue, processEventQueue } from './TimelineEvents'
import { EventQueue } from './TimelineEvents'
import { GlobalAction } from '../../lib/types/global_handler'
import { earlySpring } from './GlobalHandlers/earlySpring'
import { controlOfTheDream } from './GlobalHandlers/controlOfTheDream'
import EventMarkers from './EventMarkers'
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
    isControlKeyPressed,
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
  const [processedEvents, setProcessedEvents] = useState<TimelineEvent[]>([])
  const [currentSpells, setCurrentSpells] = useState<SpellTimeline[]>([])
  const [patchedSpells, setPatchedSpells] = useState<SpellTimeline[]>([])

  const [collapsedChargeSpells, setCollapsedChargeSpells] = useState<string[]>([])

  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(spells)

  const [activeBindings, setActiveBindings] = useState<string[]>([])
  const [keysToActions, setKeysToActions] = useState<Map<string, Set<GlobalAction>>>(new Map())

  console.log('processedEvents', processedEvents)

  const availableBindings = [
    {
      id: Talents.EarlySpring,
      label: 'Early Spring',
      description: 'Force of Nature cooldown reduced by 15 sec.',
    },
    {
      id: Talents.ControlOfTheDream,
      label: 'Control of the Dream',
      description:
        "Time elapsed while your major abilities are available to be used or at maximum charges is subtracted from that ability's cooldown after the next time you use it, up to 15 seconds.",
    },
  ]

  function bindGlobalAction(keys: string[], action: GlobalAction) {
    setKeysToActions((prev) => {
      const newMap = new Map(prev)
      for (const key of keys) {
        if (!newMap.has(key)) {
          newMap.set(key, new Set())
        }
        newMap.get(key)!.add(action)
      }
      return newMap
    })
  }

  useEffect(() => {
    // Clear existing bindings
    setKeysToActions(new Map())

    // Add new bindings based on activeBindings
    activeBindings.forEach((bindingId) => {
      if (bindingId === Talents.EarlySpring) {
        bindGlobalAction(['205636'], earlySpring)
      }
      if (bindingId === Talents.ControlOfTheDream) {
        bindGlobalAction(['194223', '391528', '205636'], controlOfTheDream)
      }
    })
  }, [activeBindings])

  useEffect(() => {
    setLocalSpells(spells)
  }, [spells])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainer) {
        e.preventDefault()
        if (isControlKeyPressed || e.ctrlKey) {
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
  }, [isControlKeyPressed, zoomIn, zoomOut])

  useEffect(() => {
    const queue = generateBaseQueue(inputActions)
    setBaseQueue(queue)

    const { processedState, processedEvents } = processEventQueue(
      queue,
      localSpells,
      keysToActions,
      activeBindings
    )
    setProcessedState(processedState)
    setProcessedEvents(processedEvents)
  }, [inputActions, localSpells, keysToActions, activeBindings])

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
    const cast = findCastById(castId, inputActions)
    if (!cast) return

    setInputActions((prev) => prev.filter((action) => action.id !== castId))
  }

  // Helper function to find a cast by ID in the processed state
  const findCastById = (castId: string, timeline: PlayerAction[]): PlayerAction | null => {
    const cast = timeline.find((c) => c.id === castId)
    if (cast) return cast
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

  const handleBindingToggle = (id: string, isSelected: boolean) => {
    setActiveBindings((prev) => {
      if (isSelected) {
        return [...prev, id]
      } else {
        return prev.filter((bindingId) => bindingId !== id)
      }
    })
  }

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

      <ActionBindings
        bindings={availableBindings}
        activeBindings={activeBindings}
        onToggle={handleBindingToggle}
      />

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
          <div className="mt-5">
            <div className="flex flex-col items-start justify-start pl-2">
              {processedState.spells.map((spellCast) =>
                spellCast.spell.charges > 1 ? (
                  <SpellNameWithCharges
                    key={`spell-name-${spellCast.spell.id}`}
                    spellCast={spellCast}
                    wowheadNameMap={wowheadNameMap}
                  />
                ) : (
                  <SpellName
                    key={`spell-name-${spellCast.spell.id}`}
                    spellCast={spellCast}
                    wowheadNameMap={wowheadNameMap}
                  />
                )
              )}
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
          {false && <EventMarkers eventInfo={processedEvents} />}
          {/* Casts/timeline rows */}
          <div
            className="relative mt-5 flex flex-col"
            style={{
              width: `${effective_total_length_px}px`,
              minHeight: `${currentSpells.length * 40}px`, // Height based on visible rows
            }}
          >
            {/* Render a SpellCastsRow for each spell */}
            {processedState.spells.length > 0 ? (
              processedState.spells.map((spellCast) => (
                <SpellCastsRow
                  key={`spell-row-${spellCast.spell.id}`}
                  spellTimeline={spellCast}
                  wowheadComponent={
                    customElements[spellCast.spell.id] ||
                    wowheadMap[spellCast.spell.id] || <span>{spellCast.spell.name}</span>
                  }
                  onCastDelete={handleCastDelete}
                  onCastMove={handleCastMove}
                />
              ))
            ) : (
              <div className="mt-16 text-center text-sm text-gray-500">
                Add a spell to get started
              </div>
            )}
          </div>
        </div>
      </div>

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

const SpellName = ({
  spellCast,
  wowheadNameMap,
}: {
  spellCast: SpellToRender
  wowheadNameMap: Record<string, React.ReactNode>
}) => {
  return (
    <div
      key={`spell-name-${spellCast.spell.id}`}
      className={`my-2 flex w-full flex-col items-center justify-end border-r-2 border-orange-500/30 pr-2`}
    >
      <div className={`flex h-[40px] w-full flex-col justify-center truncate text-right`}>
        {wowheadNameMap[spellCast.spell.id] || spellCast.spell.name}
      </div>
    </div>
  )
}
const SpellNameWithCharges = ({
  spellCast,
  wowheadNameMap,
}: {
  spellCast: SpellToRender
  wowheadNameMap: Record<string, React.ReactNode>
}) => {
  return (
    <div
      key={`spell-name-${spellCast.spell.id}`}
      className={`flex w-full flex-col items-end border-r-2 border-orange-500/30 pr-2`}
    >
      <div className="h-5 text-sm text-sky-300 transition-opacity">Charges</div>
      <div className={`my-2 flex h-10 w-full flex-col justify-center truncate text-right`}>
        {wowheadNameMap[spellCast.spell.id] || spellCast.spell.name}
      </div>
      {Array.from({ length: spellCast.chargesUsed - 1 }).map((_, index) => (
        <div key={`charge-${index}`} className="my-2 h-10 w-full" />
      ))}
    </div>
  )
}
