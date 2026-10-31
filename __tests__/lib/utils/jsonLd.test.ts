import { jsonLdHtml } from '@/lib/utils/jsonLd'

describe('jsonLdHtml', () => {
  it('keeps a frontmatter title from closing the script tag', () => {
    const title = '</script><script>alert(1)</script>'
    const html = jsonLdHtml({ headline: title })
    expect(html).not.toContain('<')
    expect(JSON.parse(html).headline).toBe(title)
  })
})
