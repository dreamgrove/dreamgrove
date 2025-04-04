'use client'

// Client-side cookie handling
export function isAprilFools(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const themePreference = document.cookie
    .split('; ')
    .find((row) => row.startsWith('aprilFoolsTheme='))
    ?.split('=')[1]

  return themePreference === 'true'
}
