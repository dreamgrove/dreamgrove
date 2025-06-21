import { EventType, TimelineEvent, IChannelStartHandler } from '@/types/index'

export const handleChannelStart: IChannelStartHandler = (
  event,
  timelineState,
  spellInfo,
  spellState
) => {
  spellState.isChanneling = true
  timelineState.channeledSpell = spellInfo
  const channelEndEvent: TimelineEvent<EventType.ChannelEnd> = {
    type: EventType.ChannelEnd,
    time: event.time + spellInfo.channel_duration,
    spellId: event.spellId,
    castId: event.castId,
  }
  return {
    events: () => [channelEndEvent],
    channelEndEvent: channelEndEvent,
  }
}
