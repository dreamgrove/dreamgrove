import { describe, test, expect } from 'vitest'
import { parseTalentString } from '@/lib/talents/parseTalentString'

// Real exports from the guides. The counts were taken from the previous string-based
// parser, so a change here means the decoding changed, not just the code.
const BALANCE =
  'CYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWoMaGjZG4BMLzMzMDzwwsNzyYZYGbmlZWGzMDbYYAGgttxGmmZWGAAAAsZmZmZwmBGzAYmBAGA'
const RESTO =
  'CkGADBD3hSPCL9Y9gz68WcKvMMjxMLzMjZmxsNMYmFjNmBAAAAAAAAAALQzmZMNzAjZZMzMzihHYAAAAAAAAgttxCmmZWGAAz2MLNbzsZjZmZGmZgRzAgZmZGAGA'

describe('parseTalentString', () => {
  test.each([
    [
      BALANCE,
      { specId: 102, classCount: 34, specCount: 28, heroCount: 14, choices: 15, hero: 94591 },
    ],
    [
      RESTO,
      { specId: 105, classCount: 33, specCount: 30, heroCount: 14, choices: 17, hero: 94621 },
    ],
  ])('decodes %s', (talents, expected) => {
    const result = parseTalentString(talents)
    expect(result.error).toBeNull()
    expect(result.specId).toBe(expected.specId)
    expect(result.selectedClassNodes).toHaveLength(expected.classCount)
    expect(result.selectedSpecNodes).toHaveLength(expected.specCount)
    expect(result.selectedHeroNodes).toHaveLength(expected.heroCount)
    expect(Object.keys(result.nodeChoices)).toHaveLength(expected.choices)
    expect(result.selectedHeroNodes[0]).toBe(expected.hero)
  })

  test('reports a missing string', () => {
    expect(parseTalentString('').error).toBe('No talent string provided')
  })

  test('reports an unknown spec', () => {
    expect(parseTalentString('AAAA').error).toMatch(/spec ID/)
  })
})
