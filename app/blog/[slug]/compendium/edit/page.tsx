'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MDXPreview from '@/components/MDXPreview'
import { FaQuestion } from 'react-icons/fa'
import { SessionProvider } from 'next-auth/react'

export default async function CompendiumEditPage({ params }: { params: { slug: string } }) {
  const slug = params.slug

  return (
    <SessionProvider>
      <CompendiumEditor slug={slug} />
    </SessionProvider>
  )
}

function CompendiumEditor({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [preview, setPreview] = useState<boolean>(false)
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch the content of the compendium file
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
          setContent(data.content)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status, slug])

  const saveChanges = async () => {
    if (!session) return

    setSaving(true)
    try {
      const res = await fetch('/api/compendium/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content,
        }),
      })

      if (res.status === 403) {
        setHasPermission(false)
        throw new Error('You do not have permission to edit this file')
      }

      if (!res.ok) {
        throw new Error(`Error saving content: ${res.statusText}`)
      }

      // Redirect to the compendium page after saving
      router.push(`/blog/${slug}/compendium`)
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
          <button
            onClick={() => setPreview(!preview)}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
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

      {!preview ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-[70vh] w-full rounded-md border border-gray-300 bg-white p-4 font-mono text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
      ) : (
        <div className="prose prose-lg min-h-[70vh] max-w-none rounded-md border border-gray-300 p-6 dark:border-gray-600 dark:bg-gray-800">
          <div className="mb-4 italic text-gray-500 dark:text-gray-400">
            Preview mode - MDX components will be rendered properly when saved
          </div>
          <MDXPreview content={content} />
        </div>
      )}
    </div>
  )
}
