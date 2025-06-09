import { EventType, TimelineEvent, ICenariusGuidanceHandler } from '@/types/index'

export const handleCenariusGuidance: ICenariusGuidanceHandler = (
  event,
  timelineState,
  eventQueue
) => {
  if (timelineState.activeCasts.has(event.castId)) {
    const cast = timelineState.activeCasts.get(event.castId)
    if (cast) {
      eventQueue.modifyFirstEarliestOfType(cast, EventType.GainCharge, -5, event.time)
      if (cast.start_s + cast.effect_duration < event.time) return []
    }

    const treantEvent: TimelineEvent<EventType.CenariusGuidance> = {
      type: EventType.CenariusGuidance,
      time: event.time + 10,
      spellId: 102693,
      castId: event.castId,
    }
    return [treantEvent]
  }
  return []
}
