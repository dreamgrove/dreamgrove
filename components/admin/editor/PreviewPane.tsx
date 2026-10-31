'use client'

import { Suspense, useState, type RefObject } from 'react'
import MDXPreview from '@/components/MDXPreview'
import type { PageLocale } from '@/lib/pageLocale'
import Icon from '@/components/Icon'
import SegmentedControl from '@/components/admin/ui/SegmentedControl'
import Switch from '@/components/admin/ui/Switch'

const WIDTHS = ['desktop', 'mobile'] as const

export default function PreviewPane({
  scrollRef,
  content,
  locale,
  withRoleSelector,
  fullWidth,
  syncScroll,
  autoRefresh,
  onToggleAutoRefresh,
  onRefresh,
  onError,
}: {
  scrollRef: RefObject<HTMLDivElement | null>
  content: string
  locale: PageLocale
  /** Raid and dungeon pages render under the spec picker */
  withRoleSelector: boolean
  /** Preview-only view */
  fullWidth: boolean
  /** Shown in split view only */
  syncScroll?: { on: boolean; toggle: () => void }
  autoRefresh: boolean
  onToggleAutoRefresh: () => void
  onRefresh: () => void
  onError: (line: number | null) => void
}) {
  const [width, setWidth] = useState<(typeof WIDTHS)[number]>('desktop')

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#262626]">
      <div className="flex flex-shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-[#3a3a3a] bg-[#1f1f1f] px-3 py-1.5 [scrollbar-width:none]">
        <SegmentedControl
          label="Preview width"
          options={WIDTHS}
          value={width}
          onChange={setWidth}
          filled={false}
        />
        <div className="flex flex-shrink-0 items-center gap-4">
          {syncScroll && (
            <Switch
              label="Sync scroll"
              title="Keep the preview scrolled to the same section as the editor"
              checked={syncScroll.on}
              onChange={syncScroll.toggle}
            />
          )}
          <Switch
            label="Live"
            title="Re-render the preview as you type"
            checked={autoRefresh}
            onChange={onToggleAutoRefresh}
          />
          {!autoRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-7 items-center gap-1.5 rounded-xs border border-[#3a3a3a] px-2.5 text-[.8rem] font-semibold text-white/70 hover:bg-[#2a2a2a] hover:text-white"
            >
              <Icon box name="refresh" size={13} />
              Refresh
            </button>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 overflow-auto ${width === 'mobile' ? 'bg-[#1a1a1a]' : ''}`}
        suppressHydrationWarning
      >
        <div
          className={`mx-auto min-h-full bg-[#262626] ${
            width === 'mobile'
              ? 'max-w-[390px] border-x border-[#3a3a3a] px-4 py-6'
              : fullWidth
                ? 'max-w-4xl px-6 py-10 sm:px-10'
                : 'px-6 py-8 sm:px-10'
          }`}
        >
          <Suspense fallback={<div className="text-sm text-white/40 italic">Loading preview…</div>}>
            {withRoleSelector ? (
              <MDXPreview
                setErrorLine={onError}
                content={'<RoleSelector isPreview={true}/>' + content}
              />
            ) : (
              <MDXPreview setErrorLine={onError} content={content} locale={locale} />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
