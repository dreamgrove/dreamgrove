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

const InstanceCard = async ({
  title,
  headerImage,
  path,
  variant = 'dungeon',
}: InstanceCardProps) => {
  const file = await fs.readFile(`public/static/images/${headerImage}`)
  const { base64 } = await getPlaiceholder(file)
  const bossCount = await readBossCount(path)
  const isRaid = variant === 'raid'

  return (
    <Link
      href={`/${path}`}
      className={`instance-card group relative block overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
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
          className="object-cover"
        />
      </div>

      {/* Bottom fade for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0906] via-[#0b0906]/55 to-transparent" />

      {/* Type tag */}
      <div className="absolute top-4 left-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.35em] text-[#e6b16a]/90 uppercase">
        <span className="h-[5px] w-[5px] rounded-full bg-[#e6b16a]" />
        {isRaid ? 'Raid' : 'Dungeon'}
      </div>

      {/* Content block */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-5 md:px-6 md:pb-6">
        <div className="max-w-[80%]">
          <h2
            className={`font-thiccboi leading-[1.05] font-semibold tracking-[-0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] ${
              isRaid ? 'text-3xl md:text-[2.25rem]' : 'text-2xl md:text-[1.75rem]'
            }`}
          >
            {title}
          </h2>

          <div className="mt-2 flex items-center gap-2.5 text-[11px] tracking-[0.25em] text-white/65 uppercase">
            {bossCount > 0 && (
              <>
                <span>
                  {bossCount} {bossCount === 1 ? 'Encounter' : 'Encounters'}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[#e6b16a]/70" />
              </>
            )}
            <span className="text-[#e6b16a]/85">Guide</span>
          </div>
        </div>

        {/* Read chevron */}
        <div className="flex shrink-0 items-center gap-2 pb-1 text-[11px] tracking-[0.3em] text-[#e6b16a] uppercase">
          <span className="hidden opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:inline-block md:-translate-x-2">
            Read
          </span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-[#e6b16a] transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            <path
              d="M5 12 H18 M13 7 L18 12 L13 17"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default InstanceCard
