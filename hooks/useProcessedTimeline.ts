import { useTimelineControls } from '@/components/TimelinePlanner/Providers/TimelineLengthProvider'
import { generateBaseQueue, processEventQueue } from '@/components/TimelinePlanner/TimelineEvents'
import { GlobalAction } from '@/types/events'
import {
  EventType,
  PlayerAction,
  SpellInfo,
  TimelineEvent,
  TimelineToRender,
} from '@/types/timeline'
import React, { useEffect, useState } from 'react'

export function useProcessedTimeline(
  inputActions: PlayerAction[],
  localSpells: SpellInfo[],
  keysToTalents: Map<string, Set<GlobalAction>>,
  activeTalents: string[],
  setInputActions: React.Dispatch<React.SetStateAction<PlayerAction[]>>
) {
  const { setTotalLength } = useTimelineControls()

  const processedReschedulingsRef = React.useRef<Set<string>>(new Set())

  const [processedState, setProcessedState] = useState<TimelineToRender>({
    spells: [],
    timeline_length_s: 0,
  })

  const [processedEvents, setProcessedEvents] = useState<TimelineEvent<EventType>[]>([])

  useEffect(() => {
    setTotalLength(processedState.timeline_length_s > 240 ? processedState.timeline_length_s : 240)
  }, [processedState])

  useEffect(() => {
    const queue = generateBaseQueue(inputActions)

    const { processedState, processedEvents, rescheduledCasts } = processEventQueue(
      queue,
      localSpells,
      keysToTalents,
      activeTalents
    )

    setProcessedState(processedState)
    setProcessedEvents(processedEvents)

    // Handle any casts that need to be rescheduled due to insufficient charges
    // We need to update inputActions when a spell can't be cast at the specified time
    // but must avoid creating an infinite re-render loop when we update inputActions
    if (rescheduledCasts.length > 0) {
      // Filter out already processed reschedulings using our ref to track state across renders
      const unprocessedReschedulings = rescheduledCasts.filter(({ castId, newTime }) => {
        const action = inputActions.find((a) => a.id === castId)
        // Create a unique key for this specific rescheduling
        const key = `${castId}:${newTime.toFixed(2)}`
        const alreadyProcessed = processedReschedulingsRef.current.has(key)
        const needsUpdate = action && Math.abs(action.instant - newTime) > 0.001

        return !alreadyProcessed && needsUpdate
      })

      if (unprocessedReschedulings.length > 0) {
        // Mark these reschedulings as processed to prevent processing them again
        unprocessedReschedulings.forEach(({ castId, newTime }) => {
          const key = `${castId}:${newTime.toFixed(2)}`
          processedReschedulingsRef.current.add(key)
        })

        // Build a map of castIds to new times for all unprocessed reschedulings
        const castsToReschedule = new Map<string, number>()
        unprocessedReschedulings.forEach(({ castId, newTime }) => {
          castsToReschedule.set(castId, newTime)
        })

        // Update all casts at once in a batched update to minimize rerenders
        setInputActions((prev) =>
          prev.map((action) => {
            const newTime = castsToReschedule.get(action.id)
            if (newTime !== undefined) {
              return { ...action, instant: newTime }
            }
            return action
          })
        )
      }
    }
  }, [inputActions, localSpells, keysToTalents, activeTalents])

  return { processedState, processedEvents }
}
