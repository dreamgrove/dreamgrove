import { Cast } from '@/models/Cast'

export const SPELL_GCD = 1.5

export interface SpellTimeline {
  spell: SpellInfo
  casts: Cast[]
}

/**
 * Result type for missed cast warnings
 */
export interface Warning {
  spellName: string
  warning: string
}

export type TalentBindings = {
  id: Talents
  spellId: number
  label: string
  description: Record<string, string>
  specs: string[]
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
