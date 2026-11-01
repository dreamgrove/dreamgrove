import { Decoration, type DecorationSet } from '@codemirror/view'
import type { EditorState, Range, Text } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { IterMode, type Tree } from '@lezer/common'
import { findAllTags } from '../blocks/tags'
import { scanHtml } from './html'
import type { Span } from '../caretRange'
import type { HandlersRef } from './types'
import { createContext } from './context'
import { htmlBlocks } from './passes/htmlBlocks'
import { components } from './passes/components'
import { inlineHtml } from './passes/inlineHtml'
import { inlineSyntax } from './passes/inlineSyntax'
import { markdown } from './passes/markdown'
import { layout } from './passes/layout'

export interface Built {
  deco: DecorationSet
  atomic: DecorationSet
  /** Hidden ranges at a line start (heading/quote/list markers): start → end */
  leads: Map<number, number>
  /** Full-line block widgets (cards, section edges), in document order */
  blocks: [number, number][]
  /** Opening/closing tag lines of a wrapper → the wrapper's whole range */
  wrappers: Map<number, [number, number]>
}

// A caret move rebuilds the decorations too, but these scans only depend on the
// text and the parse tree, so they are reused until either changes.
const textScans = new WeakMap<Text, { text: string; tags: ReturnType<typeof findAllTags> }>()
const treeScans = new WeakMap<
  Tree,
  { doc: Text; code: [number, number][]; html: ReturnType<typeof scanHtml> }
>()

function scanText(doc: Text) {
  let scan = textScans.get(doc)
  if (!scan) {
    const text = doc.toString()
    scan = { text, tags: findAllTags(text) }
    textScans.set(doc, scan)
  }
  return scan
}

function scanTree(doc: Text, text: string, tree: Tree) {
  let scan = treeScans.get(tree)
  if (!scan || scan.doc !== doc) {
    // Code first: nothing inside it is rendered
    const code: [number, number][] = []
    tree.iterate({
      mode: IterMode.IgnoreMounts,
      enter(n) {
        if (n.name === 'FencedCode' || n.name === 'CodeBlock' || n.name === 'InlineCode') {
          code.push([n.from, n.to])
          return false
        }
      },
    })
    const html = scanHtml(text, (from, to) => code.some(([a, b]) => from < b && to > a))
    scan = { doc, code, html }
    treeScans.set(tree, scan)
  }
  return scan
}

export function build(state: EditorState, revealed: Span, h: HandlersRef): Built {
  const { text, tags } = scanText(state.doc)
  const tree = syntaxTree(state)
  const scan = scanTree(state.doc, text, tree)

  const ctx = createContext(state, text, revealed, h)
  ctx.code.push(...scan.code)

  const { tokens, pairs } = scan.html
  const { htmlRaw, htmlEdges } = htmlBlocks(ctx, pairs)
  components(ctx, tags)
  inlineHtml(ctx, tokens, pairs)
  inlineSyntax(ctx)
  markdown(ctx, tree, htmlRaw)
  layout(ctx, htmlEdges)

  // Overlapping replacements can't coexist; the earliest (then widest) wins
  ctx.reps.sort((a, b) => a.from - b.from || b.to - a.to)
  const kept: Range<Decoration>[] = []
  const leads = new Map<number, number>()
  const blocks: [number, number][] = []
  let end = -1
  for (const r of ctx.reps) {
    if (r.from < end) continue
    end = r.to
    kept.push(r.deco.range(r.from, r.to))
    if (r.lead) leads.set(r.from, r.to)
    if (r.deco.spec.block) blocks.push([r.from, r.to])
  }

  return {
    deco: Decoration.set([...kept, ...ctx.others], true),
    atomic: Decoration.set(kept, true),
    leads,
    blocks,
    wrappers: ctx.wrappers,
  }
}
