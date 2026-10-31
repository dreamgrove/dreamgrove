'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SpecId } from '@/data/specs'
import {
  SLUG_PATTERN,
  newPageDocument,
  newPagePath,
  slugify,
  type NewPageKind,
} from '@/lib/admin/content'
import { splitAuthors } from '@/lib/admin/document'
import { stashNewPage } from '@/lib/admin/newPageStash'
import { ACCENT } from '@/lib/admin/palette'
import Icon from '@/components/Icon'
import SpecTiles from '@/components/admin/ui/SpecTiles'

export interface NewPagePreset {
  kind?: NewPageKind
  specs?: SpecId[]
}

const KINDS: { id: NewPageKind; label: string }[] = [
  { id: 'article', label: 'Guide' },
  { id: 'dungeon', label: 'Dungeon' },
  { id: 'raid', label: 'Raid' },
]

const INPUT =
  'w-full rounded-xs border border-[#3a3a3a] bg-[#242424] px-3 py-2.5 text-[.95rem] text-white placeholder-white/30 focus:border-[#d57f43] focus:ring-0 focus:outline-none'
const LABEL = 'mb-1.5 block text-[.82rem] font-semibold text-white/60'

export default function NewPageDialog({
  preset,
  existingPaths,
  defaultAuthor,
  onClose,
}: {
  preset: NewPagePreset
  existingPaths: string[]
  defaultAuthor: string
  onClose: () => void
}) {
  const router = useRouter()
  const [kind, setKind] = useState<NewPageKind>(preset.kind ?? 'article')
  const [specs, setSpecs] = useState<SpecId[]>(preset.specs ?? [])
  const [title, setTitle] = useState('')
  const [slugInput, setSlugInput] = useState<string | null>(null)
  const [summary, setSummary] = useState('')
  const [authors, setAuthors] = useState(defaultAuthor)
  const [draft, setDraft] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const slug = slugInput ?? slugify(title, kind)
  const filePath = newPagePath({ kind, slug, specs })
  const exists = existingPaths.includes(filePath)

  const errors = {
    title: !title.trim() ? 'Give the page a title.' : null,
    slug: !slug
      ? 'Pick a file name.'
      : !SLUG_PATTERN.test(slug)
        ? 'Use lowercase letters, numbers, dashes or underscores.'
        : exists
          ? 'A page with this name already exists here.'
          : null,
  }
  const valid = !errors.title && !errors.slug

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (!valid) return
    const document = newPageDocument({
      kind,
      title,
      slug,
      summary,
      authors: splitAuthors(authors),
      specs,
      draft,
    })
    stashNewPage(filePath, document)
    router.push(`/cms/edit?path=${encodeURIComponent(filePath)}&new=1`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={create}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-page-title"
        className="w-full max-w-xl rounded-sm border border-[#3a3a3a] bg-[#1f1f1f] text-white"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#3a3a3a] px-6 pt-6 pb-5">
          <h2 id="new-page-title" className="m-0 text-[1.5rem] font-semibold">
            New page
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 rounded-xs p-2 text-white/40 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon box name="close" size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-6">
          <div
            className="grid grid-cols-3 gap-1 rounded-xs border border-[#3a3a3a] bg-[#242424] p-1"
            role="radiogroup"
            aria-label="Page type"
          >
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                role="radio"
                aria-checked={kind === k.id}
                onClick={() => setKind(k.id)}
                className={`flex h-9 items-center justify-center rounded-xs text-[.92rem] leading-none font-semibold transition-colors ${
                  kind === k.id ? 'bg-[#3a3a3a] text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="np-title" className={LABEL}>
              Title
            </label>
            <input
              id="np-title"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={INPUT}
              placeholder={kind === 'article' ? 'On Diminishing Returns' : 'Skyreach'}
            />
            {submitted && errors.title && (
              <p className="mt-1.5 mb-0 text-[.82rem] text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <span className={LABEL}>
              {kind === 'article' ? 'Show under' : 'Spec notes for (optional)'}
            </span>
            <SpecTiles
              value={specs}
              onChange={setSpecs}
              general={kind === 'article'}
              className={
                kind === 'article' ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'
              }
            />
          </div>

          <div>
            <label htmlFor="np-summary" className={LABEL}>
              Summary
            </label>
            <input
              id="np-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className={INPUT}
              placeholder="Short description of the contents"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <label htmlFor="np-authors" className={LABEL}>
                Authors
              </label>
              <input
                id="np-authors"
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                className={INPUT}
                placeholder="Name1, Name2"
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2.5 text-[.9rem] font-semibold text-white/80">
              <input
                type="checkbox"
                checked={draft}
                onChange={(e) => setDraft(e.target.checked)}
                className="h-4 w-4 rounded-xs border-[#4b4b4b] bg-[#242424] text-[#d57f43] focus:ring-0 focus:ring-offset-0"
              />
              Draft
            </label>
          </div>

          <div>
            <label htmlFor="np-slug" className={LABEL}>
              File name
            </label>
            <div className="flex items-stretch overflow-hidden rounded-xs border border-[#3a3a3a] bg-[#242424] focus-within:border-[#d57f43]">
              <span className="flex items-center border-r border-[#3a3a3a] px-3 font-mono text-[.8rem] whitespace-nowrap text-white/40">
                {filePath.slice(0, filePath.lastIndexOf('/') + 1)}
              </span>
              <input
                id="np-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlugInput(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 font-mono text-[.88rem] text-white focus:ring-0 focus:outline-none"
                spellCheck={false}
              />
              <span className="flex items-center pr-3 font-mono text-[.8rem] text-white/40">
                .mdx
              </span>
            </div>
            {(submitted || exists) && errors.slug && (
              <p className="mt-1.5 mb-0 text-[.82rem] text-red-400">{errors.slug}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-[#3a3a3a] px-6 py-4">
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xs px-4 py-2.5 text-[.92rem] font-semibold text-white/60 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitted && !valid}
              style={{ background: ACCENT }}
              className="rounded-xs px-5 py-2.5 text-[.92rem] font-semibold text-[#2a2a2a] transition-[filter] hover:brightness-110 disabled:opacity-50"
            >
              Create & edit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
