import { TimelineEvent, EventType, Talents } from '.'
import { IChargeLoseHandler } from './types'

// Method 1: Type the function directly
export const handleChargeLose: IChargeLoseHandler = (
  event,
  spellInfo,
  spellState,
  timelineState
) => {
  const cotdEffects = timelineState.activeEffects.get(Talents.ControlOfTheDream)
  let cotdReduction = 0
  if (cotdEffects) {
    cotdReduction = cotdEffects.get(event.spellId) || event.time
    cotdReduction = Math.abs(cotdReduction - event.time)
    cotdReduction = Math.min(15, cotdReduction)
    cotdEffects.delete(event.spellId)
  }
  const usedCharges = spellState.useCharge(event.time)
  const gainChargeEvent: TimelineEvent<EventType.GainCharge> = {
    type: EventType.GainCharge,
    time: event.time + spellInfo.cooldown - cotdReduction,
    spellId: event.spellId,
    castId: event.castId,
  }

  if (usedCharges > 1) {
    spellState.delayedCastIds.push(event.castId)
    return {
      events: () => [],
      gainChargeEvent: null,
    }
  }
  return {
    events: () => [gainChargeEvent],
    gainChargeEvent,
  }
}
