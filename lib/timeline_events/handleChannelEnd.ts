import { IChannelEndHandler } from './types'

export const handleChannelEnd: IChannelEndHandler = (
  event,
  timelineState,
  spellInfo,
  spellState
) => {
  if (timelineState.channeledSpell?.spellId !== spellInfo.spellId) {
    return
  }
  const cast = timelineState.activeCasts.get(event.castId)
  if (cast) {
    cast.channel_duration = event.time - cast.start_s
    timelineState.activeCasts.set(cast.id, cast)
  }
  spellState.isChanneling = false
  timelineState.channeledSpell = null
}
