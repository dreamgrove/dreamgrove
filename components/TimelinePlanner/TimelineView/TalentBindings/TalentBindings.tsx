import React from 'react'
import TalentCardList from './TalentCardList'

export interface TalentBindingsProps {
  bindings: Array<{
    id: string
    spellId: number | string
    label: string
    description?: Record<string, string>
  }>
  activeBindings: string[]
  onToggle: (id: string, isSelected: boolean) => void
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function TalentBindings({
  bindings,
  activeBindings,
  onToggle,
  prerenderedIcons = {},
}: TalentBindingsProps) {
  return (
    <div className="">
      <h1 className="mb-1 text-lg font-semibold">Talents:</h1>
      <TalentCardList
        items={bindings}
        selectedItems={activeBindings}
        onToggle={onToggle}
        prerenderedIcons={prerenderedIcons}
      />
    </div>
  )
}
