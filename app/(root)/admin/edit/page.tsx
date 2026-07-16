'use client'

import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { tags as t } from '@lezer/highlight'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MDXPreview from '@/components/MDXPreview'
import { FaQuestion } from 'react-icons/fa'
import matter from 'gray-matter'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { languages } from '@codemirror/language-data'
import { EditorView, Decoration, DecorationSet } from '@codemirror/view'
import { darcula, darculaInit } from '@uiw/codemirror-theme-darcula'
import { StateField, StateEffect, RangeSet } from '@codemirror/state'

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import customMarkdownExtension from './customMarkdownExtension'
import RoleSelector from '@/components/custom/Dungeons/RoleSelector'

// Create a debounce function to prevent excessive worker updates
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

// Add this function after the debounce function and before the main component
function createErrorLineHighlighter() {
  // Effect to add or remove error line highlight
  const addErrorLine = StateEffect.define<{ line: number }>()
  const clearErrorLines = StateEffect.define<null>()

  // Create a decoration that will highlight the error line with a red background
  const errorLineDecoration = Decoration.line({
    attributes: { class: 'bg-red-100 dark:bg-red-900/40' },
  })

  // Define a state field that will track our error line decorations
  const errorLineField = StateField.define<DecorationSet>({
    create() {
      return RangeSet.empty
    },
    update(decorations, tr) {
      // Update decorations based on transaction effects
      decorations = decorations.map(tr.changes)

      for (const effect of tr.effects) {
        if (effect.is(addErrorLine)) {
          // Convert 1-indexed line to 0-indexed for internal use
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
  const [rawContent, setRawContent] = useState<string>('')
  const [bodyContent, setBodyContent] = useState<string>('')
  const [frontmatter, setFrontmatter] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [splitPosition, setSplitPosition] = useState<number>(50) // Default 50% split
  const [isDragging, setIsDragging] = useState<boolean>(false)
  // Add state for commit information and modals
  const [commitTitle, setCommitTitle] = useState<string>('')
  const [commitMessage, setCommitMessage] = useState<string>('')
  const [showCommitModal, setShowCommitModal] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const router = useRouter()
  const workerRef = useRef<Worker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const editorRef = useRef<EditorView | null>(null)
  const [editorReady, setEditorReady] = useState<boolean>(false)
  const errorHighlighter = useMemo(() => createErrorLineHighlighter(), [])

  // Extract filename from path for display
  const fileName = filePath.split('/').pop() || 'Unknown'
  // Extract group from path (last directory name)
  const pathParts = filePath.split('/')
  const group = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'root'

  // Custom highlight style for frontmatter and MDX

  const customHighlightStyle = useMemo(
    () =>
      HighlightStyle.define([
        { tag: tags.heading, fontWeight: 'bold', color: '#ffb86c' },
        { tag: tags.link, textDecoration: 'underline' },
        { tag: tags.emphasis, fontStyle: 'italic' },
        { tag: tags.bool, fontStyle: 'italic' },
        { tag: tags.strong, fontWeight: 'bold' },
        { tag: tags.comment, fontStyle: 'italic' },
        // Add specific tag highlighting for our custom syntax
        { tag: t.processingInstruction, color: '#FFFFFF', fontWeight: 'bold' }, // For CustomInlineMark
        { tag: t.bool, color: '#d79a59' }, // For CustomInlineElement
        { tag: t.operator, color: '#C5E6A6' }, // For CustomInlineOperator
        { tag: t.special(t.content), color: '#ffb86c', fontWeight: 'bold' }, // For ExclamationMark
        { tag: t.emphasis, color: '#cc8800' }, // For ExclamationMarkPrimary
        { tag: t.strong, color: '#ffb86c', fontWeight: 'bold' }, // For ExclamationMarkSecondary
        { tag: t.separator, color: '#AAAAAA' }, // For ExclamationMarkSeparator
      ]),
    []
  ) // Empty dependency array ensures this is only created once

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
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
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
      }),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        addKeymap: true,
        extensions: [customMarkdownExtension],
        htmlTagLanguage: javascript({ jsx: true }),
      }),
      EditorView.lineWrapping,
    ],
    [customHighlightStyle]
  ) // Only depends on the highlight style

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
    () => [...mixedLanguageSupport, errorHighlighter.extension],
    [mixedLanguageSupport, errorHighlighter]
  )

  const editorBasicSetup = useMemo(
    () => ({
      lineNumbers: true,
      highlightActiveLine: true,
      highlightActiveLineGutter: true,
      foldGutter: true,
      autocompletion: true,
      closeBrackets: true,
      searchKeymap: true,
    }),
    []
  )

  // Set up the worker when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(new URL('./matterWorker.ts', import.meta.url))

      workerRef.current.onmessage = (event) => {
        if (event.data.type === 'parseResult') {
          setBodyContent(event.data.content)
          setFrontmatter(event.data.data)
        } else if (event.data.type === 'error') {
          console.error('Error in worker:', event.data.message)
        }
      }

      return () => {
        workerRef.current?.terminate()
      }
    }
  }, [])

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
          setRawContent(content)

          // Parse the initial content with the worker
          if (workerRef.current) {
            workerRef.current.postMessage({
              type: 'parse',
              content,
            })
          } else {
            // Fallback if worker isn't available
            try {
              const { content: body, data } = matter(content)
              setBodyContent(body)
              setFrontmatter(data)
            } catch (err) {
              console.error('Error parsing markdown content:', err)
            }
          }

          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status, filePath])

  // Debounced function to update content in worker
  const debouncedUpdateContent = useRef(
    debounce((content: string) => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'parse',
          content,
        })
      } else {
        // Fallback if worker isn't available
        try {
          const { content: body } = matter(content)
          setBodyContent(body)
        } catch (err) {
          console.error('Error parsing markdown content:', err)
        }
      }
    }, 300)
  ).current

  const handleRawContentChange = (newContent: string) => {
    setRawContent(newContent)

    // Clear error line when content changes
    setErrorLine(null)

    // Use the debounced function to update the preview
    debouncedUpdateContent(newContent)
  }

  // Modify the handleSaveClick function to open the commit modal
  const handleSaveClick = () => {
    // Generate a default commit title based on the file path
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    const defaultTitle = `Update ${fileNameWithoutExt} content`
    setCommitTitle(defaultTitle)
    setCommitMessage('')
    setShowCommitModal(true)
  }

  // Handle the continue action from commit modal
  const handleCommitSubmit = () => {
    setShowCommitModal(false)
    setShowConfirmModal(true)
  }

  // Handle the final confirmation
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
          content: rawContent,
          commitTitle,
          commitMessage,
          createPr: true, // Indicate we want to create a PR
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
        // If we got a PR URL, show the success modal and redirect
        setPrUrl(data.prUrl)
        setShowConfirmModal(false)

        // Redirect to the PR after a short delay
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
      // Limit the range between 20% and 80%
      const limitedPosition = Math.min(Math.max(newPosition, 20), 80)
      setSplitPosition(limitedPosition)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Debounced function to update split position in localStorage
  const debouncedSavePosition = useRef(
    debounce((position: number) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('editor-split-position', position.toString())
      }
    }, 500)
  ).current

  // Set up event listeners for dragging outside the divider
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
        // Limit the range between 20% and 80%
        const limitedPosition = Math.min(Math.max(newPosition, 20), 80)
        setSplitPosition(limitedPosition)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      // When dragging ends, save the final position
      debouncedSavePosition(splitPosition)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      // Apply a cursor style to the entire document while dragging
      document.body.style.cursor = 'col-resize'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      // Reset cursor style
      document.body.style.cursor = ''
    }
  }, [isDragging, splitPosition, debouncedSavePosition])

  // Load saved split position from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = localStorage.getItem('editor-split-position')
      if (savedPosition) {
        setSplitPosition(Number(savedPosition))
      }
    }
  }, [])

  // Apply or clear error line highlight when errorLine changes
  useEffect(() => {
    if (!editorRef.current) return

    if (errorLine !== null) {
      errorHighlighter.highlightLine(
        editorRef.current,
        errorLine + Object.keys(frontmatter).length + 2 // +2 for the frontmatter delimiters
      )
    } else {
      errorHighlighter.clearHighlights(editorRef.current)
    }
  }, [errorLine, frontmatter, errorHighlighter])

  // In split mode, keep the editor and preview scrolled to the same position
  useEffect(() => {
    if (viewMode !== 'split') return

    const editorScroller = editorRef.current?.scrollDOM
    const previewEl = previewRef.current
    if (!editorScroller || !previewEl) return

    let locked = false
    const sync = (source: HTMLElement, target: HTMLElement) => () => {
      if (locked) return
      locked = true
      const sourceMax = source.scrollHeight - source.clientHeight
      const targetMax = target.scrollHeight - target.clientHeight
      const ratio = sourceMax > 0 ? source.scrollTop / sourceMax : 0
      target.scrollTop = ratio * targetMax
      requestAnimationFrame(() => {
        locked = false
      })
    }

    const onEditorScroll = sync(editorScroller, previewEl)
    const onPreviewScroll = sync(previewEl, editorScroller)
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

        <div
          ref={containerRef}
          className={`${viewMode === 'split' ? 'relative flex gap-0' : ''}`}
          onMouseMove={viewMode === 'split' ? handleDragMove : undefined}
          onMouseUp={viewMode === 'split' ? handleDragEnd : undefined}
        >
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div
              className={`${viewMode === 'split' ? 'h-[85vh] shrink-0' : 'sticky top-0 h-[85vh] w-full'}`}
              style={viewMode === 'split' ? { width: `${splitPosition}%` } : undefined}
            >
              <CodeMirror
                value={rawContent}
                onChange={handleRawContentChange}
                className="h-full overflow-auto rounded-lg border border-neutral-300 dark:border-neutral-700"
                theme={editorTheme}
                extensions={editorExtensions}
                placeholder="Enter content with frontmatter and MDX..."
                basicSetup={editorBasicSetup}
                onCreateEditor={(view) => {
                  editorRef.current = view
                  setEditorReady(true)
                }}
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
              <div className="mb-4 border-b border-neutral-100 pb-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                Live preview — some components may differ from the final version.
              </div>
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

// Modal backdrop component
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

// Commit modal component
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

// Confirmation modal component
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

// PR success modal
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
