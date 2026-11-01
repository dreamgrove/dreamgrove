'use client'

import { useId, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { useTalentNames } from '@/hooks/admin/useTalentNames'
import Icon from '@/components/Icon'
import OptionList, { useHighlight } from '@/components/admin/ui/OptionList'

/** Free-text list as chips; with `suggest`, autocompletes spell names */
export default function ChipInput({
  id,
  value,
  onChange,
  suggest,
  placeholder = 'Type and press Enter',
}: {
  id: string
  value: string[]
  onChange: (v: string[]) => void
  suggest?: 'talents'
  placeholder?: string
}) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const talentNames = useTalentNames(suggest === 'talents')
  const known = useMemo(() => new Set(talentNames.map((n) => n.toLowerCase())), [talentNames])
  const fuse = useMemo(
    () => new Fuse(talentNames, { threshold: 0.35, ignoreLocation: true }),
    [talentNames]
  )
  const results = useMemo(() => {
    const q = draft.trim()
    if (!suggest || q.length < 3) return []
    return fuse
      .search(q)
      .map((r) => r.item)
      .filter((n) => !value.includes(n))
      .slice(0, 8)
  }, [fuse, draft, value, suggest])
  const showResults = open && results.length > 0
  const { hi, setHi, arrow } = useHighlight(results.length)
  const listId = useId()
  const boxRef = useRef<HTMLDivElement>(null)

  const add = (raw: string) => {
    const items = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !value.includes(s))
    if (items.length) onChange([...value, ...items])
    setDraft('')
    setHi(0)
  }

  return (
    <div>
      <div
        ref={boxRef}
        className="flex min-h-10 flex-wrap items-center gap-1 rounded-md border border-[#3d3d3d] bg-[#1c1c1c] px-2 py-[5px] focus-within:border-main"
      >
        {value.map((v) => {
          const unknown = suggest === 'talents' && known.size > 0 && !known.has(v.toLowerCase())
          return (
            <span
              key={v}
              title={unknown ? 'No talent with this name; check the spelling' : undefined}
              className={`flex h-7 items-center gap-1 rounded-[4px] pr-0.5 pl-2 text-[.82rem] ${
                unknown
                  ? 'border border-dashed border-amber-500/60 text-amber-300'
                  : 'border border-[#444] bg-[#333] text-[#f5f5f5]'
              }`}
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== v))}
                aria-label={`Remove ${v}`}
                className="rounded-xs p-0.5 text-white/40 hover:text-white"
              >
                <Icon box name="close" size={11} />
              </button>
            </span>
          )
        })}
        <input
          id={id}
          value={draft}
          autoComplete="off"
          role={suggest ? 'combobox' : undefined}
          aria-expanded={suggest ? showResults : undefined}
          aria-controls={suggest ? listId : undefined}
          onChange={(e) => {
            setDraft(e.target.value)
            setHi(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (showResults && arrow(e)) return
            if (e.key === 'Escape' && showResults) {
              e.stopPropagation()
              setOpen(false)
            } else if ((e.key === 'Enter' || e.key === ',') && draft.trim()) {
              e.preventDefault()
              add(showResults && e.key === 'Enter' ? results[hi] : draft)
            } else if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1))
            }
          }}
          onBlur={() => {
            setOpen(false)
            if (draft.trim()) add(draft)
          }}
          placeholder={value.length ? '' : placeholder}
          className="h-7 min-w-[8rem] flex-1 border-0 bg-transparent px-1.5 py-0 text-[.9rem] text-white placeholder-[#7a7a7a] focus:ring-0 focus:outline-none"
        />
      </div>
      {showResults && (
        <OptionList
          anchor={boxRef}
          id={listId}
          items={results}
          highlighted={hi}
          itemKey={(name) => name}
          onHover={setHi}
          onPick={add}
        >
          {(name) => name}
        </OptionList>
      )}
    </div>
  )
}
