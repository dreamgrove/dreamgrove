'use client'

import { useState, useEffect, Suspense, useRef, useMemo, useCallback } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { tags as t } from '@lezer/highlight'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MDXPreview from '@/components/MDXPreview'
import PageWrapper from '@/components/PageWrapper'
import { localeFromPath } from '@/lib/pageLocale'
import matter from 'gray-matter'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { languages } from '@codemirror/language-data'
import { EditorView, Decoration, DecorationSet, keymap } from '@codemirror/view'
import { darculaInit } from '@uiw/codemirror-theme-darcula'
import { StateField, StateEffect, RangeSet, Prec } from '@codemirror/state'

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { autocompletion } from '@codemirror/autocomplete'
import customMarkdownExtension from './customMarkdownExtension'
import SpellPicker, { useSpellSearch, type Spell, type PickerPosition } from './SpellPicker'
import { spellTokenExtension } from './spellWidget'
import { sectionGuideExtension } from './sectionGuides'
import { readDraft, writeDraft, clearDraft, formatDraftAge, type EditorDraft } from './draftStorage'
import { readNewPage, clearNewPage } from '@/lib/adminContent'
import { encodeUploads, uploadPath, type ImageUploads, type PendingImage } from '@/lib/imageUploads'
import { SPECS, type SpecId } from '@/data/specs'
import Image, { type StaticImageData } from 'next/image'
import EditorToolbar from './EditorToolbar'
import LinkPopover from './LinkPopover'
import { richModeExtension, type LinkAnchor, type RichHandlers } from './richMode'
import { BlockForm, BlockPalette } from './BlockDialog'
import {
  BLOCKS,
  buildBlock,
  emptyForm,
  findClose,
  findTagAt,
  formFromTag,
  serializeOpeningTag,
  type BlockDef,
  type FormState,
  type TagMatch,
} from './mdxBlocks'
import { headingLevel, insertBlock, insertLink, replaceRange, toggleInline } from './editorCommands'
import {
  ACCENT,
  BTN_GHOST,
  BTN_PRIMARY,
  CHECKBOX,
  Dialog,
  INPUT,
  Icon,
  TEXTAREA,
  LABEL,
} from './ui'
import balanceIcon from '../../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../../public/static/images/icons/guardian.jpg'
import logo from '../../../../public/static/images/logo.png'

// Maps a path folder (blog/<spec>/...) to the DB spec label used in spells.db.
const SPEC_FOLDERS: Record<string, string> = {
  balance: 'Balance',
  feral: 'Feral',
  guardian: 'Guardian',
  resto: 'Restoration',
  restoration: 'Restoration',
}

// Serializes the editor state back into a single .mdx document. Module scope so
// the loader, the draft autosave and the save-to-GitHub path all agree on the
// exact bytes — otherwise "is this draft different from the file?" would report
// spurious differences from frontmatter re-formatting alone.
function buildDocument(
  bodyContent: string,
  frontmatter: Record<string, any>,
  authorsInput: string
): string {
  const data: Record<string, any> = { ...frontmatter }
  const authors = authorsInput
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
  if (authors.length) data.authors = authors
  else delete data.authors
  if (Object.keys(data).length === 0) return bodyContent
  return matter.stringify(bodyContent, data)
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

function createErrorLineHighlighter() {
  const addErrorLine = StateEffect.define<{ line: number }>()
  const clearErrorLines = StateEffect.define<null>()

  const errorLineDecoration = Decoration.line({
    attributes: { class: 'bg-red-100 dark:bg-red-900/40' },
  })

  const errorLineField = StateField.define<DecorationSet>({
    create() {
      return RangeSet.empty
    },
    update(decorations, tr) {
      decorations = decorations.map(tr.changes)

      for (const effect of tr.effects) {
        if (effect.is(addErrorLine)) {
          const line = effect.value.line - 1
          const pos = tr.state.doc.line(Math.max(1, Math.min(line + 1, tr.state.doc.lines)))
          decorations = decorations.update({
            add: [errorLineDecoration.range(pos.from)],
          })
        } else if (effect.is(clearErrorLines)) {
          decorations = RangeSet.empty
        }
      }
      return decorations
    },
    provide(field) {
      return EditorView.decorations.from(field)
    },
  })

  return {
    field: errorLineField,
    extension: errorLineField,
    highlightLine: (view: EditorView, line: number) => {
      view.dispatch({
        effects: clearErrorLines.of(null),
      })
      view.dispatch({
        effects: addErrorLine.of({ line }),
      })
    },
    clearHighlights: (view: EditorView) => {
      view.dispatch({
        effects: clearErrorLines.of(null),
      })
    },
  }
}

export default function GenericEditPage() {
  return (
    <Suspense fallback={<StatusShell>Loading…</StatusShell>}>
      <EditPageWithParams />
    </Suspense>
  )
}

function StatusShell({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper
      title="Content editor"
      showTitle={false}
      variant="redesign"
      crumb={{ label: 'Editor', href: '/admin/select', color: ACCENT }}
    >
      <section className="dg-container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-sm border border-[#3a3a3a] bg-[#1f1f1f] px-8 py-10 text-center text-[.95rem] text-white/60">
          {children}
        </div>
      </section>
    </PageWrapper>
  )
}

function Switch({
  label,
  title,
  checked,
  onChange,
}: {
  label: string
  title: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      title={title}
      className="flex cursor-pointer items-center gap-2 text-[.8rem] font-semibold whitespace-nowrap text-white/60 select-none"
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={`relative h-4 w-7 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-white ${
          checked ? 'bg-[#d57f43]' : 'bg-[#3a3a3a]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-[left] ${
            checked ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </span>
      {label}
    </label>
  )
}

function DraftRecoveryBanner({
  draft,
  staleBaseline,
  onRestore,
  onDiscard,
}: {
  draft: EditorDraft
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
          This browser has edits to this file from {formatDraftAge(draft.savedAt)} that were never
          saved to GitHub.
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
          className="rounded-xs bg-amber-500 px-3.5 py-2 text-[.86rem] font-semibold text-[#2a2a2a] transition-[filter] hover:brightness-110"
        >
          Restore my edits
        </button>
      </div>
    </div>
  )
}

function EditPageWithParams() {
  const searchParams = useSearchParams()
  const filePath = searchParams.get('path')
  // Set by "New page" on /admin/select: the file only exists once the PR is merged
  const isNew = searchParams.get('new') === '1'

  if (!filePath) {
    return <MissingPathError />
  }

  return <FileEditor filePath={filePath} isNew={isNew} />
}

function MissingPathError() {
  return (
    <StatusShell>
      <h1 className="m-0 text-[1.6rem] font-semibold text-white">No file selected</h1>
      <p className="mt-3 mb-0 text-[.95rem] text-white/60">
        This editor needs a file path to work on.
      </p>
      <Link href="/admin/select" className="dg-back mt-8">
        <Icon name="back" size={16} />
        Select a file
      </Link>
    </StatusShell>
  )
}

function FileEditor({ filePath, isNew }: { filePath: string; isNew: boolean }) {
  const { data: session, status } = useSession()
  const [bodyContent, setBodyContent] = useState<string>('')
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({})
  // The frontmatter fields (title/patch/draft/authors/summary) are edited via
  // the form above the editor, not in the editor body.
  const [authorsInput, setAuthorsInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [isNewFile, setIsNewFile] = useState<boolean>(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [splitPosition, setSplitPosition] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [wordWrap, setWordWrap] = useState<boolean>(true)
  // MDX source or rendered rich text, same document either way
  const [editorMode, setEditorMode] = useState<'mdx' | 'rich'>('mdx')
  const [syncScroll, setSyncScroll] = useState<boolean>(true)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  // What the preview actually renders.
  const [previewContent, setPreviewContent] = useState<string>('')
  const [commitTitle, setCommitTitle] = useState<string>('')
  const [commitMessage, setCommitMessage] = useState<string>('')
  const [showCommitModal, setShowCommitModal] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  // Images uploaded from the Image block, they're committed with the page on save.
  const [uploads, setUploads] = useState<Map<string, PendingImage>>(() => new Map())
  const uploadsRef = useRef(uploads)
  uploadsRef.current = uploads
  useEffect(() => () => uploadsRef.current.forEach((img) => URL.revokeObjectURL(img.url)), [])
  const imageUploads: ImageUploads = {
    add: (file) => {
      const path = uploadPath(filePath, file)
      const url = URL.createObjectURL(file)
      setUploads((prev) => new Map(prev).set(path, { file, url }))
      return path
    },
    previewUrl: (src) => uploads.get(src)?.url,
  }
  // Uploads don't exist on the server yet read them from the blob
  const previewSource = useMemo(
    () => [...uploads].reduce((doc, [path, img]) => doc.split(path).join(img.url), previewContent),
    [uploads, previewContent]
  )
  // Crash recovery. `baselineRef` is the document as last fetched/saved, so the
  // autosave can tell real edits from an untouched file. `pendingDraft` is a
  // recovered draft awaiting the user's restore/discard decision.
  const baselineRef = useRef<string>('')
  const [pendingDraft, setPendingDraft] = useState<EditorDraft | null>(null)
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const editorRef = useRef<EditorView | null>(null)
  const [editorReady, setEditorReady] = useState<boolean>(false)
  const errorHighlighter = useMemo(() => createErrorLineHighlighter(), [])
  // Page details sidebar; open by default in the plain editor on wide screens
  const [showDetails, setShowDetails] = useState<boolean>(true)
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'mobile'>('desktop')

  // --- Block insert / edit forms ---
  const [showPalette, setShowPalette] = useState<boolean>(false)
  const [blockForm, setBlockForm] = useState<{
    block: BlockDef
    initial: FormState
    mode: 'insert' | 'edit'
    selection: string
    target?: TagMatch
    /** Replaced by the built block on submit (editing a markdown image) */
    replace?: { from: number; to: number }
  } | null>(null)
  const [linkPopover, setLinkPopover] = useState<{
    from: number
    to: number
    at?: LinkAnchor
  } | null>(null)
  const closeLinkPopover = useCallback(() => setLinkPopover(null), [])
  // Selected text when the palette opened; wrapping blocks use it as their content
  const blockSelectionRef = useRef<string>('')

  // Cursor-derived toolbar state
  const [cursor, setCursor] = useState<{
    line: number
    col: number
    heading: number
    tag: TagMatch | null
  }>({ line: 1, col: 1, heading: 0, tag: null })
  const cursorFrameRef = useRef<number>(0)
  const trackCursorRef = useRef<(view: EditorView) => void>(() => {})
  trackCursorRef.current = (view: EditorView) => {
    cancelAnimationFrame(cursorFrameRef.current)
    cursorFrameRef.current = requestAnimationFrame(() => {
      const { state } = view
      const head = state.selection.main.head
      const line = state.doc.lineAt(head)
      const tag = tagAt(view)
      setCursor((prev) =>
        prev.line === line.number &&
        prev.col === head - line.from + 1 &&
        prev.heading === headingLevel(state) &&
        prev.tag?.from === tag?.from &&
        prev.tag?.to === tag?.to
          ? prev
          : { line: line.number, col: head - line.from + 1, heading: headingLevel(state), tag }
      )
    })
  }

  // --- Ctrl+Space inline spell search ---
  // A "session" runs while the user types a query inline: sessionStartRef holds
  // the doc position where typing began;
  const [acOpen, setAcOpen] = useState<boolean>(false)
  const [acQuery, setAcQuery] = useState<string>('')
  const [acPos, setAcPos] = useState<PickerPosition>({ left: 0, top: 0 })
  const [acHighlighted, setAcHighlighted] = useState<number>(0)
  const sessionStartRef = useRef<number | null>(null)
  // Mirrors of state/results read by the (stable) editor keymap at event time.
  const resultsRef = useRef<Spell[]>([])
  const highlightedRef = useRef<number>(0)
  highlightedRef.current = acHighlighted

  // Reassigned each render so the stable keymap/updateListener always call the
  // latest closures while editorExtensions stays referentially stable.
  const closeSessionRef = useRef<() => void>(() => {})
  const updateSessionRef = useRef<(view: EditorView) => void>(() => {})
  const selectSpellRef = useRef<(spell: Spell) => void>(() => {})

  closeSessionRef.current = () => {
    sessionStartRef.current = null
    setAcOpen(false)
  }

  updateSessionRef.current = (view: EditorView) => {
    const start = sessionStartRef.current
    if (start == null) return
    const head = view.state.selection.main.head
    if (head < start) {
      closeSessionRef.current()
      return
    }
    const query = view.state.doc.sliceString(start, head)
    // A leading space cancels the search (e.g. hitting space right after
    // Ctrl+Space)
    if (query.startsWith(' ')) {
      closeSessionRef.current()
      return
    }
    const coords = view.coordsAtPos(start)
    if (coords) setAcPos({ left: coords.left, top: coords.bottom })
    setAcQuery(query)
    setAcHighlighted(0)
    setAcOpen(true)
  }

  selectSpellRef.current = (spell: Spell) => {
    const view = editorRef.current
    const start = sessionStartRef.current
    sessionStartRef.current = null // end the session before mutating the doc
    if (view && start != null) {
      const head = view.state.selection.main.head
      const insert = `!${spell.id}|${spell.name}!`
      view.dispatch({
        changes: { from: start, to: Math.max(start, head), insert },
        selection: { anchor: start + insert.length },
      })
      view.focus()
    }
    setAcOpen(false)
  }

  // Starts the inline spell search from the toolbar. A selection becomes the
  // initial query, and the chosen spell replaces it.
  const startSpellSearch = () => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    if (from !== to) view.dispatch({ selection: { anchor: to } })
    sessionStartRef.current = from
    updateSessionRef.current(view)
    view.focus()
  }

  const tagAt = (view: EditorView): TagMatch | null => {
    const { state } = view
    const head = state.selection.main.head
    const from = Math.max(0, head - 20000)
    const match = findTagAt(state.doc.sliceString(from, head + 20000), head - from)
    return match ? { ...match, from: match.from + from, to: match.to + from } : null
  }

  const openPalette = () => {
    const view = editorRef.current
    const sel = view?.state.selection.main
    blockSelectionRef.current = view && sel ? view.state.sliceDoc(sel.from, sel.to) : ''
    setShowPalette(true)
  }

  const openTagEditor = (): boolean => {
    const view = editorRef.current
    return !!view && openTagEditorAt(view.state.selection.main.head)
  }

  const openTagEditorAt = (pos: number): boolean => {
    const view = editorRef.current
    if (!view) return false
    const from = Math.max(0, pos - 20000)
    const match = findTagAt(view.state.doc.sliceString(from, pos + 20000), pos - from)
    const tag = match && { ...match, from: match.from + from, to: match.to + from }
    if (!tag) return false
    // A block with an optional body (Talents) is rewritten whole, tags and content
    const bodyField = tag.block.fields.find((f) => f.body)
    if (bodyField) {
      const doc = view.state.doc.toString()
      const close = tag.selfClosing ? undefined : findClose(doc, tag.tag, tag.to)
      const initial = formFromTag(tag)
      initial.values[bodyField.key] = close ? doc.slice(tag.to, close.from).trim() : ''
      setBlockForm({
        block: tag.block,
        initial,
        mode: 'edit',
        selection: '',
        replace: { from: tag.from, to: close?.to ?? tag.to },
      })
      return true
    }
    setBlockForm({
      block: tag.block,
      initial: formFromTag(tag),
      mode: 'edit',
      selection: '',
      target: tag,
    })
    return true
  }

  const submitBlock = (state: FormState) => {
    const view = editorRef.current
    if (!view || !blockForm) return
    const { block, target, selection, replace } = blockForm
    if (replace) {
      replaceRange(view, replace.from, replace.to, buildBlock(block, state, ''))
    } else if (target) {
      replaceRange(
        view,
        target.from,
        target.to,
        serializeOpeningTag(block, target.tag, state, target.selfClosing)
      )
    } else {
      const usesSelection = block.wraps || block.id === 'callout' || block.id === 'conditional'
      if (!usesSelection) {
        view.dispatch({ selection: { anchor: view.state.selection.main.to } })
      }
      insertBlock(view, buildBlock(block, state, usesSelection ? selection : ''))
    }
    setBlockForm(null)
  }

  // Opens the link popover on the link under the selection, or on the selection itself
  const openLinkEditor = () => {
    const view = editorRef.current
    if (!view) return
    const { from, to } = view.state.selection.main
    const line = view.state.doc.lineAt(from)
    for (const m of line.text.matchAll(/!?\[[^\]]*\]\([^)]*\)/g)) {
      const a = line.from + (m.index ?? 0)
      const b = a + m[0].length
      if (!m[0].startsWith('!') && from >= a && to <= b) return setLinkPopover({ from: a, to: b })
    }
    setLinkPopover({ from, to })
  }

  // Called from rich mode's widgets; reassigned each render like the other refs
  const richHandlersRef = useRef<RichHandlers>({
    editTag: () => {},
    openLink: () => {},
    editSnippet: () => {},
    imageUrl: (src) => src,
  })
  richHandlersRef.current = {
    editTag: (pos) => void openTagEditorAt(pos),
    openLink: (from, to, at) => setLinkPopover({ from, to, at }),
    editSnippet: (blockId, values, from, to) => {
      const block = BLOCKS.find((b) => b.id === blockId)!
      setBlockForm({
        block,
        initial: { values, passthrough: [], locked: [] },
        mode: 'edit',
        selection: '',
        replace: { from, to },
      })
    },
    imageUrl: (src) => uploads.get(src)?.url ?? src,
  }

  const actionsRef = useRef<{
    palette: () => void
    editTag: () => boolean
    save: () => void
    link: () => void
  }>({
    palette: () => {},
    editTag: () => false,
    save: () => {},
    link: () => {},
  })

  const fileName = filePath.split('/').pop() || 'Unknown'
  const pathParts = filePath.split('/')
  const group = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'root'

  const currentSpec = useMemo(() => {
    const seg = filePath
      .toLowerCase()
      .split('/')
      .find((s) => SPEC_FOLDERS[s])
    return seg ? SPEC_FOLDERS[seg] : null
  }, [filePath])

  const acResults = useSpellSearch(acQuery, currentSpec, acOpen)
  resultsRef.current = acResults

  const customHighlightStyle = useMemo(
    () =>
      HighlightStyle.define([
        { tag: tags.heading, fontWeight: 'bold', color: '#ffb86c' },
        { tag: tags.link, textDecoration: 'underline' },
        { tag: tags.emphasis, fontStyle: 'italic' },
        { tag: tags.bool, fontStyle: 'italic' },
        { tag: tags.strong, fontWeight: 'bold' },
        { tag: tags.comment, fontStyle: 'italic' },
        { tag: t.processingInstruction, color: '#FFFFFF', fontWeight: 'bold' }, // CustomInlineMark
        { tag: t.bool, color: '#d79a59' }, // CustomInlineElement
        { tag: t.operator, color: '#C5E6A6' }, // CustomInlineOperator
        { tag: t.special(t.content), color: '#ffb86c', fontWeight: 'bold' }, // ExclamationMark
        { tag: t.emphasis, color: '#cc8800' }, // ExclamationMarkPrimary
        { tag: t.strong, color: '#ffb86c', fontWeight: 'bold' }, // ExclamationMarkSecondary
        { tag: t.separator, color: '#AAAAAA' }, // ExclamationMarkSeparator
      ]),
    []
  )

  const mixedLanguageSupport = useMemo(
    () => [
      syntaxHighlighting(customHighlightStyle),
      EditorView.theme({
        '&': {
          fontSize: '14px',
          height: '100%',
        },
        '&.cm-focused': {
          outline: 'none',
        },
        '.cm-content': {
          fontFamily: 'Consolas, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          padding: '14px 0 40vh',
          color: '#FFF5E4',
          lineHeight: '1.6',
        },
        '.cm-line': {
          padding: '0 16px 0 10px',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(255,255,255,0.035)',
        },
        '.cm-gutters': {
          backgroundColor: '#1f1f1f',
          color: 'rgba(255,255,255,0.22)',
          border: 'none',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(255,255,255,0.035)',
          color: 'rgba(255,255,255,0.6)',
        },
        '.cm-scroller': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#4a4a4a transparent',
        },
        '.cm-spell-token': {
          color: '#ffb86c',
          fontWeight: 'normal',
          fontSize: '0.85em',
          border: '1px solid rgba(255,184,108,0.5)',
          borderRadius: '3px',
          padding: '0 3px',
          cursor: 'default',
          textDecoration: 'none',
        },
      }),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        addKeymap: true,
        extensions: [customMarkdownExtension],
        htmlTagLanguage: javascript({ jsx: true }),
      }),
    ],
    [customHighlightStyle]
  )

  const editorTheme = useMemo(
    () =>
      darculaInit({
        settings: {
          background: '#1f1f1f',
          gutterBackground: '#1f1f1f',
          caret: '#ffb86c',
          selection: 'rgba(213,127,67,0.28)',
          selectionMatch: 'rgba(213,127,67,0.14)',
          lineHighlight: 'rgba(255,255,255,0.035)',
        },
        styles: [
          { tag: t.tagName, color: '#B0DAF1' },
          { tag: t.attributeName, color: '#C5E6A6' },
          { tag: t.attributeValue, color: '#ffb86c' },
          { tag: t.operator, color: '#989898' },
        ],
      }),
    []
  )

  const editorExtensions = useMemo(
    () => [
      ...mixedLanguageSupport,
      errorHighlighter.extension,
      ...spellTokenExtension,
      // Rich mode draws sections as boxes instead
      ...(editorMode === 'mdx' ? sectionGuideExtension : []),
      ...(wordWrap || editorMode === 'rich' ? [EditorView.lineWrapping] : []),
      ...(editorMode === 'rich' ? [richModeExtension(richHandlersRef)] : []),
      autocompletion({ defaultKeymap: false }),
      Prec.highest(
        keymap.of([
          {
            key: 'Ctrl-Space',
            run: (view) => {
              sessionStartRef.current = view.state.selection.main.head
              updateSessionRef.current(view)
              return true
            },
          },
          {
            key: 'ArrowDown',
            run: () => {
              if (sessionStartRef.current == null) return false
              setAcHighlighted((h) => Math.min(h + 1, Math.max(0, resultsRef.current.length - 1)))
              return true
            },
          },
          {
            key: 'ArrowUp',
            run: () => {
              if (sessionStartRef.current == null) return false
              setAcHighlighted((h) => Math.max(0, h - 1))
              return true
            },
          },
          {
            key: 'Enter',
            run: () => {
              if (sessionStartRef.current == null) return false
              const spell = resultsRef.current[highlightedRef.current]
              if (spell) selectSpellRef.current(spell)
              else closeSessionRef.current()
              return true
            },
          },
          {
            key: 'Escape',
            run: () => {
              if (sessionStartRef.current == null) return false
              closeSessionRef.current()
              return true
            },
          },
          // Toolbar shortcuts
          { key: 'Mod-b', run: (view) => (toggleInline(view, '**'), true) },
          { key: 'Mod-i', run: (view) => (toggleInline(view, '*'), true) },
          {
            key: 'Mod-k',
            run: (view) => (
              editorMode === 'rich' ? actionsRef.current.link() : insertLink(view),
              true
            ),
          },
          { key: 'Mod-/', run: () => (actionsRef.current.palette(), true) },
          { key: 'Mod-e', run: () => actionsRef.current.editTag() },
          { key: 'Mod-s', run: () => (actionsRef.current.save(), true) },
        ])
      ),
      EditorView.updateListener.of((update) => {
        if (update.selectionSet || update.docChanged) trackCursorRef.current(update.view)
      }),
      EditorView.updateListener.of((update) => {
        const start = sessionStartRef.current
        if (start == null) return
        if (update.docChanged) {
          let touchedBefore = false
          update.changes.iterChangedRanges((fromA) => {
            if (fromA < start) touchedBefore = true
          })
          if (touchedBefore) {
            closeSessionRef.current()
            return
          }
          sessionStartRef.current = update.changes.mapPos(start, -1)
          updateSessionRef.current(update.view)
        } else if (update.selectionSet) {
          closeSessionRef.current()
        }
      }),
    ],
    [mixedLanguageSupport, errorHighlighter, wordWrap, editorMode]
  )

  const editorBasicSetup = useMemo(
    () => ({
      lineNumbers: editorMode === 'mdx',
      highlightActiveLine: editorMode === 'mdx',
      highlightActiveLineGutter: editorMode === 'mdx',
      foldGutter: editorMode === 'mdx',
      autocompletion: false,
      completionKeymap: false,
      closeBrackets: true,
      searchKeymap: true,
    }),
    [editorMode]
  )

  useEffect(() => {
    if (status === 'authenticated') {
      fetch(`/api/compendium/content?filePath=${filePath}`)
        .then((res) => {
          if (res.status === 403) {
            setHasPermission(false)
            throw new Error('You do not have permission to edit this file')
          }
          if (res.status === 404 && isNew) {
            return { content: readNewPage(filePath) ?? '', isNew: true }
          }
          if (!res.ok) throw new Error(`Error fetching content: ${res.statusText}`)
          return res.json()
        })
        .then((data) => {
          setIsNewFile(!!data.isNew)
          const content = data.content || ''
          let body = content
          let fm: Record<string, any> = {}
          let authors = ''
          try {
            const parsed = matter(content)
            body = parsed.content.replace(/^\n/, '')
            fm = parsed.data
            authors = Array.isArray(fm.authors) ? fm.authors.join(', ') : (fm.authors ?? '')
          } catch (err) {
            console.error('Error parsing markdown content:', err)
          }
          setBodyContent(body)
          setFrontmatter(fm)
          setAuthorsInput(authors)

          // Round-trip through the same serializer the autosave uses, so an
          // untouched file compares equal to its own draft.
          const baseline = buildDocument(body, fm, authors)
          baselineRef.current = baseline

          const draft = readDraft(filePath)
          if (draft) {
            const draftDoc = buildDocument(draft.body, draft.frontmatter, draft.authorsInput)
            // A draft identical to the file has nothing left to recover — that
            // happens after someone saves elsewhere, or reloads without editing.
            if (draftDoc === baseline) clearDraft(filePath)
            else setPendingDraft(draft)
          }

          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status, filePath, isNew])

  const handleBodyChange = (newBody: string) => {
    setBodyContent(newBody)
    setErrorLine(null)
  }

  const setField = (key: string, value: any) => {
    setFrontmatter((prev) => {
      if (value !== undefined) return { ...prev, [key]: value }
      const { [key]: _removed, ...rest } = prev
      return rest
    })
  }

  const currentDocument = () => buildDocument(bodyContent, frontmatter, authorsInput)

  const handleSaveClick = () => {
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    const defaultTitle = isNewFile
      ? `Add ${frontmatter.title || fileNameWithoutExt}`
      : `Update ${fileNameWithoutExt} content`
    setCommitTitle(defaultTitle)
    setCommitMessage('')
    setShowCommitModal(true)
  }

  const handleCommitSubmit = () => {
    setShowCommitModal(false)
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = () => {
    saveChanges()
  }

  const saveChanges = async () => {
    if (!session) return

    setSaving(true)
    setSaveMessage(null)

    try {
      const content = currentDocument()
      const images = await encodeUploads(content, uploads)
      const res = await fetch('/api/compendium/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          content,
          images,
          commitTitle,
          commitMessage,
          createPr: true,
        }),
      })

      if (res.status === 403) {
        setHasPermission(false)
        throw new Error('You do not have permission to edit this file')
      }

      if (!res.ok) {
        throw new Error(`Error saving content: ${res.statusText}`)
      }

      const data = await res.json()

      // Committed upstream: the draft has served its purpose, and leaving it
      // behind would re-offer already-merged work on the next visit.
      const saved = currentDocument()
      baselineRef.current = saved
      clearDraft(filePath)
      clearNewPage(filePath)
      setDraftSavedAt(null)

      if (data.prUrl) {
        setPrUrl(data.prUrl)
        setShowConfirmModal(false)

        setTimeout(() => {
          window.location.href = data.prUrl
        }, 2000)
      } else if (data.message) {
        setSaveMessage(data.message)
        setShowConfirmModal(false)

        // Legacy redirect logic
        const isCompendium =
          fileName.toLowerCase() === 'compendium.mdx' && filePath.includes('blog/')

        setTimeout(() => {
          if (isCompendium) {
            const blogSlug = filePath.split('/').slice(1, -1).join('/')
            router.push(`/blog/${blogSlug}/compendium`)
          } else {
            router.push('/admin/select')
          }
        }, 2000)
      } else {
        setShowConfirmModal(false)
        router.push('/admin/select')
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setShowConfirmModal(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const debouncedSavePosition = useRef(
    debounce((position: number) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('editor-split-position', position.toString())
      }
    }, 500)
  ).current

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
        const limitedPosition = Math.min(Math.max(newPosition, 20), 80)
        setSplitPosition(limitedPosition)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      debouncedSavePosition(splitPosition)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isDragging, splitPosition, debouncedSavePosition])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('editor-split-position')
      if (savedPosition) {
        setSplitPosition(Number(savedPosition))
      }
      const savedWrap = localStorage.getItem('editor-word-wrap')
      if (savedWrap !== null) {
        setWordWrap(savedWrap === 'true')
      }
      const savedSyncScroll = localStorage.getItem('editor-sync-scroll')
      if (savedSyncScroll !== null) {
        setSyncScroll(savedSyncScroll === 'true')
      }
      if (localStorage.getItem('editor-mode') === 'rich') setEditorMode('rich')
      const savedAutoRefresh = localStorage.getItem('editor-auto-refresh')
      if (savedAutoRefresh !== null) {
        setAutoRefresh(savedAutoRefresh === 'true')
      }
    }
  }, [])

  const makeToggle = (key: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setter((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, String(next))
      }
      return next
    })
  }

  const toggleWordWrap = makeToggle('editor-word-wrap', setWordWrap)
  const changeEditorMode = (mode: 'mdx' | 'rich') => {
    setEditorMode(mode)
    setLinkPopover(null)
    localStorage.setItem('editor-mode', mode)
  }
  const toggleSyncScroll = makeToggle('editor-sync-scroll', setSyncScroll)
  const toggleAutoRefresh = makeToggle('editor-auto-refresh', setAutoRefresh)

  // --- Draft autosave -------------------------------------------------------
  //
  // Mirror the in-progress document to localStorage shortly after typing stops.
  // A tab crash never fires beforeunload, so the debounce interval is the real
  // worst-case data loss window — keep it short.
  const persistDraft = (
    body: string,
    fm: Record<string, any>,
    authors: string,
    baseline: string
  ) => {
    if (buildDocument(body, fm, authors) === baseline) {
      // Back to the file's own contents: there is nothing to recover, and a
      // leftover draft would pop the recovery banner on every future load.
      clearDraft(filePath)
      setDraftSavedAt(null)
      return
    }
    const savedAt = writeDraft({
      filePath,
      body,
      frontmatter: fm,
      authorsInput: authors,
      baseline,
    })
    if (savedAt) setDraftSavedAt(savedAt)
  }
  const persistDraftRef = useRef(persistDraft)
  persistDraftRef.current = persistDraft

  const debouncedPersistDraft = useRef(
    debounce(
      (body: string, fm: Record<string, any>, authors: string, baseline: string) =>
        persistDraftRef.current(body, fm, authors, baseline),
      600
    )
  ).current

  useEffect(() => {
    // Don't write while the file is still loading (state is empty then, which
    // would look like "the user deleted everything") or while a recovered draft
    // is still on screen awaiting a decision — that would overwrite it.
    if (loading || pendingDraft) return
    debouncedPersistDraft(bodyContent, frontmatter, authorsInput, baselineRef.current)
  }, [bodyContent, frontmatter, authorsInput, loading, pendingDraft, debouncedPersistDraft])

  // Navigating away or backgrounding the tab can outrun the debounce, so flush
  // synchronously on the way out. pagehide covers the bfcache/mobile paths that
  // beforeunload misses.
  useEffect(() => {
    if (loading || pendingDraft) return
    const flush = () =>
      persistDraftRef.current(bodyContent, frontmatter, authorsInput, baselineRef.current)
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [bodyContent, frontmatter, authorsInput, loading, pendingDraft])

  const restoreDraft = () => {
    if (!pendingDraft) return
    setBodyContent(pendingDraft.body)
    setFrontmatter(pendingDraft.frontmatter)
    setAuthorsInput(pendingDraft.authorsInput)
    setDraftSavedAt(pendingDraft.savedAt)
    setPendingDraft(null)
  }

  const discardDraft = () => {
    clearDraft(filePath)
    setDraftSavedAt(null)
    setPendingDraft(null)
  }

  // Feed the preview while auto refresh is on. Re-enabling it (or the initial
  // load) pushes the current body through immediately.
  useEffect(() => {
    if (autoRefresh) setPreviewContent(bodyContent)
  }, [bodyContent, autoRefresh])

  const refreshPreview = () => setPreviewContent(bodyContent)

  // The editor now holds only the body, so the preview's line numbers map
  // straight across (no frontmatter offset needed).
  useEffect(() => {
    if (!editorRef.current) return

    if (errorLine !== null) {
      errorHighlighter.highlightLine(editorRef.current, errorLine)
    } else {
      errorHighlighter.clearHighlights(editorRef.current)
    }
  }, [errorLine, errorHighlighter])

  // In split mode, keep the editor and preview roughly scrolled together.
  //
  // The two panes have unrelated heights: the editor shows raw source (incl.
  // frontmatter) while the preview renders collapsibles, talent trees, etc.
  // whose height has nothing to do with their source length. So a plain
  // scrollTop ratio drifts badly. Instead we anchor on markdown headings
  // and <Collapsible> titles pairing them by text in source order, so smth
  // that doesn't render is skipped rather than shifting everything
  // after it. Between two matched anchors we interpolate linearly, so any drift
  // is bounded to a single section. With no matched anchors it degrades to the
  // old whole-pane ratio.
  useEffect(() => {
    if (viewMode !== 'split' || !syncScroll) return

    const view = editorRef.current
    const editorScroller = view?.scrollDOM
    const previewEl = previewRef.current
    if (!view || !editorScroller || !previewEl) return

    const normHeading = (text: string) =>
      text
        .replace(/^\s{0,3}#{1,6}\s+/, '')
        .replace(/[#*`_~]/g, '')
        .trim()
        .toLowerCase()

    // A preview heading inside a collapsed <Collapsible> is clipped to zero
    // height (grid-rows-[0fr] + overflow-hidden) rather than unmounted, so it
    // still reports a bogus getBoundingClientRect. Those bogus tops run past the
    // next visible anchor and would make the anchor list non-monotonic (which
    // inverts the mapping).
    const isClipped = (node: HTMLElement) => {
      let p = node.parentElement
      while (p && p !== previewEl) {
        if (p.offsetHeight === 0) return true
        p = p.parentElement
      }
      return false
    }

    // Scroll offsets (in each pane's own scroll space) of landmarks that appear
    // in BOTH panes: markdown headings and <Collapsible> titles
    const buildAnchors = () => {
      const doc = view.state.doc
      const editorHeads: { top: number; text: string }[] = []
      for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i)
        const collapsible = line.text.match(/<Collapsible\s+title\s*=\s*["']([^"']*)["']/)
        if (collapsible) {
          editorHeads.push({
            top: view.lineBlockAt(line.from).top,
            text: normHeading(collapsible[1]),
          })
        } else if (/^\s{0,3}#{1,6}\s/.test(line.text)) {
          editorHeads.push({ top: view.lineBlockAt(line.from).top, text: normHeading(line.text) })
        }
      }

      const previewBase = previewEl.getBoundingClientRect().top - previewEl.scrollTop
      const previewHeads: { top: number; text: string }[] = []
      previewEl.querySelectorAll('h1,h2,h3,h4,h5,h6,[data-collapsible-title]').forEach((el) => {
        const node = el as HTMLElement
        if (isClipped(node)) return // inside a collapsed section
        previewHeads.push({
          top: node.getBoundingClientRect().top - previewBase,
          text: normHeading(node.textContent || ''),
        })
      })

      // Match forward-only, and never accept an anchor that isn't strictly
      // below the previous one in either pane, so both arrays stay monotonic.
      const editor: number[] = []
      const preview: number[] = []
      let p = 0
      let lastE = -Infinity
      let lastP = -Infinity
      for (const eh of editorHeads) {
        if (!eh.text || eh.top <= lastE) continue
        for (let k = p; k < previewHeads.length; k++) {
          if (previewHeads[k].text === eh.text) {
            if (previewHeads[k].top > lastP) {
              editor.push(eh.top)
              preview.push(previewHeads[k].top)
              lastE = eh.top
              lastP = previewHeads[k].top
            }
            p = k + 1
            break
          }
        }
      }
      return { editor, preview }
    }

    // Map a scroll offset from one pane to the other through the anchor pairs,
    // padding with the pane edges (0 and max) so positions before the first and
    // after the last heading still interpolate sensibly.
    const mapScroll = (
      value: number,
      from: number[],
      fromMax: number,
      to: number[],
      toMax: number
    ) => {
      if (from.length === 0 || fromMax <= 0 || toMax <= 0) {
        return fromMax > 0 ? (value / fromMax) * toMax : 0
      }
      // Build the piecewise-linear map, padding with the pane edges. Clamp every
      // anchor into [0, max] since a landmark near the bottom can report a top past
      // the scrollable range, which would otherwise make a segment run backwards.
      const fromPts = [0]
      const toPts = [0]
      for (let i = 0; i < from.length; i++) {
        const f = Math.max(0, Math.min(from[i], fromMax))
        const t = Math.max(0, Math.min(to[i], toMax))
        if (f <= fromPts[fromPts.length - 1] || t <= toPts[toPts.length - 1]) continue
        fromPts.push(f)
        toPts.push(t)
      }
      fromPts.push(fromMax)
      toPts.push(toMax)
      let i = 0
      while (i < fromPts.length - 2 && value >= fromPts[i + 1]) i++
      const f0 = fromPts[i]
      const f1 = fromPts[i + 1]
      const frac = f1 > f0 ? (value - f0) / (f1 - f0) : 0
      return toPts[i] + frac * (toPts[i + 1] - toPts[i])
    }

    let locked = false
    const syncFrom = (which: 'editor' | 'preview') => () => {
      if (locked) return
      locked = true
      const { editor, preview } = buildAnchors()
      const editorMax = editorScroller.scrollHeight - editorScroller.clientHeight
      const previewMax = previewEl.scrollHeight - previewEl.clientHeight
      if (which === 'editor') {
        previewEl.scrollTop = mapScroll(
          editorScroller.scrollTop,
          editor,
          editorMax,
          preview,
          previewMax
        )
      } else {
        editorScroller.scrollTop = mapScroll(
          previewEl.scrollTop,
          preview,
          previewMax,
          editor,
          editorMax
        )
      }
      requestAnimationFrame(() => {
        locked = false
      })
    }

    const onEditorScroll = syncFrom('editor')
    const onPreviewScroll = syncFrom('preview')
    editorScroller.addEventListener('scroll', onEditorScroll, { passive: true })
    previewEl.addEventListener('scroll', onPreviewScroll, { passive: true })

    return () => {
      editorScroller.removeEventListener('scroll', onEditorScroll)
      previewEl.removeEventListener('scroll', onPreviewScroll)
    }
  }, [viewMode, editorReady, syncScroll])

  actionsRef.current = {
    palette: openPalette,
    editTag: openTagEditor,
    save: () => {
      if (!saving) handleSaveClick()
    },
    link: openLinkEditor,
  }

  useEffect(() => {
    if (window.innerWidth < 1024) setShowDetails(false)
  }, [])

  const changeViewMode = (mode: 'edit' | 'preview' | 'split') => {
    setViewMode(mode)
    setShowDetails(mode === 'edit' && window.innerWidth >= 1024)
  }

  if (status === 'loading') {
    return <StatusShell>Loading…</StatusShell>
  }

  if (status === 'unauthenticated') {
    return (
      <StatusShell>
        <h1 className="m-0 text-[1.6rem] font-semibold text-white">Sign in to edit</h1>
        <p className="mt-3 mb-0 text-[.95rem] leading-relaxed text-white/60">
          Sign in with GitHub to edit this page.
        </p>
        <button
          onClick={() => signIn('github')}
          className="mt-6 inline-flex items-center gap-2 rounded-xs bg-white px-5 py-3 text-[.95rem] font-semibold text-[#1f1f1f] transition-[filter] hover:brightness-90"
        >
          <Icon name="github" size={16} />
          Sign in with GitHub
        </button>
      </StatusShell>
    )
  }

  if (!hasPermission) {
    return (
      <StatusShell>
        <h1 className="m-0 text-[1.6rem] font-semibold text-white">Access denied</h1>
        <p className="mt-3 mb-0 text-[.95rem] leading-relaxed text-white/60">
          You don’t have write permission to the dreamgrove repository. Only contributors with write
          access can edit files.
        </p>
        <Link href="/admin/select" className="dg-back mt-8">
          <Icon name="back" size={16} />
          Back to pages
        </Link>
      </StatusShell>
    )
  }

  if (loading) {
    return <StatusShell>Loading content…</StatusShell>
  }

  if (error) {
    return (
      <StatusShell>
        <h1 className="m-0 text-[1.6rem] font-semibold text-white">Couldn’t load file</h1>
        <p className="mt-3 mb-0 text-[.95rem] text-red-400">{error}</p>
        <Link href="/admin/select" className="dg-back mt-8">
          <Icon name="back" size={16} />
          Back to pages
        </Link>
      </StatusShell>
    )
  }

  const isDirty = currentDocument() !== baselineRef.current
  const liveHref =
    !isNewFile && localeFromPath(filePath) === 'en' ? `/${filePath.replace(/\.mdx?$/, '')}` : null
  const showEditor = viewMode !== 'preview'
  const showPreview = viewMode !== 'edit'
  const detailsOpen = showDetails && showEditor

  return (
    // Full-screen app layout
    <div className="dark dg-page flex h-dvh flex-col overflow-hidden">
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
            <Link href="/admin/select" className="flex-shrink-0 hover:text-white">
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
              href="/admin/select"
              title="Back to pages"
              aria-label="Back to pages"
              className="-mr-1 -ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xs text-white/50 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            >
              <Icon name="back" size={16} />
            </Link>
            <h1 className="m-0 truncate text-[1.4rem] leading-tight font-semibold tracking-[-0.01em] text-white">
              {frontmatter.title || fileName}
            </h1>
            {isNewFile && <Badge accent>New</Badge>}
            {frontmatter.draft && <Badge>Draft</Badge>}
            <span
              className="hidden flex-shrink-0 items-center gap-1.5 pt-0.5 text-[.8rem] leading-none text-white/40 md:flex"
              title={
                draftSavedAt !== null
                  ? 'Kept in this browser only. Use “Save” to open a PR.'
                  : undefined
              }
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${isDirty ? 'bg-[#ffb86c]' : 'bg-white/25'}`}
              />
              {!isDirty
                ? 'No unsaved changes'
                : draftSavedAt !== null
                  ? `Unsaved · draft kept ${formatDraftAge(draftSavedAt)}`
                  : 'Unsaved changes'}
            </span>
          </div>
        </div>

        <div
          className="inline-flex flex-shrink-0 rounded-xs border border-[#3a3a3a] bg-[#1a1a1a] p-0.5"
          role="group"
          aria-label="View mode"
        >
          {(['edit', 'split', 'preview'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => changeViewMode(mode)}
              aria-pressed={viewMode === mode}
              className={`h-8 rounded-xs px-3.5 text-[.85rem] font-semibold capitalize transition-colors ${
                viewMode === mode ? 'bg-[#3a3a3a] text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* With the details panel open on wide screens, the divider lines up with
            its left border and the actions spread across its width (320px + the
            editor frame's 1px border) */}
        <div
          className={`flex flex-shrink-0 items-center gap-4 ${
            detailsOpen ? 'lg:w-[321px] lg:justify-between lg:gap-3' : ''
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
              className="flex h-9 w-9 items-center justify-center rounded-xs border border-[#3a3a3a] text-white/60 transition-colors hover:text-white"
            >
              <Icon name="external" size={16} />
            </a>
          )}
          {showEditor && (
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-pressed={detailsOpen}
              title={detailsOpen ? 'Hide page details' : 'Show page details'}
              aria-label={detailsOpen ? 'Hide page details' : 'Show page details'}
              className={`inline-flex h-9 items-center gap-2 rounded-xs border px-3 text-[.85rem] font-semibold transition-colors ${
                detailsOpen
                  ? 'border-white/50 bg-white/15 text-white hover:bg-white/20'
                  : 'border-white/30 bg-white/5 text-white/85 hover:border-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon name="details" size={16} />
              Details
            </button>
          )}
          <button
            onClick={handleSaveClick}
            disabled={saving || (!isDirty && !isNewFile)}
            title={!isDirty && !isNewFile ? 'Nothing to save yet' : 'Open a pull request (Ctrl+S)'}
            className={`${BTN_PRIMARY} h-9 flex-shrink-0`}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {pendingDraft && (
        <DraftRecoveryBanner
          draft={pendingDraft}
          staleBaseline={!!pendingDraft.baseline && pendingDraft.baseline !== baselineRef.current}
          onRestore={restoreDraft}
          onDiscard={discardDraft}
        />
      )}

      {saveMessage && (
        <div className="mx-4 mb-3 flex-shrink-0 rounded-sm border border-green-500/40 bg-green-500/10 px-4 py-3 text-[.9rem] text-green-200 sm:mx-6">
          {saveMessage}
        </div>
      )}

      <div className="relative mx-4 mb-4 flex min-h-0 flex-1 overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#1f1f1f] sm:mx-6 sm:mb-6">
        <div ref={containerRef} className="flex min-w-0 flex-1">
          {showEditor && (
            <div
              className={`flex min-w-0 flex-col ${viewMode === 'split' ? 'shrink-0' : 'flex-1'}`}
              style={viewMode === 'split' ? { width: `${splitPosition}%` } : undefined}
            >
              <EditorToolbar
                view={editorReady ? editorRef.current : null}
                heading={cursor.heading}
                activeTag={cursor.tag}
                wordWrap={wordWrap}
                mode={editorMode}
                onModeChange={changeEditorMode}
                onLink={openLinkEditor}
                onInsertBlock={openPalette}
                onEditTag={openTagEditor}
                onSpell={startSpellSearch}
                onToggleWrap={toggleWordWrap}
                onHelp={() => setShowHelp(true)}
              />
              <div className="relative min-h-0 flex-1">
                <CodeMirror
                  value={bodyContent}
                  onChange={handleBodyChange}
                  height="100%"
                  className="h-full"
                  theme={editorTheme}
                  extensions={editorExtensions}
                  placeholder="Start writing. Use the Component button to add custom elements."
                  basicSetup={editorBasicSetup}
                  onCreateEditor={(view) => {
                    editorRef.current = view
                    setEditorReady(true)
                  }}
                />
                {linkPopover && editorRef.current && (
                  <LinkPopover
                    key={`${linkPopover.from}-${linkPopover.to}`}
                    view={editorRef.current}
                    from={linkPopover.from}
                    to={linkPopover.to}
                    at={linkPopover.at}
                    onClose={closeLinkPopover}
                  />
                )}
                <SpellPicker
                  open={acOpen}
                  position={acPos}
                  results={acResults}
                  highlighted={acHighlighted}
                  hasQuery={acQuery.trim().length > 0}
                  currentSpec={currentSpec}
                  onHover={setAcHighlighted}
                  onSelect={(spell) => selectSpellRef.current(spell)}
                  onClose={() => closeSessionRef.current()}
                />
              </div>
              <StatusBar line={cursor.line} col={cursor.col} text={bodyContent} />
            </div>
          )}

          {viewMode === 'split' && (
            <div
              className="group relative z-10 -mx-1 flex w-2 shrink-0 cursor-col-resize items-stretch justify-center"
              onMouseDown={handleDragStart}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize editor and preview"
            >
              <div
                className={`w-px transition-colors ${
                  isDragging ? 'bg-[#d57f43]' : 'bg-[#3a3a3a] group-hover:bg-[#d57f43]/60'
                }`}
              />
            </div>
          )}

          {showPreview && (
            <div className="flex min-w-0 flex-1 flex-col bg-[#262626]">
              <div className="flex flex-shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-[#3a3a3a] bg-[#1f1f1f] px-3 py-1.5 [scrollbar-width:none]">
                <div
                  className="inline-flex flex-shrink-0 rounded-xs border border-[#3a3a3a] p-0.5"
                  role="group"
                  aria-label="Preview width"
                >
                  {(['desktop', 'mobile'] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setPreviewWidth(w)}
                      aria-pressed={previewWidth === w}
                      className={`h-7 rounded-xs px-2.5 text-[.8rem] font-semibold capitalize transition-colors ${
                        previewWidth === w
                          ? 'bg-[#3a3a3a] text-white'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex flex-shrink-0 items-center gap-4">
                  {viewMode === 'split' && (
                    <Switch
                      label="Sync scroll"
                      title="Keep the preview scrolled to the same section as the editor"
                      checked={syncScroll}
                      onChange={toggleSyncScroll}
                    />
                  )}
                  <Switch
                    label="Live"
                    title="Re-render the preview as you type"
                    checked={autoRefresh}
                    onChange={toggleAutoRefresh}
                  />
                  {!autoRefresh && (
                    <button
                      type="button"
                      onClick={refreshPreview}
                      className="inline-flex h-7 items-center gap-1.5 rounded-xs border border-[#3a3a3a] px-2.5 text-[.8rem] font-semibold text-white/70 hover:bg-[#2a2a2a] hover:text-white"
                    >
                      <Icon name="refresh" size={13} />
                      Refresh
                    </button>
                  )}
                </div>
              </div>
              <div
                ref={previewRef}
                className={`min-h-0 flex-1 overflow-auto ${previewWidth === 'mobile' ? 'bg-[#1a1a1a]' : ''}`}
                suppressHydrationWarning
              >
                <div
                  className={`mx-auto min-h-full bg-[#262626] ${
                    previewWidth === 'mobile'
                      ? 'max-w-[390px] border-x border-[#3a3a3a] px-4 py-6'
                      : viewMode === 'preview'
                        ? 'max-w-4xl px-6 py-10 sm:px-10'
                        : 'px-6 py-8 sm:px-10'
                  }`}
                >
                  <Suspense
                    fallback={<div className="text-sm text-white/40 italic">Loading preview…</div>}
                  >
                    {filePath.includes('raids') || filePath.includes('dungeons') ? (
                      <MDXPreview
                        setErrorLine={setErrorLine}
                        content={'<RoleSelector isPreview={true}/>' + previewSource}
                      />
                    ) : (
                      <MDXPreview
                        setErrorLine={setErrorLine}
                        content={previewSource}
                        locale={localeFromPath(filePath)}
                      />
                    )}
                  </Suspense>
                </div>
              </div>
            </div>
          )}
        </div>

        {detailsOpen && (
          <DetailsSidebar
            showSpecs={
              /^(blog|dungeons|raids)\//.test(filePath) && !filePath.endsWith('/compendium.mdx')
            }
            frontmatter={frontmatter}
            authorsInput={authorsInput}
            setAuthorsInput={setAuthorsInput}
            setField={setField}
            onClose={() => setShowDetails(false)}
          />
        )}
      </div>

      {showPalette && (
        <BlockPalette
          filePath={filePath}
          onClose={() => setShowPalette(false)}
          onPick={(block) => {
            setShowPalette(false)
            setBlockForm({
              block,
              initial: emptyForm(block),
              mode: 'insert',
              selection: blockSelectionRef.current,
            })
          }}
        />
      )}

      {blockForm && (
        <BlockForm
          block={blockForm.block}
          initial={blockForm.initial}
          mode={blockForm.mode}
          currentSpec={currentSpec}
          images={imageUploads}
          onClose={() => {
            setBlockForm(null)
            editorRef.current?.focus()
          }}
          onBack={
            blockForm.mode === 'insert'
              ? () => {
                  setBlockForm(null)
                  setShowPalette(true)
                }
              : undefined
          }
          onSubmit={submitBlock}
        />
      )}

      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}

      {(showCommitModal || showConfirmModal) && (
        <SaveDialog
          step={showConfirmModal ? 'confirm' : 'compose'}
          filePath={filePath}
          isNewFile={isNewFile}
          title={commitTitle}
          setTitle={setCommitTitle}
          message={commitMessage}
          setMessage={setCommitMessage}
          onContinue={handleCommitSubmit}
          onBack={() => {
            setShowConfirmModal(false)
            setShowCommitModal(true)
          }}
          onConfirm={handleConfirmSubmit}
          onClose={() => {
            setShowCommitModal(false)
            setShowConfirmModal(false)
          }}
          isLoading={saving}
        />
      )}

      {prUrl && (
        <Dialog
          title="Pull request created"
          onClose={() => {}}
          dismissable={false}
          width="max-w-md"
        >
          <p className="m-0 text-[.92rem] leading-relaxed text-white/70">
            Your changes have been submitted as a pull request. You’ll be redirected to GitHub in a
            moment.
          </p>
          <a
            href={prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_PRIMARY} mt-5`}
          >
            View pull request
            <Icon name="external" size={14} />
          </a>
        </Dialog>
      )}
    </div>
  )
}

function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`flex-shrink-0 rounded-xs border px-1.5 py-px text-[.68rem] font-semibold tracking-wider uppercase ${
        accent ? 'border-[#d57f43]/50 text-[#ffb86c]' : 'border-white/20 text-white/60'
      }`}
    >
      {children}
    </span>
  )
}

function StatusBar({ line, col, text }: { line: number; col: number; text: string }) {
  const words = useMemo(() => {
    const prose = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/!(\d+\|)?([^!\n]+)!/g, '$2')
      .replace(/[#>*_`~[\]()|-]/g, ' ')
    return (prose.match(/[A-Za-z0-9À-￿']+/g) ?? []).length
  }, [text])
  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t border-[#3a3a3a] bg-[#1f1f1f] px-3 py-1 text-[.74rem] text-white/40 tabular-nums">
      <span className="flex gap-3 whitespace-nowrap">
        <span>
          Ln {line}, Col {col}
        </span>
        <span>{words.toLocaleString('en-US')} words</span>
      </span>
      <span className="hidden truncate sm:inline">
        <Kbd>Ctrl</Kbd>+<Kbd>/</Kbd> component · <Kbd>Ctrl</Kbd>+<Kbd>Space</Kbd> spell · MDX
      </span>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[2px] border border-[#3a3a3a] bg-[#262626] px-1 font-sans text-[.7rem] text-white/50">
      {children}
    </kbd>
  )
}

function DetailsSidebar({
  showSpecs,
  frontmatter,
  authorsInput,
  setAuthorsInput,
  setField,
  onClose,
}: {
  showSpecs: boolean
  frontmatter: Record<string, any>
  authorsInput: string
  setAuthorsInput: (value: string) => void
  setField: (key: string, value: any) => void
  onClose: () => void
}) {
  return (
    <aside
      aria-label="Page details"
      className="absolute inset-y-0 right-0 z-20 flex w-[min(320px,100%)] flex-shrink-0 flex-col border-l border-[#3a3a3a] bg-[#1f1f1f] shadow-2xl lg:static lg:shadow-none"
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[#3a3a3a] px-5 py-1.5">
        {/* pt-px: thiccboi's caps sit ~0.5px above the line box's centre */}
        <h2 className="m-0 flex h-8 items-center pt-px text-[.72rem] leading-none font-semibold tracking-[0.2em] text-white/50 uppercase">
          Page details
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Hide page details"
          className="-mr-2 flex h-8 w-8 items-center justify-center rounded-xs text-white/40 hover:bg-[#2a2a2a] hover:text-white"
        >
          <Icon name="close" size={14} />
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
        {showSpecs && <SpecsField frontmatter={frontmatter} setField={setField} />}
        <label className="flex cursor-pointer items-center gap-3 rounded-xs border border-[#3a3a3a] bg-[#242424] p-3">
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

function SpecsField({
  frontmatter,
  setField,
}: {
  frontmatter: Record<string, any>
  setField: (key: string, value: any) => void
}) {
  const specs: string[] = Array.isArray(frontmatter.specs) ? frontmatter.specs : []
  const toggle = (id: string) => {
    const next = specs.includes(id) ? specs.filter((s) => s !== id) : [...specs, id]
    setField('specs', next.length ? next : undefined)
  }

  return (
    <div>
      <span className={LABEL}>Show under</span>
      <div className="grid grid-cols-2 gap-1 rounded-xs border border-[#3a3a3a] bg-[#242424] p-1">
        {SPECS.map((s) => {
          const on = specs.includes(s.id)
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(s.id)}
              className={`flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xs px-1.5 text-[.82rem] leading-none font-semibold transition-colors ${
                on ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
              style={on ? { background: `${s.color}33` } : undefined}
            >
              <Image
                src={SPEC_ICONS[s.id]}
                alt=""
                width={16}
                height={16}
                className={`h-4 w-4 flex-shrink-0 rounded-xs object-cover ${on ? '' : 'opacity-50 grayscale'}`}
              />
              <span className="truncate">{s.id === 'resto' ? 'Resto' : s.name}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 mb-0 text-[.76rem] text-white/35">
        {specs.length
          ? 'Listed on the selected spec pages.'
          : 'No spec: listed under general guides.'}
      </p>
    </div>
  )
}

const SPEC_ICONS: Record<SpecId, StaticImageData> = {
  balance: balanceIcon,
  feral: feralIcon,
  guardian: guardianIcon,
  resto: restoIcon,
}

function SaveDialog({
  step,
  filePath,
  isNewFile,
  title,
  setTitle,
  message,
  setMessage,
  onContinue,
  onBack,
  onConfirm,
  onClose,
  isLoading,
}: {
  step: 'compose' | 'confirm'
  filePath: string
  isNewFile: boolean
  title: string
  setTitle: (title: string) => void
  message: string
  setMessage: (message: string) => void
  onContinue: () => void
  onBack: () => void
  onConfirm: () => void
  onClose: () => void
  isLoading: boolean
}) {
  if (step === 'compose') {
    return (
      <Dialog
        title="Save changes"
        subtitle="Your edits are submitted as a pull request for review."
        onClose={onClose}
        footer={
          <>
            <button type="button" onClick={onClose} className={BTN_GHOST}>
              Cancel
            </button>
            <button
              type="button"
              onClick={onContinue}
              disabled={!title.trim()}
              className={BTN_PRIMARY}
            >
              Continue
            </button>
          </>
        }
      >
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (title.trim()) onContinue()
          }}
        >
          <div>
            <label htmlFor="commit-title" className={LABEL}>
              Title<span className="ml-0.5 text-[#d57f43]">*</span>
            </label>
            <input
              id="commit-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={INPUT}
              placeholder="Brief description of changes"
              required
            />
          </div>
          <div>
            <label htmlFor="commit-message" className={LABEL}>
              Description <span className="font-normal text-white/35">(optional)</span>
            </label>
            <textarea
              id="commit-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={TEXTAREA}
              placeholder="More detailed explanation of changes"
              rows={4}
            />
          </div>
        </form>
      </Dialog>
    )
  }

  return (
    <Dialog
      title="Create pull request?"
      onClose={isLoading ? () => {} : onClose}
      dismissable={!isLoading}
      footer={
        <>
          <button type="button" onClick={onBack} disabled={isLoading} className={BTN_GHOST}>
            Back
          </button>
          <button type="button" onClick={onConfirm} disabled={isLoading} className={BTN_PRIMARY}>
            {isLoading ? 'Creating PR…' : 'Create PR'}
          </button>
        </>
      }
    >
      <dl className="m-0 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-[.9rem]">
        <dt className="text-white/45">File</dt>
        <dd className="m-0 font-mono text-[.82rem] break-all text-white/80">
          {filePath}
          {isNewFile && <span className="ml-2 font-sans text-[#ffb86c]">(new)</span>}
        </dd>
        <dt className="text-white/45">Title</dt>
        <dd className="m-0 text-white">{title}</dd>
        {message && (
          <>
            <dt className="text-white/45">Description</dt>
            <dd className="m-0 whitespace-pre-wrap text-white/80">{message}</dd>
          </>
        )}
      </dl>
      <p className="mt-5 mb-0 text-[.85rem] text-white/50">
        This will create a pull request with your changes. Are you sure you want to proceed?
      </p>
    </Dialog>
  )
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  const code = 'rounded-[2px] bg-[#2a2a2a] px-1.5 py-0.5 font-mono text-[.8rem] text-[#ffb86c]'
  const rows: [string, React.ReactNode][] = [
    [
      'Spell tooltip',
      <>
        <code className={code}>!8921|Moonfire!</code> or <code className={code}>!Moonfire!</code>.
        Press <Kbd>Ctrl</Kbd>+<Kbd>Space</Kbd> to search spells while typing.
      </>,
    ],
    [
      'Coloured text',
      <>
        <code className={code}>:red[text]</code> or <code className={code}>:#ff7d0a[text]</code>
      </>,
    ],
    [
      'Conditional line',
      <>
        Start a line or list item with <code className={code}>[*Incarnation]</code> to show it only
        while that toggle is ticked. Combine with <code className={code}>&amp;&amp;</code>, negate
        with <code className={code}>~</code>.
      </>,
    ],
    [
      'Callouts',
      <>
        <code className={code}>&gt; [!TIP]</code> on the first line of a quote. Also NOTE,
        IMPORTANT, WARNING, CAUTION.
      </>,
    ],
    [
      'Components',
      <>
        Use <strong className="text-white">Component</strong> in the toolbar (<Kbd>Ctrl</Kbd>+
        <Kbd>/</Kbd>). Put the cursor inside an existing component’s opening tag and press{' '}
        <strong className="text-white">Edit</strong> (<Kbd>Ctrl</Kbd>+<Kbd>E</Kbd>) to change it in
        a form.
      </>,
    ],
    [
      'HTML & JSX',
      <>
        Any HTML works, written as JSX: <code className={code}>className</code> instead of{' '}
        <code className={code}>class</code>, and{' '}
        <code className={code}>{'style={{ color: "red" }}'}</code>.
      </>,
    ],
  ]
  const keys: [string, string][] = [
    ['Ctrl+B', 'Bold'],
    ['Ctrl+I', 'Italic'],
    ['Ctrl+K', 'Link'],
    ['Ctrl+/', 'Insert component'],
    ['Ctrl+E', 'Edit component at cursor'],
    ['Ctrl+Space', 'Spell search'],
    ['Ctrl+S', 'Save changes'],
    ['Ctrl+F', 'Find & replace'],
  ]

  return (
    <Dialog title="Writing help" onClose={onClose} width="max-w-2xl">
      <dl className="m-0 grid grid-cols-1 gap-x-5 gap-y-4 text-[.88rem] leading-relaxed sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        {rows.map(([term, desc]) => (
          <div key={term} className="contents">
            <dt className="font-semibold text-white/85">{term}</dt>
            <dd className="m-0 -mt-3 text-white/60 sm:mt-0">{desc}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mt-7 mb-3 text-[.72rem] font-semibold tracking-[0.2em] text-white/40 uppercase">
        Shortcuts
      </h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-[.85rem] sm:grid-cols-2">
        {keys.map(([k, label]) => (
          <div key={k} className="flex items-center justify-between gap-3 text-white/60">
            <span>{label}</span>
            <span className="flex gap-1">
              {k.split('+').map((part) => (
                <Kbd key={part}>{part}</Kbd>
              ))}
            </span>
          </div>
        ))}
      </div>
      <Link
        href="/admin/edit/README.md"
        target="_blank"
        className="mt-6 inline-block text-[.88rem] font-semibold text-[#d57f43] hover:underline"
      >
        View full documentation
      </Link>
    </Dialog>
  )
}
