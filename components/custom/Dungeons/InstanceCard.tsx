import Link from 'next/link'
import fs from 'node:fs/promises'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'

type Variant = 'dungeon' | 'raid'

interface InstanceCardProps {
  title: string
  headerImage: string
  path: string
  variant?: Variant
}

async function blurFor(headerImage: string) {
  try {
    const file = await fs.readFile(`public/static/images/${headerImage}`)
    return (await getPlaiceholder(file)).base64
  } catch {
    return undefined
  }
}

const InstanceCard = async ({
  title,
  headerImage,
  path,
  variant = 'dungeon',
}: InstanceCardProps) => {
  const blur = await blurFor(headerImage)
  const isRaid = variant === 'raid'

  return (
    <Link
      href={`/${path}`}
      className={`group relative block overflow-hidden rounded-lg bg-[#0b0906] text-white ${
        isRaid ? 'h-48 sm:h-80' : 'h-42 sm:h-64'
      }`}
    >
      <Image
        alt=""
        src={`/static/images/${headerImage}`}
        fill
        sizes={isRaid ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
        placeholder={blur ? 'blur' : 'empty'}
        blurDataURL={blur}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(11,9,6,.45)] transition-colors duration-300 group-hover:bg-[rgba(11,9,6,.3)]" />
      <h2
        className={`absolute bottom-6 left-6 m-0 max-w-[85%] leading-[.95] font-semibold sm:left-[30px] ${
          isRaid ? 'text-[2.2rem] sm:text-5xl' : 'text-[2rem] sm:text-[2.4rem]'
        }`}
      >
        {title}
      </h2>
    </Link>
  )
}

export default InstanceCard
