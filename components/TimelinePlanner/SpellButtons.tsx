import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CastInfo } from './Cast'

interface Spell {
  id: string
  spellId: number
  name: string
  channel_duration: number
  effect_duration: number
  cooldown: number
  channeled?: boolean
}

interface SpellButtonsProps {
  currentSpells: {
    spellName: string
    spellId: string | number
    casts: (CastInfo & { id: string })[]
  }[]
  setCurrentSpells: React.Dispatch<
    React.SetStateAction<
      {
        spellName: string
        spellId: string | number
        casts: (CastInfo & { id: string })[]
      }[]
    >
  >
  timeline_total_length_px: number
  total_length_s: number
  spells: Spell[]
}

export default function SpellButtons({
  currentSpells,
  setCurrentSpells,
  timeline_total_length_px,
  total_length_s,
  spells = [],
}: SpellButtonsProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Add effect to clear error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleSpellClick = (spell: Spell) => {
    // Convert spell to the format expected by the component
    const spellInfo = {
      spellName: spell.name,
      spellId: spell.id,
      channel_duration_s: spell.channeled ? spell.channel_duration : 0,
      effect_duration_s: spell.effect_duration,
      spell_cooldown_s: spell.cooldown,
    }

    // Check if the spell is already in currentSpells
    const spellIndex = currentSpells.findIndex((s) => s.spellId === spellInfo.spellId)

    if (spellIndex >= 0) {
      // Spell exists, add a new cast
      const newCastId = `${spellInfo.spellId}-cast-${uuidv4()}`

      // Sort casts by start time to ensure we find the true last cast
      const sortedCasts = [...currentSpells[spellIndex].casts].sort((a, b) => a.start_s - b.start_s)

      // Find the end time of the last cast to position the new cast
      const lastCastEndTime = sortedCasts.length > 0 ? sortedCasts[sortedCasts.length - 1].end_s : 0
      const newCastEndTime = lastCastEndTime + spellInfo.spell_cooldown_s

      // Check if the new cast would exceed the timeline length
      if (newCastEndTime > total_length_s) {
        setErrorMessage(
          `Cannot add ${spell.name}: exceeds timeline length by ${(newCastEndTime - total_length_s).toFixed(1)}s`
        )
        return
      }

      setErrorMessage(null)
      setCurrentSpells((prevSpells) => {
        const updatedSpells = [...prevSpells]

        const newCast = {
          id: newCastId,
          start_s: lastCastEndTime, // Start after the last cast ends
          end_s: newCastEndTime, // End = start + cooldown
          channel_duration_s: spellInfo.channel_duration_s,
          effect_duration_s: spellInfo.effect_duration_s,
          spell_cooldown_s: spellInfo.spell_cooldown_s,
          timeline_total_length_px,
          total_length_s,
        }

        console.log('Adding new cast', newCast)
        updatedSpells[spellIndex] = {
          ...updatedSpells[spellIndex],
          casts: [...updatedSpells[spellIndex].casts, newCast],
        }

        return updatedSpells
      })
    } else {
      // Spell doesn't exist, add it with one cast

      // Check if the spell cooldown exceeds the timeline length
      if (spellInfo.spell_cooldown_s > total_length_s) {
        setErrorMessage(
          `Cannot add ${spell.name}: cooldown (${spellInfo.spell_cooldown_s}s) exceeds timeline length (${total_length_s}s)`
        )
        return
      }

      setErrorMessage(null)
      const newCastId = `${spellInfo.spellId}-cast-${uuidv4()}`

      setCurrentSpells((prevSpells) => [
        ...prevSpells,
        {
          spellName: spellInfo.spellName,
          spellId: spellInfo.spellId,
          casts: [
            {
              id: newCastId,
              start_s: 0, // Start at the beginning of the timeline
              end_s: spellInfo.spell_cooldown_s, // End = start + cooldown
              channel_duration_s: spellInfo.channel_duration_s,
              effect_duration_s: spellInfo.effect_duration_s,
              spell_cooldown_s: spellInfo.spell_cooldown_s,
              timeline_total_length_px,
              total_length_s,
            },
          ],
        },
      ])
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-row gap-2">
        {spells.map((spell) => (
          <button
            key={`spell-button-${spell.id}`}
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => handleSpellClick(spell)}
          >
            {spell.name}
          </button>
        ))}
      </div>
      <div className="mt-2 h-10">
        {errorMessage && (
          <div className="rounded-md bg-red-100 p-2 text-red-800">{errorMessage}</div>
        )}
      </div>
    </div>
  )
}
