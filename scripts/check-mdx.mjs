// Compiles guides with remarkSafeMdx to catch disallowed MDX (expressions, imports,
// event handlers, unknown tags) without a full build. Used by CI.
//   node scripts/check-mdx.mjs                 every data/**/*.mdx
//   node scripts/check-mdx.mjs data/a.mdx …    just these
import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkSafeMdx from '../plugins/remarkSafeMdx.js'

function listMdx(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMdx(full)
    return entry.name.endsWith('.mdx') ? [full] : []
  })
}

// Blanks the frontmatter (contentlayer strips it before compiling) but keeps its
// lines, so reported line numbers match the file
function withoutFrontmatter(source) {
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/)
  return match ? match[0].replace(/[^\n]/g, '') + source.slice(match[0].length) : source
}

const files = process.argv.length > 2 ? process.argv.slice(2) : listMdx('data')
let failed = 0

for (const file of files) {
  try {
    await compile(withoutFrontmatter(readFileSync(file, 'utf8')), {
      remarkPlugins: [remarkGfm, remarkMath, remarkSafeMdx],
    })
  } catch (err) {
    failed++
    const where = err.line ? `:${err.line}:${err.column}` : ''
    console.error(`${file}${where}: ${err.reason ?? err.message}`)
  }
}

console.log(`${files.length - failed}/${files.length} MDX files passed`)
process.exit(failed ? 1 : 0)
