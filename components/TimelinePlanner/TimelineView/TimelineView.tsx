import React, { useRef, useState, useEffect } from 'react'
import SpellButtons from '../SpellButtons'
import TalentBindings from './TalentBindings/TalentBindings'
import {
  SpellInfo,
  PlayerAction,
  TimelineToRender,
  Talents,
  TimelineEvent,
  GlobalAction,
  EventType,
} from '@/types/index'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'
import { generateBaseQueue, processEventQueue } from '../TimelineEvents'
import {
  earlySpring,
  controlOfTheDream,
  whirlingStars,
  potentEnchantments,
  incarnation,
  bindings,
  dreamstate,
  tearDownTheMighty,
  ashamanesGuidance,
  heartOfTheLion,
  cenariusGuidance,
} from '@/lib/talent_handlers'

import { useNextStep } from 'nextstepjs'
import { HoverProvider } from '../Providers/HoverProvider'
import Warnings from '../Warnings'
import MRTExport from '../MRTExport'
import { loadCustomSpells } from '../../../lib/utils/customSpellStorage'
import { SettingsProvider, useSettings } from '../Providers/SettingsProvider'
import Sidebar from '../Sidebar/Sidebar'
import SpecSelector from './SpecSelector'
import ZoomControls from './ZoomControls'
import SpellNames from './SpellNames'
import TimelineScrollContainer from './TimelineScrollContainer'
import { useProcessedTimeline } from 'hooks/timeline'
export type DruidSpec = 'balance' | 'resto' | 'feral' | 'guardian' | 'all'

interface TimelineViewProps {
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
  const { showEventMarkers, currentSpec } = useSettings()
  const {
    total_length_s,
    isControlKeyPressed,
    setTotalLength,
    registerScrollContainer,
    zoomIn,
    zoomOut,
  } = useTimelineControls()

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [inputActions, setInputActions] = useState<PlayerAction[]>([])
  const [localSpells, setLocalSpells] = useState<SpellInfo[]>(spells)
  const [activeBindings, setActiveBindings] = useState<string[]>([])
  const [keysToActions, setKeysToActions] = useState<Map<string, Set<GlobalAction>>>(new Map())
  const [warnings] = useState<Array<{ id: string; castId: string; type: string; message: string }>>(
    []
  )

  const filteredSpells = React.useMemo(() => {
    if (currentSpec === 'all') {
      return localSpells
    }
    return localSpells.filter(
      (spell) => spell.specs && (spell.specs.includes(currentSpec) || spell.specs.includes('all'))
    )
  }, [localSpells, currentSpec])

  useEffect(() => {
    setInputActions(extraSpells)
  }, [extraSpells])

  useEffect(() => {
    if (scrollContainerRef.current) {
      registerScrollContainer(scrollContainerRef.current)
    }
  }, [registerScrollContainer])

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

  const { processedState, processedEvents } = useProcessedTimeline(
    inputActions,
    localSpells,
    keysToActions,
    activeBindings,
    processedReschedulingsRef,
    setInputActions
  )

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
    setLocalSpells([...localSpells, params])
  }

  const handleDeleteCustomSpell = (spellId: number) => {
    setLocalSpells((prev) => prev.filter((spell) => spell.spellId !== spellId))
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

  useEffect(() => {
    setActiveBindings([])
    setInputActions([])

    if (currentSpec !== 'all') {
      setActiveBindings((prev) =>
        prev.filter((bindingId) => {
          const binding = bindings.find((b) => b.id === bindingId)
          return binding && binding.specs && binding.specs.includes(currentSpec)
        })
      )
    }
  }, [currentSpec])

  const { startNextStep } = useNextStep()

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenFirstTour')
    if (!hasSeenTour) {
      startNextStep('firsttour')
      localStorage.setItem('hasSeenFirstTour', 'true')
    }
  }, [startNextStep])

  return (
    <div className="flex h-full flex-col">
      {/* Spec selector dropdown */}
      <SpecSelector />

      {/* divider */}
      <div className="my-1 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      {/* Action bindings */}
      <div id="tour-effects-selector" className="my-2">
        <TalentBindings
          bindings={
            currentSpec === 'all'
              ? bindings
              : bindings.filter((binding) => binding.specs && binding.specs.includes(currentSpec))
          }
          activeBindings={activeBindings}
          onToggle={handleBindingToggle}
          prerenderedIcons={wowheadMap}
        />
      </div>

      <div className="my-2 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

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

      <div className="flex flex-row items-center justify-end pb-2">
        <ZoomControls />
        <MRTExport timeline={processedState.spells} />
      </div>

      {/* Main view */}
      <HoverProvider>
        <div id="tour-timeline-selector" className="flex flex-row overflow-x-clip">
          {/* Left side: spell names, vertically offset */}
          <SpellNames spells={processedState.spells} wowheadNameMap={wowheadNameMap} />

          {/* Right side: scrollable timeline, contains markers and casts */}
          <div
            className="relative min-h-[280px] flex-1 overflow-x-auto pl-6"
            ref={scrollContainerRef}
          >
            <TimelineScrollContainer
              spells={processedState.spells}
              wowheadNameMap={wowheadNameMap}
              marker_spacing_s={marker_spacing_s}
              averageTimestamps={averageTimestamps}
              wowheadMarkerMap={wowheadMarkerMap}
              showEventMarkers={showEventMarkers}
              processedEvents={processedEvents}
              handleCastDelete={handleCastDelete}
              handleCastMove={handleCastMove}
            />
          </div>
        </div>
      </HoverProvider>

      {/* divider */}
      <div className="mx-[4px] mt-6 mb-4 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      <Warnings timeline={processedState.spells} />

      <Sidebar
        processedTimeline={processedState}
        markerSpacing={marker_spacing_s}
        warnings={warnings}
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
