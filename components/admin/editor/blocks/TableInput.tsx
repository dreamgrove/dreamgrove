'use client'

import { emptyTable } from '@/lib/admin/editor/blocks/form'
import { INPUT, LABEL } from '@/components/admin/ui/styles'

const MAX_TABLE_ROWS = 50
const MAX_TABLE_COLS = 12

export default function TableInput({
  value,
  onChange,
}: {
  value: string[][]
  onChange: (v: string[][]) => void
}) {
  const rows = value.length
  const cols = value[0]?.length ?? 0

  const resize = (nextRows: number, nextCols: number) => {
    const r = Math.max(1, Math.min(MAX_TABLE_ROWS, nextRows || 1))
    const c = Math.max(1, Math.min(MAX_TABLE_COLS, nextCols || 1))
    const blank = emptyTable(r, c)
    onChange(blank.map((row, i) => row.map((cell, j) => value[i]?.[j] ?? cell)))
  }

  const setCell = (r: number, c: number, text: string) =>
    onChange(value.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? text : cell)) : row)))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3">
        <label className="w-24">
          <span className={LABEL}>Columns</span>
          <input
            type="number"
            min={1}
            max={MAX_TABLE_COLS}
            value={cols}
            onChange={(e) => resize(rows, Number(e.target.value))}
            className={INPUT}
          />
        </label>
        <label className="w-24">
          <span className={LABEL}>Rows</span>
          <input
            type="number"
            min={1}
            max={MAX_TABLE_ROWS}
            value={Math.max(0, rows - 1)}
            onChange={(e) => resize(Number(e.target.value) + 1, cols)}
            className={INPUT}
          />
        </label>
      </div>
      <div className="overflow-x-auto rounded-md border border-[#383838]">
        <table className="m-0 w-full border-collapse text-[.86rem]">
          <tbody>
            {value.map((row, r) => (
              <tr key={r} className={r === 0 ? 'bg-[#2a2a2a]' : 'bg-[#1c1c1c]'}>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className="min-w-[7rem] border-r border-b border-[#383838] p-0 last:border-r-0"
                  >
                    <input
                      value={cell}
                      onChange={(e) => setCell(r, c, e.target.value)}
                      aria-label={r === 0 ? `Header ${c + 1}` : `Row ${r}, column ${c + 1}`}
                      placeholder={r === 0 ? `Header ${c + 1}` : ''}
                      className={`h-9 w-full border-0 bg-transparent px-2.5 text-white placeholder-white/25 focus:bg-[#2f2f2f] focus:ring-1 focus:ring-[#d57f43] focus:outline-none focus:ring-inset ${
                        r === 0 ? 'font-semibold' : ''
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
