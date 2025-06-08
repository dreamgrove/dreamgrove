import {
  PlayerAction,
  TimelineEvent,
  EventType,
  TimelineState,
  SpellInfo,
  TimelineToRender,
  Cast,
  SPELL_GCD,
  Talents,
} from '../../lib/types/cd_planner'
import { findMaxUsedCharges } from './SpellCastsRow'
import { GlobalAction } from '../../lib/types/global_handler'
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
} from 'lib/timeline_events'
import { handleChargeGain } from 'lib/timeline_events/handleChargeGain'

/**
 * Priority Queue implementation for Event objects
 */
export class EventQueue {
  private events: TimelineEvent<EventType>[] = []
  private remainingDelta: number = 0

  push(event: TimelineEvent<EventType>): void {
    // add +0.01 and round to 2 decimal places
    this.events.push(event)
    this.events.sort((a, b) => a.time - b.time)
  }

  /**
   * Remove and return the highest priority (earliest time) event
   */
  pop(): TimelineEvent<EventType> | undefined {
    return this.events.shift()
  }

  isEmpty(): boolean {
    return this.events.length === 0
  }

  size(): number {
    return this.events.length
  }

  modifyFirstEarliestOfType(cast: Cast, type: EventType, delta: number, event_time: number) {
    // Find all matching events and sort by time
    const matchingEvents = this.events
      .filter((event) => event.type === type && event.spellId === cast.spell.spellId)
      .sort((a, b) => a.time - b.time)

    for (let i = 0; i < matchingEvents.length; i++) {
      const event = matchingEvents[i]

      const originalTime = event.time
      const targetTime = originalTime + this.remainingDelta + delta

      if (targetTime < event_time) {
        const actualDelta = -(event_time - targetTime)
        // This event would go below the minimum time
        event.time = event_time
        this.remainingDelta = actualDelta
      } else {
        // Apply all remaining delta to this event
        event.time = targetTime
        this.remainingDelta = 0
      }
    }
  }

  modifyLatestOfType(
    cast: Cast,
    type: EventType,
    delta: number,
    event_time: number
  ): string | undefined {
    // Find all matching events and sort by time (latest first)
    const matchingEvents = this.events
      .filter((event) => event.type === type && event.spellId === cast.spell.spellId)
      .sort((a, b) => b.time - a.time)

    let remainingDelta = delta
    let modifiedCastId: string | undefined

    for (let i = 0; i < matchingEvents.length; i++) {
      const event = matchingEvents[i]
      if (remainingDelta === 0) {
        break
      }

      const originalTime = event.time
      const targetTime = originalTime + remainingDelta

      if (targetTime < cast.start_s) {
        // This event would go below the minimum time
        event.time = event_time
        const actualDelta = event_time - originalTime
        remainingDelta = remainingDelta - actualDelta
        if (!modifiedCastId) modifiedCastId = event.castId
      } else {
        // Apply all remaining delta to this event
        event.time = targetTime
        remainingDelta = 0
        if (!modifiedCastId) modifiedCastId = event.castId
      }
    }

    return modifiedCastId
  }

  /**
   * Find the earliest CooldownEnd event for a specific spell
   * @param spellId - The ID of the spell to find cooldown for
   * @param defaultTime - Default time to return if no cooldown event is found
   * @returns The time of the earliest cooldown end for the spell
   */
  findEarliestCharge(spellId: number, defaultTime: number): number {
    let earliestTime = Infinity

    for (const event of this.events) {
      if (event.type === EventType.GainCharge && event.spellId === spellId) {
        earliestTime = Math.min(earliestTime, event.time)
      }
    }

    return earliestTime === Infinity ? defaultTime : earliestTime
  }
  /**
   * Find the latest CooldownEnd event for a specific spell
   * @param spellId - The ID of the spell to find cooldown for
   * @param defaultTime - Default time to return if no cooldown event is found
   * @returns The time of the latest cooldown end for the spell
   */
  findLatestCharge(spellId: number, defaultTime: number): number {
    let latestTime = -Infinity

    for (const event of this.events) {
      if (event.type === EventType.GainCharge && event.spellId === spellId) {
        latestTime = Math.max(latestTime, event.time)
      }
    }

    return latestTime === -Infinity ? defaultTime : latestTime
  }
}

/**
 * Generates the base event queue from player actions
 * @param inputActions - The player actions to process
 * @returns EventQueue - A priority queue of events
 */
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

      // Round to avoid floating point precision issues
      startTime = Math.round(startTime * 100) / 100
      lastTime = startTime

      /*
      if (action.spell.name === 'Reforestation') {
        startTime = Math.max(startTime, 15)
      }
      */
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

/**
 * Process an event queue and generate a timeline for rendering
 * @param eventQueue - The queue of events to process
 * @param spells - The available spells information
 * @param keysToActions - Map of spell IDs to associated global actions
 * @param activeBindings - List of active talent bindings
 * @returns {object} Object containing:
 *   - processedState: TimelineToRender - A timeline ready for rendering
 *   - processedEvents: TimelineEvent[] - All events that were processed
 *   - rescheduledCasts: Array of {castId, newTime} - Casts that had to be rescheduled due to insufficient charges
 */
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
