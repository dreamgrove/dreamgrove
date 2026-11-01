'use client'

import { useMemo, useRef, useState } from 'react'
import type { EditorView } from '@codemirror/view'
import { kindOf } from '@/lib/admin/content'
import { livePageHref } from '@/lib/admin/document'
import { specFromPath } from '@/lib/admin/spells'
import { localeFromPath } from '@/lib/pageLocale'
import { useEditorFile } from '@/hooks/admin/useEditorFile'
import { useImageUploads, withUploadUrls } from '@/hooks/admin/useImageUploads'
import { useMediaQuery } from '@/hooks/admin/useMediaQuery'
import { usePersistedState } from '@/hooks/usePersistedState'
import { useSaveChanges } from '@/hooks/admin/useSaveChanges'
import { useScrollSync } from '@/hooks/admin/useScrollSync'
import { useSplitPane } from '@/hooks/admin/useSplitPane'
import Icon from '@/components/Icon'
import AuthGate from '@/components/admin/ui/AuthGate'
import StatusShell, { StatusMessage } from '@/components/admin/ui/StatusShell'
import DetailsSidebar from './DetailsSidebar'
import DraftRecoveryBanner from './DraftRecoveryBanner'
import EditorHeader, { type ViewMode } from './EditorHeader'
import EditorPane from './EditorPane'
import PreviewPane from './PreviewPane'
import SaveDialog, { PullRequestCreated } from './SaveDialog'

const WIDE = '(min-width: 1024px)'

const BACK_TO_PAGES = { href: '/cms', label: 'Back to pages' }

/** Edits one content file and submits the result as a pull request */
export default function FileEditor({
  filePath,
  isNew,
  backHref,
}: {
  filePath: string
  isNew: boolean
  backHref?: string
}) {
  return (
    <AuthGate reason="Sign in with GitHub to edit this page.">
      <Editor filePath={filePath} isNew={isNew} backHref={backHref} />
    </AuthGate>
  )
}

function Editor({
  filePath,
  isNew,
  backHref,
}: {
  filePath: string
  isNew: boolean
  backHref?: string
}) {
  const file = useEditorFile(filePath, isNew)
  const kind = kindOf(filePath)
  const { uploads, images } = useImageUploads(filePath)
  const save = useSaveChanges({ filePath, uploads, onSaved: file.markSaved })

  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const wide = useMediaQuery(WIDE, true)
  const [detailsChoice, setDetailsChoice] = useState<boolean | null>(null)
  const showDetails = detailsChoice ?? wide
  const [saveOpen, setSaveOpen] = useState(false)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [view, setView] = useState<EditorView | null>(null)
  const [syncScroll, setSyncScroll] = usePersistedState('editor-sync-scroll', true)
  const [autoRefresh, setAutoRefresh] = usePersistedState('editor-auto-refresh', true)
  const [previewSnapshot, setPreviewSnapshot] = useState<string | null>(null)
  const previewContent = autoRefresh || previewSnapshot === null ? file.doc.body : previewSnapshot
  const previewRef = useRef<HTMLDivElement>(null)
  const splitRef = useRef<HTMLDivElement>(null)
  const split = useSplitPane(splitRef)
  const currentSpec = useMemo(() => specFromPath(filePath), [filePath])
  // Since uploads don't exist on the server yet the preview reads them from their blobs
  const previewSource = useMemo(
    () => withUploadUrls(previewContent, uploads),
    [previewContent, uploads]
  )

  useScrollSync(viewMode === 'split' && syncScroll, view, previewRef)

  if (file.authStatus === 'loading' || file.status === 'loading') {
    return <StatusShell>Loading content…</StatusShell>
  }
  if (file.status === 'error') {
    return (
      <StatusMessage title="Couldn’t load file" error back={BACK_TO_PAGES}>
        {file.error}
      </StatusMessage>
    )
  }

  const { doc } = file
  const showEditor = viewMode !== 'preview'
  const detailsOpen = showDetails && showEditor
  const canSave = file.isDirty || file.isNewFile

  const openSave = () => {
    if (!save.saving && canSave) setSaveOpen(true)
  }
  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    setDetailsChoice(mode === 'edit' && wide)
  }
  const changeBody = (body: string) => {
    file.setBody(body)
    setErrorLine(null)
  }
  const fileName = filePath.split('/').pop() ?? ''
  const baseName = fileName.replace(/\.[^/.]+$/, '')

  return (
    // Full-screen app layout
    <div className="dark dg-page flex h-dvh flex-col overflow-hidden">
      <EditorHeader
        filePath={filePath}
        title={String(doc.frontmatter.title ?? '')}
        isNewFile={file.isNewFile}
        isDraft={!!doc.frontmatter.draft}
        dirty={file.isDirty}
        draftSavedAt={file.draftSavedAt}
        viewMode={viewMode}
        onViewMode={changeViewMode}
        liveHref={livePageHref(filePath, file.isNewFile)}
        backHref={backHref}
        details={
          showEditor
            ? { open: detailsOpen, toggle: () => setDetailsChoice(!showDetails) }
            : undefined
        }
        saving={save.saving}
        onSave={openSave}
      />

      {file.pendingDraft && (
        <DraftRecoveryBanner
          draft={file.pendingDraft}
          staleBaseline={
            !!file.pendingDraft.baseline && file.pendingDraft.baseline !== file.baseline
          }
          onRestore={file.restoreDraft}
          onDiscard={file.discardDraft}
        />
      )}

      {save.error && (
        <div className="mx-4 mb-3 flex flex-shrink-0 items-start gap-3 rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-[.9rem] text-red-200 sm:mx-6">
          <span className="flex-1">{save.error}</span>
          <button
            type="button"
            onClick={save.dismissError}
            aria-label="Dismiss"
            className="text-red-200/70 hover:text-red-100"
          >
            <Icon box name="close" size={14} />
          </button>
        </div>
      )}

      {save.message && (
        <div className="mx-4 mb-3 flex-shrink-0 rounded-sm border border-green-500/40 bg-green-500/10 px-4 py-3 text-[.9rem] text-green-200 sm:mx-6">
          {save.message}
        </div>
      )}

      <div className="relative mx-4 mb-4 flex min-h-0 flex-1 overflow-hidden rounded-sm border border-dg-line bg-dg-panel-deep sm:mx-6 sm:mb-6">
        <div ref={splitRef} className="flex min-w-0 flex-1">
          {showEditor && (
            <div
              className={`flex min-w-0 flex-col ${viewMode === 'split' ? 'shrink-0' : 'flex-1'}`}
              style={viewMode === 'split' ? { width: `${split.position}%` } : undefined}
            >
              <EditorPane
                value={doc.body}
                onChange={changeBody}
                filePath={filePath}
                currentSpec={currentSpec}
                images={images}
                errorLine={errorLine}
                onSave={openSave}
                onViewChange={setView}
              />
            </div>
          )}

          {viewMode === 'split' && (
            <div
              className="group relative z-10 -mx-1 flex w-2 shrink-0 cursor-col-resize items-stretch justify-center"
              onMouseDown={split.startDrag}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize editor and preview"
            >
              <div
                className={`w-px transition-colors ${
                  split.dragging ? 'bg-main' : 'bg-dg-line group-hover:bg-main/60'
                }`}
              />
            </div>
          )}

          {viewMode !== 'edit' && (
            <PreviewPane
              scrollRef={previewRef}
              content={previewSource}
              locale={localeFromPath(filePath)}
              withRoleSelector={kind === 'dungeon' || kind === 'raid'}
              fullWidth={viewMode === 'preview'}
              syncScroll={
                viewMode === 'split'
                  ? { on: syncScroll, toggle: () => setSyncScroll((v) => !v) }
                  : undefined
              }
              autoRefresh={autoRefresh}
              onToggleAutoRefresh={() => {
                setPreviewSnapshot(doc.body)
                setAutoRefresh((v) => !v)
              }}
              onRefresh={() => setPreviewSnapshot(doc.body)}
              onError={setErrorLine}
            />
          )}
        </div>

        {detailsOpen && (
          <DetailsSidebar
            showSpecs={kind === 'article' || kind === 'dungeon' || kind === 'raid'}
            frontmatter={doc.frontmatter}
            authorsInput={doc.authorsInput}
            setAuthorsInput={file.setAuthors}
            setField={file.setField}
            onClose={() => setDetailsChoice(false)}
          />
        )}
      </div>

      {saveOpen && (
        <SaveDialog
          filePath={filePath}
          isNewFile={file.isNewFile}
          viaFork={!file.canPush}
          defaultTitle={
            file.isNewFile
              ? `Add ${doc.frontmatter.title || baseName}`
              : `Update ${baseName} content`
          }
          saving={save.saving}
          onConfirm={async (title, message) => {
            await save.save(file.serialized, title, message)
            setSaveOpen(false)
          }}
          onClose={() => setSaveOpen(false)}
        />
      )}

      {save.prUrl && <PullRequestCreated url={save.prUrl} />}
    </div>
  )
}
