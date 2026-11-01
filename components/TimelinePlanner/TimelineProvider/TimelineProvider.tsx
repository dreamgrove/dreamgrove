import React, { createContext, ReactNode, useEffect, useMemo } from 'react'
import { useTimelineEvents } from '@/hooks/useTimelineActions'
import { useLocalSpells } from '@/hooks/useLocalSpells'
import { useActiveBindings, type Plan } from '@/hooks/useActiveBindings'
import { useProcessedTimeline } from '@/hooks/useProcessedTimeline'
import {
  SpellInfo,
  PlayerAction,
  TalentBindings,
  TimelineToRender,
  TimelineEvent,
  EventType,
  DruidSpec,
} from '@/types/index'
import { useKeysToTalents } from '@/hooks/useKeysToActions'

export interface TimelineContextType {
  inputEvents: PlayerAction[]
  setInputEvents: React.Dispatch<React.SetStateAction<PlayerAction[]>>
  handleCastDelete: (id: string) => void
  handleCastMove: (id: string, newInstant: number) => void
  localSpells: SpellInfo[]
  createCustomSpell: (params: SpellInfo) => void
  deleteCustomSpell: (spellId: number) => void
  activeTalents: string[]
  setActiveTalents: React.Dispatch<React.SetStateAction<string[]>>
  toggleTalent: (id: string, isSelected: boolean) => void
  availableTalents: TalentBindings[]
  processedState: TimelineToRender
  processedEvents: TimelineEvent<EventType>[]
  filteredSpells: SpellInfo[]
  currentSpec: DruidSpec
  setCurrentSpec: (spec: DruidSpec) => void
  loadPlan: (plan: Plan) => void
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined)

interface TimelineProviderProps {
  children: ReactNode
  spells?: SpellInfo[]
  tutorialSpells?: PlayerAction[]
}

export function TimelineProvider({ children, spells = [], tutorialSpells }: TimelineProviderProps) {
  const { inputEvents, setInputEvents, handleCastDelete, handleCastMove } = useTimelineEvents()

  const { localSpells, createCustomSpell, deleteCustomSpell, getSpellsForSpec } =
    useLocalSpells(spells)

  const {
    currentSpec,
    setCurrentSpec,
    loadPlan,
    activeTalents,
    setActiveTalents,
    toggleTalent,
    availableTalents,
  } = useActiveBindings(setInputEvents)
  const { keysToTalents } = useKeysToTalents(activeTalents, localSpells)
  const { processedState, processedEvents } = useProcessedTimeline(
    inputEvents,
    localSpells,
    keysToTalents,
    activeTalents
  )
  const filteredSpells = React.useMemo(
    () => getSpellsForSpec(currentSpec),
    [getSpellsForSpec, currentSpec]
  )

  // The tour hands over its example casts once; add them to whatever is already planned.
  useEffect(() => {
    if (!tutorialSpells?.length) return
    setInputEvents((prev) => [...prev, ...tutorialSpells])
  }, [tutorialSpells, setInputEvents])

  const value = useMemo<TimelineContextType>(
    () => ({
      inputEvents,
      setInputEvents,
      handleCastDelete,
      handleCastMove,
      localSpells,
      createCustomSpell,
      deleteCustomSpell,
      activeTalents,
      setActiveTalents,
      toggleTalent,
      availableTalents,
      processedState,
      processedEvents,
      filteredSpells,
      currentSpec,
      setCurrentSpec,
      loadPlan,
    }),
    [
      inputEvents,
      setInputEvents,
      handleCastDelete,
      handleCastMove,
      localSpells,
      createCustomSpell,
      deleteCustomSpell,
      activeTalents,
      setActiveTalents,
      toggleTalent,
      availableTalents,
      processedState,
      processedEvents,
      filteredSpells,
      currentSpec,
      setCurrentSpec,
      loadPlan,
    ]
  )

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}
