'use client'
import Icon from '@/components/Icon'
import { ReactNode } from 'react'
import Image from 'next/image'
import Link from '@/components/Link'
import type { CoreContent } from '@/lib/utils/contentlayer'
import type { Dungeons, Raids } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import PageActions from '@/components/PageActions'
import CheckboxProvider from '@/components/custom/CheckboxProvider'
import SpecFilterChips, { ALL_SPECS_CHECKED } from '@/components/spec/SpecFilterChips'
import EncounterRail from '@/components/spec/EncounterRail'
import { EncounterProvider, type EncounterMeta } from '@/components/spec/EncounterContext'

interface LayoutProps {
  content: CoreContent<Dungeons | Raids>
  children: ReactNode
}

/** Shared layout for dungeon and raid guides: hero, sticky spec/encounter rail, encounters. */
export default function DungeonLayout({ content, children }: LayoutProps) {
  const { title, headerImage, path, authors, lastModified, filePath } = content
  const isRaid = path.startsWith('raids/')
  const encounters = (content.encounters ?? []) as EncounterMeta[]
  const editUrl = `${siteMetadata.siteRepo}/edit/master/data/${filePath}`

  return (
    <CheckboxProvider initialMap={ALL_SPECS_CHECKED}>
      <EncounterProvider encounters={encounters} editUrl={editUrl}>
        <div className="pb-16 sm:pb-[72px]">
          <PageActions editPath={filePath} />
          <section className="relative h-[280px] overflow-hidden bg-[#0b0906] sm:h-[340px]">
            {headerImage && (
              <Image
                src={`/static/images/${headerImage}`}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-[rgba(11,9,6,.5)]" />
            <div className="dg-container relative flex h-full flex-col items-start justify-between pt-7 pb-9">
              <Link href={isRaid ? '/raids' : '/dungeons'} className="dg-back">
                <Icon name="arrowLeftThin" size={14} />
                {isRaid ? 'Raids' : 'Mythic+ dungeons'}
              </Link>
              <div className="flex flex-col gap-4">
                <h1 className="m-0 text-[2.9rem] leading-[.9] font-semibold text-balance sm:text-[4.6rem]">
                  {title}
                </h1>
                <div className="flex flex-wrap gap-x-[22px] gap-y-1 text-[.92rem] text-white/70">
                  {authors && authors.length > 0 && (
                    <span className="whitespace-nowrap">
                      By <span className="font-semibold text-white">{authors.join(', ')}</span>
                    </span>
                  )}
                  {lastModified && (
                    <span className="whitespace-nowrap">
                      Updated <span className="font-semibold text-white">{lastModified}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="dg-container">
            <div className="mt-10 flex flex-col gap-10 sm:mt-14 lg:flex-row lg:items-start lg:gap-14">
              {/* lg:pt-[5px] lines the first label's capitals up with the first encounter heading */}
              <aside className="flex flex-col gap-[18px] lg:sticky lg:top-24 lg:w-[220px] lg:flex-none lg:pt-[5px]">
                <div className="flex flex-col gap-3 border-b border-dg-line pb-[18px]">
                  <div className="dg-eyebrow lg:px-3">Show notes for</div>
                  <SpecFilterChips />
                </div>
                <EncounterRail />
                <a
                  href={editUrl}
                  className="text-[.85rem] font-semibold text-white/40 transition-colors hover:text-main lg:px-3"
                >
                  Edit this guide on GitHub
                </a>
              </aside>

              <article className="flex min-w-0 flex-1 flex-col">{children}</article>
            </div>
          </div>
        </div>
      </EncounterProvider>
    </CheckboxProvider>
  )
}
