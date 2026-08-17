import React from 'react'
import TalentCard from './TalentCard'
import TalentChoiceNode from './TalentChoiceNode'
import { TalentBindings } from '@/types/index'
import { useTimelineContext } from '../../TimelineProvider/useTimelineContext'

interface TalentCardListProps {
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function TalentCardList({ prerenderedIcons = {} }: TalentCardListProps) {
  const { currentSpec, availableTalents } = useTimelineContext()

  if (availableTalents.length > 0) {
    if (availableTalents.length === 0) {
      return <div className="text-center text-sm text-gray-500">There's nothing to show here</div>
    }

    const resolveDescription = (item: TalentBindings) => {
      const description = item.description
      let classDescription = description['balance']
      if (currentSpec) {
        classDescription = description[currentSpec] || Object.values(description)[0] || ''
      }
      return classDescription
    }

    const renderCard = (item: TalentBindings) => (
      <TalentCard
        key={item.id}
        id={item.id}
        name={item.label}
        description={resolveDescription(item)}
        prerenderedIcon={prerenderedIcons[item.spellId.toString()]}
      />
    )

    // Group mutually-exclusive talents (choice nodes) into joined pairs when
    // both halves are available; otherwise render them as standalone cards.
    const rendered = new Set<string>()
    const units: React.ReactNode[] = []

    availableTalents.forEach((item) => {
      if (rendered.has(item.id)) return

      const partner = (item.exclusiveWith ?? [])
        .map((partnerId) => availableTalents.find((talent) => talent.id === partnerId))
        .find((talent) => talent !== undefined && !rendered.has(talent.id))

      rendered.add(item.id)

      if (partner) {
        rendered.add(partner.id)
        units.push(
          <TalentChoiceNode
            key={`${item.id}-${partner.id}`}
            label={`Choose one: ${item.label} or ${partner.label}`}
          >
            {renderCard(item)}
            {renderCard(partner)}
          </TalentChoiceNode>
        )
      } else {
        units.push(renderCard(item))
      }
    })

    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {units}
      </div>
    )
  }
}
