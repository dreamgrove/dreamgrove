import { TimelineState, TimelineEvent, EventType } from '.'
import { IEffectEndHandler } from './types'

export const handleEffectEnd: IEffectEndHandler = (
  event: TimelineEvent<EventType.EffectEnd>,
  timelineState: TimelineState
) => {
  if (timelineState.activeCasts.has(event.castId)) {
    const cast = timelineState.activeCasts.get(event.castId)
    if (cast) {
      cast.effect_duration = event.time - cast.start_s
      cast._ef_end_s = event.time
    }
  }
}
