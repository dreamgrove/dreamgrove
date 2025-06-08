import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'
import Link from 'next/link'

export default function TimelineHeader() {
  return (
    <div className="flex w-full bg-[#2a2a2a] px-8 py-4 align-text-bottom text-xl">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="relative flex items-center">
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="font-familiar-pro l mb-[-5px] flex items-center text-[1.5rem] font-bold sm:mb-0 sm:text-4xl md:text-2xl">
              <div className="title-effect self-end">
                <span className="title-effect-front">
                  {siteMetadata.headerTitle.toLowerCase()}
                  <span className="text-main">.</span>gg
                </span>
              </div>
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
          <div className="absolute -top-[1px] -right-4 z-50 sm:-top-[6px] sm:-right-5 md:block">
            <Image
              src={'/static/images/logo.png'}
              alt="Logo"
              width={35}
              height={35}
              className="h-auto object-contain"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}
