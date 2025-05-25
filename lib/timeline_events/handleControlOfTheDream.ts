import { Talents, TimelineState, SpellState } from '.'
import { IControlOfTheDreamHandler } from './types'

export const handleControlOfTheDream: IControlOfTheDreamHandler = (
  event,
  timelineState,
  spellState
) => {
  if (spellState.usedCharges === 0) {
    console.log('COTD event: ', event)
    const cotdEffects = timelineState.activeEffects.get(Talents.ControlOfTheDream)
    console.log('COTD effects: ', cotdEffects)
    if (cotdEffects) {
      cotdEffects.set(event.spellId, event.time)
      timelineState.activeEffects.get(Talents.ControlOfTheDream)?.set(event.spellId, event.time)
    }
  }
}
