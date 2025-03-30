'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import png from '../public/static/images/logo.png'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { usePostTitle } from './PostTitleContext'
import PageTitle from './PageTitle'
import LanguageSwitcher from './LanguageSwitcher'

const Header = () => {
  const route = usePathname()
  const isBlogPage = route.includes('/blog')
  const { title } = usePostTitle()

  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = (route) => {
      if (window.scrollY > 50 && route != '/') {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', () => handleScroll(route))
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [route])

  return (
    <header
      className={`top-0 z-20 box-border flex min-h-[70px] w-full justify-center bg-[#F2F3F4] pt-8 text-center dark:bg-[#282828] md:mt-0 md:pt-8 lg:static ${isSticky ? 'sticky shadow-md' : ''}`}
    >
      <div className="xl:max-w-8xl mx-auto w-full max-w-6xl px-6 sm:px-12 xl:px-6">
        <div className="relative flex w-full items-end justify-between pb-8 md:pb-8">
          {title && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-600 opacity-35"></div>
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
                <div className="absolute -right-5 -top-[9px] z-50 md:block">
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

          {title && (
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
            {isBlogPage && (
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
  )
}

export default Header
