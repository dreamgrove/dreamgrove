'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import { useEffect, useState } from 'react'

const BUTTON =
  'rounded-full bg-gray-200 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'

/**
 * Floating buttons in the bottom right. `editPath` (relative to data/) adds a
 * pencil that opens the page in the CMS editor; it stays visible, while the
 * scroll-to-top arrow only shows once the page is scrolled.
 */
const PageActions = ({ editPath }: { editPath?: string }) => {
  const pathname = usePathname()
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
  if (!editPath && !show) return null
  return (
    <div className="fixed right-8 bottom-8 z-40 flex flex-col gap-3">
      {editPath && (
        <Link
          // `from` sends the editor's back button here instead of /cms
          href={`/cms/edit?path=${encodeURIComponent(editPath)}&from=${encodeURIComponent(pathname)}`}
          aria-label="Edit this page"
          title="Edit this page"
          // Same 36px circle as the arrow, around a smaller glyph
          className={`${BUTTON} p-2.5`}
        >
          <Icon name="edit" className="h-4 w-4" />
        </Link>
      )}
      {show && (
        <button aria-label="Scroll To Top" onClick={handleScrollTop} className={`${BUTTON} p-2`}>
          <Icon name="arrowUpBold" className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default PageActions
