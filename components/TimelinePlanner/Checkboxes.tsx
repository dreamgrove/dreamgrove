'use client'

import React from 'react'
import styles from './TimelinePlanner.module.css'
import { SpellInfo, SpellTimeline, TimelineEffect } from './types'
import { timelineEffects } from './TimelineEffects'

interface CheckboxesProps {
  effects?: TimelineEffect[]
  activeEffects?: string[]
  currentSpells?: SpellTimeline[]
  spells?: SpellInfo[]
  onEffectToggle?: (effectId: string, isActive: boolean) => void

  items?: Array<{ id: string; label: string; description?: string }>
  selectedItems?: string[]
  onToggle?: (id: string, isSelected: boolean) => void
}

export default function Checkboxes({
  effects = timelineEffects, // Default to imported effects
  activeEffects = [],
  onEffectToggle,

  items,
  selectedItems,
  onToggle,
}: CheckboxesProps) {
  const useNewInterface = Boolean(items)

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (useNewInterface && onToggle) {
      onToggle(id, checked)
    } else if (onEffectToggle) {
      onEffectToggle(id, checked)
    }
  }

  if (useNewInterface && items) {
    if (items.length === 0) {
      return <div className={styles.checkboxContainer}>[No items defined]</div>
    }

    return (
      <div className={styles.checkboxContainer}>
        {items.map((item) => {
          const isSelected = selectedItems?.includes(item.id) || false

          return (
            <div key={item.id} style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                {item.label}
                {item.description && (
                  <span style={{ marginLeft: 8, fontSize: '0.9em', color: '#666' }}>
                    ({item.description})
                  </span>
                )}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  if (effects.length === 0) {
    return <div className={styles.checkboxContainer}>[No timeline effects defined]</div>
  }

  return (
    <div className={styles.checkboxContainer}>
      {effects.map((effect) => {
        const isActive = activeEffects.includes(effect.id)

        return (
          <div key={effect.id} style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
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
