import { useTimelineControls } from '@/components/TimelinePlanner/Providers/TimelineLengthProvider'
import { generateBaseQueue, processEventQueue } from '@/components/TimelinePlanner/TimelineEvents'
import { GlobalAction } from '@/types/events'
import { PlayerAction, SpellInfo } from '@/types/timeline'
import { useEffect, useMemo } from 'react'

export function useProcessedTimeline(
  inputActions: PlayerAction[],
  localSpells: SpellInfo[],
  keysToTalents: Map<string, Set<GlobalAction>>,
  activeTalents: string[]
) {
  const { setTotalLength } = useTimelineControls()

  // Rescheduled casts from processEventQueue are intentionally not written back into
  // inputActions. inputActions is the source of truth for user intent; processedState
  // is the derived view of what the simulator actually does. Keeping them separate
  // avoids the export/import desync that writebacks created.
  const { processedState, processedEvents } = useMemo(() => {
    const queue = generateBaseQueue(inputActions)
    const { processedState, processedEvents } = processEventQueue(
      queue,
      localSpells,
      keysToTalents,
      activeTalents
    )
    return { processedState, processedEvents }
  }, [inputActions, localSpells, keysToTalents, activeTalents])

  useEffect(() => {
    setTotalLength(processedState.timeline_length_s > 240 ? processedState.timeline_length_s : 240)
  }, [processedState, setTotalLength])

  return { processedState, processedEvents }
}
