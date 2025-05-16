import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SpellInfo, CastInfo, SpellChargeCasts, ChargeIndex, SPELL_GCD } from './types'

interface SpellButtonsProps {
  currentSpells: SpellChargeCasts[]
  setCurrentSpells: React.Dispatch<React.SetStateAction<SpellChargeCasts[]>>
  total_length_s: number
  spells: SpellInfo[]
}

export default function SpellButtons({
  currentSpells,
  setCurrentSpells,
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

  const handleSpellClick = (spell: SpellInfo) => {
    // Determine how many charges this spell has (default to 1 if not specified)
    const totalCharges = spell.charges || 1

    // Find all existing rows for this spell
    const existingRows = currentSpells.filter((row) => row.spell.id === spell.id)

    // Determine which charge to add next (0-based index)
    let nextChargeIndex: ChargeIndex = 0

    if (existingRows.length > 0) {
      // If we already have rows for this spell, cycle through charges
      const totalCasts = existingRows.reduce((sum, row) => sum + row.casts.length, 0)
      nextChargeIndex = totalCasts % totalCharges
    }

    setErrorMessage(null)

    // Find a valid start time for the new cast
    let validStartTime = 0
    if (spell.id === 'reforestation') {
      validStartTime = spell.cooldown
    }
    let cdDelay

    // Get the existing row for this charge index if it exists
    const existingRowForCharge = existingRows.find((row) => row.chargeIndex === nextChargeIndex)

    if (existingRowForCharge) {
      // If there are already casts for this charge, place the new cast after the last one
      if (existingRowForCharge.casts.length > 0) {
        const latestEndTime = Math.max(...existingRowForCharge.casts.map((cast) => cast.end_s))
        validStartTime = latestEndTime
      }

      const previousChargeIndex = nextChargeIndex === 0 ? totalCharges - 1 : nextChargeIndex - 1
      const previousChargeRow = existingRows.find((row) => row.chargeIndex === previousChargeIndex)
      if (previousChargeRow) {
        const previousChargeCastStartTime = Math.max(
          ...previousChargeRow.casts.map((cast) => cast.start_s)
        )
        if (previousChargeCastStartTime > validStartTime) {
          validStartTime = previousChargeCastStartTime + SPELL_GCD
        }
      }
    } else if (nextChargeIndex > 0) {
      // For charges after the first, find the previous charge's row
      const prevChargeRow = existingRows.find((row) => row.chargeIndex === nextChargeIndex - 1)

      if (prevChargeRow && prevChargeRow.casts.length > 0) {
        // Find the latest start time of previous charge's casts
        const latestStartTime = Math.max(...prevChargeRow.casts.map((cast) => cast.start_s))
        validStartTime = latestStartTime
      }
    }

    // Create a new cast ID
    const newCastId = `${spell.id}-cast-${uuidv4()}-charge-${nextChargeIndex}`

    // Calculate end_s based on charge mechanics
    let endTime = validStartTime + spell.cooldown

    // For charges after the first, the cooldown doesn't start until previous charge's cooldown ends
    if (existingRows.length > 0) {
      // Find the previous charge row
      const prevChargeIndex = nextChargeIndex === 0 ? totalCharges - 1 : nextChargeIndex - 1
      const prevChargeRow = existingRows.find((row) => row.chargeIndex === prevChargeIndex)
      if (prevChargeRow && prevChargeRow.casts.length > 0) {
        // Get the end time of the most recent cast of the previous charge
        const prevChargeEndTime = Math.max(...prevChargeRow.casts.map((cast) => cast.end_s))

        endTime = Math.max(endTime, prevChargeEndTime + spell.cooldown)
        cdDelay = [prevChargeEndTime, prevChargeEndTime + spell.cooldown]
      }
    }

    // Create the new cast
    const newCast: CastInfo = {
      id: newCastId,
      chargeIndex: nextChargeIndex,
      start_s: validStartTime,
      end_s: endTime,
      delay_s: cdDelay,
    }

    // If we already have a row for this charge, add to it
    if (existingRowForCharge) {
      setCurrentSpells((prevSpells) => {
        const updated = prevSpells.map((row) => {
          if (row.spell.id === spell.id && row.chargeIndex === nextChargeIndex) {
            return {
              ...row,
              casts: [...row.casts, newCast],
            }
          }
          return row
        })
        return updated
      })
    } else {
      // Create a new spell charge row
      const newSpellChargeRow: SpellChargeCasts = {
        spell,
        chargeIndex: nextChargeIndex,
        casts: [newCast],
      }

      // Add the new row to the current spells
      setCurrentSpells((prevSpells) => {
        const newSpells = [...prevSpells, newSpellChargeRow]
        return newSpells
      })
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
            {spell.charges && spell.charges > 1 ? `${spell.name} (${spell.charges})` : spell.name}
          </button>
        ))}
        <button
          key={`spell-reset`}
          className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setCurrentSpells([])}
        >
          Reset
        </button>
      </div>
      <div className="mt-2 h-10">
        {errorMessage && (
          <div className="rounded-md bg-red-100 p-2 text-red-800">{errorMessage}</div>
        )}
      </div>
    </div>
  )
}
