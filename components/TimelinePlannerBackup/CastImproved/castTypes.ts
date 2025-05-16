import { SpellInfo } from '../types'

type CastImprovedParams = {
  spell: SpellInfo
  start_s: number
  effect_duration_s: number
  channel_duration_s: number
  total_cooldown_s: number
  interrupting_cast?: CastImproved | null
  can_interrupt?: boolean
  channeled?: boolean
}
class CastImproved {
  id: string
  spell: SpellInfo
  start_s: number
  end_s: number
  effect_duration_s: number
  channel_duration_s: number
  total_cooldown_s: number
  interrupting_cast: CastImproved | null
  can_interrupt: boolean
  channeled: boolean

  constructor(params: CastImprovedParams) {
    const {
      spell,
      start_s,
      effect_duration_s,
      channel_duration_s,
      total_cooldown_s,
      interrupting_cast,
      can_interrupt,
      channeled,
    } = params
    this.id = spell.id
    this.spell = spell
    this.start_s = start_s
    this.end_s = start_s + effect_duration_s
    this.effect_duration_s = effect_duration_s
    this.channel_duration_s = channel_duration_s
    this.total_cooldown_s = total_cooldown_s
    this.interrupting_cast = interrupting_cast ?? null
    this.can_interrupt = can_interrupt ?? false
    this.channeled = channeled ?? false
  }
}

export default CastImproved
