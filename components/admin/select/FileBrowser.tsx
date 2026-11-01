'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PageWrapper from '@/components/PageWrapper'
import { groupContentFiles, type ContentFile } from '@/lib/admin/content'
import { ACCENT } from '@/lib/admin/palette'
import AuthGate from '@/components/admin/ui/AuthGate'
import Icon from '@/components/Icon'
import StatusShell, { StatusMessage } from '@/components/admin/ui/StatusShell'
import CompendiumCard from './CompendiumCard'
import { FileRows, Panel, Section } from './FileList'
import NewPageDialog, { type NewPagePreset } from './NewPageDialog'

const SECTIONS = [
  { id: 'all', label: 'All' },
  { id: 'compendiums', label: 'Compendiums' },
  { id: 'spec', label: 'Spec guides' },
  { id: 'general', label: 'General guides' },
  { id: 'dungeons', label: 'Dungeons' },
  { id: 'raids', label: 'Raids' },
  { id: 'other', label: 'Other pages' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

/** Every content file grouped by section */
export default function FileBrowser() {
  return (
    <AuthGate reason="Sign in with GitHub to manage content. You need write access to the repository or to be a member of the dreamgrove organization.">
      <Browser />
    </AuthGate>
  )
}

function useContentFiles() {
  const [files, setFiles] = useState<ContentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/compendium/list')
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching files: ${res.statusText}`)
        return res.json()
      })
      .then((data) => setFiles(data.files || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { files, loading, error }
}

function Browser() {
  const { data: session } = useSession()
  const router = useRouter()
  const { files, loading, error } = useContentFiles()
  const [searchTerm, setSearchTerm] = useState('')
  const [section, setSection] = useState<SectionId>('all')
  const [newPage, setNewPage] = useState<NewPagePreset | null>(null)

  const query = searchTerm.trim().toLowerCase()
  const grouped = useMemo(() => groupContentFiles(files, query), [files, query])

  if (loading) return <StatusShell>Loading pages…</StatusShell>
  if (error) {
    return (
      <StatusMessage title="Couldn’t load pages" error back={{ href: '/', label: 'Return home' }}>
        {error}
      </StatusMessage>
    )
  }

  const openFile = (filePath: string) =>
    router.push(`/cms/edit?path=${encodeURIComponent(filePath)}`)
  const show = (id: SectionId) => section === 'all' || section === id
  const anyResults =
    grouped.compendia.length > 0 ||
    grouped.bySpec.some((s) => s.files.length > 0) ||
    grouped.general.length > 0 ||
    grouped.dungeons.length > 0 ||
    grouped.raids.length > 0 ||
    grouped.other.length > 0
  const specPanels = query ? grouped.bySpec.filter((s) => s.files.length > 0) : grouped.bySpec

  return (
    <PageWrapper
      title="Content editor"
      showTitle={false}
      variant="redesign"
      crumb={{ label: 'Editor', href: '/cms', color: ACCENT }}
    >
      <section className="dg-container pt-7 pb-16 sm:pb-[72px]">
        <Link href="/" className="dg-back">
          <Icon box name="back" size={16} />
          Back to site
        </Link>

        {/* Visually hidden since the header already names the page */}
        <h1 className="sr-only">Content editor</h1>

        <div className="mt-8 flex flex-col gap-4 border-b border-dg-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="dg-chip flex h-9 items-center rounded-xs! py-0! leading-none"
                aria-pressed={section === s.id}
                onClick={() => setSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-80">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40">
                <Icon box name="search" size={15} />
              </span>
              <input
                type="search"
                placeholder="Search by title, path or spec…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-xs border border-dg-line bg-dg-panel-deep py-0 pr-3 pl-10 text-[.9rem] text-white placeholder-white/40 focus:border-main focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setNewPage({})}
              className="inline-flex h-9 flex-shrink-0 items-center gap-2 rounded-xs bg-main px-4 text-[.9rem] leading-none font-semibold text-dg-panel transition-[filter] hover:brightness-110"
            >
              <Icon box name="plus" size={14} />
              New page
            </button>
          </div>
        </div>

        {!anyResults && (
          <p className="mt-12 text-center text-[.95rem] text-white/40">
            No pages match “{searchTerm}”.
          </p>
        )}

        {show('compendiums') && grouped.compendia.length > 0 && (
          <Section title="Compendiums">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {grouped.compendia.map((c) => (
                <CompendiumCard key={c.spec.id} {...c} onOpen={openFile} />
              ))}
            </div>
          </Section>
        )}

        {show('spec') && specPanels.length > 0 && (
          <Section title="Spec guides">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {specPanels.map(({ spec, files: specFiles }) => (
                <Panel
                  key={spec.id}
                  title={spec.name}
                  tint={spec.color}
                  onAdd={() => setNewPage({ kind: 'article', specs: [spec.id] })}
                  addLabel={`New ${spec.name} guide`}
                >
                  <FileRows
                    files={specFiles}
                    onOpen={openFile}
                    hideSpec={spec.id}
                    empty="No guides yet."
                  />
                </Panel>
              ))}
            </div>
          </Section>
        )}

        {show('general') && (!query || grouped.general.length > 0) && (
          <Section title="General guides">
            <Panel
              title="Other guides"
              onAdd={() => setNewPage({ kind: 'article', specs: [] })}
              addLabel="New general guide"
            >
              <FileRows files={grouped.general} onOpen={openFile} empty="No general guides yet." />
            </Panel>
          </Section>
        )}

        {(show('dungeons') || show('raids')) &&
          (grouped.dungeons.length > 0 || grouped.raids.length > 0) && (
            <Section title="Instances">
              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                {show('dungeons') && grouped.dungeons.length > 0 && (
                  <Panel
                    title="Mythic+ dungeons"
                    onAdd={() => setNewPage({ kind: 'dungeon' })}
                    addLabel="New dungeon"
                  >
                    <FileRows files={grouped.dungeons} onOpen={openFile} />
                  </Panel>
                )}
                {show('raids') && grouped.raids.length > 0 && (
                  <Panel
                    title="Raids"
                    onAdd={() => setNewPage({ kind: 'raid' })}
                    addLabel="New raid"
                  >
                    <FileRows files={grouped.raids} onOpen={openFile} />
                  </Panel>
                )}
              </div>
            </Section>
          )}

        {show('other') && grouped.other.length > 0 && (
          <Section title="Other pages">
            <Panel title="Pages">
              <FileRows files={grouped.other} onOpen={openFile} />
            </Panel>
          </Section>
        )}
      </section>

      {newPage && (
        <NewPageDialog
          preset={newPage}
          existingPaths={files.map((f) => f.path)}
          defaultAuthor={session?.user?.name ?? ''}
          onClose={() => setNewPage(null)}
        />
      )}
    </PageWrapper>
  )
}
