'use client'

import { useState, useEffect, useMemo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import PageWrapper from '@/components/PageWrapper'
import { Icon } from '../edit/ui'
import { SPECS, getSpec, type SpecId } from '@/data/specs'
import { formatDate } from '@/lib/utils/formatShortDate'
import type { ContentFile } from '@/lib/adminContent'
import NewPageDialog, { type NewPagePreset } from './NewPageDialog'
import balanceIcon from '../../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../../public/static/images/icons/guardian.jpg'

const ACCENT = '#d57f43'

const SPEC_ICONS: Record<SpecId, StaticImageData> = {
  balance: balanceIcon,
  feral: feralIcon,
  guardian: guardianIcon,
  resto: restoIcon,
}

const SECTIONS = [
  { id: 'compendiums', label: 'Compendiums' },
  { id: 'spec', label: 'Spec guides' },
  { id: 'general', label: 'General guides' },
  { id: 'dungeons', label: 'Dungeons' },
  { id: 'raids', label: 'Raids' },
  { id: 'other', label: 'Other pages' },
] as const

type SectionId = (typeof SECTIONS)[number]['id'] | 'all'

const byTitle = (a: ContentFile, b: ContentFile) => a.title.localeCompare(b.title)
const byNewest = (a: ContentFile, b: ContentFile) =>
  (b.date ?? '').localeCompare(a.date ?? '') || byTitle(a, b)

// Same exclusions as lib/guides.ts: translations and the test page aren't listed as guides
const isListedArticle = (f: ContentFile) =>
  f.kind === 'article' && !f.locale && !f.path.startsWith('blog/test/')

function matches(file: ContentFile, query: string) {
  if (!query) return true
  return [file.title, file.path, file.summary ?? '', ...file.specs].some((s) =>
    s.toLowerCase().includes(query)
  )
}

export default function FileSelectPage() {
  const { data: session, status } = useSession()
  const [files, setFiles] = useState<ContentFile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [section, setSection] = useState<SectionId>('all')
  const [newPage, setNewPage] = useState<NewPagePreset | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/compendium/list')
        .then((res) => {
          if (!res.ok) throw new Error(`Error fetching files: ${res.statusText}`)
          return res.json()
        })
        .then((data) => {
          setFiles(data.files || [])
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [status])

  const openFile = (filePath: string) => {
    router.push(`/admin/edit?path=${encodeURIComponent(filePath)}`)
  }

  const query = searchTerm.trim().toLowerCase()

  const grouped = useMemo(() => {
    const shown = files.filter((f) => matches(f, query))
    const compendia = SPECS.map((spec) => ({
      spec,
      file: files.find((f) => f.path === `blog/${spec.id}/compendium.mdx`),
      translations: files.filter(
        (f) => f.kind === 'compendium' && f.locale && f.path.startsWith(`blog/${spec.id}/`)
      ),
    })).filter((c) => !query || [c.file, ...c.translations].some((f) => f && matches(f, query)))
    const articles = shown.filter(isListedArticle)
    const listed = new Set<string>([
      ...SPECS.flatMap((spec) =>
        files.filter((f) => f.kind === 'compendium' && f.path.startsWith(`blog/${spec.id}/`))
      ).map((f) => f.path),
      ...files.filter(isListedArticle).map((f) => f.path),
    ])
    return {
      compendia,
      bySpec: SPECS.map((spec) => ({
        spec,
        files: articles.filter((f) => f.specs.includes(spec.id)).sort(byNewest),
      })),
      general: articles.filter((f) => f.specs.length === 0).sort(byNewest),
      dungeons: shown.filter((f) => f.kind === 'dungeon').sort(byTitle),
      raids: shown.filter((f) => f.kind === 'raid').sort(byTitle),
      other: shown
        .filter((f) => !listed.has(f.path) && f.kind !== 'dungeon' && f.kind !== 'raid')
        .sort(byTitle),
    }
  }, [files, query])

  if (status === 'loading') {
    return <StatusShell>Loading…</StatusShell>
  }

  if (status === 'unauthenticated') {
    return (
      <StatusShell>
        <h1 className="m-0 text-[1.6rem] font-semibold text-white">Sign in to edit</h1>
        <p className="mt-3 mb-0 text-[.95rem] leading-relaxed text-white/60">
          Sign in with GitHub to edit content. You need write access to the repository.
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

  if (loading) {
    return <StatusShell>Loading pages…</StatusShell>
  }

  if (error) {
    return (
      <StatusShell>
        <h1 className="m-0 text-[1.6rem] font-semibold text-white">Couldn’t load pages</h1>
        <p className="mt-3 mb-0 text-[.95rem] text-red-400">{error}</p>
        <Link href="/" className="dg-back mt-8">
          <Icon name="back" size={16} />
          Return home
        </Link>
      </StatusShell>
    )
  }

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
      crumb={{ label: 'Editor', href: '/admin/select', color: ACCENT }}
    >
      <section className="dg-container pt-7 pb-16 sm:pb-[72px]">
        <Link href="/" className="dg-back">
          <Icon name="back" size={16} />
          Back to site
        </Link>

        {/* Visually hidden since the header already names the page */}
        <h1 className="sr-only">Content editor</h1>

        <div className="mt-8 flex flex-col gap-4 border-b border-[#3a3a3a] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[{ id: 'all' as const, label: 'All' }, ...SECTIONS].map((s) => (
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
                <Icon name="search" size={15} />
              </span>
              <input
                type="search"
                placeholder="Search by title, path or spec…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-xs border border-[#3a3a3a] bg-[#1f1f1f] py-0 pr-3 pl-10 text-[.9rem] text-white placeholder-white/40 focus:border-[#d57f43] focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setNewPage({})}
              className="inline-flex h-9 flex-shrink-0 items-center gap-2 rounded-xs px-4 text-[.9rem] leading-none font-semibold text-[#2a2a2a] transition-[filter] hover:brightness-110"
              style={{ background: ACCENT }}
            >
              <Icon name="plus" size={14} />
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
              {grouped.compendia.map(({ spec, file, translations }) => (
                <div
                  key={spec.id}
                  className="group relative overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#242424] transition-colors hover:bg-[#2d2d2d]"
                >
                  <button
                    type="button"
                    disabled={!file}
                    onClick={() => file && openFile(file.path)}
                    className="flex w-full items-center gap-4 p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Image
                      src={SPEC_ICONS[spec.id]}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 flex-shrink-0 rounded-xs object-cover"
                    />
                    <span className="min-w-0">
                      <span
                        className="block text-[1.15rem] font-semibold transition-colors group-hover:text-[var(--spec)]"
                        style={{ ['--spec' as string]: spec.color }}
                      >
                        {spec.name}
                      </span>
                      <span className="block truncate text-[.85rem] text-white/40">
                        {file?.date ? `Updated ${formatDate(file.date)}` : 'Compendium'}
                      </span>
                    </span>
                  </button>
                  {translations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                      {translations.map((t) => (
                        <button
                          key={t.path}
                          type="button"
                          onClick={() => openFile(t.path)}
                          className="dg-chip rounded-xs! px-2.5! py-1! text-[.75rem]!"
                          title={t.path}
                        >
                          {t.locale?.toUpperCase()} translation
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                  {specFiles.length === 0 ? (
                    <EmptyRow>No guides yet.</EmptyRow>
                  ) : (
                    specFiles.map((f) => (
                      <FileRow key={f.path} file={f} onOpen={openFile} hideSpec={spec.id} />
                    ))
                  )}
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
              {grouped.general.length === 0 ? (
                <EmptyRow>No general guides yet.</EmptyRow>
              ) : (
                grouped.general.map((f) => <FileRow key={f.path} file={f} onOpen={openFile} />)
              )}
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
                    {grouped.dungeons.map((f) => (
                      <FileRow key={f.path} file={f} onOpen={openFile} />
                    ))}
                  </Panel>
                )}
                {show('raids') && grouped.raids.length > 0 && (
                  <Panel
                    title="Raids"
                    onAdd={() => setNewPage({ kind: 'raid' })}
                    addLabel="New raid"
                  >
                    {grouped.raids.map((f) => (
                      <FileRow key={f.path} file={f} onOpen={openFile} />
                    ))}
                  </Panel>
                )}
              </div>
            </Section>
          )}

        {show('other') && grouped.other.length > 0 && (
          <Section title="Other pages">
            <Panel title="Pages">
              {grouped.other.map((f) => (
                <FileRow key={f.path} file={f} onOpen={openFile} />
              ))}
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-12">
      <h2 className="m-0 mb-4 text-[1.6rem] font-semibold tracking-[-0.015em]">{title}</h2>
      {children}
    </div>
  )
}

function Panel({
  title,
  tint,
  onAdd,
  addLabel,
  children,
}: {
  title: string
  /** Spec colour for the border */
  tint?: string
  onAdd?: () => void
  addLabel?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col rounded-sm bg-[#1f1f1f]">
      <div
        className="flex items-center justify-between gap-3 rounded-t-sm border border-[#3a3a3a] px-5 py-3.5"
        style={tint ? { borderColor: `${tint}80` } : undefined}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <h3 className="m-0 truncate text-[1.02rem] font-semibold">{title}</h3>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            title={addLabel}
            aria-label={addLabel}
            className="-mr-2.5 inline-flex flex-shrink-0 items-center gap-1.5 rounded-xs px-2.5 py-1.5 text-[.82rem] font-semibold text-white/60 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon name="plus" size={12} />
            New
          </button>
        )}
      </div>
      <ul className="m-0 flex flex-1 list-none flex-col rounded-b-sm border border-t-0 border-[#3a3a3a] p-1.5">
        {children}
      </ul>
    </div>
  )
}

function FileRow({
  file,
  onOpen,
  hideSpec,
}: {
  file: ContentFile
  onOpen: (path: string) => void
  hideSpec?: string
}) {
  const otherSpecs = file.specs.filter((s) => s !== hideSpec)
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(file.path)}
        className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xs px-3.5 py-3 text-left transition-colors hover:bg-[#2a2a2a]"
      >
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate text-[1rem] font-semibold text-white transition-colors group-hover:text-[#d57f43]">
              {file.title}
            </span>
            {file.draft && (
              <span className="flex-shrink-0 rounded-xs border border-white/20 px-1.5 py-px text-[.68rem] font-semibold tracking-wider text-white/60 uppercase">
                Draft
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate font-mono text-[.75rem] text-white/40">
            {file.path}
          </span>
        </span>
        <span className="flex items-center gap-3">
          {otherSpecs.length > 0 && (
            <span className="flex gap-1" title={otherSpecs.join(', ')}>
              {otherSpecs.map((s) => (
                <span
                  key={s}
                  className="h-2 w-2 rounded-full"
                  style={{ background: getSpec(s)?.color ?? '#888' }}
                />
              ))}
            </span>
          )}
          {file.date && (
            <span className="hidden text-[.82rem] whitespace-nowrap text-white/40 sm:inline">
              {formatDate(file.date)}
            </span>
          )}
        </span>
      </button>
    </li>
  )
}

function EmptyRow({ children }: { children: ReactNode }) {
  return <li className="px-3.5 py-3 text-[.92rem] text-white/40">{children}</li>
}

function StatusShell({ children }: { children: ReactNode }) {
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
