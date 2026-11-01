import { createHash } from 'crypto'
import spellsData from '@/other/timelineSpells.json'
import { bindings } from '@/lib/talent_handlers/bindings'
import { buildKeysToTalents } from '@/lib/talent_handlers/keysToTalents'
import { generateBaseQueue, processEventQueue } from '@/lib/timeline_events/processEventQueue'
import type { SpellInfo } from '@/types/timeline'

const spells = (spellsData.spells as SpellInfo[]).map((s) => ({
  ...s,
  charges: s.charges || 1,
  can_interrupt: s.can_interrupt ?? true,
}))

// Every spec's spells cast repeatedly with all, half and none of its talents.
function simulate(spec: string, talentFilter: (index: number) => boolean) {
  const specSpells = structuredClone(spells).filter((s) => s.specs?.includes(spec))
  const talents = bindings
    .filter((b) => b.specs.includes(spec))
    .map((b) => b.id)
    .filter((_, i) => talentFilter(i))
  const actions = specSpells.flatMap((spell, i) =>
    [0, 7, 31, 62, 95, 140, 200].map((t, j) => ({
      spell,
      instant: t + i * 1.3,
      id: `${spell.spellId}-${j}`,
    }))
  )
  const { processedState, processedEvents } = processEventQueue(
    generateBaseQueue(actions),
    specSpells,
    buildKeysToTalents(talents, specSpells),
    talents
  )
  return {
    length: processedState.timeline_length_s,
    rows: processedState.spells
      .map((row) => ({
        id: row.spell.spellId,
        used: row.chargesUsed,
        casts: row.casts.map((c) => [
          c.start_s,
          c.effect_duration,
          c.channel_duration,
          c.cooldown_duration,
          c.cooldown_delay_s,
          c.is_interruped,
        ]),
      }))
      .sort((a, b) => a.id - b.id),
    events: processedEvents.map((e) => [e.type, e.time, e.spellId, e.castId]),
  }
}

describe('processEventQueue', () => {
  test("doesn't carry one run's talent changes into the next", () => {
    const once = simulate('balance', () => true)
    const again = simulate('balance', () => true)
    expect(again).toEqual(once)
  })

  // A fingerprint of the whole simulation. When a change to the simulator, the
  // spell data or a talent is intended, update it with `pnpm test -u`.
  test('output is unchanged', () => {
    const runs = ['balance', 'resto', 'feral', 'guardian'].flatMap((spec) => [
      simulate(spec, () => true),
      simulate(spec, (i) => i % 2 === 0),
      simulate(spec, () => false),
    ])
    const hash = createHash('sha256').update(JSON.stringify(runs)).digest('hex')
    expect(hash).toMatchInlineSnapshot(
      `"b76ba37a69997d8d47ed34941b6fb852c6311383ef0e96f187e2f50a48cdf50c"`
    )
  })
})
