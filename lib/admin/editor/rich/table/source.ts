const TABLE_DELIMITER = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/

/** Markdown table -> rows of raw cell text, header first */
export function parseTable(src: string): string[][] {
  const rows = src
    .split('\n')
    .filter((l) => l.trim() && !TABLE_DELIMITER.test(l))
    .map((l) =>
      l
        .trim()
        .replace(/^\|/, '')
        .replace(/(?<!\\)\|$/, '')
        .split(/(?<!\\)\|/)
        .map((c) => c.trim().replace(/\\\|/g, '|'))
    )
  const cols = Math.max(...rows.map((r) => r.length))
  return rows.map((r) => [...r, ...Array(cols - r.length).fill('')])
}

interface CellSpan {
  /** Trimmed cell text, or an empty range between its pipes */
  from: number
  to: number
}

/** Source offsets of each cell, rows aligned with parseTable */
export function tableCells(src: string): { cells: CellSpan[]; end: number; piped: boolean }[] {
  const rows: { cells: CellSpan[]; end: number; piped: boolean }[] = []
  let base = 0
  for (const line of src.split('\n')) {
    const at = base
    base += line.length + 1
    if (!line.trim() || TABLE_DELIMITER.test(line)) continue
    const lead = line.length - line.trimStart().length
    const trail = line.trimEnd().length
    const bars = [...line.matchAll(/(?<!\\)\|/g)].map((m) => m.index ?? 0)
    const piped = bars[bars.length - 1] === trail - 1 && trail - 1 > lead
    const edges = [
      bars[0] === lead ? lead : lead - 1,
      ...bars.filter((b) => b !== lead && b !== trail - 1),
    ]
    edges.push(piped ? trail - 1 : trail)
    const cells: CellSpan[] = []
    for (let i = 0; i + 1 < edges.length; i++) {
      const a = edges[i] + 1
      const slice = line.slice(a, edges[i + 1])
      const text = slice.trim()
      const from = text ? a + slice.indexOf(text) : a
      cells.push({ from: at + from, to: at + from + text.length })
    }
    rows.push({ cells, end: at + trail, piped })
  }
  return rows
}

/** Cell text as table source: one line, pipes escaped */
export const cellSource = (text: string) =>
  text
    .replace(/\s*\n\s*/g, ' ')
    .trim()
    .replace(/(?<!\\)\|/g, '\\|')
