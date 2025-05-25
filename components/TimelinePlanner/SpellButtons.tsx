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
import {
  isCustomSpell,
  removeCustomSpell,
  loadCustomSpells,
} from '../../lib/utils/customSpellStorage'
import CustomSpellIcon from './CustomSpellIcon'

interface SpellButtonsProps {
  currentSpells: TimelineToRender
  setCurrentSpells: React.Dispatch<React.SetStateAction<PlayerAction[]>>
  spells: SpellInfo[]
  onCreate: (spell: SpellInfo) => void
  onDelete?: (spellId: number) => void
}

export default function SpellButtons({
  currentSpells,
  setCurrentSpells,
  spells = [],
  onCreate,
  onDelete,
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

  // Separate custom spells from regular spells
  const regularSpells = spells.filter((spell) => !isCustomSpell(spell))
  const customSpells = spells.filter((spell) => isCustomSpell(spell))

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Regular spells */}
      <div className="mb-2 flex flex-row flex-wrap justify-between gap-2">
        <div className="flex w-full flex-row flex-wrap gap-2">
          {regularSpells.map((spell) => (
            <SpellButton
              key={`spell-button-${spell.spellId}`}
              spell={spell}
              onClick={() => handleSpellAdd(spell)}
            />
          ))}
          <div className="flex-1" />
        </div>
      </div>

      {/* Custom spells section */}
      {customSpells.length > 0 && (
        <div className="mb-2 flex flex-row flex-wrap justify-between gap-2">
          <div className="flex w-full flex-row flex-wrap gap-2">
            <div className="mb-1 w-full text-sm text-gray-400">Custom Spells:</div>
            {customSpells.map((spell) => (
              <div key={`spell-button-wrapper-${spell.spellId}`} className="group relative">
                <SpellButton spell={spell} onClick={() => handleSpellAdd(spell)} />
                <button
                  onClick={() => {
                    removeCustomSpell(spell.spellId)
                    onDelete?.(spell.spellId)
                  }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-700"
                  title="Delete custom spell"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex-1" />
          </div>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <CustomElement onCreate={onCreate} onDelete={onDelete} />
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
  const isCustom = isCustomSpell(spell)

  return (
    <button
      className="flex flex-row items-center gap-2 rounded-xs border-[1px] border-orange-500/20 bg-neutral-900/50 px-4 py-2 text-white hover:bg-orange-400/20 focus:outline-hidden"
      onClick={onClick}
    >
      {isCustom ? (
        <CustomSpellIcon spell={spell} size="sm" />
      ) : (
        <WowheadClientIcon
          id={spell.spellId.toString()}
          type="spell"
          name={spell.name}
          size={20}
          noLink
        />
      )}
      {spell.charges && spell.charges > 1 ? `${spell.name} (${spell.charges})` : spell.name}
    </button>
  )
}
