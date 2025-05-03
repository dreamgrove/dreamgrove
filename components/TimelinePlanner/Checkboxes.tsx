'use client'

import React, { useState } from 'react'
import styles from './TimelinePlanner.module.css'
import { SpellInfo, SpellCasts, TimelineEffect } from './types'
import { timelineEffects, applyTimelineEffects } from './TimelineEffects'

interface CheckboxesProps {
  effects?: TimelineEffect[]
  activeEffects?: string[]
  currentSpells?: SpellCasts[]
  spells?: SpellInfo[]
  timeline_total_length_px?: number
  total_length_s?: number
  onEffectsApplied?: (updatedSpells: SpellCasts[]) => void
  onEffectToggle?: (effectId: string, isActive: boolean) => void
}

export default function Checkboxes({
  effects = timelineEffects, // Default to imported effects
  activeEffects: propActiveEffects = [],
  currentSpells = [],
  spells = [],
  timeline_total_length_px = 0,
  total_length_s = 0,
  onEffectsApplied,
  onEffectToggle,
}: CheckboxesProps) {
  // Local state to track enabled effects if not controlled from parent
  const [localActiveEffects, setLocalActiveEffects] = useState<string[]>([])

  // Use either prop-provided active effects or local state
  const activeEffects = propActiveEffects.length > 0 ? propActiveEffects : localActiveEffects

  const handleCheckboxChange = (effectId: string, checked: boolean) => {
    console.log(`Effect ${effectId} toggled to ${checked ? 'active' : 'inactive'}`)

    // Update local state
    let newActiveEffects: string[]
    if (checked) {
      newActiveEffects = [...activeEffects, effectId]
    } else {
      newActiveEffects = activeEffects.filter((id) => id !== effectId)
    }

    // Update local state if no external control
    if (propActiveEffects.length === 0) {
      setLocalActiveEffects(newActiveEffects)
    }

    // Apply the effects to spells
    if (currentSpells.length > 0) {
      try {
        // Apply the effects
        const updatedSpells = applyTimelineEffects(currentSpells, newActiveEffects, spells)

        // Call the callback with updated spells if provided
        if (onEffectsApplied) {
          onEffectsApplied(updatedSpells)
        }
      } catch (error) {
        console.error('Error applying effects:', error)
      }
    }

    // Call the parent callback if provided
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
      {effects.map((effect) => (
        <div key={effect.id} style={{ marginBottom: 8 }}>
          <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={activeEffects.includes(effect.id)}
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
      ))}
    </div>
  )
}
