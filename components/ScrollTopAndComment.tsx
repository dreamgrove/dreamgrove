'use client'

import Icon from '@/components/Icon'
import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll, {
      passive: true,
    } as AddEventListenerOptions)
    return () =>
      window.removeEventListener('scroll', handleWindowScroll, {
        passive: true,
      } as AddEventListenerOptions)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView()
  }
  return (
    <div className={`fixed right-8 bottom-8 flex flex-col gap-3 ${show ? 'flex' : 'hidden'}`}>
      <button
        aria-label="Scroll To Top"
        onClick={handleScrollTop}
        className="rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      >
        <Icon name="arrowUpBold" className="h-5 w-5" />
      </button>
    </div>
  )
}

export default ScrollTopAndComment
