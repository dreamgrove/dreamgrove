import React, { useEffect, useState, useCallback } from 'react'
import SpellButtons from '../SpellButtons'
import TalentBindings from './TalentBindings/TalentBindings'
import WCLSection from '../WCLSection'
import FightSelector from '../FightSelector'
import BossAbilityToggles from '../BossAbilityToggles'
import { SpellInfo, PlayerAction } from '@/types/index'
import type { BossAbilitiesResponse } from '@/types/bossAbilities'
import { useNextStep } from 'nextstepjs'
import { HoverProvider } from '../Providers/HoverProvider'
import Warnings from '../Warnings'
import MRTExport from '../MRTExport'
import Sidebar from '../Sidebar/Sidebar'
import LoadoutManager from '../LoadoutManager'
import SpecSelector from './SpecSelector'
import ZoomControls from './ZoomControls'
import SpellNames from './SpellNames'
import TimelineScrollContainer from './TimelineScrollContainer'
import { useTimelineScroll } from 'hooks/useTimelineScroll'
import { SettingsProvider } from '../Providers/SettingsProvider'
import { TimelineProvider } from '../TimelineProvider/TimelineProvider'

export type DruidSpec = 'balance' | 'resto' | 'feral' | 'guardian' | 'all'

interface TimelineViewProps {
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
  wowheadMarkerMap?: Record<string, React.ReactNode>
  averageTimestamps?: Record<string, number[]>
  currentEncounterId?: string
  onEncounterChange?: (encounterId: string) => void
  tutorialSpells?: PlayerAction[]
  bossAbilities?: BossAbilitiesResponse | null
}

function TimelineViewInner({
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
  currentEncounterId = 'empty',
  onEncounterChange = () => {},
  bossAbilities = null,
}: TimelineViewProps) {
  const { scrollContainerRef } = useTimelineScroll()

  const [visibleBossAbilityKeys, setVisibleBossAbilityKeys] = useState<Set<string>>(new Set())
  const [prevEncounterId, setPrevEncounterId] = useState(currentEncounterId)
  if (prevEncounterId !== currentEncounterId) {
    setPrevEncounterId(currentEncounterId)
    setVisibleBossAbilityKeys(new Set())
  }

  const toggleBossAbility = useCallback((key: string) => {
    setVisibleBossAbilityKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const toggleAllBossAbilities = useCallback(
    (visible: boolean) => {
      if (!visible) {
        setVisibleBossAbilityKeys(new Set())
        return
      }
      const all = bossAbilities?.abilities ?? []
      setVisibleBossAbilityKeys(new Set(all.map((a) => a.key)))
    },
    [bossAbilities]
  )

  const { startNextStep } = useNextStep()
  React.useEffect(() => {
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

      <div id="tour-effects-selector" className="my-2">
        <TalentBindings prerenderedIcons={wowheadMap} />
      </div>

      <div className="my-2 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      {/* Warcraft Logs panel */}
      <div className="my-2">
        <WCLSection>
          <FightSelector
            currentEncounterId={currentEncounterId}
            onEncounterChange={onEncounterChange}
          />
          {bossAbilities && bossAbilities.abilities.length > 0 && (
            <BossAbilityToggles
              abilities={bossAbilities.abilities}
              visibleKeys={visibleBossAbilityKeys}
              onToggle={toggleBossAbility}
              onToggleAll={toggleAllBossAbilities}
            />
          )}
        </WCLSection>
      </div>

      <div className="my-2 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      {/* Add/Remove spell buttons */}
      <div id="tour-buttons-selector">
        <SpellButtons prerenderedIcons={wowheadMap} />
      </div>

      <div className="flex flex-row items-center justify-end gap-1 pb-2">
        <LoadoutManager />
        <ZoomControls />
        <MRTExport />
      </div>

      {/* Main view */}
      <HoverProvider>
        <div id="tour-timeline-selector" className="flex flex-row overflow-x-clip">
          {/* Left side: spell names, vertically offset */}
          <SpellNames wowheadNameMap={wowheadNameMap} />

          {/* Right side: scrollable timeline, contains markers and casts */}
          <div
            className="relative mt-8 min-h-[280px] flex-1 overflow-x-auto pl-6"
            ref={scrollContainerRef}
          >
            <TimelineScrollContainer
              averageTimestamps={averageTimestamps}
              wowheadMarkerMap={wowheadMarkerMap}
              bossAbilities={bossAbilities}
              visibleBossAbilityKeys={visibleBossAbilityKeys}
            />
          </div>
        </div>
      </HoverProvider>

      {/* divider */}
      <div className="mx-[4px] mt-6 mb-4 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      <Warnings />

      <Sidebar />
    </div>
  )
}

export default function TimelineView(props: TimelineViewProps) {
  return (
    <SettingsProvider>
      <TimelineProvider spells={props.spells} tutorialSpells={props.tutorialSpells}>
        <TimelineViewInner {...props} />
      </TimelineProvider>
    </SettingsProvider>
  )
}
