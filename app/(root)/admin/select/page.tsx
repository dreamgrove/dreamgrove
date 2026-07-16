'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import balanceIcon from '../../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../../public/static/images/icons/guardian.jpg'

type FileInfo = {
  path: string
  name: string
}

type GroupedFiles = Record<string, FileInfo[]>

type Compendium = {
  key: string
  name: string
  icon: StaticImageData
}

const COMPENDIA: Compendium[] = [
  { key: 'balance', name: 'Balance', icon: balanceIcon },
  { key: 'feral', name: 'Feral', icon: feralIcon },
  { key: 'guardian', name: 'Guardian', icon: guardianIcon },
  { key: 'resto', name: 'Restoration', icon: restoIcon },
]

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
    const encodedPath = encodeURIComponent(filePath)
    router.push(`/admin/edit?path=${encodedPath}`)
  }

  const filteredFiles = (): GroupedFiles => {
    if (!searchTerm) return files

    const filtered: GroupedFiles = {}

    Object.entries(files).forEach(([group, groupFiles]) => {
      const matchingFiles = (groupFiles as FileInfo[]).filter(
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
    return <CenteredMessage>Loading…</CenteredMessage>
  }

  if (status === 'unauthenticated') {
    return (
      <Centered>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Authentication required
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Sign in with GitHub to edit content. You need write access to the repository.
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

  if (loading) {
    return <CenteredMessage>Loading files…</CenteredMessage>
  }

  if (error) {
    return (
      <Centered>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Couldn’t load files
        </h1>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Return home
        </Link>
      </Centered>
    )
  }

  const allFiles = Object.values(files).flat()
  const compendiaWithPaths = COMPENDIA.map((c) => ({
    ...c,
    file: allFiles.find((f) => f.path === `blog/${c.key}/compendium.mdx`),
  }))

  const groups = filteredFiles()
  const groupEntries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  const totalFiles = allFiles.length
  const shownFiles = groupEntries.reduce((sum, [, gf]) => sum + gf.length, 0)

  return (
    <div className="min-h-screen bg-[#F2F3F4] dark:bg-[#282828]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Content editor
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Select a page to edit. Your changes are submitted as a pull request for review.
          </p>
        </header>

        {/* Compendiums — primary guides */}
        {!searchTerm && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
              Compendiums
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {compendiaWithPaths.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  disabled={!c.file}
                  onClick={() => c.file && handleSelectFile(c.file.path)}
                  className="group flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-[#d57f43] hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-[#323232] dark:hover:border-[#d57f43] dark:hover:bg-[#3a3a3a]"
                >
                  <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md ring-1 ring-neutral-200 dark:ring-neutral-600">
                    <Image
                      src={c.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="min-w-0 truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All pages */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
            {searchTerm ? 'Search results' : 'All pages'}
            <span className="ml-2 font-normal tracking-normal text-neutral-400 normal-case dark:text-neutral-500">
              {searchTerm ? `${shownFiles} of ${totalFiles}` : `${totalFiles} files`}
            </span>
          </h2>
          <div className="relative sm:w-72">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400">
              <SearchGlyph />
            </span>
            <input
              type="text"
              placeholder="Search files…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white py-2 pr-3 pl-9 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[#d57f43] focus:ring-1 focus:ring-[#d57f43] focus:outline-none dark:border-neutral-600 dark:bg-[#323232] dark:text-neutral-100 dark:placeholder-neutral-500"
            />
          </div>
        </div>

        {groupEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupEntries.map(([group, groupFiles]) => (
              <div
                key={group}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-[#323232]"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5 dark:border-neutral-700">
                  <h3 className="truncate text-sm font-semibold text-neutral-700 capitalize dark:text-neutral-200">
                    {group}
                  </h3>
                  <span className="text-xs text-neutral-400 tabular-nums dark:text-neutral-500">
                    {groupFiles.length}
                  </span>
                </div>
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {groupFiles.map((file) => (
                    <li key={file.path}>
                      <button
                        onClick={() => handleSelectFile(file.path)}
                        className="block w-full px-4 py-2.5 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-[#3a3a3a]"
                      >
                        <span className="block truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {file.name}
                        </span>
                        <span className="block truncate font-mono text-xs text-neutral-400 dark:text-neutral-500">
                          {file.path}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-300 py-12 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
            {searchTerm ? 'No files match your search.' : 'No files found.'}
          </div>
        )}
      </div>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F3F4] px-4 dark:bg-[#282828]">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-[#323232]">
        {children}
      </div>
    </div>
  )
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F3F4] text-sm text-neutral-500 dark:bg-[#282828] dark:text-neutral-400">
      {children}
    </div>
  )
}

function SearchGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  )
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}
