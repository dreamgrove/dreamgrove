'use client'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import { useState, ViewTransition } from 'react'
import SpecArt from '@/components/spec/SpecArt'
import { setActiveSpec, useActiveSpec } from '@/components/spec/ActiveSpec'
import { inPageTransition } from '@/components/spec/specCardMorph'

export interface SpecTile {
  id: string
  name: string
  color: string
  art?: string
  artPosition?: string
}

const ROW =
  'relative flex min-h-[80px] grow basis-0 items-center rounded-lg [clip-path:inset(0_round_0.5rem)] text-white'
const NAME = 'font-gilroy text-mask-white pointer-events-none relative w-fit leading-none font-bold'

export default function Home({ tiles }: { tiles: SpecTile[] }) {
  const [hover, setHover] = useState<string | null>(null)
  const activeSpec = useActiveSpec()

  return (
    <section className="dg-container flex flex-col pt-1 pb-8 sm:min-h-[calc(100dvh-208px)]">
      {/* Visually hidden by design; kept in the DOM for screen readers and crawlers */}
      <header className="sr-only">
        <h1>World of Warcraft Druid Guides</h1>
        <p>
          Compendiums, theorycrafting, and community resources for Balance, Feral, Guardian, and
          Restoration Druids — plus dungeon and raid guides.
        </p>
      </header>
      <div className="flex flex-1 flex-col gap-[11px]">
        {tiles.map((t) => {
          const isHover = hover === t.id
          return (
            <ViewTransition key={t.id} name={`spec-card-${t.id}`} share="spec-card">
              <Link
                href={`/${t.id}`}
                data-spec-card={t.id}
                onClick={() => setActiveSpec(t.id)}
                onMouseEnter={() => !inPageTransition() && setHover(t.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => !inPageTransition() && setHover(t.id)}
                onBlur={() => setHover(null)}
                className={`${ROW} bg-[#0b0906] px-6 sm:px-8`}
                style={{ flexGrow: 1.56, minHeight: 125 }}
              >
                <div className="absolute inset-0">
                  <SpecArt
                    art={t.art}
                    color={t.color}
                    position={t.artPosition ?? 'center 20%'}
                    // Tiles live in .dg-container (max-width 80rem)
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    tint={isHover ? 0 : 0.2}
                    scrim={0}
                    className={`transition-transform duration-[800ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
                      isHover ? 'scale-[1.03]' : ''
                    }`}
                  />
                </div>
                <div className="pointer-events-none absolute -inset-1 bg-[linear-gradient(90deg,rgba(20,20,20,.9)_0%,rgba(20,20,20,.7)_25%,rgba(20,20,20,0)_55%)]" />
                <span
                  className={`${NAME} mb-5 self-end text-[40px] sm:mb-6 sm:text-[48px]`}
                  style={activeSpec === t.id ? { viewTransitionName: 'spec-tile-name' } : undefined}
                >
                  {t.name}
                </span>
              </Link>
            </ViewTransition>
          )
        })}
        <Link
          href="/guides"
          className={`${ROW} bg-[#1f1f1f] px-6 transition-colors hover:bg-[#363636] sm:px-8`}
        >
          <span className={`${NAME} text-[26px] sm:text-[30px]`}>Other guides</span>
        </Link>
        <div className="grid grow basis-0 grid-cols-[minmax(0,1fr)_80px] gap-[11px] sm:grid-cols-[3fr_1fr] lg:grid-cols-[4fr_1fr]">
          <Link
            href="/planner"
            className={`${ROW} bg-[#1f1f1f] px-6 transition-colors hover:bg-[#363636] sm:px-8`}
          >
            <div className="flex flex-col gap-2">
              <span className={`${NAME} text-[26px] sm:text-[30px]`}>Cooldown planner</span>
              <span className="hidden text-[.9rem] leading-snug text-white/60 sm:block">
                Plan your cooldowns on an interactive timeline.
              </span>
            </div>
          </Link>
          <Link
            href="https://discord.com/invite/dreamgrove"
            aria-label="Discord"
            className={`${ROW} justify-center gap-3 bg-[#1f1f1f] transition-colors hover:bg-[#363636] sm:px-6`}
          >
            <span className={`${NAME} hidden text-[30px] sm:block`}>Discord</span>
            <Icon name="discord" aria-hidden className="relative size-8 shrink-0 sm:size-7" />
          </Link>
        </div>
      </div>
    </section>
  )
}
