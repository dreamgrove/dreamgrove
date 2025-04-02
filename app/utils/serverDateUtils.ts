import { cookies } from 'next/headers'

export function isAprilFoolsServer(): boolean {
  const cookieStore = cookies()
  const themePreference = cookieStore.get('aprilFoolsTheme')
  return themePreference?.value === 'true'
}
