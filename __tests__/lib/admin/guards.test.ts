import { safeLocalPath } from '@/lib/admin/content'
import { matchesImageType } from '@/lib/admin/imageUploads'

describe('safeLocalPath', () => {
  it.each(['/blog/balance/compendium', '/blog/x?y=1#top', '/'])('keeps %s', (path) => {
    expect(safeLocalPath(path)).toBe(path)
  })

  it.each([
    undefined,
    '',
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    '/\t/evil.com',
    '/\n/evil.com',
    'javascript:alert(1)',
  ])('rejects %j', (path) => {
    expect(safeLocalPath(path)).toBeUndefined()
  })
})

describe('matchesImageType', () => {
  const bytes = (...values: (number | string)[]) =>
    Uint8Array.from(
      values.flatMap((v) => (typeof v === 'string' ? [...v].map((c) => c.charCodeAt(0)) : [v]))
    )

  it('accepts files whose bytes match their extension', () => {
    expect(matchesImageType('/a.png', bytes(0x89, 'PNG', 0x0d, 0x0a))).toBe(true)
    expect(matchesImageType('/a.jpg', bytes(0xff, 0xd8, 0xff, 0xe0))).toBe(true)
    expect(matchesImageType('/a.gif', bytes('GIF89a'))).toBe(true)
    expect(matchesImageType('/a.webp', bytes('RIFF', 0, 0, 0, 0, 'WEBP'))).toBe(true)
  })

  it('rejects anything else', () => {
    expect(matchesImageType('/a.png', bytes('<svg onload=alert(1)>'))).toBe(false)
    expect(matchesImageType('/a.jpg', bytes(0x89, 'PNG'))).toBe(false)
    expect(matchesImageType('/a.svg', bytes('<svg>'))).toBe(false)
  })
})
