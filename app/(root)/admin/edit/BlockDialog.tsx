'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import {
  BLOCKS,
  TALENT_COLORS,
  emptyTable,
  validate,
  type BlockCategory,
  type BlockDef,
  type Field,
  type FormState,
  type TalentColor,
} from './mdxBlocks'
import { loadSpells, useSpellSearch, type Spell } from './SpellPicker'
import {
  BTN_OUTLINE,
  BTN_PRIMARY,
  CHECKBOX,
  Dialog,
  HELP,
  INPUT,
  Icon,
  LABEL,
  Popover,
  TEXTAREA,
} from './ui'
import { IMAGE_TYPES, type ImageUploads } from '@/lib/imageUploads'

const CATEGORIES: BlockCategory[] = [
  'Spells and Talents',
  'Structural',
  'Conditionals',
  'Spells & items',
  'Media',
]

const SWATCH: Record<string, string> = {
  red: '#e05555',
  yellow: '#e2c044',
  green: '#5fb760',
  white: '#e8e8e8',
  blue: '#5b9bd5',
  purple: '#a77fdc',
  orange: '#e0883f',
}

// --- Block picker -----------------------------------------------------------

const matches = (b: BlockDef, q: string) =>
  !q || [b.label, b.description, b.tag ?? ''].some((s) => s.toLowerCase().includes(q))

export function BlockPalette({
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
  // Numbered by position in the full list so a component keeps its number while filtering
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
              <Icon name="search" size={14} />
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

// --- Block form -------------------------------------------------------------

/** Splits fields into titled sections, then runs of checkboxes into one list */
function layout(fields: Field[]) {
  const sections: { title?: string; groups: Field[][] }[] = []
  for (const f of fields) {
    let sec = sections[sections.length - 1]
    if (!sec || (f.section && f.section !== sec.title)) {
      sec = { title: f.section, groups: [] }
      sections.push(sec)
    }
    const last = sec.groups[sec.groups.length - 1]
    if (f.kind === 'bool' && last?.[0].kind === 'bool') last.push(f)
    else sec.groups.push([f])
  }
  return sections
}

export function BlockForm({
  block,
  initial,
  mode,
  currentSpec,
  images,
  onSubmit,
  onBack,
  onClose,
}: {
  block: BlockDef
  initial: FormState
  mode: 'insert' | 'edit'
  currentSpec: string | null
  images: ImageUploads
  onSubmit: (state: FormState) => void
  onBack?: () => void
  onClose: () => void
}) {
  const [state, setState] = useState<FormState>(initial)
  const [submitted, setSubmitted] = useState(false)
  const error = validate(block, state)

  const set = (key: string, value: unknown) =>
    setState((s) => ({ ...s, values: { ...s.values, [key]: value } }))

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSubmitted(true)
    if (!error) onSubmit(state)
  }

  return (
    <Dialog
      eyebrow={
        <>
          {onBack ? (
            <button type="button" onClick={onBack} className="hover:text-white">
              Insert component
            </button>
          ) : (
            <span>{mode === 'edit' ? 'Edit component' : 'Insert component'}</span>
          )}
          <span>/</span>
          <span>{block.category}</span>
        </>
      }
      title={block.label}
      subtitle={block.description}
      onClose={onClose}
      width="max-w-[720px]"
      footer={
        <>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-1 py-[7px] text-[.875rem] font-medium text-[#bdbdbd] transition-colors hover:text-white"
            >
              <Icon name="back" size={13} />
              All components
            </button>
          )}
          <span className="flex-1 text-[.8125rem] text-red-400">{submitted && error}</span>
          <button type="button" onClick={onClose} className={BTN_OUTLINE}>
            Cancel
          </button>
          <button type="button" onClick={() => submit()} className={BTN_PRIMARY}>
            {mode === 'edit' ? 'Update component' : 'Insert component'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-[26px]">
        {layout(block.fields).map((section, si) => (
          <Fragment key={si}>
            {si > 0 && <div className="h-px bg-[#383838]" />}
            <section className="grid grid-cols-1 gap-x-3 gap-y-3.5 sm:grid-cols-2">
              {section.title && (
                <h3 className="m-0 text-[.9375rem] font-semibold text-white sm:col-span-2">
                  {section.title}
                </h3>
              )}
              {section.groups.map((group) =>
                group[0].kind === 'bool' ? (
                  <div
                    key={group[0].key}
                    className="flex flex-col overflow-hidden rounded-md border border-[#383838] sm:col-span-2"
                  >
                    {group.map((f, i) => (
                      <label
                        key={f.key}
                        className={`flex cursor-pointer items-center gap-3 bg-[#2a2a2a] px-3.5 py-[11px] transition-colors hover:bg-[#303030] ${
                          i ? 'border-t border-[#383838]' : ''
                        }`}
                      >
                        <input
                          id={`bf-${f.key}`}
                          type="checkbox"
                          checked={!!state.values[f.key]}
                          disabled={state.locked.includes(f.key)}
                          onChange={(e) => set(f.key, e.target.checked)}
                          className={CHECKBOX}
                        />
                        <span className="flex flex-col gap-px">
                          <span className="text-[.875rem] font-semibold text-white">{f.label}</span>
                          {f.help && <span className={HELP}>{f.help}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <FieldRow
                    key={group[0].key}
                    field={group[0]}
                    value={state.values[group[0].key]}
                    locked={state.locked.includes(group[0].key)}
                    currentSpec={currentSpec}
                    images={images}
                    onChange={(v) => set(group[0].key, v)}
                    onSpellPick={(spell) => {
                      // Prefill the display name for toggles/links when it's still empty
                      if ('name' in state.values && !state.values.name) set('name', spell.name)
                    }}
                  />
                )
              )}
            </section>
          </Fragment>
        ))}
        {state.passthrough.length > 0 && (
          <p className="m-0 text-[.8rem] text-[#8a8a8a]">
            Kept as written:{' '}
            <span className="font-mono text-[#bdbdbd]">
              {state.passthrough.map((a) => a.name || a.raw).join(', ')}
            </span>
          </p>
        )}
        {/* Enter in a single-line input submits */}
        <button type="submit" hidden />
      </form>
    </Dialog>
  )
}

function FieldRow({
  field,
  value,
  locked,
  currentSpec,
  images,
  onChange,
  onSpellPick,
}: {
  field: Field
  value: unknown
  locked: boolean
  currentSpec: string | null
  images: ImageUploads
  onChange: (v: unknown) => void
  onSpellPick: (spell: Spell) => void
}) {
  const id = `bf-${field.key}`
  const mono = field.mono ? 'font-mono text-[.8125rem] text-[#FFF5E4]' : ''
  let control: React.ReactNode

  if (locked) {
    control = (
      <p className="m-0 rounded-md border border-dashed border-[#525252] px-3 py-2.5 text-[.82rem] leading-snug text-[#a3a3a3]">
        The form can't read this expression. Edit it in the source.
      </p>
    )
  } else {
    switch (field.kind) {
      case 'textarea':
        control = (
          <textarea
            id={id}
            rows={field.rows ?? (field.mono ? 3 : 2)}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            spellCheck={!field.mono}
            className={`${TEXTAREA} ${mono} ${field.mono ? 'break-all' : ''}`}
          />
        )
        break
      case 'number':
        control = (
          <input
            id={id}
            type="number"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={INPUT}
          />
        )
        break
      case 'select':
        control = (
          <select
            id={id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT} pr-8`}
          >
            {value && !field.options?.some((o) => o.value === value) ? (
              <option value={String(value)}>{String(value)}</option>
            ) : null}
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
        break
      case 'spell':
        control = (
          <SpellInput
            id={id}
            value={String(value ?? '')}
            currentSpec={currentSpec}
            onChange={(v) => onChange(v)}
            onPick={onSpellPick}
          />
        )
        break
      case 'spells':
        control = (
          <SpellList
            id={id}
            value={(value as string[]) ?? []}
            currentSpec={currentSpec}
            onChange={onChange}
          />
        )
        break
      case 'strings':
        control = (
          <ChipInput
            id={id}
            value={(value as string[]) ?? []}
            onChange={onChange}
            suggest={field.suggest}
          />
        )
        break
      case 'talentColors':
        control = <TalentColors value={(value as TalentColor[]) ?? []} onChange={onChange} />
        break
      case 'table':
        control = <TableInput value={(value as string[][]) ?? []} onChange={onChange} />
        break
      case 'image':
        control = (
          <ImageInput
            id={id}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            images={images}
            onChange={onChange}
          />
        )
        break
      default:
        control = (
          <input
            id={id}
            type="text"
            value={String(value ?? '')}
            onChange={(e) =>
              onChange(field.normalize ? field.normalize(e.target.value) : e.target.value)
            }
            placeholder={field.placeholder}
            spellCheck={!field.mono}
            className={`${INPUT} ${mono}`}
          />
        )
    }
  }

  return (
    <div className={field.wide ? 'sm:col-span-2' : ''}>
      {field.label && (
        <label htmlFor={id} className={LABEL}>
          {field.label}
          {field.required && <span className="ml-0.5 text-[#d57f43]">*</span>}
        </label>
      )}
      {control}
      {(field.help || field.link) && (
        <p className={`mt-2 mb-0 ${HELP}`}>
          {field.help}
          {field.link && (
            <a
              href={field.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 font-semibold text-[#ffb86c] hover:underline ${field.help ? 'ml-1.5' : ''}`}
            >
              {field.link.label}
              <Icon name="external" size={11} />
            </a>
          )}
        </p>
      )}
    </div>
  )
}

// --- Tables -----------------------------------------------------------------

const MAX_TABLE_ROWS = 50
const MAX_TABLE_COLS = 12

function TableInput({ value, onChange }: { value: string[][]; onChange: (v: string[][]) => void }) {
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

// --- Images -----------------------------------------------------------------

function ImageInput({
  id,
  value,
  placeholder,
  images,
  onChange,
}: {
  id: string
  value: string
  placeholder?: string
  images: ImageUploads
  onChange: (v: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const previewSrc = images.previewUrl(value) ?? (/^(\/|https?:)/.test(value) ? value : '')

  const take = (file: File | undefined) => {
    if (!file) return
    try {
      onChange(images.add(file))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        take(e.dataTransfer.files[0])
      }}
      className={`rounded-md transition-shadow ${dragging ? 'ring-2 ring-[#d57f43]' : ''}`}
    >
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            const file = [...e.clipboardData.files].find((f) => f.type.startsWith('image/'))
            if (file) {
              e.preventDefault()
              take(file)
            }
          }}
          placeholder={placeholder}
          spellCheck={false}
          className={`${INPUT} min-w-0 font-mono text-[.82rem]`}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex h-[38px] flex-shrink-0 items-center gap-1.5 rounded-md border border-[#525252] pr-3.5 pl-3 text-[.875rem] font-medium text-[#e5e5e5] transition-colors hover:bg-[#2e2e2e]"
        >
          <Icon name="upload" size={15} />
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={Object.keys(IMAGE_TYPES).join(',')}
          hidden
          onChange={(e) => {
            take(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="mt-2 mb-0 text-[.8rem] text-red-400">{error}</p>}
      {previewSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewSrc}
          alt=""
          className="mt-3 block max-h-40 max-w-full rounded-md border border-[#383838] bg-[#1c1c1c] object-contain"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          onLoad={(e) => (e.currentTarget.style.display = '')}
        />
      )}
    </div>
  )
}

// --- Spells -----------------------------------------------------------------

function useSpellNames(enabled: boolean) {
  const [names, setNames] = useState<Map<number, string>>(new Map())
  useEffect(() => {
    if (!enabled) return
    let active = true
    loadSpells().then((list) => {
      if (active) setNames(new Map(list.map((s) => [s.id, s.name])))
    })
    return () => {
      active = false
    }
  }, [enabled])
  return names
}

function SpellSearch({
  id,
  currentSpec,
  placeholder,
  onPick,
  onRaw,
}: {
  id: string
  currentSpec: string | null
  placeholder: string
  onPick: (spell: Spell) => void
  /** Enter on a bare number adds it without a lookup */
  onRaw?: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const results = useSpellSearch(query, currentSpec, true).slice(0, 8)
  const inputRef = useRef<HTMLInputElement>(null)

  const pick = (s: Spell) => {
    onPick(s)
    setQuery('')
    setHi(0)
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setHi(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHi((h) => Math.min(h + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHi((h) => Math.max(h - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault()
            if (results[hi]) pick(results[hi])
            else if (onRaw && /^\d+$/.test(query.trim())) {
              onRaw(query.trim())
              setQuery('')
            }
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className={INPUT}
      />
      {open && results.length > 0 && (
        <Popover anchor={inputRef}>
          {results.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHi(i)}
                onClick={() => pick(s)}
                className={`flex w-full items-center justify-between gap-3 rounded-[4px] px-2.5 py-1.5 text-left text-[.86rem] ${
                  i === hi ? 'bg-[#383838] text-white' : 'text-[#d4d4d4]'
                }`}
              >
                <span className="truncate">{s.name}</span>
                <span className="flex-shrink-0 font-mono text-[.75rem] text-white/40">
                  {s.spec ? `${s.spec} · ` : ''}
                  {s.id}
                </span>
              </button>
            </li>
          ))}
        </Popover>
      )}
    </div>
  )
}

function SpellInput({
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
  const names = useSpellNames(true)
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
  return (
    <SpellSearch
      id={id}
      currentSpec={currentSpec}
      placeholder="Search spells by name or id…"
      onPick={(s) => {
        onChange(String(s.id))
        onPick(s)
      }}
      onRaw={onChange}
    />
  )
}

function SpellList({
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
  const names = useSpellNames(true)
  const dragFrom = useRef<number | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const results = useSpellSearch(query, currentSpec, true).slice(0, 8)
  const showResults = open && results.length > 0

  const add = (sid: string) => {
    // Repeats are allowed since a sequence can cast the same spell twice
    onChange([...value, sid])
    setQuery('')
    setHi(0)
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
            <Icon name="close" size={11} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        value={query}
        autoComplete="off"
        role="combobox"
        aria-expanded={showResults}
        onChange={(e) => {
          setQuery(e.target.value)
          setHi(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (showResults && e.key === 'ArrowDown') {
            e.preventDefault()
            setHi((h) => Math.min(h + 1, results.length - 1))
          } else if (showResults && e.key === 'ArrowUp') {
            e.preventDefault()
            setHi((h) => Math.max(h - 1, 0))
          } else if (e.key === 'Escape' && showResults) {
            e.stopPropagation()
            setOpen(false)
          } else if (e.key === 'Enter') {
            e.preventDefault()
            if (showResults) add(String(results[hi].id))
            else if (/^\d+$/.test(query.trim())) add(query.trim())
          } else if (e.key === 'Backspace' && !query && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        placeholder={value.length ? '' : 'Search spells by name or id…'}
        className="h-7 min-w-[8rem] flex-1 border-0 bg-transparent px-1.5 py-0 text-[.9rem] text-white placeholder-[#7a7a7a] focus:ring-0 focus:outline-none"
      />
      {showResults && (
        <Popover anchor={boxRef}>
          {results.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === hi}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHi(i)}
                onClick={() => add(String(s.id))}
                className={`flex w-full items-center justify-between gap-3 rounded-[4px] px-2.5 py-1.5 text-left text-[.86rem] ${
                  i === hi ? 'bg-[#383838] text-white' : 'text-[#d4d4d4]'
                }`}
              >
                <span className="truncate">{s.name}</span>
                <span className="flex-shrink-0 font-mono text-[.75rem] text-white/40">
                  {s.spec ? `${s.spec} · ` : ''}
                  {s.id}
                </span>
              </button>
            </li>
          ))}
        </Popover>
      )}
    </div>
  )
}

// --- Lists & talent colours ---------------------------------------------------

let talentNamesCache: string[] | null = null

function useTalentNames(enabled: boolean) {
  const [names, setNames] = useState<string[]>(talentNamesCache ?? [])
  useEffect(() => {
    if (!enabled || talentNamesCache) return
    import('../../../../other/talents.json').then((mod) => {
      const set = new Set<string>()
      for (const spec of mod.default as any[]) {
        for (const node of [
          ...(spec.classNodes ?? []),
          ...(spec.specNodes ?? []),
          ...(spec.heroNodes ?? []),
        ]) {
          if (node.name) set.add(node.name)
          for (const e of [...(node.entries ?? []), ...(node.choices ?? [])]) {
            if (e.name) set.add(e.name)
          }
        }
      }
      talentNamesCache = [...set].sort()
      setNames(talentNamesCache)
    })
  }, [enabled])
  return names
}

function ChipInput({
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
  const [hi, setHi] = useState(0)
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
        className="flex min-h-10 flex-wrap items-center gap-1 rounded-md border border-[#3d3d3d] bg-[#1c1c1c] px-2 py-[5px] focus-within:border-[#d57f43]"
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
                <Icon name="close" size={11} />
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
          onChange={(e) => {
            setDraft(e.target.value)
            setHi(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (showResults && e.key === 'ArrowDown') {
              e.preventDefault()
              setHi((h) => Math.min(h + 1, results.length - 1))
            } else if (showResults && e.key === 'ArrowUp') {
              e.preventDefault()
              setHi((h) => Math.max(h - 1, 0))
            } else if (e.key === 'Escape' && showResults) {
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
        <Popover anchor={boxRef}>
          {results.map((name, i) => (
            <li key={name} role="option" aria-selected={i === hi}>
              <button
                type="button"
                // Keep focus in the input so blur doesn't add the half-typed query
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHi(i)}
                onClick={() => add(name)}
                className={`flex w-full items-center rounded-[4px] px-2.5 py-1.5 text-left text-[.86rem] ${
                  i === hi ? 'bg-[#383838] text-white' : 'text-[#d4d4d4]'
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </Popover>
      )}
    </div>
  )
}

function TalentColors({
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
              <Icon name="close" size={14} />
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
        <Icon name="plusCircle" size={18} />
        Add colour group
      </button>
    </div>
  )
}
