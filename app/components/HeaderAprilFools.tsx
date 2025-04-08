import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import buttonCute from '../../public/static/images/april/button_cute.gif'
import Link from '@/components/Link'
import MobileNav from '@/components/MobileNav'
import styles from './HeaderAprilFools.module.css'

interface HeaderProps {
  title?: string
  showTitle?: boolean
  isBlog?: boolean
}

const HeaderAprilFools = ({ title }: HeaderProps) => {
  const isMainPage = title === 'Main'

  return (
    <>
      <header
        className={`${styles.headerScrollShadow} top-0 z-20 mt-0 box-border flex min-h-[70px] w-full justify-center bg-transparent pt-6 text-center sm:static sm:mt-6 sm:pt-8 md:pt-8 ${
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
                        <h1 className="title-effect-front text-[#ffd4e4]">✩☽⋆𝕯𝖗𝖊𝖆𝖒𝖌𝖗𝖔𝖛𝖊⋆☾⁺₊✩</h1>
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
