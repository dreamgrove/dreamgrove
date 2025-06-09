import { TimelineState, TimelineEvent, EventType, IEffectEndHandler } from '@/types/index'

export const handleEffectEnd: IEffectEndHandler = (
  event: TimelineEvent<EventType.EffectEnd>,
  timelineState: TimelineState
) => {
  if (timelineState.activeCasts.has(event.castId)) {
    const cast = timelineState.activeCasts.get(event.castId)
    if (cast && !cast.is_interruped) {
      cast.effect_duration = event.time - cast.start_s
      cast._ef_end_s = event.time
    }
  }
}
