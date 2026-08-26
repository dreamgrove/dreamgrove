import {
  parseWowheadUrl,
  extractIdFromUrl,
  formatUrl,
} from '../../../../app/api/wowhead-data/utils'
import { describe, test, expect } from '@jest/globals'

describe('parseWowheadUrl', () => {
  test('parses a url with a slug', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/item=271887/liquid-luster')).toEqual({
      type: 'item',
      id: '271887',
      slug: 'liquid-luster',
    })
  })

  test('parses a url without a slug', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/item=271884')).toEqual({
      type: 'item',
      id: '271884',
      slug: '',
    })
  })

  test('takes the segment right after the id, not the last one', () => {
    // This shape is in the content today, in raids/liberation_of_undermine.mdx.
    expect(
      parseWowheadUrl('https://www.wowhead.com/npc=234557/support-rig/mythic-encounter-journal')
    ).toEqual({ type: 'npc', id: '234557', slug: 'support-rig' })
  })

  test('ignores the query string', () => {
    expect(
      parseWowheadUrl('https://www.wowhead.com/item=271887/liquid-luster?crafting-quality=5')
    ).toEqual({ type: 'item', id: '271887', slug: 'liquid-luster' })
  })

  test('ignores the hash', () => {
    expect(
      parseWowheadUrl('https://www.wowhead.com/item=222448/charged-halberd#created-by-spell')
    ).toEqual({ type: 'item', id: '222448', slug: 'charged-halberd' })
  })

  test('accepts localized hosts', () => {
    expect(parseWowheadUrl('https://ko.wowhead.com/spell=1822/rake')).toEqual({
      type: 'spell',
      id: '1822',
      slug: 'rake',
    })
    expect(parseWowheadUrl('https://de.wowhead.com/npc=12345')).toEqual({
      type: 'npc',
      id: '12345',
      slug: '',
    })
  })

  test('decodes a non-ascii slug, which is what localized hosts actually serve', () => {
    expect(
      parseWowheadUrl('https://ko.wowhead.com/spell=1822/%ED%95%A0%ED%80%B4%EA%B8%B0')
    ).toEqual({ type: 'spell', id: '1822', slug: '할퀴기' })
  })

  test('keeps a malformed escape as-is rather than throwing', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/spell=1822/%E0%A4%A')).toEqual({
      type: 'spell',
      id: '1822',
      slug: '%E0%A4%A',
    })
  })

  test('accepts the bare host', () => {
    expect(parseWowheadUrl('https://wowhead.com/spell=5217/tigers-fury')).toEqual({
      type: 'spell',
      id: '5217',
      slug: 'tigers-fury',
    })
  })

  test('is not confused by any prefix segment, not just ptr and beta', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/ptr/item=270169/some-trinket')).toEqual({
      type: 'item',
      id: '270169',
      slug: 'some-trinket',
    })
    // `ptr-2` appears in the content too, so the rule has to be "scan", not
    // "skip a known list of prefixes".
    expect(parseWowheadUrl('https://www.wowhead.com/ptr-2/spell=1822')).toEqual({
      type: 'spell',
      id: '1822',
      slug: '',
    })
    expect(parseWowheadUrl('https://www.wowhead.com/beta/spell=1822')).toEqual({
      type: 'spell',
      id: '1822',
      slug: '',
    })
  })

  test('rejects non-wowhead hosts', () => {
    expect(parseWowheadUrl('https://example.com/item=1')).toBeNull()
    expect(parseWowheadUrl('https://wowhead.com.example.com/item=1')).toBeNull()
    expect(parseWowheadUrl('https://notwowhead.com/item=1')).toBeNull()
  })

  test('rejects wowhead urls that are not item/spell/npc pages', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/guide/classes/druid/balance')).toBeNull()
    expect(parseWowheadUrl('https://www.wowhead.com/achievement=1234/some-feat')).toBeNull()
    // Must not match on a prefix: `item-set` is its own type.
    expect(parseWowheadUrl('https://www.wowhead.com/item-set=1694/some-set')).toBeNull()
  })

  test('rejects a malformed or missing id', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/spell=')).toBeNull()
    expect(parseWowheadUrl('https://www.wowhead.com/spell=abc/name')).toBeNull()
    // Digits followed by anything else must not sneak through a numeric coercion.
    expect(parseWowheadUrl('https://www.wowhead.com/spell=123abc/name')).toBeNull()
  })

  test('rejects values that are not absolute urls', () => {
    expect(parseWowheadUrl('/blog/balance/compendium')).toBeNull()
    expect(parseWowheadUrl('#anchor')).toBeNull()
    expect(parseWowheadUrl('')).toBeNull()
  })
})

describe('extractIdFromUrl', () => {
  test('returns the id whether or not a slug is present', () => {
    expect(extractIdFromUrl('https://www.wowhead.com/spell=1279599/rune-of-the-umbral-owl')).toBe(
      '1279599'
    )
    expect(extractIdFromUrl('https://www.wowhead.com/spell=1279599')).toBe('1279599')
  })

  test('returns an empty string when there is no id to find', () => {
    expect(extractIdFromUrl('https://example.com/spell=1')).toBe('')
    // A wowhead URL with an unusable id lands here too. Callers must not build
    // a cache key or a tooltip URL out of the result without checking it.
    expect(extractIdFromUrl('https://www.wowhead.com/spell=')).toBe('')
  })
})

describe('formatUrl', () => {
  test('title-cases the slug', () => {
    expect(formatUrl('https://www.wowhead.com/item=271887/liquid-luster?crafting-quality=5')).toBe(
      'Liquid Luster'
    )
  })

  test('decodes a non-ascii slug', () => {
    expect(formatUrl('https://ko.wowhead.com/spell=1822/%ED%95%A0%ED%80%B4%EA%B8%B0')).toBe(
      '할퀴기'
    )
  })

  test('falls back to type-id when there is no slug', () => {
    expect(formatUrl('https://www.wowhead.com/item=271884')).toBe('item-271884')
  })

  test('falls back to the last path segment for anything it cannot parse', () => {
    expect(formatUrl('https://www.wowhead.com/currency=3226/valorstones')).toBe('Valorstones')
    expect(formatUrl('https://example.com/some/other-page')).toBe('Other Page')
  })
})
