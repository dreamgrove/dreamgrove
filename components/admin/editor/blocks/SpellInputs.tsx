'use client'

import { useId, useRef, useState } from 'react'
import type { Spell } from '@/lib/admin/spells'
import { useSpellNames } from '@/hooks/admin/useSpellNames'
import { useSpellSearch } from '@/hooks/admin/useSpellSearch'
import Icon from '@/components/Icon'
import OptionList, { useHighlight } from '@/components/admin/ui/OptionList'
import { INPUT } from '@/components/admin/ui/styles'

const MAX_OPTIONS = 8
const PLACEHOLDER = 'Search spells by name or id…'
const isSpellId = (text: string) => /^\d+$/.test(text.trim())

function SpellOption({ spell }: { spell: Spell }) {
  return (
    <>
      <span className="truncate">{spell.name}</span>
      <span className="flex-shrink-0 font-mono text-[.75rem] text-white/40">
        {spell.spec ? `${spell.spec} · ` : ''}
        {spell.id}
      </span>
    </>
  )
}

function useSpellQuery(currentSpec: string | null) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = useSpellSearch(query, currentSpec).slice(0, MAX_OPTIONS)
  const highlight = useHighlight(results.length)
  const type = (text: string) => {
    setQuery(text)
    highlight.setHi(0)
    setOpen(true)
  }
  const reset = () => {
    setQuery('')
    highlight.setHi(0)
  }
  return { query, type, reset, open, setOpen, results, ...highlight }
}

/** A single spell id: a search box (until one is picked) or its name */
export function SpellInput({
  id,
  value,
  currentSpec,
  onChange,
  onPick,
}: {
  id: string
  value: string
  currentSpec: string | null
  onChange: (v: string) => void
  onPick: (spell: Spell) => void
}) {
  const names = useSpellNames()
  const search = useSpellQuery(currentSpec)
  const inputRef = useRef<HTMLInputElement>(null)

  if (value) {
    return (
      <div className="flex h-[38px] items-center justify-between gap-3 rounded-md border border-[#3d3d3d] bg-[#1c1c1c] px-3">
        <span className="min-w-0 truncate text-[.9rem]">
          <span className="font-semibold text-[#ffb86c]">
            {names.get(Number(value)) ?? 'Spell'}
          </span>
          <span className="ml-2 font-mono text-[.78rem] text-white/40">{value}</span>
        </span>
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-[.8rem] font-semibold text-white/50 hover:text-white"
        >
          Change
        </button>
      </div>
    )
  }

  const pick = (s: Spell) => {
    onChange(String(s.id))
    onPick(s)
    search.reset()
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={search.query}
        onChange={(e) => search.type(e.target.value)}
        onFocus={() => search.setOpen(true)}
        onBlur={() => setTimeout(() => search.setOpen(false), 120)}
        onKeyDown={(e) => {
          if (search.arrow(e) || e.key !== 'Enter') return
          e.preventDefault()
          const hit = search.results[search.hi]
          if (hit) pick(hit)
          else if (isSpellId(search.query)) {
            // A bare number is taken as an id without a lookup
            onChange(search.query.trim())
            search.reset()
          }
        }}
        placeholder={PLACEHOLDER}
        autoComplete="off"
        className={INPUT}
      />
      {search.open && search.results.length > 0 && (
        <OptionList
          anchor={inputRef}
          items={search.results}
          highlighted={search.hi}
          itemKey={(s) => s.id}
          onHover={search.setHi}
          onPick={pick}
        >
          {(s) => <SpellOption spell={s} />}
        </OptionList>
      )}
    </div>
  )
}

/** An ordered list of spell ids as draggable chips + a search to add more */
export function SpellList({
  id,
  value,
  currentSpec,
  onChange,
}: {
  id: string
  value: string[]
  currentSpec: string | null
  onChange: (v: string[]) => void
}) {
  const names = useSpellNames()
  const search = useSpellQuery(currentSpec)
  const dragFrom = useRef<number | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const showResults = search.open && search.results.length > 0
  const listId = useId()

  const add = (sid: string) => {
    // Repeats are allowed since a sequence can cast the same spell twice
    onChange([...value, sid])
    search.reset()
  }

  const move = (from: number, to: number) => {
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div
      ref={boxRef}
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-10 cursor-text flex-wrap items-center gap-1 rounded-md border border-[#3d3d3d] bg-[#1c1c1c] px-2 py-[5px] focus-within:border-[#d57f43]"
    >
      {value.map((sid, i) => (
        <span
          key={`${sid}-${i}`}
          draggable
          onDragStart={() => (dragFrom.current = i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragFrom.current !== null && dragFrom.current !== i) move(dragFrom.current, i)
            dragFrom.current = null
          }}
          title="Drag to reorder"
          className="flex h-7 cursor-grab items-center gap-1.5 rounded-[4px] border border-[#444] bg-[#333] pr-0.5 pl-2 text-[.82rem] active:cursor-grabbing"
        >
          <span className="font-mono text-[.7rem] text-white/30 tabular-nums">{i + 1}</span>
          <span className="text-white/85">{names.get(Number(sid)) ?? sid}</span>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            aria-label={`Remove ${names.get(Number(sid)) ?? sid}`}
            className="rounded-xs p-0.5 text-white/40 hover:text-white"
          >
            <Icon box name="close" size={11} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        value={search.query}
        autoComplete="off"
        role="combobox"
        aria-expanded={showResults}
        aria-controls={listId}
        onChange={(e) => search.type(e.target.value)}
        onFocus={() => search.setOpen(true)}
        onBlur={() => search.setOpen(false)}
        onKeyDown={(e) => {
          if (showResults && search.arrow(e)) return
          if (e.key === 'Escape' && showResults) {
            e.stopPropagation()
            search.setOpen(false)
          } else if (e.key === 'Enter') {
            e.preventDefault()
            if (showResults) add(String(search.results[search.hi].id))
            else if (isSpellId(search.query)) add(search.query.trim())
          } else if (e.key === 'Backspace' && !search.query && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        placeholder={value.length ? '' : PLACEHOLDER}
        className="h-7 min-w-[8rem] flex-1 border-0 bg-transparent px-1.5 py-0 text-[.9rem] text-white placeholder-[#7a7a7a] focus:ring-0 focus:outline-none"
      />
      {showResults && (
        <OptionList
          anchor={boxRef}
          id={listId}
          items={search.results}
          highlighted={search.hi}
          itemKey={(s) => s.id}
          onHover={search.setHi}
          onPick={(s) => add(String(s.id))}
        >
          {(s) => <SpellOption spell={s} />}
        </OptionList>
      )}
    </div>
  )
}
