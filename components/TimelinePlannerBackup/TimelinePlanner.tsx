'use client'

import React, { useState, useEffect } from 'react'
import styles from './TimelinePlanner.module.css'
import LengthControls from './LengthControls'
import TimelineView from './TimelineView'
import Warnings from './Warnings'
import Link from 'next/link'
import FightSelector from './FightSelector'
import { TimelineProvider } from './TimelineContext'

interface Spell {
  id: string
  spellId: number
  name: string
  channel_duration: number
  effect_duration: number
  cooldown: number
  channeled?: boolean
}

interface TimelinePlannerProps {
  spells: Spell[]
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
  // Default timeline settings - passed to provider
  const initialTotalLength = 240
  const initialViewLength = 60
  const initialMarkerSpacing = 10

  // State for current encounter
  const [currentEncounterId, setCurrentEncounterId] = useState('empty')

  // Effect to handle encounter changes
  useEffect(() => {
    console.log(`Selected encounter changed to: ${currentEncounterId}`)

    // In the future, you could implement loading encounter-specific data here
    // For example:
    // if (currentEncounterId !== 'empty') {
    //   loadEncounterData(currentEncounterId);
    // }
  }, [currentEncounterId])

  return (
    <div className={styles.timeline}>
      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0">
        <FightSelector
          currentEncounterId={currentEncounterId}
          onEncounterChange={setCurrentEncounterId}
        />
      </div>

      {/* The TimelineProvider now fully manages timeline state */}
      <TimelineProvider
        initialTotalLength={initialTotalLength}
        initialViewLength={initialViewLength}
        initialMarkerSpacing={initialMarkerSpacing}
      >
        <TimelineView
          total_length_s={initialTotalLength}
          view_length_s={initialViewLength}
          setViewLength={() => {}} // This is now handled by context
          marker_spacing_s={initialMarkerSpacing}
          spells={spells}
          wowheadMap={wowheadMap}
          wowheadNameMap={wowheadNameMap}
          wowheadMarkerMap={wowheadMarkerMap}
          averageTimestamps={averageTimestamps}
          currentEncounterId={currentEncounterId}
        />
      </TimelineProvider>
      <Warnings />
    </div>
  )
}
