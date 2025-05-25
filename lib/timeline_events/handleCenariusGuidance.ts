import { EventType } from '.'
import { ICenariusGuidanceHandler } from './types'

export const handleCenariusGuidance: ICenariusGuidanceHandler = (
  event,
  timelineState,
  eventQueue
) => {
  if (timelineState.activeCasts.has(event.castId)) {
    const cast = timelineState.activeCasts.get(event.castId)
    if (cast) {
      eventQueue.modifyFirstEarliestOfType(cast, EventType.CooldownEnd, -5, event.time)
      eventQueue.modifyFirstEarliestOfType(cast, EventType.GainCharge, -5, event.time)
    }
  }
}
