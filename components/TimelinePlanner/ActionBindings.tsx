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
}

export default function ActionBindings({
  bindings,
  activeBindings,
  onToggle,
}: ActionBindingsProps) {
  return (
    <div className="mb-4 select-none">
      <h1 className="mb-2 text-xl font-semibold text-gray-300">TALENTS:</h1>
      <Checkboxes items={bindings} selectedItems={activeBindings} onToggle={onToggle} />
    </div>
  )
}
