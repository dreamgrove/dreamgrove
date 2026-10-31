'use client'

import Icon from '@/components/Icon'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MobileNavPanel = dynamic(() => import('./MobileNavPanel'), { ssr: false })

interface Chapter {
  value: string
  depth: number
  url: string
}

const MobileNav = ({ toc }: { toc?: Chapter[] }) => {
  const [navShow, setNavShow] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const onToggleNav = () => {
    setHasOpened(true)
    setNavShow((status) => {
      if (status) {
        document.documentElement.classList.remove('overflow-hidden')
      } else {
        // Prevent scrolling
        document.documentElement.classList.add('overflow-hidden')
      }
      return !status
    })
  }

  // Reset overflow class when component unmounts
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="h-full w-full align-middle lg:hidden"
      >
        <Icon
          name="menu"
          className="dark:hover:text-primary-400 hover:text-primary-500 mb-[-2px] h-[31px] w-[31px] text-gray-900 dark:text-gray-100"
        />
      </button>
      {/* headlessui's dialog loads on the first tap instead of with every page */}
      {hasOpened && <MobileNavPanel navShow={navShow} onToggleNav={onToggleNav} toc={toc} />}
    </>
  )
}

export default React.memo(MobileNav)
