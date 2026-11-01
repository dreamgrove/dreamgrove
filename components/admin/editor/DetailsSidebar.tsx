'use client'

import type { SpecId } from '@/data/specs'
import type { Frontmatter } from '@/lib/admin/document'
import Icon from '@/components/Icon'
import SpecTiles from '@/components/admin/ui/SpecTiles'
import { CHECKBOX, INPUT, LABEL, TEXTAREA } from '@/components/admin/ui/styles'

/** Frontmatter form beside the editor: title, summary, authors, patch, specs, draft */
export default function DetailsSidebar({
  showSpecs,
  frontmatter,
  authorsInput,
  setAuthorsInput,
  setField,
  onClose,
}: {
  showSpecs: boolean
  frontmatter: Frontmatter
  authorsInput: string
  setAuthorsInput: (value: string) => void
  setField: (key: string, value: unknown) => void
  onClose: () => void
}) {
  const specs: SpecId[] = Array.isArray(frontmatter.specs) ? frontmatter.specs : []

  return (
    <aside
      aria-label="Page details"
      className="absolute inset-y-0 right-0 z-20 flex w-[min(320px,100%)] flex-shrink-0 flex-col border-l border-dg-line bg-dg-panel-deep shadow-2xl lg:static lg:shadow-none"
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-dg-line px-5 py-1.5">
        {/* pt-px: thiccboi's caps sit ~0.5px above the line box's centre */}
        <h2 className="m-0 flex h-8 items-center pt-px text-[.72rem] leading-none font-semibold tracking-[0.2em] text-white/50 uppercase">
          Page details
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Hide page details"
          className="-mr-2 flex h-8 w-8 items-center justify-center rounded-xs text-white/40 hover:bg-dg-panel hover:text-white"
        >
          <Icon box name="close" size={14} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
        <div>
          <label htmlFor="fm-title" className={LABEL}>
            Title
          </label>
          <input
            id="fm-title"
            type="text"
            value={String(frontmatter.title ?? '')}
            onChange={(e) => setField('title', e.target.value)}
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="fm-summary" className={LABEL}>
            Summary
          </label>
          <textarea
            id="fm-summary"
            rows={3}
            value={String(frontmatter.summary ?? '')}
            onChange={(e) => setField('summary', e.target.value)}
            className={TEXTAREA}
            placeholder="Short description of the contents"
          />
        </div>
        <div>
          <label htmlFor="fm-authors" className={LABEL}>
            Authors
          </label>
          <input
            id="fm-authors"
            type="text"
            value={authorsInput}
            onChange={(e) => setAuthorsInput(e.target.value)}
            className={INPUT}
            placeholder="Name1, Name2"
          />
          <p className="mt-1.5 mb-0 text-[.76rem] text-white/35">Separate names with commas.</p>
        </div>
        <div>
          <label htmlFor="fm-patch" className={LABEL}>
            Patch
          </label>
          <input
            id="fm-patch"
            type="text"
            value={String(frontmatter.patch ?? '')}
            onChange={(e) => setField('patch', e.target.value)}
            className={`${INPUT} font-mono text-[.85rem]`}
            placeholder="12.0.7"
          />
        </div>
        {showSpecs && (
          <div>
            <span className={LABEL}>Show under</span>
            <SpecTiles
              value={specs}
              onChange={(next) => setField('specs', next.length ? next : undefined)}
            />
            <p className="mt-1.5 mb-0 text-[.76rem] text-white/35">
              {specs.length
                ? 'Listed on the selected spec pages.'
                : 'No spec: listed under general guides.'}
            </p>
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-3 rounded-xs border border-dg-line bg-[#242424] p-3">
          <input
            id="fm-draft"
            type="checkbox"
            checked={!!frontmatter.draft}
            onChange={(e) => setField('draft', e.target.checked)}
            className={`${CHECKBOX} flex-shrink-0`}
          />
          <span>
            <span className="block text-[.88rem] font-semibold text-white/85">Draft</span>
            <span className="block text-[.78rem] text-white/40">
              Hidden from listings until unticked.
            </span>
          </span>
        </label>
      </div>
    </aside>
  )
}
