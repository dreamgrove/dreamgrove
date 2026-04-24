import React from 'react'
import Link from 'next/link'
import fs from 'node:fs/promises'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'

type Variant = 'dungeon' | 'raid'

interface InstanceCardProps {
  title: string
  headerImage: string
  path: string
  index?: number
  variant?: Variant
}

const ROMAN = [
  '',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
]

async function readBossCount(path: string): Promise<number> {
  try {
    const file = await fs.readFile(`data/${path}.mdx`, 'utf-8')
    const matches = file.match(/<BossCard\b/g)
    const count = matches ? matches.length : 0
    const hasTrash = /<BossCard\s+title=["']Trash["']/i.test(file)
    return Math.max(0, count - (hasTrash ? 1 : 0))
  } catch {
    return 0
  }
}

const CornerOrnament = ({
  position,
  className = '',
}: {
  position: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
}) => {
  const rotate = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  }[position]
  const place = {
    tl: 'top-2 left-2',
    tr: 'top-2 right-2',
    br: 'bottom-2 right-2',
    bl: 'bottom-2 left-2',
  }[position]
  return (
    <svg
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute ${place} ${rotate} h-7 w-7 text-[#e6b16a] drop-shadow-[0_0_4px_rgba(213,127,67,0.35)] ${className}`}
      aria-hidden
    >
      <path
        d="M2 2 L2 16 M2 2 L16 2 M2 2 L11 11"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="13" cy="13" r="1.4" fill="currentColor" />
    </svg>
  )
}

const InstanceCard = async ({
  title,
  headerImage,
  path,
  index = 0,
  variant = 'dungeon',
}: InstanceCardProps) => {
  const file = await fs.readFile(`public/static/images/${headerImage}`)
  const { base64 } = await getPlaiceholder(file)
  const bossCount = await readBossCount(path)
  const roman = ROMAN[index] || String(index)
  const isRaid = variant === 'raid'

  return (
    <Link
      href={`/${path}`}
      className={`instance-card group relative block overflow-hidden rounded-[2px] ${
        isRaid ? 'h-72 md:h-80' : 'h-60 md:h-64'
      }`}
      aria-label={title}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          alt={title}
          src={`/static/images/${headerImage}`}
          fill
          sizes={isRaid ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
          placeholder="blur"
          blurDataURL={base64}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0906] via-[#0b0906]/55 to-[#0b0906]/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(213,127,67,0.18),transparent_55%)] opacity-70 mix-blend-screen" />
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.6)_0px,rgba(255,255,255,0.6)_1px,transparent_1px,transparent_3px)] opacity-[0.09] mix-blend-overlay" />

      {/* Gilt hairline frame */}
      <div className="pointer-events-none absolute inset-[10px] rounded-[1px] border border-[#e6b16a]/25 transition-colors duration-500 group-hover:border-[#e6b16a]/55" />
      <div className="pointer-events-none absolute inset-[13px] rounded-[1px] border border-[#e6b16a]/10" />

      {/* Grain overlay */}
      <div className="[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.55%22/></svg>')] pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />

      {/* Corner ornaments */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* Index rune (top-right under ornament) */}
      {index > 0 && (
        <div className="pointer-events-none absolute top-4 right-9 flex items-center gap-2 text-[10px] tracking-[0.35em] text-[#e6b16a]/80">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#e6b16a]/60" />
          <span className="text-sm font-[var(--font-magnificent)]">{roman}</span>
        </div>
      )}

      {/* Type badge (top-left under ornament) */}
      <div className="pointer-events-none absolute top-4 left-9 flex items-center gap-2">
        <span className="h-[6px] w-[6px] rotate-45 border border-[#e6b16a]/80 bg-[#e6b16a]/20" />
        <span className="text-[10px] font-semibold tracking-[0.4em] text-[#e6b16a]/85 uppercase">
          {isRaid ? 'Raid' : 'Dungeon'}
        </span>
      </div>

      {/* Content block */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-6 md:px-8 md:pb-7">
        <div className="relative max-w-[80%]">
          <span className="mb-2 block h-px w-10 bg-[#e6b16a] transition-all duration-500 group-hover:w-20" />
          <h2
            className={`font-thiccboi leading-[1.02] font-[600] tracking-[-0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] ${
              isRaid ? 'text-3xl md:text-[2.25rem]' : 'text-2xl md:text-[1.75rem]'
            }`}
          >
            {title}
          </h2>

          <div className="mt-3 flex items-center gap-3 text-[11px] tracking-[0.3em] text-white/65 uppercase">
            {bossCount > 0 && (
              <>
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-[#1a9c82]" aria-hidden>
                    <path
                      d="M6 0 L7.3 4.7 L12 6 L7.3 7.3 L6 12 L4.7 7.3 L0 6 L4.7 4.7 Z"
                      fill="currentColor"
                    />
                  </svg>
                  {bossCount} {bossCount === 1 ? 'Encounter' : 'Encounters'}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[#e6b16a]/70" />
              </>
            )}
            <span className="text-[#e6b16a]/85">Guide</span>
          </div>
        </div>

        {/* Enter sigil */}
        <div className="flex shrink-0 translate-y-[2px] items-center gap-2 pb-1 text-[11px] tracking-[0.35em] text-[#e6b16a] uppercase">
          <span className="hidden opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:inline-block md:-translate-x-2">
            Read
          </span>
          <svg
            viewBox="0 0 28 28"
            className="h-7 w-7 text-[#e6b16a] transition-transform duration-500 group-hover:translate-x-1"
            aria-hidden
          >
            <circle
              cx="14"
              cy="14"
              r="12.5"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.45"
            />
            <path
              d="M10 14 H18 M14.5 10.5 L18 14 L14.5 17.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Sheen sweep on hover */}
      <span className="instance-card__sheen pointer-events-none absolute inset-0" aria-hidden />
    </Link>
  )
}

export default InstanceCard
