import { TimelineEvent, EventType, TimelineState, EventQueue, Talents } from '.'
import { IDreamstateHandler, DreamstateReturn } from './types'

export const handleDreamstate: IDreamstateHandler = (
  event: TimelineEvent<EventType.DreamstateCdr>,
  timelineState: TimelineState,
  eventQueue: EventQueue
) => {
  timelineState.activeEffects.set(Talents.Dreamstate, new Map([[event.spellId, event.time]]))
  if (timelineState.channeledSpell?.name !== 'Tranquillity') {
    if (timelineState.activeEffects.has(Talents.Dreamstate)) {
      timelineState.activeEffects.delete(Talents.Dreamstate)
      reduceCastCooldowns(timelineState, eventQueue, event, 0)
    }
    return {
      events: () => [],
      dreamstateEvent: event,
    }
  }
  reduceCastCooldowns(timelineState, eventQueue, event, -4)
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
const reduceCastCooldowns = (
  timelineState: TimelineState,
  eventQueue: EventQueue,
  event: TimelineEvent<EventType.DreamstateCdr>,
  time: number
) => {
  const currentCasts = timelineState.activeCasts.values()
  const consideredSpells = new Set<number>()
  consideredSpells.add(740)
  for (const cast of currentCasts) {
    if (cast.spell.spellId === 740) continue
    if (consideredSpells.has(cast.spell.spellId)) {
      continue
    }
    consideredSpells.add(cast.spell.spellId)
    eventQueue.modifyFirstEarliestOfType(cast, EventType.GainCharge, time, event.time)
    console.log('[Event] [Dreamstate]: Modified cast: ', cast.id)
    //eventQueue.modifyFirstEarliestOfType(cast, EventType.CooldownEnd, -4, event.time)
  }
}
