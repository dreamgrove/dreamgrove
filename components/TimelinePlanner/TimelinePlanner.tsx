'use client'

import React, { useState } from 'react'
import styles from './TimelinePlanner.module.css'
import LengthControls from './LengthControls'
import TimelineView from './TimelineView'
import Warnings from './Warnings'

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
}

export default function TimelinePlanner({
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
}: TimelinePlannerProps) {
  // State for timeline length and markers per view
  const [total_length_s, setTotalLength] = useState(240)
  const [view_length_s, setViewLength] = useState(60) // Show 60 seconds per view width by default
  const marker_spacing_s = 10 // seconds between markers

  return (
    <div className={styles.timeline}>
      <TimelineView
        total_length_s={total_length_s}
        view_length_s={view_length_s}
        setViewLength={setViewLength}
        marker_spacing_s={marker_spacing_s}
        spells={spells}
        wowheadMap={wowheadMap}
        wowheadNameMap={wowheadNameMap}
      />
      <Warnings />
    </div>
  )
}
