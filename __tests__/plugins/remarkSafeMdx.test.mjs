import { test } from 'vitest'
import assert from 'node:assert/strict'
import { compile } from '@mdx-js/mdx'
import remarkMath from 'remark-math'
import remarkSafeMdx, { isSafeUrl } from '../../plugins/remarkSafeMdx.js'

const check = (source) => compile(source, { remarkPlugins: [remarkMath, remarkSafeMdx] })

const REJECTED = [
  '{process.env.NEXTAUTH_SECRET}',
  'text {globalThis.process} text',
  'export const a = 1',
  // Same shape as the export mdx-bundler generates, but written in the file
  'export const frontmatter = process.env',
  'import fs from "fs"',
  '<img onError={() => fetch("//evil")} />',
  '<Talents spellId={fetch()} />',
  '<Talents spellIds={[1, ...x]} />',
  '<Talents name={`${x}`} />',
  '<Talents x={[1].map(String)} />',
  '<Checkbox {...props} />',
  '<a href="javascript:alert(1)">x</a>',
  '<a href={"java\\tscript:alert(1)"}>x</a>',
  '<img src="data:text/html,x" />',
  '[x](javascript:alert(1))',
  '<Foo.Bar />',
  '<script>alert(1)</script>',
  '<iframe src="https://evil" />',
  '<div style={{ color: "red" }} />',
  '<div dangerouslySetInnerHTML={{ __html: "x" }} />',
]

const ACCEPTED = [
  '<Talents spellIds={[5176, -2]} />',
  '<Talents name={"Moonfire"} talents={"abc"} />',
  '<Talents colors={["red", "blue"]} o={{ a: 1, "b": [true, null] }} />',
  '<div className="x"><span>hi</span></div>',
  '<details><summary>a</summary>b</details>',
  '{/* a comment */}',
  '<a href="/blog/balance">x</a> [y](https://www.wowhead.com) [z](#top)',
  '$$\n\\text{(1\\% gain)}\n$$',
  '<>fragment</>',
]

for (const source of REJECTED) {
  test(`rejects ${source}`, async () => {
    await assert.rejects(check(source), /Not allowed in guides/)
  })
}

for (const source of ACCEPTED) {
  test(`accepts ${source}`, async () => {
    await check(source)
  })
}

test('isSafeUrl ignores case and control characters in the scheme', () => {
  assert.equal(isSafeUrl(' JaVa\nScRipt:alert(1)'), false)
  assert.equal(isSafeUrl('vbscript:x'), false)
  assert.equal(isSafeUrl('/blog/x'), true)
  assert.equal(isSafeUrl('mailto:a@b.c'), true)
})
