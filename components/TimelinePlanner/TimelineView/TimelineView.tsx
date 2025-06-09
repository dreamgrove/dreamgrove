import React from 'react'
import SpellButtons from '../SpellButtons'
import TalentBindings from './TalentBindings/TalentBindings'
import { SpellInfo, PlayerAction } from '@/types/index'
import { useNextStep } from 'nextstepjs'
import { HoverProvider } from '../Providers/HoverProvider'
import Warnings from '../Warnings'
import MRTExport from '../MRTExport'
import Sidebar from '../Sidebar/Sidebar'
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
  tutorialSpells?: PlayerAction[]
}

function TimelineViewInner({
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
  currentEncounterId = 'empty',
}: TimelineViewProps) {
  const { scrollContainerRef } = useTimelineScroll()

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

      {/* Add/Remove spell buttons */}
      <div id="tour-buttons-selector">
        <SpellButtons prerenderedIcons={wowheadMap} />
      </div>

      <div className="flex flex-row items-center justify-end pb-2">
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
            className="relative min-h-[280px] flex-1 overflow-x-auto pl-6"
            ref={scrollContainerRef}
          >
            <TimelineScrollContainer
              averageTimestamps={averageTimestamps}
              wowheadMarkerMap={wowheadMarkerMap}
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
