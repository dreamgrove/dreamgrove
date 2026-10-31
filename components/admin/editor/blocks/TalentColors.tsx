'use client'

import { TALENT_COLORS, type TalentColor } from '@/lib/admin/editor/blocks/registry'
import { TEXT_COLORS } from '@/lib/admin/palette'
import Icon from '@/components/Icon'
import { INPUT } from '@/components/admin/ui/styles'
import ChipInput from './ChipInput'

const SWATCH: Record<string, string> = { ...TEXT_COLORS, white: '#e8e8e8' }

export default function TalentColors({
  value,
  onChange,
}: {
  value: TalentColor[]
  onChange: (v: TalentColor[]) => void
}) {
  const update = (i: number, patch: Partial<TalentColor>) =>
    onChange(value.map((c, j) => (j === i ? { ...c, ...patch } : c)))
  const unused = TALENT_COLORS.find((c) => !value.some((v) => v.color === c)) ?? 'red'

  return (
    <div className="flex flex-col gap-2">
      {value.map((c, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 rounded-[4px] border border-[#383838] bg-[#2a2a2a] p-1.5"
        >
          <div className="flex items-center gap-2 pl-1">
            <span className="font-mono text-[.75rem] text-[#7a7a7a]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="relative w-[9rem]">
              <span
                className="pointer-events-none absolute top-1/2 left-2.5 h-3 w-3 -translate-y-1/2 rounded-[3px]"
                style={{ background: SWATCH[c.color] ?? c.color }}
              />
              <select
                aria-label="Colour"
                value={c.color}
                onChange={(e) => update(i, { color: e.target.value })}
                className={`${INPUT} !h-8 pl-7 text-[.82rem] capitalize`}
              >
                {!TALENT_COLORS.includes(c.color) && <option value={c.color}>{c.color}</option>}
                {TALENT_COLORS.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[.75rem] text-[#7a7a7a]">
              {c.nodes.length} {c.nodes.length === 1 ? 'node' : 'nodes'}
            </span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label="Remove colour group"
              className="ml-auto flex h-8 w-7 items-center justify-center text-[#8a8a8a] hover:text-white"
            >
              <Icon box name="close" size={14} />
            </button>
          </div>
          <ChipInput
            id={`tc-${i}`}
            value={c.nodes}
            onChange={(nodes) => update(i, { nodes })}
            suggest="talents"
            placeholder="Talent names…"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { color: unused, nodes: [] }])}
        className="inline-flex items-center gap-2 self-start px-0.5 py-1.5 text-[.875rem] font-medium text-[#d4d4d4] hover:text-white"
      >
        <Icon box name="plusCircle" size={18} />
        Add colour group
      </button>
    </div>
  )
}
