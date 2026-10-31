/**
 * JSON-LD for a `<script type="application/ld+json">` tag's innerHTML. JSON.stringify
 * leaves `<` alone, so a frontmatter title like `</script><script>…` would close the tag
 * and run as script; `<` reads back as the same character in JSON.
 */
export const jsonLdHtml = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')
