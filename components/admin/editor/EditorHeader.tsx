'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatDraftAge } from '@/lib/admin/drafts'
import { Badge } from '@/components/admin/ui/Badges'
import Icon from '@/components/Icon'
import SegmentedControl from '@/components/admin/ui/SegmentedControl'
import { BTN_ICON, BTN_PRIMARY } from '@/components/admin/ui/styles'
import logo from '../../../public/static/images/logo.png'

export type ViewMode = 'edit' | 'split' | 'preview'

const VIEW_MODES = ['edit', 'split', 'preview'] as const

function SaveState({ dirty, draftSavedAt }: { dirty: boolean; draftSavedAt: number | null }) {
  return (
    <span
      className="hidden flex-shrink-0 items-center gap-1.5 pt-0.5 text-[.8rem] leading-none text-white/40 md:flex"
      title={
        draftSavedAt !== null ? 'Kept in this browser only. Use “Save” to open a PR.' : undefined
      }
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${dirty ? 'bg-[#ffb86c]' : 'bg-white/25'}`}
      />
      {!dirty
        ? 'No unsaved changes'
        : draftSavedAt !== null
          ? `Unsaved · draft kept ${formatDraftAge(draftSavedAt)}`
          : 'Unsaved changes'}
    </span>
  )
}

/** Breadcrumbs, title and save state, view mode, and the page actions */
export default function EditorHeader({
  filePath,
  title,
  isNewFile,
  isDraft,
  dirty,
  draftSavedAt,
  viewMode,
  onViewMode,
  liveHref,
  backHref,
  details,
  saving,
  onSave,
}: {
  filePath: string
  title: string
  isNewFile: boolean
  isDraft: boolean
  dirty: boolean
  draftSavedAt: number | null
  viewMode: ViewMode
  onViewMode: (mode: ViewMode) => void
  liveHref: string | null
  /** The page the editor was opened from, else the page list */
  backHref?: string
  details?: { open: boolean; toggle: () => void }
  saving: boolean
  onSave: () => void
}) {
  const parts = filePath.split('/')
  const fileName = parts[parts.length - 1] || 'Unknown'
  const group = parts.length > 1 ? parts[parts.length - 2] : 'root'
  const canSave = dirty || isNewFile

  return (
    <header className="flex flex-shrink-0 flex-wrap items-center gap-x-4 gap-y-3 px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2 text-[.78rem] leading-none text-white/40">
          <Link
            href="/"
            className="flex flex-shrink-0 items-center hover:text-white"
            title="Dreamgrove"
          >
            <Image
              src={logo}
              alt="Dreamgrove"
              width={14}
              height={14}
              className="h-3.5 w-3.5 object-contain"
            />
          </Link>
          <span aria-hidden>/</span>
          <Link href="/cms" className="flex-shrink-0 hover:text-white">
            Editor
          </Link>
          <span aria-hidden>/</span>
          <span className="flex-shrink-0 capitalize">{group}</span>
          <span aria-hidden>/</span>
          <span className="truncate font-mono" title={filePath}>
            {fileName}
          </span>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-3">
          <Link
            href={backHref ?? '/cms'}
            title={backHref ? 'Back to page' : 'Back to pages'}
            aria-label={backHref ? 'Back to page' : 'Back to pages'}
            className="-mr-1 -ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xs text-white/50 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon box name="back" size={16} />
          </Link>
          <h1 className="m-0 truncate text-[1.4rem] leading-tight font-semibold tracking-[-0.01em] text-white">
            {title || fileName}
          </h1>
          {isNewFile && <Badge accent>New</Badge>}
          {isDraft && <Badge>Draft</Badge>}
          <SaveState dirty={dirty} draftSavedAt={draftSavedAt} />
        </div>
      </div>

      <SegmentedControl
        label="View mode"
        size="md"
        options={VIEW_MODES}
        value={viewMode}
        onChange={onViewMode}
      />

      {/* With the details panel open on wide screens, the divider lines up with
          its left border and the actions spread across its width (320px + the
          editor frame's 1px border) */}
      <div
        className={`flex flex-shrink-0 items-center gap-4 ${
          details?.open ? 'lg:w-[321px] lg:justify-between lg:gap-3' : ''
        }`}
      >
        <span className="hidden h-6 w-px flex-shrink-0 bg-[#3a3a3a] sm:block" aria-hidden />
        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Open live page"
            aria-label="Open live page"
            className={BTN_ICON}
          >
            <Icon box name="external" size={16} />
          </a>
        )}
        {details && (
          <button
            type="button"
            onClick={details.toggle}
            aria-pressed={details.open}
            title={details.open ? 'Hide page details' : 'Show page details'}
            aria-label={details.open ? 'Hide page details' : 'Show page details'}
            className={`inline-flex h-9 items-center gap-2 rounded-xs border px-3 text-[.85rem] font-semibold transition-colors ${
              details.open
                ? 'border-white/50 bg-white/15 text-white hover:bg-white/20'
                : 'border-white/30 bg-white/5 text-white/85 hover:border-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon box name="details" size={16} />
            Details
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving || !canSave}
          title={canSave ? 'Open a pull request (Ctrl+S)' : 'Nothing to save yet'}
          className={`${BTN_PRIMARY} h-9 flex-shrink-0`}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </header>
  )
}
