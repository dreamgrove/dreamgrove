'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import png from '../public/static/images/logo.png'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Language switcher component
const LanguageSwitch = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState('en-US')

  // Check if we're on a blog page
  const isBlogPage = pathname.includes('/blog')

  useEffect(() => {
    // Determine current locale from URL
    if (pathname.includes('/kr/')) {
      setCurrentLocale('ko-KR')
    } else {
      setCurrentLocale('en-US')
    }
  }, [pathname])

  // Don't render the button if not on a blog page
  if (!isBlogPage) {
    return null
  }

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'en-US' ? 'ko-KR' : 'en-US'

    // Handle URL transformation for language change
    let newPath = pathname

    // Check if this is a compendium page with the pattern /blog/[compendium_type]/kr/compendium (Korean)
    // or /blog/[compendium_type]/compendium (English)
    const koreanCompendiumRegex = /\/blog\/([^/]+)\/kr\/compendium/
    const englishCompendiumRegex = /\/blog\/([^/]+)\/compendium/

    const koreanMatch = pathname.match(koreanCompendiumRegex)
    const englishMatch = pathname.match(englishCompendiumRegex)

    if (koreanMatch) {
      // This is a Korean compendium page
      const compendiumType = koreanMatch[1]

      if (newLocale === 'ko-KR') {
        // Already in Korean, no change needed
        newPath = pathname
      } else {
        // For English, remove the kr segment
        newPath = `/blog/${compendiumType}/compendium`
      }
    } else if (englishMatch) {
      // This is an English compendium page
      const compendiumType = englishMatch[1]

      if (newLocale === 'ko-KR') {
        // For Korean, add the kr segment
        newPath = `/blog/${compendiumType}/kr/compendium`
      } else {
        // Already in English, no change needed
        newPath = pathname
      }
    } else if (pathname.includes('/blog')) {
      // For other blog pages, check if they follow a pattern like /blog/[something]
      const blogPathRegex = /\/blog\/([^/]+)/
      const blogMatch = pathname.match(blogPathRegex)

      if (blogMatch) {
        const blogType = blogMatch[1]

        if (blogType === 'kr') {
          const restOfPath = pathname.replace('/blog/kr/', '')

          if (newLocale === 'ko-KR') {
            newPath = pathname
          } else {
            newPath = `/blog/${restOfPath}`
          }
        } else {
          if (newLocale === 'ko-KR') {
            newPath = `/blog/${blogType}/kr/compendium`
          } else {
            newPath = `/blog/${blogType}/compendium`
          }
        }
      } else {
        if (newLocale === 'ko-KR') {
          newPath = '/blog/kr'
        } else {
          newPath = '/blog'
        }
      }
    }

    router.push(newPath)
  }

  return (
    <button
      aria-label="Toggle Language"
      onClick={toggleLanguage}
      className="rounded-md border border-gray-300 p-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      {currentLocale === 'en-US' ? 'KR' : 'EN'}
    </button>
  )
}

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
    return () => {
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
          <LanguageSwitch />
          {false && <ThemeSwitch />}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
