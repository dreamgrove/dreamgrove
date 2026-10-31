import Image from 'next/image'
import type { SpecInfo } from '@/data/specs'
import type { ContentFile } from '@/lib/admin/content'
import { formatDate } from '@/lib/utils/formatShortDate'
import { SPEC_ICONS } from '@/components/spec/specIcons'

export default function CompendiumCard({
  spec,
  file,
  translations,
  onOpen,
}: {
  spec: SpecInfo
  file?: ContentFile
  translations: ContentFile[]
  onOpen: (path: string) => void
}) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-[#3a3a3a] bg-[#242424] transition-colors hover:bg-[#2d2d2d]">
      <button
        type="button"
        disabled={!file}
        onClick={() => file && onOpen(file.path)}
        className="flex w-full cursor-pointer items-center gap-4 p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={() => onOpen(t.path)}
              className="dg-chip rounded-xs! px-2.5! py-1! text-[.75rem]!"
              title={t.path}
            >
              {t.locale?.toUpperCase()} translation
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
