export const SPELL_GCD = 1.5

export interface SpellTimeline {
  spell: SpellInfo
  casts: Cast[]
}

//Enum for the type of event that can happen on the timeline
export enum EventType {
  CastStart = 'cast_start',
  ChannelStart = 'channel_start ',
  ChannelEnd = 'channel_end',
  CooldownEnd = 'cooldown_end',
  EffectEnd = 'effect_end',
  ChannelInterrupted = 'channel_interrupted',
  GainCharge = 'gain_charge',
  LoseCharge = 'lose_charge',
  ControlOfTheDream = 'control_of_the_dream',
  DreamstateCdr = 'dreamstate_cdr',
  CenariusGuidance = 'cenarius_guidance',
}

export enum Talents {
  EarlySpring = 'early_spring',
  ControlOfTheDream = 'control_of_the_dream',
  WhirlingStars = 'whirling_stars',
  PotentEnchantments = 'potent_enchantments',
  Incarnation = 'incarnation',
  Dreamstate = 'dreamstate',
  TearDownTheMighty = 'tear_down_the_mighty',
  AshamanesGuidance = 'ashamanes_guidance',
  HeartOfTheLion = 'heart_of_the_lion',
  CenariusGuidance = 'cenarius_guidance',
}
// Event type for the event queue
export interface TimelineEvent<T extends EventType> {
  type: T
  time: number
  spellId: number
  castId: string
}

// PlayerAction represents an input action from the user
export interface PlayerAction {
  spell: SpellInfo
  instant: number
  id: string
}

// SpellState represents the state of a spell at a specific point in time
export class SpellState {
  spellId: number
  usedCharges: number
  totalCharges: number
  isChanneling: boolean
  previousCast: Cast | null
  currentCast: Cast | null
  delayedCastIds: string[]
  chargeIntervals: ChargeInterval[]
  currentCharge: number

  restoreCharge(instant: number): number {
    this.usedCharges--
    this.chargeIntervals.push({ instant, change: +1 })
    this.currentCharge = this.usedCharges
    return this.usedCharges
  }

  useCharge(instant: number) {
    this.usedCharges++
    this.chargeIntervals.push({ instant, change: -1 })
    this.currentCharge = this.usedCharges

    return this.usedCharges
  }

  constructor(spellId: number, totalCharges: number) {
    this.spellId = spellId
    this.totalCharges = totalCharges
    this.usedCharges = 0
    this.isChanneling = false
    this.previousCast = null
    this.currentCast = null
    this.chargeIntervals = []
    this.delayedCastIds = []
    this.currentCharge = 0
  }
}

// TimelineState represents the global state of all spells while processing events
export class TimelineState {
  spells: SpellState[]
  activeCasts: Map<string, Cast>
  channeledSpell: SpellInfo | null
  activeEffects: Map<Talents, Map<number, number>>

  constructor() {
    this.spells = []
    this.channeledSpell = null
    this.activeCasts = new Map()
    this.activeEffects = new Map()
  }

  initializeControlOfTheDream() {
    this.activeEffects.set(
      Talents.ControlOfTheDream,
      new Map([
        [391528, -15],
        [205636, -15],
        [194223, -15],
        [33891, -15],
      ])
    )
  }

  isSpellCastPresent(spellId: number): Cast | null {
    return (
      Array.from(this.activeCasts.values()).find((cast) => cast.spell.spellId === spellId) ?? null
    )
  }

  findOrCreateSpellState(spellId: number, totalCharges: number): SpellState {
    const spell = this.spells.find((s) => s.spellId === spellId)
    if (spell) {
      return spell
    }

    const newSpell = new SpellState(spellId, totalCharges)
    this.spells.push(newSpell)
    return newSpell
  }
}

// The final processed timeline ready for rendering
export interface TimelineToRender {
  spells: SpellToRender[]
  timeline_length_s: number
}

// A spell with its casts ready for rendering
export interface SpellToRender {
  spell: SpellInfo
  casts: Cast[]
  chargeIntervals?: ChargeInterval[]
  chargesUsed: number
}

// ChargeInterval represents a time interval with a specific number of charges
export interface ChargeInterval {
  instant: number
  change: number
}

export interface SpellInfo {
  spellId: number
  name: string
  channel_duration: number
  effect_duration: number
  cooldown: number
  charges: number
  channeled?: boolean
  specs?: string[]
  can_interrupt?: boolean
}
// Parameters for creating a Cast
export interface CastParams {
  id: string
  spell: SpellInfo
  start_s: number
  interrupting_cast?: Cast | null
  current_charge?: number
  cooldown_delay_s?: number
  cooldown_duration?: number
}

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

function round(value: number, precision: number) {
  return Math.round(value * precision) / precision
}
