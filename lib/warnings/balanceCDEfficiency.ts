import { SpellToRender } from 'lib/types/cd_planner'
import type { Warning } from './registerWarnings'
import { Cast } from 'lib/types/cd_planner'

// Spell IDs for Balance Druid cooldowns
const CONVOKE_THE_SPIRITS_ID = 391528
const CELESTIAL_ALIGNMENT_ID = 194223
const FORCE_OF_NATURE_ID = 205636

/**
 * Checks if Balance Druid cooldowns are being used efficiently together
 * - Convoke the Spirits should be cast during Celestial Alignment window (15s before)
 * - Force of Nature should be cast before Convoke the Spirits (10s before)
 *
 * @param timeline An array of SpellToRender objects containing spell information and casts
 * @param total_timeline_length_s The total length of the timeline in seconds
 * @returns Array of warning objects with spell names and warning messages
 */
export function findBalanceCDEfficiency(
  timeline: SpellToRender[],
  total_timeline_length_s: number
): Warning[] {
  const balanceCDEfficiencyWarnings: Warning[] = []

  // Find the spell timelines for each cooldown
  const convokeTimeline = timeline.find((s) => s.spell.spellId === CONVOKE_THE_SPIRITS_ID)
  const celestialAlignmentTimeline = timeline.find(
    (s) => s.spell.spellId === CELESTIAL_ALIGNMENT_ID
  )
  const forceOfNatureTimeline = timeline.find((s) => s.spell.spellId === FORCE_OF_NATURE_ID)

  // If Convoke isn't used, no need to check for synergies
  if (!convokeTimeline || convokeTimeline.casts.length === 0) {
    return balanceCDEfficiencyWarnings
  }

  // For each cast of Convoke, check if it's paired with Celestial Alignment and Force of Nature
  convokeTimeline.casts.forEach((convokeCast) => {
    const convokeTime = convokeCast.start_s

    // Check for Celestial Alignment cast within 15s before Convoke
    let hasCelestialAlignment = false
    let caCast: Cast | undefined = undefined
    if (celestialAlignmentTimeline) {
      caCast = celestialAlignmentTimeline.casts.find((cast) => {
        const caTime = cast.start_s
        // Check if Celestial Alignment was cast before Convoke and is still active (within 15s)
        return caTime <= convokeTime && convokeTime - caTime <= 15
      })
      hasCelestialAlignment = !!caCast
    }

    // Check for Force of Nature cast within 10s before Convoke
    let hasForceOfNature = false
    let fonCast: Cast | undefined = undefined
    if (forceOfNatureTimeline) {
      fonCast = forceOfNatureTimeline.casts.find((cast) => {
        const fonTime = cast.start_s
        // Check if Force of Nature was cast before Convoke (within 10s)
        return fonTime <= convokeTime && convokeTime - fonTime <= 10
      })
      hasForceOfNature = !!fonCast
    }

    // Generate appropriate warnings
    if (!hasCelestialAlignment && !hasForceOfNature) {
      balanceCDEfficiencyWarnings.push({
        spellName: 'Convoke the Spirits',
        warning:
          "You're not using your cooldowns efficiently. CA, FoN and Convoke should be used together to maximize damage.",
      })
    } else if (!hasCelestialAlignment) {
      balanceCDEfficiencyWarnings.push({
        spellName: 'Convoke the Spirits',
        warning:
          'There is a cast not buffed by Celestial Alignment. For optimal DPS, use Celestial Alignment before Convoke.',
      })
    } else if (!hasForceOfNature) {
      balanceCDEfficiencyWarnings.push({
        spellName: 'Convoke the Spirits',
        warning:
          'There is a cast not buffed by Force of Nature. For optimal DPS, use Force of Nature  before Convoke.',
      })
    } else if (caCast && fonCast && caCast.start_s < fonCast.start_s) {
      // Both CA and Force of Nature are present, check if CA was cast before Force of Nature
      balanceCDEfficiencyWarnings.push({
        spellName: 'Celestial Alignment',
        warning:
          'Incorrect order of casts. For optimal DPS, cast Force of Nature first, followed by Celestial Alignment, then Convoke the Spirits.',
      })
    }
  })

  return balanceCDEfficiencyWarnings
}
