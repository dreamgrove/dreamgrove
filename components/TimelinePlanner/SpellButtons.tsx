import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PlayerAction, SPELL_GCD, SpellInfo, TimelineToRender } from '@/types/index'
import CustomElement from './CustomSpell/CustomSpellForm'
import { isCustomSpell, removeCustomSpell } from '@/lib/utils/customSpellStorage'
import CustomSpellIcon from './CustomSpell/CustomSpellIcon'
import { useTimelineContext } from './TimelineProvider/useTimelineContext'

interface SpellButtonsProps {
  prerenderedIcons: Record<string, React.ReactNode>
}

export default function SpellButtons({ prerenderedIcons }: SpellButtonsProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    processedState: currentSpells,
    setInputEvents: setCurrentSpells,
    handleCreateCustomElement: onCreate,
    handleDeleteCustomSpell: onDelete,
    filteredSpells: spells,
  } = useTimelineContext()

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
    <div className="flex flex-col gap-2 py-2">
      {/* Regular spells */}
      <div className="mb-2 flex flex-row flex-wrap justify-between gap-2">
        <div className="flex w-full flex-row flex-wrap gap-2">
          {regularSpells.map((spell) => (
            <SpellButton
              key={`spell-button-${spell.spellId}`}
              spell={spell}
              onClick={() => handleSpellAdd(spell)}
              prerenderedIcon={prerenderedIcons[spell.spellId.toString()]}
            />
          ))}
          <div className="flex-1" />
        </div>
      </div>

      {/* Custom spells section */}
      {customSpells.length > 0 && (
        <div className="mb-2 flex flex-row flex-wrap justify-between gap-2">
          <div className="flex w-full flex-row flex-wrap gap-1">
            <div className="mb-0 w-full text-sm text-gray-400">Custom Spells:</div>
            {customSpells.map((spell) => (
              <div key={`spell-button-wrapper-${spell.spellId}`} className="group relative">
                <SpellButton
                  spell={spell}
                  onClick={() => handleSpellAdd(spell)}
                  prerenderedIcon={prerenderedIcons[spell.spellId.toString()]}
                />
                <button
                  onClick={() => {
                    removeCustomSpell(spell.spellId)
                    onDelete?.(spell.spellId)
                  }}
                  className="text-md absolute -top-[5px] -right-[5px] flex h-[16px] w-[16px] items-center justify-center rounded-md bg-pink-700 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-700"
                  title="Delete custom spell"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-row gap-2 text-sm">
        <CustomElement onCreate={onCreate} onDelete={onDelete} />
        <button
          key={`spell-reset`}
          className="w-fit rounded-xs bg-red-600/40 px-4 py-2 text-white hover:bg-red-500/60 focus:outline-hidden"
          onClick={() => setCurrentSpells([])}
        >
          Reset All Spells
        </button>
      </div>
    </div>
  )
}

const SpellButton = ({
  spell,
  onClick,
  prerenderedIcon,
}: {
  spell: SpellInfo
  onClick: () => void
  prerenderedIcon?: React.ReactNode
}) => {
  const isCustom = isCustomSpell(spell)

  // Use prerendered icon if available, otherwise fallback for custom spells or a placeholder
  const iconElement = isCustom ? (
    <CustomSpellIcon spell={spell} size="sm" />
  ) : prerenderedIcon ? (
    prerenderedIcon
  ) : (
    <span
      className="inline-block h-[20px] w-[20px] rounded-xs bg-gray-200"
      title={`${spell.name} (icon unavailable)`}
    />
  )

  return (
    <button
      className="inline-flex flex-row items-center gap-2 rounded-xs border border-orange-500/20 bg-neutral-900/50 px-4 py-2 text-white hover:bg-orange-400/5 focus:outline-hidden"
      onClick={onClick}
    >
      <div className="inline-block aspect-square h-5">{iconElement}</div>
      <span className="trim-text text-sm">{spell.name}</span>
    </button>
  )
}
