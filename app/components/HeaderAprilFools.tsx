import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import png from '../../public/static/images/logo.png'
import border from '../../public/static/images/april/border.png'
import buttonCute from '../../public/static/images/april/button_cute.gif'
import Image from 'next/image'
import Link from '@/components/Link'
import MobileNav from '@/components/MobileNav'
import PageTitle from '@/components/PageTitle'

interface HeaderProps {
  title?: string
  showTitle?: boolean
  isBlog?: boolean
}

const HeaderAprilFools = ({ title, showTitle = true, isBlog = false }: HeaderProps) => {
  const isMainPage = title === 'Main'

  return (
    <>
      <style jsx global>{`
        :root {
          --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        /* Fade in shadow and background on scroll when supported */
        @supports (animation-timeline: scroll()) {
          .header-scroll-shadow {
            animation:
              scroll-shadow linear both,
              scroll-bg linear both;
            animation-timeline: scroll();
            animation-range: 0 80px;
          }

          @keyframes scroll-shadow {
            from {
              box-shadow: none;
            }
            to {
              box-shadow: var(--shadow);
            }
          }

          @keyframes scroll-bg {
            from {
              backdrop-filter: blur(0px);
              background: transparent;
            }
            to {
              backdrop-filter: blur(8px);
              background: rgba(255, 158, 205, 0.1);
            }
          }
        }
      `}</style>
      <header
        className={`header-scroll-shadow top-0 z-20 mt-0 box-border flex min-h-[70px] w-full justify-center bg-transparent pt-6 text-center sm:static sm:mt-6 sm:pt-8 md:pt-8 ${
          !isMainPage ? 'sticky' : ''
        }`}
      >
        <div className="xl:max-w-8xl mx-auto w-full max-w-7xl px-6 sm:px-12 xl:px-6">
          <div className="relative flex w-full items-end justify-between pb-7 sm:pb-8">
            <div className="z-10 flex h-full items-center">
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <div className="relative flex items-center">
                  {typeof siteMetadata.headerTitle === 'string' ? (
                    <div className="font-pixel mb-[-5px] flex items-center text-[2rem] font-bold text-[#ffd4e4] sm:mb-0 sm:text-4xl md:text-4xl lg:text-5xl">
                      <div className="title-effect self-end">
                        <h1 className="title-effect-front  text-[#ffd4e4]">✩☽⋆𝕯𝖗𝖊𝖆𝖒𝖌𝖗𝖔𝖛𝖊⋆☾⁺₊✩</h1>
                      </div>
                    </div>
                  ) : (
                    siteMetadata.headerTitle
                  )}
                </div>
              </Link>
            </div>

            <div className="mb-[-2px] flex h-full items-center">
              <div className="hidden space-x-3 sm:inline-flex sm:items-end lg:space-x-3">
                {headerNavLinks
                  .filter((link) => link.href !== '/')
                  .map((link) => (
                    <div
                      className="rounded px-5 py-2 transition-transform hover:scale-[1.02] sm:text-xl lg:text-lg"
                      key={link.title}
                      style={{
                        backgroundImage: `url(${buttonCute.src})`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      <Link href={link.href} className="font-pixel font-bold text-[#FF7AAD]">
                        {link.title}
                      </Link>
                    </div>
                  ))}
              </div>
              <div className="ml-2 flex h-[31px] items-center sm:ml-6 sm:hidden">
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default HeaderAprilFools
