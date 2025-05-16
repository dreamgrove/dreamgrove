import { v4 as uuidv4 } from 'uuid'
import {
  PlayerAction,
  Event,
  EventType,
  TimelineState,
  SpellInfo,
  CastParams,
  TimelineToRender,
  SpellToRender,
  Cast,
  SPELL_GCD,
  SpellState,
} from './types'
import { findMaxUsedCharges } from './SpellCastsRow'

/**
 * Priority Queue implementation for Event objects
 */
export class EventQueue {
  private events: Event[] = []

  push(event: Event): void {
    // add +0.01 and round to 2 decimal places
    event.time = Math.round((event.time + 0.01) * 100) / 100
    this.events.push(event)
    this.events.sort((a, b) => a.time - b.time)
  }

  /**
   * Remove and return the highest priority (earliest time) event
   */
  pop(): Event | undefined {
    return this.events.shift()
  }

  isEmpty(): boolean {
    return this.events.length === 0
  }

  size(): number {
    return this.events.length
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
      eventQueue.push({
        type: EventType.CastStart,
        time: action.instant,
        spellId: action.spell.spellId,
        castId: action.id,
      })
    })

  return eventQueue
}

/**
 * Process an event queue and generate a timeline for rendering
 * @param eventQueue - The queue of events to process
 * @param spells - The available spells information
 * @returns TimelineToRender - A timeline ready for rendering
 */
export function processEventQueue(eventQueue: EventQueue, spells: SpellInfo[]): TimelineToRender {
  const timelineState = new TimelineState()
  const casts = new Map<string, Cast>()

  const processedState: TimelineToRender = { spells: [] }

  while (!eventQueue.isEmpty()) {
    const event = eventQueue.pop()
    if (!event) break

    const spellInfo = spells.find((s) => s.spellId === event.spellId)
    if (!spellInfo) continue

    const spellState = timelineState.findOrCreateSpellState(event.spellId, spellInfo.charges || 1)

    event.time = Math.round(event.time * 100) / 100

    switch (event.type) {
      case EventType.CastStart:
        // Check if we can cast

        if (spellState.usedCharges < spellState.totalCharges) {
          console.log('Successful Cast Start At: ', event.time)
          spellState.useCharge(event.time)
          //console.log('available charges', spellState.totalCharges - spellState.usedCharges)
          if (spellState.currentCast && event.time - SPELL_GCD < spellState.currentCast.start_s) {
            event.time = event.time + SPELL_GCD
          }

          const latestChargeTime = eventQueue.findLatestCharge(event.spellId, event.time)
          console.log('latest charge time', latestChargeTime)
          const cooldown_delay = Math.max(0, latestChargeTime - event.time)
          //console.log('cooldown delay', cooldown_delay)
          console.log(spellInfo.cooldown)

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
            time: event.time + spellInfo.cooldown,
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
          //console.log('cd delay', cooldown_delay)

          casts.set(event.castId, cast)
          spellState.currentCast = cast
        } else {
          // if we don't have enough charges we need to find the first instant
          // where we have one charge available

          // Find the earliest time when a charge will be available
          const nextChargeTime = eventQueue.findEarliestCharge(event.spellId, event.time)
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
        //console.log('successful channel start')
        spellState.isChanneling = true
        timelineState.channeledSpell = spellInfo
        break

      case EventType.ChannelEnd:
        //console.log('successful channel end')
        // Clear channeling state
        if (casts.has(event.castId)) {
          const cast = casts.get(event.castId)
          if (cast) {
            cast.channel_duration = event.time - cast.start_s
            casts.set(cast.id, cast)
          }
        }
        spellState.isChanneling = false
        timelineState.channeledSpell = null
        break

      case EventType.EffectEnd:
        //console.log('successful effect end')
        // Effect ended, nothing to do for now
        break

      case EventType.GainCharge:
        // Gain charge, nothing to do for now
        if (spellState.usedCharges > 0) {
          spellState.restoreCharge(event.time)
          //console.log('successfully gained charge at', event.time)
          //console.log('available charges', spellState.totalCharges - spellState.usedCharges)
        }
        break

      case EventType.CooldownEnd:
        // Cooldown ended, restore a charge
        //console.log('successful cooldown end')
        if (casts.has(event.castId)) {
          const cast = casts.get(event.castId)
          if (cast) {
            //console.log(
            //  'changing cooldown duration from',
            //  cast.cooldown_duration,
            //  'to',
            //  event.time - cast.start_s
            //)
            cast.cooldown_duration = event.time - cast.start_s
            const castToRender = new Cast(cast)

            // Find or create the spell entry in the processed state
            let spellToRender = processedState.spells.find((s) => s.spell.spellId === event.spellId)
            if (!spellToRender) {
              spellToRender = { spell: spellInfo, casts: [], chargesUsed: 0 }
              processedState.spells.push(spellToRender)
            }

            // Add the cast to the spell
            spellToRender.casts.push(castToRender)
            spellState.previousCast = spellState.currentCast
            spellState.currentCast = null
          }
        }
        break
    }
  }

  //console.log('Processed state:', processedState)
  processedState.spells.forEach((spell) => {
    spell.chargeIntervals = timelineState.spells.find(
      (s) => s.spellId === spell.spell.spellId
    )?.chargeIntervals
  })

  processedState.spells.forEach((spell) => {
    spell.chargesUsed = findMaxUsedCharges(spell.chargeIntervals, spell.spell.charges)
  })

  return processedState
}

/**
 * Process player actions into a renderable timeline
 * @param inputActions - The player actions to process
 * @param spells - The available spells information
 * @returns TimelineToRender - A timeline ready for rendering
 */
export function processPlayerActions(
  inputActions: PlayerAction[],
  spells: SpellInfo[]
): TimelineToRender {
  const eventQueue = generateBaseQueue(inputActions)

  return processEventQueue(eventQueue, spells)
}
