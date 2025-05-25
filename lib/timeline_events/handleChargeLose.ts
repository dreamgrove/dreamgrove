import { TimelineEvent, EventType } from '.'
import { IChargeLoseHandler } from './types'

// Method 1: Type the function directly
export const handleChargeLose: IChargeLoseHandler = (event, spellInfo, spellState) => {
  const usedCharges = spellState.useCharge(event.time)
  const gainChargeEvent: TimelineEvent<EventType.GainCharge> = {
    type: EventType.GainCharge,
    time: event.time + spellInfo.cooldown,
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
