'use client'

import React from 'react'
import { SpellInfo, SpellTimeline } from '../../../../lib/types/cd_planner'
import TalentCard from './TalentCard'
import { DruidSpec } from '../TimelineView'
import { useSettings } from '../../Providers/SettingsProvider'

interface TalentCardListProps {
  activeEffects?: string[]
  currentSpells?: SpellTimeline[]
  spells?: SpellInfo[]
  onEffectToggle?: (effectId: string, isActive: boolean) => void

  items?: Array<{
    id: string
    spellId: number | string
    label: string
    description?: string | Record<string, string>
  }>
  selectedItems?: string[]
  onToggle?: (id: string, isSelected: boolean) => void
  prerenderedIcons?: Record<string, React.ReactNode>
  currentSpec?: DruidSpec
}

export default function TalentCardList({
  onEffectToggle,
  items,
  selectedItems,
  onToggle,
  prerenderedIcons = {},
}: TalentCardListProps) {
  const { currentSpec } = useSettings()

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (onToggle) {
      onToggle(id, checked)
    } else if (onEffectToggle) {
      onEffectToggle(id, checked)
    }
  }

  if (items) {
    if (items.length === 0) {
      return <div className="text-center text-sm text-gray-500">There's nothing to show here</div>
    }

    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => {
          const isSelected = selectedItems?.includes(item.id) || false

          let description = item.description
          if (typeof description === 'object' && currentSpec) {
            description = description[currentSpec] || Object.values(description)[0] || ''
          }
          if (typeof description !== 'string') description = ''

          return (
            <TalentCard
              key={item.id}
              id={item.id}
              spellId={Number(item.spellId)}
              name={item.label}
              description={description}
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
