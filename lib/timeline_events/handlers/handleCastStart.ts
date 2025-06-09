import {
  EventType,
  Talents,
  TimelineEvent,
  ICastStartHandler,
  NormalCast,
  RescheduledCast,
} from '@/types/index'

import { Cast } from '@/models/Cast'

export const handleCastStart: ICastStartHandler = (
  event,
  timelineState,
  rescheduledCasts,
  eventQueue,
  activeBindings,
  spellInfo,
  spellState
) => {
  const canCast = () => spellState.usedCharges < spellState.totalCharges

  /* Special case for Tree of Life */
  const reforestationCast = timelineState.isSpellCastPresent(392356)
  /* We can't cast ToL while refo is active */
  const isOverlapping =
    reforestationCast &&
    event.time > reforestationCast.effect_start_s &&
    event.time < reforestationCast.effect_start_s + reforestationCast.effect_duration
  if (canCast() && isOverlapping && event.spellId === 33891) {
    rescheduledCasts.push({
      castId: event.castId,
      newTime: reforestationCast.effect_start_s + reforestationCast.effect_duration + 0.1,
    })

    // We can't press Incarn while reforestation is active, so we need to reschedule the cast
    const rescheduledStartEvent: TimelineEvent<EventType.CastStart> = {
      type: EventType.CastStart,
      time: reforestationCast.effect_start_s + reforestationCast.effect_duration + 0.1,
      spellId: event.spellId,
      castId: event.castId,
    }

    const castReturn: RescheduledCast = {
      rescheduledStartEvent: rescheduledStartEvent,
      events: () => [rescheduledStartEvent],
    }
    return castReturn
  } else if (canCast()) {
    /* Normal Cast */

    /* Reforestation */
    if (event.spellId === 392356) {
      const treeOfLifeId = 33891
      // if the casts has a cast with id treeOfLifeId, then we need to add 15 seconds to the cooldown
      const treeOfLifeCast = timelineState.isSpellCastPresent(treeOfLifeId)
      const potentEnchantments = activeBindings.includes(Talents.PotentEnchantments)

      const potentEnchantmentsDuration = potentEnchantments ? 3 : 0
      if (
        treeOfLifeCast &&
        event.time <
          treeOfLifeCast.effect_duration +
            treeOfLifeCast.effect_start_s +
            potentEnchantmentsDuration
      ) {
        treeOfLifeCast.effect_duration += spellInfo.effect_duration + potentEnchantmentsDuration
        treeOfLifeCast._ef_end_s += spellInfo.effect_duration + potentEnchantmentsDuration
        eventQueue.modifyFirstEarliestOfType(
          treeOfLifeCast,
          EventType.EffectEnd,
          spellInfo.effect_duration + potentEnchantmentsDuration,
          event.time
        )
      }
    }

    const latestChargeTime = eventQueue.findLatestCharge(event.spellId, event.time)
    const cooldown_delay = Math.max(0, latestChargeTime - event.time)

    const cast = new Cast({
      id: event.castId,
      spell: spellInfo,
      start_s: event.time,
      current_charge: spellState.usedCharges,
      cooldown_delay_s: cooldown_delay,
    })

    timelineState.activeCasts.set(cast.id, cast)
    spellState.currentCast = cast

    const eventsToAdd: TimelineEvent<EventType>[] = []

    const loseCharge: TimelineEvent<EventType.LoseCharge> = {
      type: EventType.LoseCharge,
      time: event.time,
      spellId: event.spellId,
      castId: event.castId,
    }
    eventsToAdd.push(loseCharge)

    const effectEndEvent: TimelineEvent<EventType.EffectEnd> = {
      type: EventType.EffectEnd,
      time: event.time + spellInfo.effect_duration,
      spellId: event.spellId,
      castId: event.castId,
    }
    eventsToAdd.push(effectEndEvent)

    if (spellInfo.channeled) {
      const channelStartEvent: TimelineEvent<EventType.ChannelStart> = {
        type: EventType.ChannelStart,
        time: event.time,
        spellId: event.spellId,
        castId: event.castId,
      }
      eventsToAdd.push(channelStartEvent)
    }

    console.log('timelineState.channeledSpell', timelineState.channeledSpell)
    console.log('spellInfo.can_interrupt', spellInfo)
    if (timelineState.channeledSpell && spellInfo.can_interrupt) {
      const channelInterruptedEvent: TimelineEvent<EventType.ChannelInterrupted> = {
        type: EventType.ChannelInterrupted,
        time: event.time,
        spellId: timelineState.channeledSpell.spellId,
        castId: event.castId,
      }
      eventsToAdd.push(channelInterruptedEvent)
    }
    const castReturn: NormalCast = {
      loseChargeEvent: loseCharge,
      effectEndEvent: effectEndEvent,
      events: () => eventsToAdd,
    }

    return castReturn
  } else {
    // if we don't have enough charges we need to find the first instant
    // where we have one charge available

    // Find the earliest time when a charge will be available
    const nextChargeTime = eventQueue.findEarliestCharge(event.spellId, event.time)

    // Track this cast as needing to be rescheduled in the inputActions
    rescheduledCasts.push({
      castId: event.castId,
      newTime: nextChargeTime,
    })

    const rescheduledStartEvent: TimelineEvent<EventType.CastStart> = {
      type: EventType.CastStart,
      time: nextChargeTime,
      spellId: event.spellId,
      castId: event.castId,
    }
    const castReturn: RescheduledCast = {
      rescheduledStartEvent: rescheduledStartEvent,
      events: () => [rescheduledStartEvent],
    }

    // Create a new cast event at the time when a charge will be available
    return castReturn
  }
}
