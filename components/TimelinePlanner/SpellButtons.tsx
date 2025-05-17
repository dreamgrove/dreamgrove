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
import { CastParams } from '../../lib/types/cd_planner'

interface SpellButtonsProps {
  currentSpells: TimelineToRender
  setCurrentSpells: React.Dispatch<React.SetStateAction<PlayerAction[]>>
  spells: SpellInfo[]
}

export default function SpellButtons({
  currentSpells,
  setCurrentSpells,
  spells = [],
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
      <div className="flex flex-row gap-2">
        {spells.map((spell) => (
          <button
            key={`spell-button-${spell.id}`}
            className="rounded bg-orange-400/40 px-4 py-2 text-white hover:bg-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onClick={() => handleSpellAdd(spell)}
          >
            {spell.charges && spell.charges > 1 ? `${spell.name} (${spell.charges})` : spell.name}
          </button>
        ))}
        <button
          key={`spell-reset`}
          className="rounded bg-red-700/50 px-4 py-2 text-white hover:bg-red-700/70 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setCurrentSpells([])}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
