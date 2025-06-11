import { round } from 'lib/utils/utilityFunctions'
import { CastParams, SpellInfo } from '@/types/index'

/*
 * |<--  channel_visual  -->|<-- effect_visual -->|<-- cooldown_delay_s -->|<-- cooldown_visual -->|
 *  <-- channel_duration -->
 *  <--             effect_duration            -->
 *  <--                                        total_cooldown                                    -->
 */
export class Cast {
  id: string
  spell: SpellInfo
  start_s: number

  _is_interruped: boolean
  set is_interruped(value: boolean) {
    this._is_interruped = value
  }

  get is_interruped(): boolean {
    return this._is_interruped
  }

  interrupting_cast: Cast | null

  interrupt(interrupting_cast: Cast) {
    this.interrupting_cast = interrupting_cast
    this._chann_end_s = interrupting_cast.start_s
    this._ef_end_s = interrupting_cast.start_s
    this._effect_duration = interrupting_cast.start_s - this.start_s
    this._is_interruped = true
  }

  _cd_start_s: number
  _ef_end_s: number
  _chann_end_s: number
  _cd_end_s: number

  current_charge: number

  /* Channel */
  _channel_duration: number
  get channel_start_s(): number {
    return this.start_s
  }
  get channel_visual_duration(): number {
    return this._channel_duration
  }
  get channel_duration(): number {
    return this._channel_duration
  }
  set channel_duration(value: number) {
    this._channel_duration = value
  }

  /* Effect */
  _effect_duration: number
  get effect_start_s(): number {
    return this.start_s
  }
  get effect_visual_duration(): number {
    return Math.max(0, this._effect_duration - this._channel_duration)
  }
  get effect_duration(): number {
    return this._ef_end_s - this.start_s
  }
  set effect_duration(value: number) {
    this._effect_duration = value
  }

  /* Cooldown */
  _cooldown_duration: number
  cooldown_delay_s: number
  get cooldown_start_s(): number {
    return this.start_s + this.cooldown_delay_s
  }
  get cooldown_visual_duration(): number {
    return this.cooldown_delay_s > 0
      ? Math.max(this.cooldown_duration, 0)
      : Math.max(
          this.cooldown_duration +
            this.cooldown_delay_s -
            Math.max(this.effect_duration, this.channel_duration),
          0
        )
  }
  get cooldown_visual_start_s(): number {
    return this.start_s + Math.max(this.effect_duration, this.channel_duration)
  }
  get cooldown_delay_visual_duration(): number {
    return this.cooldown_delay_s > 0
      ? Math.max(0, this.cooldown_delay_s - Math.max(this.effect_duration, this.channel_duration))
      : 0
  }
  get cooldown_duration(): number {
    return this._cooldown_duration
  }
  set cooldown_duration(value: number) {
    this._cooldown_duration = Math.max(value, Math.max(this.effect_duration, this.channel_duration))
  }

  get delayed_cooldown_duration(): number {
    return this.spell.cooldown + this.cooldown_delay_s
  }

  get end_s(): number {
    return this.start_s + this.cooldown_duration + this.cooldown_delay_s
  }

  get duration_s(): number {
    return Math.max(this._cd_end_s - this.start_s, this.effect_duration, this.channel_duration)
  }

  get effect_length(): number {
    return this._ef_end_s - this.start_s
  }

  get cooldown_length(): number {
    return this._cd_end_s - this._cd_start_s
  }

  get channel_length(): number {
    return this._chann_end_s - this.start_s
  }

  constructor(params: CastParams) {
    const {
      id,
      spell,
      start_s,
      interrupting_cast,
      current_charge,
      cooldown_delay_s,
      cooldown_duration,
    } = params
    this.id = id
    this.spell = spell
    this.start_s = round(start_s, 10)

    this.interrupting_cast = interrupting_cast ?? null
    this.current_charge = current_charge ?? 0
    this._is_interruped = false

    this._cooldown_duration = cooldown_duration ?? spell.cooldown
    this.cooldown_delay_s = cooldown_delay_s ?? 0

    this._effect_duration = spell.effect_duration
    this._channel_duration = spell.channel_duration

    this._cd_start_s = this.start_s
    this._ef_end_s = this.start_s + this.effect_duration
    this._chann_end_s = this.start_s + this.channel_duration
    this._cd_end_s = this.start_s + this.cooldown_duration
  }
}
