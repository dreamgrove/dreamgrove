import { EventQueue } from '../../components/TimelinePlanner/TimelineEvents'
import { TimelineEvent, SpellInfo, TimelineState, EventType } from './cd_planner'

type GlobalAction = <T extends EventType>(
  event: TimelineEvent<T>,
  queue: EventQueue,
  state: TimelineState,
  spells: SpellInfo[]
) => {
  changedEvent: TimelineEvent<T>
  eventsToAdd: TimelineEvent<EventType>[]
  newState: TimelineState
  newSpells: SpellInfo[]
}

export type { GlobalAction }
