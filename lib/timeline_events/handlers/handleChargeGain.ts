import { TimelineEvent, EventType, IChargeGainHandler } from '@/types/index'

export const handleChargeGain: IChargeGainHandler = (
  event,
  spellState,
  spellInfo,
  timelineState
) => {
  const cooldownEndEvent: TimelineEvent<EventType.CooldownEnd> = {
    type: EventType.CooldownEnd,
    time: event.time,
    spellId: event.spellId,
    castId: event.castId,
  }
  const usedCharges = spellState.restoreCharge(event.time)

  if (usedCharges > 0) {
    const cdToStart = spellState.delayedCastIds.shift()
    const cast = timelineState.activeCasts.get(cdToStart!)
    if (cast) {
      cast.cooldown_delay_s = event.time - cast.start_s
      cast._cd_start_s = event.time
      timelineState.activeCasts.set(cast.id, cast)
    }
    const chargeGainEvent: TimelineEvent<EventType.GainCharge> = {
      type: EventType.GainCharge,
      time: event.time + spellInfo.cooldown,
      spellId: event.spellId,
      castId: cdToStart!,
    }
    return {
      events: () => [chargeGainEvent, cooldownEndEvent],
      cooldownEndEvent,
      chargeGainEvent,
    }
  }

  return {
    events: () => [cooldownEndEvent],
    cooldownEndEvent,
  }
}
