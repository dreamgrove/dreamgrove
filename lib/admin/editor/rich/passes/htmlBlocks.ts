import type { BuildContext } from '../context'
import type { HtmlPair } from '../html'
import { MARK_CLASS } from '../marks'

/**
 * The outermost block-level HTML element (open and close tags on their own lines)
 * stays as source, tags included, shown as one code block.
 */
export function htmlBlocks(ctx: BuildContext, pairs: HtmlPair[]) {
  const { doc, code, lineKinds, lineClass, eachLine, lineSpan } = ctx
  // The outermost block-level element (open and close tags on their own lines)
  // stays as source, tags included, shown as one code block
  const isBlockPair = ({ open, close }: HtmlPair) =>
    !MARK_CLASS[open.name] && !!lineSpan(open.from, open.to) && !!lineSpan(close.from, close.to)
  const blockPairs = pairs.filter(isBlockPair)
  const htmlRaw: [number, number][] = []
  const htmlEdges: [number, number][] = []
  for (const { open, close } of blockPairs) {
    if (blockPairs.some((p) => p.open.from < open.from && p.close.to > close.to)) continue
    const span: [number, number] = [
      lineSpan(open.from, open.to)!.from,
      lineSpan(close.from, close.to)!.to,
    ]
    code.push(span)
    htmlRaw.push(span)
    htmlEdges.push([span[0], doc.lineAt(span[1]).from])
    eachLine(span[0], span[1], (from) => {
      lineClass(from, 'cm-rt-codeblock')
      lineKinds.set(from, { kind: 'code' })
    })
  }
  return { htmlRaw, htmlEdges }
}
