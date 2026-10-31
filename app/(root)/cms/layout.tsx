import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import AdminSessionProvider from '@/components/admin/AdminSessionProvider'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>
}
