import React from 'react'
import Checkboxes from './Checkboxes'

interface ActionBindingsProps {
  bindings: Array<{
    id: string
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
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-300">Action Bindings</h3>
      <Checkboxes items={bindings} selectedItems={activeBindings} onToggle={onToggle} />
    </div>
  )
}
