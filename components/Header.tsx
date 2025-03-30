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
import { IoLanguage } from 'react-icons/io5'
import { usePostTitle } from './PostTitleContext'
import PageTitle from './PageTitle'

// Language switcher component
const LanguageSwitch = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState('en-US')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Add the event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Don't render the button if not on a blog page
  if (!isBlogPage) {
    return null
  }

  const navigateToLanguage = (locale) => {
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

      if (locale === 'ko-KR') {
        // Already in Korean, no change needed
        newPath = pathname
      } else {
        // For English, remove the kr segment
        newPath = `/blog/${compendiumType}/compendium`
      }
    } else if (englishMatch) {
      // This is an English compendium page
      const compendiumType = englishMatch[1]

      if (locale === 'ko-KR') {
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

          if (locale === 'ko-KR') {
            newPath = pathname
          } else {
            newPath = `/blog/${restOfPath}`
          }
        } else {
          if (locale === 'ko-KR') {
            newPath = `/blog/${blogType}/kr/compendium`
          } else {
            newPath = `/blog/${blogType}/compendium`
          }
        }
      } else {
        if (locale === 'ko-KR') {
          newPath = '/blog/kr'
        } else {
          newPath = '/blog'
        }
      }
    }

    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative flex h-full items-center" ref={dropdownRef}>
      <button
        aria-label="Language Menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-full items-center justify-center self-center rounded-md font-familiar-pro font-normal transition-all hover:opacity-80"
      >
        <IoLanguage className="translate-y-[-1px] text-xl text-main" />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+2px)] z-50 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white shadow-lg transition-opacity dark:border-gray-700 dark:bg-gray-800 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="py-1">
          <a
            href={currentLocale !== 'en-US' ? pathname.replace('/kr/', '/') : '#'}
            className={`block w-full px-4 py-2 text-left font-familiar-pro text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-700 ${currentLocale === 'en-US' ? 'font-bold' : ''}`}
            onClick={(e) => {
              if (currentLocale === 'en-US') {
                e.preventDefault()
                setIsOpen(false)
              } else {
                navigateToLanguage('en-US')
              }
            }}
          >
            English
          </a>
          <a
            href={
              currentLocale !== 'ko-KR' ? pathname.replace(/\/blog\/([^/]+)/, '/blog/$1/kr') : '#'
            }
            className={`block w-full px-4 py-2 text-left font-familiar-pro text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-700 ${currentLocale === 'ko-KR' ? 'font-bold' : ''}`}
            onClick={(e) => {
              if (currentLocale === 'ko-KR') {
                e.preventDefault()
                setIsOpen(false)
              } else {
                navigateToLanguage('ko-KR')
              }
            }}
          >
            한국어
          </a>
        </div>
      </div>
    </div>
  )
}

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
      className={`top-0 z-20 mt-8 box-border flex min-h-[70px] w-full justify-center bg-[#F2F3F4] text-center dark:bg-[#282828] md:mt-0 md:pt-8 lg:static ${isSticky ? 'sticky shadow-md' : ''}`}
    >
      <div className="xl:max-w-8xl mx-auto w-full max-w-6xl px-6 sm:px-12 xl:px-6">
        <div className="relative flex w-full items-end justify-between pb-8">
          {title && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-600 opacity-35"></div>
          )}
          <div className="z-10 flex h-full items-center">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="relative flex items-center">
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="mb-[-5px] flex items-center font-familiar-pro text-[2rem] font-bold sm:mb-0 sm:text-3xl md:text-3xl lg:text-3xl">
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
              <PageTitle className="font-familiar-pro text-2xl lg:text-3xl">{title}</PageTitle>
            </div>
          )}

          <div className="flex h-full items-center">
            <div className="hidden space-x-4 sm:inline-flex sm:items-end lg:space-x-4">
              {headerNavLinks
                .filter((link) => link.href !== '/')
                .map((link) => (
                  <div className="title-effect text-xl" key={link.title}>
                    <Link href={link.href} className="font-familiar-pro font-normal">
                      <span className="title-effect-front">{link.title}</span>
                    </Link>
                  </div>
                ))}
            </div>
            {isBlogPage && (
              <div className="ml-4 flex h-full items-center self-center lg:ml-4">
                <LanguageSwitch />
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
