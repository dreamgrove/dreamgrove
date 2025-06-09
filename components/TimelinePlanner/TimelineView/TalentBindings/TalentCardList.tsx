'use client'

import React from 'react'
import TalentCard from './TalentCard'
import { useTimelineContext } from '../../TimelineProvider/useTimelineContext'

interface TalentCardListProps {
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function TalentCardList({ prerenderedIcons = {} }: TalentCardListProps) {
  const { currentSpec, availableTalents, activeTalents } = useTimelineContext()

  if (availableTalents.length > 0) {
    if (availableTalents.length === 0) {
      return <div className="text-center text-sm text-gray-500">There's nothing to show here</div>
    }

    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {availableTalents.map((item) => {
          const isSelected = activeTalents?.includes(item.id) || false

          const description = item.description
          let classDescription = description['balance']
          if (currentSpec) {
            classDescription = description[currentSpec] || Object.values(description)[0] || ''
          }

          return (
            <TalentCard
              key={item.id}
              id={item.id}
              spellId={Number(item.spellId)}
              name={item.label}
              description={classDescription}
              defaultCheck={isSelected}
              prerenderedIcon={prerenderedIcons[item.spellId.toString()]}
            />
          )
        })}
      </div>
    )
  }
}
