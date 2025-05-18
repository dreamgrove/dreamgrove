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
import { useTimelineControls } from './TimelineContext'
import { generateBaseQueue, processEventQueue } from './TimelineEvents'
import { GlobalAction } from '../../lib/types/global_handler'
import { earlySpring } from './GlobalHandlers/Balance/earlySpring'
import { controlOfTheDream } from './GlobalHandlers/Balance/controlOfTheDream'
import EventMarkers from './EventMarkers'
import { whirlingStars } from './GlobalHandlers/Balance/whirlingStars'
import { potentEnchantments } from './GlobalHandlers/Balance/potentEnchantements'
import { incarnation } from './GlobalHandlers/Balance/incarnation'
import { bindings } from './GlobalHandlers/bindings'
import { dreamstate } from './GlobalHandlers/Resto/dreamstate'
import { tearDownTheMighty } from './GlobalHandlers/Feral/tearDownTheMighty'
import { ashamanesGuidance } from './GlobalHandlers/Feral/ashamanesGuidance'
import { heartOfTheLion } from './GlobalHandlers/Feral/heartOfTheLion'
import { cenariusGuidance } from './GlobalHandlers/Resto/cenariusGuidance'
type DruidSpec = 'balance' | 'resto' | 'feral' | 'guardian' | 'all'

interface TimelineViewProps {
  view_length_s: number // seconds shown per 100% width
  marker_spacing_s: number // seconds between markers
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
  wowheadMarkerMap?: Record<string, React.ReactNode>
  averageTimestamps?: Record<string, number[]>
  currentEncounterId?: string
}

export default function TimelineView({
  marker_spacing_s,
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
  currentEncounterId = 'empty',
}: TimelineViewProps) {
  const {
    total_length_s,
    effective_view_length_s,
    effective_total_length_px,
    pixelsPerSecond,
    isControlKeyPressed,
    setTotalLength,
    registerScrollContainer,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useTimelineControls()

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [selectedSpec, setSelectedSpec] = useState<DruidSpec>('balance')

  useEffect(() => {
    if (scrollContainerRef.current) {
      registerScrollContainer(scrollContainerRef.current)
    }
  }, [registerScrollContainer])

  const [inputActions, setInputActions] = useState<PlayerAction[]>([])

  const [processedState, setProcessedState] = useState<TimelineToRender>({
    spells: [],
    timeline_length_s: total_length_s,
  })

  const [processedEvents, setProcessedEvents] = useState<TimelineEvent[]>([])

  const [currentSpells, setCurrentSpells] = useState<SpellTimeline[]>([])

  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(spells)

  const filteredSpells = React.useMemo(() => {
    if (selectedSpec === 'all') {
      return localSpells
    }
    return localSpells.filter((spell) => spell.specs && spell.specs.includes(selectedSpec))
  }, [localSpells, selectedSpec])

  const [activeBindings, setActiveBindings] = useState<string[]>([])

  const [keysToActions, setKeysToActions] = useState<Map<string, Set<GlobalAction>>>(new Map())

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
    setTotalLength(processedState.timeline_length_s > 240 ? processedState.timeline_length_s : 240)
  }, [processedState])

  useEffect(() => {
    setKeysToActions(new Map())

    activeBindings.forEach((bindingId) => {
      if (bindingId === Talents.EarlySpring) {
        bindGlobalAction(['205636'], earlySpring)
      }
      if (bindingId === Talents.ControlOfTheDream) {
        bindGlobalAction(['194223', '391528', '205636', '33891'], controlOfTheDream)
      }
      if (bindingId === Talents.Incarnation) {
        bindGlobalAction(['194223'], incarnation)
      }
      if (bindingId === Talents.WhirlingStars) {
        bindGlobalAction(['194223'], whirlingStars)
      }
      if (bindingId === Talents.PotentEnchantments) {
        bindGlobalAction(['194223'], potentEnchantments)
      }
      if (bindingId === Talents.Dreamstate) {
        bindGlobalAction(['740'], dreamstate)
      }
      if (bindingId === Talents.TearDownTheMighty) {
        bindGlobalAction(['274837'], tearDownTheMighty)
      }
      if (bindingId === Talents.AshamanesGuidance) {
        bindGlobalAction(['391528'], ashamanesGuidance)
      }
      if (bindingId === Talents.HeartOfTheLion) {
        bindGlobalAction(['106951'], heartOfTheLion)
      }
      if (bindingId === Talents.CenariusGuidance) {
        bindGlobalAction(['391528', '33891'], cenariusGuidance)
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

  // Add a ref to track already processed reschedulings to prevent cyclical re-renders
  // This keeps track of which cast reschedulings we've already processed to avoid
  // infinite update loops when processEventQueue suggests rescheduling a cast
  const processedReschedulingsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const queue = generateBaseQueue(inputActions)

    const { processedState, processedEvents, rescheduledCasts } = processEventQueue(
      queue,
      localSpells,
      keysToActions,
      activeBindings
    )

    setProcessedState(processedState)
    setProcessedEvents(processedEvents)

    // Handle any casts that need to be rescheduled due to insufficient charges
    // We need to update inputActions when a spell can't be cast at the specified time
    // but must avoid creating an infinite re-render loop when we update inputActions
    if (rescheduledCasts.length > 0) {
      // Filter out already processed reschedulings using our ref to track state across renders
      const unprocessedReschedulings = rescheduledCasts.filter(({ castId, newTime }) => {
        const action = inputActions.find((a) => a.id === castId)
        // Create a unique key for this specific rescheduling
        const key = `${castId}:${newTime.toFixed(2)}`
        const alreadyProcessed = processedReschedulingsRef.current.has(key)
        const needsUpdate = action && Math.abs(action.instant - newTime) > 0.001

        return !alreadyProcessed && needsUpdate
      })

      if (unprocessedReschedulings.length > 0) {
        // Mark these reschedulings as processed to prevent processing them again
        unprocessedReschedulings.forEach(({ castId, newTime }) => {
          const key = `${castId}:${newTime.toFixed(2)}`
          processedReschedulingsRef.current.add(key)
        })

        // Build a map of castIds to new times for all unprocessed reschedulings
        const castsToReschedule = new Map<string, number>()
        unprocessedReschedulings.forEach(({ castId, newTime }) => {
          castsToReschedule.set(castId, newTime)
        })

        // Update all casts at once in a batched update to minimize rerenders
        setInputActions((prev) =>
          prev.map((action) => {
            const newTime = castsToReschedule.get(action.id)
            if (newTime !== undefined) {
              return { ...action, instant: newTime }
            }
            return action
          })
        )
      }
    }
  }, [inputActions, localSpells, keysToActions, activeBindings])

  // Function to modify a cast
  const handleModifyAction = (castId: string, newTime: number) => {
    const actionIndex = inputActions.findIndex((a) => a.id === castId)

    if (actionIndex >= 0) {
      const newActions = inputActions.map((action, index) =>
        index === actionIndex ? { ...action, instant: newTime } : action
      )
      setInputActions(newActions)
    }
  }

  // Function to remove a player cast
  const handleCastDelete = (castId: string) => {
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

  const handleCastMove = (castId: string, newStartTime: number) => {
    handleModifyAction(castId, newStartTime)
  }

  const [showDebug, setShowDebug] = useState(false)
  const toggleDebug = () => setShowDebug((prev) => !prev)

  // Mock warnings for demo
  const [warnings] = useState<Array<{ id: string; castId: string; type: string; message: string }>>(
    []
  )

  const handleCreateCustomElement = (params: SpellInfo) => {
    const newSpell: SpellInfo = {
      spellId: Math.floor(Math.random() * 1000000) + 900000, //this shouldnt be done like this but w/e
      name: params.name,
      channel_duration: params.channel_duration,
      effect_duration: params.effect_duration,
      cooldown: params.cooldown,
      charges: params.charges,
      channeled: params.channeled,
      specs: params.specs || [],
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

  // Handle spec change
  const handleSpecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpec = e.target.value as DruidSpec
    setSelectedSpec(newSpec)
    setActiveBindings([])
    setInputActions([])

    if (newSpec !== 'all') {
      setActiveBindings((prev) =>
        prev.filter((bindingId) => {
          const binding = bindings.find((b) => b.id === bindingId)
          return binding && binding.specs && binding.specs.includes(newSpec)
        })
      )
    }
  }

  return (
    <div className="timeline flex w-full flex-col gap-2">
      {/* Spec selector dropdown */}
      <div className="my-2 ml-2 flex items-center gap-2">
        <label htmlFor="spec-selector" className="text-lg font-medium">
          Specialization:
        </label>
        <select
          id="spec-selector"
          value={selectedSpec}
          onChange={handleSpecChange}
          className="min-w-[15rem] rounded border border-neutral-700 bg-neutral-900/50 px-2 py-1 text-lg"
        >
          <option className="bg-neutral-900/50" value="all">
            All Specs
          </option>
          <option className="bg-neutral-900/50" value="balance">
            Balance
          </option>
          <option className="bg-neutral-900/50" value="resto">
            Restoration
          </option>
          <option className="bg-neutral-900/50" value="feral">
            Feral
          </option>
          <option className="bg-neutral-900/50" value="guardian">
            Guardian
          </option>
        </select>
      </div>
      {/* divider */}
      <div className="mx-[4px] my-2 h-[2px] w-full bg-gray-700/40" />

      <div className="my-2 ml-2">
        <ActionBindings
          bindings={
            selectedSpec === 'all'
              ? bindings
              : bindings.filter((binding) => binding.specs && binding.specs.includes(selectedSpec))
          }
          activeBindings={activeBindings}
          onToggle={handleBindingToggle}
        />
      </div>

      <div className="mx-[4px] my-2 h-[2px] w-full bg-gray-700/40" />

      <SpellButtons
        currentSpells={processedState}
        setCurrentSpells={setInputActions}
        spells={filteredSpells}
      />
      <div className="pl-2">
        <CustomElement onCreate={handleCreateCustomElement} />
      </div>

      <div className="mb-4 flex flex-row items-center justify-end gap-2">
        {/* Zoom controls */}
        <span className="text-sm text-gray-500">
          (You can also use Ctrl + Scroll Wheel to zoom)
        </span>
        <button
          onClick={() => resetZoom()}
          className="rounded bg-neutral-900/50 px-2 py-1 text-sm hover:bg-neutral-700"
        >
          Reset Zoom
        </button>
        <button
          onClick={() => zoomOut(10)}
          className="rounded bg-neutral-900/50 px-2 py-1 text-sm hover:bg-neutral-700"
        >
          -
        </button>
        <button
          onClick={() => zoomIn(10)}
          className="rounded bg-neutral-900/50 px-2 py-1 text-sm hover:bg-neutral-700"
        >
          +
        </button>
      </div>

      {/* Timeline view */}
      <div className="flex min-h-[200px] w-full flex-row">
        {/* Left side: spell names, vertically offset */}
        <div className="w-[200px] min-w-[120px] shrink-0">
          <div className="mt-5">
            <div className="flex flex-col items-start justify-start pl-2">
              {processedState.spells
                .sort((a, b) => a.spell.spellId - b.spell.spellId)
                .map((spellCast) =>
                  spellCast.spell.charges > 1 ? (
                    <SpellNameWithCharges
                      key={`spell-name-${spellCast.spell.spellId}`}
                      spellCast={spellCast}
                      wowheadNameMap={wowheadNameMap}
                    />
                  ) : (
                    <SpellName
                      key={`spell-name-${spellCast.spell.spellId}`}
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
          <SpellMarkers
            spellInfo={averageTimestamps}
            wowheadMap={wowheadMarkerMap}
            total_length_s={total_length_s}
          />
          {showDebug && <EventMarkers eventInfo={processedEvents} />}
          {/* Casts/timeline rows */}
          <div
            className="relative mt-5 flex flex-col"
            style={{
              width: `${effective_total_length_px}px`,
              minHeight: `${currentSpells.length * 40}px`, // Height based on visible rows
            }}
          >
            {/* Render a SpellCastsRow for each spell, sorted by spell.id*/}
            {processedState.spells.length > 0 ? (
              processedState.spells
                .sort((a, b) => a.spell.spellId - b.spell.spellId)
                .map((spellCast) => (
                  <SpellCastsRow
                    key={`spell-row-${spellCast.spell.spellId}`}
                    spellTimeline={spellCast}
                    wowheadComponent={
                      wowheadMap[spellCast.spell.spellId] || <span>{spellCast.spell.name}</span>
                    }
                    onCastDelete={handleCastDelete}
                    onCastMove={handleCastMove}
                  />
                ))
            ) : (
              <div
                style={{ width: `${effective_view_length_s * pixelsPerSecond}px` }}
                className="sticky top-0 left-0 mt-16 text-center text-sm text-gray-500"
              >
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
      key={`spell-name-${spellCast.spell.spellId}`}
      className={`my-2 flex w-full flex-col items-center justify-end border-r-2 border-orange-500/30 pr-2`}
    >
      <div className={`flex h-[40px] w-full flex-col justify-center truncate text-right`}>
        {wowheadNameMap[spellCast.spell.spellId] || spellCast.spell.name}
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
      key={`spell-name-${spellCast.spell.spellId}`}
      className={`flex w-full flex-col items-end border-r-2 border-orange-500/30 pr-2`}
    >
      <div className="h-5 text-sm text-sky-300 transition-opacity">Charges</div>
      <div className={`my-2 flex h-10 w-full flex-col justify-center truncate text-right`}>
        {wowheadNameMap[spellCast.spell.spellId] || spellCast.spell.name}
      </div>
      {Array.from({ length: spellCast.chargesUsed - 1 }).map((_, index) => (
        <div key={`charge-${index}`} className="my-2 h-10 w-full" />
      ))}
    </div>
  )
}
