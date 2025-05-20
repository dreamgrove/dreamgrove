'use client'

import React from 'react'
import styles from './TimelinePlanner.module.css'
import { SpellInfo, SpellTimeline, TimelineEffect } from '../../lib/types/cd_planner'

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
      return <div className={styles.checkboxContainer}>There's nothing to show here</div>
    }

    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isSelected = selectedItems?.includes(item.id) || false

          return (
            <Item
              key={item.id}
              item={item}
              isSelected={isSelected}
              onToggle={handleCheckboxChange}
            />
          )
        })}
      </div>
    )
  }
}

const Item = ({
  item,
  isSelected,
  onToggle,
}: {
  item: { id: string; label: string; description?: string }
  isSelected: boolean
  onToggle: (id: string, isSelected: boolean) => void
}) => {
  return (
    <div className="flex">
      <div className="flex h-5 items-center">
        <input
          id={item.id}
          aria-describedby={`${item.id}-text`}
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          value=""
          className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
      </div>
      <div className="ms-2 text-[0.8rem]">
        <label htmlFor={item.id} className="text-md font-bold text-gray-900 dark:text-gray-200">
          {item.label}
        </label>
        <p id={`${item.id}-text`} className="text-md font-normal text-gray-500 dark:text-gray-500">
          {item.description}
        </p>
      </div>
    </div>
  )
}
