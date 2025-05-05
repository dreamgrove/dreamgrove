import { SpellInfo } from '../types'

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

  set_end_s(end_s: number) {
    this.end_s = end_s
  }

  constructor(
    spell: SpellInfo,
    start_s: number,
    effect_duration_s: number,
    channel_duration_s: number,
    total_cooldown_s: number,
    interrupting_cast: CastImproved | null,
    can_interrupt: boolean,
    channeled: boolean
  ) {
    this.id = spell.id
    this.spell = spell
    this.start_s = start_s
    this.end_s = start_s + effect_duration_s
    this.effect_duration_s = effect_duration_s
    this.channel_duration_s = channel_duration_s
    this.total_cooldown_s = total_cooldown_s
    this.interrupting_cast = interrupting_cast
    this.can_interrupt = can_interrupt
    this.channeled = channeled
  }
}

export default CastImproved
