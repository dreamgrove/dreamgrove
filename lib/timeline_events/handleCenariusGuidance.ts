import { EventType, TimelineEvent } from '.'
import { ICenariusGuidanceHandler } from './types'

export const handleCenariusGuidance: ICenariusGuidanceHandler = (
  event,
  timelineState,
  eventQueue
) => {
  console.log('Cenarius Guidance event: ', event)
  if (timelineState.activeCasts.has(event.castId)) {
    const cast = timelineState.activeCasts.get(event.castId)
    if (cast) {
      eventQueue.modifyFirstEarliestOfType(cast, EventType.GainCharge, -5, event.time)
      console.log('Cenarius Guidance cast._ef_end_s', cast._ef_end_s)
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
