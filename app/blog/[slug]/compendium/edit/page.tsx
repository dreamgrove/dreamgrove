'use client'

import { useState, useEffect, Suspense, ChangeEvent } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MDXPreview from '@/components/MDXPreview'
import { FaQuestion } from 'react-icons/fa'
import matter from 'gray-matter'

export default function CompendiumEditPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  return <CompendiumEditor slug={slug} />
}

function CompendiumEditor({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const [bodyContent, setBodyContent] = useState<string>('')
  const [frontmatterData, setFrontmatterData] = useState<Record>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const router = useRouter()

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
          const { data: fmData, content: body } = matter(data.content || '')
          setFrontmatterData(fmData)
          setBodyContent(body)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status, slug])

  const handleFrontmatterChange = (key: string, value: string | number | boolean) => {
    const originalValue = frontmatterData[key]
    const newValue =
      typeof originalValue === 'number' && typeof value === 'string' && !isNaN(parseFloat(value))
        ? parseFloat(value)
        : value

    setFrontmatterData((prev) => ({
      ...prev,
      [key]: newValue,
    }))
  }

  const handleBodyContentChange = (e: ChangeEvent) => {
    setBodyContent((e.target as HTMLTextAreaElement).value)
  }

  const saveChanges = async () => {
    if (!session) return

    setSaving(true)
    setSaveMessage(null)

    try {
      const fullContent = matter.stringify(bodyContent, frontmatterData)

      const res = await fetch('/api/compendium/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content: fullContent,
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

      <div className="mb-6 rounded-md border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Metadata (Frontmatter)</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(frontmatterData).map(([key, value]) => {
            const inputType =
              typeof value === 'boolean'
                ? 'checkbox'
                : typeof value === 'number'
                  ? 'number'
                  : 'text'
            const isTextArea = typeof value === 'string' && value.includes('\n')

            return (
              <div key={key}>
                <label
                  htmlFor={`fm-${key}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {key}
                </label>
                {isTextArea ? (
                  <textarea
                    id={`fm-${key}`}
                    name={key}
                    rows={3}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e: ChangeEvent) =>
                      handleFrontmatterChange(key, (e.target as HTMLTextAreaElement).value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                  />
                ) : inputType === 'checkbox' ? (
                  <input
                    id={`fm-${key}`}
                    name={key}
                    type="checkbox"
                    checked={typeof value === 'boolean' ? value : false}
                    onChange={(e: ChangeEvent) =>
                      handleFrontmatterChange(key, (e.target as HTMLInputElement).checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                ) : (
                  <input
                    id={`fm-${key}`}
                    name={key}
                    type={inputType}
                    value={typeof value === 'string' || typeof value === 'number' ? value : ''}
                    onChange={(e: ChangeEvent) =>
                      handleFrontmatterChange(key, (e.target as HTMLInputElement).value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className={`${viewMode === 'split' ? 'flex gap-4' : ''}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'w-1/2' : 'w-full'}>
            <textarea
              value={bodyContent}
              onChange={handleBodyContentChange}
              className="h-[70vh] w-full rounded-md border border-gray-300 p-4 font-mono text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter MDX content here..."
            />
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} min-h-[70vh] max-w-none rounded-md border border-gray-300 p-6 dark:border-gray-600 dark:bg-gray-800`}
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
