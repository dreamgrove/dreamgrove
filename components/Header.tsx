import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import png from '../public/static/images/logo.png'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import PageTitle from './PageTitle'
import LanguageSwitcher from './LanguageSwitcher'
import HeaderAprilFools from '../app/components/HeaderAprilFools'
import { isAprilFoolsServer } from '../app/utils/serverDateUtils'
import styles from './Header.module.css'

interface HeaderProps {
  title?: string
  showTitle?: boolean
  isBlog?: boolean
}

const Header = (props: HeaderProps) => {
  if (isAprilFoolsServer()) {
    return <HeaderAprilFools {...props} />
  }

  const { title, showTitle = true, isBlog = false } = props
  const isMainPage = title === 'Main'

  return (
    <>
      <header
        className={`${styles.headerScrollShadow} top-0 z-20 box-border flex min-h-[70px] w-full justify-center bg-[#F2F3F4] pt-6 text-center dark:bg-[#282828] sm:static sm:pt-8 md:mt-0 md:pt-8 ${
          !isMainPage ? 'sticky' : ''
        }`}
      >
        <div className="xl:max-w-8xl mx-auto w-full max-w-7xl px-6 sm:px-12 xl:px-6">
          <div className="relative flex w-full items-end justify-between pb-7 sm:pb-8 ">
            {title && title != '' && showTitle && (
              <div className="absolute bottom-0 left-0 right-0 hidden h-[1px] bg-gray-600 opacity-35 md:block"></div>
            )}
            <div className="z-10 flex h-full items-center">
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <div className="relative flex items-center">
                  {typeof siteMetadata.headerTitle === 'string' ? (
                    <div className="mb-[-5px] flex items-center font-familiar-pro text-[2rem] font-bold sm:mb-0 sm:text-4xl md:text-4xl lg:text-3xl">
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
                  <div className="absolute -right-4 -top-[2px] z-50 sm:-right-5 sm:-top-[9px] md:block">
                    <Image
                      src={png}
                      alt="Logo"
                      width={40}
                      height={40}
                      className="h-auto object-contain"
                    />
                  </div>
                </div>
              </Link>
            </div>

            {title && title != '' && showTitle && (
              <div className="hidden h-full items-center lg:flex lg:text-center">
                <PageTitle className="font-familiar-pro text-[2rem] lg:text-3xl">{title}</PageTitle>
              </div>
            )}

            <div className="mb-[-2px] flex h-full items-center">
              <div className="hidden space-x-3 sm:inline-flex sm:items-end lg:space-x-3">
                {headerNavLinks
                  .filter((link) => link.href !== '/')
                  .map((link) => (
                    <div className="title-effect sm:text-xl lg:text-lg" key={link.title}>
                      <Link href={link.href} className="font-familiar-pro font-bold">
                        <span className="title-effect-front">{link.title}</span>
                      </Link>
                    </div>
                  ))}
              </div>
              {isBlog && (
                <div className="ml-4 flex h-full items-center self-center lg:ml-3">
                  <LanguageSwitcher />
                </div>
              )}
              <div className="ml-2 flex h-[31px] items-center sm:ml-6 sm:hidden">
                {false && <ThemeSwitch />}
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
