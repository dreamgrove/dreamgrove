import React from 'react'
import Checkboxes from './Checkboxes'

interface ActionBindingsProps {
  bindings: Array<{
    id: string
    spellId: number | string
    label: string
    description?: string
  }>
  activeBindings: string[]
  onToggle: (id: string, isSelected: boolean) => void
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function ActionBindings({
  bindings,
  activeBindings,
  onToggle,
  prerenderedIcons = {},
}: ActionBindingsProps) {
  return (
    <div className="">
      <h1 className="mb-1 text-lg font-semibold">Talents:</h1>
      <Checkboxes
        items={bindings}
        selectedItems={activeBindings}
        onToggle={onToggle}
        prerenderedIcons={prerenderedIcons}
      />
    </div>
  )
}
