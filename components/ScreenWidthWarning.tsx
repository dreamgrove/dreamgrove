'use client'

import { useState, useEffect } from 'react'

export default function ScreenWidthWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkScreenWidth = () => {
      const hasBeenDismissed = sessionStorage.getItem('screenWidthWarningDismissed')
      if (window.innerWidth < 1300 && !hasBeenDismissed) {
        setShowWarning(true)
      }
    }

    // Check on mount
    checkScreenWidth()

    // Check on resize
    window.addEventListener('resize', checkScreenWidth)

    return () => window.removeEventListener('resize', checkScreenWidth)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('screenWidthWarningDismissed', 'true')
    setShowWarning(false)
  }

  if (!showWarning) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-sm bg-white p-6 shadow-lg dark:bg-neutral-800">
        <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
          Desktop Optimization Notice
        </h2>
        <p className="mb-6 text-neutral-600 dark:text-neutral-300">
          The Planner is optimized only for desktop. It might not work as intended on smaller
          screens.
        </p>
        <button
          onClick={handleDismiss}
          className="bg-main w-full rounded-xs px-4 py-2 font-medium text-white hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-neutral-800"
        >
          Proceed Anyways
        </button>
      </div>
    </div>
  )
}
