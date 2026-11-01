import { EventType, Talents, GlobalAction } from '@/types/index'

export const dreamstate: GlobalAction = (event, queue, state, spells) => {
  if (event.type !== EventType.ChannelStart) return []
  if (!spells.some((s) => s.spellId === event.spellId)) return []
  if (state.activeEffects.get(Talents.Dreamstate)) return []

  state.activeEffects.set(Talents.Dreamstate, new Map([[event.spellId, event.time]]))
  // Tranquility
  if (event.spellId !== 740) return []
  return [
    {
      type: EventType.DreamstateCdr,
      time: event.time,
      spellId: event.spellId,
      castId: event.castId,
    },
  ]
}
