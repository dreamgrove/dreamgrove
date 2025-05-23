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

/**
 * Priority Queue implementation for Event objects
 */
export class EventQueue {
  private events: TimelineEvent[] = []

  push(event: TimelineEvent): void {
    // add +0.01 and round to 2 decimal places
    event.time = Math.round((event.time + 0.01) * 100) / 100
    this.events.push(event)
    this.events.sort((a, b) => a.time - b.time)
  }

  /**
   * Remove and return the highest priority (earliest time) event
   */
  pop(): TimelineEvent | undefined {
    return this.events.shift()
  }

  isEmpty(): boolean {
    return this.events.length === 0
  }

  size(): number {
    return this.events.length
  }

  //event = 7
  //delta = -5
  //cast= 10
  //expected = 7
  //expected reduction = 3
  // 7 + -5 = 2
  modifyEarliesType(spellId: number, type: EventType, delta: number, event_time: number) {
    for (const cast of this.events) {
      if (cast.type === type && cast.spellId === spellId) {
        if (cast.time + delta < event_time) {
          cast.time = event_time
        } else {
          cast.time += delta
        }
      }
    }
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

  inputActions
    .sort((a, b) => a.instant - b.instant)
    .forEach((action) => {
      const startTime = action.instant
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

function getMatchingActions(
  event: TimelineEvent,
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
  processedEvents: TimelineEvent[]
  rescheduledCasts: Array<{ castId: string; newTime: number }>
} {
  let timelineState = new TimelineState()
  const processedState: TimelineToRender = { spells: [], timeline_length_s: 0 }
  const processedEvents: TimelineEvent[] = []
  const rescheduledCasts: Array<{ castId: string; newTime: number }> = []
  // Create a deep copy of the spells array to prevent state preservation between calls
  let currentSpells = JSON.parse(JSON.stringify(spells))

  /* Control of The Dream */
  if (activeBindings.includes(Talents.ControlOfTheDream)) {
    timelineState.initializeControlOfTheDream()
  }

  while (!eventQueue.isEmpty()) {
    let event = eventQueue.pop()
    if (!event) break

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

    const canCast = () => spellState.usedCharges < spellState.totalCharges

    event.time = Math.round(event.time * 10) / 10

    switch (event.type) {
      case EventType.CastStart:
        /* Special case for Tree of Life */
        const reforestationCast = timelineState.isSpellCastPresent(392356)
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
          eventQueue.push({
            type: EventType.CastStart,
            time: reforestationCast.effect_start_s + reforestationCast.effect_duration + 0.1,
            spellId: event.spellId,
            castId: event.castId,
          })
        } else if (canCast()) {
          /* Normal Cast */
          if (spellState.currentCast && event.time - SPELL_GCD < spellState.currentCast.start_s) {
            event.time = event.time + SPELL_GCD
          }

          /* Reforestation */
          if (event.spellId === 392356) {
            const treeOfLifeId = 33891
            // if the casts has a cast with id treeOfLifeId, then we need to add 15 seconds to the cooldown
            const treeOfLifeCast = timelineState.isSpellCastPresent(treeOfLifeId)
            const potentEnchantments = activeBindings.includes(Talents.PotentEnchantments)

            const potentEnchantmentsDuration = potentEnchantments ? 3 : 0
            console.log('potentEnchantmentsDuration', potentEnchantmentsDuration)
            if (
              treeOfLifeCast &&
              event.time <
                treeOfLifeCast.effect_duration +
                  treeOfLifeCast.effect_start_s +
                  potentEnchantmentsDuration
            ) {
              eventQueue.modifyEarliesType(
                treeOfLifeId,
                EventType.EffectEnd,
                spellInfo.effect_duration + potentEnchantmentsDuration,
                event.time
              )
            }
          }

          spellState.useCharge(event.time)

          const latestChargeTime = eventQueue.findLatestCharge(event.spellId, event.time)
          const cooldown_delay = Math.max(0, latestChargeTime - event.time)

          /* Control of the Dream */
          if (timelineState.activeEffects.has(Talents.ControlOfTheDream)) {
            const cotdEffects = timelineState.activeEffects.get(Talents.ControlOfTheDream)
            if (cotdEffects && cotdEffects.has(event.spellId)) {
              const cotdTime = cotdEffects.get(event.spellId)
              if (cotdTime !== undefined && event.time > cotdTime) {
                spellInfo.cooldown -= Math.min(15, event.time - cotdTime)
                cotdEffects.delete(event.spellId)
              }
            }
          }

          eventQueue.push({
            type: EventType.GainCharge,
            time: latestChargeTime + spellInfo.cooldown,
            spellId: event.spellId,
            castId: event.castId,
          })

          if (timelineState.channeledSpell) {
            eventQueue.push({
              type: EventType.ChannelInterrupted,
              time: event.time,
              spellId: timelineState.channeledSpell.spellId,
              castId: event.castId,
            })
          }

          if (spellInfo.channeled) {
            eventQueue.push({
              type: EventType.ChannelStart,
              time: event.time,
              spellId: event.spellId,
              castId: event.castId,
            })
            eventQueue.push({
              type: EventType.ChannelEnd,
              time: event.time + spellInfo.channel_duration,
              spellId: event.spellId,
              castId: event.castId,
            })
          }

          eventQueue.push({
            type: EventType.EffectEnd,
            time: event.time + spellInfo.effect_duration,
            spellId: event.spellId,
            castId: event.castId,
          })

          eventQueue.push({
            type: EventType.CooldownEnd,
            time: event.time + spellInfo.cooldown + cooldown_delay,
            spellId: event.spellId,
            castId: event.castId,
          })

          const cast = new Cast({
            id: event.castId,
            spell: spellInfo,
            start_s: event.time,
            current_charge: spellState.usedCharges - 1, // 0-indexed
            cooldown_delay_s: cooldown_delay,
          })

          timelineState.activeCasts.set(cast.id, cast)
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

          // Create a new cast event at the time when a charge will be available
          eventQueue.push({
            type: EventType.CastStart,
            time: nextChargeTime,
            spellId: event.spellId,
            castId: event.castId,
          })
        }
        break

      case EventType.ChannelStart:
        spellState.isChanneling = true
        timelineState.channeledSpell = spellInfo
        break

      case EventType.ChannelInterrupted:
      case EventType.ChannelEnd:
        if (timelineState.channeledSpell?.spellId !== spellInfo.spellId) {
          break
        }
        const cast = timelineState.activeCasts.get(event.castId)
        if (cast) {
          cast.channel_duration = event.time - cast.start_s
          timelineState.activeCasts.set(cast.id, cast)
        }
        spellState.isChanneling = false
        timelineState.channeledSpell = null
        break

      case EventType.EffectEnd:
        if (timelineState.activeCasts.has(event.castId)) {
          const cast = timelineState.activeCasts.get(event.castId)
          if (cast) {
            cast.effect_duration = event.time - cast.start_s
          }
        }
        break

      case EventType.CenariusGuidance:
        if (timelineState.activeCasts.has(event.castId)) {
          const cast = timelineState.activeCasts.get(event.castId)
          if (cast) {
            eventQueue.modifyEarliesType(cast.spell.spellId, EventType.CooldownEnd, -5, event.time)
            eventQueue.modifyEarliesType(cast.spell.spellId, EventType.GainCharge, -5, event.time)
          }
        }
        break

      case EventType.DreamstateCdr:
        if (timelineState.channeledSpell?.name !== 'Tranquillity') {
          break
        }
        const currentCasts = timelineState.activeCasts.values()
        const consideredSpells = new Set<number>()
        consideredSpells.add(740)
        for (const cast of currentCasts) {
          if (consideredSpells.has(cast.spell.spellId)) {
            continue
          }
          consideredSpells.add(cast.spell.spellId)
          eventQueue.modifyEarliesType(cast.spell.spellId, EventType.CooldownEnd, -4, event.time)
          eventQueue.modifyEarliesType(cast.spell.spellId, EventType.GainCharge, -4, event.time)
        }

        eventQueue.push({
          type: EventType.DreamstateCdr,
          time: event.time + 1,
          spellId: event.spellId,
          castId: event.castId,
        })
        break

      case EventType.ControlOfTheDream:
        if (spellState.usedCharges === 0) {
          const cotdEffects = timelineState.activeEffects.get(Talents.ControlOfTheDream)
          if (cotdEffects) {
            cotdEffects.set(event.spellId, event.time)
            timelineState.activeEffects
              .get(Talents.ControlOfTheDream)
              ?.set(event.spellId, event.time)
          }
        }
        break

      case EventType.GainCharge:
        if (spellState.usedCharges > 0) {
          spellState.restoreCharge(event.time)
        }
        break

      case EventType.CooldownEnd:
        if (timelineState.activeCasts.has(event.castId)) {
          if (event.time > processedState.timeline_length_s) {
            processedState.timeline_length_s = event.time
          }
          const cast = timelineState.activeCasts.get(event.castId)
          if (cast) {
            cast.cooldown_duration = event.time - cast.start_s - cast.cooldown_delay_s

            let spellToRender = processedState.spells.find((s) => s.spell.spellId === event.spellId)
            if (!spellToRender) {
              spellToRender = { spell: spellInfo, casts: [], chargesUsed: 0 }
              processedState.spells.push(spellToRender)
            }

            // Add the cast to the spell
            spellToRender.casts.push(cast)
            spellState.previousCast = spellState.currentCast
            spellState.currentCast = null
            timelineState.activeCasts.delete(event.castId)
          }
        } else {
          console.log('no cast found for cooldown end. probably we already ended', event.castId)
        }
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
