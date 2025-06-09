import { Talents, IControlOfTheDreamHandler } from '@/types/index'

export const handleControlOfTheDream: IControlOfTheDreamHandler = (
  event,
  timelineState,
  spellState
) => {
  if (spellState.usedCharges === 0) {
    const cotdEffects = timelineState.activeEffects.get(Talents.ControlOfTheDream)
    if (cotdEffects) {
      cotdEffects.set(event.spellId, event.time)
      timelineState.activeEffects.get(Talents.ControlOfTheDream)?.set(event.spellId, event.time)
    }
  }
}
