'use client'

import React, { useState, useEffect } from 'react'
import styles from './TimelinePlanner.module.css'
import LengthControls from './LengthControls'
import TimelineView from './TimelineView'
import Warnings from './Warnings'
import Link from 'next/link'
import FightSelector from './FightSelector'
import { TimelineProvider } from './TimelineContext'
import { SpellInfo } from '../../lib/types/cd_planner'

interface TimelinePlannerProps {
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
  wowheadMarkerMap?: Record<string, React.ReactNode>
  averageTimestamps?: Record<string, number[]>
}

export default function TimelinePlanner({
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
}: TimelinePlannerProps) {
  const initialTotalLength = 240
  const initialViewLength = 180
  const initialMarkerSpacing = 10

  const [currentEncounterId, setCurrentEncounterId] = useState('empty')

  console.log(wowheadMap)

  useEffect(() => {
    console.log(`Selected encounter changed to: ${currentEncounterId}`)

    // if (currentEncounterId !== 'empty') {
    //   loadEncounterData(currentEncounterId);
    // }
  }, [currentEncounterId])

  return (
    <div className={styles.timeline}>
      {false && (
        <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <FightSelector
            currentEncounterId={currentEncounterId}
            onEncounterChange={setCurrentEncounterId}
          />
        </div>
      )}

      <TimelineProvider
        initialTotalLength={initialTotalLength}
        initialViewLength={initialViewLength}
        initialMarkerSpacing={initialMarkerSpacing}
      >
        <TimelineView
          view_length_s={initialViewLength}
          marker_spacing_s={initialMarkerSpacing}
          spells={spells}
          wowheadMap={wowheadMap}
          wowheadNameMap={wowheadNameMap}
          wowheadMarkerMap={wowheadMarkerMap}
          averageTimestamps={averageTimestamps}
          currentEncounterId={currentEncounterId}
        />
      </TimelineProvider>
      {false && <Warnings />}
    </div>
  )
}
