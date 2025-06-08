import React, { useRef, useState, useEffect } from 'react'
import Markers from './Markers'
import SpellCastsRow from './SpellCastsRow'
import SpellButtons from './SpellButtons'
import CustomElement from './CustomElement'
import Debug from './Sidebar'
import Checkboxes from './Checkboxes'
import ActionBindings from './ActionBindings'
import {
  Cast,
  SpellInfo,
  SpellTimeline,
  PlayerAction,
  TimelineToRender,
  SpellToRender,
  Talents,
  TimelineEvent,
  EventType,
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
import { useNextStep } from 'nextstepjs'

import { NextStepViewport } from 'nextstepjs'
import { HoverProvider } from './HoverProvider'
import Warnings from './Warnings'
import MRTExport from './MRTExport'
import {
  CustomSpell,
  loadCustomSpells,
  removeCustomSpell,
  isCustomSpell,
} from '../../lib/utils/customSpellStorage'
import CustomSpellIcon from './CustomSpellIcon'
import { SettingsProvider, useSettings } from './SettingsProvider'
import Sidebar from './Sidebar'
type DruidSpec = 'balance' | 'resto' | 'feral' | 'guardian' | 'all'

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
}

function CustomDropdown({ value, onChange, options }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div id="spec-selector" ref={dropdownRef} className="relative min-w-[15rem]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-sm border border-neutral-600/60 bg-neutral-900/60 px-3 py-2 text-lg text-white transition-all duration-200 hover:border-orange-400/50 hover:bg-neutral-800/80 focus:bg-neutral-800/80 focus:ring-0 focus:ring-orange-400/30 focus:outline-none"
      >
        <span className="text-sm">{selectedOption?.label}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-sm border border-neutral-600/60 bg-neutral-900/95 shadow-lg backdrop-blur-sm">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 first:rounded-t-sm last:rounded-b-sm hover:text-orange-300 ${
                option.value === value ? 'bg-orange-400/20 text-orange-300' : 'text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface TimelineViewProps {
  view_length_s: number // seconds shown per 100% width
  marker_spacing_s: number // seconds between markers
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
  wowheadMarkerMap?: Record<string, React.ReactNode>
  averageTimestamps?: Record<string, number[]>
  currentEncounterId?: string
  extraSpells?: PlayerAction[]
}

function TimelineViewInner({
  marker_spacing_s,
  spells = [],
  extraSpells = [],
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
  currentEncounterId = 'empty',
}: TimelineViewProps) {
  const { showEventMarkers } = useSettings()
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
  const [showDebug, setShowDebug] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState<DruidSpec>('balance')
  const [inputActions, setInputActions] = useState<PlayerAction[]>([])
  const [processedEvents, setProcessedEvents] = useState<TimelineEvent<EventType>[]>([])
  const [currentSpells, setCurrentSpells] = useState<SpellTimeline[]>([])
  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(spells)
  const [activeBindings, setActiveBindings] = useState<string[]>([])
  const [keysToActions, setKeysToActions] = useState<Map<string, Set<GlobalAction>>>(new Map())
  const [warnings] = useState<Array<{ id: string; castId: string; type: string; message: string }>>(
    []
  )
  const [processedState, setProcessedState] = useState<TimelineToRender>({
    spells: [],
    timeline_length_s: total_length_s,
  })

  const filteredSpells = React.useMemo(() => {
    if (selectedSpec === 'all') {
      return localSpells
    }
    return localSpells.filter(
      (spell) => spell.specs && (spell.specs.includes(selectedSpec) || spell.specs.includes('all'))
    )
  }, [localSpells, selectedSpec])

  useEffect(() => {
    setInputActions(extraSpells)
  }, [extraSpells])

  useEffect(() => {
    if (scrollContainerRef.current) {
      registerScrollContainer(scrollContainerRef.current)
    }
  }, [registerScrollContainer])

  useEffect(() => {
    setTotalLength(processedState.timeline_length_s > 240 ? processedState.timeline_length_s : 240)
  }, [processedState])

  useEffect(() => {
    setKeysToActions(new Map())

    activeBindings.forEach((bindingId) => {
      if (bindingId === Talents.EarlySpring) {
        bindGlobalAction(['205636', '102693'], earlySpring)
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
    // Combine regular spells with custom spells from localStorage
    const customSpells = loadCustomSpells()
    setLocalSpells([...spells, ...customSpells])
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

  const toggleDebug = () => setShowDebug((prev) => !prev)

  const bindGlobalAction = (keys: string[], action: GlobalAction) => {
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

  const handleCreateCustomElement = (params: SpellInfo) => {
    // If it's already a custom spell (from localStorage), just add it to local spells
    if (isCustomSpell(params)) {
      setLocalSpells([...localSpells, params])
    } else {
      // This is a new spell being created, it should already be handled by CustomElement
      setLocalSpells([...localSpells, params])
    }
  }

  const handleDeleteCustomSpell = (spellId: number) => {
    // Remove from local spells
    setLocalSpells((prev) => prev.filter((spell) => spell.spellId !== spellId))
    // Remove any casts of this spell from input actions
    setInputActions((prev) => prev.filter((action) => action.spell.spellId !== spellId))
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
  const handleSpecChange = (newSpec: string) => {
    const spec = newSpec as DruidSpec
    setSelectedSpec(spec)
    setActiveBindings([])
    setInputActions([])

    if (spec !== 'all') {
      setActiveBindings((prev) =>
        prev.filter((bindingId) => {
          const binding = bindings.find((b) => b.id === bindingId)
          return binding && binding.specs && binding.specs.includes(spec)
        })
      )
    }
  }

  const { startNextStep } = useNextStep()

  // Auto-start tour on first visit
  useEffect(() => {
    const hasSeenTour = sessionStorage.getItem('hasSeenFirstTour')
    if (!hasSeenTour) {
      startNextStep('firsttour')
      sessionStorage.setItem('hasSeenFirstTour', 'true')
    }
  }, [startNextStep])

  return (
    <div className="flex h-[calc(100vh-3rem-25px)] flex-col">
      {/* Spec selector dropdown */}
      <div className="flex flex-row items-center justify-between">
        <div className="mx-1 mb-2 flex items-center gap-3">
          <CustomDropdown
            value={selectedSpec}
            onChange={handleSpecChange}
            options={[
              { value: 'all', label: 'All Specs' },
              { value: 'balance', label: 'Balance' },
              { value: 'resto', label: 'Restoration' },
              { value: 'feral', label: 'Feral' },
              { value: 'guardian', label: 'Guardian' },
            ]}
          />
        </div>
        <div className="inline-flex flex-row items-center gap-2 self-end pb-1 text-[0.8rem] text-gray-400">
          <span>
            developed by{' '}
            <a
              href="https://github.com/thevinter/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-main"
            >
              vinter
            </a>
          </span>
          {' - '}
          <span>v.0.0.1</span>
        </div>
      </div>
      {selectedSpec === 'all' && (
        <div className="my-2 ml-1 rounded-sm border border-yellow-500/20 bg-yellow-500/10 p-2 text-sm">
          <p>⚠️ Mixing spells between specs might produce unexpected results. Use with caution.</p>
        </div>
      )}
      {/* divider */}
      <div className="mx-[4px] my-1 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      {/* Action bindings */}
      <div id="tour-effects-selector" className="mx-2 my-2">
        <ActionBindings
          bindings={
            selectedSpec === 'all'
              ? bindings
              : bindings.filter((binding) => binding.specs && binding.specs.includes(selectedSpec))
          }
          activeBindings={activeBindings}
          onToggle={handleBindingToggle}
          prerenderedIcons={wowheadMap}
        />
      </div>

      <div className="mx-[4px] my-2 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      <div id="tour-buttons-selector">
        <SpellButtons
          currentSpells={processedState}
          setCurrentSpells={setInputActions}
          onCreate={handleCreateCustomElement}
          onDelete={handleDeleteCustomSpell}
          spells={filteredSpells}
          prerenderedIcons={wowheadMap}
        />
      </div>

      {/* Zoom controls */}
      <div className="flex flex-row items-center justify-end pb-2">
        <div id="tour-zoom-selector" className="flex flex-row items-center justify-end gap-2 pr-4">
          <button
            onClick={() => resetZoom()}
            className="rounded-sm bg-neutral-900/40 px-3 py-1 text-sm transition-colors duration-200 hover:bg-neutral-700/70"
          >
            Reset Zoom
          </button>
          <button
            onClick={() => zoomOut(10)}
            className="flex min-w-[1.5rem] items-center justify-center rounded-sm bg-neutral-900/40 px-3 py-1 text-sm transition-colors duration-200 hover:bg-neutral-700/70"
          >
            -
          </button>
          <button
            onClick={() => zoomIn(10)}
            className="flex min-w-[1.5rem] items-center justify-center rounded-sm bg-neutral-900/40 px-3 py-1 text-sm transition-colors duration-200 hover:bg-neutral-700/70"
          >
            +
          </button>
        </div>
        <MRTExport timeline={processedState.spells} />
      </div>

      {/* Timeline view */}
      <HoverProvider>
        <div id="tour-timeline-selector" className="flex flex-row overflow-x-clip">
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
          <div
            className="relative h-full min-h-[280px] flex-1 overflow-x-scroll pl-6"
            ref={scrollContainerRef}
          >
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
            {showEventMarkers && <EventMarkers eventInfo={processedEvents} />}
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
                        isCustomSpell(spellCast.spell) ? (
                          <CustomSpellIcon spell={spellCast.spell as CustomSpell} size="md" />
                        ) : (
                          wowheadMap[spellCast.spell.spellId] || <span>{spellCast.spell.name}</span>
                        )
                      }
                      onCastDelete={handleCastDelete}
                      onCastMove={handleCastMove}
                    />
                  ))
              ) : (
                <div
                  style={{ width: `${effective_view_length_s * pixelsPerSecond}px` }}
                  className="sticky top-0 left-0 mt-16 text-center text-sm text-gray-500 select-none"
                >
                  Add a spell to get started
                </div>
              )}
            </div>
          </div>
        </div>
      </HoverProvider>

      <div className="mx-[4px] mt-6 mb-4 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      <Warnings timeline={processedState.spells} current_spec={selectedSpec} />
      <Sidebar
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

export default function TimelineView(props: TimelineViewProps) {
  return (
    <SettingsProvider>
      <TimelineViewInner {...props} />
    </SettingsProvider>
  )
}

const SpellName = ({
  spellCast,
  wowheadNameMap,
}: {
  spellCast: SpellToRender
  wowheadNameMap: Record<string, React.ReactNode>
}) => {
  const isCustom = isCustomSpell(spellCast.spell)

  return (
    <div
      id={`spell-name-${spellCast.spell.spellId}`}
      className={`my-2 flex w-full flex-col items-center justify-end border-r-2 border-orange-500/50 border-b-orange-500/50 pr-2`}
    >
      <div
        className={`flex h-[40px] w-full flex-row items-center justify-end gap-2 truncate text-center text-sm`}
      >
        {isCustom && (
          <CustomSpellIcon
            spell={spellCast.spell as CustomSpell}
            size="sm"
            className="inline-block"
          />
        )}
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
  const isCustom = isCustomSpell(spellCast.spell)

  return (
    <div className="mb-2 w-full">
      <div
        id={`spell-name-${spellCast.spell.spellId}-charges`}
        className="mb-[-2px] h-[18px] w-full pt-[2px] pr-[9px] text-right text-[0.8rem] text-orange-300/80 transition-opacity"
      >
        Charges #
      </div>
      <div className="mt-[12px] flex w-full flex-col items-end gap-2 border-r-2 border-orange-500/50 pr-2">
        <div
          id={`spell-name-${spellCast.spell.spellId}`}
          className={`flex h-[38px] w-full flex-row items-center justify-end gap-2 truncate text-right`}
        >
          {isCustom && <CustomSpellIcon spell={spellCast.spell as CustomSpell} size="sm" />}
          {wowheadNameMap[spellCast.spell.spellId] || spellCast.spell.name}
        </div>
        {Array.from({ length: spellCast.chargesUsed - 1 }).map((_, index) => (
          <div
            id={`spell-name-${spellCast.spell.spellId}-${index}`}
            key={`charge-${index}`}
            className="h-10 w-full"
          />
        ))}
      </div>
    </div>
  )
}

// Helper function to format time as minutes:seconds
export function formatTime(seconds: number): string {
  if (seconds < 0) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}
