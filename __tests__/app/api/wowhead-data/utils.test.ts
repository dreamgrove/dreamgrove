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

  test('ignores the query string', () => {
    expect(
      parseWowheadUrl('https://www.wowhead.com/item=271887/liquid-luster?crafting-quality=5')
    ).toEqual({ type: 'item', id: '271887', slug: 'liquid-luster' })
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

  test('accepts the bare host', () => {
    expect(parseWowheadUrl('https://wowhead.com/spell=5217/tigers-fury')?.id).toBe('5217')
  })

  test('skips leading ptr and beta segments', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/ptr/item=270169/some-trinket')).toEqual({
      type: 'item',
      id: '270169',
      slug: 'some-trinket',
    })
    expect(parseWowheadUrl('https://www.wowhead.com/beta/spell=1822')?.type).toBe('spell')
  })

  test('rejects non-wowhead hosts', () => {
    expect(parseWowheadUrl('https://example.com/item=1')).toBeNull()
    expect(parseWowheadUrl('https://wowhead.com.example.com/item=1')).toBeNull()
    expect(parseWowheadUrl('https://notwowhead.com/item=1')).toBeNull()
  })

  test('rejects wowhead urls that are not item/spell/npc pages', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/guide/classes/druid/balance')).toBeNull()
    expect(parseWowheadUrl('https://www.wowhead.com/achievement=1234/some-feat')).toBeNull()
  })

  test('rejects a malformed or missing id', () => {
    expect(parseWowheadUrl('https://www.wowhead.com/spell=')).toBeNull()
    expect(parseWowheadUrl('https://www.wowhead.com/spell=abc/name')).toBeNull()
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
  })
})

describe('formatUrl', () => {
  test('title-cases the slug', () => {
    expect(formatUrl('https://www.wowhead.com/item=271887/liquid-luster?crafting-quality=5')).toBe(
      'Liquid Luster'
    )
  })

  test('falls back to type-id when there is no slug', () => {
    expect(formatUrl('https://www.wowhead.com/item=271884')).toBe('item-271884')
  })
})
