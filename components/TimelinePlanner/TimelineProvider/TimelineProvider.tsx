import React, { createContext, ReactNode, useState } from 'react'
import { useTimelineEvents } from 'hooks/useTimelineActions'
import { useLocalSpells } from 'hooks/useLocalSpells'
import { useActiveBindings } from 'hooks/useActiveBindings'
import { useKeysToActions } from 'hooks/useKeysToActions'
import { useProcessedTimeline } from 'hooks/useProcessedTimeline'
import { SpellInfo, PlayerAction, TalentBindings, TimelineToRender } from '@/types/index'

export interface TimelineContextType {
  inputEvents: any
  setInputEvents: any
  handleCastDelete: any
  handleCastMove: any
  localSpells: any
  handleCreateCustomElement: any
  handleDeleteCustomSpell: any
  getSpellsForSpec: any
  activeTalents: string[]
  toggleTalent: (id: string, isSelected: boolean) => void
  availableTalents: TalentBindings[]
  keysToActions: any
  processedState: TimelineToRender
  processedEvents: any
  filteredSpells: any
  currentSpec: string
  setCurrentSpec: React.Dispatch<React.SetStateAction<string>>
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined)

interface TimelineProviderProps {
  children: ReactNode
  spells?: SpellInfo[]
  extraSpells?: PlayerAction[]
}

export function TimelineProvider({
  children,
  spells = [],
  extraSpells = [],
}: TimelineProviderProps) {
  const [currentSpec, setCurrentSpec] = useState('balance')
  const { inputEvents, setInputEvents, handleCastDelete, handleCastMove } =
    useTimelineEvents(extraSpells)
  const { localSpells, handleCreateCustomElement, handleDeleteCustomSpell, getSpellsForSpec } =
    useLocalSpells(spells)
  const { activeTalents, toggleTalent, availableTalents } = useActiveBindings(
    setInputEvents,
    currentSpec
  )
  const { keysToActions } = useKeysToActions(activeTalents)
  const { processedState, processedEvents } = useProcessedTimeline(
    inputEvents,
    localSpells,
    keysToActions,
    activeTalents,
    setInputEvents
  )
  const filteredSpells = React.useMemo(
    () => getSpellsForSpec(currentSpec),
    [getSpellsForSpec, currentSpec]
  )

  const value: TimelineContextType = {
    inputEvents,
    setInputEvents,
    handleCastDelete,
    handleCastMove,
    localSpells,
    handleCreateCustomElement,
    handleDeleteCustomSpell,
    getSpellsForSpec,
    activeTalents,
    toggleTalent,
    availableTalents,
    keysToActions,
    processedState,
    processedEvents,
    filteredSpells,
    currentSpec,
    setCurrentSpec,
  }

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}
