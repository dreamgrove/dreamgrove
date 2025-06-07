'use client'

import React from 'react'
import styles from './TimelinePlanner.module.css'
import { SpellInfo, SpellTimeline } from '../../lib/types/cd_planner'
import TimelineCheckbox from './TimelineCheckbox'

interface CheckboxesProps {
  activeEffects?: string[]
  currentSpells?: SpellTimeline[]
  spells?: SpellInfo[]
  onEffectToggle?: (effectId: string, isActive: boolean) => void

  items?: Array<{ id: string; spellId: number | string; label: string; description?: string }>
  selectedItems?: string[]
  onToggle?: (id: string, isSelected: boolean) => void
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function Checkboxes({
  onEffectToggle,

  items,
  selectedItems,
  onToggle,
  prerenderedIcons = {},
}: CheckboxesProps) {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (onToggle) {
      onToggle(id, checked)
    } else if (onEffectToggle) {
      onEffectToggle(id, checked)
    }
  }

  if (items) {
    if (items.length === 0) {
      return <div className={styles.checkboxContainer}>There's nothing to show here</div>
    }

    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => {
          const isSelected = selectedItems?.includes(item.id) || false

          return (
            <TimelineCheckbox
              key={item.id}
              id={item.id}
              spellId={Number(item.spellId)}
              name={item.label}
              description={item.description}
              defaultCheck={isSelected}
              onToggle={handleCheckboxChange}
              prerenderedIcon={prerenderedIcons[item.spellId.toString()]}
            />
          )
        })}
      </div>
    )
  }
}
