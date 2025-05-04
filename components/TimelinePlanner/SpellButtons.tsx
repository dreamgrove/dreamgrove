import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SpellInfo, CastInfo, SpellCasts, SpellChargeCasts, ChargeIndex } from './types'

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

    // Check if the spell cooldown exceeds the timeline length
    if (spell.cooldown > total_length_s) {
      setErrorMessage(
        `Cannot add ${spell.name}: cooldown (${spell.cooldown}s) exceeds timeline length (${total_length_s}s)`
      )
      return
    }

    // Determine which charge to add next (0-based index)
    let nextChargeIndex: ChargeIndex = 0

    if (existingRows.length > 0) {
      // If we already have rows for this spell, find which charge to add next
      const usedChargeIndices = existingRows.map((row) => row.chargeIndex)

      // If there are fewer used indices than total charges, find the first unused one
      if (usedChargeIndices.length < totalCharges) {
        for (let i = 0; i < totalCharges; i++) {
          if (!usedChargeIndices.includes(i)) {
            nextChargeIndex = i
            break
          }
        }
      } else {
        // All charges have been added at least once, so we'll alternate
        // Group casts by charge index to find which one has fewer casts
        const castsByChargeIndex = new Map<number, number>()

        // Initialize all charge indices with 0 casts
        for (let i = 0; i < totalCharges; i++) {
          castsByChargeIndex.set(i, 0)
        }

        // Count casts for each charge index
        existingRows.forEach((row) => {
          const chargeIndex = row.chargeIndex
          const castsCount = row.casts.length
          castsByChargeIndex.set(chargeIndex, castsCount)
        })

        // Find the charge index with the fewest casts
        let minCasts = Infinity
        let chargeWithMinCasts = 0

        castsByChargeIndex.forEach((count, chargeIndex) => {
          if (count < minCasts) {
            minCasts = count
            chargeWithMinCasts = chargeIndex
          }
        })

        nextChargeIndex = chargeWithMinCasts
      }
    }

    setErrorMessage(null)

    // Find a valid start time for the new cast
    let validStartTime = 0

    // Get the existing row for this charge index if it exists
    const existingRowForCharge = existingRows.find((row) => row.chargeIndex === nextChargeIndex)

    if (existingRowForCharge) {
      // If there are already casts for this charge, place the new cast after the last one
      if (existingRowForCharge.casts.length > 0) {
        const latestEndTime = Math.max(...existingRowForCharge.casts.map((cast) => cast.end_s))
        validStartTime = latestEndTime
      }
    } else if (nextChargeIndex > 0) {
      // For charges after the first, find the previous charge's row
      const prevChargeRow = existingRows.find((row) => row.chargeIndex === nextChargeIndex - 1)

      if (prevChargeRow && prevChargeRow.casts.length > 0) {
        // Find the latest end time of previous charge's casts
        const latestEndTime = Math.max(...prevChargeRow.casts.map((cast) => cast.start_s))
        validStartTime = latestEndTime
      }
    }

    // Create a new cast ID
    const newCastId = `${spell.id}-cast-${uuidv4()}-charge-${nextChargeIndex}`

    // Create the new cast
    const newCast: CastInfo = {
      id: newCastId,
      chargeIndex: nextChargeIndex,
      start_s: validStartTime,
      end_s: validStartTime + spell.cooldown,
    }

    // If we already have a row for this charge, add to it
    if (existingRowForCharge) {
      setCurrentSpells((prevSpells) => {
        return prevSpells.map((row) => {
          if (row.spell.id === spell.id && row.chargeIndex === nextChargeIndex) {
            return {
              ...row,
              casts: [...row.casts, newCast],
            }
          }
          return row
        })
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
