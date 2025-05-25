import { TimelineEvent, EventType, TimelineState, EventQueue } from '.'
import { IDreamstateHandler, DreamstateReturn } from './types'

export const handleDreamstate: IDreamstateHandler = (
  event: TimelineEvent<EventType.DreamstateCdr>,
  timelineState: TimelineState,
  eventQueue: EventQueue
) => {
  console.log('[Event] [Dreamstate]: Dreamstate CDR event at: ', event.time)
  console.log('[Event] [Dreamstate]: Channeled spell: ', timelineState.channeledSpell)
  if (timelineState.channeledSpell?.name !== 'Tranquillity') {
    return {
      events: () => [],
      dreamstateEvent: event,
    }
  }
  console.log('[Event] [Dreamstate]: Dreamstate CDR event at: ', event.time)
  const currentCasts = timelineState.activeCasts.values()
  const consideredSpells = new Set<number>()
  consideredSpells.add(740)
  for (const cast of currentCasts) {
    if (cast.spell.spellId === 740) continue
    if (consideredSpells.has(cast.spell.spellId)) {
      continue
    }
    consideredSpells.add(cast.spell.spellId)
    eventQueue.modifyFirstEarliestOfType(cast, EventType.GainCharge, -4, event.time)
    console.log('[Event] [Dreamstate]: Modified cast: ', cast.id)
    //eventQueue.modifyFirstEarliestOfType(cast, EventType.CooldownEnd, -4, event.time)
  }
  const dreamstateEvent: TimelineEvent<EventType.DreamstateCdr> = {
    type: EventType.DreamstateCdr,
    time: event.time + 1.249,
    spellId: event.spellId,
    castId: event.castId,
  }
  return {
    events: () => [dreamstateEvent],
    dreamstateEvent,
  }
}
