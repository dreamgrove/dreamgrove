'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import png from '../public/static/images/logo.png'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import PageTitle from './PageTitle'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './Header.module.css'

interface Chapter {
  value: string
  depth: number
  url: string
}

interface HeaderProps {
  toc?: Chapter[]
  title?: string
  showTitle?: boolean
  isBlog?: boolean
  crumb?: HeaderCrumb
  variant?: 'default' | 'redesign'
}

export interface HeaderCrumb {
  label: string
  href: string
  color: string
}

export default function Header(props: HeaderProps) {
  const { toc, title, showTitle = true, isBlog = false, crumb, variant = 'default' } = props
  const isMainPage = title === 'Main'
  const isRedesign = variant === 'redesign'
  const showPageTitle = !!title && title !== '' && showTitle

  return (
    <header
      className={`${isRedesign ? '' : styles.headerScrollShadow} top-0 z-20 box-border flex min-h-[70px] w-full justify-center bg-[#F2F3F4] pt-6 text-center sm:static sm:pt-8 md:mt-0 md:pt-8 dark:bg-[#282828] ${
        !isMainPage ? 'sticky' : ''
      }`}
    >
      <div className="xl:max-w-8xl mx-auto w-full max-w-7xl px-6 sm:px-12 xl:px-6">
        <div className="relative flex w-full items-end justify-between pb-7 sm:pb-8">
          {showPageTitle && (
            <div className="absolute right-0 bottom-0 left-0 hidden h-px bg-gray-600 opacity-35 md:block"></div>
          )}
          <div className="font-familiar-pro z-10 mb-[-5px] flex h-full min-w-0 items-baseline text-[2rem] font-bold sm:mb-0 sm:text-4xl md:text-4xl lg:text-3xl">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="relative flex items-center">
                <div className="title-effect self-end">
                  <span>
                    {siteMetadata.headerTitle.toLowerCase()}
                    <span className="text-main">.</span>gg
                  </span>
                </div>
                <div className="absolute -top-[2px] -right-4 z-50 sm:-top-[9px] sm:-right-5 md:block">
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
            {crumb && (
              <>
                <span className="relative top-[2px] ml-[24px] hidden font-light text-[#666] sm:inline">
                  /
                </span>
                <Link
                  href={crumb.href}
                  className="relative top-[2px] ml-[15px] hidden truncate hover:brightness-110 sm:inline"
                  style={{ color: crumb.color }}
                >
                  {crumb.label}
                </Link>
              </>
            )}
          </div>

          {showPageTitle && (
            <div className="hidden h-full items-center lg:flex lg:text-center">
              <PageTitle className="font-familiar-pro text-[2rem] leading-9 lg:text-3xl lg:leading-9">
                {title}
              </PageTitle>
            </div>
          )}

          <div className="mb-[-2px] flex h-full items-center">
            <div className="hidden space-x-3 sm:inline-flex sm:items-end lg:space-x-3">
              {headerNavLinks
                .filter((link) => !(isMainPage && link.href === '/'))
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
              <MobileNav toc={toc} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
