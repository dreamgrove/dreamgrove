'use client'

import React from 'react'
import styles from './TimelinePlanner.module.css'
import { SpellInfo, SpellCasts, TimelineEffect } from './types'
import { timelineEffects } from './TimelineEffects'

interface CheckboxesProps {
  effects?: TimelineEffect[]
  activeEffects?: string[]
  currentSpells?: SpellCasts[]
  spells?: SpellInfo[]
  onEffectToggle?: (effectId: string, isActive: boolean) => void
}

export default function Checkboxes({
  effects = timelineEffects, // Default to imported effects
  activeEffects = [],
  onEffectToggle,
}: CheckboxesProps) {
  const handleCheckboxChange = (effectId: string, checked: boolean) => {
    if (onEffectToggle) {
      onEffectToggle(effectId, checked)
    }
  }

  // If no effects are provided, show a message
  if (effects.length === 0) {
    return <div className={styles.checkboxContainer}>[No timeline effects defined]</div>
  }

  return (
    <div className={styles.checkboxContainer}>
      {effects.map((effect) => {
        // Check if this effect is in the activeEffects array
        const isActive = activeEffects.includes(effect.id)

        return (
          <div key={effect.id} style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                // This is a controlled component - the checked state comes from props
                checked={isActive}
                onChange={(e) => handleCheckboxChange(effect.id, e.target.checked)}
                style={{ marginRight: 8 }}
              />
              {effect.name}
              {effect.description && (
                <span style={{ marginLeft: 8, fontSize: '0.9em', color: '#666' }}>
                  ({effect.description})
                </span>
              )}
            </label>
          </div>
        )
      })}
    </div>
  )
}
