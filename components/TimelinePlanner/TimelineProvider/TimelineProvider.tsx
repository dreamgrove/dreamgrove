import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useTimelineEvents } from 'hooks/useTimelineActions'
import { useLocalSpells } from 'hooks/useLocalSpells'
import { useActiveBindings } from 'hooks/useActiveBindings'
import { useProcessedTimeline } from 'hooks/useProcessedTimeline'
import {
  SpellInfo,
  PlayerAction,
  TalentBindings,
  TimelineToRender,
  GlobalAction,
  TimelineEvent,
  EventType,
} from '@/types/index'

export interface TimelineContextType {
  inputEvents: PlayerAction[]
  setInputEvents: React.Dispatch<React.SetStateAction<PlayerAction[]>>
  handleCastDelete: (id: string) => void
  handleCastMove: (id: string, newInstant: number) => void
  localSpells: SpellInfo[]
  createCustomSpell: (params: SpellInfo) => void
  deleteCustomSpell: (spellId: number) => void
  getSpellsForSpec: (spec: string) => SpellInfo[]
  activeTalents: string[]
  toggleTalent: (id: string, isSelected: boolean) => void
  availableTalents: TalentBindings[]
  keysToTalents: Map<string, Set<GlobalAction>>
  processedState: TimelineToRender
  processedEvents: TimelineEvent<EventType>[]
  filteredSpells: SpellInfo[]
  currentSpec: string
  setCurrentSpec: React.Dispatch<React.SetStateAction<string>>
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined)

interface TimelineProviderProps {
  children: ReactNode
  spells?: SpellInfo[]
  tutorialSpells?: PlayerAction[]
}

export function TimelineProvider({
  children,
  spells = [],
  tutorialSpells = [],
}: TimelineProviderProps) {
  const [currentSpec, setCurrentSpec] = useState('balance')

  const { inputEvents, setInputEvents, handleCastDelete, handleCastMove } =
    useTimelineEvents(tutorialSpells)

  const { localSpells, createCustomSpell, deleteCustomSpell, getSpellsForSpec } =
    useLocalSpells(spells)

  const { activeTalents, toggleTalent, availableTalents, keysToTalents } = useActiveBindings(
    setInputEvents,
    currentSpec
  )
  const { processedState, processedEvents } = useProcessedTimeline(
    inputEvents,
    localSpells,
    keysToTalents,
    activeTalents,
    setInputEvents
  )
  const filteredSpells = React.useMemo(
    () => getSpellsForSpec(currentSpec),
    [getSpellsForSpec, currentSpec]
  )

  useEffect(() => {
    setInputEvents((prev) => [...prev, ...tutorialSpells])
  }, [tutorialSpells])

  const value: TimelineContextType = {
    inputEvents,
    setInputEvents,
    handleCastDelete,
    handleCastMove,
    localSpells,
    createCustomSpell,
    deleteCustomSpell,
    getSpellsForSpec,
    activeTalents,
    toggleTalent,
    availableTalents,
    keysToTalents,
    processedState,
    processedEvents,
    filteredSpells,
    currentSpec,
    setCurrentSpec,
  }

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}
