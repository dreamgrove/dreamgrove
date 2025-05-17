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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">Loading parameters...</div>
      }
    >
      <EditPageWithParams />
    </Suspense>
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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Error</h1>
      <p className="mb-6 text-red-500">No file path specified.</p>
      <Link href="/admin/select" className="text-blue-500 hover:underline">
        Select a file to edit
      </Link>
    </div>
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
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const editorRef = useRef<EditorView | null>(null)
  const errorHighlighterRef = useRef<ReturnType<typeof createErrorLineHighlighter> | null>(null)

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

  // Initialize the error line highlighter only once
  useEffect(() => {
    errorHighlighterRef.current = createErrorLineHighlighter()
  }, [])

  // Apply or clear error line highlight when errorLine changes
  useEffect(() => {
    if (!editorRef.current || !errorHighlighterRef.current) return

    if (errorLine !== null) {
      errorHighlighterRef.current.highlightLine(
        editorRef.current,
        errorLine + Object.keys(frontmatter).length + 2 // +2 for the frontmatter delimiters
      )
    } else {
      errorHighlighterRef.current.clearHighlights(editorRef.current)
    }
  }, [errorLine, frontmatter])

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl font-bold">GitHub Authentication Required</h1>
        <p className="mb-6">You need to authenticate with GitHub to edit this page.</p>
        <button
          onClick={() => signIn('github')}
          className="rounded-md bg-gray-800 px-4 py-2 text-white"
        >
          Sign in with GitHub
        </button>
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-red-500">
          You do not have write permission to the dreamgrove repository.
          <br />
          Only contributors with write access to the repository can edit files.
        </p>
        <Link href="/admin/select" className="text-blue-500 hover:underline">
          Return to File Selection
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading content...</div>
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[85vw] flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl font-bold">Error</h1>
        <p className="mb-6 text-red-500">{error}</p>
        <Link href="/admin/select" className="text-blue-500 hover:underline">
          Return to File Selection
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen w-full max-w-[90vw] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="text-3xl font-bold">Edit {fileName}</h1>
            <p className="text-sm text-gray-500">
              <span className="capitalize">{group}</span> / {filePath}
            </p>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Help"
          >
            <FaQuestion />
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="flex overflow-hidden rounded-md">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-2 ${
                viewMode === 'edit' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 ${
                viewMode === 'split' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 ${
                viewMode === 'preview' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Preview
            </button>
          </div>
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/select" className="rounded-md bg-gray-800 px-4 py-2 text-white">
            Cancel
          </Link>
        </div>
      </div>

      {showHelp && (
        <div className="mb-6 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-bold">Quick Help</h2>
          <ul className="mb-2 list-disc pl-5">
            <li>Edit the content using Markdown and MDX syntax</li>
            <li>
              Frontmatter can be edited directly at the top of the file between <code>---</code>{' '}
              delimiters
            </li>
            <li>
              Use <code>!47032|Spell!</code> for Wowhead links
            </li>
            <li>
              Use <code>&lt;Talents talent="A1B2C3..."/&gt;</code> for talent trees
            </li>
            <li>
              Use <code>&lt;Collapsible title="Title"&gt;Content&lt;/Collapsible&gt;</code> for
              collapsible sections
            </li>
          </ul>
          <Link
            href="/admin/edit/README.md"
            target="_blank"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            View full documentation
          </Link>
        </div>
      )}

      {saveMessage && (
        <div className="mb-6 rounded-md bg-green-100 p-4 text-green-800 dark:bg-green-800 dark:text-green-100">
          <p>{saveMessage}</p>
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
            className={`${viewMode === 'split' ? '' : 'w-full'} sticky top-0 h-[85vh]`}
            style={viewMode === 'split' ? { width: `${splitPosition}%` } : undefined}
          >
            <CodeMirror
              value={rawContent}
              onChange={handleRawContentChange}
              className="overflow-auto rounded-md border border-gray-300 dark:border-gray-600"
              theme={darculaInit({
                styles: [
                  { tag: t.tagName, color: '#B0DAF1' },
                  { tag: t.attributeName, color: '#C5E6A6' },
                  { tag: t.attributeValue, color: '#ffb86c' },
                  { tag: t.operator, color: '#989898' },
                ],
              })}
              extensions={[
                ...mixedLanguageSupport,
                ...(errorHighlighterRef.current ? [errorHighlighterRef.current.extension] : []),
              ]}
              placeholder="Enter content with frontmatter and MDX..."
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                autocompletion: true,
                closeBrackets: true,
                searchKeymap: true,
              }}
              onCreateEditor={(view) => {
                editorRef.current = view
              }}
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div
            className={`w-[6px] ${isDragging ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'} relative z-10 shrink-0 cursor-col-resize`}
            onMouseDown={handleDragStart}
          >
            <div className="absolute top-1/2 left-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"></div>
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`${viewMode === 'split' ? 'px-10' : 'px:20 w-full lg:px-80'} min-h-[70vh] max-w-none overflow-auto rounded-md border border-gray-300 p-6 dark:border-gray-600 dark:bg-transparent`}
            style={viewMode === 'split' ? { width: `${100 - splitPosition}%` } : undefined}
            suppressHydrationWarning
          >
            <div className="mb-4 text-gray-500 italic dark:text-gray-400">
              Live Preview - Some components may differ from the final version.
            </div>
            <Suspense fallback={<div className="text-gray-500 italic">Loading preview...</div>}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
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
      <h2 className="mb-4 text-2xl font-bold">Create Pull Request</h2>
      <div className="mb-4">
        <label htmlFor="commit-title" className="mb-2 block text-sm font-medium">
          Title (required)
        </label>
        <input
          id="commit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Brief description of changes"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="commit-message" className="mb-2 block text-sm font-medium">
          Description (optional)
        </label>
        <textarea
          id="commit-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
          placeholder="More detailed explanation of changes"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!title.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
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
      <h2 className="mb-4 text-2xl font-bold">Confirm Changes</h2>
      <div className="mb-4">
        <p className="mb-2 font-medium">Title:</p>
        <p className="rounded-md bg-gray-100 p-2 dark:bg-gray-700">{title}</p>
      </div>
      {message && (
        <div className="mb-4">
          <p className="mb-2 font-medium">Description:</p>
          <p className="rounded-md bg-gray-100 p-2 whitespace-pre-wrap dark:bg-gray-700">
            {message}
          </p>
        </div>
      )}
      <p className="mb-6">
        This will create a pull request with your changes. Are you sure you want to proceed?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-4 py-2 dark:border-gray-600"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? 'Creating PR...' : 'Create PR'}
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
      <h2 className="mb-4 text-2xl font-bold text-green-600">Pull Request Created!</h2>
      <p className="mb-6">
        Your changes have been successfully submitted as a pull request. You'll be redirected to
        GitHub in a moment.
      </p>
      <div className="flex justify-center">
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          View Pull Request
        </a>
      </div>
    </ModalBackdrop>
  )
}
