import { EventType, isValid, SpellInfo, SpellState, TimelineState, TimelineEvent } from '.'
import { ChannelStartReturn, IChannelStartHandler } from './types'

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
