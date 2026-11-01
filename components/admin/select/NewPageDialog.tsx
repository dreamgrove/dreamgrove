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
import Dialog from '@/components/admin/ui/Dialog'
import SpecTiles from '@/components/admin/ui/SpecTiles'
import { BTN_GHOST, BTN_PRIMARY, CHECKBOX, INPUT, LABEL } from '@/components/admin/ui/styles'

export interface NewPagePreset {
  kind?: NewPageKind
  specs?: SpecId[]
}

const KINDS: { id: NewPageKind; label: string }[] = [
  { id: 'article', label: 'Guide' },
  { id: 'dungeon', label: 'Dungeon' },
  { id: 'raid', label: 'Raid' },
]

const FORM_ID = 'new-page-form'

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
    <Dialog
      title="New page"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={BTN_GHOST}>
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            disabled={submitted && !valid}
            className={BTN_PRIMARY}
          >
            Create & edit
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={create} className="flex flex-col gap-5">
        <div
          className="grid grid-cols-3 gap-1 rounded-md border border-[#3d3d3d] bg-[#1c1c1c] p-1"
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
                kind === k.id ? 'bg-dg-line text-white' : 'text-white/50 hover:text-white'
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
              className={CHECKBOX}
            />
            Draft
          </label>
        </div>

        <div>
          <label htmlFor="np-slug" className={LABEL}>
            File name
          </label>
          <div className="flex items-stretch overflow-hidden rounded-md border border-[#3d3d3d] bg-[#1c1c1c] focus-within:border-main">
            <span className="flex items-center border-r border-dg-line px-3 font-mono text-[.8rem] whitespace-nowrap text-white/40">
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
      </form>
    </Dialog>
  )
}
