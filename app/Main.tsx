import Link from '@/components/Link'
import balance from 'public/static/images/cards/balance-card.png'
import feral from 'public/static/images/cards/feral-card.png'
import resto from 'public/static/images/cards/resto-card.png'
import guardian from 'public/static/images/cards/guardian-card.png'
import dungeons from 'public/static/images/cards/dungeons-card.png'
import raids from 'public/static/images/cards/raids-card.png'

import Image from 'next/image'

export default function Home() {
  const ENABLE_EXTRA_GUIDES = false

  const content = [
    { src: raids, href: '/raids', alt: 'Raid Guides' },
    { src: dungeons, href: '/dungeons', alt: 'Dungeon Guides' },
  ]

  const images = [
    { src: balance, href: '/blog/balance/compendium', alt: 'Balance guide', active: true },
    { src: feral, href: '/blog/feral/compendium', alt: 'Feral guide', active: true },
    { src: resto, href: '/blog/resto/compendium', alt: 'Resto guide', active: true },
    { src: guardian, href: '/', alt: 'Guardian guide', active: false },
  ]

  return (
    <>
      <div className="grid grid-cols-1 gap-4 pt-0 lg:grid-cols-2 ">
        {images.map((image, index) => (
          <Link
            className={!image.active ? 'pointer-events-none' : ''}
            aria-disabled={!image.active}
            tabIndex={!image.active ? -1 : undefined}
            key={index}
            href={image.href}
          >
            <div
              className={`relative block ${
                image.active
                  ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg'
                  : 'cursor-default opacity-30'
              } shadow-md transition-transform duration-300`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={250}
                quality={100}
                style={{ width: '100%', height: 'auto' }}
                className="rounded-lg shadow-md"
              />
            </div>
          </Link>
        ))}
      </div>
      {
        <div className="grid grid-cols-1 gap-4 pt-4 md:pt-4">
          {content.map((image, index) => (
            <Link
              key={index}
              href={image.href}
              className={!ENABLE_EXTRA_GUIDES ? 'pointer-events-none' : ''}
              aria-disabled={!ENABLE_EXTRA_GUIDES}
              tabIndex={!ENABLE_EXTRA_GUIDES ? -1 : undefined}
            >
              <div
                className={`relative block ${
                  ENABLE_EXTRA_GUIDES
                    ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl'
                    : 'cursor-default opacity-30'
                } shadow-md transition-transform duration-300`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={250}
                  style={{ width: '100%', height: 'auto' }}
                  quality={100}
                  className="rounded-lg shadow-md"
                />
              </div>
            </Link>
          ))}
        </div>
      }
    </>
  )
}
