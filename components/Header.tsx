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
    const handleScroll = (route) => {
      if (window.scrollY > 50 && route != '/') {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', () => handleScroll(route))
    return () => window.removeEventListener('scroll', handleScroll)
  }, [route])

  return (
    <header
      className={`top-0 z-20 flex w-full justify-center bg-[#F2F3F4] py-8 pt-6 text-center dark:bg-[#282828] sm:py-8  lg:static ${isSticky ? 'sticky shadow-md' : ''}`}
    >
      <div className="xl:max-w-8xl flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 xl:px-0">
        <div className="z-10 flex items-center">
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center">
              <div className="mr-3 hidden sm:block">
                <Image src={png} alt="Logo" width={60} height={60} />
              </div>
              {typeof siteMetadata.headerTitle === 'string' ? (
                <div className="text-3xl font-bold text-[#dd6b20] sm:block">
                  {siteMetadata.headerTitle}
                </div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden items-center space-x-4 lg:flex">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="dark:hover:text-primary-400 mt-[4px] hidden text-xl font-bold text-gray-900 hover:text-primary-500 dark:text-gray-100 sm:block"
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
