'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { IoLanguage } from 'react-icons/io5'

const LanguageSwitcher = () => {
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
      document.addEventListener('mousedown', handleClickOutside, {
        passive: true,
      } as AddEventListenerOptions)
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, {
        passive: true,
      } as AddEventListenerOptions)
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
        className="font-familiar-pro inline-flex h-full items-center justify-center self-center rounded-md font-normal transition-all hover:opacity-80"
      >
        <IoLanguage className="text-main text-3xl sm:-translate-y-[0px] sm:text-[1.4rem]" />
      </button>

      <div
        className={`absolute top-[calc(100%+2px)] right-0 z-50 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white shadow-lg transition-opacity dark:border-gray-700 dark:bg-gray-800 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="py-1">
          <a
            href={currentLocale !== 'en-US' ? pathname.replace('/kr/', '/') : '#'}
            className={`font-familiar-pro block w-full px-4 py-2 text-left text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-700 ${currentLocale === 'en-US' ? 'font-bold' : ''}`}
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
            className={`font-familiar-pro block w-full px-4 py-2 text-left text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-700 ${currentLocale === 'ko-KR' ? 'font-bold' : ''}`}
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

export default LanguageSwitcher
