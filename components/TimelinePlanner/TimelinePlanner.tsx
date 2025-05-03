'use client'

import React from 'react'
import styles from './TimelinePlanner.module.css'
import Checkboxes from './Checkboxes'
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
  // Example customization values
  const total_length_s = 240
  const view_length_s = 90 // Show 40 seconds per view width
  const n_markers_per_view = 5 // Show 4 markers evenly spread

  return (
    <div className={styles.timeline}>
      <Checkboxes />
      <LengthControls />
      <TimelineView
        total_length_s={total_length_s}
        view_length_s={view_length_s}
        n_markers_per_view={n_markers_per_view}
        spells={spells}
        wowheadMap={wowheadMap}
        wowheadNameMap={wowheadNameMap}
      />
      <Warnings />
    </div>
  )
}
