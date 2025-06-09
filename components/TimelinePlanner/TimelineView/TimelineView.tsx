import React from 'react'
import SpellButtons from '../SpellButtons'
import TalentBindings from './TalentBindings/TalentBindings'
import { SpellInfo, PlayerAction } from '@/types/index'
import { useTimelineControls } from '../Providers/TimelineLengthProvider'
import { useNextStep } from 'nextstepjs'
import { HoverProvider } from '../Providers/HoverProvider'
import Warnings from '../Warnings'
import MRTExport from '../MRTExport'
import Sidebar from '../Sidebar/Sidebar'
import SpecSelector from './SpecSelector'
import ZoomControls from './ZoomControls'
import SpellNames from './SpellNames'
import TimelineScrollContainer from './TimelineScrollContainer'
import { useProcessedTimeline } from 'hooks/useProcessedTimeline'
import { useLocalSpells } from 'hooks/useLocalSpells'
import { useTimelineEvents } from 'hooks/useTimelineActions'
import { useActiveBindings } from 'hooks/useActiveBindings'
import { useKeysToActions } from 'hooks/useKeysToActions'
import { useTimelineScroll } from 'hooks/useTimelineScroll'
import { SettingsProvider, useSettings } from '../Providers/SettingsProvider'
import { TimelineProvider } from '../TimelineProvider/TimelineProvider'
import { useTimelineContext } from '../TimelineProvider/useTimelineContext'

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
  const { scrollContainerRef } = useTimelineScroll()

  // Tour logic
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

      {/* Action bindings */}
      <div id="tour-effects-selector" className="my-2">
        <TalentBindings prerenderedIcons={wowheadMap} />
      </div>

      <div className="my-2 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

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
              wowheadNameMap={wowheadNameMap}
              marker_spacing_s={marker_spacing_s}
              averageTimestamps={averageTimestamps}
              wowheadMarkerMap={wowheadMarkerMap}
            />
          </div>
        </div>
      </HoverProvider>

      {/* divider */}
      <div className="mx-[4px] mt-6 mb-4 h-[2px] w-full flex-shrink-0 bg-gray-700/40" />

      <Warnings />

      <Sidebar markerSpacing={marker_spacing_s} />
    </div>
  )
}

export default function TimelineView(props: TimelineViewProps) {
  return (
    <SettingsProvider>
      <TimelineProvider spells={props.spells} extraSpells={props.extraSpells}>
        <TimelineViewInner {...props} />
      </TimelineProvider>
    </SettingsProvider>
  )
}
