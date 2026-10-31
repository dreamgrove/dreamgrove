'use client'

import { useState } from 'react'
import { BLOCKS, type BlockCategory, type BlockDef } from '@/lib/admin/editor/blocks/registry'
import Dialog from '@/components/admin/ui/Dialog'
import Icon from '@/components/Icon'

const CATEGORIES: BlockCategory[] = [
  'Spells and Talents',
  'Structural',
  'Conditionals',
  'Spells & items',
  'Media',
]

const matches = (b: BlockDef, q: string) =>
  !q || [b.label, b.description, b.tag ?? ''].some((s) => s.toLowerCase().includes(q))

export default function BlockPalette({
  filePath,
  onPick,
  onClose,
}: {
  filePath: string
  onPick: (block: BlockDef) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<BlockCategory | null>(null)
  const q = query.trim().toLowerCase()
  const available = BLOCKS.filter((b) => !b.hidden && (!b.pages || b.pages.test(filePath)))
  const shown = available.filter((b) => matches(b, q) && (!category || b.category === category))
  const number = (b: BlockDef) => String(available.indexOf(b) + 1).padStart(2, '0')

  return (
    <Dialog
      title="Insert component"
      subtitle="Choose between all available custom components"
      onClose={onClose}
      width="max-w-[900px]"
      height="h-[680px]"
      bodyClassName="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)]"
    >
      <nav className="hidden flex-col gap-0.5 border-r border-[#383838] px-2.5 py-3.5 sm:flex">
        {[null, ...CATEGORIES].map((cat) => {
          const active = category === cat
          return (
            <button
              key={cat ?? 'all'}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex items-center rounded-md px-3 py-2 text-left text-[.875rem] font-semibold transition-colors hover:text-white ${
                active ? 'bg-[#333] text-white' : 'text-[#a3a3a3]'
              }`}
            >
              {cat ?? 'All components'}
            </button>
          )
        })}
      </nav>
      <div className="flex min-h-0 flex-col">
        <div className="px-[18px] pt-3.5 pb-2.5">
          <label className="flex h-[38px] items-center gap-2.5 rounded-md border border-[#3d3d3d] bg-[#1c1c1c] px-3 focus-within:border-[#d57f43]">
            <span className="text-[#7a7a7a]">
              <Icon box name="search" size={14} />
            </span>
            <input
              id="block-search"
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && shown[0] && onPick(shown[0])}
              placeholder="Search components…"
              aria-label="Search components"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[.875rem] text-[#f5f5f5] placeholder-[#7a7a7a] focus:ring-0 focus:outline-none"
            />
          </label>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-[18px] pt-1 pb-[18px]">
          {CATEGORIES.map((cat) => {
            const items = shown.filter((b) => b.category === cat)
            if (!items.length) return null
            return (
              <section key={cat} className="flex flex-col gap-1.5">
                <h3 className="m-0 px-0.5 pb-0.5 text-[.9375rem] font-semibold text-white">
                  {cat}
                </h3>
                {items.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onPick(b)}
                    className="flex flex-col gap-0.5 rounded-[4px] border border-[#383838] bg-[#2a2a2a] px-3.5 py-2.5 text-left transition-colors hover:border-[#4a4a4a] hover:bg-[#303030] focus-visible:border-[#d57f43] focus-visible:outline-none"
                  >
                    <span className="text-[.9375rem] font-semibold text-white">
                      <span className="text-[#7a7a7a]">{number(b)}.</span> {b.label}
                    </span>
                    <span className="truncate text-[.8125rem] text-[#a3a3a3]">{b.description}</span>
                  </button>
                ))}
              </section>
            )
          })}
          {shown.length === 0 && (
            <p className="m-0 py-10 text-center text-[.875rem] text-[#8a8a8a]">
              No components match your search.
            </p>
          )}
        </div>
      </div>
    </Dialog>
  )
}
