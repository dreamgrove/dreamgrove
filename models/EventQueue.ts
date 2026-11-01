import { EventType, TimelineEvent } from '@/types/index'
import { Cast } from './Cast'

/**
 * Priority Queue implementation for Event objects
 */
export class EventQueue {
  private events: TimelineEvent<EventType>[] = []

  push(event: TimelineEvent<EventType>): void {
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

  /**
   * Shift every queued event of `type` for the cast's spell by `delta`, never
   * moving one before `event_time`. Whatever part of the shift an event could not
   * take is carried over to the next one.
   */
  modifyFirstEarliestOfType(cast: Cast, type: EventType, delta: number, event_time: number) {
    const matchingEvents = this.events
      .filter((event) => event.type === type && event.spellId === cast.spell.spellId)
      .sort((a, b) => a.time - b.time)

    let remainingDelta = 0
    for (const event of matchingEvents) {
      const targetTime = event.time + remainingDelta + delta

      if (targetTime < event_time) {
        event.time = event_time
        remainingDelta = targetTime - event_time
      } else {
        event.time = targetTime
        remainingDelta = 0
      }
    }

    // Shifted events may now be out of order relative to the rest of the queue.
    this.events.sort((a, b) => a.time - b.time)
  }

  /**
   * Find the earliest GainCharge event for a specific spell
   * @param spellId - The ID of the spell to find cooldown for
   * @param defaultTime - Default time to return if no charge event is found
   * @returns The time of the earliest charge gain for the spell
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
   * Find the latest GainCharge event for a specific spell
   * @param spellId - The ID of the spell to find cooldown for
   * @param defaultTime - Default time to return if no charge event is found
   * @returns The time of the latest charge gain for the spell
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
