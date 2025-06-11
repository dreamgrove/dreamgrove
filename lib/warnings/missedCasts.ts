import { SpellToRender, Warning } from '@/types/index'
/**
 * Analyzes a timeline and identifies spells that have gaps between casts
 * where the sum of gaps exceeds the spell's cooldown (indicating missed cast opportunities).
 *
 * @param timeline An array of SpellToRender objects containing spell information and casts
 * @param total_timeline_length_s The total length of the timeline in seconds
 * @returns Array of warning objects with spell names and warning messages
 */
export function findMissedCastOpportunities(
  timeline: SpellToRender[],
  total_timeline_length_s: number
): Warning[] {
  const missedCastWarnings: Warning[] = []

  // Process each spell in the timeline
  timeline.forEach((spellTimeline) => {
    const { spell, casts } = spellTimeline

    if (casts.length === 0) return

    if (casts.length === 1) {
      // For spells with only one cast, check if there was time for a second cast
      const castEndTime = casts[0].start_s + casts[0].spell.effect_duration
      const remainingTime = total_timeline_length_s - castEndTime

      // If enough time for at least one more cast
      if (remainingTime > spell.cooldown) {
        const potentialExtraCasts = Math.floor(remainingTime / spell.cooldown)
        missedCastWarnings.push({
          spellName: spell.name,
          warning: `Could have been cast ${potentialExtraCasts} more time${potentialExtraCasts > 1 ? 's' : ''} during the fight.`,
        })
      }
      return
    }

    // Sort casts by start time
    const sortedCasts = [...casts].sort((a, b) => a.start_s - b.start_s)

    let totalGapTime = 0

    // Calculate gaps between consecutive casts
    for (let i = 1; i < sortedCasts.length; i++) {
      const previousCastEnd = sortedCasts[i - 1].start_s + sortedCasts[i - 1].spell.effect_duration
      const currentCastStart = sortedCasts[i].start_s

      // Calculate the gap between casts
      const gap = Math.max(0, currentCastStart - previousCastEnd)
      totalGapTime += gap
    }

    // Also check for time after the last cast
    const lastCastEnd =
      sortedCasts[sortedCasts.length - 1].start_s +
      sortedCasts[sortedCasts.length - 1].spell.effect_duration
    const timeAfterLastCast = total_timeline_length_s - lastCastEnd
    if (timeAfterLastCast > spell.cooldown) {
      totalGapTime += timeAfterLastCast
    }

    // If the total gap time exceeds the spell's cooldown, add it to the result
    if (totalGapTime > spell.cooldown) {
      const potentialExtraCasts = Math.floor(totalGapTime / spell.cooldown)
      missedCastWarnings.push({
        spellName: spell.name,
        warning: `Could have been cast ${potentialExtraCasts} more time${potentialExtraCasts > 1 ? 's' : ''} during the fight.`,
      })
    }
  })

  return missedCastWarnings
}
