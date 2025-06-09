import { EventQueue } from 'models/EventQueue'
import {
  PlayerAction,
  TimelineEvent,
  EventType,
  TimelineState,
  SpellInfo,
  GlobalAction,
  TimelineToRender,
  Talents,
  ChargeInterval,
} from '@/types/index'
import {
  handleCastStart,
  handleChannelStart,
  handleChargeLose,
  handleChannelEnd,
  handleEffectEnd,
  handleDreamstate,
  handleCenariusGuidance,
  handleControlOfTheDream,
  handleCooldownEnd,
  handleChannelInterrupt,
  handleChargeGain,
} from '@/lib/timeline_events/index'

export function generateBaseQueue(inputActions: PlayerAction[]): EventQueue {
  const eventQueue = new EventQueue()

  let lastTime = -Infinity

  inputActions
    .sort((a, b) => a.instant - b.instant)
    .forEach((action) => {
      let startTime = Math.round(action.instant * 10) / 10

      // Ensure at least 0.01 difference from last event
      if (startTime < lastTime + 0.01) {
        startTime = lastTime + 0.01
      }

      startTime = Math.round(startTime * 100) / 100
      lastTime = startTime

      eventQueue.push({
        type: EventType.CastStart,
        time: startTime,
        spellId: action.spell.spellId,
        castId: action.id,
      })
    })

  return eventQueue
}

function getMatchingActions<T extends EventType>(
  event: TimelineEvent<T>,
  keyToActions: Map<string, Set<GlobalAction>>
): Set<GlobalAction> {
  const matched = new Set<GlobalAction>()
  for (const action of keyToActions.get(event.spellId.toString()) ?? []) {
    matched.add(action)
  }
  return matched
}

export function processEventQueue(
  eventQueue: EventQueue,
  spells: SpellInfo[],
  keysToActions: Map<string, Set<GlobalAction>>,
  activeBindings: string[]
): {
  processedState: TimelineToRender
  processedEvents: TimelineEvent<EventType>[]
  rescheduledCasts: Array<{ castId: string; newTime: number }>
} {
  let timelineState = new TimelineState()
  const processedState: TimelineToRender = { spells: [], timeline_length_s: 0 }
  const processedEvents: TimelineEvent<EventType>[] = []
  const rescheduledCasts: Array<{ castId: string; newTime: number }> = []
  // Create a deep copy of the spells array to prevent state preservation between calls
  let currentSpells = JSON.parse(JSON.stringify(spells))

  /* Control of The Dream */
  if (activeBindings.includes(Talents.ControlOfTheDream)) {
    timelineState.initializeControlOfTheDream()
  }

  while (!eventQueue.isEmpty()) {
    const _el: TimelineEvent<EventType> | undefined = eventQueue.pop()

    if (_el === undefined) break

    let event: TimelineEvent<EventType> = _el

    processedEvents.push(event)

    const bucket = getMatchingActions(event, keysToActions)
    for (const action of bucket) {
      const { changedEvent, eventsToAdd, newState, newSpells } = action(
        event,
        eventQueue,
        timelineState,
        currentSpells
      )
      event = changedEvent
      timelineState = newState
      currentSpells = newSpells

      for (const e of eventsToAdd) {
        eventQueue.push(e)
      }
    }

    // avoids state preservation between calls
    const spellInfo = { ...currentSpells.find((s) => s.spellId === event.spellId) }

    if (!spellInfo) continue

    const spellState = timelineState.findOrCreateSpellState(event.spellId, spellInfo.charges || 1)

    event.time = Math.round(event.time * 100) / 100

    switch (event.type) {
      case EventType.CastStart:
        const castReturn = handleCastStart(
          event as TimelineEvent<EventType.CastStart>,
          timelineState,
          rescheduledCasts,
          eventQueue,
          activeBindings,
          spellInfo,
          spellState
        )
        for (const e of castReturn.events()) {
          eventQueue.push(e)
        }

        break

      case EventType.LoseCharge:
        if (!isValid(timelineState, event.castId)) break
        const chargeLoseReturn = handleChargeLose(
          event as TimelineEvent<EventType.LoseCharge>,
          spellInfo,
          spellState,
          timelineState
        )
        for (const e of chargeLoseReturn.events()) {
          eventQueue.push(e)
        }
        break

      case EventType.ChannelStart:
        if (!isValid(timelineState, event.castId)) break
        const channelStartReturn = handleChannelStart(
          event as TimelineEvent<EventType.ChannelStart>,
          timelineState,
          spellInfo,
          spellState
        )
        for (const e of channelStartReturn.events()) {
          eventQueue.push(e)
        }
        break

      case EventType.ChannelInterrupted:
        if (!isValid(timelineState, event.castId)) break
        handleChannelInterrupt(
          event as TimelineEvent<EventType.ChannelInterrupted>,
          timelineState,
          spellInfo,
          spellState,
          true
        )
        break
      case EventType.ChannelEnd:
        if (!isValid(timelineState, event.castId)) break
        handleChannelEnd(
          event as TimelineEvent<EventType.ChannelEnd>,
          timelineState,
          spellInfo,
          spellState
        )
        break

      case EventType.EffectEnd:
        if (!isValid(timelineState, event.castId)) break
        handleEffectEnd(event as TimelineEvent<EventType.EffectEnd>, timelineState)
        break

      case EventType.CenariusGuidance:
        if (!isValid(timelineState, event.castId)) break
        const cenariusGuidanceReturn = handleCenariusGuidance(
          event as TimelineEvent<EventType.CenariusGuidance>,
          timelineState,
          eventQueue
        )
        for (const e of cenariusGuidanceReturn) {
          eventQueue.push(e)
        }
        break

      case EventType.DreamstateCdr:
        if (!isValid(timelineState, event.castId)) break
        const dreamstateReturn = handleDreamstate(
          event as TimelineEvent<EventType.DreamstateCdr>,
          timelineState,
          eventQueue
        )
        for (const e of dreamstateReturn.events()) {
          eventQueue.push(e)
        }
        break

      case EventType.ControlOfTheDream:
        handleControlOfTheDream(
          event as TimelineEvent<EventType.ControlOfTheDream>,
          timelineState,
          spellState
        )
        break

      case EventType.GainCharge:
        if (!isValid(timelineState, event.castId)) break
        const chargeGainReturn = handleChargeGain(
          event as TimelineEvent<EventType.GainCharge>,
          spellState,
          spellInfo,
          timelineState
        )
        for (const e of chargeGainReturn.events()) {
          eventQueue.push(e)
        }
        break

      case EventType.CooldownEnd:
        if (!isValid(timelineState, event.castId)) break
        handleCooldownEnd(
          event as TimelineEvent<EventType.CooldownEnd>,
          timelineState,
          processedState,
          spellInfo,
          spellState
        )
        break
    }
  }

  processedState.spells.forEach((spell) => {
    spell.chargeIntervals = timelineState.spells.find(
      (s) => s.spellId === spell.spell.spellId
    )?.chargeIntervals
  })

  processedState.spells.forEach((spell) => {
    spell.chargesUsed = findMaxUsedCharges(spell.chargeIntervals, spell.spell.charges)
  })

  return { processedState, processedEvents, rescheduledCasts }
}

export function isValid(timelineState: TimelineState, castId: string): boolean {
  return timelineState.activeCasts.has(castId)
}

// Function to find the maximum number of charges used at the same time
const findMaxUsedCharges = (
  chargeIntervals: ChargeInterval[] | undefined,
  totalCharges: number
): number => {
  if (!chargeIntervals || chargeIntervals.length === 0) {
    return 0
  }

  const sortedIntervals = [...chargeIntervals].sort((a, b) => a.instant - b.instant)

  // Start with full charges and track the minimum
  let currentCharges = totalCharges
  let minCharges = totalCharges

  sortedIntervals.forEach((interval) => {
    currentCharges += interval.change // Subtract because negative change means using a charge
    minCharges = Math.min(minCharges, currentCharges)
  })

  // Return the maximum used charges (total - minimum available)
  return totalCharges - minCharges
}
