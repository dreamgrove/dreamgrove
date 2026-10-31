import type { ReactNode } from 'react'
import { getSpec } from '@/data/specs'
import type { ContentFile } from '@/lib/admin/content'
import { formatDate } from '@/lib/utils/formatShortDate'
import { Badge } from '@/components/admin/ui/Badges'
import Icon from '@/components/Icon'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-12">
      <h2 className="m-0 mb-4 text-[1.6rem] font-semibold tracking-[-0.015em]">{title}</h2>
      {children}
    </div>
  )
}

/** A titled list of files optionally with a "New" button */
export function Panel({
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
        <h3 className="m-0 min-w-0 truncate text-[1.02rem] font-semibold">{title}</h3>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            title={addLabel}
            aria-label={addLabel}
            className="-mr-2.5 inline-flex flex-shrink-0 items-center gap-1.5 rounded-xs px-2.5 py-1.5 text-[.82rem] font-semibold text-white/60 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon box name="plus" size={12} />
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

/** `files` as rows, or `empty` */
export function FileRows({
  files,
  onOpen,
  hideSpec,
  empty,
}: {
  files: ContentFile[]
  onOpen: (path: string) => void
  hideSpec?: string
  empty?: string
}) {
  if (files.length === 0 && empty) {
    return <li className="px-3.5 py-3 text-[.92rem] text-white/40">{empty}</li>
  }
  return files.map((f) => <FileRow key={f.path} file={f} onOpen={onOpen} hideSpec={hideSpec} />)
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
            {file.draft && <Badge>Draft</Badge>}
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
