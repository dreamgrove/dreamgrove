'use server'
import { cookies } from 'next/headers'

export async function setCookie(isAprilFools: boolean) {
  const cookieStore = await cookies()
  cookieStore.set('aprilFoolsTheme', isAprilFools ? 'true' : 'false')
  console.log('cookieStore set', cookieStore.getAll())
}
