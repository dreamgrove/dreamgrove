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

export function setAprilFoolsTheme(value: boolean) {
  // Set cookie with 1 year expiry
  const expiryDate = new Date()
  expiryDate.setFullYear(expiryDate.getFullYear() + 1)
  document.cookie = `aprilFoolsTheme=${value}; expires=${expiryDate.toUTCString()}; path=/`
}
