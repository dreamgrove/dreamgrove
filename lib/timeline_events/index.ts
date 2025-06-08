import { EventType, TimelineState } from 'lib/types/cd_planner'

export type {
  TimelineEvent,
  SpellInfo,
  SpellState,
  TimelineState,
  Cast,
} from 'lib/types/cd_planner'

export type { EventQueue } from '@/components/TimelinePlanner/TimelineEvents'
export { EventType, Talents } from 'lib/types/cd_planner'

// Re-export all timeline event handlers
export { handleChargeLose } from './handleChargeLose'
export { handleCastStart } from './handleCastStart'
export { handleChannelStart } from './handleChannelStart'
export { handleChannelEnd } from './handleChannelEnd'
export { handleEffectEnd } from './handleEffectEnd'
export { handleDreamstate } from './handleDreamstate'
export { handleCenariusGuidance } from './handleCenariusGuidance'
export { handleControlOfTheDream } from './handleControlOfTheDream'
export { handleCooldownEnd } from './handleCooldownEnd'
export { handleChannelInterrupt } from './handleChannelInterrupt'

export function isValid(timelineState: TimelineState, castId: string): boolean {
  return timelineState.activeCasts.has(castId)
}
