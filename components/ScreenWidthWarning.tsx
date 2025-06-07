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
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Desktop Optimization Notice
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          The Planner is optimized only for desktop. It might not work as intended on smaller
          screens.
        </p>
        <button
          onClick={handleDismiss}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
        >
          Proceed Anyways
        </button>
      </div>
    </div>
  )
}
