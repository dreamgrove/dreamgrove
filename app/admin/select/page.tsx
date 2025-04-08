'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

type FileInfo = {
  path: string
  name: string
}

type GroupedFiles = Record<string, FileInfo[]>

export default function FileSelectPage() {
  const { data: session, status } = useSession()
  const [files, setFiles] = useState<GroupedFiles>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/compendium/list')
        .then((res) => {
          if (!res.ok) throw new Error(`Error fetching files: ${res.statusText}`)
          return res.json()
        })
        .then((data) => {
          setFiles(data.files || {})
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status])

  const handleSelectFile = (filePath: string) => {
    // Encode the file path to handle special characters
    const encodedPath = encodeURIComponent(filePath)
    router.push(`/admin/edit?path=${encodedPath}`)
  }

  const filteredFiles = (): GroupedFiles => {
    if (!searchTerm) return files

    const filtered: GroupedFiles = {}

    Object.entries(files).forEach(([group, groupFiles]) => {
      const matchingFiles = groupFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.toLowerCase().includes(searchTerm.toLowerCase())
      )

      if (matchingFiles.length > 0) {
        filtered[group] = matchingFiles
      }
    })

    return filtered
  }

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl font-bold">GitHub Authentication Required</h1>
        <p className="mb-6">You need to authenticate with GitHub to edit files.</p>
        <button
          onClick={() => signIn('github')}
          className="rounded-md bg-gray-800 px-4 py-2 text-white"
        >
          Sign in with GitHub
        </button>
      </div>
    )
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading files...</div>
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-3xl font-bold">Error</h1>
        <p className="mb-6 text-red-500">{error}</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Select File to Edit</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(filteredFiles()).map(([group, groupFiles]) => (
          <div key={group} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <h2 className="mb-4 text-xl font-semibold capitalize">{group}</h2>
            <ul className="space-y-2">
              {groupFiles.map((file) => (
                <li key={file.path}>
                  <button
                    onClick={() => handleSelectFile(file.path)}
                    className="w-full rounded-md bg-gray-100 p-2 text-left transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {file.name}
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {file.path}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {Object.keys(filteredFiles()).length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No files match your search.' : 'No files found.'}
          </p>
        </div>
      )}
    </div>
  )
}
