'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import MDXPreview from '@/components/MDXPreview'
import { FaQuestion } from 'react-icons/fa'
import matter from 'gray-matter'

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

export default function CompendiumEditPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  return <CompendiumEditor slug={slug} />
}

function CompendiumEditor({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const [rawContent, setRawContent] = useState<string>('')
  const [bodyContent, setBodyContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const router = useRouter()
  const workerRef = useRef<Worker | null>(null)

  // Set up the worker when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(new URL('./matterWorker.ts', import.meta.url))

      workerRef.current.onmessage = (event) => {
        if (event.data.type === 'parseResult') {
          setBodyContent(event.data.content)
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
      fetch(`/api/compendium/content?slug=${slug}`)
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
              const { content: body } = matter(content)
              setBodyContent(body)
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
  }, [status, slug])

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

  const handleRawContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setRawContent(newContent)

    // Use the debounced function to update the preview
    debouncedUpdateContent(newContent)
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
          slug,
          content: rawContent,
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

      if (data.message) {
        setSaveMessage(data.message)
        setTimeout(() => {
          router.push(`/blog/${slug}/compendium`)
        }, 2000)
      } else {
        router.push(`/blog/${slug}/compendium`)
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setSaving(false)
    }
  }

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
          Only contributors with write access to the repository can edit compendium pages.
        </p>
        <Link href={`/blog/${slug}/compendium`} className="text-blue-500 hover:underline">
          Return to Compendium
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading content...</div>
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl font-bold">Error</h1>
        <p className="mb-6 text-red-500">{error}</p>
        <Link href={`/blog/${slug}/compendium`} className="text-blue-500 hover:underline">
          Return to Compendium
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Edit {slug} Compendium</h1>
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
            onClick={saveChanges}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href={`/blog/${slug}/compendium`}
            className="rounded-md bg-gray-800 px-4 py-2 text-white"
          >
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
            href={`/blog/${slug}/compendium/edit/README.md`}
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

      <div className={`${viewMode === 'split' ? 'flex gap-4' : ''}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'w-1/2' : 'w-full'}>
            <textarea
              value={rawContent}
              onChange={handleRawContentChange}
              className="h-[70vh] w-full rounded-md border border-gray-300 p-4 font-mono text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter content with frontmatter and MDX..."
            />
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} min-h-[70vh] max-w-none rounded-md border border-gray-300 p-6 dark:border-gray-600 dark:bg-transparent`}
            suppressHydrationWarning
          >
            <div className="mb-4 italic text-gray-500 dark:text-gray-400">
              Live Preview - Custom components appear below. Server components may differ.
            </div>
            <Suspense fallback={<div className="italic text-gray-500">Loading preview...</div>}>
              <MDXPreview content={bodyContent} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}
