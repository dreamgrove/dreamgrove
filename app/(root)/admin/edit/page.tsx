'use client'

import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { tags as t } from '@lezer/highlight'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MDXPreview from '@/components/MDXPreview'
import { FaQuestion } from 'react-icons/fa'
import { MdWrapText } from 'react-icons/md'
import matter from 'gray-matter'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { languages } from '@codemirror/language-data'
import { EditorView, Decoration, DecorationSet, keymap } from '@codemirror/view'
import { darcula, darculaInit } from '@uiw/codemirror-theme-darcula'
import { StateField, StateEffect, RangeSet, Prec } from '@codemirror/state'

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { autocompletion } from '@codemirror/autocomplete'
import customMarkdownExtension from './customMarkdownExtension'
import SpellPicker, { useSpellSearch, type Spell, type PickerPosition } from './SpellPicker'
import { spellTokenExtension } from './spellWidget'
import { sectionGuideExtension } from './sectionGuides'
import RoleSelector from '@/components/custom/Dungeons/RoleSelector'

// Maps a path folder (blog/<spec>/...) to the DB spec label used in spells.db.
const SPEC_FOLDERS: Record<string, string> = {
  balance: 'Balance',
  feral: 'Feral',
  guardian: 'Guardian',
  resto: 'Restoration',
  restoration: 'Restoration',
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
    <Suspense fallback={<CenteredMessage>Loading…</CenteredMessage>}>
      <EditPageWithParams />
    </Suspense>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-[#323232]">
        {children}
      </div>
    </div>
  )
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
      {children}
    </div>
  )
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function EditPageWithParams() {
  const searchParams = useSearchParams()
  const filePath = searchParams.get('path')

  if (!filePath) {
    return <MissingPathError />
  }

  return <FileEditor filePath={filePath} />
}

function MissingPathError() {
  return (
    <Centered>
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        No file selected
      </h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        This editor needs a file path to work on.
      </p>
      <Link
        href="/admin/select"
        className="mt-5 inline-flex rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        Select a file
      </Link>
    </Centered>
  )
}

function FileEditor({ filePath }: { filePath: string }) {
  const { data: session, status } = useSession()
  const [bodyContent, setBodyContent] = useState<string>('')
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({})
  // The frontmatter fields (title/patch/draft/authors/summary) are edited via
  // the form above the editor, not in the editor body. `authorsInput` holds the
  // raw comma-separated text
  const [authorsInput, setAuthorsInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [splitPosition, setSplitPosition] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [wordWrap, setWordWrap] = useState<boolean>(true)
  const [commitTitle, setCommitTitle] = useState<string>('')
  const [commitMessage, setCommitMessage] = useState<string>('')
  const [showCommitModal, setShowCommitModal] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const editorRef = useRef<EditorView | null>(null)
  const [editorReady, setEditorReady] = useState<boolean>(false)
  const errorHighlighter = useMemo(() => createErrorLineHighlighter(), [])

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
          height: '85vh',
          color: 'green',
        },
        '.cm-content': {
          fontFamily: 'Consolas, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          padding: '10px 0',
          color: '#FFF5E4',
        },
        '.cm-line': {
          padding: '0 10px',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(255,255,255,0.05)',
        },
        '.cm-gutters': {
          backgroundColor: 'transparent',
          border: 'none',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(255,255,255,0.05)',
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
      ...sectionGuideExtension,
      ...(wordWrap ? [EditorView.lineWrapping] : []),
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
        ])
      ),
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
    [mixedLanguageSupport, errorHighlighter, wordWrap]
  )

  const editorBasicSetup = useMemo(
    () => ({
      lineNumbers: true,
      highlightActiveLine: true,
      highlightActiveLineGutter: true,
      foldGutter: true,
      autocompletion: false,
      completionKeymap: false,
      closeBrackets: true,
      searchKeymap: true,
    }),
    []
  )

  useEffect(() => {
    if (status === 'authenticated') {
      fetch(`/api/compendium/content?filePath=${filePath}`)
        .then((res) => {
          if (res.status === 403) {
            setHasPermission(false)
            throw new Error('You do not have permission to edit this file')
          }
          if (!res.ok) throw new Error(`Error fetching content: ${res.statusText}`)
          return res.json()
        })
        .then((data) => {
          const content = data.content || ''
          try {
            const { content: body, data: fm } = matter(content)
            setBodyContent(body.replace(/^\n/, ''))
            setFrontmatter(fm)
            setAuthorsInput(Array.isArray(fm.authors) ? fm.authors.join(', ') : (fm.authors ?? ''))
          } catch (err) {
            console.error('Error parsing markdown content:', err)
            setBodyContent(content)
          }
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status, filePath])

  const handleBodyChange = (newBody: string) => {
    setBodyContent(newBody)
    setErrorLine(null)
  }

  const setField = (key: string, value: any) => {
    setFrontmatter((prev) => ({ ...prev, [key]: value }))
  }

  const buildDocument = () => {
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

  const handleSaveClick = () => {
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    const defaultTitle = `Update ${fileNameWithoutExt} content`
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
      const res = await fetch('/api/compendium/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          content: buildDocument(),
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

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
      const limitedPosition = Math.min(Math.max(newPosition, 20), 80)
      setSplitPosition(limitedPosition)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
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
    }
  }, [])

  const toggleWordWrap = () => {
    setWordWrap((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('editor-word-wrap', String(next))
      }
      return next
    })
  }

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
    if (viewMode !== 'split') return

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
  }, [viewMode, editorReady])

  if (status === 'loading') {
    return <CenteredMessage>Loading…</CenteredMessage>
  }

  if (status === 'unauthenticated') {
    return (
      <Centered>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Authentication required
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Sign in with GitHub to edit this page.
        </p>
        <button
          onClick={() => signIn('github')}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          <GithubGlyph />
          Sign in with GitHub
        </button>
      </Centered>
    )
  }

  if (!hasPermission) {
    return (
      <Centered>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          You don’t have write permission to the dreamgrove repository. Only contributors with write
          access can edit files.
        </p>
        <Link
          href="/admin/select"
          className="mt-5 inline-flex rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Back to file selection
        </Link>
      </Centered>
    )
  }

  if (loading) {
    return <CenteredMessage>Loading content…</CenteredMessage>
  }

  if (error) {
    return (
      <Centered>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Couldn’t load file
        </h1>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        <Link
          href="/admin/select"
          className="mt-5 inline-flex rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Back to file selection
        </Link>
      </Centered>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F3F4] dark:bg-[#282828]">
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-[#323232]/95">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Link
                  href="/admin/select"
                  className="hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  Pages
                </Link>
                <span>/</span>
                <span className="capitalize">{group}</span>
              </div>
              <h1 className="truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {fileName}
              </h1>
            </div>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              title="Help"
              aria-label="Toggle help"
            >
              <FaQuestion size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="inline-flex rounded-md border border-neutral-200 p-0.5 dark:border-neutral-700"
              role="group"
              aria-label="View mode"
            >
              {(['edit', 'split', 'preview'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`rounded px-3 py-1 text-sm font-medium capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <Link
              href="/admin/select"
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Cancel
            </Link>
            <button
              onClick={handleSaveClick}
              disabled={saving}
              className="rounded-md bg-[#d57f43] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#c06f37] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-5 sm:px-6">
        {showHelp && (
          <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-[#323232]">
            <h2 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
              Quick help
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-neutral-600 dark:text-neutral-300">
              <li>Edit the content using Markdown and MDX syntax</li>
              <li>
                Frontmatter can be edited directly at the top of the file between{' '}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  ---
                </code>{' '}
                delimiters
              </li>
              <li>
                Use{' '}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  !47032|Spell!
                </code>{' '}
                for Wowhead links
              </li>
              <li>
                Use{' '}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  &lt;Talents talent="A1B2C3..."/&gt;
                </code>{' '}
                for talent trees
              </li>
              <li>
                Use{' '}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs dark:bg-neutral-800">
                  &lt;Collapsible title="Title"&gt;Content&lt;/Collapsible&gt;
                </code>{' '}
                for collapsible sections
              </li>
            </ul>
            <Link
              href="/admin/edit/README.md"
              target="_blank"
              className="mt-2 inline-block font-medium text-[#d57f43] hover:underline"
            >
              View full documentation
            </Link>
          </div>
        )}

        {saveMessage && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
            {saveMessage}
          </div>
        )}

        <MetadataPanel
          frontmatter={frontmatter}
          authorsInput={authorsInput}
          setAuthorsInput={setAuthorsInput}
          setField={setField}
        />

        <div
          ref={containerRef}
          className={`${viewMode === 'split' ? 'relative flex gap-0' : ''}`}
          onMouseMove={viewMode === 'split' ? handleDragMove : undefined}
          onMouseUp={viewMode === 'split' ? handleDragEnd : undefined}
        >
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div
              className={`relative ${viewMode === 'split' ? 'h-[85vh] shrink-0' : 'sticky top-0 h-[85vh] w-full'}`}
              style={viewMode === 'split' ? { width: `${splitPosition}%` } : undefined}
            >
              <button
                onClick={toggleWordWrap}
                aria-pressed={wordWrap}
                title={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
                aria-label={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
                className={`absolute top-2 right-5 z-10 flex items-center justify-center rounded-md border p-[5px] shadow-sm transition-colors ${
                  wordWrap
                    ? 'border-[#d57f43] bg-[#d57f43] text-white hover:bg-[#c06f37]'
                    : 'border-neutral-600 bg-[#3a3a3a] text-neutral-300 hover:bg-[#454545]'
                }`}
              >
                <MdWrapText size={16} />
              </button>
              <CodeMirror
                value={bodyContent}
                onChange={handleBodyChange}
                className="h-full overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700"
                theme={editorTheme}
                extensions={editorExtensions}
                placeholder="Enter content with frontmatter and MDX..."
                basicSetup={editorBasicSetup}
                onCreateEditor={(view) => {
                  editorRef.current = view
                  setEditorReady(true)
                }}
              />
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
          )}

          {viewMode === 'split' && (
            <div
              className="group relative z-10 flex w-3 shrink-0 cursor-col-resize items-center justify-center"
              onMouseDown={handleDragStart}
            >
              <div
                className={`h-10 w-1 rounded-full transition-colors ${
                  isDragging
                    ? 'bg-[#d57f43]'
                    : 'bg-neutral-300 group-hover:bg-neutral-400 dark:bg-neutral-600 dark:group-hover:bg-neutral-500'
                }`}
              />
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              ref={previewRef}
              className={`${viewMode === 'split' ? 'h-[85vh] min-w-0 flex-1 px-10' : 'px:20 min-h-[70vh] w-full lg:px-80'} max-w-none overflow-auto rounded-lg border border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-[#323232]`}
              suppressHydrationWarning
            >
              <Suspense
                fallback={<div className="text-sm text-neutral-500 italic">Loading preview...</div>}
              >
                {filePath.includes('raids') || filePath.includes('dungeons') ? (
                  <MDXPreview
                    setErrorLine={setErrorLine}
                    content={'<RoleSelector isPreview={true}/>' + bodyContent}
                  />
                ) : (
                  <MDXPreview setErrorLine={setErrorLine} content={bodyContent} />
                )}
              </Suspense>
            </div>
          )}
        </div>
      </div>

      <CommitModal
        isOpen={showCommitModal}
        onClose={() => setShowCommitModal(false)}
        title={commitTitle}
        setTitle={setCommitTitle}
        message={commitMessage}
        setMessage={setCommitMessage}
        onSubmit={handleCommitSubmit}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={commitTitle}
        message={commitMessage}
        onConfirm={handleConfirmSubmit}
        isLoading={saving}
      />

      <PrSuccessModal isOpen={!!prUrl} prUrl={prUrl} />
    </div>
  )
}

function MetadataPanel({
  frontmatter,
  authorsInput,
  setAuthorsInput,
  setField,
}: {
  frontmatter: Record<string, any>
  authorsInput: string
  setAuthorsInput: (value: string) => void
  setField: (key: string, value: any) => void
}) {
  const inputCls =
    'w-full rounded-md border border-neutral-300 bg-white p-2 text-sm text-neutral-900 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100'
  const labelCls = 'mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400'

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-[3]">
        <label htmlFor="fm-title" className={labelCls}>
          Title
        </label>
        <input
          id="fm-title"
          type="text"
          value={String(frontmatter.title ?? '')}
          onChange={(e) => setField('title', e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="w-24">
        <label htmlFor="fm-patch" className={labelCls}>
          Patch
        </label>
        <input
          id="fm-patch"
          type="text"
          value={String(frontmatter.patch ?? '')}
          onChange={(e) => setField('patch', e.target.value)}
          className={inputCls}
          placeholder="12.0.7"
        />
      </div>
      <div className="min-w-[160px] flex-[2]">
        <label htmlFor="fm-authors" className={labelCls}>
          Authors
        </label>
        <input
          id="fm-authors"
          type="text"
          value={authorsInput}
          onChange={(e) => setAuthorsInput(e.target.value)}
          className={inputCls}
          placeholder="Name1, Name2"
        />
      </div>
      <div className="min-w-[200px] flex-[3]">
        <label htmlFor="fm-summary" className={labelCls}>
          Summary
        </label>
        <input
          id="fm-summary"
          type="text"
          value={String(frontmatter.summary ?? '')}
          onChange={(e) => setField('summary', e.target.value)}
          className={inputCls}
        />
      </div>
      <label className="flex h-[38px] items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={!!frontmatter.draft}
          onChange={(e) => setField('draft', e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600"
        />
        Draft
      </label>
    </div>
  )
}

function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-[#323232]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  )
}

function CommitModal({
  isOpen,
  onClose,
  title,
  setTitle,
  message,
  setMessage,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  setTitle: (title: string) => void
  message: string
  setMessage: (message: string) => void
  onSubmit: () => void
}) {
  if (!isOpen) return null

  return (
    <ModalBackdrop onClose={onClose}>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Create pull request
      </h2>
      <div className="mb-4">
        <label
          htmlFor="commit-title"
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Title (required)
        </label>
        <input
          id="commit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white p-2 text-sm text-neutral-900 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          placeholder="Brief description of changes"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="commit-message"
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Description (optional)
        </label>
        <textarea
          id="commit-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white p-2 text-sm text-neutral-900 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          placeholder="More detailed explanation of changes"
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!title.trim()}
          className="rounded-md bg-[#d57f43] px-4 py-2 text-sm font-medium text-white hover:bg-[#c06f37] disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </ModalBackdrop>
  )
}

function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm: () => void
  isLoading: boolean
}) {
  if (!isOpen) return null

  return (
    <ModalBackdrop onClose={onClose}>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Confirm changes
      </h2>
      <div className="mb-4">
        <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">Title</p>
        <p className="rounded-md bg-neutral-50 p-2 text-sm text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
          {title}
        </p>
      </div>
      {message && (
        <div className="mb-4">
          <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Description
          </p>
          <p className="rounded-md bg-neutral-50 p-2 text-sm whitespace-pre-wrap text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
            {message}
          </p>
        </div>
      )}
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        This will create a pull request with your changes. Are you sure you want to proceed?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-md bg-[#d57f43] px-4 py-2 text-sm font-medium text-white hover:bg-[#c06f37] disabled:opacity-50"
        >
          {isLoading ? 'Creating PR…' : 'Create PR'}
        </button>
      </div>
    </ModalBackdrop>
  )
}

function PrSuccessModal({ isOpen, prUrl }: { isOpen: boolean; prUrl: string | null }) {
  if (!isOpen || !prUrl) return null

  return (
    <ModalBackdrop onClose={() => {}}>
      <h2 className="mb-3 text-lg font-semibold text-green-600 dark:text-green-400">
        Pull request created
      </h2>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
        Your changes have been submitted as a pull request. You'll be redirected to GitHub in a
        moment.
      </p>
      <div className="flex justify-end">
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-[#d57f43] px-4 py-2 text-sm font-medium text-white hover:bg-[#c06f37]"
        >
          View pull request
        </a>
      </div>
    </ModalBackdrop>
  )
}
