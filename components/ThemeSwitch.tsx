'use client'

import Icon from '@/components/Icon'
import { useTheme } from 'next-themes'
import { useMounted } from '@/hooks/useMounted'

const NormalIcon = () => <Icon name="sun" className="group:hover:text-gray-100 h-6 w-6" />

const CuteIcon = () => <Icon name="eye" className="group:hover:text-gray-100 h-6 w-6" />

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
  // The theme is only known in the browser
  const mounted = useMounted()

  const setAprilFoolsTheme = (enabled: boolean) => {
    setTheme(enabled ? 'april-fools' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="mr-5">
      <div className="dark:hover:text-primary-400 hover:text-primary-500">
        {theme === 'april-fools' ? (
          <NormalButton setTheme={() => setAprilFoolsTheme(false)} />
        ) : (
          <CuteButton setTheme={() => setAprilFoolsTheme(true)} />
        )}
      </div>
    </div>
  )
}

export default ThemeSwitch
