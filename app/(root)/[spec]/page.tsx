import Icon from '@/components/Icon'
import { ViewTransition } from 'react'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import PageWrapper from '@/components/PageWrapper'
import SpecArt from '@/components/spec/SpecArt'
import GuideList from '@/components/spec/GuideList'
import ActiveSpec from '@/components/spec/ActiveSpec'
import { genPageMetadata } from '@/lib/seo'
import { allBlogs } from 'contentlayer/generated'
import { SPECS, getSpec } from '@/data/specs'
import { getSpecArt } from '@/lib/specArt'
import { getGuidesForSpec } from '@/lib/guides'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return SPECS.map((s) => ({ spec: s.id }))
}

export async function generateMetadata(props: { params: Promise<{ spec: string }> }) {
  const { spec: id } = await props.params
  const spec = getSpec(id)
  if (!spec) return {}
  return genPageMetadata({
    title: `${spec.name} Druid`,
    description: `${spec.name} Druid compendium and guides. ${spec.blurb}`,
  })
}

export default async function SpecHubPage(props: { params: Promise<{ spec: string }> }) {
  const { spec: id } = await props.params
  const spec = getSpec(id)
  if (!spec) return notFound()

  const compendium = allBlogs.find((p) => p.slug === spec.compendiumSlug)
  const guides = getGuidesForSpec(spec.id)
  const others = SPECS.filter((s) => s.id !== spec.id)

  return (
    <PageWrapper
      title={`${spec.name} Druid`}
      showTitle={false}
      variant="redesign"
      crumb={{ label: spec.name, href: `/${spec.id}`, color: spec.color }}
    >
      <section className="pb-16 sm:pb-[72px]">
        <ActiveSpec id={spec.id} />
        <ViewTransition name={`spec-card-${spec.id}`} share="spec-card">
          <div
            className="relative h-[340px] overflow-hidden bg-[#0b0906] sm:h-[440px]"
            data-spec-card={spec.id}
          >
            <SpecArt
              art={getSpecArt(spec.id)}
              color={spec.color}
              position={spec.artPosition ?? 'center 30%'}
              tint={0.35}
              scrim={0.45}
              priority
            />
            {/* The back link sits above the name with the same gap as the name has to the
              overlapping card below (pb minus the card's -mt-24) */}
            <div className="dg-container relative flex h-full flex-col items-start justify-end gap-6 pt-7 pb-[120px] sm:gap-8 sm:pb-32">
              <Link href="/" className="dg-back" style={{ viewTransitionName: 'spec-hub-back' }}>
                <Icon name="arrowLeftThin" size={14} />
                All specs
              </Link>
              {/* Own transition layer so it fades in where it sits instead of growing out of the tile */}
              <h1
                className="m-0 w-fit text-[3.4rem] leading-[.88] font-semibold sm:text-[5.2rem]"
                style={{ viewTransitionName: 'spec-hub-name' }}
              >
                {spec.name}
              </h1>
            </div>
          </div>
        </ViewTransition>

        <div className="dg-container relative z-[2] -mt-24">
          {/* Named so it's captured as its own layer during the page transition; otherwise
              the hero's layer paints over the part of this panel that overlaps it */}
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] overflow-hidden rounded-lg border border-dg-line bg-dg-panel-deep"
            style={{ viewTransitionName: 'spec-hub-panel' }}
          >
            <div className="flex flex-col px-6 py-8 sm:px-11 sm:pt-11 sm:pb-10">
              <h2 className="m-0 text-[1.9rem] leading-[1.1] font-semibold text-balance sm:text-[2.3rem]">
                Compendium
              </h2>
              <p className="mt-4 mb-0 max-w-[460px] text-[1.05rem] leading-[1.65] text-pretty text-white/60">
                {spec.blurb}
              </p>
              {compendium && (
                <div className="mt-6 flex flex-wrap gap-x-[22px] gap-y-2 text-[.92rem] text-white/60">
                  {compendium.authors && compendium.authors.length > 0 && (
                    <span>
                      By{' '}
                      <span className="font-semibold text-white">
                        {compendium.authors.join(', ')}
                      </span>
                    </span>
                  )}
                  {compendium.patch && (
                    <span>
                      Patch <span className="font-semibold text-white">{compendium.patch}</span>
                    </span>
                  )}
                  {compendium.lastModified && (
                    <span>
                      Updated{' '}
                      <span className="font-semibold text-white">{compendium.lastModified}</span>
                    </span>
                  )}
                </div>
              )}
              <div className="min-h-[30px] flex-1" />
              <Link
                href={`/blog/${spec.compendiumSlug}`}
                className="inline-flex items-center gap-2.5 self-start rounded-md px-5 py-[13px] text-base font-semibold text-dg-panel! transition-[filter] hover:brightness-110"
                style={{ background: spec.color }}
              >
                Read the compendium
                <Icon name="arrowRightThin" size={16} />
              </Link>
            </div>

            <div className="border-t border-dg-line px-4 pt-7 pb-6 sm:px-8 sm:pt-8 sm:pb-7 lg:border-t-0 lg:border-l">
              <div className="dg-eyebrow mx-3 mb-2.5">Jump to</div>
              <nav className="flex flex-col">
                {spec.jumpTo.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="grid grid-cols-[34px_minmax(0,1fr)] items-center gap-2 rounded-md px-3 py-[13px] text-white transition-colors hover:bg-dg-panel"
                  >
                    <span
                      className="text-[.85rem] font-semibold tabular-nums"
                      style={{ color: spec.color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[1.02rem] font-medium">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <GuideList guides={guides} title="Other guides" color={spec.color} />

          <div className="mt-[72px] flex flex-wrap items-center gap-6 font-semibold">
            <span className="text-[.92rem] text-white/40">Other specs</span>
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/${o.id}`}
                className="text-base text-white transition-colors hover:text-main"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
