import { TimelineToRender } from 'lib/types/cd_planner'
import { TimelineEvent, EventQueue, SpellState, SpellInfo, EventType, TimelineState } from '.'

type IGetEvents = {
  events(): TimelineEvent<EventType>[]
}

/* CAST START */
export interface ICastStartHandler {
  (
    event: TimelineEvent<EventType.CastStart>,
    timelineState: TimelineState,
    rescheduledCasts: Array<{ castId: string; newTime: number }>,
    eventQueue: EventQueue,
    activeBindings: string[],
    spellInfo: SpellInfo,
    spellState: SpellState
  ): CastStartReturn
}
export type CastStartReturn = RescheduledCast | NormalCast
export type RescheduledCast = IGetEvents & {
  rescheduledStartEvent: TimelineEvent<EventType.CastStart>
}
export type NormalCast = IGetEvents & {
  channelStartEvent?: TimelineEvent<EventType.ChannelStart>
  channelInterruptedEvent?: TimelineEvent<EventType.ChannelInterrupted>
  loseChargeEvent: TimelineEvent<EventType.LoseCharge>
  effectEndEvent: TimelineEvent<EventType.EffectEnd>
}

/* CHARGE GAIN */
export interface IChargeGainHandler {
  (
    event: TimelineEvent<EventType.GainCharge>,
    spellState: SpellState,
    spellInfo: SpellInfo,
    timelineState: TimelineState
  ): ChargeGainReturn
}
export type ChargeGainReturn = IGetEvents & {
  cooldownEndEvent: TimelineEvent<EventType.CooldownEnd>
}

/* CHARGE LOSE */
export interface IChargeLoseHandler {
  (
    event: TimelineEvent<EventType.LoseCharge>,
    spellInfo: SpellInfo,
    spellState: SpellState
  ): ChargeLoseReturn
}
export type ChargeLoseReturn = IGetEvents & {
  gainChargeEvent: TimelineEvent<EventType.GainCharge> | null
}

/* CENARIUS GUIDANCE */
export interface ICenariusGuidanceHandler {
  (
    event: TimelineEvent<EventType.CenariusGuidance>,
    timelineState: TimelineState,
    eventQueue: EventQueue
  ): void
}

/* CHANNEL START */
export interface IChannelStartHandler {
  (
    event: TimelineEvent<EventType.ChannelStart>,
    timelineState: TimelineState,
    spellInfo: SpellInfo,
    spellState: SpellState
  ): ChannelStartReturn
}
export type ChannelStartReturn = IGetEvents & {
  channelEndEvent: TimelineEvent<EventType.ChannelEnd>
}

/* CHANNEL END */
export interface IChannelEndHandler {
  (
    event: TimelineEvent<EventType.ChannelEnd>,
    timelineState: TimelineState,
    spellInfo: SpellInfo,
    spellState: SpellState
  ): void
}

/* EFFECT END */
export interface IEffectEndHandler {
  (event: TimelineEvent<EventType.EffectEnd>, timelineState: TimelineState): void
}

/* DREAMSTATE */
export interface IDreamstateHandler {
  (
    event: TimelineEvent<EventType.DreamstateCdr>,
    timelineState: TimelineState,
    eventQueue: EventQueue
  ): DreamstateReturn
}
export type DreamstateReturn = IGetEvents & {
  dreamstateEvent: TimelineEvent<EventType.DreamstateCdr>
}

/* CONTROL OF THE DREAM */
export interface IControlOfTheDreamHandler {
  (
    event: TimelineEvent<EventType.ControlOfTheDream>,
    timelineState: TimelineState,
    spellState: SpellState
  ): void
}

/* COOLDOWN END */
export interface ICooldownEndHandler {
  (
    event: TimelineEvent<EventType.CooldownEnd>,
    timelineState: TimelineState,
    processedState: TimelineToRender,
    spellInfo: SpellInfo,
    spellState: SpellState
  ): void
}
