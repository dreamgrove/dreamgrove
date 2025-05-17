import { SpellInfo, TimelineEffect, SpellTimeline } from '../../lib/types/cd_planner'
import { Patch, applyPatches, logPatchInfo } from './PatchSystem'

// Force of Nature IDs - for use in effects
const FORCE_OF_NATURE_IDS = [205636, 'force_of_nature']

// Export the collection of timeline effects
export const timelineEffects: TimelineEffect[] = [
  {
    id: 'early_spring',
    name: 'Early Spring',
    description: 'Reduces cooldown of Force of Nature by 15s',
    generatePatch: (currentSpells: SpellTimeline[]): Patch | null => {
      // Don't generate patch if no spells
      if (currentSpells.length === 0) return null

      // Create a patch for Force of Test effect
      const patch: Patch = {
        effectId: 'early_spring',
        spellPatches: [],
        castPatches: [],
      }

      // Find Force of Nature spells
      currentSpells.forEach((spellCasts) => {
        const isForceOfNatureSpell =
          FORCE_OF_NATURE_IDS.includes(spellCasts.spell.id) ||
          spellCasts.spell.name.toLowerCase().includes('force of nature')

        if (isForceOfNatureSpell) {
          // Add spell patch to reduce duration/cooldown
          patch.spellPatches.push({
            spellId: Number(spellCasts.spell.spellId),
            effect: {
              direction: 'end',
              value: -15, // Reduce cooldown by 15 seconds
            },
          })
        }
      })

      return patch.spellPatches.length > 0 ? patch : null
    },
  },
  {
    id: 'control_of_dream',
    name: 'Control of the Dream',
    description: 'Reduces cooldown of Celestial Alignment/Incarnation by 15s',
    generatePatch: (currentSpells: SpellTimeline[]): Patch | null => {
      // Don't generate patch if no spells
      if (currentSpells.length === 0) return null

      // Create a patch for the Control of the Dream effect
      const patch: Patch = {
        effectId: 'control_of_dream',
        spellPatches: [],
        castPatches: [],
      }

      // Find Celestial Alignment or Incarnation spells
      const caCasts = currentSpells.filter((spellCasts) => {
        const spellName = spellCasts.spell.name.toLowerCase()
        return spellName.includes('celestial alignment') || spellName.includes('incarnation')
      })

      const fonCasts = currentSpells.filter((spellCasts) => {
        const spellName = spellCasts.spell.name.toLowerCase()
        return spellName.includes('force of nature')
      })

      fonCasts.forEach((spellCasts) => {
        // Sort casts by start time to ensure correct ordering
        const sortedCasts = [...spellCasts.casts].sort((a, b) => a.start_s - b.start_s)

        // Apply reductions and track the actual adjusted end times
        const adjustedEndTimes = new Map<string, number>()

        // Apply 15s reduction to the first cast if it exists
        if (sortedCasts.length > 0) {
          const firstCast = sortedCasts[0]
          const firstCastReduction = 15

          patch.castPatches.push({
            castId: firstCast.id,
            effect: {
              direction: 'end',
              value: -firstCastReduction, // Apply 15s reduction to first cast
            },
          })

          // Store the adjusted end time for the first cast
          adjustedEndTimes.set(firstCast.id, firstCast.end_s - firstCastReduction)
        }

        // Process all casts except the first one
        for (let i = 1; i < sortedCasts.length; i++) {
          const thisCast = sortedCasts[i]
          const previousCast = sortedCasts[i - 1]

          // Use the adjusted end time for the previous cast if available
          const previousEndTime = adjustedEndTimes.get(previousCast.id) ?? previousCast.end_s

          // Calculate reduction value - the minimum of 15s or the time between this cast's start and previous cast's adjusted end
          const reductionValue = Math.min(15, thisCast.start_s - previousEndTime)

          // Only create a patch if there's a meaningful reduction
          if (reductionValue > 0) {
            patch.castPatches.push({
              castId: thisCast.id,
              effect: {
                direction: 'end',
                value: -reductionValue, // Negative value to reduce cooldown
              },
            })

            // Store the adjusted end time for this cast
            adjustedEndTimes.set(thisCast.id, thisCast.end_s - reductionValue)
          } else {
            // Even if no reduction is applied, store the original end time
            adjustedEndTimes.set(thisCast.id, thisCast.end_s)
          }
        }
      })
      // For each target spell, create cast-specific patches
      caCasts.forEach((spellCasts) => {
        // Sort casts by start time to ensure correct ordering
        const sortedCasts = [...spellCasts.casts].sort((a, b) => a.start_s - b.start_s)

        // Apply reductions and track the actual adjusted end times
        const adjustedEndTimes = new Map<string, number>()

        // Apply 15s reduction to the first cast if it exists
        if (sortedCasts.length > 0) {
          const firstCast = sortedCasts[0]
          const firstCastReduction = 15

          patch.castPatches.push({
            castId: firstCast.id,
            effect: {
              direction: 'end',
              value: -firstCastReduction, // Apply 15s reduction to first cast
            },
          })

          // Store the adjusted end time for the first cast
          adjustedEndTimes.set(firstCast.id, firstCast.end_s - firstCastReduction)
        }

        // Process all casts except the first one
        for (let i = 1; i < sortedCasts.length; i++) {
          const thisCast = sortedCasts[i]
          const previousCast = sortedCasts[i - 1]

          // Use the adjusted end time for the previous cast if available
          const previousEndTime = adjustedEndTimes.get(previousCast.id) ?? previousCast.end_s

          // Calculate reduction value - the minimum of 15s or the time between this cast's start and previous cast's adjusted end
          const reductionValue = Math.min(15, thisCast.start_s - previousEndTime)

          // Only create a patch if there's a meaningful reduction
          if (reductionValue > 0) {
            patch.castPatches.push({
              castId: thisCast.id,
              effect: {
                direction: 'end',
                value: -reductionValue, // Negative value to reduce cooldown
              },
            })

            // Store the adjusted end time for this cast
            adjustedEndTimes.set(thisCast.id, thisCast.end_s - reductionValue)
          } else {
            // Even if no reduction is applied, store the original end time
            adjustedEndTimes.set(thisCast.id, thisCast.end_s)
          }
        }
      })

      return patch.castPatches.length > 0 ? patch : null
    },
  },
  {
    id: 'dreamstate',
    name: 'Dreamstate',
    description: 'After Tranquility channel, reduces all current spell cooldowns by 20s',

    generatePatch: (currentSpells: SpellTimeline[]): Patch | null => {
      if (currentSpells.length === 0) return null

      const patch: Patch = {
        effectId: 'dreamstate',
        spellPatches: [],
        castPatches: [],
      }

      const tranqSpell = currentSpells.find((spellCasts) =>
        spellCasts.spell.name.toLowerCase().includes('tranquility')
      )
      if (!tranqSpell) return null

      const tranquilityCasts = currentSpells
        .filter((spellCasts) => spellCasts.spell.name.toLowerCase().includes('tranquility'))
        .flatMap((spellCasts) => spellCasts.casts)
        .sort((a, b) => a.end_s - b.end_s)

      if (tranquilityCasts.length === 0) return null

      tranquilityCasts.forEach((tranqCast) => {
        const channelDuration = tranqSpell.spell.channel_duration
        const tranqStartTime = tranqCast.start_s
        const tranqEndTime = tranqStartTime + channelDuration

        // Find if any cast starts during the Tranquility channel (interrupts it)
        let interruptedAt: number | null = null
        currentSpells.forEach((spellCasts) => {
          if (spellCasts.spell.name.toLowerCase().includes('tranquility')) return
          spellCasts.casts.forEach((cast) => {
            if (cast.start_s > tranqStartTime && cast.start_s < tranqStartTime + channelDuration) {
              if (interruptedAt === null || cast.start_s < interruptedAt) {
                interruptedAt = cast.start_s
              }
            }
          })
        })

        // Calculate reduction
        let reduction = 20
        if (interruptedAt !== null) {
          // Channel was interrupted
          const channeledSeconds = Math.floor(interruptedAt - tranqStartTime)
          if (channeledSeconds > 0) {
            reduction = Math.floor((channeledSeconds / channelDuration) * 20)
          } else {
            reduction = 0
          }
        }

        // For each spell (excluding Tranquility), find the first cast on cooldown at tranqEndTime (or interruption)
        const effectiveEndTime = interruptedAt !== null ? interruptedAt : tranqEndTime
        currentSpells.forEach((spellCasts) => {
          if (
            spellCasts.spell.name.toLowerCase().includes('tranquility') ||
            spellCasts.spell.name.toLowerCase().includes('guardians') ||
            spellCasts.spell.name.toLowerCase().includes('reforestation')
          )
            return
          const firstOnCooldown = spellCasts.casts.find(
            (cast) => cast.start_s < effectiveEndTime && cast.end_s > effectiveEndTime
          )
          if (firstOnCooldown && reduction > 0) {
            patch.castPatches.push({
              castId: firstOnCooldown.id,
              effect: {
                direction: 'end',
                value: -reduction, // Apply calculated reduction
              },
            })
          }
        })
      })

      return patch.castPatches.length > 0 ? patch : null
    },
  },
  {
    id: 'cenarius_guidance',
    name: "Cenarius' Guidance",
    description:
      'The cooldown of Incarnation: Tree of Life is reduced by 5.0 sec when Grove Guardians fade.',

    generatePatch: (currentSpells: SpellTimeline[]): Patch | null => {
      if (currentSpells.length === 0) return null

      const patch: Patch = {
        effectId: 'cenarius_guidance',
        spellPatches: [],
        castPatches: [],
      }

      // Find Incarnation and Reforestation spells
      const incarnationSpells = currentSpells.filter((spellCasts) =>
        spellCasts.spell.name.toLowerCase().includes('incarnation')
      )
      const reforestationSpells = currentSpells.filter((spellCasts) =>
        spellCasts.spell.name.toLowerCase().includes('reforestation')
      )

      // Collect all effect intervals (start, end) for both spells
      const effectIntervals: { start: number; end: number }[] = []
      for (const spellCasts of [...incarnationSpells, ...reforestationSpells]) {
        for (const cast of spellCasts.casts) {
          const start = cast.start_s
          const end = cast.start_s + (spellCasts.spell.effect_duration || 0)
          if (end > start) {
            effectIntervals.push({ start, end })
          }
        }
      }
      if (effectIntervals.length === 0) return null

      // Merge overlapping intervals to get total unique active time
      effectIntervals.sort((a, b) => a.start - b.start)
      const merged: { start: number; end: number }[] = []
      for (const interval of effectIntervals) {
        if (!merged.length || merged[merged.length - 1].end < interval.start) {
          merged.push({ ...interval })
        } else {
          merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, interval.end)
        }
      }

      // Find all Incarnation casts, sorted by start time
      const allIncarnationCasts = incarnationSpells
        .flatMap((spellCasts) => spellCasts.casts.map((cast) => ({ cast, spellCasts })))
        .sort((a, b) => a.cast.start_s - b.cast.start_s)
      if (allIncarnationCasts.length === 0) return null

      // Track patched end_s for each Incarnation cast as reductions are applied
      const patchedEndTimes = new Map<string, number>()
      for (const { cast } of allIncarnationCasts) {
        patchedEndTimes.set(cast.id, cast.end_s)
      }

      // For each merged interval, process every full 10s segment
      for (const interval of merged) {
        let segmentStart = interval.start
        while (segmentStart + 10 <= interval.end) {
          const segmentEnd = segmentStart + 10
          const checkTime = segmentEnd + 15 // 15s after the end of the 10s segment

          // Find the Incarnation cast that is on cooldown at checkTime using patched end_s
          // (i.e., cast.start_s < checkTime < patched end_s)
          const targetIncarnation = allIncarnationCasts.find(({ cast }) => {
            const patchedEnd = patchedEndTimes.get(cast.id) ?? cast.end_s
            return cast.start_s < checkTime && patchedEnd > checkTime
          })

          if (targetIncarnation) {
            // Apply the reduction
            patch.castPatches.push({
              castId: targetIncarnation.cast.id,
              effect: {
                direction: 'end',
                value: -5, // Reduce cooldown by 5s
              },
            })
            // Update the patched end time for this cast
            const prevPatched =
              patchedEndTimes.get(targetIncarnation.cast.id) ?? targetIncarnation.cast.end_s
            patchedEndTimes.set(targetIncarnation.cast.id, prevPatched - 5)
          }

          segmentStart = segmentEnd // Move to the next 10s segment
        }
      }

      return patch.castPatches.length > 0 ? patch : null
    },
  },
]

// Helper function to check if a spell is Force of Nature
export const isForceOfNature = (spellId: string | number): boolean => {
  return FORCE_OF_NATURE_IDS.includes(spellId)
}

// Generate patches from active effects
export const generatePatches = (
  activeEffects: string[],
  currentSpells: SpellTimeline[]
): Patch[] => {
  const patches: Patch[] = []
  // Keep track of the intermediate state after each patch
  let modifiedSpells = JSON.parse(JSON.stringify(currentSpells))

  // Process each active effect in sequence
  for (const effectId of activeEffects) {
    const effect = timelineEffects.find((e) => e.id === effectId)
    if (effect && effect.generatePatch) {
      // Pass the currently modified spells to the effect
      const patch = effect.generatePatch(modifiedSpells)
      if (patch) {
        patches.push(patch)
        // Apply this patch to update the state for the next effect
        modifiedSpells = applyPatches(modifiedSpells, [patch])
      }
    }
  }

  // Log patch information for debugging
  if (patches.length > 0) {
    //logPatchInfo(patches)
  }

  return patches
}

// Helper function to apply multiple effects to spells
export const applyTimelineEffects = (
  currentSpells: SpellTimeline[],
  activeEffects: string[]
): SpellTimeline[] => {
  // Generate patches from active effects
  const patches = generatePatches(activeEffects, currentSpells)
  // let currentState = currentSpells
  // for effect in activeEffects:
  //   currentState = effect(currentState)
  // return currentState

  // This ensures a consistent non-destructive approach
  return applyPatches(currentSpells, patches)
}
