'use client'

import { formatDraftAge, type EditorDraft } from '@/lib/admin/drafts'

export default function DraftRecoveryBanner({
  draft,
  staleBaseline,
  onRestore,
  onDiscard,
}: {
  draft: EditorDraft
  /** The file changed on GitHub since the draft was started */
  staleBaseline: boolean
  onRestore: () => void
  onDiscard: () => void
}) {
  return (
    <div className="mx-4 mb-3 flex flex-shrink-0 flex-col gap-3 rounded-sm border border-amber-500/40 bg-amber-500/10 px-4 py-3.5 sm:mx-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="m-0 text-[.95rem] font-semibold text-amber-200">
          Unsaved changes recovered
        </h2>
        <p className="mt-0.5 mb-0 text-[.88rem] text-amber-100/70">
          This browser has edits from {formatDraftAge(draft.savedAt)} that were never saved to
          GitHub.
          {staleBaseline
            ? ' Heads up: the file has also changed on GitHub since then, so restoring will discard those newer changes.'
            : ''}
        </p>
      </div>
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        <button
          onClick={onDiscard}
          className="rounded-xs px-3 py-2 text-[.86rem] font-semibold text-amber-100/80 transition-colors hover:bg-amber-500/15 hover:text-amber-100"
        >
          Discard and use the file from GitHub
        </button>
        <button
          onClick={onRestore}
          className="rounded-xs bg-amber-500 px-3.5 py-2 text-[.86rem] font-semibold text-dg-panel transition-[filter] hover:brightness-110"
        >
          Restore my edits
        </button>
      </div>
    </div>
  )
}
