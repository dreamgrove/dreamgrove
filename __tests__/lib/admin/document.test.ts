import { withLastmod } from '@/lib/admin/document'

describe('withLastmod', () => {
  test('adds lastmod to the frontmatter', () => {
    const page = "---\ntitle: Skyreach\ndate: '2024-10-14'\n---\n\nBody\n"
    expect(withLastmod(page, '2026-11-01')).toBe(
      "---\ntitle: Skyreach\ndate: '2024-10-14'\nlastmod: '2026-11-01'\n---\n\nBody\n"
    )
  })

  test('replaces an existing lastmod', () => {
    const page = "---\ntitle: Skyreach\nlastmod: '2025-01-01'\n---\nBody\n"
    expect(withLastmod(page, '2026-11-01')).toContain("lastmod: '2026-11-01'")
    expect(withLastmod(page, '2026-11-01')).not.toContain('2025-01-01')
  })
})
