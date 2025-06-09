import { EventType, TimelineEvent } from '@/types/index'
import { Cast } from './Cast'

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
