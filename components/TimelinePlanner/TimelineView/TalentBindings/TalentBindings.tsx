import React from 'react'
import TalentCardList from './TalentCardList'

export interface TalentBindingsProps {
  prerenderedIcons?: Record<string, React.ReactNode>
}

export default function TalentBindings({ prerenderedIcons = {} }: TalentBindingsProps) {
  return (
    <div className="">
      <h1 className="mb-1 text-lg font-semibold">Talents:</h1>
      <TalentCardList prerenderedIcons={prerenderedIcons} />
    </div>
  )
}
