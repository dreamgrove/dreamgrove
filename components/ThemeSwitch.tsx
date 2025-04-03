'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const NormalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="group:hover:text-gray-100 h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)

const CuteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="group:hover:text-gray-100 h-6 w-6"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
)

const Blank = () => <svg className="h-6 w-6" />

const NormalButton = ({ setTheme }: { setTheme: () => void }) => (
  <button
    aria-label="Set theme to normal"
    className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
    onClick={setTheme}
  >
    <div className="mr-2">
      <NormalIcon />
    </div>
    Dark Theme
  </button>
)

const CuteButton = ({ setTheme }: { setTheme: () => void }) => (
  <button
    aria-label="Set theme to cute"
    className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
    onClick={setTheme}
  >
    <div className="mr-2">
      <CuteIcon />
    </div>
    Cute Theme
  </button>
)

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const setAprilFoolsTheme = (enabled: boolean) => {
    setTheme(enabled ? 'april-fools' : 'dark')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="mr-5">
      <div className="dark:hover:text-primary-400 hover:text-primary-500">
        {mounted ? (
          theme === 'april-fools' ? (
            <NormalButton setTheme={() => setAprilFoolsTheme(false)} />
          ) : (
            <CuteButton setTheme={() => setAprilFoolsTheme(true)} />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default ThemeSwitch
