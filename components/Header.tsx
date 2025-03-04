'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import png from '../public/static/images/logo.png'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const Header = () => {
  const route = usePathname()

  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    console.info('[Header] Initializing header component with route:', route)

    const handleScroll = (route) => {
      if (window.scrollY > 50 && route != '/') {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', () => handleScroll(route))
    return () => {
      console.info('[Header] Removing scroll event listener')
      window.removeEventListener('scroll', handleScroll)
    }
  }, [route])

  return (
    <header
      className={`top-0 z-20 flex w-full justify-center bg-[#F2F3F4] py-8 pt-6 text-center dark:bg-[#282828] sm:py-8 lg:static ${isSticky ? 'sticky shadow-md' : ''}`}
    >
      <div className="xl:max-w-8xl flex w-full max-w-6xl items-end justify-between px-4 sm:px-6 xl:px-0">
        <div className="z-10 flex items-end">
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-end">
              <div className="mr-3 hidden sm:block">
                <Image
                  src={png}
                  alt="Logo"
                  width={54}
                  height={54}
                  className="mb-[-6px] h-auto object-contain drop-shadow-[0_0_1px_rgba(221,107,32,1)] dark:drop-shadow-[0_0_2px_rgba(221,107,32,1)] md:h-[60px]"
                />
              </div>
              {typeof siteMetadata.headerTitle === 'string' ? (
                <div className="font-familiar-pro text-4xl font-bold sm:block md:text-6xl">
                  <div className="title-effect">
                    <span className="title-effect-back">
                      {siteMetadata.headerTitle.toLowerCase()}.gg
                    </span>
                    <span className="title-effect-front">
                      {siteMetadata.headerTitle.toLowerCase()}.gg
                    </span>
                  </div>
                </div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-end space-x-4 sm:space-x-6">
          <div className="hidden items-end space-x-4 lg:flex">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="dark:hover:text-primary-400 text-2xl font-bold text-gray-900 hover:text-primary-500 dark:text-gray-100 sm:block"
                >
                  {link.title}
                </Link>
              ))}
          </div>
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
