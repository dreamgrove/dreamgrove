import React from 'react'
import Checkboxes from './Checkboxes'
import { DruidSpec } from './TimelineView'

export interface ActionBindingsProps {
  bindings: Array<{
    id: string
    spellId: number | string
    label: string
    description?: Record<string, string>
  }>
  activeBindings: string[]
  onToggle: (id: string, isSelected: boolean) => void
  prerenderedIcons?: Record<string, React.ReactNode>
  currentSpec?: DruidSpec
}

export default function ActionBindings({
  bindings,
  activeBindings,
  onToggle,
  prerenderedIcons = {},
  currentSpec,
}: ActionBindingsProps) {
  return (
    <div className="">
      <h1 className="mb-1 text-lg font-semibold">Talents:</h1>
      <Checkboxes
        items={bindings}
        selectedItems={activeBindings}
        onToggle={onToggle}
        prerenderedIcons={prerenderedIcons}
        currentSpec={currentSpec}
      />
    </div>
  )
}
