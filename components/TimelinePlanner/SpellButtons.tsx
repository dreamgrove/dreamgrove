import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Cast,
  PlayerAction,
  SPELL_GCD,
  SpellInfo,
  SpellTimeline,
  TimelineToRender,
} from '../../lib/types/cd_planner'
import CustomElement from './CustomElement'
import WowheadClientIcon from '../csm/WowheadClientIcon'

interface SpellButtonsProps {
  currentSpells: TimelineToRender
  setCurrentSpells: React.Dispatch<React.SetStateAction<PlayerAction[]>>
  spells: SpellInfo[]
  onCreate: (spell: SpellInfo) => void
}

export default function SpellButtons({
  currentSpells,
  setCurrentSpells,
  spells = [],
  onCreate,
}: SpellButtonsProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleSpellAdd = (spell: SpellInfo) => {
    const matchingSpell = currentSpells.spells.find((s) => s.spell.spellId === spell.spellId)

    let startTime = 0

    if (matchingSpell && matchingSpell.casts.length > 0) {
      const startTimes = matchingSpell.casts.map((cast) => cast.start_s)

      if (startTimes.length > 0) {
        startTime = Math.max(...startTimes) + SPELL_GCD
      }
    }

    const newAction: PlayerAction = {
      spell,
      instant: startTime,
      id: uuidv4(),
    }

    setCurrentSpells((prevActions) => {
      const newActions = [...prevActions, newAction]
      return newActions
    })
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="mb-2 flex flex-row flex-wrap justify-between gap-2">
        <div className="flex w-full flex-row flex-wrap gap-2">
          {spells.map((spell) => (
            <SpellButton
              key={`spell-button-${spell.spellId}`}
              spell={spell}
              onClick={() => handleSpellAdd(spell)}
            />
          ))}
          <div className="flex-1" />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <CustomElement onCreate={onCreate} />
        <button
          key={`spell-reset`}
          className="w-fit rounded-xs bg-red-600/50 px-4 py-2 text-white hover:bg-red-700/50 focus:outline-hidden"
          onClick={() => setCurrentSpells([])}
        >
          Reset All Spells
        </button>
      </div>
    </div>
  )
}

const SpellButton = ({ spell, onClick }: { spell: SpellInfo; onClick: () => void }) => {
  return (
    <button
      key={`spell-button-${spell.spellId}`}
      className="flex flex-row items-center gap-2 rounded-xs border-[1px] border-orange-500/20 bg-neutral-900/50 px-4 py-2 text-white hover:bg-orange-400/20 focus:outline-hidden"
      onClick={onClick}
    >
      <WowheadClientIcon
        id={spell.spellId.toString()}
        type="spell"
        name={spell.name}
        size={20}
        noLink
      />
      {spell.charges && spell.charges > 1 ? `${spell.name} (${spell.charges})` : spell.name}
    </button>
  )
}
