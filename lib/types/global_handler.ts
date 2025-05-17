import { EventQueue } from '../../components/TimelinePlanner/TimelineEvents'
import { TimelineEvent, SpellInfo, TimelineState } from './cd_planner'

type GlobalAction = (
  event: TimelineEvent,
  queue: EventQueue,
  state: TimelineState,
  spells: SpellInfo[]
) => {
  changedEvent: TimelineEvent
  eventsToAdd: TimelineEvent[]
  newState: TimelineState
  newSpells: SpellInfo[]
}

export type { GlobalAction }
