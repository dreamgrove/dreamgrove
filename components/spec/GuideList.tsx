'use client'
import { useMemo, useState } from 'react'
import Link from '@/components/Link'
import type { GuideEntry } from '@/lib/guides'
import { formatDate } from '@/lib/utils/formatShortDate'

export default function GuideList({
  guides,
  title = 'Guides',
  color,
  emptyText = 'No other guides for this spec yet.',
}: {
  guides: GuideEntry[]
  title?: string
  color: string
  emptyText?: string
}) {
  const [filter, setFilter] = useState('All')
  const types = useMemo(() => ['All', ...new Set(guides.map((g) => g.type))], [guides])
  const shown = guides.filter((g) => filter === 'All' || g.type === filter)

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-5 pb-[22px]">
        <h2 className="m-0 text-[2rem] font-semibold tracking-[-0.015em]">{title}</h2>
        {types.length > 2 && (
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                className="dg-chip px-3.5! py-2!"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="m-0 text-[.95rem] text-white/40">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg bg-[#242424] px-4 py-4 text-white transition-colors hover:bg-[#2d2d2d] sm:gap-7 sm:px-6 sm:py-5"
            >
              <div className="min-w-0">
                {g.date && (
                  <div className="mb-1.5 text-[.85rem] text-white/40">{formatDate(g.date)}</div>
                )}
                <div
                  className="text-[1.2rem] font-semibold tracking-[-0.01em] transition-colors group-hover:text-[var(--spec)]"
                  style={{ ['--spec' as string]: color }}
                >
                  {g.draft && <span className="mr-2 text-white/40">[Draft]</span>}
                  {g.title}
                </div>
                {g.summary && (
                  <div className="mt-[5px] text-[.95rem] leading-normal text-pretty text-white/60">
                    {g.summary}
                  </div>
                )}
              </div>
              <span className="text-[.85rem] text-white/40">{g.type}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
