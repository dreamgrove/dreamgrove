import { SpellInfo, CastParams } from '@/types/index'
import { Cast } from '@/models/Cast'
import { describe, test, expect, beforeEach } from '@jest/globals'

// Celestial Alignment spell data from spells.json
const caSpellInfo: SpellInfo = {
  spellId: 194223,
  name: 'Celestial Alignment',
  channel_duration: 0,
  effect_duration: 15,
  cooldown: 30,
  charges: 2,
}

describe('Cast class', () => {
  let cast: Cast

  const start_s = 10

  beforeEach(() => {
    const params: CastParams = {
      id: 'cast-1',
      spell: caSpellInfo,
      start_s: start_s,
    }
    cast = new Cast(params)
  })

  test('should initialize with correct values', () => {
    expect(cast.id).toBe('cast-1')
    expect(cast.spell).toBe(caSpellInfo)
    expect(cast.start_s).toBe(start_s)
    expect(cast.interrupting_cast).toBeNull()
    expect(cast.current_charge).toBe(0)
    expect(cast.cooldown_duration).toBe(30)
    expect(cast.cooldown_delay_s).toBe(0)
    expect(cast.effect_length).toBe(15)
    expect(cast.channel_duration).toBe(0)
  })

  test('should calculate channel start time correctly', () => {
    expect(cast.channel_start_s).toBe(start_s) // Should be the same as start_s since the channel starts immediately
  })

  test('should calculate channel duration correctly', () => {
    expect(cast.channel_duration).toBe(0) // CA has no channel
  })

  test('should calculate effect start time correctly with a 0s channel', () => {
    expect(cast.effect_start_s).toBe(start_s) // start_s + channel_duration_s (which is 0)
  })

  test('should calculate effect duration correctly with a 0s channel', () => {
    expect(cast.effect_duration).toBe(15) // effect_duration_s - channel_duration_s
  })

  test('should calculate cooldown start time correctly with a 0s channel and 0s cooldown delay', () => {
    expect(cast.cooldown_start_s).toBe(start_s) // start_s
  })

  test('should calculate cooldown correctly', () => {
    expect(cast.cooldown_duration).toBe(30) // spell.cooldown
  })

  test('should calculate end time correctly', () => {
    expect(cast.end_s).toBe(start_s + 30) // start_s + cooldown_s + cooldown_delay_s
    expect(cast.end_s).toBe(start_s + cast.duration_s) // start_s + cooldown_s + cooldown_delay_s
  })

  test('should handle custom channel duration', () => {
    const paramsWithChannel: CastParams = {
      id: 'cast-3',
      spell: caSpellInfo,
      start_s: start_s,
    }
    const castWithChannel = new Cast(paramsWithChannel)
    castWithChannel.channel_duration = 2

    expect(castWithChannel.channel_duration).toBe(2)
    expect(castWithChannel.effect_start_s).toBe(start_s) // start_s + channel_duration_s
  })

  test('should handle interrupting cast', () => {
    // Create a cast that will be interrupted
    const firstCast = new Cast({
      id: 'first-cast',
      spell: caSpellInfo,
      start_s: start_s,
    })

    // Create a cast that interrupts the first one
    const interruptingCast = new Cast({
      id: 'interrupting-cast',
      spell: caSpellInfo,
      start_s: start_s + 2,
    })

    firstCast.interrupt(interruptingCast)

    expect(firstCast.interrupting_cast).toBe(interruptingCast)
  })

  test('should handle charge tracking', () => {
    const castWithCharge = new Cast({
      id: 'cast-with-charge',
      spell: caSpellInfo,
      start_s: start_s,
      current_charge: 1,
    })

    expect(castWithCharge.current_charge).toBe(1)
  })

  test('should handle channel being bigger than effect', () => {
    const castWithCharge = new Cast({
      id: 'cast-with-charge',
      spell: caSpellInfo,
      start_s: start_s,
    })
    castWithCharge.channel_duration = 20
    expect(castWithCharge.effect_duration).toBe(15)
    expect(castWithCharge.channel_duration).toBe(20)
    expect(castWithCharge.cooldown_start_s).toBe(start_s)
    expect(castWithCharge.duration_s).toBe(30)
  })

  test('should update properties when setters are used', () => {
    cast.channel_duration = 3
    expect(cast.channel_duration).toBe(3)
    expect(cast.effect_start_s).toBe(start_s)
    expect(cast.effect_duration).toBe(15)
    // Other things are not changed
    expect(cast.cooldown_duration).toBe(30)
    expect(cast.cooldown_start_s).toBe(start_s)
    expect(cast.duration_s).toBe(30)
    expect(cast.duration_s).toBe(30)

    cast.effect_duration = 20
    expect(cast.effect_duration).toBe(20)
    expect(cast.cooldown_start_s).toBe(start_s) // cd start is updated since it's start_s + max(effect_duration, channel_duration)
    expect(cast.duration_s).toBe(30) //duration is not changed

    cast.cooldown_duration = 45
    expect(cast.cooldown_duration).toBe(45)
    expect(cast.duration_s).toBe(45) // duration is updated
  })
})
