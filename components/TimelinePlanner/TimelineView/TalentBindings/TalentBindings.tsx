import React from 'react'
import TalentCardList from './TalentCardList'

export interface TalentBindingsProps {
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function TalentBindings({ prerenderedIcons = {} }: TalentBindingsProps) {
  return (
    <div className="">
      <h2 className="mb-1 text-lg font-semibold">Talents:</h2>
      <TalentCardList prerenderedIcons={prerenderedIcons} />
    </div>
  )
}
