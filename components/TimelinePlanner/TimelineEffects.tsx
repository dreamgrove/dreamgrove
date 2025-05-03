import { SpellInfo, CastInfo, SpellCasts, TimelineEffect } from './types'

// Force of Nature IDs - for use in effects
const FORCE_OF_NATURE_IDS = [33831, 'force_of_nature']

// Export the collection of timeline effects
export const timelineEffects: TimelineEffect[] = [
  {
    id: 'control_of_dream',
    name: 'Control of the Dream',
    description: 'Reduces cooldown of Celestial Alignment/Incarnation by 15s',
    applyEffect: (currentSpells: SpellCasts[], availableSpells: SpellInfo[]) => {
      // This is just a placeholder - actual implementation would go here
      return currentSpells
    },
  },
  {
    id: 'stack_cds',
    name: 'Stack Cooldowns',
    description: 'Move cooldowns to align with major CDs',
    applyEffect: (currentSpells: SpellCasts[], availableSpells: SpellInfo[]) => {
      // This is just a placeholder - actual implementation would go here
      return currentSpells
    },
  },
  {
    id: 'force_of_test',
    name: 'Force of Test',
    description: 'Reduces cooldown of Force of Nature by 10s',
    applyEffect: (currentSpells: SpellCasts[], availableSpells: SpellInfo[]) => {
      // Add logging to help debug issues
      console.log('Force of Test effect applied')
      console.log('Input spells:', JSON.stringify(currentSpells))

      // Don't modify the timeline if there are no casts
      if (currentSpells.length === 0) {
        console.log('No casts to modify')
        return currentSpells
      }

      // Implementation to reduce FoN cooldown by 10s
      return currentSpells.map((spellCasts) => {
        // Check if this is a Force of Nature spell
        const isForceOfNatureSpell =
          FORCE_OF_NATURE_IDS.includes(spellCasts.spell.id) ||
          spellCasts.spell.name.toLowerCase().includes('force of nature')

        if (!isForceOfNatureSpell) {
          return spellCasts // Return unmodified if not FoN
        }

        console.log('Found Force of Nature spell:', spellCasts.spell.name)

        // Calculate reduced cooldown
        const originalCooldown = spellCasts.spell.cooldown
        const reducedCooldown = Math.max(0, originalCooldown - 10)
        console.log('Reducing cooldown from', originalCooldown, 'to', reducedCooldown)

        // Create a new spell with modified cooldown
        const modifiedSpell = {
          ...spellCasts.spell,
          cooldown: reducedCooldown,
        }

        // Modify the casts for this spell
        return {
          spell: modifiedSpell,
          casts: spellCasts.casts.map((cast) => {
            console.log('Reducing cooldown for cast:', cast.id)

            // Calculate new end time (maintain proportional relationship with spell_cooldown_s)
            const currentDuration = cast.end_s - cast.start_s
            const reductionRatio = reducedCooldown / originalCooldown
            const newDuration = Math.max(0.1, currentDuration * reductionRatio)
            const newEnd = cast.start_s + newDuration

            console.log('Original duration:', currentDuration, 'seconds')
            console.log('New duration:', newDuration, 'seconds')
            console.log('New end time:', newEnd, 'seconds')

            // Return modified cast
            return {
              ...cast,
              end_s: newEnd,
              spell_cooldown_s: reducedCooldown,
            }
          }),
        }
      })
    },
  },
]

// Helper function to check if a spell is Force of Nature
export const isForceOfNature = (spellId: string | number): boolean => {
  return FORCE_OF_NATURE_IDS.includes(spellId)
}

// Helper function to apply multiple effects to spells
export const applyTimelineEffects = (
  currentSpells: SpellCasts[],
  activeEffects: string[],
  spells: SpellInfo[]
): SpellCasts[] => {
  // Deep clone to avoid reference issues
  let updatedSpells = JSON.parse(JSON.stringify(currentSpells))

  // Apply each active effect in sequence
  activeEffects.forEach((activeEffectId) => {
    const effect = timelineEffects.find((e) => e.id === activeEffectId)
    if (effect) {
      console.log(`Applying effect: ${effect.name}`)
      const resultSpells = effect.applyEffect(updatedSpells, spells)

      // Safety check to make sure we got a valid array back
      if (Array.isArray(resultSpells) && resultSpells.length > 0) {
        updatedSpells = resultSpells
      } else {
        console.error(`Effect ${effect.name} returned invalid result:`, resultSpells)
      }
    }
  })

  return updatedSpells
}
