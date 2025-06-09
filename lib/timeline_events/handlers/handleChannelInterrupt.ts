import { IChannelInterruptHandler } from '@/types/index'

export const handleChannelInterrupt: IChannelInterruptHandler = (
  event,
  timelineState,
  spellInfo,
  spellState
) => {
  if (timelineState.channeledSpell?.spellId !== spellInfo.spellId) {
    return
  }
  const interruptingCastId = event.castId
  const interruptingCast = timelineState.activeCasts.get(interruptingCastId.toString())

  const interruptedCast = spellState.currentCast

  if (interruptedCast && interruptingCast) {
    interruptedCast.interrupt(interruptingCast)
  } else {
    console.error('Interrupted cast not found')
  }
  spellState.isChanneling = false
  timelineState.channeledSpell = null
}
