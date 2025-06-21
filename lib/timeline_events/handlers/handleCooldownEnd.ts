import { ICooldownEndHandler } from '@/types/index'

export const handleCooldownEnd: ICooldownEndHandler = (
  event,
  timelineState,
  processedState,
  spellInfo,
  spellState
) => {
  if (timelineState.activeCasts.has(event.castId)) {
    if (event.time > processedState.timeline_length_s) {
      processedState.timeline_length_s = event.time
    }
    const cast = timelineState.activeCasts.get(event.castId)
    if (cast) {
      //cast.cooldown_duration = event.time - cast.start_s - cast.cooldown_delay_s
      cast._cd_end_s = event.time
      cast.cooldown_duration = event.time - cast.start_s

      let spellToRender = processedState.spells.find((s) => s.spell.spellId === event.spellId)
      if (!spellToRender) {
        spellToRender = { spell: spellInfo, casts: [], chargesUsed: 0 }
        processedState.spells.push(spellToRender)
      }

      // Add the cast to the spell
      spellToRender.casts.push(cast)
      spellState.previousCast = spellState.currentCast
      spellState.currentCast = null
      timelineState.activeCasts.delete(event.castId)
    }
  } else {
    console.log('no cast found for cooldown end. probably we already ended', event.castId)
  }
}
