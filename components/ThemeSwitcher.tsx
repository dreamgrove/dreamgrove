'use client'

import { useEffect, useState } from 'react'
import { isAprilFools, setAprilFoolsTheme } from '../app/utils/dateUtils'

export default function ThemeSwitcher() {
  const [isAprilFoolsTheme, setIsAprilFoolsTheme] = useState(false)

  useEffect(() => {
    // Initialize from cookies
    setIsAprilFoolsTheme(isAprilFools())
  }, [])

  const toggleTheme = () => {
    const newValue = !isAprilFoolsTheme
    setIsAprilFoolsTheme(newValue)
    setAprilFoolsTheme(newValue)
    // Force a page reload to apply the theme change
    window.location.reload()
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg bg-gray-200 p-2 text-sm text-gray-500 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      aria-label="Toggle April Fools theme"
    >
      {isAprilFoolsTheme ? 'Normal Theme' : '🎮 April Fools Theme'}
    </button>
  )
}
